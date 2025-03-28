import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { title, subtitle, tableName, context } = await request.json();

    // Construir a query de pesquisa
    const searchQuery = `best practices database schema design for ${title} ${tableName} table structure`;

    // Fazer a pesquisa web
    const searchResponse = await fetch('https://api.bing.microsoft.com/v7.0/search', {
      method: 'GET',
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.BING_API_KEY || '',
        'Accept': 'application/json'
      },
      cache: 'no-store'
    });

    let searchResults = '';
    
    if (searchResponse.ok) {
      const data = await searchResponse.json();
      const webPages = data.webPages?.value || [];
      
      // Extrair informações relevantes dos resultados
      const relevantInfo = webPages
        .map((page: any) => `${page.name}\n${page.snippet}`)
        .join('\n\n');

      // Gerar análise baseada nos resultados da pesquisa e no contexto fornecido
      searchResults = `Análise do Contexto:

1. Objetivo da Tabela:
   - Título: ${title}
   - Subtítulo: ${subtitle}
   - Nome da Tabela: ${tableName}
   - Contexto: ${context}

2. Pesquisa de Melhores Práticas:
${relevantInfo}

3. Recomendações de Design:
   - Normalização: Seguir as formas normais para evitar redundância
   - Integridade: Garantir consistência dos dados através de constraints
   - Relacionamentos: Identificar possíveis conexões com outras tabelas

4. Considerações de Segurança:
   - Implementar RLS (Row Level Security) se necessário
   - Controlar acesso granular aos dados
   - Criptografar dados sensíveis quando apropriado

5. Otimizações de Performance:
   - Usar tipos de dados apropriados
   - Criar índices estratégicos
   - Considerar particionamento para grandes volumes`;
    } else {
      // Fallback para análise local se a pesquisa web falhar
      searchResults = `Análise do Contexto:

1. Objetivo da Tabela:
   - Título: ${title}
   - Subtítulo: ${subtitle}
   - Nome da Tabela: ${tableName}
   - Contexto: ${context}

2. Considerações de Design:
   - Normalização: Seguir as formas normais para evitar redundância
   - Integridade: Garantir consistência dos dados através de constraints
   - Relacionamentos: Identificar possíveis conexões com outras tabelas

3. Campos Sugeridos:
   - Campos básicos de auditoria (created_at, updated_at)
   - Campos específicos baseados no contexto fornecido
   - Índices recomendados para otimização de consultas

4. Recomendações de Segurança:
   - Implementar RLS (Row Level Security) se necessário
   - Controlar acesso granular aos dados
   - Criptografar dados sensíveis

5. Considerações de Performance:
   - Usar tipos de dados otimizados
   - Criar índices estratégicos
   - Considerar particionamento para grandes volumes`;
    }

    return NextResponse.json({ results: searchResults });
  } catch (error) {
    console.error('Erro na pesquisa de contexto:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a pesquisa de contexto' },
      { status: 500 }
    );
  }
} 