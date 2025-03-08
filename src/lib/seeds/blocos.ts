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
]; 