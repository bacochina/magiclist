export interface GeminiConfig {
  model: string;
  apiKey: string;
  maxTokens: number;
  temperature: number;
  topP: number;
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
  }>;
} 