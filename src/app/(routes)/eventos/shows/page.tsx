'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  Users, 
  MoreHorizontal, 
  FileEdit, 
  Trash2, 
  Eye,
  List,
  Grid,
  Music2,
  X,
  Phone,
  Hotel,
  DollarSign
} from 'lucide-react';
import { Evento, Banda, TipoEvento, ContatoShow, EquipamentoShow, HospedagemShow, CustoShow } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ContatoForm } from './components/ContatoForm';
import { EquipamentosForm } from './components/EquipamentosForm';
import { HospedagemForm } from './components/HospedagemForm';
import { CustosForm } from './components/CustosForm';

// Definindo interface temporária para compatibilidade com os dados mockados
interface EventoDisplay extends Omit<Evento, 'bandaId'> {
  nome?: string; // Alias para 'titulo'
  hora_inicio?: string; // Alias para 'horaInicio'
  hora_termino?: string; // Alias para 'horaFim'
  banda?: { id: string; nome: string }; // Para substituir bandaId
  tipo: TipoEvento; // Garantindo que o tipo seja corretamente definido
}

// Card de estatísticas para a página de shows
const ShowStatCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => (
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

interface ShowEvento {
  id: string;
  titulo: string;
  tipo: 'show' | 'ensaio' | 'reuniao';
  data: string;
  local: string;
  status: 'agendado' | 'confirmado' | 'cancelado' | 'realizado';
  contatos?: ContatoShow[];
  equipamentos?: EquipamentoShow[];
  hospedagem?: HospedagemShow | null;
  custos?: CustoShow[];
  horaInicio?: string;
  horaFim?: string;
  banda?: {
    nome: string;
  };
  nome?: string;
  valor?: string;
  descricao?: string;
  observacoes?: string;
}

interface ShowsTableProps {
  eventos: ShowEvento[];
  onDelete: (evento: ShowEvento) => void;
  onView: (evento: ShowEvento) => void;
  onEdit: (evento: ShowEvento) => void;
}

const ShowsTable = ({ eventos, onDelete, onView, onEdit }: ShowsTableProps) => {
  const router = useRouter();
  const [selectedEvento, setSelectedEvento] = useState<ShowEvento | null>(null);
  const [showContatoModal, setShowContatoModal] = useState(false);
  const [showEquipamentosModal, setShowEquipamentosModal] = useState(false);
  const [showHospedagemModal, setShowHospedagemModal] = useState(false);
  const [showCustosModal, setShowCustosModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [eventosFiltrados, setEventosFiltrados] = useState<ShowEvento[]>(eventos);
  const [sortColumn, setSortColumn] = useState<string>('data');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroBanda, setFiltroBanda] = useState<string>('todas');
  const [modoVisualizacao, setModoVisualizacao] = useState<'lista' | 'cartoes'>('lista');
  const { toast } = useToast();

  const formatarData = (data: string) => {
    const date = new Date(data);
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  };

  const formatarHorario = (evento: ShowEvento | null) => {
    if (!evento) return '--:-- - --:--';
    return `${evento.horaInicio || '--:--'} - ${evento.horaFim || '--:--'}`;
  };

  useEffect(() => {
    // Filtrar por busca e banda
    let filtered = eventos;
    
    if (searchTerm) {
      filtered = filtered.filter(evento => 
        (evento.titulo || evento.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (evento.local || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (evento.banda?.nome || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filtroBanda !== 'todas') {
      filtered = filtered.filter(evento => 
        evento.banda?.nome === filtroBanda
      );
    }
    
    // Ordenar
    filtered = [...filtered].sort((a, b) => {
      if (sortColumn === 'data') {
        const dateA = new Date(a.data);
        const dateB = new Date(b.data);
        return sortDirection === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      }
      if (sortColumn === 'nome') {
        const nomeA = (a.titulo || a.nome || '');
        const nomeB = (b.titulo || b.nome || '');
        return sortDirection === 'asc' 
          ? nomeA.localeCompare(nomeB) 
          : nomeB.localeCompare(nomeA);
      }
      if (sortColumn === 'local') {
        const localA = a.local || '';
        const localB = b.local || '';
        return sortDirection === 'asc' 
          ? localA.localeCompare(localB) 
          : localB.localeCompare(localA);
      }
      if (sortColumn === 'banda') {
        const bandaA = a.banda?.nome || '';
        const bandaB = b.banda?.nome || '';
        return sortDirection === 'asc' 
          ? bandaA.localeCompare(bandaB) 
          : bandaB.localeCompare(bandaA);
      }
      return 0;
    });
    
    setEventosFiltrados(filtered);
  }, [eventos, sortColumn, sortDirection, searchTerm, filtroBanda]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Extrair lista única de bandas para o filtro
  const bandas = ['todas', ...new Set(eventos.map(e => e.banda?.nome).filter(Boolean) as string[])];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSelectedEvento((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleSelectChange = (value: string, name: string) => {
    setSelectedEvento((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEvento) return;

    try {
      const response = await fetch('/api/eventos/shows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...selectedEvento,
          tipo: 'show',
          status: 'agendado'
        }),
      });

      if (response.ok) {
        toast({
          title: "Show criado com sucesso!",
          description: "O novo show foi adicionado à sua agenda.",
          variant: "default",
        });
        setShowContatoModal(false);
        setSelectedEvento(null);
      } else {
        throw new Error('Erro ao criar show');
      }
    } catch (error) {
      toast({
        title: "Erro ao criar show",
        description: "Ocorreu um erro ao tentar criar o show. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleSaveContatos = (contatos: ContatoShow[]) => {
    if (selectedEvento) {
      const eventoAtualizado: ShowEvento = {
        ...selectedEvento,
        contatos
      };
      onEdit(eventoAtualizado);
      setShowContatoModal(false);
    }
  };

  const handleSaveEquipamentos = (equipamentos: EquipamentoShow[]) => {
    if (selectedEvento) {
      const eventoAtualizado: ShowEvento = {
        ...selectedEvento,
        equipamentos
      };
      onEdit(eventoAtualizado);
      setShowEquipamentosModal(false);
    }
  };

  const handleSaveHospedagem = (hospedagem: HospedagemShow) => {
    if (selectedEvento) {
      const eventoAtualizado: ShowEvento = {
        ...selectedEvento,
        hospedagem
      };
      onEdit(eventoAtualizado);
      setShowHospedagemModal(false);
    }
  };

  const handleSaveCustos = (custos: CustoShow[]) => {
    if (selectedEvento) {
      const eventoAtualizado: ShowEvento = {
        ...selectedEvento,
        custos
      };
      onEdit(eventoAtualizado);
      setShowCustosModal(false);
    }
  };

  const handleEditClick = (evento: any) => {
    setSelectedEvento(evento);
  };

  const handleContatoClick = (evento: ShowEvento) => {
    if (!evento) return;
    setSelectedEvento(evento);
    setShowContatoModal(true);
  };

  const handleEquipamentosClick = (evento: ShowEvento) => {
    if (!evento) return;
    setSelectedEvento(evento);
    setShowEquipamentosModal(true);
  };

  const handleHospedagemClick = (evento: ShowEvento) => {
    if (!evento) return;
    setSelectedEvento(evento);
    setShowHospedagemModal(true);
  };

  const handleCustosClick = (evento: ShowEvento) => {
    if (!evento) return;
    setSelectedEvento(evento);
    setShowCustosModal(true);
  };

  const handleDelete = async (evento: ShowEvento) => {
    if (!evento.id) return;
    // ... rest of delete logic
  };

  const handleView = (evento: ShowEvento) => {
    if (!evento.id) return;
    // ... rest of view logic
  };

  const handleEdit = (evento: ShowEvento) => {
    if (!evento.id) return;
    // ... rest of edit logic
  };

  const handleStatusChange = async (id: string, newStatus: 'agendado' | 'confirmado' | 'cancelado' | 'realizado') => {
    // ... rest of status change logic
  };

  const getStatusBadge = (status: 'agendado' | 'confirmado' | 'cancelado' | 'realizado') => {
    const statusConfig = {
      agendado: { color: 'yellow', text: 'Agendado' },
      confirmado: { color: 'green', text: 'Confirmado' },
      cancelado: { color: 'red', text: 'Cancelado' },
      realizado: { color: 'blue', text: 'Realizado' }
    };

    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-md bg-${config.color}-500/20 text-${config.color}-400`}>
        {config.text}
      </span>
    );
  };

  const handleViewClick = (evento: ShowEvento) => {
    setSelectedEvento(evento);
    setShowViewModal(true);
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      {/* Filtros e Busca */}
      <div className="p-4 border-b border-gray-700 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[250px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar shows..." 
            className="bg-gray-700/50 text-white pl-10 pr-4 py-2 rounded-md border border-gray-600 w-full focus:outline-none focus:ring-2 focus:ring-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-400" />
            <select
              className="bg-gray-700/50 text-white px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={filtroBanda}
              onChange={(e) => setFiltroBanda(e.target.value)}
            >
              {bandas.map(banda => (
                <option key={banda} value={banda}>
                  {banda === 'todas' ? 'Todas as bandas' : banda}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <button
                type="button"
                className={`p-2 ${
                  modoVisualizacao === 'lista'
                    ? 'text-white bg-gray-700'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
                onClick={() => setModoVisualizacao('lista')}
                title="Visualização em Lista"
              >
                <List size={18} />
              </button>
              <button
                type="button"
                className={`p-2 ${
                  modoVisualizacao === 'cartoes'
                    ? 'text-white bg-gray-700'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
                onClick={() => setModoVisualizacao('cartoes')}
                title="Visualização em Cartões"
              >
                <Grid size={18} />
              </button>
            </div>
            
            <Button
              onClick={() => router.push('/eventos/shows/novo')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center space-x-2"
            >
              <Plus size={18} />
              <span>Novo Show</span>
            </Button>
          </div>
        </div>
      </div>
      
      {eventosFiltrados.length > 0 ? (
        modoVisualizacao === 'lista' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase bg-gray-800/50 text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3 cursor-pointer hover:text-white" onClick={() => handleSort('data')}>
                    DATA {sortColumn === 'data' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th scope="col" className="px-6 py-3 cursor-pointer hover:text-white" onClick={() => handleSort('banda')}>
                    BANDA {sortColumn === 'banda' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th scope="col" className="px-6 py-3 cursor-pointer hover:text-white" onClick={() => handleSort('local')}>
                    LOCAL {sortColumn === 'local' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">STATUS</th>
                  <th scope="col" className="px-6 py-3 text-right">AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {eventosFiltrados.map((eventoItem) => (
                  <tr key={eventoItem.id} className="border-t border-gray-700 hover:bg-gray-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-medium">{formatarData(eventoItem.data)}</span>
                        <span className="text-gray-400 text-xs flex items-center mt-1">
                          <Clock size={12} className="mr-1" />
                          {formatarHorario(eventoItem)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{eventoItem.banda?.nome || 'Sem banda'}</td>
                    <td className="px-6 py-4">{eventoItem.local}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <Select
                          value={eventoItem.status}
                          onValueChange={(value: 'agendado' | 'confirmado' | 'cancelado' | 'realizado') => handleStatusChange(eventoItem.id, value)}
                        >
                          <SelectTrigger className="w-[120px] h-8 bg-gray-700/50 text-gray-300 border-gray-600 hover:bg-gray-600/50">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="agendado">Agendado</SelectItem>
                            <SelectItem value="confirmado">Confirmado</SelectItem>
                            <SelectItem value="cancelado">Cancelado</SelectItem>
                            <SelectItem value="realizado">Realizado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewClick(eventoItem)}
                          className="p-2 text-gray-400 hover:text-white"
                          title="Visualizar"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => onEdit(eventoItem)}
                          className="p-2 text-gray-400 hover:text-white"
                          title="Editar"
                        >
                          <FileEdit size={18} />
                        </button>
                        <button
                          onClick={() => onDelete(eventoItem)}
                          className="p-2 text-gray-400 hover:text-white"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gray-900/30 rounded-lg overflow-x-auto">
            {eventosFiltrados.map((evento) => (
              <div 
                key={evento.id} 
                className="bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden rounded-xl border border-gray-700 flex flex-col h-full hover:translate-y-[-3px] hover:border-indigo-500/50 min-w-[300px]"
              >
                {/* Cabeçalho do cartão */}
                <div className="p-3 flex flex-col bg-gradient-to-r from-blue-800 to-blue-900 border-b border-blue-700">
                  <div className="flex items-center w-full">
                    <div className="flex-1 min-w-0">
                      <h3 
                        className="text-base font-medium text-white leading-tight line-clamp-1 text-center"
                        title={evento.titulo || evento.nome || ''}
                      >
                        {evento.titulo || evento.nome}
                      </h3>
                    </div>
                  </div>
                  <div className="mt-1 flex items-center justify-center w-full">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-800/70 text-purple-100 shadow-sm">
                      {evento.banda?.nome || 'Sem banda'}
                    </span>
                  </div>
                </div>
                
                {/* Corpo do cartão */}
                <div className="px-4 py-4 flex-grow bg-gradient-to-b from-gray-800 to-gray-850">
                  <div className="space-y-3">
                    {/* Data */}
                    <div className="flex items-start">
                      <div className="bg-gray-700/50 p-1.5 rounded-lg mr-2.5 flex-shrink-0">
                        <Calendar size={16} className="text-blue-300" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium mb-0.5">Data</p>
                        <p className="text-gray-200 text-sm">
                          {formatarData(evento.data)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Horário */}
                    <div className="flex items-start">
                      <div className="bg-gray-700/50 p-1.5 rounded-lg mr-2.5 flex-shrink-0">
                        <Clock size={16} className="text-blue-300" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium mb-0.5">Horário</p>
                        <p className="text-gray-200 text-sm">
                          {formatarHorario(evento)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Local */}
                    <div className="flex items-start">
                      <div className="bg-gray-700/50 p-1.5 rounded-lg mr-2.5 flex-shrink-0">
                        <MapPin size={16} className="text-blue-300" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium mb-0.5">Local</p>
                        <p className="text-gray-200 text-sm">
                          {evento.local || 'Não definido'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rodapé com ações */}
                <div className="p-3 sm:px-6 flex justify-end items-center bg-gray-850 border-t border-gray-700/50 mt-auto">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewClick(evento)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-blue-300 hover:bg-blue-800/30 transition-colors duration-200"
                      title="Visualizar show"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(evento)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-yellow-300 hover:bg-yellow-800/30 transition-colors duration-200"
                      title="Editar show"
                    >
                      <FileEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(evento)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-red-300 hover:bg-red-800/30 transition-colors duration-200"
                      title="Excluir show"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="p-8 text-center">
          <div className="text-gray-400">Nenhum show encontrado</div>
        </div>
      )}

      {/* Modais para cada formulário */}
      {showContatoModal && (
        <Dialog open={showContatoModal} onOpenChange={setShowContatoModal}>
          <DialogContent className="sm:max-w-[800px] bg-gray-900 text-white">
            <ContatoForm
              contatos={selectedEvento?.contatos || []}
              onSave={handleSaveContatos}
              onClose={() => setShowContatoModal(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {showEquipamentosModal && (
        <Dialog open={showEquipamentosModal} onOpenChange={setShowEquipamentosModal}>
          <DialogContent className="sm:max-w-[800px] bg-gray-900 text-white">
            <EquipamentosForm
              equipamentos={selectedEvento?.equipamentos || []}
              onSave={handleSaveEquipamentos}
              onClose={() => setShowEquipamentosModal(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {showHospedagemModal && (
        <Dialog open={showHospedagemModal} onOpenChange={setShowHospedagemModal}>
          <DialogContent className="sm:max-w-[800px] bg-gray-900 text-white">
            <HospedagemForm
              hospedagem={selectedEvento?.hospedagem || null}
              onSave={handleSaveHospedagem}
              onClose={() => setShowHospedagemModal(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {showCustosModal && (
        <Dialog open={showCustosModal} onOpenChange={setShowCustosModal}>
          <DialogContent className="sm:max-w-[800px] bg-gray-900 text-white">
            <CustosForm
              custos={selectedEvento?.custos || []}
              onSave={handleSaveCustos}
              onClose={() => setShowCustosModal(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Modal de Visualização */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-900 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white">
              {selectedEvento?.titulo || selectedEvento?.nome}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Informações Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Informações Principais</h3>
                <div className="space-y-2">
                  <p><strong>Banda:</strong> {selectedEvento?.banda?.nome || 'Não especificada'}</p>
                  <p><strong>Data:</strong> {selectedEvento?.data ? formatarData(selectedEvento.data) : 'Não especificada'}</p>
                  <p><strong>Horário:</strong> {formatarHorario(selectedEvento)}</p>
                  <p><strong>Local:</strong> {selectedEvento?.local || 'Não especificado'}</p>
                  <p><strong>Status:</strong> {selectedEvento?.status || 'Não especificado'}</p>
                </div>
              </div>

              {selectedEvento?.descricao && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Descrição</h3>
                  <p className="text-gray-300">{selectedEvento.descricao}</p>
                </div>
              )}
            </div>

            {/* Contatos */}
            {selectedEvento?.contatos && selectedEvento.contatos.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Contatos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedEvento.contatos.map((contato, index) => (
                    <div key={index} className="p-4 bg-gray-800 rounded-lg">
                      <p><strong>Nome:</strong> {contato.nome}</p>
                      <p><strong>Função:</strong> {contato.funcao}</p>
                      <p><strong>Telefone:</strong> {contato.telefone}</p>
                      <p><strong>Email:</strong> {contato.email}</p>
                      {contato.observacoes && (
                        <p><strong>Observações:</strong> {contato.observacoes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Equipamentos */}
            {selectedEvento?.equipamentos && selectedEvento.equipamentos.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Equipamentos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedEvento.equipamentos.map((equipamento, index) => (
                    <div key={index} className="p-4 bg-gray-800 rounded-lg">
                      <p><strong>Tipo:</strong> {equipamento.tipo}</p>
                      <p><strong>Nome:</strong> {equipamento.nome}</p>
                      <p><strong>Quantidade:</strong> {equipamento.quantidade}</p>
                      <p><strong>Fornecedor:</strong> {equipamento.fornecedor}</p>
                      {equipamento.valorAluguel && (
                        <p><strong>Valor do Aluguel:</strong> R$ {equipamento.valorAluguel.toFixed(2)}</p>
                      )}
                      {equipamento.responsavel && (
                        <p><strong>Responsável:</strong> {equipamento.responsavel}</p>
                      )}
                      {equipamento.observacoes && (
                        <p><strong>Observações:</strong> {equipamento.observacoes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hospedagem */}
            {selectedEvento?.hospedagem && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Hospedagem</h3>
                <div className="p-4 bg-gray-800 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p><strong>Tipo:</strong> {selectedEvento.hospedagem.tipo}</p>
                      <p><strong>Nome:</strong> {selectedEvento.hospedagem.nome}</p>
                      <p><strong>Endereço:</strong> {selectedEvento.hospedagem.endereco}</p>
                      <p><strong>Cidade:</strong> {selectedEvento.hospedagem.cidade}</p>
                      <p><strong>Estado:</strong> {selectedEvento.hospedagem.estado}</p>
                    </div>
                    <div>
                      <p><strong>Check-in:</strong> {selectedEvento.hospedagem.checkInData} às {selectedEvento.hospedagem.checkInHora}</p>
                      <p><strong>Check-out:</strong> {selectedEvento.hospedagem.checkOutData} às {selectedEvento.hospedagem.checkOutHora}</p>
                      <p><strong>Número de Quartos:</strong> {selectedEvento.hospedagem.numeroQuartos}</p>
                      <p><strong>Valor da Diária:</strong> R$ {selectedEvento.hospedagem.valorDiaria.toFixed(2)}</p>
                      <p><strong>Inclui Café:</strong> {selectedEvento.hospedagem.incluiCafe ? 'Sim' : 'Não'}</p>
                    </div>
                  </div>
                  {selectedEvento.hospedagem.quartos && selectedEvento.hospedagem.quartos.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-md font-semibold mb-2">Quartos</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedEvento.hospedagem.quartos.map((quarto, index) => (
                          <div key={index} className="p-3 bg-gray-700 rounded">
                            <p><strong>Número:</strong> {quarto.numero}</p>
                            <p><strong>Andar:</strong> {quarto.andar}</p>
                            <p><strong>Tipo:</strong> {quarto.tipo}</p>
                            {quarto.hospedes && quarto.hospedes.length > 0 && (
                              <div>
                                <p><strong>Hóspedes:</strong></p>
                                <ul className="list-disc list-inside">
                                  {quarto.hospedes.map((hospede, idx) => (
                                    <li key={idx}>{hospede.nome} - {hospede.telefone}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {quarto.ssidWifi && (
                              <p><strong>Wi-Fi:</strong> {quarto.ssidWifi} - {quarto.senhaWifi}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedEvento.hospedagem.observacoes && (
                    <div className="mt-4">
                      <h4 className="text-md font-semibold mb-2">Observações</h4>
                      <p className="text-gray-300">{selectedEvento.hospedagem.observacoes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Custos */}
            {selectedEvento?.custos && selectedEvento.custos.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Custos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedEvento.custos.map((custo, index) => (
                    <div key={index} className="p-4 bg-gray-800 rounded-lg">
                      <p><strong>Categoria:</strong> {custo.categoria}</p>
                      <p><strong>Descrição:</strong> {custo.descricao}</p>
                      <p><strong>Valor:</strong> R$ {custo.valor.toFixed(2)}</p>
                      <p><strong>Forma de Pagamento:</strong> {custo.formaPagamento}</p>
                      <p><strong>Status:</strong> {custo.status}</p>
                      {custo.dataPagamento && (
                        <p><strong>Data de Pagamento:</strong> {formatarData(custo.dataPagamento)}</p>
                      )}
                      {custo.observacoes && (
                        <p><strong>Observações:</strong> {custo.observacoes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Observações */}
            {selectedEvento?.observacoes && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Observações Gerais</h3>
                <p className="text-gray-300">{selectedEvento.observacoes}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default function ShowsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroBanda, setFiltroBanda] = useState<string>('todas');
  const [modoVisualizacao, setModoVisualizacao] = useState<'lista' | 'cartoes'>('lista');
  const [eventos, setEventos] = useState<EventoDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchShows() {
      setLoading(true);
      try {
        // Carregar shows do localStorage
        const showsSalvos = JSON.parse(localStorage.getItem('shows') || '[]');
        
        // Atualizar o estado com os shows salvos
        setEventos(showsSalvos);
      } catch (error) {
        console.error('Erro ao buscar shows:', error);
        toast({
          title: "Erro ao carregar shows",
          description: "Não foi possível carregar a lista de shows.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchShows();
  }, []);

  const handleViewShow = (evento: ShowEvento) => {
    router.push(`/eventos/shows/${evento.id}`);
  };

  const handleEditShow = (evento: ShowEvento) => {
    router.push(`/eventos/shows/${evento.id}/editar`);
  };

  const handleDeleteShow = async (evento: ShowEvento) => {
    if (window.confirm('Tem certeza que deseja excluir este show?')) {
      try {
        // Remover do localStorage
        const showsAtuais = JSON.parse(localStorage.getItem('shows') || '[]');
        const showsAtualizados = showsAtuais.filter((show: ShowEvento) => show.id !== evento.id);
        localStorage.setItem('shows', JSON.stringify(showsAtualizados));
        
        // Atualizar estado
        setEventos(showsAtualizados);
        
        toast({
          title: "Show excluído",
          description: "O show foi removido com sucesso.",
          variant: "default",
        });
      } catch (error) {
        console.error('Erro ao excluir show:', error);
        toast({
          title: "Erro ao excluir show",
          description: "Não foi possível excluir o show. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  // Calcular estatísticas
  const showsAgendados = eventos.filter(e => e.status === 'agendado').length;
  const showsConfirmados = eventos.filter(e => e.status === 'confirmado').length;
  const showsRealizados = eventos.filter(e => e.status === 'realizado').length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Shows</h1>
          <p className="text-gray-400">Gerencie os shows da sua banda</p>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ShowStatCard 
          title="Shows Agendados" 
          value={showsAgendados} 
          icon={<Calendar size={20} />}
        />
        <ShowStatCard 
          title="Shows Confirmados" 
          value={showsConfirmados} 
          icon={<Calendar size={20} />}
        />
        <ShowStatCard 
          title="Shows Concluídos" 
          value={showsRealizados} 
          icon={<Calendar size={20} />}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500"></div>
        </div>
      ) : (
        <ShowsTable 
          eventos={eventos} 
          onDelete={handleDeleteShow} 
          onView={handleViewShow} 
          onEdit={handleEditShow} 
        />
      )}
    </div>
  );
} 