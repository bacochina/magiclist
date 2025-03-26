import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function DatabaseStructure() {
  return (
    <Card className="bg-slate-950 border-slate-800 p-6">
      <h3 className="text-lg font-medium text-white mb-4">Estrutura do Banco de Dados</h3>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Tabelas</span>
            <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 border-0">
              4 tabelas
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Campos</span>
            <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 border-0">
              32 campos
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Relacionamentos</span>
            <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 border-0">
              3 chaves estrangeiras
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white">Tabelas Principais</h4>
          <ul className="space-y-4">
            <li className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">users</span>
                <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 border-0">
                  8 campos
                </Badge>
              </div>
              <p className="text-sm text-slate-400">
                Armazena informações dos usuários do sistema
              </p>
            </li>
            <li className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">profiles</span>
                <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 border-0">
                  12 campos
                </Badge>
              </div>
              <p className="text-sm text-slate-400">
                Dados adicionais e preferências dos usuários
              </p>
            </li>
            <li className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">settings</span>
                <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 border-0">
                  6 campos
                </Badge>
              </div>
              <p className="text-sm text-slate-400">
                Configurações gerais da aplicação
              </p>
            </li>
            <li className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">logs</span>
                <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 border-0">
                  6 campos
                </Badge>
              </div>
              <p className="text-sm text-slate-400">
                Registro de atividades e auditoria
              </p>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white">Relacionamentos</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>• users → profiles (1:1)</li>
            <li>• users → settings (1:N)</li>
            <li>• users → logs (1:N)</li>
          </ul>
        </div>
      </div>
    </Card>
  );
} 