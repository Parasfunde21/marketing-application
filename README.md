# SolisBoard 2.0

SolisBoard 2.0 is an AI-powered social media marketing SaaS platform built with a React + Tailwind frontend and Supabase backend services. The platform automates campaign content generation, media generation, scheduling, analytics, and campaign optimization across Instagram, Twitter/X, and LinkedIn.

## High-level architecture

- **Frontend (Vercel):** React app with Tailwind UI, dashboard pages, campaign workflows, charts, and settings.
- **Backend (Supabase Cloud):** PostgreSQL, Auth, Storage, Realtime, Edge Functions, and `pg_cron` scheduling.
- **AI layer (MCP):** unified model orchestration with dynamic model routing + fallback.

## Project structure

```txt
frontend/
  components/
  hooks/
  lib/
  pages/
  styles/

backend/
  supabase/
  edge-functions/
  mcp-clients/
```

## Module guide

### Frontend
- `pages/`: route-level screens (Dashboard, Campaigns, Generator, Media, Scheduler, Analytics, Settings).
- `components/`: reusable UI blocks and domain widgets.
- `hooks/`: reusable data hooks for auth and realtime analytics.
- `lib/`: API client wrappers and Supabase browser client.

### Backend
- `supabase/schema.sql`: PostgreSQL tables, indexes, RLS policies, and cron wiring.
- `edge-functions/*`: serverless API endpoints for AI generation, scheduling, and optimization.
- `mcp-clients/*`: model-agnostic orchestration for text/image/video providers through MCP.

## Supabase setup

1. Create a Supabase project.
2. Apply SQL:
   ```bash
   psql "$SUPABASE_DB_URL" -f backend/supabase/schema.sql
   ```
3. Configure project secrets for edge functions:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `MCP_GATEWAY_URL`
   - `MCP_API_KEY`
4. Deploy functions:
   ```bash
   supabase functions deploy generatePost
   supabase functions deploy generateImage
   supabase functions deploy generateVideo
   supabase functions deploy schedulePost
   supabase functions deploy optimizeCampaign
   ```

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Environment variables (`frontend/.env`):

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_API_BASE_URL=...
```

## Example API flows

### 1) Generate campaign content
```http
POST /functions/v1/generatePost
Content-Type: application/json
Authorization: Bearer <supabase_jwt>

{
  "productName": "SolarBottle",
  "goal": "Drive pre-orders",
  "targetAudience": "Eco-conscious urban professionals",
  "platform": "instagram",
  "model": "claude-3-7-sonnet"
}
```

### 2) Generate image
```http
POST /functions/v1/generateImage
{
  "prompt": "Premium product shot of SolarBottle in a modern city apartment",
  "campaignId": "<uuid>",
  "model": "gemini-image-1"
}
```

### 3) Schedule post
```http
POST /functions/v1/schedulePost
{
  "postId": "<uuid>",
  "scheduledTime": "2026-06-01T14:30:00Z"
}
```

## Scaling notes

- Leverages Postgres indexes and RLS for multitenant isolation.
- Uses stateless edge functions and MCP gateway for horizontal scaling.
- Realtime channels stream analytics with minimal polling overhead.
- Queue-like scheduling is backed by `pg_cron` + idempotent publish flow.
