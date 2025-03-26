import { Banda, Musica, Bloco, Integrante } from '../types';

// Função para gerar um ID aleatório
const gerarId = () => Math.random().toString(36).substr(2, 9);

// Função para escolher um item aleatório de um array
const escolherAleatorio = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

// Função para escolher múltiplos itens aleatórios de um array
const escolherMultiplosAleatorios = <T>(array: T[], quantidade: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, quantidade);
};

// Dados para bandas
const nomesBandas = [
  'Metallica', 'Iron Maiden', 'Pearl Jam', 'Red Hot Chili Peppers', 'Foo Fighters',
  'Radiohead', 'Arctic Monkeys', 'The Strokes', 'Queens of the Stone Age', 'Muse',
  'System of a Down', 'Rage Against the Machine', 'Black Sabbath', 'Led Zeppelin', 'Pink Floyd',
  'Rush', 'Dream Theater', 'Tool', 'Opeth', 'Porcupine Tree',
  'Slipknot', 'Megadeth', 'Pantera', 'Avenged Sevenfold', 'Linkin Park',
  'Green Day', 'Nirvana', 'Soundgarden', 'Alice in Chains', 'Stone Temple Pilots',
  'Audioslave', 'Incubus', 'Deftones', 'Korn', 'Limp Bizkit',
  'Rammstein', 'Nightwish', 'Within Temptation', 'Evanescence', 'Lacuna Coil'
];

const generosMusicais = [
  'Heavy Metal', 'Thrash Metal', 'Death Metal', 'Black Metal', 'Power Metal',
  'Progressive Metal', 'Doom Metal', 'Gothic Metal', 'Folk Metal', 'Symphonic Metal',
  'Hard Rock', 'Classic Rock', 'Progressive Rock', 'Psychedelic Rock', 'Blues Rock',
  'Punk Rock', 'Post-Punk', 'Grunge', 'Alternative Rock', 'Indie Rock',
  'Pop Rock', 'Funk Rock', 'Jazz Fusion', 'Experimental Rock', 'Electronic Rock',
  'Nu Metal', 'Rap Metal', 'Industrial Metal', 'Metalcore', 'Deathcore'
];

// Dados para músicas
const nomesMusicas = [
  'Enter Sandman', 'Master of Puppets', 'Nothing Else Matters', 'The Unforgiven', 'Fade to Black',
  'Fear of the Dark', 'The Trooper', 'Run to the Hills', 'Hallowed Be Thy Name', 'Wasted Years',
  'Even Flow', 'Black', 'Alive', 'Jeremy', 'Yellow Ledbetter',
  'Californication', 'Under the Bridge', 'Scar Tissue', 'Otherside', 'By the Way',
  'Everlong', 'The Pretender', 'Best of You', 'Learn to Fly', 'Times Like These',
  'Creep', 'Karma Police', 'Paranoid Android', 'No Surprises', 'High and Dry',
  'Do I Wanna Know?', 'R U Mine?', 'Why\'d You Only Call Me When You\'re High?', 'Arabella', 'Fluorescent Adolescent',
  'Last Nite', 'Reptilia', 'You Only Live Once', 'Someday', 'Hard to Explain',
  'No One Knows', 'Go with the Flow', 'Little Sister', 'Make It wit Chu', '3\'s & 7\'s',
  'Supermassive Black Hole', 'Starlight', 'Knights of Cydonia', 'Uprising', 'Hysteria',
  'Chop Suey!', 'Toxicity', 'Aerials', 'B.Y.O.B.', 'Hypnotize',
  'Killing in the Name', 'Bulls on Parade', 'Guerrilla Radio', 'Sleep Now in the Fire', 'Testify',
  'Paranoid', 'Iron Man', 'War Pigs', 'N.I.B.', 'Children of the Grave',
  'Stairway to Heaven', 'Kashmir', 'Whole Lotta Love', 'Immigrant Song', 'Black Dog',
  'Comfortably Numb', 'Wish You Were Here', 'Another Brick in the Wall', 'Time', 'Money',
  'Tom Sawyer', 'YYZ', 'Limelight', 'The Spirit of Radio', 'Subdivisions',
  'Pull Me Under', 'The Dance of Eternity', 'Metropolis Pt. 1', 'The Glass Prison', 'Panic Attack',
  'Schism', 'Forty Six & 2', 'Lateralus', 'Vicarious', 'The Pot',
  'Blackwater Park', 'Ghost of Perdition', 'The Drapery Falls', 'Deliverance', 'Windowpane',
  'Trains', 'Blackest Eyes', 'Lazarus', 'Arriving Somewhere But Not Here', 'Fear of a Blank Planet'
];

const artistas = [
  'Metallica', 'Iron Maiden', 'Pearl Jam', 'Red Hot Chili Peppers', 'Foo Fighters',
  'Radiohead', 'Arctic Monkeys', 'The Strokes', 'Queens of the Stone Age', 'Muse',
  'System of a Down', 'Rage Against the Machine', 'Black Sabbath', 'Led Zeppelin', 'Pink Floyd',
  'Rush', 'Dream Theater', 'Tool', 'Opeth', 'Porcupine Tree'
];

const tons = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 
              'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'A#m', 'Bm'];

// Dados para blocos
const nomesBlocos = [
  'Rock Clássico', 'Heavy Metal', 'Thrash Metal', 'Progressive Rock', 'Grunge',
  'Alternative Rock', 'Punk Rock', 'Blues Rock', 'Hard Rock', 'Psychedelic Rock',
  'Funk Rock', 'Pop Rock', 'Indie Rock', 'Metal Progressivo', 'Death Metal',
  'Black Metal', 'Power Metal', 'Folk Metal', 'Symphonic Metal', 'Gothic Metal',
  'Nu Metal', 'Rap Metal', 'Industrial Metal', 'Metalcore', 'Deathcore',
  'Post-Rock', 'Post-Metal', 'Stoner Rock', 'Doom Metal', 'Sludge Metal',
  'Abertura do Show', 'Meio do Show', 'Encerramento', 'Músicas Lentas', 'Músicas Rápidas',
  'Músicas Técnicas', 'Músicas Populares', 'Músicas Raras', 'Covers', 'Músicas Autorais'
];

// Dados para integrantes
const nomesIntegrantes = [
  'João Silva', 'Maria Oliveira', 'Pedro Santos', 'Ana Costa', 'Carlos Souza',
  'Fernanda Lima', 'Ricardo Pereira', 'Juliana Alves', 'Marcos Rodrigues', 'Patrícia Ferreira',
  'Lucas Martins', 'Camila Barbosa', 'Bruno Almeida', 'Larissa Cardoso', 'Gustavo Ribeiro',
  'Amanda Gomes', 'Rafael Carvalho', 'Daniela Nascimento', 'Felipe Mendes', 'Bianca Teixeira',
  'Leonardo Moreira', 'Isabela Castro', 'Thiago Correia', 'Natália Duarte', 'Vinícius Rocha',
  'Letícia Campos', 'Rodrigo Nunes', 'Carolina Pinto', 'Eduardo Lopes', 'Mariana Dias',
  'Gabriel Freitas', 'Aline Vieira', 'Matheus Araújo', 'Vanessa Cavalcanti', 'Diego Fonseca',
  'Jéssica Ramos', 'Renato Machado', 'Tatiana Moura', 'Alexandre Barros', 'Priscila Andrade'
];

const funcoes = [
  'Vocalista', 'Guitarrista', 'Baixista', 'Baterista', 'Tecladista',
  'Violonista', 'Saxofonista', 'Trompetista', 'Trombonista', 'Percussionista',
  'Backing Vocal', 'Produtor', 'Roadie', 'Técnico de Som', 'Técnico de Iluminação',
  'Empresário', 'Agente', 'Compositor', 'Letrista', 'DJ'
];

// Gerar bandas
export const gerarBandas = (quantidade: number = 30): Banda[] => {
  const bandas: Banda[] = [];
  
  for (let i = 0; i < quantidade; i++) {
    const nome = nomesBandas[i % nomesBandas.length];
    const genero = escolherAleatorio(generosMusicais);
    
    bandas.push({
      id: gerarId(),
      nome: `${nome} ${i >= nomesBandas.length ? i - nomesBandas.length + 1 : ''}`,
      genero,
      descricao: `Banda de ${genero} formada para tocar os melhores sucessos do gênero.`
    });
  }
  
  return bandas;
};

// Gerar músicas
export const gerarMusicas = (quantidade: number = 30, bandas: Banda[]): Musica[] => {
  const musicas: Musica[] = [];
  
  for (let i = 0; i < quantidade; i++) {
    const nome = nomesMusicas[i % nomesMusicas.length];
    const artista = escolherAleatorio(artistas);
    const tom = escolherAleatorio(tons);
    const bpm = Math.floor(Math.random() * 80) + 80; // BPM entre 80 e 160
    
    musicas.push({
      id: gerarId(),
      nome: `${nome} ${i >= nomesMusicas.length ? i - nomesMusicas.length + 1 : ''}`,
      artista,
      tom,
      bpm,
      observacoes: `Música de ${artista} em ${tom} com BPM ${bpm}.`
    });
  }
  
  return musicas;
};

// Gerar blocos
export const gerarBlocos = (quantidade: number = 30, bandas: Banda[], musicas: Musica[]): Bloco[] => {
  const blocos: Bloco[] = [];
  
  for (let i = 0; i < quantidade; i++) {
    const nome = nomesBlocos[i % nomesBlocos.length];
    const banda = escolherAleatorio(bandas);
    const musicasDoBloco = escolherMultiplosAleatorios(musicas, Math.floor(Math.random() * 5) + 3); // 3 a 8 músicas por bloco
    
    blocos.push({
      id: gerarId(),
      nome: `${nome} ${i >= nomesBlocos.length ? i - nomesBlocos.length + 1 : ''}`,
      descricao: `Bloco de músicas de ${nome} para apresentações ao vivo.`,
      bandaId: banda.id,
      musicas: musicasDoBloco
    });
  }
  
  return blocos;
};

// Gerar integrantes
export const gerarIntegrantes = (quantidade: number = 30, bandas: Banda[]): Integrante[] => {
  const integrantes: Integrante[] = [];
  
  for (let i = 0; i < quantidade; i++) {
    const nome = nomesIntegrantes[i % nomesIntegrantes.length];
    const funcao = escolherAleatorio(funcoes);
    const bandasDoIntegrante = escolherMultiplosAleatorios(bandas, Math.floor(Math.random() * 3) + 1); // 1 a 3 bandas por integrante
    
    integrantes.push({
      id: gerarId(),
      nome: `${nome} ${i >= nomesIntegrantes.length ? i - nomesIntegrantes.length + 1 : ''}`,
      funcao,
      telefone: `(11) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
      email: `${nome.toLowerCase().replace(' ', '.')}@email.com`,
      observacoes: `${funcao} com experiência em diversos estilos musicais.`,
      bandasIds: bandasDoIntegrante.map(b => b.id)
    });
  }
  
  return integrantes;
};

// Função principal para popular todos os dados
export const popularDados = () => {
  // Limpar dados existentes
  localStorage.removeItem('bandas');
  localStorage.removeItem('musicas');
  localStorage.removeItem('blocos');
  localStorage.removeItem('integrantes');
  
  // Gerar novos dados
  const bandas = gerarBandas(40);
  const musicas = gerarMusicas(60, bandas);
  const blocos = gerarBlocos(30, bandas, musicas);
  const integrantes = gerarIntegrantes(40, bandas);
  
  // Salvar no localStorage
  localStorage.setItem('bandas', JSON.stringify(bandas));
  localStorage.setItem('musicas', JSON.stringify(musicas));
  localStorage.setItem('blocos', JSON.stringify(blocos));
  localStorage.setItem('integrantes', JSON.stringify(integrantes));
  
  console.log('Dados populados com sucesso!');
  console.log(`Bandas: ${bandas.length}`);
  console.log(`Músicas: ${musicas.length}`);
  console.log(`Blocos: ${blocos.length}`);
  console.log(`Integrantes: ${integrantes.length}`);
  
  return {
    bandas,
    musicas,
    blocos,
    integrantes
  };
}; 