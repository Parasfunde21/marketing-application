import { corsHeaders } from '../shared/cors.ts';
import { supabaseAdmin } from '../shared/client.ts';
import { routeMCP } from '../../mcp-clients/mcpOrchestrator.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const { prompt, campaignId, model = 'kling-v1' } = await req.json();

  const response = await routeMCP<{ videoUrl: string }>({
    model,
    input: { prompt, durationSeconds: 10 }
  });

  const videoBytes = await fetch(response.output.videoUrl).then((res) => res.arrayBuffer());
  const path = `${campaignId}/${crypto.randomUUID()}.mp4`;

  await supabaseAdmin.storage.from('media-assets').upload(path, videoBytes, {
    contentType: 'video/mp4',
    upsert: false
  });

  const { data } = supabaseAdmin.storage.from('media-assets').getPublicUrl(path);

  await supabaseAdmin.from('media').insert({
    campaign_id: campaignId,
    type: 'video',
    storage_path: path,
    public_url: data.publicUrl
  });

  return new Response(JSON.stringify({ url: data.publicUrl }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});
