import { Musica } from '../types';

// Função para gerar dados de exemplo de músicas para uma banda específica
export const gerarMusicasSeed = (bandaId: string): Omit<Musica, 'id' | 'createdAt' | 'updatedAt'>[] => {
  return [
    {
      nome: 'Take On Me',
      artista: 'a-ha',
      tom: 'A',
      bpm: 168,
      bandaId,
      observacoes: 'Atenção ao falsete no refrão. Sintetizadores são essenciais.',
    },
    {
      nome: 'Sweet Dreams (Are Made of This)',
      artista: 'Eurythmics',
      tom: 'Cm',
      bpm: 125,
      bandaId,
      observacoes: 'Base de sintetizador marcante. Manter o groove da música.',
    },
    {
      nome: 'Billie Jean',
      artista: 'Michael Jackson',
      tom: 'F#m',
      bpm: 117,
      bandaId,
      observacoes: 'Linha de baixo característica. Dança opcional mas recomendada.',
    },
    {
      nome: 'Girls Just Want to Have Fun',
      artista: 'Cyndi Lauper',
      tom: 'F',
      bpm: 120,
      bandaId,
      observacoes: 'Energia alta do início ao fim. Ótima para animar o público.',
    },
    {
      nome: 'Every Breath You Take',
      artista: 'The Police',
      tom: 'Ab',
      bpm: 117,
      bandaId,
      observacoes: 'Atenção ao padrão do arpejo da guitarra. Manter a dinâmica suave.',
    },
    {
      nome: 'Another One Bites the Dust',
      artista: 'Queen',
      tom: 'Em',
      bpm: 110,
      bandaId,
      observacoes: 'Foco na linha de baixo e na batida. Manter o groove constante.',
    },
    {
      nome: 'Livin\' on a Prayer',
      artista: 'Bon Jovi',
      tom: 'Em',
      bpm: 122,
      bandaId,
      observacoes: 'Atenção à mudança de tom no refrão. Usar talk box se possível.',
    },
    {
      nome: 'Don\'t Stop Believin\'',
      artista: 'Journey',
      tom: 'E',
      bpm: 118,
      bandaId,
      observacoes: 'Introdução de piano icônica. Energia crescente ao longo da música.',
    },
    {
      nome: 'Beat It',
      artista: 'Michael Jackson',
      tom: 'E',
      bpm: 138,
      bandaId,
      observacoes: 'Solo de guitarra desafiador. Manter a atitude e energia.',
    },
    {
      nome: 'I Wanna Dance with Somebody',
      artista: 'Whitney Houston',
      tom: 'G',
      bpm: 118,
      bandaId,
      observacoes: 'Vocais desafiadores. Manter a energia e o ritmo dançante.',
    }
  ];
}; 