'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin, Music2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface Banda {
  id: string;
  nome: string;
}

export default function NovoShowPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [bandas, setBandas] = useState<Banda[]>([]);
  const [carregandoBandas, setCarregandoBandas] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    titulo: '',
    bandaId: '',
    data: '',
    local: '',
    horaInicio: '',
    horaFim: '',
    descricao: ''
  });

  useEffect(() => {
    async function carregarBandas() {
      setCarregandoBandas(true);
      try {
        // Em um ambiente de produção, isso seria uma chamada à API
        // Simulando dados de exemplo
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const bandasMock: Banda[] = [
          { id: '1', nome: 'Rock Stars' },
          { id: '2', nome: 'Electric Sound' },
          { id: '3', nome: 'Acoustic Trio' },
          { id: '4', nome: 'Jazz Ensemble' },
          { id: '5', nome: 'Pop Sensation' },
        ];
        
        setBandas(bandasMock);
      } catch (error) {
        console.error('Erro ao carregar bandas:', error);
        toast({
          title: "Erro ao carregar bandas",
          description: "Não foi possível carregar a lista de bandas. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setCarregandoBandas(false);
      }
    }
    
    carregarBandas();
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Iniciando submissão do formulário');
    
    setIsSubmitting(true);
    
    try {
      // Validação apenas dos campos obrigatórios
      if (!formData.bandaId || !formData.data || !formData.local) {
        toast({
          title: "Erro de validação",
          description: "Por favor, preencha os campos obrigatórios: Banda, Data e Local.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Preparar os dados para envio
      const showData = {
        ...formData,
        tipo: 'show',
        status: 'agendado',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('Dados preparados para envio:', showData);

      // Simulando o envio bem-sucedido (temporário até a API estar pronta)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Show criado com sucesso!",
        description: "O novo show foi adicionado à sua agenda.",
        variant: "default",
      });
      
      router.push('/eventos/shows');
    } catch (error) {
      console.error('Erro ao criar show:', error);
      toast({
        title: "Erro ao criar show",
        description: "Ocorreu um erro ao tentar criar o show. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Novo Show</h1>
          <p className="text-gray-400">Preencha os dados para criar um novo show</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => router.push('/eventos/shows')}
          className="text-white bg-gray-700 hover:bg-gray-600 border-gray-600"
        >
          Voltar
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="titulo" className="text-gray-300 mb-2 block">Título do Show</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Music2 className="h-5 w-5 text-gray-500" />
              </div>
              <Input
                id="titulo"
                name="titulo"
                placeholder="Digite o título do show"
                className="bg-gray-900 border-gray-700 pl-10 text-white placeholder:text-gray-500"
                value={formData.titulo}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="banda" className="text-gray-300 mb-2 block">Banda</Label>
            <Select
              value={formData.bandaId}
              onValueChange={(value) => handleSelectChange(value, 'bandaId')}
              disabled={carregandoBandas}
              required
            >
              <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="Selecione uma banda" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {carregandoBandas ? (
                  <SelectItem value="carregando" disabled>Carregando bandas...</SelectItem>
                ) : (
                  bandas.map((banda) => (
                    <SelectItem key={banda.id} value={banda.id}>
                      {banda.nome}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="data" className="text-gray-300 mb-2 block">Data</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-500" />
              </div>
              <Input
                id="data"
                name="data"
                type="date"
                className="bg-gray-900 border-gray-700 pl-10 text-white placeholder:text-gray-500"
                value={formData.data}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="local" className="text-gray-300 mb-2 block">Local</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-500" />
              </div>
              <Input
                id="local"
                name="local"
                placeholder="Local do show"
                className="bg-gray-900 border-gray-700 pl-10 text-white placeholder:text-gray-500"
                value={formData.local}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="horaInicio" className="text-gray-300 mb-2 block">Hora de Início</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-5 w-5 text-gray-500" />
              </div>
              <Input
                id="horaInicio"
                name="horaInicio"
                type="time"
                className="bg-gray-900 border-gray-700 pl-10 text-white placeholder:text-gray-500"
                value={formData.horaInicio}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="horaFim" className="text-gray-300 mb-2 block">Hora de Término</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-5 w-5 text-gray-500" />
              </div>
              <Input
                id="horaFim"
                name="horaFim"
                type="time"
                className="bg-gray-900 border-gray-700 pl-10 text-white placeholder:text-gray-500"
                value={formData.horaFim}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <Label htmlFor="descricao" className="text-gray-300 mb-2 block">Descrição</Label>
          <Textarea
            id="descricao"
            name="descricao"
            placeholder="Adicione uma descrição para o show"
            className="bg-gray-900 border-gray-700 text-white h-32 placeholder:text-gray-500"
            value={formData.descricao}
            onChange={handleChange}
          />
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push('/eventos/shows')}
            className="bg-gray-700 hover:bg-gray-600 text-white"
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Criando...' : 'Criar Show'}
          </Button>
        </div>
      </form>
    </div>
  );
} 