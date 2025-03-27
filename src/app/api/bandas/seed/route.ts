import { NextResponse } from 'next/server';
import { bandasSeed } from '@/lib/seeds/bandas';

// Referência ao array de bandas do arquivo route.ts
declare const bandas: any[];

export async function POST() {
  try {
    // Limpa o array atual
    bandas.length = 0;
    
    // Adiciona as bandas do seed
    bandas.push(...bandasSeed);

    return NextResponse.json({ 
      message: 'Bandas adicionadas com sucesso',
      bandas: bandasSeed 
    });
  } catch (error) {
    console.error('Erro ao adicionar bandas:', error);
    return NextResponse.json(
      { error: 'Erro ao adicionar bandas' },
      { status: 500 }
    );
  }
} 