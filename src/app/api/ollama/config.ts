import { OllamaConfig } from './types';

export const config: OllamaConfig = {
  baseUrl: process.env.OLLAMA_API_URL || 'http://localhost:11434/api',
  model: process.env.OLLAMA_MODEL || 'llama2',
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxTokens: 2048,
};

export const FIELD_GENERATION_PROMPT = `
Você é um especialista em modelagem de banco de dados. Com base no contexto fornecido, gere campos apropriados para uma tabela SQL.

Contexto da Página:
Título: {pageTitle}
Subtítulo: {pageSubtitle}

Tabela:
Nome: {tableName}
Descrição: {context}

Por favor, gere campos SQL apropriados seguindo estas diretrizes:
1. Use tipos de dados PostgreSQL apropriados
2. Inclua descrições claras para cada campo
3. Indique quais campos são obrigatórios
4. Sugira chaves primárias e estrangeiras quando apropriado
5. Siga as melhores práticas de nomenclatura (snake_case)
6. Considere campos de auditoria quando relevante
7. Evite duplicação de dados
8. Considere a normalização do banco de dados

Retorne apenas um array JSON com os campos no seguinte formato:
{
  "fields": [
    {
      "name": "nome_do_campo",
      "type": "tipo_sql",
      "description": "descrição detalhada",
      "required": true/false,
      "isPrimaryKey": true/false,
      "isForeignKey": true/false,
      "references": {
        "table": "tabela_referenciada",
        "field": "campo_referenciado"
      }
    }
  ]
}
`; 