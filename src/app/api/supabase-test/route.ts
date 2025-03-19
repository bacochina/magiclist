import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dns from 'dns';
import { promisify } from 'util';

// Converter dns.lookup para Promise
const lookup = promisify(dns.lookup);

export async function GET() {
  try {
    // Caminho para o arquivo mcp.json na home do usuário
    const mcpFilePath = path.join(process.env.HOME || '', '.cursor', 'mcp.json');
    
    // Lê o arquivo mcp.json
    const mcpFileContent = fs.readFileSync(mcpFilePath, 'utf-8');
    const mcpConfig = JSON.parse(mcpFileContent.trim()); // Remover espaços extras
    
    // Extrai as informações de conexão do Supabase
    const supabaseConfig = mcpConfig.mcpServers?.supabase;
    
    if (!supabaseConfig) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Configuração do Supabase não encontrada no arquivo mcp.json' 
        },
        { status: 404 }
      );
    }
    
    // Extrai a string de conexão do banco de dados da configuração
    const argsString = supabaseConfig.args?.join(' ') || '';
    const dbUrlMatch = argsString.match(/<DATABASE_URL=(.+?)>/);
    
    if (!dbUrlMatch || !dbUrlMatch[1]) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'URL do banco de dados não encontrada na configuração do Supabase' 
        },
        { status: 400 }
      );
    }
    
    const databaseUrl = dbUrlMatch[1];
    const dbUrlObj = new URL(databaseUrl);
    const hostname = dbUrlObj.hostname;
    
    // Resolver o endereço IP explicitamente usando IPv4
    let ipAddress;
    try {
      const { address } = await lookup(hostname, { family: 4 });
      ipAddress = address;
      console.log(`Resolvido ${hostname} para IPv4: ${ipAddress}`);
    } catch (lookupError) {
      console.error('Erro ao resolver DNS:', lookupError);
      ipAddress = null; // Continuará usando o hostname original
    }
    
    // Construir uma nova URL com o endereço IP se disponível
    let connectionConfig;
    if (ipAddress) {
      // Usar diretamente os parâmetros de conexão para evitar problemas com a URL
      connectionConfig = {
        user: dbUrlObj.username,
        password: dbUrlObj.password,
        host: ipAddress,
        port: parseInt(dbUrlObj.port || '5432', 10),
        database: dbUrlObj.pathname.slice(1), // remover o / inicial
        ssl: {
          rejectUnauthorized: false
        }
      };
    } else {
      // Usar a URL original se não conseguir resolver o IP
      connectionConfig = {
        connectionString: databaseUrl,
        ssl: {
          rejectUnauthorized: false
        }
      };
    }
    
    // Log para debug
    console.log('Conectando com:', ipAddress || hostname);
    
    // Configura a conexão com o PostgreSQL
    const pool = new Pool(connectionConfig);
    
    // Adiciona timeout para evitar longos tempos de espera
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout ao conectar ao banco de dados (10s)')), 10000);
    });
    
    // Testa a conexão com timeout
    const connectionPromise = pool.connect();
    
    // Usa Promise.race para implementar timeout
    const client = await Promise.race([connectionPromise, timeoutPromise]) as any;
    
    // Executa uma consulta simples
    const result = await client.query('SELECT NOW()');
    
    // Libera o cliente
    client.release();
    
    // Mascara a URL do banco de dados para segurança
    const maskedUrl = databaseUrl.replace(/:[^:]*@/, ':****@');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Conexão com o Supabase estabelecida com sucesso!',
      timestamp: result.rows[0].now,
      databaseUrl: maskedUrl,
      ipResolved: ipAddress || 'Não resolvido'
    });
  } catch (error) {
    console.error('Erro ao conectar ao Supabase:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Falha ao conectar ao Supabase', 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
} 