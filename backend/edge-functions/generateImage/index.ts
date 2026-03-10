import { corsHeaders } from '../shared/cors.ts';
import { supabaseAdmin } from '../shared/client.ts';
import { routeMCP } from '../../mcp-clients/mcpOrchestrator.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const { prompt, campaignId, model = 'gemini-image-1' } = await req.json();

  const response = await routeMCP<{ bytesBase64: string; mimeType: string }>({
    model,
    input: { prompt }
  });

  const path = `${campaignId}/${crypto.randomUUID()}.png`;
  const buffer = Uint8Array.from(atob(response.output.bytesBase64), (c) => c.charCodeAt(0));

  await supabaseAdmin.storage.from('media-assets').upload(path, buffer, {
    contentType: response.output.mimeType || 'image/png',
    upsert: false
  });

  const { data } = supabaseAdmin.storage.from('media-assets').getPublicUrl(path);

  await supabaseAdmin.from('media').insert({
    campaign_id: campaignId,
    type: 'image',
    storage_path: path,
    public_url: data.publicUrl
  });

  return new Response(JSON.stringify({ url: data.publicUrl }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});
