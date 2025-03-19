'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Music, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { alertaSucesso, alertaErro } from '@/lib/sweetalert';
import Link from 'next/link';

export default function NovaBandaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    genero: '',
    descricao: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.nome || !formData.genero) {
      alertaErro('Nome e gênero são obrigatórios');
      return;
    }
    
    setLoading(true);
    
    try {
      // Usar o novo endpoint simplificado
      const response = await fetch('/api/bandas-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'create',
          data: formData
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar banda');
      }
      
      alertaSucesso('Banda criada com sucesso!');
      router.push('/bandas');
    } catch (error) {
      console.error('Erro ao salvar banda:', error);
      alertaErro('Erro ao salvar a banda');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link 
          href="/bandas" 
          className="flex items-center text-blue-400 hover:text-blue-300 mr-4"
        >
          <ArrowLeft className="mr-1" size={18} />
          <span>Voltar</span>
        </Link>
        <h1 className="text-2xl font-bold text-white">Nova Banda</h1>
      </div>
      
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-indigo-900/50 to-indigo-800/30 p-4 rounded-lg mb-6 flex items-center">
          <Music className="text-indigo-400 mr-3" size={24} />
          <h2 className="text-xl font-semibold text-white">Cadastrar Nova Banda</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Banda*</Label>
              <Input
                id="nome"
                name="nome"
                placeholder="Digite o nome da banda"
                value={formData.nome}
                onChange={handleChange}
                className="bg-[#1a1c23] border-[#2e2f35]"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="genero">Gênero Musical*</Label>
              <Input
                id="genero"
                name="genero"
                placeholder="Ex: Rock, Pop, Jazz..."
                value={formData.genero}
                onChange={handleChange}
                className="bg-[#1a1c23] border-[#2e2f35]"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              name="descricao"
              placeholder="Descreva detalhes sobre a banda"
              value={formData.descricao}
              onChange={handleChange}
              className="min-h-[120px] bg-[#1a1c23] border-[#2e2f35]"
            />
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/bandas')}
              className="bg-[#1a1c23] border-[#2e2f35] hover:bg-gray-800/50"
              disabled={loading}
            >
              Cancelar
            </Button>
            
            <Button 
              type="submit"
              className="bg-orange-500 hover:bg-orange-600"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                  Salvando...
                </>
              ) : 'Salvar Banda'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 