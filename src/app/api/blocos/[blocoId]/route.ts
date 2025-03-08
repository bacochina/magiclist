import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Schema de validação para atualização de bloco musical
const blocoUpdateSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').optional(),
  descricao: z.string().optional(),
  bandaId: z.string().min(1, 'Banda é obrigatória').optional(),
  musicas: z.array(
    z.object({
      musicaId: z.string().min(1, 'ID da música é obrigatório'),
      ordem: z.number().int().min(0, 'Ordem deve ser um número inteiro não negativo')
    })
  ).optional()
});

interface Params {
  params: {
    blocoId: string;
  };
}

// Obter um bloco específico
export async function GET(request: Request, { params }: Params) {
  try {
    const { blocoId } = params;

    const bloco = await prisma.blocoMusical.findUnique({
      where: { id: blocoId },
      include: {
        banda: true,
        musicas: {
          include: {
            musica: true
          },
          orderBy: {
            ordem: 'asc'
          }
        }
      }
    });

    if (!bloco) {
      return NextResponse.json(
        { error: 'Bloco musical não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(bloco);
  } catch (error) {
    console.error('Erro ao buscar bloco musical:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar bloco musical' },
      { status: 500 }
    );
  }
}

// Atualizar um bloco
export async function PUT(request: Request, { params }: Params) {
  try {
    const { blocoId } = params;
    const data = await request.json();

    // Validação dos dados
    const validacao = blocoUpdateSchema.safeParse(data);
    if (!validacao.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', detalhes: validacao.error.format() },
        { status: 400 }
      );
    }

    // Verifica se o bloco existe
    const blocoExistente = await prisma.blocoMusical.findUnique({
      where: { id: blocoId },
      include: {
        musicas: true
      }
    });

    if (!blocoExistente) {
      return NextResponse.json(
        { error: 'Bloco musical não encontrado' },
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

    // Extrair músicas do payload
    const { musicas, ...blocoData } = validacao.data;

    // Atualiza o bloco em uma transação
    const blocoAtualizado = await prisma.$transaction(async (tx) => {
      // Se músicas foram fornecidas, atualiza a relação
      if (musicas) {
        // Remove todas as músicas existentes
        await tx.blocoMusica.deleteMany({
          where: { blocoId }
        });

        // Adiciona as novas músicas
        for (const musica of musicas) {
          await tx.blocoMusica.create({
            data: {
              blocoId,
              musicaId: musica.musicaId,
              ordem: musica.ordem
            }
          });
        }
      }

      // Atualiza os dados do bloco
      return tx.blocoMusical.update({
        where: { id: blocoId },
        data: blocoData,
        include: {
          banda: true,
          musicas: {
            include: {
              musica: true
            },
            orderBy: {
              ordem: 'asc'
            }
          }
        }
      });
    });

    return NextResponse.json(blocoAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar bloco musical:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar bloco musical' },
      { status: 500 }
    );
  }
}

// Excluir um bloco
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { blocoId } = params;

    // Verifica se o bloco existe
    const blocoExistente = await prisma.blocoMusical.findUnique({
      where: { id: blocoId },
    });

    if (!blocoExistente) {
      return NextResponse.json(
        { error: 'Bloco musical não encontrado' },
        { status: 404 }
      );
    }

    // Exclui o bloco (as músicas relacionadas serão excluídas automaticamente devido ao onDelete: Cascade)
    await prisma.blocoMusical.delete({
      where: { id: blocoId },
    });

    return NextResponse.json(
      { message: 'Bloco musical excluído com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao excluir bloco musical:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir bloco musical' },
      { status: 500 }
    );
  }
} 