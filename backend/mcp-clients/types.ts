export type AIProvider = 'anthropic' | 'openai' | 'google' | 'fal';
export type Modality = 'text' | 'image' | 'video';

export interface ModelConfig {
  id: string;
  provider: AIProvider;
  modality: Modality;
  server: string;
}

export interface MCPRequest {
  model: string;
  input: Record<string, unknown>;
  fallbackModels?: string[];
}

export interface MCPResponse<T = unknown> {
  model: string;
  provider: AIProvider;
  output: T;
}
