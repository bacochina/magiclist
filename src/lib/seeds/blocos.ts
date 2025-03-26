<<<<<<< HEAD
interface Musica {
  id: string;
  nome: string;
  artista: string;
  tom: string;
  bpm: string;
}

interface Bloco {
  id: string;
  bandaId: string;
  nome: string;
  descricao: string;
  musicas: Musica[];
}

// Dados de exemplo - músicas
const musicasExemplo = [
  {
    id: '1',
    nome: 'Evidências',
    artista: 'Chitãozinho & Xororó',
    tom: 'C',
    bpm: '120',
  },
  {
    id: '2',
    nome: 'Sweet Child O\' Mine',
    artista: 'Guns N\' Roses',
    tom: 'D',
    bpm: '126',
  },
  {
    id: '3',
    nome: 'Garota de Ipanema',
    artista: 'Tom Jobim',
    tom: 'F',
    bpm: '130',
  },
  {
    id: '4',
    nome: 'Wonderwall',
    artista: 'Oasis',
    tom: 'Am',
    bpm: '86',
  },
];

// Dados de exemplo - blocos
export const blocosExemplo: Bloco[] = [
  {
    id: '1',
    bandaId: '1',
    nome: 'Abertura',
    descricao: 'Músicas animadas para começar o show',
    musicas: [musicasExemplo[1], musicasExemplo[3]], // Sweet Child e Wonderwall
  },
  {
    id: '2',
    bandaId: '1',
    nome: 'Romântico',
    descricao: 'Baladas e músicas mais calmas',
    musicas: [musicasExemplo[0]], // Evidências
  },
  {
    id: '3',
    bandaId: '2',
    nome: 'MPB',
    descricao: 'Clássicos da música brasileira',
    musicas: [musicasExemplo[2]], // Garota de Ipanema
  },
=======
import { musicasSeed } from './musicas';

export const blocosSeed = [
  {
    id: '1',
    nome: 'Rock Clássico',
    descricao: 'Bloco com músicas clássicas do rock',
    musicas: musicasSeed.slice(0, 3)
  },
  {
    id: '2',
    nome: 'Metal',
    descricao: 'Bloco com músicas de metal',
    musicas: musicasSeed.slice(3, 6)
  },
  {
    id: '3',
    nome: 'Rock Alternativo',
    descricao: 'Bloco com músicas de rock alternativo',
    musicas: musicasSeed.slice(6, 9)
  }
>>>>>>> 5d49630809b82c0fd6e9b76bf3898e17ba9220c6
]; 