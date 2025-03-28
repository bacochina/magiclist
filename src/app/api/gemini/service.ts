import { GeminiClient } from './client';
import { FIELD_GENERATION_PROMPT } from './config';

export class GeminiService {
  private static instance: GeminiService;
  private client: GeminiClient;

  private constructor() {
    this.client = GeminiClient.getInstance();
  }

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  public async generateFieldsFromContext(
    tableName: string,
    context: string,
    pageTitle?: string,
    pageSubtitle?: string
  ): Promise<any> {
    try {
      const prompt = FIELD_GENERATION_PROMPT
        .replace('{tableName}', tableName)
        .replace('{context}', context)
        .replace('{pageTitle}', pageTitle || '')
        .replace('{pageSubtitle}', pageSubtitle || '');

      const response = await this.client.generateCompletion(prompt);
      
      try {
        return JSON.parse(response);
      } catch (error) {
        console.error('Error parsing Gemini response:', error);
        throw new Error('Erro ao processar resposta da API. Formato inválido.');
      }
    } catch (error) {
      console.error('Error generating fields from context:', error);
      throw error;
    }
  }
} 