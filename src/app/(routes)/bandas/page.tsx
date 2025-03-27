'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Eye, 
  FileEdit, 
  Trash2, 
  Table as TableIcon, 
  Grid
} from 'lucide-react';
import { Banda } from '@/lib/types';
<<<<<<< HEAD
import { Button } from '@/components/ui/button';

export default function BandasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bandaEditando, setBandaEditando] = useState<Banda | undefined>(undefined);
  const [bandas, setBandas] = useState<Banda[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [mostraForm, setMostraForm] = useState(false);
=======
import { confirmar, alertaSucesso, alertaErro } from '@/lib/sweetalert';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Estende a interface Banda para incluir integrantes
interface BandaComIntegrantes extends Banda {
  integrantes?: {
    id: string;
    nome: string;
    instrumento?: string;
    apelido?: string;
  }[];
}
>>>>>>> 5d49630809b82c0fd6e9b76bf3898e17ba9220c6

// Componente de tabela de bandas
const BandasTable = ({ 
  bandas, 
  onDelete, 
  onView,
  router
}: { 
  bandas: BandaComIntegrantes[]; 
  onDelete: (id: string) => void;
  onView: (banda: BandaComIntegrantes) => void;
  router: any;
}) => {
  const [bandasFiltradas, setBandasFiltradas] = useState<BandaComIntegrantes[]>(bandas);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroGenero, setFiltroGenero] = useState('todos');

  // Filtra as bandas quando os critérios de filtro mudam
  useEffect(() => {
<<<<<<< HEAD
    carregarBandas();
  }, []);

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
    } finally {
      setCarregando(false);
    }
  };

  const handleSubmit = async (banda: Omit<Banda, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/bandas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(banda),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar banda');
      }

      await carregarBandas();
      setMostraForm(false);
      setBandaEditando(undefined);
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao criar banda');
=======
    const filteredBandas = bandas.filter(banda => {
      const matchesTerm = banda.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         banda.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         searchTerm === '';
      
      const matchesGenero = filtroGenero === 'todos' || banda.genero === filtroGenero;
      
      return matchesTerm && matchesGenero;
    });
    
    setBandasFiltradas(filteredBandas);
  }, [bandas, searchTerm, filtroGenero]);

  // Função para lidar com exclusão
  const handleDelete = async (id: string) => {
    const confirmed = await confirmar('Excluir banda', 'Tem certeza que deseja excluir esta banda?', 'warning');
    if (confirmed) {
      onDelete(id);
>>>>>>> 5d49630809b82c0fd6e9b76bf3898e17ba9220c6
    }
  };

  // Array de gêneros únicos para o filtro
  const generos = ["todos", ...Array.from(new Set(bandas.map(banda => banda.genero || "").filter(Boolean)))];

  return (
    <>
      <div className="w-full space-y-6">
        {/* Barra de pesquisa e filtros */}
        <div className="flex flex-col sm:flex-row gap-3 bg-gray-850 rounded-lg p-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Pesquisar bandas..."
              className="pl-9 bg-gray-900 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-600"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={filtroGenero} onValueChange={setFiltroGenero}>
            <SelectTrigger className="w-full sm:w-[180px] bg-gray-900 border-gray-600 text-white">
              <SelectValue placeholder="Filtrar por gênero" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-600">
              {generos.map((genero) => (
                <SelectItem key={genero} value={genero} className="text-white hover:bg-gray-800">
                  {genero === "todos" ? "Todos os gêneros" : genero}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tabela */}
        <div className="bg-gray-850 rounded-lg overflow-hidden border border-gray-800 shadow-lg">
          <Table>
            <TableHeader className="bg-gray-900">
              <TableRow className="hover:bg-gray-900/90 border-b border-gray-800">
                <TableHead className="text-left font-semibold text-white w-[250px]">NOME</TableHead>
                <TableHead className="text-left font-semibold text-white w-[150px]">GÊNERO</TableHead>
                <TableHead className="text-left font-semibold text-white">DESCRIÇÃO</TableHead>
                <TableHead className="text-left font-semibold text-white">INTEGRANTES</TableHead>
                <TableHead className="text-right w-[100px]">AÇÕES</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bandasFiltradas.length > 0 ? (
                bandasFiltradas.map((banda) => (
                  <TableRow key={banda.id} className="hover:bg-gray-800/80 border-b border-gray-800/50">
                    <TableCell className="font-medium text-white">
                      {banda.nome}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-700 text-purple-50">
                        {banda.genero || 'Não definido'}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-300 max-w-[300px] truncate">
                      {banda.descricao || 'Sem descrição'}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {banda.integrantes && banda.integrantes.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {banda.integrantes.slice(0, 3).map((integrante) => (
                            <span 
                              key={integrante.id}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-800 text-white"
                              title={integrante.instrumento || ''}
                            >
                              {integrante.apelido || integrante.nome}
                            </span>
                          ))}
                          {banda.integrantes.length > 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-600 text-gray-200">
                              +{banda.integrantes.length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        "Nenhum integrante"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => onView(banda)}
                          className="text-gray-400 hover:text-blue-400 transition-colors"
                          title="Ver Detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <Link
                          href={`/bandas/editar/${banda.id}`}
                          className="text-gray-400 hover:text-yellow-400 transition-colors"
                          title="Editar"
                        >
                          <FileEdit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(banda.id)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                    Nenhuma banda encontrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default function BandasPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [bandas, setBandas] = useState<BandaComIntegrantes[]>([]);
  const [bandaSelecionada, setBandaSelecionada] = useState<BandaComIntegrantes | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"table" | "cards">("table");
  const router = useRouter();
  const [totalBandas, setTotalBandas] = useState(0);
  const [totalGeneros, setTotalGeneros] = useState(0);
  const [totalMusicos, setTotalMusicos] = useState(0);

  useEffect(() => {
    buscarBandas();
  }, []);

  async function buscarBandas() {
    try {
      setIsLoading(true);
      const res = await fetch('/api/bandas/', {
        method: 'GET'
      });

      if (!res.ok) {
        throw new Error("Erro ao buscar as bandas");
      }

      const resposta = await res.json();
      console.log('Resposta da API:', resposta);
      const bandasData = resposta.data || [];
      setBandas(bandasData);
      
      // Calcular estatísticas
      setTotalBandas(bandasData.length);
      
      // Calcular total de gêneros únicos
      const generos = new Set(bandasData.map((banda: BandaComIntegrantes) => banda.genero).filter(Boolean));
      setTotalGeneros(generos.size);
      
      // Calcular total de músicos únicos em todas as bandas
      const musicosIds = new Set();
      bandasData.forEach((banda: BandaComIntegrantes) => {
        if (banda.integrantes && banda.integrantes.length > 0) {
          banda.integrantes.forEach(integrante => {
            if (integrante.id) {
              musicosIds.add(integrante.id);
            }
          });
        }
      });
      setTotalMusicos(musicosIds.size);
    } catch (error) {
      console.error("Erro ao buscar bandas:", error);
      setError("Erro ao buscar as bandas");
    } finally {
      setIsLoading(false);
    }
  }

  const handleDeleteBanda = async (id: string) => {
    try {
      const res = await fetch(`/api/bandas/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        throw new Error("Erro ao excluir a banda");
      }

      await buscarBandas();
      alertaSucesso("Banda excluída com sucesso!");
    } catch (error) {
      console.error(error);
      alertaErro("Erro ao excluir a banda");
    }
  };

  const handleOpenModal = (banda: BandaComIntegrantes) => {
    setBandaSelecionada(banda);
    setIsModalOpen(true);
  };

  const handleOpenSheet = (banda: BandaComIntegrantes) => {
    setBandaSelecionada(banda);
    setIsMobileSheetOpen(true);
  };

<<<<<<< HEAD
  const handleSeed = async () => {
    try {
      const response = await fetch('/api/bandas/seed', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Erro ao adicionar bandas');
      }

      const data = await response.json();
      console.log('Bandas adicionadas:', data);
      
      // Recarrega as bandas
      await carregarBandas();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao adicionar bandas');
    }
  };

  if (carregando) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Minhas Bandas</h1>
          <div className="space-x-4">
            <Button onClick={() => setMostraForm(true)}>
              Nova Banda
            </Button>
          </div>
=======
  if (isLoading) {
    return <div className="p-4">Carregando...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container p-4 mx-auto">
      <div className="flex flex-col space-y-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-white">Bandas</h1>
          <p className="text-sm text-zinc-400">
            Gerencie suas bandas e grupos musicais
          </p>
>>>>>>> 5d49630809b82c0fd6e9b76bf3898e17ba9220c6
        </div>

        <div className="flex flex-wrap gap-4 mt-8">
          <div className="stat-card group relative overflow-hidden p-3 bg-gradient-to-r from-gray-800 to-gray-800/95 rounded-xl border border-gray-700/50 shadow-md transition-all duration-300 hover:shadow-purple-900/20 hover:border-purple-500/30 flex flex-1 items-center justify-between min-w-[200px]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-purple-700/20 text-purple-400 ring-1 ring-purple-500/30 shadow-inner shadow-purple-600/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M19 9V5L12 2L5 5v4"></path>
                  <circle cx="12" cy="11" r="2"></circle>
                  <path d="M12 13v8"></path>
                  <path d="M9 21h6"></path>
                </svg>
              </div>
              <div className="text-xs text-gray-400">bandas</div>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-purple-200 group-hover:to-purple-400 transition-colors duration-300">{totalBandas}</div>
          </div>

          <div className="stat-card group relative overflow-hidden p-3 bg-gradient-to-r from-gray-800 to-gray-800/95 rounded-xl border border-gray-700/50 shadow-md transition-all duration-300 hover:shadow-indigo-900/20 hover:border-indigo-500/30 flex flex-1 items-center justify-between min-w-[200px]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-600/20 to-indigo-700/20 text-indigo-400 ring-1 ring-indigo-500/30 shadow-inner shadow-indigo-600/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M9 18V5l12-2v13"></path>
                  <circle cx="6" cy="18" r="3"></circle>
                  <circle cx="18" cy="16" r="3"></circle>
                </svg>
              </div>
              <div className="text-xs text-gray-400">gêneros</div>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-indigo-200 group-hover:to-indigo-400 transition-colors duration-300">{totalGeneros}</div>
          </div>

          <div className="stat-card group relative overflow-hidden p-3 bg-gradient-to-r from-gray-800 to-gray-800/95 rounded-xl border border-gray-700/50 shadow-md transition-all duration-300 hover:shadow-blue-900/20 hover:border-blue-500/30 flex flex-1 items-center justify-between min-w-[200px]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/20 to-blue-700/20 text-blue-400 ring-1 ring-blue-500/30 shadow-inner shadow-blue-600/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div className="text-xs text-gray-400">músicos</div>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-blue-200 group-hover:to-blue-400 transition-colors duration-300">{totalMusicos}</div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-8">
          <div className="flex space-x-2">
            <Button 
              onClick={() => setView("table")} 
              variant={view === "table" ? "outline" : "default"}
              size="sm"
              className="hidden sm:flex"
              title="Visualização em tabela"
            >
              <TableIcon className="h-4 w-4 mr-1" />
              Tabela
            </Button>
            <Button 
              onClick={() => setView("cards")} 
              variant={view === "cards" ? "outline" : "default"}
              size="sm"
              className="hidden sm:flex"
              title="Visualização em cartões"
            >
              <Grid className="h-4 w-4 mr-1" />
              Cartões
            </Button>
          </div>
          <Button
            onClick={() => router.push('/bandas/nova')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Nova Banda
          </Button>
        </div>

        {view === "cards" ? (
          <div className="w-full space-y-6">
            {/* Barra de pesquisa e filtros */}
            <div className="flex flex-col sm:flex-row gap-3 bg-gray-850 rounded-lg p-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Pesquisar bandas..."
                  className="pl-9 bg-gray-900 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-600"
                />
              </div>
              
              <Select defaultValue="todos">
                <SelectTrigger className="w-full sm:w-[180px] bg-gray-900 border-gray-600 text-white">
                  <SelectValue placeholder="Filtrar por gênero" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-600">
                  <SelectItem value="todos" className="text-white hover:bg-gray-800">
                    Todos os gêneros
                  </SelectItem>
                  {Array.from(new Set(bandas.map(banda => banda.genero || "").filter(Boolean))).map((genero) => (
                    <SelectItem key={genero} value={genero} className="text-white hover:bg-gray-800">
                      {genero}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Exibição dos cartões */}
            {bandas.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {bandas.map((banda) => (
                  <div
                    key={banda.id}
                    className="group relative bg-gray-800 hover:bg-gray-700 rounded-lg p-4 border border-gray-700 hover:border-gray-500 transition-all duration-200 shadow-lg"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {banda.nome}
                          </h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-700 text-white">
                            {banda.genero || 'Não definido'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenModal(banda)}
                            className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                            title="Ver Detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <Link
                            href={`/bandas/editar/${banda.id}`}
                            className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                            title="Editar"
                          >
                            <FileEdit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteBanda(banda.id)}
                            className="p-1.5 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {banda.descricao || 'Sem descrição'}
                      </p>

                      <div className="mt-auto">
                        <div className="text-sm text-gray-400 mb-2">Integrantes:</div>
                        {banda.integrantes && banda.integrantes.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {banda.integrantes.slice(0, 3).map((integrante) => (
                              <span
                                key={integrante.id}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900 text-white border border-blue-700"
                                title={integrante.instrumento || ''}
                              >
                                {integrante.apelido || integrante.nome}
                              </span>
                            ))}
                            {banda.integrantes.length > 3 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-white border border-gray-600">
                                +{banda.integrantes.length - 3}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">Nenhum integrante</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="text-gray-400">Nenhuma banda encontrada</div>
              </div>
            )}
          </div>
        ) : (
          <BandasTable 
            bandas={bandas} 
            onDelete={handleDeleteBanda}
            onView={handleOpenModal}
            router={router}
          />
        )}
      </div>

<<<<<<< HEAD
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setBandaEditando(undefined);
        }}
        title={bandaEditando ? 'Editar Banda' : 'Nova Banda'}
      >
        <BandaForm
          banda={bandaEditando}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setBandaEditando(undefined);
          }}
        />
      </Modal>

      {mostraForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Nova Banda</h2>
            <BandaForm
              banda={bandaEditando}
              onSubmit={handleSubmit}
              onCancel={() => {
                setMostraForm(false);
                setBandaEditando(undefined);
              }}
            />
          </div>
        </div>
      )}
=======
      {/* Dialog para visualizar banda */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg bg-gray-800 border border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">
              Detalhes da Banda
            </DialogTitle>
          </DialogHeader>
          
          {bandaSelecionada && (
            <div className="space-y-4 mt-2">
              <div>
                <h3 className="text-2xl font-bold text-white">{bandaSelecionada.nome}</h3>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-800/70 text-purple-100">
                    {bandaSelecionada.genero || 'Gênero não definido'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-4 border-t border-gray-700">
                {/* Descrição */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-400">Descrição</h4>
                  {bandaSelecionada.descricao ? (
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{bandaSelecionada.descricao}</p>
                  ) : (
                    <p className="text-sm text-gray-500">Sem descrição registrada</p>
                  )}
                </div>

                {/* Integrantes */}
                {bandaSelecionada.integrantes && bandaSelecionada.integrantes.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-gray-700">
                    <h4 className="text-sm font-medium text-gray-400">Integrantes</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {bandaSelecionada.integrantes.map((integrante) => (
                        <span
                          key={integrante.id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-800 text-white"
                        >
                          {integrante.nome} {integrante.instrumento ? `- ${integrante.instrumento}` : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-700">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Fechar
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    setIsModalOpen(false);
                    router.push(`/bandas/editar/${bandaSelecionada.id}`);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Editar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
>>>>>>> 5d49630809b82c0fd6e9b76bf3898e17ba9220c6
    </div>
  );
} 