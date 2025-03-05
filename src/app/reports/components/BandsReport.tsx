import { ReportLayout } from './ReportLayout';

interface Band {
  id: number;
  name: string;
  genre: string;
  members: string[];
  createdAt: string;
}

interface BandsReportProps {
  bands: Band[];
  paperSize: 'A4' | 'Carta' | 'Ofício';
  orientation: 'portrait' | 'landscape';
}

export function BandsReport({ bands, paperSize, orientation }: BandsReportProps) {
  const sortedBands = [...bands].sort((a, b) => a.name.localeCompare(b.name));
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedBands.length / itemsPerPage);

  const renderPage = (pageNumber: number) => {
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageBands = sortedBands.slice(startIndex, endIndex);

    return (
      <ReportLayout
        key={pageNumber}
        title="Relatório de Bandas"
        currentPage={pageNumber}
        totalPages={totalPages}
        paperSize={paperSize}
        orientation={orientation}
      >
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4 font-medium text-gray-900">Nome</th>
              <th className="text-left py-2 px-4 font-medium text-gray-900">Gênero</th>
              <th className="text-left py-2 px-4 font-medium text-gray-900">Membros</th>
              <th className="text-left py-2 px-4 font-medium text-gray-900">Data de Cadastro</th>
            </tr>
          </thead>
          <tbody>
            {pageBands.map((band) => (
              <tr key={band.id} className="border-b">
                <td className="py-2 px-4">{band.name}</td>
                <td className="py-2 px-4">{band.genre}</td>
                <td className="py-2 px-4">{band.members.join(', ')}</td>
                <td className="py-2 px-4">
                  {new Date(band.createdAt).toLocaleDateString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ReportLayout>
    );
  };

  return (
    <div className="space-y-8">
      {Array.from({ length: totalPages }, (_, i) => renderPage(i + 1))}
    </div>
  );
} 