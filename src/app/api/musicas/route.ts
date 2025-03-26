'use client';

import { NextResponse } from 'next/server';
import { z } from 'zod';

// Schema de validação para criação de música
const musicaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  artista: z.string().min(1, 'Artista é obrigatório'),
  tom: z.string().min(1, 'Tom é obrigatório'),
  bpm: z.number().optional(),
  bandaId: z.string().min(1, 'Banda é obrigatória'),
  observacoes: z.string().optional(),
});

// Função para carregar músicas do localStorage
const getMusicas = () => {
  if (typeof window === 'undefined') return [];
  const musicas = localStorage.getItem('musicas');
  return musicas ? JSON.parse(musicas) : [];
};

// Função para salvar músicas no localStorage
const saveMusicas = (musicas: any[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('musicas', JSON.stringify(musicas));
};

export async function GET() {
  const musicas = getMusicas();
  return NextResponse.json(musicas);
}

export async function POST(request: Request) {
  const data = await request.json();
  const novaMusica = {
    id: String(Date.now()),
    ...data
  };
  const musicas = getMusicas();
  musicas.push(novaMusica);
  saveMusicas(musicas);
  return NextResponse.json(novaMusica);
}

export async function PUT(request: Request) {
  const data = await request.json();
  const musicas = getMusicas();
  const index = musicas.findIndex(m => m.id === data.id);
  if (index === -1) {
    return NextResponse.json({ error: 'Música não encontrada' }, { status: 404 });
  }
  musicas[index] = { ...musicas[index], ...data };
  saveMusicas(musicas);
  return NextResponse.json(musicas[index]);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
  }
  const musicas = getMusicas();
  const index = musicas.findIndex(m => m.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Música não encontrada' }, { status: 404 });
  }
  const novasMusicas = musicas.filter(m => m.id !== id);
  saveMusicas(novasMusicas);
  return NextResponse.json({ success: true });
}

export async function POST_prisma(request: Request) {
  try {
    const data = await request.json();
    
    // Validação dos dados
    const validacao = musicaSchema.safeParse(data);
    if (!validacao.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', detalhes: validacao.error.format() },
        { status: 400 }
      );
    }
    
    // Verificar se a banda existe
    const banda = await prisma.banda.findUnique({
      where: { id: validacao.data.bandaId },
    });
    
    if (!banda) {
      return NextResponse.json(
        { error: 'Banda não encontrada' },
        { status: 404 }
      );
    }
    
    // Criação da música no banco de dados
    const novaMusica = await prisma.musica.create({
      data: validacao.data,
      include: {
        banda: true,
      },
    });

    return NextResponse.json(novaMusica, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar música:', error);
    return NextResponse.json(
      { error: 'Erro ao criar música' },
      { status: 500 }
    );
  }
} 