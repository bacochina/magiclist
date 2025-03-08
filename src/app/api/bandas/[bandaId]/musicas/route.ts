import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
  params: {
    bandaId: string;
  };
}

// Listar músicas de uma banda específica
export async function GET(request: Request, { params }: Params) {
  try {
    const { bandaId } = params;

    // Verifica se a banda existe
    const banda = await prisma.banda.findUnique({
      where: { id: bandaId },
    });

    if (!banda) {
      return NextResponse.json(
        { error: 'Banda não encontrada' },
        { status: 404 }
      );
    }

    // Busca as músicas da banda
    const musicas = await prisma.musica.findMany({
      where: { bandaId },
      orderBy: {
        nome: 'asc',
      },
    });

    return NextResponse.json(musicas);
  } catch (error) {
    console.error('Erro ao listar músicas da banda:', error);
    return NextResponse.json(
      { error: 'Erro ao listar músicas da banda' },
      { status: 500 }
    );
  }
} 