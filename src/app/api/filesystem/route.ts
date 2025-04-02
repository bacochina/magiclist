import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { operation, path: filePath, content } = await request.json();
    
    console.log(`[FileSystem API] Operação: ${operation}, Caminho: ${filePath}`);

    switch (operation) {
      case 'ensureDir':
        try {
          if (!fs.existsSync(filePath)) {
            console.log(`[FileSystem API] Criando diretório: ${filePath}`);
            fs.mkdirSync(filePath, { recursive: true });
            console.log(`[FileSystem API] Diretório criado com sucesso: ${filePath}`);
          } else {
            console.log(`[FileSystem API] Diretório já existe: ${filePath}`);
          }
          return NextResponse.json({ success: true });
        } catch (dirError) {
          console.error(`[FileSystem API] Erro ao criar diretório ${filePath}:`, dirError);
          return NextResponse.json({ 
            success: false, 
            error: `Erro ao criar diretório: ${dirError instanceof Error ? dirError.message : 'Erro desconhecido'}` 
          }, { status: 500 });
        }

      case 'fileExists':
        try {
          const exists = fs.existsSync(filePath);
          console.log(`[FileSystem API] Verificação de existência: ${filePath} - ${exists ? 'Existe' : 'Não existe'}`);
          return NextResponse.json({ 
            success: true, 
            exists: exists 
          });
        } catch (existsError) {
          console.error(`[FileSystem API] Erro ao verificar existência ${filePath}:`, existsError);
          return NextResponse.json({ 
            success: false, 
            error: `Erro ao verificar existência: ${existsError instanceof Error ? existsError.message : 'Erro desconhecido'}` 
          }, { status: 500 });
        }

      case 'createFile':
        try {
          const dirPath = path.dirname(filePath);
          console.log(`[FileSystem API] Criando arquivo: ${filePath}`);
          
          if (!fs.existsSync(dirPath)) {
            console.log(`[FileSystem API] Criando diretório pai: ${dirPath}`);
            fs.mkdirSync(dirPath, { recursive: true });
          }
          
          fs.writeFileSync(filePath, content || '', 'utf8');
          console.log(`[FileSystem API] Arquivo criado com sucesso: ${filePath}`);
          
          return NextResponse.json({ success: true });
        } catch (fileError) {
          console.error(`[FileSystem API] Erro ao criar arquivo ${filePath}:`, fileError);
          return NextResponse.json({ 
            success: false, 
            error: `Erro ao criar arquivo: ${fileError instanceof Error ? fileError.message : 'Erro desconhecido'}` 
          }, { status: 500 });
        }

      case 'checkWritePermission':
        try {
          console.log(`[FileSystem API] Verificando permissão de escrita: ${filePath}`);
          const testFile = path.join(filePath, '.write-test');
          fs.writeFileSync(testFile, '');
          fs.unlinkSync(testFile);
          console.log(`[FileSystem API] Permissão de escrita verificada: ${filePath}`);
          return NextResponse.json({ success: true });
        } catch (permError) {
          console.error(`[FileSystem API] Erro de permissão em ${filePath}:`, permError);
          return NextResponse.json({ 
            success: false, 
            error: `Sem permissão de escrita no diretório ${filePath}: ${permError instanceof Error ? permError.message : 'Erro desconhecido'}` 
          }, { status: 403 });
        }

      default:
        console.error(`[FileSystem API] Operação não suportada: ${operation}`);
        return NextResponse.json({ 
          success: false, 
          error: `Operação não suportada: ${operation}` 
        }, { status: 400 });
    }
  } catch (error) {
    console.error('[FileSystem API] Erro geral:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido' 
    }, { status: 500 });
  }
} 