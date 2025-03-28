import { NextRequest, NextResponse } from 'next/server';
import { OllamaService } from './service';

export async function POST(request: NextRequest) {
  try {
    const { tableName, context, pageTitle, pageSubtitle } = await request.json();
    
    console.log('Ollama API route called with:', { tableName, context });
    
    const service = OllamaService.getInstance();
    const result = await service.generateFieldsFromContext(
      tableName,
      context,
      pageTitle,
      pageSubtitle
    );

    console.log('Campos gerados com sucesso para:', tableName);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in Ollama API route:', error);
    // Fornecer uma resposta de fallback válida em vez de apenas retornar erro
    return NextResponse.json({
      fields: [
        {
          name: 'id',
          type: 'uuid',
          description: 'Identificador único do registro',
          required: true,
          isPrimaryKey: true,
          isForeignKey: false
        },
        {
          name: 'nome',
          type: 'varchar(100)',
          description: 'Nome descritivo',
          required: true,
          isPrimaryKey: false,
          isForeignKey: false
        },
        {
          name: 'created_at',
          type: 'timestamp with time zone',
          description: 'Data e hora de criação do registro',
          required: true,
          isPrimaryKey: false,
          isForeignKey: false
        },
        {
          name: 'updated_at',
          type: 'timestamp with time zone',
          description: 'Data e hora da última atualização do registro',
          required: true,
          isPrimaryKey: false,
          isForeignKey: false
        }
      ]
    });
  }
} 