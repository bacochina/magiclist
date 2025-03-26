import { NextResponse } from 'next/server';
import { eventosExemplo } from '@/app/(routes)/eventos/data/eventos-exemplo';
import { Evento } from '@/lib/types';

// Funções para gerenciar localStorage
const getEventos = () => {
  if (typeof window === 'undefined') return eventosExemplo;
  const eventos = localStorage.getItem('eventos');
  return eventos ? JSON.parse(eventos) : eventosExemplo;
};

const saveEventos = (eventos: any[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('eventos', JSON.stringify(eventos));
};

export async function GET() {
  try {
    const eventos = getEventos();
    return NextResponse.json(eventos);
  } catch (error) {
    console.error('Erro ao listar eventos:', error);
    return NextResponse.json(
      { error: 'Erro ao listar eventos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const eventos = getEventos();
    const novoEvento = {
      ...data,
      id: String(Date.now()),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    eventos.push(novoEvento);
    saveEventos(eventos);

    return NextResponse.json(novoEvento);
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    return NextResponse.json(
      { error: 'Erro ao criar evento' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const eventos = getEventos();
    const index = eventos.findIndex((e: Evento) => e.id === data.id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Evento não encontrado' },
        { status: 404 }
      );
    }

    eventos[index] = {
      ...eventos[index],
      ...data,
      updatedAt: new Date()
    };

    saveEventos(eventos);
    return NextResponse.json(eventos[index]);
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar evento' },
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

    const eventos = getEventos();
    const novosEventos = eventos.filter((e: Evento) => e.id !== id);
    saveEventos(novosEventos);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir evento:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir evento' },
      { status: 500 }
    );
  }
} 