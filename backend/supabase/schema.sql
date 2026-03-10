-- SolisBoard 2.0 schema
create extension if not exists pgcrypto;
create extension if not exists pg_cron;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  goal text not null,
  target_audience text not null,
  platform text not null check (platform in ('instagram', 'twitter', 'linkedin')),
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  content text not null,
  hashtags text[] not null default '{}',
  call_to_action text,
  media_url text,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'published', 'failed')),
  created_at timestamptz not null default now()
);

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  type text not null check (type in ('image', 'video')),
  storage_path text not null,
  public_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.analytics (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  likes int not null default 0,
  comments int not null default 0,
  shares int not null default 0,
  impressions int not null default 0,
  engagement_rate numeric(8,4) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_generations (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references public.campaigns(id) on delete set null,
  generation_type text not null check (generation_type in ('text', 'image', 'video', 'optimization')),
  model text not null,
  prompt text not null,
  output jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.scheduled_posts (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  scheduled_time timestamptz not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'processing', 'published', 'failed')),
  created_at timestamptz not null default now()
);

create index if not exists idx_campaigns_user_id on public.campaigns(user_id);
create index if not exists idx_posts_campaign_id on public.posts(campaign_id);
create index if not exists idx_analytics_post_id on public.analytics(post_id);
create index if not exists idx_scheduled_posts_time_status on public.scheduled_posts(scheduled_time, status);

alter table public.users enable row level security;
alter table public.campaigns enable row level security;
alter table public.posts enable row level security;
alter table public.media enable row level security;
alter table public.analytics enable row level security;
alter table public.ai_generations enable row level security;
alter table public.scheduled_posts enable row level security;

create policy "Users can read own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can manage own campaigns" on public.campaigns
  for all using (auth.uid() = user_id);

create policy "Users can manage own posts" on public.posts
  for all using (
    exists (select 1 from public.campaigns c where c.id = campaign_id and c.user_id = auth.uid())
  );

create policy "Users can manage own media" on public.media
  for all using (
    exists (select 1 from public.campaigns c where c.id = campaign_id and c.user_id = auth.uid())
  );

create policy "Users can read own analytics" on public.analytics
  for select using (
    exists (
      select 1 from public.posts p
      join public.campaigns c on c.id = p.campaign_id
      where p.id = post_id and c.user_id = auth.uid()
    )
  );

create policy "Users can read own generations" on public.ai_generations
  for select using (
    campaign_id is null or exists (select 1 from public.campaigns c where c.id = campaign_id and c.user_id = auth.uid())
  );

create policy "Users can manage own schedules" on public.scheduled_posts
  for all using (
    exists (
      select 1 from public.posts p
      join public.campaigns c on c.id = p.campaign_id
      where p.id = post_id and c.user_id = auth.uid()
    )
  );

-- Cron job every minute to trigger publish pipeline through an edge function webhook proxy.
select cron.schedule(
  'publish-scheduled-posts',
  '* * * * *',
  $$
    select net.http_post(
      url := current_setting('app.settings.publish_function_url', true),
      headers := jsonb_build_object('Content-Type', 'application/json'),
      body := jsonb_build_object('triggered_at', now())
    );
  $$
)
on conflict do nothing;
