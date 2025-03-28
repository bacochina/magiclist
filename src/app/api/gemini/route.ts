import { NextRequest, NextResponse } from 'next/server';
import { GeminiService } from './service';

export async function POST(request: NextRequest) {
  try {
    const { tableName, context, pageTitle, pageSubtitle } = await request.json();
    
    const service = GeminiService.getInstance();
    const fields = await service.generateFieldsFromContext(
      tableName,
      context,
      pageTitle,
      pageSubtitle
    );

    return NextResponse.json({ fields });
  } catch (error) {
    console.error('Error in Gemini API route:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar campos a partir do contexto. Usando lógica padrão.' },
      { status: 500 }
    );
  }
} 