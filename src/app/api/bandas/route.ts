import { NextResponse } from 'next/server';
import { bandasSeed } from '@/lib/seeds/bandas';

// Simula um banco de dados em memória
let bandas = [...bandasSeed];

export async function GET() {
  try {
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
    const novaBanda = {
      ...data,
      id: String(bandas.length + 1),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    bandas.push(novaBanda);

    return NextResponse.json(novaBanda);
  } catch (error) {
    console.error('Erro ao criar banda:', error);
    return NextResponse.json(
      { error: 'Erro ao criar banda' },
      { status: 500 }
    );
  }
} 