import { ModelConfig } from './types.ts';

export const MODEL_REGISTRY: Record<string, ModelConfig> = {
  'claude-3-7-sonnet': { id: 'claude-3-7-sonnet', provider: 'anthropic', modality: 'text', server: 'claude-mcp' },
  'gpt-4.1': { id: 'gpt-4.1', provider: 'openai', modality: 'text', server: 'gpt-mcp' },
  'gemini-1.5-pro': { id: 'gemini-1.5-pro', provider: 'google', modality: 'text', server: 'gemini-mcp' },
  'gemini-image-1': { id: 'gemini-image-1', provider: 'google', modality: 'image', server: 'gemini-mcp' },
  'kling-v1': { id: 'kling-v1', provider: 'fal', modality: 'video', server: 'fal-kling-mcp' }
};
