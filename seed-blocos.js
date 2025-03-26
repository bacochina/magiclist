const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Buscar todas as bandas
    const bandas = await prisma.banda.findMany();
    
    if (bandas.length === 0) {
      console.log('Nenhuma banda encontrada. Criando uma banda de teste...');
      
      // Criar uma banda de teste
      const banda = await prisma.banda.create({
        data: {
          nome: 'Banda de Teste',
          genero: 'Rock',
          descricao: 'Banda criada para testes'
        }
      });
      
      console.log('Banda criada:', banda);
      
      // Criar algumas músicas para a banda
      const musica1 = await prisma.musica.create({
        data: {
          nome: 'Música 1',
          artista: 'Artista 1',
          tom: 'C',
          bpm: 120,
          bandaId: banda.id
        }
      });
      
      const musica2 = await prisma.musica.create({
        data: {
          nome: 'Música 2',
          artista: 'Artista 2',
          tom: 'G',
          bpm: 130,
          bandaId: banda.id
        }
      });
      
      console.log('Músicas criadas:', [musica1, musica2]);
      
      // Criar um bloco para a banda
      const bloco = await prisma.blocoMusical.create({
        data: {
          nome: 'Bloco de Teste',
          descricao: 'Bloco criado para testes',
          bandaId: banda.id
        }
      });
      
      console.log('Bloco criado:', bloco);
      
      // Adicionar músicas ao bloco
      await prisma.blocoMusica.create({
        data: {
          blocoId: bloco.id,
          musicaId: musica1.id,
          ordem: 0
        }
      });
      
      await prisma.blocoMusica.create({
        data: {
          blocoId: bloco.id,
          musicaId: musica2.id,
          ordem: 1
        }
      });
      
      console.log('Músicas adicionadas ao bloco');
    } else {
      console.log('Bandas encontradas:', bandas);
      
      // Para cada banda, criar um bloco de teste
      for (const banda of bandas) {
        // Verificar se a banda já tem blocos
        const blocos = await prisma.blocoMusical.findMany({
          where: { bandaId: banda.id }
        });
        
        if (blocos.length === 0) {
          console.log(`Criando bloco para a banda ${banda.nome}...`);
          
          // Buscar músicas da banda
          const musicas = await prisma.musica.findMany({
            where: { bandaId: banda.id }
          });
          
          if (musicas.length === 0) {
            console.log(`Nenhuma música encontrada para a banda ${banda.nome}. Criando músicas...`);
            
            // Criar algumas músicas para a banda
            const musica1 = await prisma.musica.create({
              data: {
                nome: `Música 1 - ${banda.nome}`,
                artista: 'Artista 1',
                tom: 'C',
                bpm: 120,
                bandaId: banda.id
              }
            });
            
            const musica2 = await prisma.musica.create({
              data: {
                nome: `Música 2 - ${banda.nome}`,
                artista: 'Artista 2',
                tom: 'G',
                bpm: 130,
                bandaId: banda.id
              }
            });
            
            console.log('Músicas criadas:', [musica1, musica2]);
            
            // Criar um bloco para a banda
            const bloco = await prisma.blocoMusical.create({
              data: {
                nome: `Bloco de Teste - ${banda.nome}`,
                descricao: 'Bloco criado para testes',
                bandaId: banda.id
              }
            });
            
            console.log('Bloco criado:', bloco);
            
            // Adicionar músicas ao bloco
            await prisma.blocoMusica.create({
              data: {
                blocoId: bloco.id,
                musicaId: musica1.id,
                ordem: 0
              }
            });
            
            await prisma.blocoMusica.create({
              data: {
                blocoId: bloco.id,
                musicaId: musica2.id,
                ordem: 1
              }
            });
            
            console.log('Músicas adicionadas ao bloco');
          } else {
            console.log(`Músicas encontradas para a banda ${banda.nome}:`, musicas);
            
            // Criar um bloco para a banda
            const bloco = await prisma.blocoMusical.create({
              data: {
                nome: `Bloco de Teste - ${banda.nome}`,
                descricao: 'Bloco criado para testes',
                bandaId: banda.id
              }
            });
            
            console.log('Bloco criado:', bloco);
            
            // Adicionar músicas ao bloco
            for (let i = 0; i < Math.min(musicas.length, 3); i++) {
              await prisma.blocoMusica.create({
                data: {
                  blocoId: bloco.id,
                  musicaId: musicas[i].id,
                  ordem: i
                }
              });
            }
            
            console.log('Músicas adicionadas ao bloco');
          }
        } else {
          console.log(`A banda ${banda.nome} já tem ${blocos.length} blocos`);
        }
      }
    }
    
    console.log('Seed concluído com sucesso!');
  } catch (error) {
    console.error('Erro ao executar seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 