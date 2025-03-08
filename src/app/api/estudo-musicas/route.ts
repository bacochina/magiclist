import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';

// Schema de validação para criação/atualização de estudo de música
const estudoMusicaSchema = z.object({
  musicaId: z.string().min(1, 'ID da música é obrigatório'),
  status: z.enum(['A Aprender', 'Aprendendo', 'Dominada']),
  notas: z.string().optional(),
});

// Obter todos os estudos de músicas
export async function GET() {
  try {
    const estudos = await prisma.estudoMusica.findMany({
      include: {
        musica: {
          include: {
            banda: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    
    return NextResponse.json(estudos);
  } catch (error) {
    console.error('Erro ao listar estudos de músicas:', error);
    return NextResponse.json(
      { error: 'Erro ao listar estudos de músicas' },
      { status: 500 }
    );
  }
}

// Criar um novo estudo de música
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validação dos dados
    const validacao = estudoMusicaSchema.safeParse(data);
    if (!validacao.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', detalhes: validacao.error.format() },
        { status: 400 }
      );
    }
    
    // Verificar se a música existe
    const musica = await prisma.musica.findUnique({
      where: { id: validacao.data.musicaId },
    });
    
    if (!musica) {
      return NextResponse.json(
        { error: 'Música não encontrada' },
        { status: 404 }
      );
    }
    
    // Verificar se já existe um estudo para esta música
    const estudoExistente = await prisma.estudoMusica.findFirst({
      where: { musicaId: validacao.data.musicaId }
    });
    
    if (estudoExistente) {
      return NextResponse.json(
        { error: 'Já existe um estudo para esta música' },
        { status: 409 }
      );
    }
    
    // Criação do estudo no banco de dados
    const novoEstudo = await prisma.estudoMusica.create({
      data: validacao.data,
      include: {
        musica: {
          include: {
            banda: true
          }
        }
      }
    });

    return NextResponse.json(novoEstudo, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar estudo de música:', error);
    return NextResponse.json(
      { error: 'Erro ao criar estudo de música' },
      { status: 500 }
    );
  }
}

// Atualizar status de múltiplos estudos (para arrastar no Kanban)
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: 'Dados inválidos. É esperado um array de estudos.' },
        { status: 400 }
      );
    }
    
    const atualizacoes = await Promise.all(
      data.map(async (item) => {
        if (!item.id || !item.status) {
          return { error: `Item inválido: ${JSON.stringify(item)}` };
        }
        
        try {
          return await prisma.estudoMusica.update({
            where: { id: item.id },
            data: { 
              status: item.status,
              notas: item.notas
            },
            include: {
              musica: {
                include: {
                  banda: true
                }
              }
            }
          });
        } catch (error) {
          console.error(`Erro ao atualizar estudo ${item.id}:`, error);
          return { error: `Erro ao atualizar estudo ${item.id}` };
        }
      })
    );
    
    return NextResponse.json(atualizacoes);
  } catch (error) {
    console.error('Erro ao atualizar estudos:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar estudos' },
      { status: 500 }
    );
  }
} 