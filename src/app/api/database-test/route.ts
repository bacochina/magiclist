import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Tenta executar uma consulta simples
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({ 
      success: true, 
      message: 'Conexão com o banco de dados estabelecida com sucesso!',
      databaseUrl: process.env.DATABASE_URL?.replace(/:[^:]*@/, ':****@') // Ocultando a senha
    });
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Falha ao conectar ao banco de dados', 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
} 