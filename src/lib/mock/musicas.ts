import type { Musica } from '@/lib/types';

export const mockMusicas: Musica[] = [
  {
    id: 'musica-1',
    nome: 'Sweet Child O\' Mine',
    artista: 'Guns N\' Roses',
    tom: 'D',
    bpm: 126,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'musica-2',
    nome: 'Nothing Else Matters',
    artista: 'Metallica',
    tom: 'Em',
    bpm: 92,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'musica-3',
    nome: 'Stairway to Heaven',
    artista: 'Led Zeppelin',
    tom: 'Am',
    bpm: 82,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]; 