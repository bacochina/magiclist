import type { Pedaleira } from '@/lib/types';

export const mockPedaleiras: Pedaleira[] = [
  {
    id: 'ped-1',
    nome: 'GT-1000',
    bancos: [
      {
        id: 'banco-1',
        pedaleira_id: 'ped-1',
        numero: 1,
        descricao: 'Banco de Rock',
        patches: [
          {
            id: 'patch-1',
            banco_id: 'banco-1',
            numero: 1,
            tipo: 'Clean',
            descricao: 'Clean com chorus',
            musicas: [],
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'patch-2',
            banco_id: 'banco-1',
            numero: 2,
            tipo: 'Drive',
            descricao: 'Drive para solos',
            musicas: [],
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]; 