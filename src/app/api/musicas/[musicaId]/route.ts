import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Schema de validação para atualização de música
const musicaUpdateSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').optional(),
  artista: z.string().min(1, 'Artista é obrigatório').optional(),
  tom: z.string().min(1, 'Tom é obrigatório').optional(),
  bpm: z.number().optional(),
  bandaId: z.string().min(1, 'Banda é obrigatória').optional(),
  observacoes: z.string().optional(),
});

interface Params {
  params: {
    musicaId: string;
  };
}

// Obter uma música específica
export async function GET(request: Request, { params }: Params) {
  try {
    const { musicaId } = params;

    const musica = await prisma.musica.findUnique({
      where: { id: musicaId },
      include: {
        banda: true,
      },
    });

    if (!musica) {
      return NextResponse.json(
        { error: 'Música não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(musica);
  } catch (error) {
    console.error('Erro ao buscar música:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar música' },
      { status: 500 }
    );
  }
}

// Atualizar uma música
export async function PUT(request: Request, { params }: Params) {
  try {
    const { musicaId } = params;
    const data = await request.json();

    // Validação dos dados
    const validacao = musicaUpdateSchema.safeParse(data);
    if (!validacao.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', detalhes: validacao.error.format() },
        { status: 400 }
      );
    }

    // Verifica se a música existe
    const musicaExistente = await prisma.musica.findUnique({
      where: { id: musicaId },
    });

    if (!musicaExistente) {
      return NextResponse.json(
        { error: 'Música não encontrada' },
        { status: 404 }
      );
    }

    // Se bandaId foi fornecido, verifica se a banda existe
    if (validacao.data.bandaId) {
      const banda = await prisma.banda.findUnique({
        where: { id: validacao.data.bandaId },
      });
      
      if (!banda) {
        return NextResponse.json(
          { error: 'Banda não encontrada' },
          { status: 404 }
        );
      }
    }

    // Atualiza a música
    const musicaAtualizada = await prisma.musica.update({
      where: { id: musicaId },
      data: validacao.data,
      include: {
        banda: true,
      },
    });

    return NextResponse.json(musicaAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar música:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar música' },
      { status: 500 }
    );
  }
}

// Excluir uma música
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { musicaId } = params;

    // Verifica se a música existe
    const musicaExistente = await prisma.musica.findUnique({
      where: { id: musicaId },
    });

    if (!musicaExistente) {
      return NextResponse.json(
        { error: 'Música não encontrada' },
        { status: 404 }
      );
    }

    // Exclui a música
    await prisma.musica.delete({
      where: { id: musicaId },
    });

    return NextResponse.json(
      { message: 'Música excluída com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao excluir música:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir música' },
      { status: 500 }
    );
  }
} 