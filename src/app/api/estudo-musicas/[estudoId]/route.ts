import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';

// Schema de validação para atualização de estudo de música
const estudoMusicaUpdateSchema = z.object({
  status: z.enum(['A Aprender', 'Aprendendo', 'Dominada']).optional(),
  notas: z.string().optional(),
});

interface Params {
  params: {
    estudoId: string;
  };
}

// Obter um estudo específico
export async function GET(request: Request, { params }: Params) {
  try {
    const { estudoId } = params;

    const estudo = await prisma.estudoMusica.findUnique({
      where: { id: estudoId },
      include: {
        musica: {
          include: {
            banda: true
          }
        }
      }
    });

    if (!estudo) {
      return NextResponse.json(
        { error: 'Estudo não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(estudo);
  } catch (error) {
    console.error('Erro ao buscar estudo:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar estudo' },
      { status: 500 }
    );
  }
}

// Atualizar um estudo
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { estudoId } = params;
    const data = await request.json();

    // Validação dos dados
    const validacao = estudoMusicaUpdateSchema.safeParse(data);
    if (!validacao.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', detalhes: validacao.error.format() },
        { status: 400 }
      );
    }

    // Verifica se o estudo existe
    const estudoExistente = await prisma.estudoMusica.findUnique({
      where: { id: estudoId }
    });

    if (!estudoExistente) {
      return NextResponse.json(
        { error: 'Estudo não encontrado' },
        { status: 404 }
      );
    }

    // Atualiza o estudo
    const estudoAtualizado = await prisma.estudoMusica.update({
      where: { id: estudoId },
      data: validacao.data,
      include: {
        musica: {
          include: {
            banda: true
          }
        }
      }
    });

    return NextResponse.json(estudoAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar estudo:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar estudo' },
      { status: 500 }
    );
  }
}

// Excluir um estudo
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { estudoId } = params;

    // Verifica se o estudo existe
    const estudoExistente = await prisma.estudoMusica.findUnique({
      where: { id: estudoId }
    });

    if (!estudoExistente) {
      return NextResponse.json(
        { error: 'Estudo não encontrado' },
        { status: 404 }
      );
    }

    // Exclui o estudo
    await prisma.estudoMusica.delete({
      where: { id: estudoId }
    });

    return NextResponse.json(
      { message: 'Estudo excluído com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao excluir estudo:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir estudo' },
      { status: 500 }
    );
  }
} 