import { Repertorio } from "@/lib/types";

export const repertorios: Repertorio[] = [
  {
    id: "1",
    bandaId: "1", // Metallica
    nome: "Show de Verão 2024",
    data: new Date("2024-03-15"),
    blocos: [
      {
        id: "1",
        bandaId: "1",
        nome: "Clássicos do Black Album",
        descricao: "Músicas mais populares do álbum Black Album",
        musicas: [
          {
            id: "1",
            nome: "Enter Sandman",
            artista: "Metallica",
            tom: "Em",
            bpm: 123,
            dicas: ["Intro com efeito de volume", "Break antes do refrão"]
          },
          {
            id: "2",
            nome: "Nothing Else Matters",
            artista: "Metallica",
            tom: "Em",
            bpm: 92,
            dicas: ["Começar clean", "Dobra de guitarra no solo"]
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    bandaId: "2", // Iron Maiden
    nome: "Ensaio Geral",
    data: new Date("2024-03-20"),
    blocos: [
      {
        id: "3",
        bandaId: "2",
        nome: "Épicos Históricos",
        descricao: "Músicas épicas com temas históricos",
        musicas: [
          {
            id: "5",
            nome: "Run to the Hills",
            artista: "Iron Maiden",
            tom: "D",
            bpm: 190,
            dicas: ["Atenção na virada da intro", "Backing vocals importantes"]
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]; 