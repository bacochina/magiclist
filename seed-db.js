// Script para popular o banco de dados com bandas iniciais
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bandasSeed = [
  {
    nome: 'Metallica',
    descricao: 'Uma das maiores bandas de metal de todos os tempos, conhecida por hits como "Enter Sandman" e "Nothing Else Matters".',
  },
  {
    nome: 'Iron Maiden',
    descricao: 'Pioneiros do heavy metal britânico, famosos por suas músicas épicas e pela mascote Eddie.',
  },
  {
    nome: 'Pearl Jam',
    descricao: 'Banda icônica do movimento grunge de Seattle, liderada pela voz marcante de Eddie Vedder.',
  },
  {
    nome: 'Red Hot Chili Peppers',
    descricao: 'Conhecidos por misturar rock, funk e elementos psicodélicos em um som único.',
  },
  {
    nome: 'Foo Fighters',
    descricao: 'Formada por Dave Grohl após o fim do Nirvana, tornou-se uma das maiores bandas de rock da atualidade.',
  },
];

async function main() {
  try {
    // Limpa todas as bandas existentes
    await prisma.banda.deleteMany({});
    console.log('Banco de dados limpo.');
    
    // Insere as bandas do seed
    for (const banda of bandasSeed) {
      await prisma.banda.create({
        data: banda,
      });
      console.log(`Banda "${banda.nome}" criada.`);
    }
    
    console.log('Seed concluído com sucesso!');
  } catch (error) {
    console.error('Erro ao popular o banco de dados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 