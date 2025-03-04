'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { RepertorioForm } from './components/RepertorioForm';
import { RepertorioPDF } from './components/RepertorioPDF';
import { CalendarIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

// Dados de exemplo - músicas
const musicasExemplo = [
  {
    id: '1',
    nome: 'Evidências',
    artista: 'Chitãozinho & Xororó',
    tom: 'C',
    bpm: '120',
  },
  {
    id: '2',
    nome: 'Sweet Child O\' Mine',
    artista: 'Guns N\' Roses',
    tom: 'D',
    bpm: '126',
  },
  {
    id: '3',
    nome: 'Garota de Ipanema',
    artista: 'Tom Jobim',
    tom: 'F',
    bpm: '130',
  },
  {
    id: '4',
    nome: 'Wonderwall',
    artista: 'Oasis',
    tom: 'Am',
    bpm: '86',
  },
];

// Dados de exemplo - blocos
const blocosExemplo = [
  {
    id: '1',
    nome: 'Abertura',
    descricao: 'Músicas animadas para começar o show',
    musicas: [musicasExemplo[1], musicasExemplo[3]], // Sweet Child e Wonderwall
  },
  {
    id: '2',
    nome: 'Romântico',
    descricao: 'Baladas e músicas mais calmas',
    musicas: [musicasExemplo[0]], // Evidências
  },
  {
    id: '3',
    nome: 'MPB',
    descricao: 'Clássicos da música brasileira',
    musicas: [musicasExemplo[2]], // Garota de Ipanema
  },
];

// Dados de exemplo - repertórios
const repertoriosExemplo = [
  {
    id: '1',
    nome: 'Casamento João e Maria',
    data: '2024-04-15',
    observacoes: 'Cerimônia começa às 19h, cocktail às 20h',
    blocos: [blocosExemplo[1], blocosExemplo[2]], // Romântico e MPB
  },
  {
    id: '2',
    nome: 'Show Bar do Zé',
    data: '2024-04-20',
    observacoes: 'Show começa às 22h',
    blocos: [blocosExemplo[0], blocosExemplo[2], blocosExemplo[1]], // Abertura, MPB e Romântico
  },
];

interface Musica {
  id: string;
  nome: string;
  artista: string;
  tom: string;
  bpm: string;
}

interface Bloco {
  id: string;
  nome: string;
  descricao: string;
  musicas: Musica[];
}

interface Repertorio {
  id: string;
  nome: string;
  data: string;
  observacoes: string;
  blocos: Bloco[];
}

export default function RepertoriosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const [repertorios, setRepertorios] = useState(repertoriosExemplo);
  const [repertorioSelecionado, setRepertorioSelecionado] = useState<Repertorio | undefined>();
  const [isEditando, setIsEditando] = useState(false);
  const [repertorioParaExcluir, setRepertorioParaExcluir] = useState<string | null>(null);

  const handleSubmit = async (data: any) => {
    if (isEditando && repertorioSelecionado) {
      // Atualizar repertório existente
      setRepertorios(repertorios.map(repertorio => 
        repertorio.id === repertorioSelecionado.id 
          ? { ...repertorio, ...data }
          : repertorio
      ));
    } else {
      // Adicionar novo repertório
      const novoRepertorio = {
        id: String(Date.now()),
        ...data,
      };
      setRepertorios([...repertorios, novoRepertorio]);
    }
    setIsModalOpen(false);
    setIsEditando(false);
    setRepertorioSelecionado(undefined);
  };

  const handleEditar = (repertorio: Repertorio) => {
    setRepertorioSelecionado(repertorio);
    setIsEditando(true);
    setIsModalOpen(true);
  };

  const handleExcluir = (repertorioId: string) => {
    setRepertorios(repertorios.filter(repertorio => repertorio.id !== repertorioId));
    setRepertorioParaExcluir(null);
  };

  const handleGerarPDF = (repertorio: Repertorio) => {
    setRepertorioSelecionado(repertorio);
    setIsPDFModalOpen(true);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const calcularDuracaoTotal = (blocos: typeof blocosExemplo) => {
    const totalMinutos = blocos.reduce((acc, bloco) => acc + (bloco.musicas.length * 4), 0);
    if (totalMinutos < 60) {
      return `${totalMinutos} minutos`;
    }
    const horas = Math.floor(totalMinutos / 60);
    const minutosRestantes = totalMinutos % 60;
    return `${horas}h${minutosRestantes > 0 ? ` ${minutosRestantes}min` : ''}`;
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Meus Repertórios</h1>
          <button
            onClick={() => {
              setIsEditando(false);
              setRepertorioSelecionado(undefined);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Novo Repertório
          </button>
        </div>

        {/* Lista de Repertórios */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {repertorios.map((repertorio) => (
              <li key={repertorio.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{repertorio.nome}</h3>
                    <p className="text-sm text-gray-500">
                      {formatarData(repertorio.data)} • {repertorio.blocos.length} blocos • {calcularDuracaoTotal(repertorio.blocos)}
                    </p>
                    {repertorio.observacoes && (
                      <p className="mt-1 text-sm text-gray-600">{repertorio.observacoes}</p>
                    )}
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleGerarPDF(repertorio)}
                      className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-900"
                    >
                      <DocumentArrowDownIcon className="h-5 w-5 mr-1" />
                      PDF
                    </button>
                    <button
                      onClick={() => handleEditar(repertorio)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setRepertorioParaExcluir(repertorio.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </div>
                </div>

                {/* Lista de blocos do repertório */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Blocos:</h4>
                  <ul className="space-y-2">
                    {repertorio.blocos.map((bloco, index) => (
                      <li key={bloco.id} className="text-sm text-gray-600">
                        {index + 1}. {bloco.nome} ({bloco.musicas.length} músicas)
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Mensagem quando não há repertórios */}
        {repertorios.length === 0 && (
          <div className="text-center py-12">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum repertório cadastrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              Crie seu primeiro repertório para organizar suas apresentações.
            </p>
          </div>
        )}
      </div>

      {/* Modal de Novo Repertório/Edição */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditando(false);
          setRepertorioSelecionado(undefined);
        }}
        title={isEditando ? "Editar Repertório" : "Novo Repertório"}
      >
        <RepertorioForm
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setIsEditando(false);
            setRepertorioSelecionado(undefined);
          }}
          blocosDisponiveis={blocosExemplo}
          initialData={isEditando ? repertorioSelecionado : undefined}
        />
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        isOpen={!!repertorioParaExcluir}
        onClose={() => setRepertorioParaExcluir(null)}
        title="Confirmar Exclusão"
      >
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Tem certeza que deseja excluir este repertório? Esta ação não pode ser desfeita.
          </p>
        </div>

        <div className="mt-4 flex justify-end space-x-3">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            onClick={() => setRepertorioParaExcluir(null)}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
            onClick={() => repertorioParaExcluir && handleExcluir(repertorioParaExcluir)}
          >
            Excluir
          </button>
        </div>
      </Modal>

      {/* Modal do PDF */}
      <Modal
        isOpen={isPDFModalOpen}
        onClose={() => {
          setIsPDFModalOpen(false);
          setRepertorioSelecionado(undefined);
        }}
        title="Visualizar Repertório"
        size="full"
      >
        {repertorioSelecionado && (
          <div className="h-[calc(100vh-200px)]">
            <RepertorioPDF
              nomeBanda="Sua Banda"
              nomeRepertorio={repertorioSelecionado.nome}
              data={repertorioSelecionado.data}
              blocos={repertorioSelecionado.blocos}
            />
          </div>
        )}
      </Modal>
    </div>
  );
} 