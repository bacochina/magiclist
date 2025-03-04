'use client';

import { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { PedaleiraForm } from './components/PedaleiraForm';
import { PedaleiraCard } from './components/PedaleiraCard';
import { Modal } from '@/components/Modal';
import { Musica, Pedaleira } from '@/lib/types';

export default function PedaleiraPage() {
  const [modalAberto, setModalAberto] = useState(false);
  const [pedaleiras, setPedaleiras] = useState<Pedaleira[]>([]);
  const [musicas, setMusicas] = useState<Musica[]>([]);
  const [pedaleiraParaEditar, setPedaleiraParaEditar] = useState<Pedaleira | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true);
        setErro(null);

        // Busca as músicas
        const resMusicas = await fetch('/api/musicas');
        if (!resMusicas.ok) throw new Error('Erro ao carregar músicas');
        const musicasData = await resMusicas.json();
        setMusicas(musicasData);

        // Busca as pedaleiras
        const resPedaleiras = await fetch('/api/pedaleiras');
        if (!resPedaleiras.ok) throw new Error('Erro ao carregar pedaleiras');
        const pedaleirasData = await resPedaleiras.json();
        setPedaleiras(pedaleirasData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setErro('Erro ao carregar dados. Por favor, tente novamente.');
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, []);

  const handleSubmit = async (data: any) => {
    try {
      setErro(null);
      
      if (pedaleiraParaEditar) {
        const res = await fetch(`/api/pedaleiras`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            id: pedaleiraParaEditar.id
          }),
        });

        if (!res.ok) throw new Error('Erro ao atualizar pedaleira');
        
        const pedaleiraAtualizada = await res.json();
        setPedaleiras(pedaleiras.map(p => 
          p.id === pedaleiraAtualizada.id ? pedaleiraAtualizada : p
        ));
      } else {
        const res = await fetch('/api/pedaleiras', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!res.ok) throw new Error('Erro ao criar pedaleira');
        
        const novaPedaleira = await res.json();
        setPedaleiras([...pedaleiras, novaPedaleira]);
      }

      setModalAberto(false);
      setPedaleiraParaEditar(null);
    } catch (error) {
      console.error('Erro ao salvar pedaleira:', error);
      setErro('Erro ao salvar pedaleira. Por favor, tente novamente.');
    }
  };

  const handleEdit = (pedaleira: Pedaleira) => {
    setPedaleiraParaEditar(pedaleira);
    setModalAberto(true);
  };

  const handleDelete = async (pedaleira: Pedaleira) => {
    if (confirm('Tem certeza que deseja excluir esta pedaleira?')) {
      try {
        setErro(null);
        
        const res = await fetch(`/api/pedaleiras?id=${pedaleira.id}`, {
          method: 'DELETE',
        });

        if (!res.ok) throw new Error('Erro ao excluir pedaleira');

        setPedaleiras(pedaleiras.filter(p => p.id !== pedaleira.id));
      } catch (error) {
        console.error('Erro ao excluir pedaleira:', error);
        setErro('Erro ao excluir pedaleira. Por favor, tente novamente.');
      }
    }
  };

  if (carregando) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Pedaleiras</h1>
        <button
          onClick={() => {
            setPedaleiraParaEditar(null);
            setModalAberto(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nova Pedaleira
        </button>
      </div>

      {erro && (
        <div className="mb-8 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{erro}</span>
        </div>
      )}

      <Modal
        isOpen={modalAberto}
        onClose={() => {
          setModalAberto(false);
          setPedaleiraParaEditar(null);
        }}
        title={pedaleiraParaEditar ? 'Editar Pedaleira' : 'Nova Pedaleira'}
        size="lg"
      >
        <PedaleiraForm
          onSubmit={handleSubmit}
          onCancel={() => {
            setModalAberto(false);
            setPedaleiraParaEditar(null);
          }}
          musicas={musicas}
          initialData={pedaleiraParaEditar || undefined}
        />
      </Modal>

      <div className="space-y-6">
        {pedaleiras.length > 0 ? (
          pedaleiras.map(pedaleira => (
            <PedaleiraCard
              key={pedaleira.id}
              pedaleira={pedaleira}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-gray-500 text-center">
              Nenhuma pedaleira cadastrada ainda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 