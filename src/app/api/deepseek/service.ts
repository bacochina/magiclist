import { DeepseekClient } from './client';
import { FIELD_GENERATION_PROMPT, SPECIFIC_FIELDS_PROMPT } from './config';
import { Field, FieldGenerationResponse } from './types';

export class DeepseekService {
  private static instance: DeepseekService;
  private client: DeepseekClient;

  private constructor() {
    this.client = DeepseekClient.getInstance();
  }

  public static getInstance(): DeepseekService {
    if (!DeepseekService.instance) {
      DeepseekService.instance = new DeepseekService();
    }
    return DeepseekService.instance;
  }

  public async generateFieldsFromContext(
    pageTitle: string,
    pageSubtitle: string,
    tableName: string,
    context: string
  ): Promise<Field[]> {
    try {
      const prompt = FIELD_GENERATION_PROMPT
        .replace('{pageTitle}', pageTitle)
        .replace('{pageSubtitle}', pageSubtitle)
        .replace('{tableName}', tableName)
        .replace('{context}', context);

      const completion = await this.client.generateCompletion(prompt);
      const response = JSON.parse(completion) as FieldGenerationResponse;
      return response.fields;
    } catch (error) {
      console.error('Error generating fields from context:', error);
      throw error;
    }
  }

  public async generateSpecificFields(
    pageTitle: string,
    pageSubtitle: string,
    tableName: string,
    prompt: string
  ): Promise<Field[]> {
    try {
      const formattedPrompt = SPECIFIC_FIELDS_PROMPT
        .replace('{pageTitle}', pageTitle)
        .replace('{pageSubtitle}', pageSubtitle)
        .replace('{tableName}', tableName)
        .replace('{prompt}', prompt);

      const completion = await this.client.generateCompletion(formattedPrompt);
      const response = JSON.parse(completion) as FieldGenerationResponse;
      return response.fields;
    } catch (error) {
      console.error('Error generating specific fields:', error);
      throw error;
    }
  }
} 