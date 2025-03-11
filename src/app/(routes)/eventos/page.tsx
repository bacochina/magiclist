'use client';

import { useState, useEffect, useMemo } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Evento, TipoEvento, StatusEvento, Banda, Integrante, Musica } from '@/lib/types';
import { useHydratedLocalStorage } from '@/hooks/useHydratedLocalStorage';
import { ClientOnly } from '../blocos/components/ClientOnly';
import { EventoForm } from './components/EventoForm';
import { EventosGraficos } from './components/EventosGraficos';
import { format, parseISO, isAfter, isBefore, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon, 
  MagnifyingGlassIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  DocumentTextIcon,
  AdjustmentsHorizontalIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon as ClockIconSolid,
  MusicalNoteIcon,
  ChatBubbleLeftRightIcon,
  ViewColumnsIcon,
  TableCellsIcon,
  ChartBarIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { popularEventosExemplo } from './data/eventos-exemplo';
import { useRouter } from 'next/navigation';
import { jsPDF } from 'jspdf';

export default function EventosPage() {
  const [eventos, setEventos] = useHydratedLocalStorage<Evento[]>('eventos', []);
  const [bandas] = useHydratedLocalStorage<Banda[]>('bandas', []);
  const [integrantes] = useHydratedLocalStorage<Integrante[]>('integrantes', []);
  const [musicas] = useHydratedLocalStorage<Musica[]>('musicas', []);
  const [repertorios] = useHydratedLocalStorage<{ id: string; nome: string; musicas: string[] }[]>('repertorios', []);
  
  const [modalAberto, setModalAberto] = useState(false);
  const [eventoEmEdicao, setEventoEmEdicao] = useState<Evento | undefined>();
  const [modalRelatorioAberto, setModalRelatorioAberto] = useState(false);
  const [eventoParaRelatorio, setEventoParaRelatorio] = useState<Evento | undefined>();
  const [mostrarBotaoTopo, setMostrarBotaoTopo] = useState(false);
  const [gerandoPDF, setGerandoPDF] = useState(false);
  
  // Filtros
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<TipoEvento | 'todos'>('todos');
  const [filtroStatus, setFiltroStatus] = useState<StatusEvento | 'todos'>('todos');
  const [filtroBanda, setFiltroBanda] = useState<string>('');
  const [filtroPeriodo, setFiltroPeriodo] = useState<'todos' | 'passados' | 'hoje' | 'futuros'>('todos');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  // Estado para controlar a visibilidade da seção de estatísticas
  const [mostrarEstatisticas, setMostrarEstatisticas] = useState(true);

  // Ordenação
  const [ordenacao, setOrdenacao] = useState<'data-asc' | 'data-desc' | 'titulo-asc' | 'titulo-desc'>('data-asc');
  
  // Modo de visualização
  const [modoVisualizacao, setModoVisualizacao] = useState<'cartoes' | 'tabela'>('cartoes');
  const [mostrarGraficos, setMostrarGraficos] = useState(false);

  const router = useRouter();

  // Verifica se deve popular com eventos de exemplo
  useEffect(() => {
    // Tenta popular com eventos de exemplo se houver poucos eventos
    popularEventosExemplo();
  }, []);

  // Efeito para mostrar/esconder o botão de voltar ao topo
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setMostrarBotaoTopo(true);
      } else {
        setMostrarBotaoTopo(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filtra eventos baseado nos critérios
  const eventosFiltrados = useMemo(() => {
    return eventos
      .filter(evento => {
        // Filtro de busca
        const termoBusca = busca.toLowerCase();
        const matchBusca = 
          evento.titulo.toLowerCase().includes(termoBusca) || 
          evento.local.toLowerCase().includes(termoBusca) ||
          (evento.descricao && evento.descricao.toLowerCase().includes(termoBusca));
        
        // Filtro de tipo
        const matchTipo = filtroTipo === 'todos' || evento.tipo === filtroTipo;
        
        // Filtro de status
        const matchStatus = filtroStatus === 'todos' || evento.status === filtroStatus;
        
        // Filtro de banda
        const matchBanda = !filtroBanda || evento.bandaId === filtroBanda;
        
        // Filtro de período
        let matchPeriodo = true;
        if (filtroPeriodo !== 'todos') {
          const dataEvento = parseISO(evento.data);
          const hoje = new Date();
          
          if (filtroPeriodo === 'passados') {
            matchPeriodo = isBefore(dataEvento, hoje) && !isToday(dataEvento);
          } else if (filtroPeriodo === 'hoje') {
            matchPeriodo = isToday(dataEvento);
          } else if (filtroPeriodo === 'futuros') {
            matchPeriodo = isAfter(dataEvento, hoje) && !isToday(dataEvento);
          }
        }
        
        return matchBusca && matchTipo && matchStatus && matchBanda && matchPeriodo;
      })
      .sort((a, b) => {
        // Ordenação
        if (ordenacao === 'data-asc') {
          return a.data.localeCompare(b.data) || a.horaInicio.localeCompare(b.horaInicio);
        } else if (ordenacao === 'data-desc') {
          return b.data.localeCompare(a.data) || b.horaInicio.localeCompare(a.horaInicio);
        } else if (ordenacao === 'titulo-asc') {
          return a.titulo.localeCompare(b.titulo);
        } else {
          return b.titulo.localeCompare(a.titulo);
        }
      });
  }, [eventos, busca, filtroTipo, filtroStatus, filtroBanda, filtroPeriodo, ordenacao]);

  const handleAdicionarEvento = () => {
    setEventoEmEdicao(undefined);
    setModalAberto(true);
  };

  const handleEditarEvento = (evento: Evento) => {
    setEventoEmEdicao(evento);
    setModalAberto(true);
  };

  const handleExcluirEvento = (eventoId: string) => {
    const evento = eventos.find(e => e.id === eventoId);
    if (evento && confirm(`Tem certeza que deseja excluir o evento "${evento.titulo}"?`)) {
      setEventos(eventos.filter((e) => e.id !== eventoId));
    }
  };

  const handleGerarRelatorio = (evento: Evento) => {
    setEventoParaRelatorio(evento);
    setModalRelatorioAberto(true);
  };

  const handleSubmit = (data: Partial<Evento>) => {
    if (eventoEmEdicao) {
      setEventos(
        eventos.map((e) =>
          e.id === eventoEmEdicao.id
            ? { ...e, ...data }
            : e
        )
      );
    } else {
      const novoEvento: Evento = {
        id: Math.random().toString(36).substr(2, 9),
        titulo: data.titulo || '',
        tipo: data.tipo || 'ensaio',
        data: data.data || format(new Date(), 'yyyy-MM-dd'),
        horaInicio: data.horaInicio || '19:00',
        horaFim: data.horaFim || '22:00',
        local: data.local || '',
        endereco: data.endereco,
        bandaId: data.bandaId,
        integrantesIds: data.integrantesIds || [],
        status: data.status || 'agendado',
        descricao: data.descricao,
        
        // Campos específicos para shows
        valorCache: data.valorCache,
        contatoLocal: data.contatoLocal,
        telefoneLocal: data.telefoneLocal,
        observacoesShow: data.observacoesShow,
        repertorioId: data.repertorioId,
        
        // Campos específicos para ensaios
        pautaEnsaio: data.pautaEnsaio,
        objetivosEnsaio: data.objetivosEnsaio,
        musicasEnsaio: data.musicasEnsaio,
        
        // Campos específicos para reuniões
        pautaReuniao: data.pautaReuniao,
        ataReuniao: data.ataReuniao,
        decisoesTomadas: data.decisoesTomadas,
      };
      setEventos([...eventos, novoEvento]);
    }
    setModalAberto(false);
    setEventoEmEdicao(undefined);
  };

  // Função para obter o nome da banda a partir do ID
  const getNomeBanda = (bandaId?: string) => {
    if (!bandaId) return '';
    const banda = bandas.find(b => b.id === bandaId);
    return banda ? banda.nome : '';
  };

  // Função para obter o ícone do tipo de evento
  const getIconeTipoEvento = (tipo: TipoEvento) => {
    switch (tipo) {
      case 'show':
        return <MusicalNoteIcon className="h-5 w-5 text-green-600" />;
      case 'ensaio':
        return <ClockIconSolid className="h-5 w-5 text-orange-500" />;
      case 'reuniao':
        return <ChatBubbleLeftRightIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <CalendarIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Função para obter a cor de fundo com base no status
  const getCorStatus = (status: StatusEvento) => {
    switch (status) {
      case 'agendado':
        return 'bg-orange-100 text-orange-800';
      case 'confirmado':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      case 'concluido':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para formatar a data
  const formatarData = (dataISO: string) => {
    return format(parseISO(dataISO), 'dd/MM/yyyy', { locale: ptBR });
  };

  // Função para gerar o PDF do relatório
  const gerarPDF = (evento: Evento) => {
    try {
      setGerandoPDF(true);
      
      // Criar um novo documento PDF
      const doc = new jsPDF();
      
      // Título
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(`Relatório: ${evento.titulo}`, 105, 20, { align: 'center' });
      
      // Tipo e status
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      let tipoTexto = evento.tipo === 'show' ? 'Show' : evento.tipo === 'ensaio' ? 'Ensaio' : 'Reunião';
      let statusTexto = '';
      switch (evento.status) {
        case 'agendado': statusTexto = 'Agendado'; break;
        case 'confirmado': statusTexto = 'Confirmado'; break;
        case 'cancelado': statusTexto = 'Cancelado'; break;
        case 'concluido': statusTexto = 'Concluído'; break;
        default: statusTexto = evento.status;
      }
      
      doc.text(`Tipo: ${tipoTexto} | Status: ${statusTexto}`, 105, 30, { align: 'center' });
      
      let yPos = 40;
      
      // Informações básicas
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Informações Básicas', 14, yPos);
      doc.line(14, yPos + 2, 196, yPos + 2);
      yPos += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Data: ${formatarData(evento.data)}`, 14, yPos);
      yPos += 7;
      doc.text(`Horário: ${evento.horaInicio} às ${evento.horaFim}`, 14, yPos);
      yPos += 7;
      doc.text(`Local: ${evento.local}`, 14, yPos);
      yPos += 7;
      
      const nomeBanda = getNomeBanda(evento.bandaId) || 'Não especificada';
      doc.text(`Banda: ${nomeBanda}`, 14, yPos);
      yPos += 7;
      
      if (evento.endereco) {
        doc.text(`Endereço: ${evento.endereco}`, 14, yPos);
        yPos += 7;
      }
      
      // Descrição
      if (evento.descricao) {
        doc.text('Descrição:', 14, yPos);
        yPos += 7;
        const descricaoLinhas = doc.splitTextToSize(evento.descricao, 180);
        doc.text(descricaoLinhas, 14, yPos);
        yPos += descricaoLinhas.length * 5 + 5;
      }
      
      // Informações financeiras (para shows)
      if (evento.tipo === 'show' && evento.valorCache) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Informações Financeiras', 14, yPos);
        doc.line(14, yPos + 2, 196, yPos + 2);
        yPos += 10;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Cachê: R$ ${evento.valorCache.toFixed(2)}`, 14, yPos);
        yPos += 7;
        
        if (evento.custos && evento.custos.length > 0) {
          doc.text('Custos:', 14, yPos);
          yPos += 7;
          
          evento.custos.forEach(custo => {
            doc.text(`- ${custo.descricao}: R$ ${custo.valor}`, 20, yPos);
            yPos += 5;
          });
          
          yPos += 2;
        }
      }
      
      // Contatos (para shows)
      if (evento.tipo === 'show' && (evento.contatoLocal || evento.contatoTecnico)) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Contatos', 14, yPos);
        doc.line(14, yPos + 2, 196, yPos + 2);
        yPos += 10;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        if (evento.contatoLocal) {
          doc.text(`Contato do Local: ${evento.contatoLocal}`, 14, yPos);
          yPos += 5;
          if (evento.telefoneLocal) {
            doc.text(`Telefone: ${evento.telefoneLocal}`, 14, yPos);
            yPos += 5;
          }
        }
        
        if (evento.contatoTecnico) {
          doc.text(`Contato Técnico: ${evento.contatoTecnico}`, 14, yPos);
          yPos += 5;
          if (evento.telefoneTecnico) {
            doc.text(`Telefone: ${evento.telefoneTecnico}`, 14, yPos);
            yPos += 5;
          }
        }
        
        if (evento.horarioPassagemSom) {
          doc.text(`Horário de Passagem de Som: ${evento.horarioPassagemSom}`, 14, yPos);
          yPos += 5;
        }
        
        if (evento.observacoesContato) {
          doc.text('Observações:', 14, yPos);
          yPos += 5;
          const obsLinhas = doc.splitTextToSize(evento.observacoesContato, 180);
          doc.text(obsLinhas, 14, yPos);
          yPos += obsLinhas.length * 5 + 2;
        }
        
        yPos += 5;
      }
      
      // Equipamentos
      if ((evento.equipamentosNecessarios && evento.equipamentosNecessarios.length > 0) || 
          (evento.equipamentosExistentes && evento.equipamentosExistentes.length > 0)) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Equipamentos', 14, yPos);
        doc.line(14, yPos + 2, 196, yPos + 2);
        yPos += 10;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        if (evento.equipamentosNecessarios && evento.equipamentosNecessarios.length > 0) {
          doc.text('Equipamentos Necessários:', 14, yPos);
          yPos += 5;
          
          evento.equipamentosNecessarios.forEach(eq => {
            doc.text(`- ${eq.descricao} (${eq.quantidade})`, 20, yPos);
            yPos += 5;
          });
          
          yPos += 2;
        }
        
        if (evento.equipamentosExistentes && evento.equipamentosExistentes.length > 0) {
          doc.text('Equipamentos Existentes:', 14, yPos);
          yPos += 5;
          
          evento.equipamentosExistentes.forEach(eq => {
            doc.text(`- ${eq.descricao} (${eq.quantidade})`, 20, yPos);
            yPos += 5;
          });
          
          yPos += 2;
        }
        
        if (evento.observacoesEquipamentos) {
          doc.text('Observações:', 14, yPos);
          yPos += 5;
          const obsLinhas = doc.splitTextToSize(evento.observacoesEquipamentos, 180);
          doc.text(obsLinhas, 14, yPos);
          yPos += obsLinhas.length * 5 + 2;
        }
        
        yPos += 5;
      }
      
      // Verificar se precisa de uma nova página
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      // Informações de viagem
      if (evento.itensViagem && evento.itensViagem.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Itens de Viagem', 14, yPos);
        doc.line(14, yPos + 2, 196, yPos + 2);
        yPos += 10;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        evento.itensViagem.forEach(item => {
          doc.text(`- ${item.descricao} (R$ ${parseFloat(item.valor.toString()).toFixed(2)})`, 20, yPos);
          yPos += 5;
          doc.text(`  Data: ${formatarData(item.data)} | Responsável: ${item.responsavelCusto}`, 20, yPos);
          yPos += 7;
        });
        
        yPos += 5;
      }
      
      // Informações de hospedagem
      if (evento.hospedagem && evento.hospedagem.local) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Hospedagem', 14, yPos);
        doc.line(14, yPos + 2, 196, yPos + 2);
        yPos += 10;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        doc.text(`Local: ${evento.hospedagem.local}`, 14, yPos);
        yPos += 5;
        
        if (evento.hospedagem.endereco) {
          doc.text(`Endereço: ${evento.hospedagem.endereco}`, 14, yPos);
          yPos += 5;
        }
        
        doc.text(`Check-in: ${formatarData(evento.hospedagem.dataCheckIn)} às ${evento.hospedagem.horaCheckIn}`, 14, yPos);
        yPos += 5;
        doc.text(`Check-out: ${formatarData(evento.hospedagem.dataCheckOut)} às ${evento.hospedagem.horaCheckOut}`, 14, yPos);
        yPos += 5;
        
        if (evento.hospedagem.valor) {
          doc.text(`Valor: R$ ${parseFloat(evento.hospedagem.valor.toString()).toFixed(2)}`, 14, yPos);
          yPos += 5;
          doc.text(`Responsável: ${evento.hospedagem.responsavelCusto}`, 14, yPos);
          yPos += 5;
        }
        
        doc.text(`Quantidade de Quartos: ${evento.hospedagem.quantidadeQuartos}`, 14, yPos);
        yPos += 5;
        
        if (evento.hospedagem.distribuicaoQuartos) {
          doc.text(`Distribuição: ${evento.hospedagem.distribuicaoQuartos}`, 14, yPos);
          yPos += 5;
        }
        
        if (evento.hospedagem.incluiCafe) {
          doc.text('Inclui Café da Manhã: Sim', 14, yPos);
          yPos += 5;
          
          if (evento.hospedagem.horarioCafeInicio && evento.hospedagem.horarioCafeFim) {
            doc.text(`Horário do Café: ${evento.hospedagem.horarioCafeInicio} às ${evento.hospedagem.horarioCafeFim}`, 14, yPos);
            yPos += 5;
          }
        } else {
          doc.text('Inclui Café da Manhã: Não', 14, yPos);
          yPos += 5;
        }
        
        if (evento.hospedagem.contatoHotel) {
          doc.text(`Contato do Hotel: ${evento.hospedagem.contatoHotel}`, 14, yPos);
          yPos += 5;
          
          if (evento.hospedagem.telefoneHotel) {
            doc.text(`Telefone: ${evento.hospedagem.telefoneHotel}`, 14, yPos);
            yPos += 5;
          }
        }
        
        if (evento.hospedagem.redeWifi) {
          doc.text(`Rede Wi-Fi: ${evento.hospedagem.redeWifi}`, 14, yPos);
          yPos += 5;
          
          if (evento.hospedagem.senhaWifi) {
            doc.text(`Senha: ${evento.hospedagem.senhaWifi}`, 14, yPos);
            yPos += 5;
          }
        }
        
        if (evento.hospedagem.observacoes) {
          doc.text('Observações:', 14, yPos);
          yPos += 5;
          const obsLinhas = doc.splitTextToSize(evento.hospedagem.observacoes, 180);
          doc.text(obsLinhas, 14, yPos);
          yPos += obsLinhas.length * 5 + 2;
        }
        
        yPos += 5;
      }
      
      // Verificar se precisa de uma nova página
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      // Participantes
      if (evento.integrantesIds && evento.integrantesIds.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Participantes', 14, yPos);
        doc.line(14, yPos + 2, 196, yPos + 2);
        yPos += 10;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        const integrantesNomes = evento.integrantesIds.map(id => {
          const integrante = integrantes.find(i => i.id === id);
          return integrante ? `${integrante.nome} (${integrante.funcao})` : id;
        });
        
        integrantesNomes.forEach(nome => {
          doc.text(`- ${nome}`, 20, yPos);
          yPos += 5;
        });
        
        yPos += 5;
      }
      
      // Salvar o PDF
      const nomeArquivo = `Relatório_${evento.titulo.replace(/\s+/g, '_')}_${format(new Date(), 'dd-MM-yyyy')}.pdf`;
      doc.save(nomeArquivo);
      
      setGerandoPDF(false);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.');
      setGerandoPDF(false);
    }
  };

  // Função para voltar ao topo da página
  const voltarAoTopo = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen relative">
      {/* Background específico para eventos */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Overlay de carregamento para geração de PDF */}
      {gerandoPDF && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
            <p className="text-gray-700 font-medium">Gerando PDF...</p>
          </div>
        </div>
      )}

      {/* Conteúdo da página */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-xl">
            <h1 className="text-3xl font-bold text-white mb-6">Eventos</h1>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <p className="text-gray-600">Gerencie shows, ensaios e reuniões da sua banda</p>
              </div>
              <button
                onClick={handleAdicionarEvento}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Novo Evento
              </button>
            </div>

            <div className="mb-8 bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-sm font-medium text-gray-900 mb-3">Filtros e Busca</h2>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-3">
                  <div className="relative flex-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      placeholder="Buscar eventos por título, local ou descrição..."
                      className="block w-full rounded-md border-gray-300 pl-9 focus:border-indigo-500 focus:ring-indigo-500 text-xs shadow-sm h-8"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <select
                      value={ordenacao}
                      onChange={(e) => setOrdenacao(e.target.value as any)}
                      className="rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-xs shadow-sm text-gray-900 font-medium h-8"
                      style={{ color: '#111827' }}
                    >
                      <option value="data-asc" className="font-medium text-gray-900">Data (mais próxima)</option>
                      <option value="data-desc" className="font-medium text-gray-900">Data (mais distante)</option>
                      <option value="titulo-asc" className="font-medium text-gray-900">Título (A-Z)</option>
                      <option value="titulo-desc" className="font-medium text-gray-900">Título (Z-A)</option>
                    </select>
                    
                    <div className="flex items-center space-x-1 border rounded-md overflow-hidden h-8">
                      <button
                        onClick={() => setModoVisualizacao('cartoes')}
                        className={`p-1.5 transition-colors duration-200 ${
                          modoVisualizacao === 'cartoes'
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                        title="Visualizar em cartões"
                      >
                        <ViewColumnsIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setModoVisualizacao('tabela')}
                        className={`p-1.5 transition-colors duration-200 ${
                          modoVisualizacao === 'tabela'
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                        title="Visualizar em tabela"
                      >
                        <TableCellsIcon className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => setMostrarGraficos(!mostrarGraficos)}
                      className={`inline-flex items-center p-1.5 rounded-md transition-colors duration-200 h-8 w-8 ${
                        mostrarGraficos
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      title="Mostrar gráficos"
                    >
                      <ChartBarIcon className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => setMostrarFiltros(!mostrarFiltros)}
                      className={`inline-flex items-center p-1.5 rounded-md transition-colors duration-200 h-8 w-8 ${
                        mostrarFiltros
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      title="Filtros avançados"
                    >
                      <AdjustmentsHorizontalIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {mostrarFiltros && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label htmlFor="filtroTipo" className="block text-xs font-medium text-gray-700 mb-1">
                        Tipo de Evento
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          onClick={() => setFiltroTipo('todos')}
                          className={`px-2.5 py-0.5 rounded-full text-xs ${
                            filtroTipo === 'todos' 
                              ? 'bg-gray-900 text-white' 
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          Todos
                        </button>
                        <button
                          onClick={() => setFiltroTipo('show')}
                          className={`px-2.5 py-0.5 rounded-full text-xs flex items-center ${
                            filtroTipo === 'show' 
                              ? 'bg-green-600 text-white' 
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          <MusicalNoteIcon className="h-3 w-3 mr-1" />
                          Shows
                        </button>
                        <button
                          onClick={() => setFiltroTipo('ensaio')}
                          className={`px-2.5 py-0.5 rounded-full text-xs flex items-center ${
                            filtroTipo === 'ensaio' 
                              ? 'bg-orange-600 text-white' 
                              : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                          }`}
                        >
                          <ClockIconSolid className="h-3 w-3 mr-1" />
                          Ensaios
                        </button>
                        <button
                          onClick={() => setFiltroTipo('reuniao')}
                          className={`px-2.5 py-0.5 rounded-full text-xs flex items-center ${
                            filtroTipo === 'reuniao' 
                              ? 'bg-yellow-600 text-white' 
                              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          }`}
                        >
                          <ChatBubbleLeftRightIcon className="h-3 w-3 mr-1" />
                          Reuniões
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="filtroStatus" className="block text-xs font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          onClick={() => setFiltroStatus('todos')}
                          className={`px-2.5 py-0.5 rounded-full text-xs ${
                            filtroStatus === 'todos' 
                              ? 'bg-gray-900 text-white' 
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          Todos
                        </button>
                        <button
                          onClick={() => setFiltroStatus('agendado')}
                          className={`px-2.5 py-0.5 rounded-full text-xs ${
                            filtroStatus === 'agendado' 
                              ? 'bg-orange-500 text-white' 
                              : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                          }`}
                        >
                          Agendado
                        </button>
                        <button
                          onClick={() => setFiltroStatus('confirmado')}
                          className={`px-2.5 py-0.5 rounded-full text-xs ${
                            filtroStatus === 'confirmado' 
                              ? 'bg-green-600 text-white' 
                              : 'bg-green-50 text-green-700 hover:bg-green-100'
                          }`}
                        >
                          Confirmado
                        </button>
                        <button
                          onClick={() => setFiltroStatus('cancelado')}
                          className={`px-2.5 py-0.5 rounded-full text-xs ${
                            filtroStatus === 'cancelado' 
                              ? 'bg-red-600 text-white' 
                              : 'bg-red-50 text-red-700 hover:bg-red-100'
                          }`}
                        >
                          Cancelado
                        </button>
                        <button
                          onClick={() => setFiltroStatus('concluido')}
                          className={`px-2.5 py-0.5 rounded-full text-xs ${
                            filtroStatus === 'concluido' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                          }`}
                        >
                          Concluído
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="filtroBanda" className="block text-xs font-medium text-gray-700 mb-1">
                        Banda
                      </label>
                      <select
                        id="filtroBanda"
                        value={filtroBanda}
                        onChange={(e) => setFiltroBanda(e.target.value)}
                        className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-xs shadow-sm text-gray-900 font-medium h-7"
                        style={{ color: '#111827' }}
                      >
                        <option value="" className="font-medium text-gray-900">Todas as bandas</option>
                        {bandas.map((banda) => (
                          <option key={banda.id} value={banda.id} className="font-medium text-gray-900">
                            {banda.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="filtroPeriodo" className="block text-xs font-medium text-gray-700 mb-1">
                        Período
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          onClick={() => setFiltroPeriodo('todos')}
                          className={`px-2.5 py-0.5 rounded-full text-xs ${
                            filtroPeriodo === 'todos' 
                              ? 'bg-gray-900 text-white' 
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          Todos
                        </button>
                        <button
                          onClick={() => setFiltroPeriodo('passados')}
                          className={`px-2.5 py-0.5 rounded-full text-xs ${
                            filtroPeriodo === 'passados' 
                              ? 'bg-gray-600 text-white' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Passados
                        </button>
                        <button
                          onClick={() => setFiltroPeriodo('hoje')}
                          className={`px-2.5 py-0.5 rounded-full text-xs ${
                            filtroPeriodo === 'hoje' 
                              ? 'bg-indigo-600 text-white' 
                              : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                          }`}
                        >
                          Hoje
                        </button>
                        <button
                          onClick={() => setFiltroPeriodo('futuros')}
                          className={`px-2.5 py-0.5 rounded-full text-xs ${
                            filtroPeriodo === 'futuros' 
                              ? 'bg-teal-600 text-white' 
                              : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                          }`}
                        >
                          Futuros
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Estatísticas rápidas */}
              <div className="border-b border-gray-200">
                <div className="flex justify-between items-center px-4 py-2 bg-gray-50">
                  <h3 className="text-xs font-medium text-gray-700">Resumo de Eventos</h3>
                  <button
                    onClick={() => setMostrarEstatisticas(!mostrarEstatisticas)}
                    className="flex items-center justify-center h-6 w-6 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors rounded-full hover:bg-gray-200"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 transition-transform duration-300 ${mostrarEstatisticas ? 'rotate-180' : ''}`} 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                {mostrarEstatisticas && (
                  <div className="overflow-x-auto">
                    <div className="grid grid-cols-7 divide-x min-w-full">
                      <div className="p-3 text-center">
                        <p className="text-xs font-medium text-gray-500">Eventos</p>
                        <p className="mt-1 text-2xl font-semibold text-gray-900">{eventos.length}</p>
                      </div>
                      <div className="p-3 text-center">
                        <p className="text-xs font-medium text-gray-500">Shows</p>
                        <p className="mt-1 text-2xl font-semibold text-green-600">
                          {eventos.filter(e => e.tipo === 'show').length}
                        </p>
                      </div>
                      <div className="p-3 text-center">
                        <p className="text-xs font-medium text-gray-500">Ensaios</p>
                        <p className="mt-1 text-2xl font-semibold text-orange-600">
                          {eventos.filter(e => e.tipo === 'ensaio').length}
                        </p>
                      </div>
                      <div className="p-3 text-center">
                        <p className="text-xs font-medium text-gray-500">Reuniões</p>
                        <p className="mt-1 text-2xl font-semibold text-yellow-600">
                          {eventos.filter(e => e.tipo === 'reuniao').length}
                        </p>
                      </div>
                      <div className="p-3 text-center">
                        <p className="text-xs font-medium text-gray-500">Futuros</p>
                        <p className="mt-1 text-2xl font-semibold text-indigo-600">
                    {eventos.filter(e => {
                      const dataEvento = parseISO(e.data);
                      const hoje = new Date();
                      return isAfter(dataEvento, hoje) && !isToday(dataEvento);
                    }).length}
                  </p>
                </div>
                      <div className="p-3 text-center">
                        <p className="text-xs font-medium text-gray-500">Hoje</p>
                        <p className="mt-1 text-2xl font-semibold text-green-600">
                    {eventos.filter(e => isToday(parseISO(e.data))).length}
                  </p>
                </div>
                      <div className="p-3 text-center">
                        <p className="text-xs font-medium text-gray-500">Concluídos</p>
                        <p className="mt-1 text-2xl font-semibold text-blue-600">
                    {eventos.filter(e => e.status === 'concluido').length}
                  </p>
                </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Seção de Gráficos */}
            {mostrarGraficos && (
              <div className="mt-8 mb-8 animate-fadeIn">
                <EventosGraficos eventos={eventos} />
              </div>
            )}

            {eventosFiltrados.length > 0 ? (
              modoVisualizacao === 'cartoes' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventosFiltrados.map((evento) => (
                  <div 
                    key={evento.id} 
                    className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden rounded-lg border border-gray-100"
                  >
                    <div className={`px-4 py-3 sm:px-6 flex justify-between items-start ${
                        evento.tipo === 'show' ? 'bg-green-100' : 
                        evento.tipo === 'ensaio' ? 'bg-orange-100' : 
                        'bg-yellow-100'
                    }`}>
                      <div className="flex items-center">
                        {getIconeTipoEvento(evento.tipo)}
                        <h3 className="ml-2 text-lg leading-6 font-medium text-gray-900 truncate max-w-[200px]">{evento.titulo}</h3>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCorStatus(evento.status)}`}>
                        {evento.status === 'agendado' && 'Agendado'}
                        {evento.status === 'confirmado' && 'Confirmado'}
                        {evento.status === 'cancelado' && 'Cancelado'}
                        {evento.status === 'concluido' && 'Concluído'}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          <p className="text-gray-700 font-medium">{formatarData(evento.data)}</p>
                        </div>
                        <div className="flex items-center text-sm">
                          <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          <p className="text-gray-700">{evento.horaInicio} às {evento.horaFim}</p>
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPinIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          <p className="text-gray-700 truncate max-w-[250px]">{evento.local}</p>
                        </div>
                        {evento.bandaId && (
                          <div className="flex items-center text-sm">
                            <UserGroupIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            <p className="text-gray-700">Banda: {getNomeBanda(evento.bandaId)}</p>
                          </div>
                        )}
                        {evento.descricao && (
                          <div className="mt-2 text-sm text-gray-500 line-clamp-2">
                            {evento.descricao}
                          </div>
                        )}
                        
                        {/* Informações específicas por tipo de evento */}
                        {evento.tipo === 'show' && evento.valorCache && (
                          <div className="flex items-center text-sm mt-2 pt-2 border-t border-gray-100">
                            <span className="text-gray-700 font-medium">Cachê: </span>
                            <span className="ml-1 text-green-600 font-medium">R$ {evento.valorCache.toFixed(2)}</span>
                          </div>
                        )}
                        
                        {evento.tipo === 'ensaio' && evento.musicasEnsaio && evento.musicasEnsaio.length > 0 && (
                          <div className="flex items-center text-sm mt-2 pt-2 border-t border-gray-100">
                            <span className="text-gray-700 font-medium">Músicas: </span>
                            <span className="ml-1 text-gray-600">{evento.musicasEnsaio.length} selecionadas</span>
                          </div>
                        )}
                        
                        {evento.tipo === 'reuniao' && evento.pautaReuniao && (
                          <div className="flex items-center text-sm mt-2 pt-2 border-t border-gray-100">
                            <span className="text-gray-700 font-medium">Pauta definida</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-4 sm:px-6 flex justify-between items-center bg-gray-50">
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500">
                          {evento.integrantesIds.length} integrante{evento.integrantesIds.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleGerarRelatorio(evento)}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                          title="Gerar relatório"
                        >
                          <DocumentTextIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditarEvento(evento)}
                          className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                          title="Editar evento"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleExcluirEvento(evento.id)}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                          title="Excluir evento"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Evento
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Data/Hora
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Local
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Banda
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Detalhes
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {eventosFiltrados.map((evento) => (
                          <tr key={evento.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100">
                                  {getIconeTipoEvento(evento.tipo)}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{evento.titulo}</div>
                                  <div className="text-sm text-gray-500">
                                    {evento.tipo === 'show' ? 'Show' : evento.tipo === 'ensaio' ? 'Ensaio' : 'Reunião'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{formatarData(evento.data)}</div>
                              <div className="text-sm text-gray-500">{evento.horaInicio} às {evento.horaFim}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{evento.local}</div>
                              <div className="text-sm text-gray-500 truncate max-w-[200px]">{evento.endereco}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {evento.bandaId ? getNomeBanda(evento.bandaId) : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCorStatus(evento.status)}`}>
                                {evento.status === 'agendado' && 'Agendado'}
                                {evento.status === 'confirmado' && 'Confirmado'}
                                {evento.status === 'cancelado' && 'Cancelado'}
                                {evento.status === 'concluido' && 'Concluído'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {evento.tipo === 'show' && evento.valorCache && (
                                <div className="text-green-600 font-medium">R$ {evento.valorCache.toFixed(2)}</div>
                              )}
                              {evento.tipo === 'ensaio' && evento.musicasEnsaio && (
                                <div>{evento.musicasEnsaio.length} músicas</div>
                              )}
                              {evento.tipo === 'reuniao' && evento.decisoesTomadas && (
                                <div>{evento.decisoesTomadas.length} decisões</div>
                              )}
                              <div className="text-xs text-gray-400 mt-1">
                                {evento.integrantesIds.length} integrante{evento.integrantesIds.length !== 1 ? 's' : ''}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => handleGerarRelatorio(evento)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                  title="Gerar relatório"
                                >
                                  <DocumentTextIcon className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleEditarEvento(evento)}
                                  className="text-gray-600 hover:text-gray-900"
                                  title="Editar evento"
                                >
                                  <PencilIcon className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleExcluirEvento(evento.id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Excluir evento"
                                >
                                  <TrashIcon className="h-5 w-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            ) : (
              <div className="text-center py-16 bg-white shadow overflow-hidden sm:rounded-lg">
                <CalendarIcon className="mx-auto h-16 w-16 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhum evento encontrado</h3>
                <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                  {busca || filtroTipo !== 'todos' || filtroStatus !== 'todos' || filtroBanda || filtroPeriodo !== 'todos'
                    ? 'Tente ajustar os filtros para encontrar o que está procurando.'
                    : 'Comece criando seu primeiro evento para gerenciar shows, ensaios e reuniões da sua banda.'}
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleAdicionarEvento}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Novo Evento
                  </button>
                </div>
              </div>
            )}

            {/* Modal de Edição/Criação de Evento */}
            <Modal
              title={eventoEmEdicao ? 'Editar Evento' : 'Novo Evento'}
              isOpen={modalAberto}
              onClose={() => {
                setModalAberto(false);
                setEventoEmEdicao(undefined);
              }}
            >
              <EventoForm
                evento={eventoEmEdicao}
                bandas={bandas}
                integrantes={integrantes}
                musicas={musicas}
                repertorios={repertorios.map(r => ({ id: r.id, nome: r.nome }))}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setModalAberto(false);
                  setEventoEmEdicao(undefined);
                }}
              />
            </Modal>

            {/* Modal de Relatório */}
            <Modal
              title={`Relatório: ${eventoParaRelatorio?.titulo || ''}`}
              isOpen={modalRelatorioAberto}
              onClose={() => {
                setModalRelatorioAberto(false);
                setEventoParaRelatorio(undefined);
              }}
            >
              {eventoParaRelatorio && (
                <div className="space-y-6">
                  {/* Título principal do relatório */}
                  <div className="text-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Selecione as seções para incluir no relatório:</h2>
                  </div>

                  {/* Conteúdo do relatório que será capturado para o PDF */}
                  <div id="relatorio-content" className="space-y-6">
                    {/* Informações básicas */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-bold text-indigo-700">1. Informações Básicas</h4>
                        <div 
                          className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 cursor-pointer hover:bg-indigo-200 transition-colors"
                          onClick={() => {
                            const element = document.getElementById('secao-info-basicas');
                            const icon = document.getElementById('icon-info-basicas');
                            if (element && icon) {
                              element.classList.toggle('hidden');
                              icon.classList.toggle('hidden');
                            }
                          }}
                        >
                          <svg id="icon-info-basicas" xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div id="secao-info-basicas">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Data</p>
                            <p className="font-medium">{formatarData(eventoParaRelatorio.data)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Horário</p>
                            <p className="font-medium">{eventoParaRelatorio.horaInicio} às {eventoParaRelatorio.horaFim}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Local</p>
                            <p className="font-medium">{eventoParaRelatorio.local}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Banda</p>
                            <p className="font-medium">{getNomeBanda(eventoParaRelatorio.bandaId) || 'Não especificada'}</p>
                          </div>
                        </div>

                        {eventoParaRelatorio.endereco && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-500">Endereço</p>
                            <p className="font-medium">{eventoParaRelatorio.endereco}</p>
                          </div>
                        )}

                        {eventoParaRelatorio.descricao && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-500">Descrição</p>
                            <p className="font-medium">{eventoParaRelatorio.descricao}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Outras seções do relatório... */}
                  </div>

                  {/* Botões de ação */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setModalRelatorioAberto(false);
                        setEventoParaRelatorio(undefined);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Fechar
                    </button>
                    <button
                      onClick={() => {
                        if (eventoParaRelatorio) {
                          gerarPDF(eventoParaRelatorio);
                        }
                      }}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Gerar PDF
                    </button>
                  </div>
                </div>
              )}
            </Modal>
          </div>
        </div>
      </div>

      {/* Overlay de carregamento para geração de PDF */}
      {gerandoPDF && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
            <p className="text-gray-700 font-medium">Gerando PDF...</p>
          </div>
        </div>
      )}

      {/* Botão para voltar ao topo */}
      {mostrarBotaoTopo && (
        <button
          onClick={voltarAoTopo}
          className="fixed bottom-6 right-6 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-200 z-50"
          aria-label="Voltar ao topo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
} 