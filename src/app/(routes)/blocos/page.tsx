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
  };

  const handleEditarBloco = (bloco: Bloco) => {
    setBlocoEmEdicao(bloco);
    setModalBlocoAberto(true);
  };

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
    
    // Adicionar a nova música ao array de músicas
    const novasMusicas = [...musicas, novaMusica];
    setMusicas(novasMusicas);
    
    // Fechar o modal
    setModalMusicaAberto(false);
    
    alertaSucesso('Música criada com sucesso!');
  };

  // Função para lidar com o resultado do drag and drop
  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    
    // Se não há destino (arrastou para fora de uma área válida), não faz nada
    if (!destination) {
      return;
    }

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
    </DragDropContext>
  );
} 
