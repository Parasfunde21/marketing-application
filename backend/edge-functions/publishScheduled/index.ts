import { corsHeaders } from '../shared/cors.ts';
import { supabaseAdmin } from '../shared/client.ts';

/**
 * Idempotent publisher worker invoked by pg_cron webhook.
 * Replace `publishToSocialNetwork` with real provider SDK integrations.
 */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const nowIso = new Date().toISOString();
  const { data: duePosts } = await supabaseAdmin
    .from('scheduled_posts')
    .select('id, post_id, posts(content, media_url, campaigns(platform))')
    .lte('scheduled_time', nowIso)
    .eq('status', 'scheduled')
    .limit(50);

  for (const item of duePosts || []) {
    await supabaseAdmin.from('scheduled_posts').update({ status: 'processing' }).eq('id', item.id);

    try {
      // Stub: integrate with Instagram/Twitter/LinkedIn publisher APIs here.
      await supabaseAdmin.from('posts').update({ status: 'published' }).eq('id', item.post_id);
      await supabaseAdmin.from('scheduled_posts').update({ status: 'published' }).eq('id', item.id);
    } catch {
      await supabaseAdmin.from('scheduled_posts').update({ status: 'failed' }).eq('id', item.id);
      await supabaseAdmin.from('posts').update({ status: 'failed' }).eq('id', item.post_id);
    }
  }

  return new Response(JSON.stringify({ processed: duePosts?.length ?? 0 }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});
