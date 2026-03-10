import { corsHeaders } from '../shared/cors.ts';
import { supabaseAdmin } from '../shared/client.ts';
import { routeMCP } from '../../mcp-clients/mcpOrchestrator.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const { campaignId, model = 'claude-3-7-sonnet' } = await req.json();

  const { data: analytics } = await supabaseAdmin
    .from('analytics')
    .select('likes, comments, shares, impressions, engagement_rate, posts!inner(campaign_id)')
    .eq('posts.campaign_id', campaignId)
    .limit(100);

  const response = await routeMCP({
    model,
    fallbackModels: ['gpt-4.1'],
    input: {
      instruction: 'Analyze campaign performance and return optimization suggestions.',
      analytics
    }
  });

  await supabaseAdmin.from('ai_generations').insert({
    campaign_id: campaignId,
    generation_type: 'optimization',
    model: response.model,
    prompt: JSON.stringify({ campaignId }),
    output: response.output
  });

  return new Response(JSON.stringify(response.output), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});
