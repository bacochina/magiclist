'use client';

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
import DraggableBlocoItem from './components/DraggableBlocoItem';
import { updateBlocosOrder } from '@/lib/actions';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  MusicalNoteIcon,
  ViewColumnsIcon,
  TableCellsIcon,
  Bars3Icon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
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

export default function BlocosPage() {
  const [bandas, setBandas] = useHydratedLocalStorage<Banda[]>('bandas', bandasSeed);
  const [blocos, setBlocos] = useHydratedLocalStorage<Bloco[]>('blocos', blocosSeedInicial);
  const [musicas, setMusicas] = useHydratedLocalStorage<Musica[]>('musicas', []);
  const [bandaSelecionada, setBandaSelecionada] = useState<string | null>(null);
  const [modalBlocoAberto, setModalBlocoAberto] = useState(false);
  const [modalMusicaAberto, setModalMusicaAberto] = useState(false);
  const [blocoEmEdicao, setBlocoEmEdicao] = useState<Bloco | null>(null);
  const [busca, setBusca] = useState('');
  const [modoVisualizacao, setModoVisualizacao] = useState<'cartoes' | 'lista'>('lista');

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
  }, [bandas, musicas.length, setMusicas]);

  const blocosDaBanda = bandaSelecionada
    ? blocos.filter((bloco) => bloco.bandaId === bandaSelecionada)
    : [];

  const handleSelecionarBanda = (bandaId: string) => {
    setBandaSelecionada(bandaId === bandaSelecionada ? null : bandaId);
  };

  const handleAdicionarBloco = () => {
    setBlocoEmEdicao(null);
    setModalBlocoAberto(true);
  };

  const handleEditarBloco = (bloco: Bloco) => {
    setBlocoEmEdicao(bloco);
    setModalBlocoAberto(true);
  };

  const handleExcluirBloco = async (id: string) => {
    const confirmado = await confirmar(
      'Excluir bloco',
      'Tem certeza que deseja excluir este bloco?',
      'warning'
    );
    
    if (confirmado) {
      try {
        setBlocos(blocos.filter(b => b.id !== id));
        alertaSucesso('Bloco excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir bloco:', error);
        alertaErro('Erro ao excluir o bloco');
      }
    }
  };

  const handleSubmitBloco = (data: Partial<Bloco>) => {
    if (blocoEmEdicao) {
      setBlocos(
        blocos.map((b) =>
          b.id === blocoEmEdicao.id
            ? { ...b, ...data }
            : b
        )
      );
    } else {
      const novoBloco: Bloco = {
        id: Math.random().toString(36).substr(2, 9),
        nome: data.nome || '',
        descricao: data.descricao || '',
        musicas: data.musicas || [],
        bandaId: bandaSelecionada || undefined,
      };
      setBlocos([...blocos, novoBloco]);
    }
    setModalBlocoAberto(false);
    setBlocoEmEdicao(null);
  };

  const handleSubmitMusica = (data: Partial<Musica>) => {
      const novaMusica: Musica = {
        id: Math.random().toString(36).substr(2, 9),
        nome: data.nome || '',
        artista: data.artista || '',
        tom: data.tom || '',
        bpm: data.bpm || 0,
        observacoes: data.observacoes,
      };
      setMusicas([...musicas, novaMusica]);
    setModalMusicaAberto(false);
  };

  // Filtra blocos baseado na busca e banda selecionada
  const blocosFiltrados = blocos.filter(bloco => {
    const matchBusca = bloco.nome.toLowerCase().includes(busca.toLowerCase());
    const matchBanda = !bandaSelecionada || bloco.bandaId === bandaSelecionada;
    return matchBusca && matchBanda;
  });

  // Função para lidar com o movimento de bloco no React DnD
  const handleMoveBloco = useCallback((dragIndex: number, hoverIndex: number) => {
    // Obtém os blocos que serão reordenados
    const updatedBlocos = [...blocos];
    
    // Encontra os blocos correspondentes no array completo
    const draggedBlocoId = blocosFiltrados[dragIndex].id;
    const targetBlocoId = blocosFiltrados[hoverIndex].id;
    
    // Encontra os índices reais no array completo de blocos
    const draggedBlocoIndex = updatedBlocos.findIndex(b => b.id === draggedBlocoId);
    const targetBlocoIndex = updatedBlocos.findIndex(b => b.id === targetBlocoId);
    
    if (draggedBlocoIndex !== -1 && targetBlocoIndex !== -1) {
      // Remove o bloco arrastado
      const [draggedBloco] = updatedBlocos.splice(draggedBlocoIndex, 1);
      
      // Insere o bloco na nova posição
      updatedBlocos.splice(targetBlocoIndex, 0, draggedBloco);
      
      // Atualiza o estado
      setBlocos(updatedBlocos);
      
      // Salva a nova ordem no backend
      updateBlocosOrder(updatedBlocos).catch(error => {
        console.error("Erro ao salvar a ordem dos blocos:", error);
      });
    }
  }, [blocosFiltrados, blocos, setBlocos]);

  // Função para reordenar blocos via drag and drop
  const handleReordenarBlocos = (novosBlocos: Bloco[]) => {
    setBlocos(novosBlocos);
  };

  // Função para lidar com o fim do drag and drop
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    // Cria uma cópia local de todos os blocos
    const allBlocos = [...blocos];
    
    // Encontra os índices reais (não filtrados) dos blocos sendo reordenados
    const sourceId = blocosFiltrados[result.source.index].id;
    const sourceIndex = allBlocos.findIndex(b => b.id === sourceId);
    
    let destinationIndex;
    if (result.destination.index >= blocosFiltrados.length) {
      // Se o destino estiver além do final, colocamos no final
      const lastFilteredId = blocosFiltrados[blocosFiltrados.length - 1].id;
      destinationIndex = allBlocos.findIndex(b => b.id === lastFilteredId) + 1;
    } else {
      const destinationId = blocosFiltrados[result.destination.index].id;
      destinationIndex = allBlocos.findIndex(b => b.id === destinationId);
    }
    
    // Remove o bloco da posição original e insere na nova posição
    const [movedBloco] = allBlocos.splice(sourceIndex, 1);
    allBlocos.splice(destinationIndex, 0, movedBloco);
    
    // Atualiza o estado com a nova ordem
    setBlocos(allBlocos);
    
    // Salva a nova ordem no backend
    updateBlocosOrder(allBlocos).catch(error => {
      console.error("Erro ao salvar a ordem dos blocos:", error);
    });
  };

  // Função para reordenar músicas dentro de um bloco
  const handleReordenarMusicas = (blocoId: string, novasMusicas: Musica[]) => {
    setBlocos(
      blocos.map(bloco => 
        bloco.id === blocoId 
          ? { ...bloco, musicas: novasMusicas.map(m => m.id) } 
          : bloco
      )
    );
  };

  // Função para adicionar música a um bloco
  const handleAdicionarMusicaAoBloco = (blocoId: string) => {
    // Armazenar o ID do bloco para adicionar a música após a criação
    setBlocoEmEdicao(blocos.find(b => b.id === blocoId) || null);
    setModalMusicaAberto(true);
  };

  // Função para lidar com o fim do drag and drop de músicas
  const handleMusicasDragEnd = (result: DropResult, blocoId: string) => {
    if (!result.destination) return;

    const bloco = blocos.find(b => b.id === blocoId);
    if (!bloco || !bloco.musicas) return;

    const items = Array.from(bloco.musicas);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Atualiza a ordem das músicas no bloco
    setBlocos(
      blocos.map(b => 
        b.id === blocoId 
          ? { ...b, musicas: items } 
          : b
      )
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen relative">
        {/* Background específico para blocos */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M30 20h4v4h-4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM6 20h4v4H6v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Conteúdo da página */}
        <div className="relative z-10 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white mb-6 flex items-center">
                  <MusicalNoteIcon className="h-8 w-8 mr-2" />
                  Blocos Musicais
                </h1>
              </div>

              <div className="px-4 py-6 sm:px-0">
                <div className="bg-gray-800/90 backdrop-blur-lg rounded-lg p-6 shadow-md">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <MusicalNoteIcon className="h-5 w-5 mr-1.5 text-indigo-400" />
                      <span className="text-lg font-semibold text-gray-100">Meus Blocos</span>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                      {/* Campo de busca */}
                      <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={busca}
                          onChange={(e) => setBusca(e.target.value)}
                          placeholder="Buscar blocos..."
                          className="bg-gray-700/50 border border-gray-600 text-white rounded-md pl-7 pr-2 py-1.5 w-48 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      {/* Filtro de bandas */}
                      <select
                        value={bandaSelecionada || ''}
                        onChange={(e) => setBandaSelecionada(e.target.value || null)}
                        className="bg-gray-700/50 border border-gray-600 text-white rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Todas as bandas</option>
                        {Array.isArray(bandas) && bandas.map((banda) => (
                          <option key={banda.id} value={banda.id}>
                            {banda.nome}
                          </option>
                        ))}
                      </select>
                      
                      {/* Botões de visualização */}
                      <div className="flex items-center">
                        <button
                          onClick={() => setModoVisualizacao('lista')}
                          className={`p-1.5 rounded-l-md ${
                            modoVisualizacao === 'lista'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                          title="Visualização em lista"
                        >
                          <TableCellsIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setModoVisualizacao('cartoes')}
                          className={`p-1.5 rounded-r-md ${
                            modoVisualizacao === 'cartoes'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                          title="Visualização em cartões"
                        >
                          <ViewColumnsIcon className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <button
                        onClick={handleAdicionarBloco}
                        className="inline-flex items-center px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm"
                      >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Novo Bloco
                      </button>
                    </div>
                  </div>

                  {/* Lista de blocos com drag and drop */}
                  {blocosFiltrados.length > 0 ? (
                    bandaSelecionada && Array.isArray(bandas) ? (
                      <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900">
                              Blocos de {Array.isArray(bandas) ? bandas.find(b => b.id === bandaSelecionada)?.nome || 'Banda Selecionada' : 'Banda Selecionada'}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {blocosFiltrados.length} {blocosFiltrados.length === 1 ? 'bloco' : 'blocos'} cadastrados
                            </p>
                          </div>
                          <button
                            onClick={handleAdicionarBloco}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                          >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Novo Bloco
                          </button>
                        </div>
                        <div className="border-t border-gray-200">
                          {blocosFiltrados.length > 0 ? (
                            <div className="space-y-4">
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
                            <div className="text-center py-12">
                              <p className="text-sm text-gray-500">
                                Esta banda ainda não possui blocos cadastrados.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : modoVisualizacao === 'lista' ? (
                      <div className="bg-gray-800 shadow overflow-hidden sm:rounded-md border border-gray-700">
                        <div className="space-y-4">
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
                      </div>
                    ) : (
                      <BlocosGrid 
                        blocos={blocosFiltrados}
                        bandas={bandas}
                        musicas={musicas}
                        onDragEnd={handleDragEnd}
                        onEditarBloco={handleEditarBloco}
                        onExcluirBloco={handleExcluirBloco}
                        onAdicionarMusica={handleAdicionarMusicaAoBloco}
                      />
                    )
                  ) : (
                    <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
                      <MusicalNoteIcon className="mx-auto h-12 w-12 text-gray-500" />
                      <h3 className="mt-2 text-sm font-medium text-gray-200">Nenhum bloco encontrado</h3>
                      <p className="mt-1 text-sm text-gray-400">
                        {busca || bandaSelecionada
                          ? 'Tente ajustar os filtros ou fazer uma busca diferente.'
                          : 'Comece adicionando seu primeiro bloco musical.'}
                      </p>
                      <div className="mt-6">
                        <button
                          onClick={handleAdicionarBloco}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                          Novo Bloco
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

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
    </DndProvider>
  );
} 
