import { config } from './config';
import { OllamaRequest, OllamaResponse } from './types';

export class OllamaClient {
  private static instance: OllamaClient;

  private constructor() {}

  public static getInstance(): OllamaClient {
    if (!OllamaClient.instance) {
      OllamaClient.instance = new OllamaClient();
    }
    return OllamaClient.instance;
  }

  public async generateCompletion(prompt: string): Promise<string> {
    try {
      const request: OllamaRequest = {
        model: config.model,
        prompt: prompt,
        options: {
          temperature: config.temperature,
          top_p: config.topP,
          top_k: config.topK,
          num_predict: config.maxTokens
        }
      };

      console.log('Sending request to Ollama API:', `${config.baseUrl}/generate`);
      
      const response = await fetch(`${config.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Ollama API Error:', errorData);
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json() as OllamaResponse;
      
      if (!data.response) {
        throw new Error('No response generated');
      }
      
      console.log('Received response from Ollama');
      return data.response;
    } catch (error) {
      console.error('Error calling Ollama API:', error);
      throw error;
    }
  }
} 