import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Schema de validação para atualização de banda
const bandaUpdateSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').optional(),
  genero: z.string().optional(),
  descricao: z.string().optional(),
  logo: z.string().optional(),
});

interface Params {
  params: {
    bandaId: string;
  };
}

// Obter uma banda específica
export async function GET(request: Request, { params }: Params) {
  try {
    const { bandaId } = params;

    const banda = await prisma.banda.findUnique({
      where: { id: bandaId },
      include: {
        musicas: true, // Inclui as músicas relacionadas à banda
      },
    });

    if (!banda) {
      return NextResponse.json(
        { error: 'Banda não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(banda);
  } catch (error) {
    console.error('Erro ao buscar banda:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar banda' },
      { status: 500 }
    );
  }
}

// Atualizar uma banda
export async function PUT(request: Request, { params }: Params) {
  try {
    const { bandaId } = params;
    const data = await request.json();

    // Validação dos dados
    const validacao = bandaUpdateSchema.safeParse(data);
    if (!validacao.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', detalhes: validacao.error.format() },
        { status: 400 }
      );
    }

    // Verifica se a banda existe
    const bandaExistente = await prisma.banda.findUnique({
      where: { id: bandaId },
    });

    if (!bandaExistente) {
      return NextResponse.json(
        { error: 'Banda não encontrada' },
        { status: 404 }
      );
    }

    // Atualiza a banda
    const bandaAtualizada = await prisma.banda.update({
      where: { id: bandaId },
      data: validacao.data,
    });

    return NextResponse.json(bandaAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar banda:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar banda' },
      { status: 500 }
    );
  }
}

// Excluir uma banda
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { bandaId } = params;

    // Verifica se a banda existe
    const bandaExistente = await prisma.banda.findUnique({
      where: { id: bandaId },
    });

    if (!bandaExistente) {
      return NextResponse.json(
        { error: 'Banda não encontrada' },
        { status: 404 }
      );
    }

    // Exclui a banda
    await prisma.banda.delete({
      where: { id: bandaId },
    });

    return NextResponse.json(
      { message: 'Banda excluída com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao excluir banda:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir banda' },
      { status: 500 }
    );
  }
} 