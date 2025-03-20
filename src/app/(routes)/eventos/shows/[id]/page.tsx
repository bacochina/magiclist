'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShowEvento, ContatoShow, EquipamentoShow, HospedagemShow, CustoShow } from '@/lib/types';
import { ContatoModal } from '../components/ContatoModal';
import { EquipamentosModal } from '../components/EquipamentosModal';
import { HospedagemModal } from '../components/HospedagemModal';
import { CustosModal } from '../components/CustosModal';
import { ShowForm } from '../components/ShowForm';

export default function ShowPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [evento, setEvento] = useState<ShowEvento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showContatosModal, setShowContatosModal] = useState(false);
  const [showEquipamentosModal, setShowEquipamentosModal] = useState(false);
  const [showHospedagemModal, setShowHospedagemModal] = useState(false);
  const [showCustosModal, setShowCustosModal] = useState(false);

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const response = await fetch(`/api/eventos/shows?id=${params.id}`);
        if (!response.ok) {
          throw new Error('Erro ao carregar show');
        }
        const data = await response.json();
        setEvento(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar show');
      } finally {
        setLoading(false);
      }
    };

    fetchShow();
  }, [params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!evento) return;
    const { name, value } = e.target;
    setEvento(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSelectChange = (value: string, name: string) => {
    if (!evento) return;
    setEvento(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evento) return;

    try {
      const response = await fetch('/api/eventos/shows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update',
          ...evento
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar show');
      }

      router.push('/eventos/shows');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar show');
    }
  };

  const handleContatosSave = (contatos: ContatoShow[]) => {
    if (!evento) return;
    setEvento(prev => prev ? { ...prev, contatos } : null);
    setShowContatosModal(false);
  };

  const handleEquipamentosSave = (equipamentos: EquipamentoShow[]) => {
    if (!evento) return;
    setEvento(prev => prev ? { ...prev, equipamentos } : null);
    setShowEquipamentosModal(false);
  };

  const handleHospedagemSave = (hospedagem: HospedagemShow) => {
    if (!evento) return;
    setEvento(prev => prev ? { ...prev, hospedagem } : null);
    setShowHospedagemModal(false);
  };

  const handleCustosSave = (custos: CustoShow[]) => {
    if (!evento) return;
    setEvento(prev => prev ? { ...prev, custos } : null);
    setShowCustosModal(false);
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  if (!evento) {
    return <div>Show não encontrado</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Editar Show</h1>

      <ShowForm
        evento={evento}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
        onSubmit={handleSubmit}
        onContatosClick={() => setShowContatosModal(true)}
        onEquipamentosClick={() => setShowEquipamentosModal(true)}
        onHospedagemClick={() => setShowHospedagemModal(true)}
        onCustosClick={() => setShowCustosModal(true)}
      />

      <ContatoModal
        open={showContatosModal}
        onOpenChange={setShowContatosModal}
        contatos={evento.contatos || []}
        onSave={handleContatosSave}
      />

      <EquipamentosModal
        open={showEquipamentosModal}
        onOpenChange={setShowEquipamentosModal}
        equipamentos={evento.equipamentos || []}
        onSave={handleEquipamentosSave}
      />

      <HospedagemModal
        open={showHospedagemModal}
        onOpenChange={setShowHospedagemModal}
        hospedagem={evento.hospedagem || null}
        onSave={handleHospedagemSave}
      />

      <CustosModal
        open={showCustosModal}
        onOpenChange={setShowCustosModal}
        custos={evento.custos || []}
        onSave={handleCustosSave}
      />
    </div>
  );
} 