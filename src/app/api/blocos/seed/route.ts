import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { gerarBlocosSeed } from '@/lib/seeds/blocos';

export async function GET() {
  try {
    // Busca a primeira banda para associar os blocos
    const primeiraBanda = await prisma.banda.findFirst({
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (!primeiraBanda) {
      return NextResponse.json(
        { error: 'Nenhuma banda encontrada. Crie uma banda primeiro.' },
        { status: 404 }
      );
    }

    // Busca as músicas da banda para associar aos blocos
    const musicas = await prisma.musica.findMany({
      where: { bandaId: primeiraBanda.id },
      orderBy: {
        nome: 'asc',
      },
    });

    if (musicas.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma música encontrada para esta banda. Crie músicas primeiro.' },
        { status: 404 }
      );
    }

    // Limpa todos os blocos existentes
    await prisma.blocoMusical.deleteMany({});
    
    // Gera blocos de exemplo para a banda
    const blocosSeed = gerarBlocosSeed(primeiraBanda.id, musicas.map(m => m.id));
    
    // Distribui as músicas entre os blocos
    const musicasPorBloco = Math.ceil(musicas.length / blocosSeed.length);
    
    // Insere os blocos no banco de dados
    const blocosInseridos = [];
    
    for (let i = 0; i < blocosSeed.length; i++) {
      const bloco = blocosSeed[i];
      
      // Seleciona as músicas para este bloco
      const musicasDoBloco = musicas.slice(
        i * musicasPorBloco, 
        Math.min((i + 1) * musicasPorBloco, musicas.length)
      );
      
      // Cria o bloco com suas músicas
      const novoBloco = await prisma.blocoMusical.create({
        data: {
          ...bloco,
          musicas: {
            create: musicasDoBloco.map((musica, index) => ({
              musicaId: musica.id,
              ordem: index
            }))
          }
        },
        include: {
          musicas: {
            include: {
              musica: true
            }
          }
        }
      });
      
      blocosInseridos.push(novoBloco);
    }

    return NextResponse.json({
      message: `${blocosInseridos.length} blocos inseridos com sucesso`,
      bandaId: primeiraBanda.id,
      bandaNome: primeiraBanda.nome,
      blocos: blocosInseridos,
    });
  } catch (error) {
    console.error('Erro ao popular blocos:', error);
    return NextResponse.json(
      { error: 'Erro ao popular blocos' },
      { status: 500 }
    );
  }
} 