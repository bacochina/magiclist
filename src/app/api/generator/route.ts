import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { tableName, fields, constraints, indexes } = data;

    // Validar nome da tabela
    if (!tableName.match(/^[a-z][a-z0-9_]*$/)) {
      return NextResponse.json(
        { error: 'Nome da tabela inválido. Use apenas letras minúsculas, números e underscores.' },
        { status: 400 }
      );
    }

    // Gerar SQL para criação da tabela
    let sql = `CREATE TABLE ${tableName} (\n`;
    
    // Adicionar campos
    const fieldDefinitions = fields.map(field => {
      let def = `  ${field.name} ${field.type.toUpperCase()}`;
      if (field.required) def += ' NOT NULL';
      if (field.isPrimaryKey) def += ' PRIMARY KEY';
      return def;
    });
    
    sql += fieldDefinitions.join(',\n');
    
    // Adicionar constraints
    if (constraints && constraints.length > 0) {
      sql += ',\n  ' + constraints.join(',\n  ');
    }
    
    sql += '\n);';

    // Adicionar índices
    if (indexes && indexes.length > 0) {
      sql += '\n\n' + indexes.map(index => `CREATE INDEX ON ${tableName} ${index};`).join('\n');
    }

    // Executar SQL no Supabase
    const { error } = await supabase.rpc('execute_sql', { sql_query: sql });
    
    if (error) {
      return NextResponse.json(
        { error: 'Erro ao criar tabela: ' + error.message },
        { status: 500 }
      );
    }

    // Registrar histórico
    const { error: historyError } = await supabase
      .from('generator_history')
      .insert([{
        table_name: tableName,
        sql_definition: sql,
        metadata: data
      }]);

    if (historyError) {
      console.error('Erro ao registrar histórico:', historyError);
    }

    return NextResponse.json({
      message: 'Tabela criada com sucesso',
      sql
    });

  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('generator_history')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Erro ao buscar histórico' },
        { status: 500 }
      );
    }

    return NextResponse.json({ history: data });

  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 