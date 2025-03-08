'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { BlocoForm } from './components/BlocoForm';
import { ListaBandas } from './components/ListaBandas';
import { BlocosDaBanda } from './components/BlocosDaBanda';
import { SeletorMusicas } from './components/SeletorMusicas';
import { Banda, Bloco, Musica } from '@/lib/types';
import { useHydratedLocalStorage } from '@/hooks/useHydratedLocalStorage';
import { bandasSeed } from '@/lib/seeds/bandas';
import { MusicaForm } from './components/MusicaForm';
import { ClientOnly } from './components/ClientOnly';

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

export default function BlocosPage() {
  const [bandas] = useState<Banda[]>(bandasSeed);
  const [blocos, setBlocos] = useHydratedLocalStorage<Bloco[]>('blocos', blocosSeedInicial);
  const [musicas, setMusicas] = useHydratedLocalStorage<Musica[]>('musicas', []);
  const [bandaSelecionada, setBandaSelecionada] = useState<Banda | undefined>();
  const [modalAberto, setModalAberto] = useState(false);
  const [modalMusicasAberto, setModalMusicasAberto] = useState(false);
  const [modalEditarMusicaAberto, setModalEditarMusicaAberto] = useState(false);
  const [blocoEmEdicao, setBlocoEmEdicao] = useState<Bloco | undefined>();
  const [blocoParaAdicionarMusica, setBlocoParaAdicionarMusica] = useState<Bloco | undefined>();
  const [musicaEmEdicao, setMusicaEmEdicao] = useState<Musica | undefined>();
  const [musicasSelecionadas, setMusicasSelecionadas] = useState<Musica[]>([]);

  const blocosDaBanda = bandaSelecionada
    ? blocos.filter((bloco) => bloco.bandaId === bandaSelecionada.id)
    : [];

  const handleSelectBanda = (banda: Banda) => {
    setBandaSelecionada(banda);
  };

  const handleAdicionarBloco = () => {
    setBlocoEmEdicao(undefined);
    setMusicasSelecionadas([]);
    setModalAberto(true);
  };

  const handleEditarBloco = (bloco: Bloco) => {
    setBlocoEmEdicao(bloco);
    setMusicasSelecionadas(bloco.musicas);
    setModalAberto(true);
  };

  const handleExcluirBloco = (blocoId: string) => {
    setBlocos(blocos.filter((b) => b.id !== blocoId));
  };

  const handleReordenarBlocos = (blocosDaBandaReordenados: Bloco[]) => {
    // Atualiza apenas os blocos da banda selecionada
    const outrosBlocos = blocos.filter(b => b.bandaId !== bandaSelecionada?.id);
    setBlocos([...outrosBlocos, ...blocosDaBandaReordenados]);
  };

  const handleReordenarMusicas = (blocoId: string, musicasReordenadas: Musica[]) => {
    setBlocos(blocos.map(bloco => 
      bloco.id === blocoId
        ? { ...bloco, musicas: musicasReordenadas }
        : bloco
    ));
  };

  const handleSubmit = (data: Partial<Bloco>) => {
    if (blocoEmEdicao) {
      setBlocos(
        blocos.map((b) =>
          b.id === blocoEmEdicao.id
            ? { ...b, ...data, bandaId: bandaSelecionada?.id || '', musicas: blocoEmEdicao.musicas }
            : b
        )
      );
    } else {
      const novoBloco: Bloco = {
        id: Math.random().toString(36).substr(2, 9),
        nome: data.nome || '',
        descricao: data.descricao,
        bandaId: bandaSelecionada?.id || '',
        musicas: []
      };
      setBlocos([...blocos, novoBloco]);
    }
    setModalAberto(false);
  };

  const handleAdicionarMusica = (blocoId: string) => {
    const bloco = blocos.find(b => b.id === blocoId);
    if (bloco) {
      setBlocoParaAdicionarMusica(bloco);
      setModalMusicasAberto(true);
    }
  };

  const handleSelecionarMusica = (musica: Musica) => {
    if (blocoParaAdicionarMusica) {
      setBlocos(blocos.map(bloco => 
        bloco.id === blocoParaAdicionarMusica.id
          ? { ...bloco, musicas: [...bloco.musicas, musica] }
          : bloco
      ));
      setModalMusicasAberto(false);
      setBlocoParaAdicionarMusica(undefined);
    }
  };

  const handleSubmitMusica = (data: Partial<Musica>) => {
    if (musicaEmEdicao) {
      // Atualiza a música no cadastro
      setMusicas(musicas.map(m => 
        m.id === musicaEmEdicao.id
          ? { ...m, ...data }
          : m
      ));
      
      // Atualiza a música em todos os blocos que a contêm
      setBlocos(blocos.map(bloco => ({
        ...bloco,
        musicas: bloco.musicas.map(m =>
          m.id === musicaEmEdicao.id
            ? { ...m, ...data }
            : m
        )
      })));
    } else {
      const novaMusica: Musica = {
        id: Math.random().toString(36).substr(2, 9),
        nome: data.nome || '',
        artista: data.artista || '',
        tom: data.tom || '',
        bpm: data.bpm || 0,
        observacoes: data.observacoes,
      };
      setMusicas([...musicas, novaMusica]);
    }
    setModalEditarMusicaAberto(false);
    setMusicaEmEdicao(undefined);
  };

  const handleEditarMusicaCompleta = (musica: Musica) => {
    setMusicaEmEdicao(musica);
    setModalEditarMusicaAberto(true);
  };

  const handleExcluirMusicaCompleta = (musica: Musica) => {
    // Remove a música do cadastro
    setMusicas(musicas.filter(m => m.id !== musica.id));
    
    // Remove a música de todos os blocos que a contêm
    setBlocos(blocos.map(bloco => ({
      ...bloco,
      musicas: bloco.musicas.filter(m => m.id !== musica.id)
    })));
  };

  return (
    <ClientOnly>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Lista de Bandas */}
          <div className="col-span-4">
            <ListaBandas
              bandas={bandas}
              onSelectBanda={handleSelectBanda}
              bandaSelecionada={bandaSelecionada}
            />
          </div>

          {/* Blocos da Banda */}
          <div className="col-span-8">
            {bandaSelecionada ? (
              <BlocosDaBanda
                banda={bandaSelecionada}
                blocos={blocosDaBanda}
                onAdicionarBloco={handleAdicionarBloco}
                onEditarBloco={handleEditarBloco}
                onExcluirBloco={handleExcluirBloco}
                onReordenarBlocos={handleReordenarBlocos}
                onReordenarMusicas={handleReordenarMusicas}
                onAdicionarMusica={handleAdicionarMusica}
                onEditarMusicaCompleta={handleEditarMusicaCompleta}
                onExcluirMusicaCompleta={handleExcluirMusicaCompleta}
              />
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500">
                  Selecione uma banda para ver seus blocos
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal de Edição/Criação de Bloco */}
        <Modal
          title={blocoEmEdicao ? 'Editar Bloco' : 'Novo Bloco'}
          isOpen={modalAberto}
          onClose={() => setModalAberto(false)}
        >
          <BlocoForm
            bloco={blocoEmEdicao}
            onSubmit={handleSubmit}
          />
        </Modal>

        {/* Modal de Seleção de Músicas */}
        <Modal
          title="Adicionar Música ao Bloco"
          isOpen={modalMusicasAberto}
          onClose={() => {
            setModalMusicasAberto(false);
            setBlocoParaAdicionarMusica(undefined);
          }}
        >
          {blocoParaAdicionarMusica && bandaSelecionada && (
            <SeletorMusicas
              bandaId={bandaSelecionada.id}
              musicasSelecionadas={blocoParaAdicionarMusica.musicas}
              onAdicionarMusica={handleSelecionarMusica}
            />
          )}
        </Modal>

        {/* Modal de Edição de Música */}
        <Modal
          title="Editar Música"
          isOpen={modalEditarMusicaAberto}
          onClose={() => {
            setModalEditarMusicaAberto(false);
            setMusicaEmEdicao(undefined);
          }}
        >
          {musicaEmEdicao && (
            <MusicaForm
              musica={musicaEmEdicao}
              onSubmit={handleSubmitMusica}
            />
          )}
        </Modal>
      </div>
    </ClientOnly>
  );
} 