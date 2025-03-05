import { NextResponse } from 'next/server';
import { blocos as blocosData } from '@/app/api/blocos/route';

interface Musica {
  id: string;
  nome: string;
  artista: string;
  tom: string;
  bpm?: string;
}

interface Bloco {
  id: string;
  bandaId: string;
  nome: string;
  descricao?: string;
  musicas: Musica[];
}

export async function GET(
  request: Request,
  { params }: { params: { bandaId: string } }
) {
  try {
    // Filtrar os blocos da banda diretamente dos dados importados
    const blocosDaBanda = blocosData.filter((bloco: Bloco) => bloco.bandaId === params.bandaId);

    return NextResponse.json({ blocos: blocosDaBanda });
  } catch (error) {
    console.error('Erro ao listar blocos da banda:', error);
    return NextResponse.json(
      { error: 'Erro ao listar blocos da banda' },
      { status: 500 }
    );
  }
} 