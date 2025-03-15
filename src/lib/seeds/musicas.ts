import { Musica } from '@/lib/types';

// Função para gerar dados de exemplo de músicas para uma banda específica
export const gerarMusicasSeed = (bandaId: string): Omit<Musica, 'id' | 'createdAt' | 'updatedAt'>[] => {
  return [
    {
      nome: 'Take On Me',
      artista: 'a-ha',
      tom: 'A',
      bpm: 168,
      bandasIds: [bandaId],
      observacoes: 'Atenção ao falsete no refrão. Sintetizadores são essenciais.',
    },
    {
      nome: 'Sweet Dreams (Are Made of This)',
      artista: 'Eurythmics',
      tom: 'Cm',
      bpm: 125,
      bandasIds: [bandaId],
      observacoes: 'Base de sintetizador marcante. Manter o groove da música.',
    },
    {
      nome: 'Billie Jean',
      artista: 'Michael Jackson',
      tom: 'F#m',
      bpm: 117,
      bandasIds: [bandaId],
      observacoes: 'Linha de baixo característica. Dança opcional mas recomendada.',
    },
    {
      nome: 'Girls Just Want to Have Fun',
      artista: 'Cyndi Lauper',
      tom: 'F',
      bpm: 120,
      bandasIds: [bandaId],
      observacoes: 'Energia alta do início ao fim. Ótima para animar o público.',
    },
    {
      nome: 'Every Breath You Take',
      artista: 'The Police',
      tom: 'Ab',
      bpm: 117,
      bandasIds: [bandaId],
      observacoes: 'Atenção ao padrão do arpejo da guitarra. Manter a dinâmica suave.',
    },
    {
      nome: 'Another One Bites the Dust',
      artista: 'Queen',
      tom: 'Em',
      bpm: 110,
      bandasIds: [bandaId],
      observacoes: 'Foco na linha de baixo e na batida. Manter o groove constante.',
    },
    {
      nome: 'Livin\' on a Prayer',
      artista: 'Bon Jovi',
      tom: 'Em',
      bpm: 122,
      bandasIds: [bandaId],
      observacoes: 'Atenção à mudança de tom no refrão. Usar talk box se possível.',
    },
    {
      nome: 'Don\'t Stop Believin\'',
      artista: 'Journey',
      tom: 'E',
      bpm: 118,
      bandasIds: [bandaId],
      observacoes: 'Introdução de piano icônica. Energia crescente ao longo da música.',
    },
    {
      nome: 'Beat It',
      artista: 'Michael Jackson',
      tom: 'E',
      bpm: 138,
      bandasIds: [bandaId],
      observacoes: 'Solo de guitarra desafiador. Manter a atitude e energia.',
    },
    {
      nome: 'I Wanna Dance with Somebody',
      artista: 'Whitney Houston',
      tom: 'G',
      bpm: 118,
      bandasIds: [bandaId],
      observacoes: 'Vocais desafiadores. Manter a energia e o ritmo dançante.',
    }
  ];
};

export const musicasSeed: Musica[] = [
  {
    id: '1',
    nome: 'Bohemian Rhapsody',
    artista: 'Queen',
    tom: 'Bb',
    bpm: 72,
    observacoes: 'Música com várias seções e mudanças de andamento',
    bandasIds: ['1', '3']
  },
  {
    id: '2',
    nome: 'Sweet Child O\' Mine',
    artista: 'Guns N\' Roses',
    tom: 'D',
    bpm: 126,
    observacoes: 'Atenção ao solo de guitarra no meio da música',
    bandasIds: ['2']
  },
  {
    id: '3',
    nome: 'Stairway to Heaven',
    artista: 'Led Zeppelin',
    tom: 'A',
    bpm: 82,
    observacoes: 'Começa lenta e vai acelerando progressivamente',
    bandasIds: ['1']
  },
  {
    id: '4',
    nome: 'Aquarela',
    artista: 'Toquinho',
    tom: 'G',
    bpm: 112,
    observacoes: 'Clássico da MPB, atenção aos dedilhados',
    bandasIds: ['3']
  },
  {
    id: '5',
    nome: 'Evidências',
    artista: 'Chitãozinho & Xororó',
    tom: 'E',
    bpm: 134,
    observacoes: 'Hit tradicional para shows, público geralmente canta junto',
    bandasIds: ['2', '3']
  },
  {
    id: '6',
    nome: 'Tempo Perdido',
    artista: 'Legião Urbana',
    tom: 'A',
    bpm: 148,
    observacoes: 'Rock nacional clássico',
    bandasIds: ['1', '2']
  },
  {
    id: '7',
    nome: 'Garota de Ipanema',
    artista: 'Tom Jobim',
    tom: 'F',
    bpm: 120,
    observacoes: 'Bossa nova clássica, manter o balanço suave',
    bandasIds: ['3']
  },
  {
    id: '8',
    nome: 'Wonderwall',
    artista: 'Oasis',
    tom: 'Fm',
    bpm: 86,
    observacoes: 'Utilizar capotraste na segunda casa',
    bandasIds: ['1', '2']
  },
  {
    id: '9',
    nome: 'Highway to Hell',
    artista: 'AC/DC',
    tom: 'A',
    bpm: 116,
    observacoes: 'Manter energia alta durante toda a execução',
    bandasIds: ['2']
  }
]; 