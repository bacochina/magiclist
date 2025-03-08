'use client';

interface Musica {
  id: string;
  nome: string;
  artista: string;
  tom: string;
  observacoes?: string;
}

interface MusicaDetalhesProps {
  musica: Musica;
}

export function MusicaDetalhes({ musica }: MusicaDetalhesProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-500">Nome</h3>
        <p className="mt-1 text-sm text-gray-900">{musica.nome}</p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500">Artista</h3>
        <p className="mt-1 text-sm text-gray-900">{musica.artista}</p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500">Tom</h3>
        <p className="mt-1 text-sm text-gray-900">{musica.tom}</p>
      </div>

      {musica.observacoes && (
        <div>
          <h3 className="text-sm font-medium text-gray-500">Observações</h3>
          <p className="mt-1 text-sm text-gray-900">{musica.observacoes}</p>
        </div>
      )}
    </div>
  );
} 