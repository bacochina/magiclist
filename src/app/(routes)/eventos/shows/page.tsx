'use client';

import { useState, useEffect } from 'react';
import type { ShowEvento } from '@prisma/client';

export default function ShowsPage() {
  const [shows, setShows] = useState<ShowEvento[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await fetch('/api/shows');
        const data = await response.json();
        setShows(data.shows || []);
      } catch (error) {
        console.error('Erro ao buscar shows:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShows();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shows</h1>
      {shows.length === 0 ? (
        <p className="text-gray-400">Nenhum show encontrado.</p>
      ) : (
        <div className="grid gap-4">
          {shows.map((show) => (
            <div key={show.id} className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-xl font-semibold">{show.titulo}</h2>
              <p className="text-gray-400">Data: {show.data}</p>
              <p className="text-gray-400">Local: {show.local}</p>
              <p className="text-gray-400">Horário: {show.horaInicio} - {show.horaFim}</p>
              <p className="text-gray-400">Status: {show.status}</p>
              {show.descricao && (
                <p className="text-gray-400 mt-2">{show.descricao}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 