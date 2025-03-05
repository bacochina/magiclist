import { NextResponse } from 'next/server';

interface Musica {
  id: string;
  nome: string;
  artista: string;
  tom: string;
  bpm?: string;
}

interface Bloco {
  id: string;
  bandaId: string;
  nome: string;
  descricao?: string;
  musicas: Musica[];
}

// Simula um banco de dados em memória
export const blocos: Bloco[] = [
  {
    id: '1',
    bandaId: '1', // Metallica
    nome: 'Clássicos do Black Album',
    descricao: 'Músicas do álbum mais famoso da banda',
    musicas: [
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
        nome: 'The Unforgiven',
        artista: 'Metallica',
        tom: 'Dm',
      },
      {
        id: 'm4',
        nome: 'Sad But True',
        artista: 'Metallica',
        tom: 'Em',
      },
    ],
  },
  {
    id: '2',
    bandaId: '1', // Metallica
    nome: 'Thrash Metal Anos 80',
    descricao: 'Músicas rápidas e pesadas da fase inicial',
    musicas: [
      {
        id: 'm5',
        nome: 'Master of Puppets',
        artista: 'Metallica',
        tom: 'Em',
      },
      {
        id: 'm6',
        nome: 'Battery',
        artista: 'Metallica',
        tom: 'Em',
      },
      {
        id: 'm7',
        nome: 'Creeping Death',
        artista: 'Metallica',
        tom: 'Em',
      },
      {
        id: 'm8',
        nome: 'Fight Fire With Fire',
        artista: 'Metallica',
        tom: 'Em',
      },
    ],
  },
  {
    id: '3',
    bandaId: '1', // Metallica
    nome: 'Baladas Power',
    descricao: 'As melhores power ballads da banda',
    musicas: [
      {
        id: 'm9',
        nome: 'Nothing Else Matters',
        artista: 'Metallica',
        tom: 'Em',
      },
      {
        id: 'm10',
        nome: 'The Unforgiven',
        artista: 'Metallica',
        tom: 'Dm',
      },
      {
        id: 'm11',
        nome: 'Fade to Black',
        artista: 'Metallica',
        tom: 'Em',
      },
      {
        id: 'm12',
        nome: 'Welcome Home (Sanitarium)',
        artista: 'Metallica',
        tom: 'Em',
      },
    ],
  },
  {
    id: '4',
    bandaId: '1', // Metallica
    nome: 'Era Load/Reload',
    descricao: 'Músicas do período experimental da banda',
    musicas: [
      {
        id: 'm13',
        nome: 'Fuel',
        artista: 'Metallica',
        tom: 'Em',
      },
      {
        id: 'm14',
        nome: 'The Memory Remains',
        artista: 'Metallica',
        tom: 'Em',
      },
      {
        id: 'm15',
        nome: 'King Nothing',
        artista: 'Metallica',
        tom: 'Em',
      },
      {
        id: 'm16',
        nome: 'Until It Sleeps',
        artista: 'Metallica',
        tom: 'Em',
      },
    ],
  },
  {
    id: '5',
    bandaId: '1', // Metallica
    nome: 'Hits de Arena',
    descricao: 'Músicas perfeitas para shows em estádios',
    musicas: [
      {
        id: 'm17',
        nome: 'Enter Sandman',
        artista: 'Metallica',
        tom: 'Em',
      },
      {
        id: 'm18',
        nome: 'Master of Puppets',
        artista: 'Metallica',
        tom: 'Em',
      },
      {
        id: 'm19',
        nome: 'One',
        artista: 'Metallica',
        tom: 'Bm',
      },
      {
        id: 'm20',
        nome: 'For Whom the Bell Tolls',
        artista: 'Metallica',
        tom: 'Em',
      },
    ],
  },
  {
    id: '6',
    bandaId: '2', // Iron Maiden
    nome: 'Épicos Históricos',
    descricao: 'Músicas sobre eventos e personagens históricos',
    musicas: [
      {
        id: 'm21',
        nome: 'The Trooper',
        artista: 'Iron Maiden',
        tom: 'Em',
      },
      {
        id: 'm22',
        nome: 'Aces High',
        artista: 'Iron Maiden',
        tom: 'Em',
      },
      {
        id: 'm23',
        nome: 'Alexander the Great',
        artista: 'Iron Maiden',
        tom: 'Em',
      },
      {
        id: 'm24',
        nome: 'Run to the Hills',
        artista: 'Iron Maiden',
        tom: 'Em',
      },
    ],
  },
  {
    id: '7',
    bandaId: '2', // Iron Maiden
    nome: 'Clássicos dos Anos 80',
    descricao: 'Os maiores hits da era de ouro',
    musicas: [
      {
        id: 'm25',
        nome: 'Number of the Beast',
        artista: 'Iron Maiden',
        tom: 'Em',
      },
      {
        id: 'm26',
        nome: 'Run to the Hills',
        artista: 'Iron Maiden',
        tom: 'Em',
      },
      {
        id: 'm27',
        nome: '2 Minutes to Midnight',
        artista: 'Iron Maiden',
        tom: 'Em',
      },
      {
        id: 'm28',
        nome: 'Wasted Years',
        artista: 'Iron Maiden',
        tom: 'Em',
      },
    ],
  },
];

export async function GET() {
  try {
    return NextResponse.json({ blocos });
  } catch (error) {
    console.error('Erro ao listar blocos:', error);
    return NextResponse.json(
      { error: 'Erro ao listar blocos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const novoBloco = {
      ...data,
      id: String(blocos.length + 1),
    };

    blocos.push(novoBloco);

    return NextResponse.json(novoBloco);
  } catch (error) {
    console.error('Erro ao criar bloco:', error);
    return NextResponse.json(
      { error: 'Erro ao criar bloco' },
      { status: 500 }
    );
  }
} 