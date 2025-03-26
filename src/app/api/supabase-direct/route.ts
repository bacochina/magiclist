import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import dns from 'dns';
import { promisify } from 'util';

// Criar versão Promise do método lookup do DNS
const dnsLookup = promisify(dns.lookup);

// Usar conexão direta com o driver nativo do postgres
export async function GET() {
  try {
    // Caminho para o arquivo mcp.json na home do usuário
    const mcpFilePath = path.join(process.env.HOME || '', '.cursor', 'mcp.json');
    
    // Lê o arquivo mcp.json
    const mcpFileContent = fs.readFileSync(mcpFilePath, 'utf-8');
    const mcpConfig = JSON.parse(mcpFileContent.trim());
    
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
    
    // Extrair informações da URL
    const host = dbUrlObj.hostname;
    const port = dbUrlObj.port || '5432';
    const database = dbUrlObj.pathname.slice(1); // Remover o / inicial
    const user = dbUrlObj.username;
    const password = dbUrlObj.password;
    
    // Resolver o endereço IP usando diferentes métodos
    let ipAddress;
    
    // Método 1: Node.js DNS lookup (compatível com todos os sistemas)
    try {
      console.log('Tentando resolver DNS usando Node.js DNS lookup...');
      const { address } = await dnsLookup(host, { family: 4 }); // Forçar IPv4
      ipAddress = address;
      console.log(`Resolvido ${host} para IPv4 usando Node.js DNS: ${ipAddress}`);
    } catch (error) {
      console.error('Falha ao resolver usando Node.js DNS:', error);
    }
    
    // Método 2: Usar comando dig (disponível em macOS e Linux)
    if (!ipAddress) {
      try {
        console.log('Tentando resolver DNS usando dig...');
        const digOutput = execSync(`dig +short ${host} A | head -n 1`).toString().trim();
        if (digOutput) {
          ipAddress = digOutput;
          console.log(`Resolvido ${host} para IPv4 usando dig: ${ipAddress}`);
        }
      } catch (error) {
        console.error('Falha ao resolver usando dig:', error);
      }
    }
    
    // Método 3: Usar nslookup (disponível em macOS e Windows)
    if (!ipAddress) {
      try {
        console.log('Tentando resolver DNS usando nslookup...');
        const nslookupOutput = execSync(`nslookup ${host} | grep "Address:" | tail -n 1 | awk '{print $2}'`).toString().trim();
        if (nslookupOutput) {
          ipAddress = nslookupOutput;
          console.log(`Resolvido ${host} para IPv4 usando nslookup: ${ipAddress}`);
        }
      } catch (error) {
        console.error('Falha ao resolver usando nslookup:', error);
      }
    }

    // Método 4: Usar o comando host (comum em Unix/macOS)
    if (!ipAddress) {
      try {
        console.log('Tentando resolver DNS usando host...');
        const hostOutput = execSync(`host ${host} | grep "has address" | head -n 1 | awk '{print $4}'`).toString().trim();
        if (hostOutput) {
          ipAddress = hostOutput;
          console.log(`Resolvido ${host} para IPv4 usando host: ${ipAddress}`);
        }
      } catch (error) {
        console.error('Falha ao resolver usando host:', error);
      }
    }
    
    // Verificar se conseguimos resolver o IP
    if (!ipAddress) {
      console.log('Falha em todos os métodos de resolução DNS. Usando o hostname diretamente.');
      
      // Tentar usar o hostname diretamente
      try {
        // Mesmo que não consigamos resolver o IP, tentamos conectar diretamente usando o hostname
        const commandHostname = `PGCONNECT_TIMEOUT=10 PGSSLMODE=require psql -h ${host} -p ${port} -U ${user} -d ${database} -c "SELECT NOW()" -t`;
        console.log('Tentando conectar diretamente usando hostname:', host);
        
        // Define a senha como variável de ambiente
        const env = { ...process.env, PGPASSWORD: password };
        
        // Executa o comando psql
        const result = execSync(commandHostname, { env, timeout: 15000 }).toString().trim();
        
        // Se chegou aqui, a conexão foi bem-sucedida
        const maskedUrl = databaseUrl.replace(/:[^:]*@/, ':****@');
        return NextResponse.json({
          success: true,
          message: 'Conexão com o Supabase estabelecida com sucesso (usando hostname)!',
          timestamp: result,
          databaseUrl: maskedUrl,
          ipResolved: "Não resolvido - usando hostname"
        });
      } catch (directError) {
        console.error('Erro ao conectar diretamente com hostname:', directError);
        
        return NextResponse.json(
          {
            success: false,
            message: 'Não foi possível resolver o IP do host Supabase nem conectar diretamente',
            error: 'DNS resolution failed - Todos os métodos de resolução DNS falharam',
            hostname: host,
            details: directError instanceof Error ? directError.message : String(directError)
          },
          { status: 500 }
        );
      }
    }
    
    // Se chegou aqui, temos um IP resolvido
    // Conectar usando psql diretamente
    try {
      // Comando psql com timeout
      const command = `PGCONNECT_TIMEOUT=10 PGSSLMODE=require psql -h ${ipAddress} -p ${port} -U ${user} -d ${database} -c "SELECT NOW()" -t`;
      console.log('Comando (sem senha):', command);
      
      // Define a senha como variável de ambiente
      const env = { ...process.env, PGPASSWORD: password };
      
      // Executa o comando psql
      const result = execSync(command, { env, timeout: 15000 }).toString().trim();
      console.log('Resultado do psql:', result);
      
      // Mascara a URL do banco de dados para segurança
      const maskedUrl = databaseUrl.replace(/:[^:]*@/, ':****@');
      
      return NextResponse.json({ 
        success: true, 
        message: 'Conexão com o Supabase estabelecida com sucesso!',
        timestamp: result,
        databaseUrl: maskedUrl,
        ipResolved: ipAddress
      });
    } catch (error) {
      console.error('Erro psql:', error);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Falha ao conectar ao Supabase usando psql',
          error: error instanceof Error ? error.message : String(error),
          ipResolved: ipAddress
        },
        { status: 500 }
      );
    }
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