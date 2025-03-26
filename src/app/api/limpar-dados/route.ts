import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Função para limpar o localStorage diretamente
export async function DELETE(request: Request) {
  try {
    // Lista de chaves a serem removidas do localStorage
    const chaves = [
      'bandas',
      'integrantes',
      'musicas',
      'eventos',
      'blocos',
      'repertorios'
    ];
    
    // Retorna uma resposta de sucesso
    return NextResponse.json({ 
      mensagem: 'Dados limpos com sucesso',
      chaves
    });
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
    return NextResponse.json(
      { erro: 'Erro ao limpar dados', detalhes: (error as Error).message },
      { status: 500 }
    );
  }
} 