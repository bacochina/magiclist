import { NextResponse } from 'next/server';

interface Musica {
  id: string;
  nome: string;
  artista: string;
  tom: string;
  bpm?: string;
  dicas?: string[];
}

interface Bloco {
  id: string;
  nome: string;
  descricao?: string;
  musicas: Musica[];
}

interface Repertorio {
  id: string;
  nome: string;
  data: string;
  bandaId: string;
  observacoes?: string;
  blocos: Bloco[];
}

// Simula um banco de dados em memória
export const repertorios: Repertorio[] = [];

export async function GET() {
  try {
    return NextResponse.json({ repertorios });
  } catch (error) {
    console.error('Erro ao listar repertórios:', error);
    return NextResponse.json(
      { error: 'Erro ao listar repertórios' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const novoRepertorio = {
      ...data,
      id: String(Date.now()),
    };

    repertorios.push(novoRepertorio);

    return NextResponse.json(novoRepertorio);
  } catch (error) {
    console.error('Erro ao criar repertório:', error);
    return NextResponse.json(
      { error: 'Erro ao criar repertório' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const index = repertorios.findIndex(r => r.id === data.id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Repertório não encontrado' },
        { status: 404 }
      );
    }

    repertorios[index] = data;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao atualizar repertório:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar repertório' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID não fornecido' },
        { status: 400 }
      );
    }

    const index = repertorios.findIndex(r => r.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Repertório não encontrado' },
        { status: 404 }
      );
    }

    repertorios.splice(index, 1);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir repertório:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir repertório' },
      { status: 500 }
    );
  }
} 