import { NextResponse } from 'next/server';
import { repertorios } from "@/lib/seeds/repertorios";
import { Repertorio, BlocoMusical, Musica } from "@/lib/types";

let repertoriosData = [...repertorios];

export async function GET() {
  try {
    return NextResponse.json(repertoriosData);
  } catch (error) {
    console.error('Erro ao buscar repertórios:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar repertórios' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const novoRepertorio: Partial<Repertorio> = await request.json();
    
    // Gera um ID único
    const repertorioCompleto: Repertorio = {
      ...novoRepertorio,
      id: (repertoriosData.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      blocos: novoRepertorio.blocos?.map(bloco => ({
        ...bloco,
        createdAt: new Date(),
        updatedAt: new Date()
      })) || []
    } as Repertorio;
    
    repertoriosData.push(repertorioCompleto);
    
    return NextResponse.json(repertorioCompleto);
  } catch (error) {
    console.error('Erro ao criar repertório:', error);
    return NextResponse.json(
      { error: 'Erro ao criar repertório' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const repertorioAtualizado: Repertorio = await request.json();
    
    const index = repertoriosData.findIndex(r => r.id === repertorioAtualizado.id);
    if (index === -1) {
      return NextResponse.json(
        { error: 'Repertório não encontrado' },
        { status: 404 }
      );
    }
    
    // Atualiza o updatedAt do repertório e dos blocos
    repertorioAtualizado.updatedAt = new Date();
    repertorioAtualizado.blocos = repertorioAtualizado.blocos.map(bloco => ({
      ...bloco,
      updatedAt: new Date()
    }));
    
    repertoriosData[index] = repertorioAtualizado;
    
    return NextResponse.json(repertorioAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar repertório:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar repertório' },
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
    
    const index = repertoriosData.findIndex(r => r.id === id);
    if (index === -1) {
      return NextResponse.json(
        { error: 'Repertório não encontrado' },
        { status: 404 }
      );
    }
    
    repertoriosData = repertoriosData.filter(r => r.id !== id);
    
    return NextResponse.json({ message: 'Repertório excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir repertório:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir repertório' },
      { status: 500 }
    );
  }
} 