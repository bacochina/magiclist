export interface OllamaRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
    num_predict?: number;
  };
}

export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface OllamaConfig {
  baseUrl: string;
  model: string;
  temperature: number;
  topP: number;
  topK: number;
  maxTokens: number;
}

export interface FieldGenerationResponse {
  fields: {
    name: string;
    type: string;
    description: string;
    required: boolean;
    isPrimaryKey: boolean;
    isForeignKey: boolean;
    references?: {
      table: string;
      field: string;
    }
  }[];
} 