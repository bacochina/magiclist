import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { gerarMusicasSeed } from '@/lib/seeds/musicas';

export async function GET() {
  try {
    // Busca a primeira banda para associar as músicas
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

    // Limpa todas as músicas existentes
    await prisma.musica.deleteMany({});
    
    // Gera músicas de exemplo para a banda
    const musicasSeed = gerarMusicasSeed(primeiraBanda.id);
    
    // Insere as músicas no banco de dados
    const musicasInseridas = await Promise.all(
      musicasSeed.map(async (musica) => {
        return prisma.musica.create({
          data: musica,
        });
      })
    );

    return NextResponse.json({
      message: `${musicasInseridas.length} músicas inseridas com sucesso`,
      bandaId: primeiraBanda.id,
      bandaNome: primeiraBanda.nome,
      musicas: musicasInseridas,
    });
  } catch (error) {
    console.error('Erro ao popular músicas:', error);
    return NextResponse.json(
      { error: 'Erro ao popular músicas' },
      { status: 500 }
    );
  }
} 