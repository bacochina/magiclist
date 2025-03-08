import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

// Inicializa o cliente Prisma
const prisma = new PrismaClient();

// Schema de validação para atualização de bloco no repertório
const blocoUpdateSchema = z.object({
  ordem: z.number().int().min(0, 'Ordem deve ser um número inteiro não negativo')
});

interface Params {
  params: {
    repertorioId: string;
    blocoId: string;
  };
}

// Obter um bloco específico de um repertório
export async function GET(request: Request, { params }: Params) {
  try {
    const { repertorioId, blocoId } = params;

    // Busca o bloco específico no repertório
    const repertorioBloco = await prisma.repertorioBloco.findUnique({
      where: {
        repertorioId_blocoId: {
          repertorioId,
          blocoId
        }
      },
      include: {
        bloco: {
          include: {
            musicas: {
              include: {
                musica: true
              },
              orderBy: {
                ordem: 'asc'
              }
            }
          }
        }
      }
    });

    if (!repertorioBloco) {
      return NextResponse.json(
        { error: 'Bloco não encontrado neste repertório' },
        { status: 404 }
      );
    }

    return NextResponse.json(repertorioBloco);
  } catch (error) {
    console.error('Erro ao buscar bloco do repertório:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar bloco do repertório' },
      { status: 500 }
    );
  }
}

// Atualizar um bloco específico em um repertório (apenas ordem)
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { repertorioId, blocoId } = params;
    const data = await request.json();

    // Validação dos dados
    const validacao = blocoUpdateSchema.safeParse(data);
    if (!validacao.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', detalhes: validacao.error.format() },
        { status: 400 }
      );
    }

    // Verifica se o bloco existe no repertório
    const repertorioBloco = await prisma.repertorioBloco.findUnique({
      where: {
        repertorioId_blocoId: {
          repertorioId,
          blocoId
        }
      }
    });

    if (!repertorioBloco) {
      return NextResponse.json(
        { error: 'Bloco não encontrado neste repertório' },
        { status: 404 }
      );
    }

    // Atualiza a ordem do bloco no repertório
    const blocoAtualizado = await prisma.repertorioBloco.update({
      where: {
        repertorioId_blocoId: {
          repertorioId,
          blocoId
        }
      },
      data: {
        ordem: validacao.data.ordem
      },
      include: {
        bloco: true
      }
    });

    return NextResponse.json(blocoAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar bloco no repertório:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar bloco no repertório' },
      { status: 500 }
    );
  }
}

// Remover um bloco específico de um repertório
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { repertorioId, blocoId } = params;

    // Verifica se o bloco existe no repertório
    const repertorioBloco = await prisma.repertorioBloco.findUnique({
      where: {
        repertorioId_blocoId: {
          repertorioId,
          blocoId
        }
      }
    });

    if (!repertorioBloco) {
      return NextResponse.json(
        { error: 'Bloco não encontrado neste repertório' },
        { status: 404 }
      );
    }

    // Remove o bloco do repertório
    await prisma.repertorioBloco.delete({
      where: {
        repertorioId_blocoId: {
          repertorioId,
          blocoId
        }
      }
    });

    return NextResponse.json(
      { message: 'Bloco removido do repertório com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao remover bloco do repertório:', error);
    return NextResponse.json(
      { error: 'Erro ao remover bloco do repertório' },
      { status: 500 }
    );
  }
} 