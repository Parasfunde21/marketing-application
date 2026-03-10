import { corsHeaders } from '../shared/cors.ts';
import { supabaseAdmin } from '../shared/client.ts';
import { routeMCP } from '../../mcp-clients/mcpOrchestrator.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const payload = await req.json();
  const { productName, goal, targetAudience, platform, model = 'claude-3-7-sonnet', campaignId } = payload;

  const response = await routeMCP({
    model,
    fallbackModels: ['gpt-4.1', 'gemini-1.5-pro'],
    input: {
      instruction: 'Generate social post copy for campaign.',
      productName,
      goal,
      targetAudience,
      platform
    }
  });

  await supabaseAdmin.from('ai_generations').insert({
    campaign_id: campaignId,
    generation_type: 'text',
    model: response.model,
    prompt: JSON.stringify(payload),
    output: response.output
  });

  return new Response(JSON.stringify(response.output), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
});
