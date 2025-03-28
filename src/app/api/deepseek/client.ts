import { config } from './config';
import { DeepseekResponse } from './types';

export class DeepseekClient {
  private static instance: DeepseekClient;

  private constructor() {}

  public static getInstance(): DeepseekClient {
    if (!DeepseekClient.instance) {
      DeepseekClient.instance = new DeepseekClient();
    }
    return DeepseekClient.instance;
  }

  public async generateCompletion(prompt: string): Promise<string> {
    try {
      const response = await fetch(config.apiUrl + '/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            { role: "user", content: prompt }
          ],
          temperature: config.temperature,
          max_tokens: config.maxTokens,
          top_p: config.topP,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json() as DeepseekResponse;
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling Claude API:', error);
      throw error;
    }
  }
} 