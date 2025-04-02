'use client';

import Link from 'next/link';
import { 
  ArrowRight, 
  FileText, 
  RefreshCw, 
  CheckSquare 
} from 'lucide-react';

const FerramentasPage = () => {
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-transparent bg-clip-text">
          Ferramentas
        </h1>
        <p className="text-gray-400 max-w-3xl">
          Ferramentas úteis para auxiliar na gestão de bandas, músicas e eventos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card Geradores */}
        <Link href="/ferramentas/geradores">
          <div className="group relative h-[280px] overflow-hidden rounded-xl border border-white/10 bg-gray-900 hover:bg-gray-800 transition-colors duration-300">
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-gradient-radial from-transparent to-black"></div>
            <div className="flex flex-col h-full p-6 justify-between relative z-10">
              <div className="mb-4">
                <div className="mb-3 flex items-center gap-2">
                  <div className="rounded-lg p-2.5 bg-gradient-to-br from-yellow-500 to-amber-600">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white group-hover:translate-x-1 transition-transform duration-300">
                    Geradores
                  </h3>
                </div>
                <p className="text-sm text-gray-400 line-clamp-3">
                  Gere automaticamente setlists, checklists de equipamentos, planilhas de custos e outros documentos essenciais.
                </p>
              </div>
              
              <div>
                <ul className="space-y-1 mb-4">
                  <li className="text-sm text-gray-400 flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 mr-2"></div>
                    Setlists automáticos
                  </li>
                  <li className="text-sm text-gray-400 flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 mr-2"></div>
                    Planilhas de custos
                  </li>
                  <li className="text-sm text-gray-400 flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 mr-2"></div>
                    Checklists de equipamentos
                  </li>
                </ul>
                
                <div className="flex justify-end">
                  <div className="group-hover:bg-yellow-500 rounded-full p-2 transition-colors duration-300">
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Card Conversores */}
        <Link href="/ferramentas/conversores">
          <div className="group relative h-[280px] overflow-hidden rounded-xl border border-white/10 bg-gray-900 hover:bg-gray-800 transition-colors duration-300">
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-gradient-radial from-transparent to-black"></div>
            <div className="flex flex-col h-full p-6 justify-between relative z-10">
              <div className="mb-4">
                <div className="mb-3 flex items-center gap-2">
                  <div className="rounded-lg p-2.5 bg-gradient-to-br from-orange-500 to-red-600">
                    <RefreshCw className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white group-hover:translate-x-1 transition-transform duration-300">
                    Conversores
                  </h3>
                </div>
                <p className="text-sm text-gray-400 line-clamp-3">
                  Converta formatos de arquivos, tons musicais, tablaturas e outros recursos importantes para músicos.
                </p>
              </div>
              
              <div>
                <ul className="space-y-1 mb-4">
                  <li className="text-sm text-gray-400 flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500 mr-2"></div>
                    Transposição de tons
                  </li>
                  <li className="text-sm text-gray-400 flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500 mr-2"></div>
                    Conversão de tablaturas
                  </li>
                  <li className="text-sm text-gray-400 flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500 mr-2"></div>
                    Formatos de arquivos
                  </li>
                </ul>
                
                <div className="flex justify-end">
                  <div className="group-hover:bg-orange-500 rounded-full p-2 transition-colors duration-300">
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Card Checklist */}
        <Link href="/ferramentas/checklist">
          <div className="group relative h-[280px] overflow-hidden rounded-xl border border-white/10 bg-gray-900 hover:bg-gray-800 transition-colors duration-300">
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-gradient-radial from-transparent to-black"></div>
            <div className="flex flex-col h-full p-6 justify-between relative z-10">
              <div className="mb-4">
                <div className="mb-3 flex items-center gap-2">
                  <div className="rounded-lg p-2.5 bg-gradient-to-br from-green-500 to-emerald-600">
                    <CheckSquare className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white group-hover:translate-x-1 transition-transform duration-300">
                    Checklist
                  </h3>
                </div>
                <p className="text-sm text-gray-400 line-clamp-3">
                  Listas de verificação para shows, ensaios, equipamentos e logística para garantir que nada seja esquecido.
                </p>
              </div>
              
              <div>
                <ul className="space-y-1 mb-4">
                  <li className="text-sm text-gray-400 flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></div>
                    Checklist para shows
                  </li>
                  <li className="text-sm text-gray-400 flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></div>
                    Verificação de equipamentos
                  </li>
                  <li className="text-sm text-gray-400 flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></div>
                    Logística de transporte
                  </li>
                </ul>
                
                <div className="flex justify-end">
                  <div className="group-hover:bg-green-500 rounded-full p-2 transition-colors duration-300">
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default FerramentasPage; 