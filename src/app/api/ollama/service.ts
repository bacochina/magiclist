import { OllamaClient } from './client';
import { FIELD_GENERATION_PROMPT } from './config';
import { FieldGenerationResponse } from './types';

export class OllamaService {
  private static instance: OllamaService;
  private client: OllamaClient;

  private constructor() {
    this.client = OllamaClient.getInstance();
  }

  public static getInstance(): OllamaService {
    if (!OllamaService.instance) {
      OllamaService.instance = new OllamaService();
    }
    return OllamaService.instance;
  }

  private getDefaultFieldsForTable(tableName: string): FieldGenerationResponse {
    // Campos específicos para tabelas comuns
    const defaultFieldsByTable: Record<string, FieldGenerationResponse> = {
      shows: {
        fields: [
          {
            name: "id",
            type: "uuid",
            description: "Identificador único do show",
            required: true,
            isPrimaryKey: true,
            isForeignKey: false
          },
          {
            name: "banda_id",
            type: "uuid",
            description: "Referência à banda que realizará o show",
            required: true,
            isPrimaryKey: false,
            isForeignKey: true,
            references: {
              table: "bandas",
              field: "id"
            }
          },
          {
            name: "nome",
            type: "varchar(100)",
            description: "Nome ou título do show",
            required: true,
            isPrimaryKey: false,
            isForeignKey: false
          },
          {
            name: "data",
            type: "timestamp with time zone",
            description: "Data e hora do show",
            required: true,
            isPrimaryKey: false,
            isForeignKey: false
          },
          {
            name: "local",
            type: "varchar(200)",
            description: "Local onde o show será realizado",
            required: true,
            isPrimaryKey: false,
            isForeignKey: false
          },
          {
            name: "descricao",
            type: "text",
            description: "Descrição detalhada do show",
            required: false,
            isPrimaryKey: false,
            isForeignKey: false
          },
          {
            name: "status",
            type: "varchar(20)",
            description: "Status do show (confirmado, cancelado, etc.)",
            required: true,
            isPrimaryKey: false,
            isForeignKey: false
          },
          {
            name: "capacidade",
            type: "integer",
            description: "Capacidade máxima de público",
            required: false,
            isPrimaryKey: false,
            isForeignKey: false
          },
          {
            name: "created_at",
            type: "timestamp with time zone",
            description: "Data e hora de criação do registro",
            required: true,
            isPrimaryKey: false,
            isForeignKey: false
          },
          {
            name: "updated_at",
            type: "timestamp with time zone",
            description: "Data e hora da última atualização do registro",
            required: true,
            isPrimaryKey: false,
            isForeignKey: false
          }
        ]
      },
      bandas: {
        fields: [
          {
            name: "id",
            type: "uuid",
            description: "Identificador único da banda",
            required: true,
            isPrimaryKey: true,
            isForeignKey: false
          },
          {
            name: "nome",
            type: "varchar(100)",
            description: "Nome da banda",
            required: true,
            isPrimaryKey: false,
            isForeignKey: false
          },
          {
            name: "genero",
            type: "varchar(50)",
            description: "Gênero musical principal da banda",
            required: true,
            isPrimaryKey: false,
            isForeignKey: false
          },
          {
            name: "ano_formacao",
            type: "integer",
            description: "Ano de formação da banda",
            required: false,
            isPrimaryKey: false,
            isForeignKey: false
          },
          {
            name: "descricao",
            type: "text",
            description: "Biografia ou descrição da banda",
            required: false,
            isPrimaryKey: false,
            isForeignKey: false
          },
          {
            name: "logo_url",
            type: "varchar(255)",
            description: "URL da imagem do logo da banda",
            required: false,
            isPrimaryKey: false,
            isForeignKey: false
          },
          {
            name: "created_at",
            type: "timestamp with time zone",
            description: "Data e hora de criação do registro",
            required: true,
            isPrimaryKey: false,
            isForeignKey: false
          },
          {
            name: "updated_at",
            type: "timestamp with time zone",
            description: "Data e hora da última atualização do registro",
            required: true,
            isPrimaryKey: false,
            isForeignKey: false
          }
        ]
      }
    };

    // Se for uma tabela conhecida, retorna os campos predefinidos
    if (tableName && defaultFieldsByTable[tableName.toLowerCase()]) {
      return defaultFieldsByTable[tableName.toLowerCase()];
    }

    // Campos padrão para qualquer tabela
    return {
      fields: [
        {
          name: "id",
          type: "uuid",
          description: "Identificador único do registro",
          required: true,
          isPrimaryKey: true,
          isForeignKey: false
        },
        {
          name: "nome",
          type: "varchar(100)",
          description: "Nome descritivo",
          required: true,
          isPrimaryKey: false,
          isForeignKey: false
        },
        {
          name: "descricao",
          type: "text",
          description: "Descrição detalhada",
          required: false,
          isPrimaryKey: false,
          isForeignKey: false
        },
        {
          name: "ativo",
          type: "boolean",
          description: "Estado de ativação",
          required: true,
          isPrimaryKey: false,
          isForeignKey: false
        },
        {
          name: "created_at",
          type: "timestamp with time zone",
          description: "Data e hora de criação do registro",
          required: true,
          isPrimaryKey: false,
          isForeignKey: false
        },
        {
          name: "updated_at",
          type: "timestamp with time zone",
          description: "Data e hora da última atualização do registro",
          required: true,
          isPrimaryKey: false,
          isForeignKey: false
        }
      ]
    };
  }

  public async generateFieldsFromContext(
    tableName: string,
    context: string,
    pageTitle?: string,
    pageSubtitle?: string
  ): Promise<FieldGenerationResponse> {
    try {
      // Primeira estratégia: Tente obter campos pré-definidos baseados na tabela atual
      if (tableName) {
        console.log('Usando campos pré-definidos para a tabela:', tableName);
        return this.getDefaultFieldsForTable(tableName);
      }

      // Segunda estratégia: Tentar usar o Ollama (pular temporariamente devido aos erros)
      /*
      const prompt = FIELD_GENERATION_PROMPT
        .replace('{tableName}', tableName)
        .replace('{context}', context)
        .replace('{pageTitle}', pageTitle || '')
        .replace('{pageSubtitle}', pageSubtitle || '');

      console.log('Generating fields with Ollama for:', tableName);
      const response = await this.client.generateCompletion(prompt);
      
      try {
        // Extrair apenas a parte JSON da resposta
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('Não foi possível extrair JSON da resposta');
        }
        
        const jsonStr = jsonMatch[0];
        console.log('Extracted JSON from Ollama response:', jsonStr);
        
        return JSON.parse(jsonStr) as FieldGenerationResponse;
      } catch (error) {
        console.error('Error parsing Ollama response:', error);
        console.error('Raw response:', response);
        
        // Se a análise falhar, usar a estratégia de fallback
        return this.getDefaultFieldsForTable(tableName);
      }
      */
    } catch (error) {
      console.error('Error generating fields from context with Ollama:', error);
      // Estratégia de fallback
      return this.getDefaultFieldsForTable(tableName);
    }
    
    // Sempre tenha uma estratégia de fallback
    return this.getDefaultFieldsForTable(tableName);
  }
} 