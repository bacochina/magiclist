'use client';

import { useState } from 'react';

interface ReportConfig {
  id: string;
  title: string;
  description: string;
  defaultOrder: 'alphabetical' | 'numerical';
  defaultPaperSize: 'A4' | 'Carta' | 'Ofício';
}

export default function ReportsPage() {
  const [selectedPaperSize, setSelectedPaperSize] = useState<'A4' | 'Carta' | 'Ofício'>('A4');
  const [selectedOrientation, setSelectedOrientation] = useState<'portrait' | 'landscape'>('portrait');

  const reports: ReportConfig[] = [
    {
      id: 'bands',
      title: 'Relatório de Bandas',
      description: 'Lista completa de bandas cadastradas com detalhes',
      defaultOrder: 'alphabetical',
      defaultPaperSize: 'A4'
    },
    {
      id: 'songs',
      title: 'Relatório de Músicas',
      description: 'Catálogo completo de músicas por banda',
      defaultOrder: 'alphabetical',
      defaultPaperSize: 'A4'
    },
    {
      id: 'blocks',
      title: 'Relatório de Blocos',
      description: 'Blocos de músicas organizados por show',
      defaultOrder: 'numerical',
      defaultPaperSize: 'A4'
    },
    {
      id: 'repertoires',
      title: 'Relatório de Repertórios',
      description: 'Repertórios completos por show',
      defaultOrder: 'alphabetical',
      defaultPaperSize: 'A4'
    },
    {
      id: 'pedalboards',
      title: 'Relatório de Pedaleiras',
      description: 'Configurações de pedaleiras por música',
      defaultOrder: 'alphabetical',
      defaultPaperSize: 'A4'
    }
  ];

  const handleGeneratePDF = (reportId: string) => {
    // TODO: Implementar geração de PDF
    console.log(`Gerando PDF para ${reportId}`);
  };

  const handlePrint = (reportId: string) => {
    // TODO: Implementar impressão
    console.log(`Imprimindo relatório ${reportId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Relatórios
            </h1>
            <p className="text-gray-600">
              Gere relatórios detalhados de todos os seus cadastros no MagicList
            </p>
          </div>

          <div className="space-y-6">
            {reports.map((report) => (
              <div
                key={report.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {report.title}
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      {report.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-gray-500">
                        Ordenação padrão: {report.defaultOrder === 'alphabetical' ? 'Alfabética' : 'Numérica'}
                      </span>
                      <span className="text-sm text-gray-500">
                        Formato padrão: {report.defaultPaperSize}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      className="text-sm border-gray-300 rounded-md"
                      value={selectedPaperSize}
                      onChange={(e) => setSelectedPaperSize(e.target.value as 'A4' | 'Carta' | 'Ofício')}
                    >
                      <option value="A4">A4</option>
                      <option value="Carta">Carta</option>
                      <option value="Ofício">Ofício</option>
                    </select>
                    <button
                      onClick={() => handleGeneratePDF(report.id)}
                      className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                      title="Gerar PDF"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handlePrint(report.id)}
                      className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                      title="Imprimir"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 