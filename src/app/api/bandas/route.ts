import { NextResponse } from 'next/server';
import { bandasSeed } from '@/lib/seeds/bandas';

// Funções para gerenciar localStorage
const getBandas = () => {
  if (typeof window === 'undefined') return bandasSeed;
  const bandas = localStorage.getItem('bandas');
  return bandas ? JSON.parse(bandas) : bandasSeed;
};

const saveBandas = (bandas: any[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('bandas', JSON.stringify(bandas));
};

export async function GET() {
  try {
    const bandas = getBandas();
    return NextResponse.json({ bandas });
  } catch (error) {
    console.error('Erro ao listar bandas:', error);
    return NextResponse.json(
      { error: 'Erro ao listar bandas' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const bandas = getBandas();
    const novaBanda = {
      ...data,
      id: String(Date.now()),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    bandas.push(novaBanda);
    saveBandas(bandas);

    return NextResponse.json(novaBanda);
  } catch (error) {
    console.error('Erro ao criar banda:', error);
    return NextResponse.json(
      { error: 'Erro ao criar banda' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const bandas = getBandas();
    const index = bandas.findIndex(b => b.id === data.id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Banda não encontrada' },
        { status: 404 }
      );
    }

    bandas[index] = {
      ...bandas[index],
      ...data,
      updatedAt: new Date()
    };

    saveBandas(bandas);
    return NextResponse.json(bandas[index]);
  } catch (error) {
    console.error('Erro ao atualizar banda:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar banda' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID não fornecido' },
        { status: 400 }
      );
    }

    const bandas = getBandas();
    const novasBandas = bandas.filter(b => b.id !== id);
    saveBandas(novasBandas);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir banda:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir banda' },
      { status: 500 }
    );
  }
} 