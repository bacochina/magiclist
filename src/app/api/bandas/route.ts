import { NextResponse } from 'next/server';

const bandas = [
  {
    id: '1',
    nome: 'Banda 1',
    descricao: 'Descrição da Banda 1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    nome: 'Banda 2',
    descricao: 'Descrição da Banda 2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json(bandas);
}

export async function POST(request: Request) {
  const data = await request.json();
  
  const novaBanda = {
    id: (bandas.length + 1).toString(),
    nome: data.nome,
    descricao: data.descricao,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  bandas.push(novaBanda);
  
  return NextResponse.json(novaBanda, { status: 201 });
}

export async function PUT(request: Request) {
  const data = await request.json();
  const index = bandas.findIndex(banda => banda.id === data.id);
  
  if (index === -1) {
    return NextResponse.json(
      { error: 'Banda não encontrada' },
      { status: 404 }
    );
  }

  bandas[index] = {
    ...bandas[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(bandas[index]);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const index = bandas.findIndex(banda => banda.id === id);
  
  if (index === -1) {
    return NextResponse.json(
      { error: 'Banda não encontrada' },
      { status: 404 }
    );
  }

  bandas.splice(index, 1);

  return NextResponse.json({ success: true });
} 