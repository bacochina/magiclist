'use client';

<<<<<<< HEAD
import { useState, useEffect, StrictMode } from 'react';
import { Modal } from '@/components/ui/Modal';
import { BlocoForm } from './components/BlocoForm';
import { BlocoDetalhes } from './components/BlocoDetalhes';
import { QueueListIcon } from '@heroicons/react/24/outline';
import { Banda } from '@/lib/types';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from '@hello-pangea/dnd';

// Dados de exemplo - músicas disponíveis
const musicasDisponiveis = [
  // Metallica
  {
    id: 'm1',
    nome: 'Enter Sandman',
    artista: 'Metallica',
    tom: 'Em',
  },
  {
    id: 'm2',
    nome: 'Nothing Else Matters',
    artista: 'Metallica',
    tom: 'Em',
  },
  {
    id: 'm3',
    nome: 'Master of Puppets',
    artista: 'Metallica',
    tom: 'Em',
  },
  {
    id: 'm4',
    nome: 'One',
    artista: 'Metallica',
    tom: 'Bm',
  },
  {
    id: 'm5',
    nome: 'The Unforgiven',
    artista: 'Metallica',
    tom: 'Dm',
  },
  {
    id: 'm6',
    nome: 'Fade to Black',
    artista: 'Metallica',
    tom: 'Em',
  },
  {
    id: 'm7',
    nome: 'Sad But True',
    artista: 'Metallica',
    tom: 'Dm',
  },
  {
    id: 'm8',
    nome: 'For Whom the Bell Tolls',
    artista: 'Metallica',
    tom: 'Em',
  },

  // Iron Maiden
  {
    id: 'm9',
    nome: 'The Trooper',
    artista: 'Iron Maiden',
    tom: 'Em',
  },
  {
    id: 'm10',
    nome: 'Run to the Hills',
    artista: 'Iron Maiden',
    tom: 'Em',
  },
  {
    id: 'm11',
    nome: 'Fear of the Dark',
    artista: 'Iron Maiden',
    tom: 'Am',
  },
  {
    id: 'm12',
    nome: 'Number of the Beast',
    artista: 'Iron Maiden',
    tom: 'Em',
  },
  {
    id: 'm13',
    nome: 'Hallowed Be Thy Name',
    artista: 'Iron Maiden',
    tom: 'Em',
  },
  {
    id: 'm14',
    nome: '2 Minutes to Midnight',
    artista: 'Iron Maiden',
    tom: 'Em',
  },
  {
    id: 'm15',
    nome: 'Aces High',
    artista: 'Iron Maiden',
    tom: 'Em',
  },
  {
    id: 'm16',
    nome: 'Wasted Years',
    artista: 'Iron Maiden',
    tom: 'Em',
  },

  // Pearl Jam
  {
    id: 'm17',
    nome: 'Black',
    artista: 'Pearl Jam',
    tom: 'Am',
  },
  {
    id: 'm18',
    nome: 'Alive',
    artista: 'Pearl Jam',
    tom: 'Em',
  },
  {
    id: 'm19',
    nome: 'Even Flow',
    artista: 'Pearl Jam',
    tom: 'Dm',
  },
  {
    id: 'm20',
    nome: 'Jeremy',
    artista: 'Pearl Jam',
    tom: 'Am',
  },
  {
    id: 'm21',
    nome: 'Yellow Ledbetter',
    artista: 'Pearl Jam',
    tom: 'Em',
  },
  {
    id: 'm22',
    nome: 'Better Man',
    artista: 'Pearl Jam',
    tom: 'C',
  },
  {
    id: 'm23',
    nome: 'Last Kiss',
    artista: 'Pearl Jam',
    tom: 'A',
  },
  {
    id: 'm24',
    nome: 'Daughter',
    artista: 'Pearl Jam',
    tom: 'G',
  },

  // Red Hot Chili Peppers
  {
    id: 'm25',
    nome: 'Under the Bridge',
    artista: 'Red Hot Chili Peppers',
    tom: 'Dm',
  },
  {
    id: 'm26',
    nome: 'Californication',
    artista: 'Red Hot Chili Peppers',
    tom: 'Am',
  },
  {
    id: 'm27',
    nome: 'Scar Tissue',
    artista: 'Red Hot Chili Peppers',
    tom: 'C',
  },
  {
    id: 'm28',
    nome: 'By the Way',
    artista: 'Red Hot Chili Peppers',
    tom: 'Am',
  },
  {
    id: 'm29',
    nome: 'Snow (Hey Oh)',
    artista: 'Red Hot Chili Peppers',
    tom: 'Bm',
  },
  {
    id: 'm30',
    nome: 'Otherside',
    artista: 'Red Hot Chili Peppers',
    tom: 'Am',
  },
  {
    id: 'm31',
    nome: 'Give It Away',
    artista: 'Red Hot Chili Peppers',
    tom: 'Em',
  },
  {
    id: 'm32',
    nome: 'Cant Stop',
    artista: 'Red Hot Chili Peppers',
    tom: 'Em',
  },

  // Foo Fighters
  {
    id: 'm33',
    nome: 'Everlong',
    artista: 'Foo Fighters',
    tom: 'Dm',
  },
  {
    id: 'm34',
    nome: 'The Pretender',
    artista: 'Foo Fighters',
    tom: 'Em',
  },
  {
    id: 'm35',
    nome: 'Best of You',
    artista: 'Foo Fighters',
    tom: 'F',
  },
  {
    id: 'm36',
    nome: 'Learn to Fly',
    artista: 'Foo Fighters',
    tom: 'D',
  },
  {
    id: 'm37',
    nome: 'My Hero',
    artista: 'Foo Fighters',
    tom: 'C',
  },
  {
    id: 'm38',
    nome: 'Times Like These',
    artista: 'Foo Fighters',
    tom: 'D',
  },
  {
    id: 'm39',
    nome: 'All My Life',
    artista: 'Foo Fighters',
    tom: 'Dm',
  },
  {
    id: 'm40',
    nome: 'Monkey Wrench',
    artista: 'Foo Fighters',
    tom: 'E',
  },

  // Radiohead
  {
    id: 'm41',
    nome: 'Creep',
    artista: 'Radiohead',
    tom: 'G',
  },
  {
    id: 'm42',
    nome: 'Karma Police',
    artista: 'Radiohead',
    tom: 'Am',
  },
  {
    id: 'm43',
    nome: 'Paranoid Android',
    artista: 'Radiohead',
    tom: 'Cm',
  },
  {
    id: 'm44',
    nome: 'No Surprises',
    artista: 'Radiohead',
    tom: 'F',
  },
  {
    id: 'm45',
    nome: 'Fake Plastic Trees',
    artista: 'Radiohead',
    tom: 'G',
  },
  {
    id: 'm46',
    nome: 'High and Dry',
    artista: 'Radiohead',
    tom: 'E',
  },
  {
    id: 'm47',
    nome: 'Just',
    artista: 'Radiohead',
    tom: 'Em',
  },
  {
    id: 'm48',
    nome: 'Street Spirit (Fade Out)',
    artista: 'Radiohead',
    tom: 'Am',
  },

  // Arctic Monkeys
  {
    id: 'm49',
    nome: 'Do I Wanna Know?',
    artista: 'Arctic Monkeys',
    tom: 'Em',
  },
  {
    id: 'm50',
    nome: 'R U Mine?',
    artista: 'Arctic Monkeys',
    tom: 'G',
  },
  {
    id: 'm51',
    nome: 'I Bet You Look Good on the Dancefloor',
    artista: 'Arctic Monkeys',
    tom: 'F#m',
  },
  {
    id: 'm52',
    nome: '505',
    artista: 'Arctic Monkeys',
    tom: 'Am',
  },
  {
    id: 'm53',
    nome: "Why'd You Only Call Me When You're High?",
    artista: 'Arctic Monkeys',
    tom: 'Em',
  },
  {
    id: 'm54',
    nome: 'Fluorescent Adolescent',
    artista: 'Arctic Monkeys',
    tom: 'F#',
  },
  {
    id: 'm55',
    nome: 'Snap Out of It',
    artista: 'Arctic Monkeys',
    tom: 'C',
  },
  {
    id: 'm56',
    nome: 'Arabella',
    artista: 'Arctic Monkeys',
    tom: 'G',
  },

  // The Strokes
  {
    id: 'm57',
    nome: 'Last Nite',
    artista: 'The Strokes',
    tom: 'Am',
  },
  {
    id: 'm58',
    nome: 'Reptilia',
    artista: 'The Strokes',
    tom: 'Bm',
  },
  {
    id: 'm59',
    nome: 'Someday',
    artista: 'The Strokes',
    tom: 'C',
  },
  {
    id: 'm60',
    nome: 'You Only Live Once',
    artista: 'The Strokes',
    tom: 'A',
  },
  {
    id: 'm61',
    nome: 'Hard to Explain',
    artista: 'The Strokes',
    tom: 'B',
  },
  {
    id: 'm62',
    nome: 'Under Cover of Darkness',
    artista: 'The Strokes',
    tom: 'D',
  },
  {
    id: 'm63',
    nome: 'The Adults Are Talking',
    artista: 'The Strokes',
    tom: 'Em',
  },
  {
    id: 'm64',
    nome: 'Bad Decisions',
    artista: 'The Strokes',
    tom: 'E',
  },
];

// Dados de exemplo - blocos
const blocosExemplo = [
  // Metallica (id: '1')
  {
    id: '1',
    nome: 'Clássicos do Black Album',
    descricao: 'Músicas do álbum mais famoso da banda',
    bandaId: '1',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm1'), // Enter Sandman
      musicasDisponiveis.find(m => m.id === 'm2'), // Nothing Else Matters
      musicasDisponiveis.find(m => m.id === 'm7'), // Sad But True
      musicasDisponiveis.find(m => m.id === 'm5'), // The Unforgiven
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },
  {
    id: '2',
    nome: 'Thrash Metal Anos 80',
    descricao: 'Músicas rápidas e pesadas da fase inicial',
    bandaId: '1',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm3'), // Master of Puppets
      musicasDisponiveis.find(m => m.id === 'm8'), // For Whom the Bell Tolls
      musicasDisponiveis.find(m => m.id === 'm4'), // One
      musicasDisponiveis.find(m => m.id === 'm6'), // Fade to Black
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },
  {
    id: '3',
    nome: 'Baladas Power',
    descricao: 'As melhores power ballads da banda',
    bandaId: '1',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm2'), // Nothing Else Matters
      musicasDisponiveis.find(m => m.id === 'm5'), // The Unforgiven
      musicasDisponiveis.find(m => m.id === 'm6'), // Fade to Black
      musicasDisponiveis.find(m => m.id === 'm4'), // One
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },
  {
    id: '4',
    nome: 'Era Load/Reload',
    descricao: 'Músicas do período experimental da banda',
    bandaId: '1',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm1'), // Enter Sandman
      musicasDisponiveis.find(m => m.id === 'm7'), // Sad But True
      musicasDisponiveis.find(m => m.id === 'm5'), // The Unforgiven
      musicasDisponiveis.find(m => m.id === 'm2'), // Nothing Else Matters
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },
  {
    id: '5',
    nome: 'Hits de Arena',
    descricao: 'Músicas perfeitas para shows em estádios',
    bandaId: '1',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm1'), // Enter Sandman
      musicasDisponiveis.find(m => m.id === 'm3'), // Master of Puppets
      musicasDisponiveis.find(m => m.id === 'm8'), // For Whom the Bell Tolls
      musicasDisponiveis.find(m => m.id === 'm2'), // Nothing Else Matters
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },

  // Iron Maiden (id: '2')
  {
    id: '6',
    nome: 'Épicos Históricos',
    descricao: 'Músicas sobre eventos e personagens históricos',
    bandaId: '2',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm9'), // The Trooper
      musicasDisponiveis.find(m => m.id === 'm10'), // Run to the Hills
      musicasDisponiveis.find(m => m.id === 'm13'), // Hallowed Be Thy Name
      musicasDisponiveis.find(m => m.id === 'm14'), // 2 Minutes to Midnight
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },
  {
    id: '7',
    nome: 'Clássicos dos Anos 80',
    descricao: 'Os maiores hits da era de ouro',
    bandaId: '2',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm12'), // Number of the Beast
      musicasDisponiveis.find(m => m.id === 'm15'), // Aces High
      musicasDisponiveis.find(m => m.id === 'm16'), // Wasted Years
      musicasDisponiveis.find(m => m.id === 'm9'), // The Trooper
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },
  {
    id: '8',
    nome: 'Era Bruce Dickinson',
    descricao: 'Músicas da fase clássica com Bruce nos vocais',
    bandaId: '2',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm11'), // Fear of the Dark
      musicasDisponiveis.find(m => m.id === 'm12'), // Number of the Beast
      musicasDisponiveis.find(m => m.id === 'm13'), // Hallowed Be Thy Name
      musicasDisponiveis.find(m => m.id === 'm14'), // 2 Minutes to Midnight
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },
  {
    id: '9',
    nome: 'Instrumental Showcase',
    descricao: 'Destaque para as partes instrumentais complexas',
    bandaId: '2',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm13'), // Hallowed Be Thy Name
      musicasDisponiveis.find(m => m.id === 'm15'), // Aces High
      musicasDisponiveis.find(m => m.id === 'm9'), // The Trooper
      musicasDisponiveis.find(m => m.id === 'm11'), // Fear of the Dark
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },
  {
    id: '10',
    nome: 'Hits de Festival',
    descricao: 'Músicas que não podem faltar em festivais',
    bandaId: '2',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm12'), // Number of the Beast
      musicasDisponiveis.find(m => m.id === 'm9'), // The Trooper
      musicasDisponiveis.find(m => m.id === 'm10'), // Run to the Hills
      musicasDisponiveis.find(m => m.id === 'm11'), // Fear of the Dark
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },

  // Pearl Jam (id: '3')
  {
    id: '11',
    nome: 'Grunge Essencial',
    descricao: 'Músicas que definiram o som do grunge',
    bandaId: '3',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm18'), // Alive
      musicasDisponiveis.find(m => m.id === 'm19'), // Even Flow
      musicasDisponiveis.find(m => m.id === 'm20'), // Jeremy
      musicasDisponiveis.find(m => m.id === 'm17'), // Black
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },
  {
    id: '12',
    nome: 'Acústico Especial',
    descricao: 'Versões acústicas e mais intimistas',
    bandaId: '3',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm17'), // Black
      musicasDisponiveis.find(m => m.id === 'm21'), // Yellow Ledbetter
      musicasDisponiveis.find(m => m.id === 'm22'), // Better Man
      musicasDisponiveis.find(m => m.id === 'm24'), // Daughter
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },
  {
    id: '13',
    nome: 'Hits do Ten',
    descricao: 'Músicas do álbum de estreia icônico',
    bandaId: '3',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm18'), // Alive
      musicasDisponiveis.find(m => m.id === 'm19'), // Even Flow
      musicasDisponiveis.find(m => m.id === 'm20'), // Jeremy
      musicasDisponiveis.find(m => m.id === 'm17'), // Black
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },
  {
    id: '14',
    nome: 'Rock Alternativo',
    descricao: 'Músicas que mostram o lado alternativo da banda',
    bandaId: '3',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm22'), // Better Man
      musicasDisponiveis.find(m => m.id === 'm24'), // Daughter
      musicasDisponiveis.find(m => m.id === 'm21'), // Yellow Ledbetter
      musicasDisponiveis.find(m => m.id === 'm23'), // Last Kiss
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },
  {
    id: '15',
    nome: 'Experimentais',
    descricao: 'Músicas com arranjos mais experimentais',
    bandaId: '3',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm24'), // Daughter
      musicasDisponiveis.find(m => m.id === 'm21'), // Yellow Ledbetter
      musicasDisponiveis.find(m => m.id === 'm19'), // Even Flow
      musicasDisponiveis.find(m => m.id === 'm20'), // Jeremy
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },

  // Red Hot Chili Peppers (id: '4')
  {
    id: '16',
    nome: 'Funk Rock',
    descricao: 'Músicas com groove funk característico',
    bandaId: '4',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm31'), // Give It Away
      musicasDisponiveis.find(m => m.id === 'm32'), // Cant Stop
      musicasDisponiveis.find(m => m.id === 'm28'), // By the Way
      musicasDisponiveis.find(m => m.id === 'm26'), // Californication
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },
  {
    id: '17',
    nome: 'Baladas Californianas',
    descricao: 'Músicas mais melódicas e reflexivas',
    bandaId: '4',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm25'), // Under the Bridge
      musicasDisponiveis.find(m => m.id === 'm27'), // Scar Tissue
      musicasDisponiveis.find(m => m.id === 'm30'), // Otherside
      musicasDisponiveis.find(m => m.id === 'm26'), // Californication
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },
  {
    id: '18',
    nome: 'Era John Frusciante',
    descricao: 'Músicas com os solos marcantes de Frusciante',
    bandaId: '4',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm29'), // Snow (Hey Oh)
      musicasDisponiveis.find(m => m.id === 'm25'), // Under the Bridge
      musicasDisponiveis.find(m => m.id === 'm27'), // Scar Tissue
      musicasDisponiveis.find(m => m.id === 'm28'), // By the Way
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },
  {
    id: '19',
    nome: 'Hits dos Anos 90',
    descricao: 'Sucessos da fase mais popular da banda',
    bandaId: '4',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm25'), // Under the Bridge
      musicasDisponiveis.find(m => m.id === 'm31'), // Give It Away
      musicasDisponiveis.find(m => m.id === 'm30'), // Otherside
      musicasDisponiveis.find(m => m.id === 'm27'), // Scar Tissue
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },
  {
    id: '20',
    nome: 'Psicodélicos',
    descricao: 'Músicas com elementos psicodélicos',
    bandaId: '4',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm26'), // Californication
      musicasDisponiveis.find(m => m.id === 'm29'), // Snow (Hey Oh)
      musicasDisponiveis.find(m => m.id === 'm28'), // By the Way
      musicasDisponiveis.find(m => m.id === 'm32'), // Cant Stop
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },

  // Foo Fighters (id: '5')
  {
    id: '21',
    nome: 'Rock Energético',
    descricao: 'Músicas com alta energia e refrões marcantes',
    bandaId: '5',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm34'), // The Pretender
      musicasDisponiveis.find(m => m.id === 'm35'), // Best of You
      musicasDisponiveis.find(m => m.id === 'm39'), // All My Life
      musicasDisponiveis.find(m => m.id === 'm40'), // Monkey Wrench
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },
  {
    id: '22',
    nome: 'Acústico e Melodias',
    descricao: 'Lado mais melódico e acústico da banda',
    bandaId: '5',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm33'), // Everlong
      musicasDisponiveis.find(m => m.id === 'm36'), // Learn to Fly
      musicasDisponiveis.find(m => m.id === 'm37'), // My Hero
      musicasDisponiveis.find(m => m.id === 'm38'), // Times Like These
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },
  {
    id: '23',
    nome: 'Hits de Rádio',
    descricao: 'Sucessos que tocaram nas rádios',
    bandaId: '5',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm33'), // Everlong
      musicasDisponiveis.find(m => m.id === 'm34'), // The Pretender
      musicasDisponiveis.find(m => m.id === 'm35'), // Best of You
      musicasDisponiveis.find(m => m.id === 'm36'), // Learn to Fly
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },
  {
    id: '24',
    nome: 'Hard Rock',
    descricao: 'Músicas mais pesadas e intensas',
    bandaId: '5',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm39'), // All My Life
      musicasDisponiveis.find(m => m.id === 'm40'), // Monkey Wrench
      musicasDisponiveis.find(m => m.id === 'm34'), // The Pretender
      musicasDisponiveis.find(m => m.id === 'm35'), // Best of You
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },
  {
    id: '25',
    nome: 'Tributo a Taylor',
    descricao: 'Músicas em homenagem a Taylor Hawkins',
    bandaId: '5',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm37'), // My Hero
      musicasDisponiveis.find(m => m.id === 'm38'), // Times Like These
      musicasDisponiveis.find(m => m.id === 'm33'), // Everlong
      musicasDisponiveis.find(m => m.id === 'm36'), // Learn to Fly
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },

  // Radiohead (id: '6')
  {
    id: '26',
    nome: 'Era OK Computer',
    descricao: 'Músicas do álbum revolucionário',
    bandaId: '6',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm42'), // Karma Police
      musicasDisponiveis.find(m => m.id === 'm43'), // Paranoid Android
      musicasDisponiveis.find(m => m.id === 'm44'), // No Surprises
      musicasDisponiveis.find(m => m.id === 'm47'), // Just
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },
  {
    id: '27',
    nome: 'Experimental',
    descricao: 'Músicas com elementos eletrônicos e experimentais',
    bandaId: '6',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm43'), // Paranoid Android
      musicasDisponiveis.find(m => m.id === 'm44'), // No Surprises
      musicasDisponiveis.find(m => m.id === 'm48'), // Street Spirit (Fade Out)
      musicasDisponiveis.find(m => m.id === 'm42'), // Karma Police
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },
  {
    id: '28',
    nome: 'Rock Alternativo',
    descricao: 'Músicas da fase mais roqueira',
    bandaId: '6',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm41'), // Creep
      musicasDisponiveis.find(m => m.id === 'm47'), // Just
      musicasDisponiveis.find(m => m.id === 'm46'), // High and Dry
      musicasDisponiveis.find(m => m.id === 'm45'), // Fake Plastic Trees
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },
  {
    id: '29',
    nome: 'Atmosféricos',
    descricao: 'Músicas com atmosferas densas e complexas',
    bandaId: '6',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm48'), // Street Spirit (Fade Out)
      musicasDisponiveis.find(m => m.id === 'm44'), // No Surprises
      musicasDisponiveis.find(m => m.id === 'm45'), // Fake Plastic Trees
      musicasDisponiveis.find(m => m.id === 'm42'), // Karma Police
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },
  {
    id: '30',
    nome: 'Clássicos',
    descricao: 'Hits indispensáveis da banda',
    bandaId: '6',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm41'), // Creep
      musicasDisponiveis.find(m => m.id === 'm42'), // Karma Police
      musicasDisponiveis.find(m => m.id === 'm43'), // Paranoid Android
      musicasDisponiveis.find(m => m.id === 'm45'), // Fake Plastic Trees
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },

  // Arctic Monkeys (id: '7')
  {
    id: '31',
    nome: 'Indie Rock',
    descricao: 'Músicas da fase inicial indie rock',
    bandaId: '7',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm51'), // I Bet You Look Good on the Dancefloor
      musicasDisponiveis.find(m => m.id === 'm54'), // Fluorescent Adolescent
      musicasDisponiveis.find(m => m.id === 'm52'), // 505
      musicasDisponiveis.find(m => m.id === 'm50'), // R U Mine?
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },
  {
    id: '32',
    nome: 'Era AM',
    descricao: 'Músicas do álbum AM, mais dançantes',
    bandaId: '7',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm49'), // Do I Wanna Know?
      musicasDisponiveis.find(m => m.id === 'm50'), // R U Mine?
      musicasDisponiveis.find(m => m.id === 'm53'), // Why'd You Only Call Me When You're High?
      musicasDisponiveis.find(m => m.id === 'm56'), // Arabella
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },
  {
    id: '33',
    nome: 'Hits Britânicos',
    descricao: 'Sucessos que dominaram as paradas britânicas',
    bandaId: '7',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm51'), // I Bet You Look Good on the Dancefloor
      musicasDisponiveis.find(m => m.id === 'm49'), // Do I Wanna Know?
      musicasDisponiveis.find(m => m.id === 'm54'), // Fluorescent Adolescent
      musicasDisponiveis.find(m => m.id === 'm50'), // R U Mine?
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },
  {
    id: '34',
    nome: 'Rock Alternativo',
    descricao: 'Músicas que mostram a evolução do som da banda',
    bandaId: '7',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm52'), // 505
      musicasDisponiveis.find(m => m.id === 'm55'), // Snap Out of It
      musicasDisponiveis.find(m => m.id === 'm56'), // Arabella
      musicasDisponiveis.find(m => m.id === 'm53'), // Why'd You Only Call Me When You're High?
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },
  {
    id: '35',
    nome: 'Lounge',
    descricao: 'Músicas mais suaves e atmosféricas',
    bandaId: '7',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm52'), // 505
      musicasDisponiveis.find(m => m.id === 'm55'), // Snap Out of It
      musicasDisponiveis.find(m => m.id === 'm49'), // Do I Wanna Know?
      musicasDisponiveis.find(m => m.id === 'm56'), // Arabella
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },

  // The Strokes (id: '8')
  {
    id: '36',
    nome: 'Garage Rock',
    descricao: 'Músicas do início da banda, som cru de garagem',
    bandaId: '8',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm57'), // Last Nite
      musicasDisponiveis.find(m => m.id === 'm59'), // Someday
      musicasDisponiveis.find(m => m.id === 'm61'), // Hard to Explain
      musicasDisponiveis.find(m => m.id === 'm58'), // Reptilia
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },
  {
    id: '37',
    nome: 'Indie Classics',
    descricao: 'Clássicos que definiram o indie rock dos anos 2000',
    bandaId: '8',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm57'), // Last Nite
      musicasDisponiveis.find(m => m.id === 'm58'), // Reptilia
      musicasDisponiveis.find(m => m.id === 'm59'), // Someday
      musicasDisponiveis.find(m => m.id === 'm60'), // You Only Live Once
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },
  {
    id: '38',
    nome: 'New Wave',
    descricao: 'Músicas com influência new wave',
    bandaId: '8',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm62'), // Under Cover of Darkness
      musicasDisponiveis.find(m => m.id === 'm63'), // The Adults Are Talking
      musicasDisponiveis.find(m => m.id === 'm64'), // Bad Decisions
      musicasDisponiveis.find(m => m.id === 'm60'), // You Only Live Once
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },
  {
    id: '39',
    nome: 'Hits do Is This It',
    descricao: 'Músicas do álbum de estreia revolucionário',
    bandaId: '8',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm57'), // Last Nite
      musicasDisponiveis.find(m => m.id === 'm59'), // Someday
      musicasDisponiveis.find(m => m.id === 'm61'), // Hard to Explain
      musicasDisponiveis.find(m => m.id === 'm58'), // Reptilia
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },
  {
    id: '40',
    nome: 'Experimentais',
    descricao: 'Músicas da fase mais experimental da banda',
    bandaId: '8',
    musicas: [
      musicasDisponiveis.find(m => m.id === 'm63'), // The Adults Are Talking
      musicasDisponiveis.find(m => m.id === 'm64'), // Bad Decisions
      musicasDisponiveis.find(m => m.id === 'm62'), // Under Cover of Darkness
      musicasDisponiveis.find(m => m.id === 'm60'), // You Only Live Once
    ].filter((m): m is NonNullable<typeof m> => m !== undefined),
  },
];
=======
import { useState, useEffect, useCallback } from 'react';
import { Modal } from '@/components/ui/Modal';
import FormBloco from './components/FormBloco';
import { MusicaForm } from './components/MusicaForm';
import { Banda, Bloco, Musica } from '@/lib/types';
import { useHydratedLocalStorage } from '@/hooks/useHydratedLocalStorage';
import { bandasSeed } from '@/lib/seeds/bandas';
import { gerarMusicasSeed } from '@/lib/seeds/musicas';
import { BlocosDaBanda } from './components/BlocosDaBanda';
import BlocosGrid from './components/BlocosGrid';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DragDropContext, DropResult as HelloDropResult } from '@hello-pangea/dnd';
import DraggableBlocoItem from './components/DraggableBlocoItem';
import { updateBlocosOrder } from '@/lib/actions';
import Link from 'next/link';
import { 
  Music, 
  Search, 
  Filter, 
  Plus,
  List,
  Grid,
  ChevronDown,
  ChevronUp,
  Users,
  Tag
} from 'lucide-react';
import { confirmar, alertaSucesso, alertaErro } from '@/lib/sweetalert';

// Interface para compatibilidade entre react-dnd e o antigo @hello-pangea/dnd
interface DropResult {
  source: {
    index: number;
    droppableId: string;
  };
  destination?: {
    index: number;
    droppableId: string;
  } | null;
  draggableId: string;
  type: string;
  mode: string;
  combine: null;
  reason: string;
}

// Dados iniciais para os blocos
const blocosSeedInicial = [
  {
    id: '1',
    nome: 'Rock Clássico',
    descricao: 'Bloco com músicas clássicas do rock',
    bandaId: '1', // Metallica
    musicas: []
  },
  {
    id: '2',
    nome: 'Pop Anos 80',
    descricao: 'Bloco com hits dos anos 80',
    bandaId: '2', // Iron Maiden
    musicas: []
  }
];

// Card de estatísticas para a página de blocos
const BlocoStatCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => (
  <div className="stat-card p-5">
    <div className="flex items-center space-x-3 mb-2">
      <div className="p-2 rounded-md bg-gray-700 text-purple-400">
        {icon}
      </div>
      <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
    </div>
    <div className="text-2xl font-bold text-white">{value}</div>
  </div>
);
>>>>>>> 5d49630809b82c0fd6e9b76bf3898e17ba9220c6

interface Musica {
  id: string;
  nome: string;
  artista: string;
  tom: string;
  bpm?: string;
}

interface BlocoMusical {
  id: string;
  nome: string;
  descricao?: string;
  musicas: Musica[];
  bandaId?: string;
}

export default function BlocosPage() {
<<<<<<< HEAD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blocos, setBlocos] = useState<BlocoMusical[]>(blocosExemplo);
  const [blocoSelecionado, setBlocoSelecionado] = useState<BlocoMusical | null>(null);
  const [isDetalhesOpen, setIsDetalhesOpen] = useState(false);
  const [blocoEditando, setBlocoEditando] = useState<BlocoMusical | null>(null);
  const [bandas, setBandas] = useState<Banda[]>([]);

  useEffect(() => {
    const carregarBandas = async () => {
      try {
        const response = await fetch('/api/bandas');
        if (!response.ok) {
          throw new Error('Erro ao carregar bandas');
        }
        const data = await response.json();
        setBandas(data.bandas || []);
      } catch (error) {
        console.error('Erro:', error);
      }
    };

    carregarBandas();
  }, []);

  const getNomeBanda = (bandaId: string) => {
    const banda = bandas.find(b => b.id === bandaId);
    return banda ? banda.nome : 'Banda não encontrada';
  };

  const handleSubmit = async (data: any) => {
    if (blocoEditando) {
      // Atualiza o bloco existente
      setBlocos(blocos.map(b => 
        b.id === blocoEditando.id 
          ? { ...blocoEditando, ...data, musicas: blocoEditando.musicas.filter((m): m is NonNullable<typeof m> => m !== undefined) }
          : b
      ));
      setBlocoEditando(null);
    } else {
      // Cria um novo bloco
      const novoBloco = {
        ...data,
        id: (blocos.length + 1).toString(),
        musicas: [],
      };
      setBlocos([...blocos, novoBloco]);
    }
    setIsModalOpen(false);
  };

  const handleEditar = (bloco: BlocoMusical) => {
    setBlocoEditando(bloco);
    setIsModalOpen(true);
  };

  const handleVerDetalhes = (bloco: BlocoMusical) => {
    setBlocoSelecionado(bloco);
    setIsDetalhesOpen(true);
=======
  const [bandas, setBandas] = useHydratedLocalStorage<Banda[]>('bandas', bandasSeed);
  const [blocos, setBlocos] = useHydratedLocalStorage<Bloco[]>('blocos', blocosSeedInicial);
  const [musicas, setMusicas] = useHydratedLocalStorage<Musica[]>('musicas', []);
  const [bandaSelecionada, setBandaSelecionada] = useState<string | null>(null);
  const [modalBlocoAberto, setModalBlocoAberto] = useState(false);
  const [modalMusicaAberto, setModalMusicaAberto] = useState(false);
  const [blocoEmEdicao, setBlocoEmEdicao] = useState<Bloco | null>(null);
  const [busca, setBusca] = useState('');
  const [modoVisualizacao, setModoVisualizacao] = useState<'cartoes' | 'lista'>('lista');
  const [loading, setLoading] = useState(true);

  // Verificar se existem músicas e adicionar músicas de exemplo se não houver
  useEffect(() => {
    if (musicas.length === 0) {
      // Gerar músicas de exemplo para cada banda
      const musicasExemplo: Musica[] = [];
      
      // Para cada banda, gerar algumas músicas
      bandas.forEach(banda => {
        const musicasBanda = gerarMusicasSeed(banda.id).map(m => ({
          id: Math.random().toString(36).substr(2, 9),
          nome: m.nome,
          artista: m.artista,
          tom: m.tom,
          bpm: m.bpm,
          observacoes: m.observacoes
        }));
        
        // Adicionar apenas as primeiras 3 músicas de cada banda para não sobrecarregar
        musicasExemplo.push(...musicasBanda.slice(0, 3));
      });
      
      setMusicas(musicasExemplo);
    }
    setLoading(false);
  }, [bandas, musicas.length, setMusicas]);

  // Filtrar blocos com base na banda selecionada e na busca
  const blocosFiltrados = Array.isArray(blocos) 
    ? blocos.filter(bloco => {
        // Filtrar por banda
        const bandaOk = !bandaSelecionada || bloco.bandaId === bandaSelecionada;
        // Filtrar por busca
        const buscaOk = !busca || 
          bloco.nome.toLowerCase().includes(busca.toLowerCase()) ||
          (bloco.descricao && bloco.descricao.toLowerCase().includes(busca.toLowerCase()));
        
        return bandaOk && buscaOk;
      })
    : [];

  const handleSelecionarBanda = (bandaId: string) => {
    setBandaSelecionada(bandaId === '' ? null : bandaId);
  };

  const handleAdicionarBloco = () => {
    setBlocoEmEdicao(null);
    setModalBlocoAberto(true);
>>>>>>> 5d49630809b82c0fd6e9b76bf3898e17ba9220c6
  };

  const handleEditarBloco = (bloco: Bloco) => {
    setBlocoEmEdicao(bloco);
    setModalBlocoAberto(true);
  };

<<<<<<< HEAD
    const musica = musicasDisponiveis.find(m => m.id === musicaId);
    if (!musica) return;
=======
  const handleExcluirBloco = async (id: string) => {
    const bloco = blocos.find(b => b.id === id);
    
    if (!bloco) return;
    
    const confirmado = await confirmar(
      'Excluir bloco',
      `Tem certeza que deseja excluir o bloco "${bloco.nome}"?`,
      'warning'
    );
    
    if (confirmado) {
      const novosBlocos = blocos.filter(b => b.id !== id);
      setBlocos(novosBlocos);
      alertaSucesso('Bloco excluído com sucesso!');
    }
  };
>>>>>>> 5d49630809b82c0fd6e9b76bf3898e17ba9220c6

  const handleSubmitBloco = (data: Partial<Bloco>) => {
    if (blocoEmEdicao) {
      // Editando um bloco existente
      const novosBlocos = blocos.map(b => 
          b.id === blocoEmEdicao.id
          ? { ...b, ...data, musicas: b.musicas || [] } 
            : b
      );
      
      setBlocos(novosBlocos);
      alertaSucesso('Bloco atualizado com sucesso!');
    } else {
      // Criando um novo bloco
      const novoBloco: Bloco = {
        id: String(Date.now()),
        nome: data.nome || 'Novo Bloco',
        descricao: data.descricao || '',
        bandaId: data.bandaId || bandaSelecionada || undefined,
        musicas: []
      };
      
      setBlocos([...blocos, novoBloco]);
      alertaSucesso('Bloco criado com sucesso!');
    }
    
    setModalBlocoAberto(false);
    setBlocoEmEdicao(null);
  };

  const handleSubmitMusica = (data: Partial<Musica>) => {
    // Criar uma nova música
      const novaMusica: Musica = {
      id: String(Date.now()),
      nome: data.nome || 'Nova Música',
        artista: data.artista || '',
        tom: data.tom || '',
        bpm: data.bpm || 0,
      observacoes: data.observacoes || ''
    };
<<<<<<< HEAD

    setBlocos(blocos.map(b => 
      b.id === blocoSelecionado.id ? blocoAtualizado : b
    ));
    setBlocoSelecionado(blocoAtualizado);
=======
    
    // Adicionar a nova música ao array de músicas
    const novasMusicas = [...musicas, novaMusica];
    setMusicas(novasMusicas);
    
    // Fechar o modal
    setModalMusicaAberto(false);
    
    alertaSucesso('Música criada com sucesso!');
>>>>>>> 5d49630809b82c0fd6e9b76bf3898e17ba9220c6
  };

  // Função para lidar com o resultado do drag and drop
  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    
    // Se não há destino (arrastou para fora de uma área válida), não faz nada
    if (!destination) {
      return;
    }

<<<<<<< HEAD
    const blocoAtualizado = {
      ...blocoSelecionado,
      musicas: blocoSelecionado.musicas.filter(m => m.id !== musicaId),
    };

    setBlocos(blocos.map(b => 
      b.id === blocoSelecionado.id ? blocoAtualizado : b
    ));
    setBlocoSelecionado(blocoAtualizado);
=======
    // Se o item foi largado na mesma posição, não faz nada
    if (source.index === destination.index) {
      return;
    }

    // Reordenar os blocos
    const novosBlocos = Array.from(blocos);
    const [removido] = novosBlocos.splice(source.index, 1);
    novosBlocos.splice(destination.index, 0, removido);
    
    // Atualizar o estado
    setBlocos(novosBlocos);
    
    // Chamar a função de atualização da ordem (opcional, caso precise persistir no banco)
    updateBlocosOrder(novosBlocos)
      .then(() => console.log('Ordem dos blocos atualizada com sucesso!'))
      .catch(error => console.error('Erro ao atualizar a ordem dos blocos:', error));
  };

  // Função para reordenar blocos (usada pelo componente de arrastar)
  const handleReordenarBlocos = (novosBlocos: Bloco[]) => {
    setBlocos(novosBlocos);
  };

  // Função para mover um bloco de um índice para outro
  const handleMoveBloco = useCallback((dragIndex: number, hoverIndex: number) => {
    // Atualiza o estado local imediatamente para melhor UX
    const updatedBlocos = [...blocos];
    const [movedBloco] = updatedBlocos.splice(dragIndex, 1);
    updatedBlocos.splice(hoverIndex, 0, movedBloco);
    
    // Atualiza o estado com a nova ordem
    setBlocos(updatedBlocos);
    
    // Salva a nova ordem no backend
    updateBlocosOrder(updatedBlocos).catch(error => {
      console.error("Erro ao salvar a ordem dos blocos:", error);
    });
  }, [blocos, setBlocos]);

  // Função para reordenar músicas dentro de um bloco
  const handleReordenarMusicas = (blocoId: string, novasMusicas: Musica[]) => {
    // Extrair apenas os IDs das músicas
    const musicasIds = novasMusicas.map(m => m.id);
    
    // Atualizar o bloco com os novos IDs de músicas
    const novosBlocos = blocos.map(b => 
      b.id === blocoId ? { ...b, musicas: musicasIds } : b
    );
    
    setBlocos(novosBlocos);
  };

  // Função para adicionar músicas a um bloco
  const handleAdicionarMusicaAoBloco = (blocoId: string) => {
    setModalMusicaAberto(true);
  };

  // Função para lidar com o resultado do drag and drop de músicas
  const handleMusicasDragEnd = (result: DropResult, blocoId: string) => {
    const { source, destination } = result;
    
    // Se não há destino, não faz nada
    if (!destination) {
      return;
    }
    
    // Se o item foi largado na mesma posição, não faz nada
    if (source.index === destination.index) {
      return;
    }
    
    // Encontrar o bloco e suas músicas
    const bloco = blocos.find(b => b.id === blocoId);
    if (!bloco || !Array.isArray(bloco.musicas)) return;
    
    // Extrair os objetos de música com base nos IDs
    const blocosMusicas = Array.isArray(bloco.musicas) 
      ? bloco.musicas.map(id => musicas.find(m => m.id === id)).filter(Boolean) as Musica[]
      : [];
    
    // Reordenar as músicas
    const novasMusicas = Array.from(blocosMusicas);
    const [removida] = novasMusicas.splice(source.index, 1);
    novasMusicas.splice(destination.index, 0, removida);
    
    // Atualizar o bloco
    handleReordenarMusicas(blocoId, novasMusicas);
  };

  // Calcular estatísticas
  const totalBlocos = Array.isArray(blocos) ? blocos.length : 0;
  const blocosComMusicas = Array.isArray(blocos) 
    ? blocos.filter(b => Array.isArray(b.musicas) && b.musicas.length > 0).length 
    : 0;
  const musicasTotais = Array.isArray(blocos) 
    ? blocos.reduce((acc, bloco) => acc + (Array.isArray(bloco.musicas) ? bloco.musicas.length : 0), 0) 
    : 0;

  // Adicionar uma função de adaptação entre os dois sistemas de drag and drop
  const handleHelloDragEnd = (result: HelloDropResult) => {
    // Adaptar o resultado do @hello-pangea/dnd para o formato esperado pelo nosso sistema
    if (!result.destination) {
      return;
    }
    
    const adaptedResult: DropResult = {
      source: result.source,
      destination: result.destination,
      draggableId: result.draggableId,
      type: result.type,
      mode: 'FLUID',
      combine: null,
      reason: 'DROP'
    };
    
    handleDragEnd(adaptedResult);
>>>>>>> 5d49630809b82c0fd6e9b76bf3898e17ba9220c6
  };

  const handleReordenarMusicas = (blocoId: string, musicasReordenadas: Musica[]) => {
    const blocoAtualizado = {
      ...blocoSelecionado!,
      musicas: musicasReordenadas,
    };

    setBlocos(blocos.map(b => 
      b.id === blocoId ? blocoAtualizado : b
    ));
    setBlocoSelecionado(blocoAtualizado);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    const newBlocos = Array.from(blocos);
    const [movedBloco] = newBlocos.splice(sourceIndex, 1);
    newBlocos.splice(destinationIndex, 0, movedBloco);

    setBlocos(newBlocos);
  };

  const handleDragStart = () => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(100);
    }
  };

  const handleDuplicar = (bloco: BlocoMusical) => {
    const novoBloco = {
      ...bloco,
      id: (blocos.length + 1).toString(),
      nome: `${bloco.nome} (Cópia)`,
    };
    
    // Encontra o índice do bloco original
    const indexOriginal = blocos.findIndex(b => b.id === bloco.id);
    
    // Cria um novo array com a cópia inserida após o original
    const novoBlocos = [...blocos];
    novoBlocos.splice(indexOriginal + 1, 0, novoBloco);
    
    setBlocos(novoBlocos);
  };

  return (
    <DragDropContext onDragEnd={handleHelloDragEnd}>
      <DndProvider backend={HTML5Backend}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Blocos Musicais</h1>
              <p className="text-gray-400">Organize suas músicas em blocos para shows e ensaios</p>
            </div>
          </div>

<<<<<<< HEAD
        {/* Lista de Blocos com Drag and Drop */}
        <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
          <Droppable droppableId="blocos">
            {(provided: DroppableProvided) => (
              <div 
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {blocos.map((bloco, index) => (
                  <Draggable 
                    key={bloco.id} 
                    draggableId={bloco.id} 
                    index={index}
                  >
                    {(provided: DraggableProvided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`bg-white p-4 rounded-lg shadow ${
                          snapshot.isDragging ? 'shadow-lg ring-2 ring-indigo-500' : ''
                        }`}
                      >
                        <div className="flex items-center">
                          <div 
                            {...provided.dragHandleProps}
                            className="mr-4"
                          >
                            <QueueListIcon 
                              className="h-6 w-6 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-medium">
                              {(index + 1).toString().padStart(2, '0')} • {bloco.nome}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {bloco.musicas.length} músicas • {bloco.musicas.length * 4} minutos
                            </p>
                            <p className="text-sm text-gray-500">
                              {getNomeBanda(bloco.bandaId || '')}
                            </p>
                            {bloco.descricao && (
                              <p className="mt-1 text-sm text-gray-500">{bloco.descricao}</p>
                            )}
                          </div>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleVerDetalhes(bloco)}
                              className="text-sm text-indigo-600 hover:text-indigo-900"
                            >
                              Gerenciar Músicas
                            </button>
                            <button
                              onClick={() => handleEditar(bloco)}
                              className="text-sm text-indigo-600 hover:text-indigo-900"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDuplicar(bloco)}
                              className="text-sm text-indigo-600 hover:text-indigo-900"
                            >
                              Duplicar
                            </button>
                            <button className="text-sm text-red-600 hover:text-red-900">
                              Excluir
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
=======
          {/* Cards de estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <BlocoStatCard 
              title="Total de Blocos" 
              value={totalBlocos} 
              icon={<Music size={20} />}
            />
            <BlocoStatCard 
              title="Blocos com Músicas" 
              value={blocosComMusicas} 
              icon={<Tag size={20} />}
            />
            <BlocoStatCard 
              title="Músicas em Blocos" 
              value={musicasTotais} 
              icon={<Music size={20} />}
            />
          </div>
                    
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
              {/* Filtros e Busca */}
              <div className="p-4 border-b border-gray-700 flex flex-wrap items-center justify-between gap-4">
                <div className="relative flex-1 min-w-[250px]">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                      <input
                        type="text"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        placeholder="Buscar blocos..."
                    className="bg-gray-900 text-white pl-10 pr-4 py-2 rounded-md border border-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <Filter size={18} className="text-gray-400" />
                    <select
                      value={bandaSelecionada || ''}
                      onChange={(e) => handleSelecionarBanda(e.target.value)}
                      className="bg-gray-900 text-white px-3 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Todas as bandas</option>
                      {Array.isArray(bandas) && bandas.map((banda) => (
                        <option key={banda.id} value={banda.id}>
                          {banda.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                    
                  {/* Botões de visualização - Lista primeiro, depois cartões */}
                  <div className="flex items-center space-x-1 ml-auto">
                      <button
                      type="button"
                      className={`p-2 rounded-l ${
                          modoVisualizacao === 'lista'
                          ? 'bg-gray-700 text-gray-100'
                          : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                        }`}
                      onClick={() => setModoVisualizacao('lista')}
                      title="Visualização em Lista"
                      >
                      <List size={18} />
                      </button>
                      <button
                      type="button"
                      className={`p-2 rounded-r ${
                          modoVisualizacao === 'cartoes'
                          ? 'bg-gray-700 text-gray-100'
                          : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                        }`}
                      onClick={() => setModoVisualizacao('cartoes')}
                      title="Visualização em Cartões"
                      >
                      <Grid size={18} />
                      </button>
                    </div>
                    
                    <button
                      onClick={handleAdicionarBloco}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center space-x-1"
                    >
                    <Plus size={16} />
                    <span>Novo Bloco</span>
                    </button>
                  </div>
                </div>

                {/* Lista de blocos com drag and drop */}
                {blocosFiltrados.length > 0 ? (
                  bandaSelecionada && Array.isArray(bandas) ? (
                  // Se tiver uma banda selecionada, mostra os blocos da banda
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-white">
                            Blocos de {Array.isArray(bandas) ? bandas.find(b => b.id === bandaSelecionada)?.nome || 'Banda Selecionada' : 'Banda Selecionada'}
                          </h3>
                      <span className="text-sm text-gray-400">
                        {blocosFiltrados.length} {blocosFiltrados.length === 1 ? 'bloco' : 'blocos'} encontrados
                                                                  </span>
                              </div>
                              
                    <div className="space-y-4">
                      {blocosFiltrados.map((bloco, index) => (
                        <DraggableBlocoItem
                          key={bloco.id} 
                          index={index}
                          bloco={bloco}
                          bandas={bandas}
                          musicas={musicas}
                          modoVisualizacao={modoVisualizacao}
                          onMoveBloco={handleMoveBloco}
                          onEditarBloco={handleEditarBloco}
                          onExcluirBloco={handleExcluirBloco}
                          onAdicionarMusica={handleAdicionarMusicaAoBloco}
                        />
                      ))}
                    </div>
                  </div>
                ) : modoVisualizacao === 'lista' ? (
                  // Modo de visualização em lista para todos os blocos
                  <div className="p-6 space-y-4">
                    {blocosFiltrados.map((bloco, index) => (
                      <DraggableBlocoItem
                        key={bloco.id}
                        index={index}
                        bloco={bloco}
                        bandas={bandas}
                        musicas={musicas}
                        modoVisualizacao="lista"
                        onMoveBloco={handleMoveBloco}
                        onEditarBloco={handleEditarBloco}
                        onExcluirBloco={handleExcluirBloco}
                        onAdicionarMusica={handleAdicionarMusicaAoBloco}
                      />
                    ))}
                  </div>
                ) : (
                  // Modo de visualização em cartões para todos os blocos
                  <div className="p-6 bg-gray-900/30 rounded-lg">
                    <BlocosGrid 
                      blocos={blocosFiltrados}
                      bandas={bandas}
                      musicas={musicas}
                      onDragEnd={handleDragEnd}
                      onEditarBloco={handleEditarBloco}
                      onExcluirBloco={handleExcluirBloco}
                      onAdicionarMusica={handleAdicionarMusicaAoBloco}
                    />
                  </div>
                )
              ) : (
                <div className="text-center py-12">
                  <Music className="mx-auto h-12 w-12 text-gray-500" />
                    <h3 className="mt-2 text-sm font-medium text-gray-200">Nenhum bloco encontrado</h3>
                    <p className="mt-1 text-sm text-gray-400">
                      {busca || bandaSelecionada
                        ? 'Tente ajustar os filtros ou fazer uma busca diferente.'
                        : 'Comece adicionando seu primeiro bloco musical.'}
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={handleAdicionarBloco}
                      className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
                      >
                      <Plus className="h-5 w-5 mr-2" />
                        Novo Bloco
                      </button>
                    </div>
                  </div>
                )}
              </div>
          )}
>>>>>>> 5d49630809b82c0fd6e9b76bf3898e17ba9220c6

        <Modal
          title={blocoEmEdicao ? 'Editar Bloco' : 'Novo Bloco'}
          isOpen={modalBlocoAberto}
          onClose={() => {
            setModalBlocoAberto(false);
            setBlocoEmEdicao(null);
          }}
        >
            <FormBloco
            bloco={blocoEmEdicao || undefined}
            bandas={bandas}
            bandaSelecionada={bandaSelecionada || undefined}
            onSubmit={handleSubmitBloco}
            onCancel={() => {
              setModalBlocoAberto(false);
              setBlocoEmEdicao(null);
            }}
          />
        </Modal>

        <Modal
          title="Nova Música"
          isOpen={modalMusicaAberto}
          onClose={() => setModalMusicaAberto(false)}
        >
          <MusicaForm
            onSubmit={handleSubmitMusica}
            onCancel={() => setModalMusicaAberto(false)}
          />
        </Modal>
      </div>
<<<<<<< HEAD

      {/* Modal de Novo Bloco */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setBlocoEditando(null);
        }}
        title={blocoEditando ? "Editar Bloco" : "Novo Bloco"}
      >
        <BlocoForm
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setBlocoEditando(null);
          }}
          initialData={blocoEditando}
        />
      </Modal>

      {/* Modal de Detalhes do Bloco */}
      {blocoSelecionado && (
        <BlocoDetalhes
          isOpen={isDetalhesOpen}
          onClose={() => {
            setIsDetalhesOpen(false);
            setBlocoSelecionado(null);
          }}
          bloco={blocoSelecionado}
          musicasDisponiveis={musicasDisponiveis}
          onAdicionarMusica={handleAdicionarMusica}
          onRemoverMusica={handleRemoverMusica}
          onReordenar={handleReordenarMusicas}
        />
      )}
    </div>
=======
      </DndProvider>
    </DragDropContext>
>>>>>>> 5d49630809b82c0fd6e9b76bf3898e17ba9220c6
  );
} 
