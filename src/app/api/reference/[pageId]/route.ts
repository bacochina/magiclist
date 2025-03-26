import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { pageId: string } }
) {
  try {
    const { pageId } = params;

    // TODO: Implementar a lógica de busca no banco de dados
    // Por enquanto, retornando dados mockados
    const mockData = {
      styles: [
        { name: 'Estilo 1', description: 'Descrição do estilo 1' },
        { name: 'Estilo 2', description: 'Descrição do estilo 2' },
      ],
      database: [
        { table: 'Tabela 1', fields: ['campo1', 'campo2'] },
        { table: 'Tabela 2', fields: ['campo1', 'campo2'] },
      ],
      features: [
        { name: 'Funcionalidade 1', description: 'Descrição da funcionalidade 1' },
        { name: 'Funcionalidade 2', description: 'Descrição da funcionalidade 2' },
      ],
    };

    // Simular um pequeno delay para mostrar o loading
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Erro ao buscar dados de referência:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 