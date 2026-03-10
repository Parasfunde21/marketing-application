import { MODEL_REGISTRY } from './models.ts';
import { MCPRequest, MCPResponse } from './types.ts';

const gatewayUrl = Deno.env.get('MCP_GATEWAY_URL') || '';
const mcpApiKey = Deno.env.get('MCP_API_KEY') || '';

async function callMCP(modelId: string, input: Record<string, unknown>) {
  const model = MODEL_REGISTRY[modelId];
  if (!model) throw new Error(`Unsupported model: ${modelId}`);

  const response = await fetch(`${gatewayUrl}/invoke`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${mcpApiKey}`
    },
    body: JSON.stringify({ server: model.server, model: model.id, input })
  });

  if (!response.ok) {
    throw new Error(`MCP call failed: ${response.status}`);
  }

  return response.json();
}

export async function routeMCP<T = unknown>(request: MCPRequest): Promise<MCPResponse<T>> {
  const modelChain = [request.model, ...(request.fallbackModels || [])];
  const errors: string[] = [];

  for (const model of modelChain) {
    try {
      const output = await callMCP(model, request.input);
      return {
        model,
        provider: MODEL_REGISTRY[model].provider,
        output
      };
    } catch (error) {
      errors.push(`${model}: ${(error as Error).message}`);
    }
  }

  throw new Error(`All model invocations failed. ${errors.join(' | ')}`);
}
