import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import { z } from 'zod';

// Inicializa o cliente Prisma
const prisma = new PrismaClient();

// Schema de validação para adicionar blocos ao repertório
const blocosAddSchema = z.array(
  z.object({
    blocoId: z.string().min(1, 'ID do bloco é obrigatório'),
    ordem: z.number().int().min(0, 'Ordem deve ser um número inteiro não negativo')
  })
);

interface Params {
  params: {
    repertorioId: string;
  };
}

// Obter todos os blocos de um repertório
export async function GET(request: Request, { params }: Params) {
  try {
    const { repertorioId } = params;

    // Verifica se o repertório existe
    const repertorio = await prisma.repertorio.findUnique({
      where: { id: repertorioId },
    });

    if (!repertorio) {
      return NextResponse.json(
        { error: 'Repertório não encontrado' },
        { status: 404 }
      );
    }

    // Busca os blocos do repertório
    const blocos = await prisma.repertorioBloco.findMany({
      where: { repertorioId },
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
      },
      orderBy: {
        ordem: 'asc'
      }
    });

    return NextResponse.json(blocos);
  } catch (error) {
    console.error('Erro ao buscar blocos do repertório:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar blocos do repertório' },
      { status: 500 }
    );
  }
}

// Adicionar ou atualizar blocos em um repertório
export async function POST(request: Request, { params }: Params) {
  try {
    const { repertorioId } = params;
    const data = await request.json();

    // Validação dos dados
    const validacao = blocosAddSchema.safeParse(data);
    if (!validacao.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', detalhes: validacao.error.format() },
        { status: 400 }
      );
    }

    // Verifica se o repertório existe
    const repertorio = await prisma.repertorio.findUnique({
      where: { id: repertorioId },
    });

    if (!repertorio) {
      return NextResponse.json(
        { error: 'Repertório não encontrado' },
        { status: 404 }
      );
    }

    // Verifica se todos os blocos existem
    const blocoIds = validacao.data.map(item => item.blocoId);
    const blocos = await prisma.bloco.findMany({
      where: {
        id: {
          in: blocoIds
        }
      }
    });

    if (blocos.length !== blocoIds.length) {
      return NextResponse.json(
        { error: 'Um ou mais blocos não foram encontrados' },
        { status: 404 }
      );
    }

    // Atualiza os blocos do repertório em uma transação
    const resultado = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Remove todos os blocos existentes
      await tx.repertorioBloco.deleteMany({
        where: { repertorioId }
      });

      // Adiciona os novos blocos
      const novosRepertorioBlocos = [];
      for (const item of validacao.data) {
        const novoRepertorioBloco = await tx.repertorioBloco.create({
          data: {
            repertorioId,
            blocoId: item.blocoId,
            ordem: item.ordem
          },
          include: {
            bloco: true
          }
        });
        novosRepertorioBlocos.push(novoRepertorioBloco);
      }

      return novosRepertorioBlocos;
    });

    return NextResponse.json(resultado);
  } catch (error) {
    console.error('Erro ao adicionar blocos ao repertório:', error);
    return NextResponse.json(
      { error: 'Erro ao adicionar blocos ao repertório' },
      { status: 500 }
    );
  }
}

// Remover todos os blocos de um repertório
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { repertorioId } = params;

    // Verifica se o repertório existe
    const repertorio = await prisma.repertorio.findUnique({
      where: { id: repertorioId },
    });

    if (!repertorio) {
      return NextResponse.json(
        { error: 'Repertório não encontrado' },
        { status: 404 }
      );
    }

    // Remove todos os blocos do repertório
    await prisma.repertorioBloco.deleteMany({
      where: { repertorioId }
    });

    return NextResponse.json(
      { message: 'Todos os blocos foram removidos do repertório' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao remover blocos do repertório:', error);
    return NextResponse.json(
      { error: 'Erro ao remover blocos do repertório' },
      { status: 500 }
    );
  }
} 