import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import prisma from '@/lib/prisma';

// Schema de validação para atualização de repertório
const repertorioUpdateSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').optional(),
  data: z.string().or(z.date()).transform(val => new Date(val)).optional(),
  observacoes: z.string().optional(),
  bandaId: z.string().min(1, 'Banda é obrigatória').optional(),
  blocos: z.array(
    z.object({
      blocoId: z.string().min(1, 'ID do bloco é obrigatório'),
      ordem: z.number().int().min(0, 'Ordem deve ser um número inteiro não negativo')
    })
  ).optional()
});

interface Params {
  params: {
    repertorioId: string;
  };
}

// Obter um repertório específico
export async function GET(request: Request, { params }: Params) {
  try {
    const { repertorioId } = params;

    const repertorio = await prisma.repertorio.findUnique({
      where: { id: repertorioId },
      include: {
        banda: true,
        blocos: {
          include: {
            bloco: {
              include: {
                musicas: {
                  include: {
                    musica: true
                  }
                }
              }
            }
          },
          orderBy: {
            ordem: 'asc'
          }
        }
      }
    });

    if (!repertorio) {
      return NextResponse.json(
        { error: 'Repertório não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(repertorio);
  } catch (error) {
    console.error('Erro ao buscar repertório:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar repertório' },
      { status: 500 }
    );
  }
}

// Atualizar um repertório
export async function PUT(request: Request, { params }: Params) {
  try {
    const { repertorioId } = params;
    const data = await request.json();

    // Validação dos dados
    const validacao = repertorioUpdateSchema.safeParse(data);
    if (!validacao.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', detalhes: validacao.error.format() },
        { status: 400 }
      );
    }

    // Verifica se o repertório existe
    const repertorioExistente = await prisma.repertorio.findUnique({
      where: { id: repertorioId },
      include: {
        blocos: true
      }
    });

    if (!repertorioExistente) {
      return NextResponse.json(
        { error: 'Repertório não encontrado' },
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

    // Extrair blocos do payload
    const { blocos, ...repertorioData } = validacao.data;

    // Atualiza o repertório em uma transação
    const repertorioAtualizado = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Se blocos foram fornecidos, atualiza a relação
      if (blocos) {
        // Remove todos os blocos existentes
        await tx.repertorioBloco.deleteMany({
          where: { repertorioId }
        });

        // Adiciona os novos blocos
        for (const bloco of blocos) {
          await tx.repertorioBloco.create({
            data: {
              repertorioId,
              blocoId: bloco.blocoId,
              ordem: bloco.ordem
            }
          });
        }
      }

      // Atualiza os dados do repertório
      return tx.repertorio.update({
        where: { id: repertorioId },
        data: repertorioData,
        include: {
          banda: true,
          blocos: {
            include: {
              bloco: {
                include: {
                  musicas: {
                    include: {
                      musica: true
                    }
                  }
                }
              }
            },
            orderBy: {
              ordem: 'asc'
            }
          }
        }
      });
    });

    return NextResponse.json(repertorioAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar repertório:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar repertório' },
      { status: 500 }
    );
  }
}

// Excluir um repertório
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { repertorioId } = params;

    // Verifica se o repertório existe
    const repertorioExistente = await prisma.repertorio.findUnique({
      where: { id: repertorioId },
    });

    if (!repertorioExistente) {
      return NextResponse.json(
        { error: 'Repertório não encontrado' },
        { status: 404 }
      );
    }

    // Exclui o repertório (os blocos relacionados serão excluídos automaticamente devido ao onDelete: Cascade)
    await prisma.repertorio.delete({
      where: { id: repertorioId },
    });

    return NextResponse.json(
      { message: 'Repertório excluído com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao excluir repertório:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir repertório' },
      { status: 500 }
    );
  }
} 