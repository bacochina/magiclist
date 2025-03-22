'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { alertaSucesso } from '@/lib/sweetalert';

// Importando os componentes modulares
import PageHeader from './components/PageHeader';
import FormContainer from './components/FormContainer';
import BasicInfoForm from './components/BasicInfoForm';
import Metronome from './components/Metronome';
import YouTubeTabs from './components/YouTubeTabs';
import SubmitButton from './components/SubmitButton';

export default function NovaMusicaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [componentsLoaded, setComponentsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    artista: '',
    tom: '',
    bpm: '',
    observacoes: '',
    genero: '',
    duracao: '',
    bandasIds: [] as string[],
  });

  // Simula um carregamento seguro de componentes
  useEffect(() => {
    setComponentsLoaded(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulando salvar a música
      console.log('Salvando música:', formData);
      
      alertaSucesso('Música cadastrada com sucesso!');
      router.push('/musicas');
    } catch (error) {
      console.error('Erro ao cadastrar música:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!componentsLoaded) {
  return (
    <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader />

      <FormContainer onSubmit={handleSubmit}>
        {/* Informações Básicas */}
        <BasicInfoForm formData={formData} handleChange={handleChange} />
        
        {/* Metrônomo */}
        <Metronome initialBpm={formData.bpm} />
        
        {/* YouTube Tabs */}
        <YouTubeTabs />

        {/* Botão de submissão */}
        <SubmitButton loading={loading} />
      </FormContainer>
    </div>
  );
} 