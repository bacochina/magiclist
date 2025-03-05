interface ReportLayoutProps {
  title: string;
  children: React.ReactNode;
  currentPage: number;
  totalPages: number;
  paperSize: 'A4' | 'Carta' | 'Ofício';
  orientation: 'portrait' | 'landscape';
}

export function ReportLayout({
  title,
  children,
  currentPage,
  totalPages,
  paperSize,
  orientation,
}: ReportLayoutProps) {
  const paperSizes = {
    A4: {
      portrait: { width: '210mm', height: '297mm' },
      landscape: { width: '297mm', height: '210mm' },
    },
    Carta: {
      portrait: { width: '216mm', height: '279mm' },
      landscape: { width: '279mm', height: '216mm' },
    },
    Ofício: {
      portrait: { width: '216mm', height: '330mm' },
      landscape: { width: '330mm', height: '216mm' },
    },
  };

  const currentSize = paperSizes[paperSize][orientation];

  return (
    <div
      className="bg-white shadow-lg mx-auto"
      style={{
        width: currentSize.width,
        height: currentSize.height,
        padding: '20mm',
      }}
    >
      {/* Cabeçalho */}
      <div className="mb-8 border-b pb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('pt-BR')}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1">
        {children}
      </div>

      {/* Rodapé */}
      <div className="mt-8 pt-4 border-t">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div>MagicList - Seu Gerenciador Musical</div>
          <div>
            Página {currentPage} de {totalPages}
          </div>
        </div>
      </div>
    </div>
  );
} 