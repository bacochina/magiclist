import { Integrante } from '../types';

export const integrantesSeed: Integrante[] = [
  {
    id: '1',
    nome: 'James Hetfield',
    funcao: 'Vocalista/Guitarrista',
    telefone: '(11) 98765-4321',
    email: 'james@metallica.com',
    observacoes: 'Fundador do Metallica, compositor principal e guitarrista base.',
    bandasIds: ['1'] // Metallica
  },
  {
    id: '2',
    nome: 'Lars Ulrich',
    funcao: 'Baterista',
    telefone: '(11) 98765-4322',
    email: 'lars@metallica.com',
    observacoes: 'Co-fundador do Metallica, responsável pela parte administrativa.',
    bandasIds: ['1'] // Metallica
  },
  {
    id: '3',
    nome: 'Kirk Hammett',
    funcao: 'Guitarrista Solo',
    telefone: '(11) 98765-4323',
    email: 'kirk@metallica.com',
    observacoes: 'Entrou no Metallica em 1983, substituindo Dave Mustaine.',
    bandasIds: ['1'] // Metallica
  },
  {
    id: '4',
    nome: 'Robert Trujillo',
    funcao: 'Baixista',
    telefone: '(11) 98765-4324',
    email: 'robert@metallica.com',
    observacoes: 'Entrou no Metallica em 2003, também tocou com Ozzy Osbourne.',
    bandasIds: ['1'] // Metallica
  },
  {
    id: '5',
    nome: 'Bruce Dickinson',
    funcao: 'Vocalista',
    telefone: '(11) 98765-4325',
    email: 'bruce@ironmaiden.com',
    observacoes: 'Além de vocalista, é piloto de avião comercial.',
    bandasIds: ['2'] // Iron Maiden
  },
  {
    id: '6',
    nome: 'Steve Harris',
    funcao: 'Baixista',
    telefone: '(11) 98765-4326',
    email: 'steve@ironmaiden.com',
    observacoes: 'Fundador do Iron Maiden e principal compositor.',
    bandasIds: ['2'] // Iron Maiden
  },
  {
    id: '7',
    nome: 'Eddie Vedder',
    funcao: 'Vocalista',
    telefone: '(11) 98765-4327',
    email: 'eddie@pearljam.com',
    observacoes: 'Conhecido por seu estilo vocal único e letras profundas.',
    bandasIds: ['3'] // Pearl Jam
  },
  {
    id: '8',
    nome: 'Mike McCready',
    funcao: 'Guitarrista',
    telefone: '(11) 98765-4328',
    email: 'mike@pearljam.com',
    observacoes: 'Guitarrista principal do Pearl Jam, influenciado pelo blues.',
    bandasIds: ['3'] // Pearl Jam
  },
  {
    id: '9',
    nome: 'Anthony Kiedis',
    funcao: 'Vocalista',
    telefone: '(11) 98765-4329',
    email: 'anthony@rhcp.com',
    observacoes: 'Vocalista e letrista do Red Hot Chili Peppers desde a fundação.',
    bandasIds: ['4'] // Red Hot Chili Peppers
  },
  {
    id: '10',
    nome: 'Flea',
    funcao: 'Baixista',
    telefone: '(11) 98765-4330',
    email: 'flea@rhcp.com',
    observacoes: 'Considerado um dos melhores baixistas do mundo, estilo funk único.',
    bandasIds: ['4'] // Red Hot Chili Peppers
  },
  {
    id: '11',
    nome: 'Dave Grohl',
    funcao: 'Vocalista/Guitarrista',
    telefone: '(11) 98765-4331',
    email: 'dave@foofighters.com',
    observacoes: 'Ex-baterista do Nirvana, fundador do Foo Fighters.',
    bandasIds: ['5'] // Foo Fighters
  },
  {
    id: '12',
    nome: 'Thom Yorke',
    funcao: 'Vocalista',
    telefone: '(11) 98765-4332',
    email: 'thom@radiohead.com',
    observacoes: 'Vocalista e principal compositor do Radiohead.',
    bandasIds: ['6'] // Radiohead
  },
  {
    id: '13',
    nome: 'Alex Turner',
    funcao: 'Vocalista/Guitarrista',
    telefone: '(11) 98765-4333',
    email: 'alex@arcticmonkeys.com',
    observacoes: 'Conhecido por suas letras poéticas e estilo vocal único.',
    bandasIds: ['7'] // Arctic Monkeys
  },
  {
    id: '14',
    nome: 'Julian Casablancas',
    funcao: 'Vocalista',
    telefone: '(11) 98765-4334',
    email: 'julian@thestrokes.com',
    observacoes: 'Vocalista e principal compositor do The Strokes.',
    bandasIds: ['8'] // The Strokes
  },
  {
    id: '15',
    nome: 'Josh Homme',
    funcao: 'Vocalista/Guitarrista',
    telefone: '(11) 98765-4335',
    email: 'josh@qotsa.com',
    observacoes: 'Fundador do Queens of the Stone Age, também participou do Eagles of Death Metal.',
    bandasIds: ['9'] // Queens of the Stone Age
  },
  {
    id: '16',
    nome: 'Matt Bellamy',
    funcao: 'Vocalista/Guitarrista',
    telefone: '(11) 98765-4336',
    email: 'matt@muse.com',
    observacoes: 'Conhecido por seu falsete e habilidades técnicas na guitarra e piano.',
    bandasIds: ['10'] // Muse
  },
  {
    id: '17',
    nome: 'Serj Tankian',
    funcao: 'Vocalista',
    telefone: '(11) 98765-4337',
    email: 'serj@systemofadown.com',
    observacoes: 'Vocalista do System of a Down, conhecido por seu estilo vocal versátil.',
    bandasIds: ['11'] // System of a Down
  },
  {
    id: '18',
    nome: 'Zack de la Rocha',
    funcao: 'Vocalista',
    telefone: '(11) 98765-4338',
    email: 'zack@ratm.com',
    observacoes: 'Vocalista do Rage Against the Machine, conhecido por suas letras políticas.',
    bandasIds: ['12'] // Rage Against the Machine
  },
  {
    id: '19',
    nome: 'Ozzy Osbourne',
    funcao: 'Vocalista',
    telefone: '(11) 98765-4339',
    email: 'ozzy@blacksabbath.com',
    observacoes: 'O "Príncipe das Trevas", vocalista original do Black Sabbath.',
    bandasIds: ['13'] // Black Sabbath
  },
  {
    id: '20',
    nome: 'Robert Plant',
    funcao: 'Vocalista',
    telefone: '(11) 98765-4340',
    email: 'robert@ledzeppelin.com',
    observacoes: 'Vocalista do Led Zeppelin, conhecido por seu alcance vocal.',
    bandasIds: ['14'] // Led Zeppelin
  },
  {
    id: '21',
    nome: 'Roger Waters',
    funcao: 'Baixista/Vocalista',
    telefone: '(11) 98765-4341',
    email: 'roger@pinkfloyd.com',
    observacoes: 'Ex-baixista e um dos principais compositores do Pink Floyd.',
    bandasIds: ['15'] // Pink Floyd
  },
  {
    id: '22',
    nome: 'Geddy Lee',
    funcao: 'Baixista/Vocalista',
    telefone: '(11) 98765-4342',
    email: 'geddy@rush.com',
    observacoes: 'Baixista virtuoso e vocalista do Rush.',
    bandasIds: ['16'] // Rush
  },
  {
    id: '23',
    nome: 'John Petrucci',
    funcao: 'Guitarrista',
    telefone: '(11) 98765-4343',
    email: 'john@dreamtheater.com',
    observacoes: 'Considerado um dos melhores guitarristas técnicos do mundo.',
    bandasIds: ['17'] // Dream Theater
  },
  {
    id: '24',
    nome: 'Maynard James Keenan',
    funcao: 'Vocalista',
    telefone: '(11) 98765-4344',
    email: 'maynard@tool.com',
    observacoes: 'Vocalista do Tool, também tem projetos como A Perfect Circle e Puscifer.',
    bandasIds: ['18'] // Tool
  },
  {
    id: '25',
    nome: 'Mikael Åkerfeldt',
    funcao: 'Vocalista/Guitarrista',
    telefone: '(11) 98765-4345',
    email: 'mikael@opeth.com',
    observacoes: 'Fundador do Opeth, conhecido por transitar entre vocais guturais e limpos.',
    bandasIds: ['19'] // Opeth
  },
  {
    id: '26',
    nome: 'Steven Wilson',
    funcao: 'Vocalista/Guitarrista',
    telefone: '(11) 98765-4346',
    email: 'steven@porcupinetree.com',
    observacoes: 'Fundador do Porcupine Tree, também tem carreira solo de sucesso.',
    bandasIds: ['20'] // Porcupine Tree
  },
  {
    id: '27',
    nome: 'João Silva',
    funcao: 'Guitarrista',
    telefone: '(11) 98765-4347',
    email: 'joao.silva@email.com',
    observacoes: 'Músico freelancer disponível para substituições.',
    bandasIds: []
  },
  {
    id: '28',
    nome: 'Maria Oliveira',
    funcao: 'Vocalista',
    telefone: '(11) 98765-4348',
    email: 'maria.oliveira@email.com',
    observacoes: 'Especialista em backing vocals, disponível para gravações.',
    bandasIds: []
  },
  {
    id: '29',
    nome: 'Carlos Santos',
    funcao: 'Baterista',
    telefone: '(11) 98765-4349',
    email: 'carlos.santos@email.com',
    observacoes: 'Professor de bateria com 15 anos de experiência.',
    bandasIds: []
  },
  {
    id: '30',
    nome: 'Ana Pereira',
    funcao: 'Tecladista',
    telefone: '(11) 98765-4350',
    email: 'ana.pereira@email.com',
    observacoes: 'Formada em piano clássico, atua com bandas de rock progressivo.',
    bandasIds: []
  }
]; 