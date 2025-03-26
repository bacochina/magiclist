'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

interface TestResult {
  success: boolean;
  message: string;
  databaseUrl?: string;
  timestamp?: string;
  ipResolved?: string;
  error?: string;
}

export default function DbTestPage() {
  const [loading, setLoading] = useState(true);
  const [postgresResult, setPostgresResult] = useState<TestResult | null>(null);
  const [supabaseResult, setSupabaseResult] = useState<TestResult | null>(null);
  const [supabaseDirectResult, setSupabaseDirectResult] = useState<TestResult | null>(null);

  const testPostgresConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/database-test');
      const data = await response.json();
      setPostgresResult(data);
    } catch (error) {
      setPostgresResult({
        success: false,
        message: 'Erro ao fazer requisição para o teste de conexão',
        error: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setLoading(false);
    }
  };

  const testSupabaseConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/supabase-test');
      const data = await response.json();
      setSupabaseResult(data);
    } catch (error) {
      setSupabaseResult({
        success: false,
        message: 'Erro ao fazer requisição para o teste de conexão com Supabase',
        error: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setLoading(false);
    }
  };

  const testSupabaseDirectConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/supabase-direct');
      const data = await response.json();
      setSupabaseDirectResult(data);
    } catch (error) {
      setSupabaseDirectResult({
        success: false,
        message: 'Erro ao fazer requisição para o teste de conexão direta com Supabase',
        error: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testPostgresConnection();
    testSupabaseConnection();
    testSupabaseDirectConnection();
  }, []);

  const renderTestResult = (title: string, result: TestResult | null, onRetry: () => void) => {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button 
            onClick={onRetry}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
            title="Testar novamente"
            disabled={loading}
          >
            <RefreshCw className={`h-5 w-5 text-gray-300 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <span className="ml-3 text-gray-300">Testando conexão...</span>
          </div>
        ) : result ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {result.success ? (
                <CheckCircle className="text-green-500 h-6 w-6" />
              ) : (
                <AlertCircle className="text-red-500 h-6 w-6" />
              )}
              <h3 className="text-xl font-semibold text-white">
                {result.success ? 'Conexão Bem-Sucedida' : 'Falha na Conexão'}
              </h3>
            </div>
            
            <div className="p-4 rounded-md bg-gray-700/50">
              <p className="text-gray-300">{result.message}</p>
              
              {result.databaseUrl && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">URL do Banco de Dados:</h3>
                  <code className="block p-2 bg-gray-900 rounded text-green-400 text-sm overflow-x-auto">
                    {result.databaseUrl}
                  </code>
                </div>
              )}

              {result.ipResolved && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Endereço IP resolvido:</h3>
                  <code className="block p-2 bg-gray-900 rounded text-green-400 text-sm overflow-x-auto">
                    {result.ipResolved}
                  </code>
                </div>
              )}

              {result.timestamp && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Timestamp do Servidor:</h3>
                  <code className="block p-2 bg-gray-900 rounded text-green-400 text-sm overflow-x-auto">
                    {result.timestamp}
                  </code>
                </div>
              )}
              
              {result.error && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Detalhes do Erro:</h3>
                  <code className="block p-2 bg-gray-900 rounded text-red-400 text-sm overflow-x-auto">
                    {result.error}
                  </code>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-red-500">
            <AlertCircle className="h-6 w-6" />
            <p>Não foi possível obter resultados do teste.</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Teste de Conexão com Banco de Dados</h1>
      
      {renderTestResult('Postgres Local (DATABASE_URL)', postgresResult, testPostgresConnection)}
      {renderTestResult('Supabase (mcp.json)', supabaseResult, testSupabaseConnection)}
      {renderTestResult('Supabase Direto (PSQL)', supabaseDirectResult, testSupabaseDirectConnection)}

      <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-md">
        <h3 className="text-blue-400 font-medium mb-2">Informações:</h3>
        <p className="text-gray-300 text-sm mb-2">
          O teste Postgres Local verifica a conexão com o banco de dados PostgreSQL configurado
          no arquivo <code className="text-blue-300">.env</code> através da variável 
          <code className="text-blue-300"> DATABASE_URL</code>.
        </p>
        <p className="text-gray-300 text-sm mb-2">
          O teste Supabase verifica a conexão usando as credenciais configuradas
          no arquivo <code className="text-blue-300">mcp.json</code> localizado em 
          <code className="text-blue-300"> ~/.cursor/</code>.
        </p>
        <p className="text-gray-300 text-sm">
          O teste Supabase Direto usa o comando <code className="text-blue-300">psql</code> 
          nativo para conectar diretamente ao servidor, forçando IPv4 e usando 
          resolução de DNS do sistema operacional.
        </p>
      </div>
    </div>
  );
} 