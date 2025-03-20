'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserIcon, PhoneIcon, AtSymbolIcon, MusicalNoteIcon, DocumentTextIcon, CreditCardIcon, KeyIcon } from '@heroicons/react/24/outline';
import { alertaSucesso, alertaErro } from '@/lib/sweetalert';

interface Banda {
  id: string;
  nome: string;
  genero: string;
}

interface Integrante {
  id?: string;
  nome: string;
  instrumento: string;
  telefone?: string | null;
  email?: string | null;
  observacoes?: string | null;
  bandas?: string[];
  apelido?: string | null;
  tipo_chave_pix?: string | null;
  chave_pix?: string | null;
  integrantes_bandas?: Array<{
    banda_id: string;
    bandas: {
      id: string;
      nome: string;
      genero: string;
    };
  }>;
}

interface IntegranteFormProps {
  initialData?: Integrante;
  onSave?: () => void;
}

export function IntegranteForm({ initialData, onSave }: IntegranteFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [bandas, setBandas] = useState<Banda[]>([]);
  const [formData, setFormData] = useState<Integrante>({
    nome: initialData?.nome || "",
    instrumento: initialData?.instrumento || "",
    telefone: initialData?.telefone || "",
    email: initialData?.email || "",
    observacoes: initialData?.observacoes || "",
    bandas: initialData?.bandas || [],
    apelido: initialData?.apelido || "",
    tipo_chave_pix: initialData?.tipo_chave_pix || "",
    chave_pix: initialData?.chave_pix || "",
  });

  useEffect(() => {
    if (initialData) {
      // Extrair os IDs das bandas do integrante
      const bandasIds = initialData.integrantes_bandas?.map(rel => rel.bandas.id) || [];
      
      setFormData({
        nome: initialData.nome,
        instrumento: initialData.instrumento,
        telefone: initialData.telefone || '',
        email: initialData.email || '',
        observacoes: initialData.observacoes || '',
        bandas: bandasIds,
        apelido: initialData.apelido || '',
        tipo_chave_pix: initialData.tipo_chave_pix || '',
        chave_pix: initialData.chave_pix || '',
      });
    }
  }, [initialData]);

  useEffect(() => {
    async function carregarBandas() {
      try {
        const response = await fetch('/api/bandas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'list' }),
        });

        if (!response.ok) {
          throw new Error('Erro ao carregar bandas');
        }

        const data = await response.json();
        setBandas(data.bandas || []);
      } catch (error) {
        console.error('Erro ao carregar bandas:', error);
        alertaErro('Erro ao carregar bandas');
      }
    }

    carregarBandas();
  }, []);

  const formatarTelefoneInput = (valor: string) => {
    // Remove tudo que não for número
    const numeros = valor.replace(/\D/g, '');
    
    // Aplica a formatação conforme o usuário digita
    if (numeros.length === 0) return '';
    if (numeros.length <= 2) return `(${numeros}`;
    if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    if (numeros.length <= 11) return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
  };

  const formatarChavePix = (valor: string, tipo: string): string => {
    if (!valor) return '';
    
    // Remove todos os caracteres não numéricos para CPF, CNPJ e telefone
    if (['CPF', 'CNPJ', 'TELEFONE'].includes(tipo)) {
      const numeros = valor.replace(/\D/g, '');
      
      switch (tipo) {
        case 'CPF':
          // Formata CPF: 123.456.789-01
          if (numeros.length <= 3) return numeros;
          if (numeros.length <= 6) return `${numeros.slice(0, 3)}.${numeros.slice(3)}`;
          if (numeros.length <= 9) return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6)}`;
          return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9, 11)}`;
          
        case 'CNPJ':
          // Formata CNPJ: 12.345.678/0001-90
          if (numeros.length <= 2) return numeros;
          if (numeros.length <= 5) return `${numeros.slice(0, 2)}.${numeros.slice(2)}`;
          if (numeros.length <= 8) return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5)}`;
          if (numeros.length <= 12) return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5, 8)}/${numeros.slice(8)}`;
          return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5, 8)}/${numeros.slice(8, 12)}-${numeros.slice(12, 14)}`;
          
        case 'TELEFONE':
          // Utiliza a mesma função que já temos para telefone
          return formatarTelefoneInput(valor);
          
        default:
          return valor;
      }
    }
    
    // Para outros tipos, retorna o valor original
    return valor;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'telefone') {
      const numeroAtual = value.replace(/\D/g, '');
      if (numeroAtual.length <= 11) {
        setFormData(prev => ({
          ...prev,
          [name]: formatarTelefoneInput(value)
        }));
      }
    } else if (name === 'chave_pix' && formData.tipo_chave_pix) {
      setFormData(prev => ({
        ...prev,
        [name]: formatarChavePix(value, prev.tipo_chave_pix || '')
      }));
    } else if (name === 'tipo_chave_pix') {
      // Se o tipo da chave PIX for alterado, ajusta a formatação da chave atual
      setFormData(prev => ({
        ...prev,
        tipo_chave_pix: value,
        // Limpa a chave se trocar o tipo
        chave_pix: prev.chave_pix ? formatarChavePix(prev.chave_pix.replace(/\D/g, ''), value) : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleBandasChange = (selectedBandas: string[]) => {
    setFormData(prev => ({
      ...prev,
      bandas: selectedBandas
    }));
  };

  const validarChavePix = (): boolean => {
    if (!formData.chave_pix || !formData.tipo_chave_pix) return true;
    
    switch (formData.tipo_chave_pix) {
      case 'CPF':
        // Valida se tem 11 dígitos e contém apenas números
        const cpf = formData.chave_pix.replace(/\D/g, '');
        if (cpf.length !== 11 || !/^\d+$/.test(cpf)) {
          alertaErro('CPF deve conter 11 dígitos numéricos');
          return false;
        }
        return true;
        
      case 'CNPJ':
        // Valida se tem 14 dígitos e contém apenas números
        const cnpj = formData.chave_pix.replace(/\D/g, '');
        if (cnpj.length !== 14 || !/^\d+$/.test(cnpj)) {
          alertaErro('CNPJ deve conter 14 dígitos numéricos');
          return false;
        }
        return true;
        
      case 'EMAIL':
        // Validação simplificada de email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.chave_pix)) {
          alertaErro('Formato de email inválido');
          return false;
        }
        return true;
        
      case 'TELEFONE':
        // Valida se tem entre 10 e 11 dígitos e contém apenas números
        const telefone = formData.chave_pix.replace(/\D/g, '');
        if (telefone.length < 10 || telefone.length > 11 || !/^\d+$/.test(telefone)) {
          alertaErro('Telefone deve conter 10 ou 11 dígitos numéricos');
          return false;
        }
        return true;
        
      case 'ALEATORIA':
        // Chave aleatória geralmente tem um formato específico, mas aqui só verificamos se não está vazia
        if (formData.chave_pix.trim().length === 0) {
          alertaErro('A chave aleatória não pode estar vazia');
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.instrumento) {
      alertaErro('Nome e instrumento são obrigatórios');
      return;
    }
    
    // Validação específica para chave PIX
    if (formData.chave_pix && !formData.tipo_chave_pix) {
      alertaErro('Selecione um tipo de chave PIX');
      return;
    }
    
    if (formData.tipo_chave_pix && !formData.chave_pix) {
      alertaErro('Digite a chave PIX');
      return;
    }
    
    // Validação específica para cada tipo de chave PIX
    if (!validarChavePix()) {
      return;
    }
    
    setLoading(true);

    try {
      const endpoint = initialData?.id 
        ? `/api/integrantes/${initialData.id}` 
        : '/api/integrantes';

      const method = initialData?.id ? 'PUT' : 'POST';
      
      // Garantir que bandas seja sempre um array
      const dataToSend = {
        ...formData,
        bandas: formData.bandas || []
      };

      const body = initialData?.id 
        ? dataToSend
        : { action: 'create', data: dataToSend };

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Erro ao salvar integrante');
      }

      alertaSucesso(
        `Integrante ${initialData?.id ? "atualizado" : "cadastrado"} com sucesso!`
      );
      
      if (onSave) {
        onSave();
      } else {
        router.push('/integrantes');
        router.refresh();
      }
    } catch (error) {
      console.error('Erro ao salvar integrante:', error);
      alertaErro('Erro ao salvar integrante');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-white max-w-[120%] mx-auto p-6 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-6 space-y-2">
          <label htmlFor="nome" className="block text-sm font-medium text-white flex items-center">
            <UserIcon className="h-5 w-5 mr-2 text-purple-400" />
            Nome do Integrante *
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                     transition-all duration-200 ease-in-out px-3 py-2 h-9"
            placeholder="Digite o nome do integrante"
            required
          />
        </div>

        <div className="md:col-span-6 space-y-2">
          <label htmlFor="instrumento" className="block text-sm font-medium text-white flex items-center">
            <MusicalNoteIcon className="h-5 w-5 mr-2 text-purple-400" />
            Instrumento/Função *
          </label>
          <input
            type="text"
            id="instrumento"
            name="instrumento"
            value={formData.instrumento}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                     transition-all duration-200 ease-in-out px-3 py-2 h-9"
            placeholder="Ex: Guitarra, Baixo, Vocal..."
            required
          />
        </div>

        <div className="md:col-span-6 space-y-2">
          <label htmlFor="telefone" className="block text-sm font-medium text-white flex items-center">
            <PhoneIcon className="h-5 w-5 mr-2 text-purple-400" />
            Telefone
          </label>
          <input
            type="tel"
            id="telefone"
            name="telefone"
            value={formData.telefone || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                     transition-all duration-200 ease-in-out px-3 py-2 h-9"
            placeholder="(00) 00000-0000"
            maxLength={15} // Tamanho máximo considerando a máscara
          />
        </div>

        <div className="md:col-span-6 space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-white flex items-center">
            <AtSymbolIcon className="h-5 w-5 mr-2 text-purple-400" />
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                     transition-all duration-200 ease-in-out px-3 py-2 h-9"
            placeholder="email@exemplo.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-white flex items-center">
          <UserIcon className="h-5 w-5 mr-2 text-purple-400" />
          Bandas
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bandas.map((banda) => (
            <div
              key={banda.id}
              className={`
                relative flex items-center p-4 rounded-xl border
                ${formData.bandas?.includes(banda.id)
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-white/20 bg-gray-800/50'}
                hover:border-purple-500/50 transition-all duration-200
                cursor-pointer group
              `}
              onClick={() => {
                const newBandas = formData.bandas || [];
                const index = newBandas.indexOf(banda.id);
                if (index === -1) {
                  handleBandasChange([...newBandas, banda.id]);
                } else {
                  handleBandasChange(newBandas.filter(id => id !== banda.id));
                }
              }}
            >
              <div className="flex-1">
                <h3 className="font-medium text-white">{banda.nome}</h3>
                <p className="text-sm text-gray-400">{banda.genero}</p>
              </div>
              <div className={`
                w-5 h-5 rounded border-2 flex items-center justify-center
                ${formData.bandas?.includes(banda.id)
                  ? 'border-purple-500 bg-purple-500'
                  : 'border-white/20 group-hover:border-purple-500/50'}
              `}>
                {formData.bandas?.includes(banda.id) && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-4 space-y-2">
          <label htmlFor="apelido" className="block text-sm font-medium text-white flex items-center">
            <UserIcon className="h-5 w-5 mr-2 text-purple-400" />
            Apelido
          </label>
          <input
            type="text"
            id="apelido"
            name="apelido"
            value={formData.apelido || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                     transition-all duration-200 ease-in-out px-3 py-2 h-9"
            placeholder="Digite o apelido do integrante"
          />
        </div>

        <div className="md:col-span-4 space-y-2">
          <label htmlFor="tipo_chave_pix" className="block text-sm font-medium text-white flex items-center">
            <CreditCardIcon className="h-5 w-5 mr-2 text-purple-400" />
            Tipo da Chave PIX
          </label>
          <select
            id="tipo_chave_pix"
            name="tipo_chave_pix"
            value={formData.tipo_chave_pix || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                     transition-all duration-200 ease-in-out px-3 py-2 h-9"
          >
            <option value="">Selecione o tipo de chave</option>
            <option value="CPF">CPF</option>
            <option value="CNPJ">CNPJ</option>
            <option value="EMAIL">E-mail</option>
            <option value="TELEFONE">Telefone</option>
            <option value="ALEATORIA">Chave Aleatória</option>
          </select>
        </div>

        <div className="md:col-span-4 space-y-2">
          <label htmlFor="chave_pix" className="block text-sm font-medium text-white flex items-center">
            <KeyIcon className="h-5 w-5 mr-2 text-purple-400" />
            Chave PIX
          </label>
          <input
            type="text"
            id="chave_pix"
            name="chave_pix"
            value={formData.chave_pix || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                     transition-all duration-200 ease-in-out px-3 py-2 h-9"
            placeholder={
              formData.tipo_chave_pix === 'CPF' ? '123.456.789-01' :
              formData.tipo_chave_pix === 'CNPJ' ? '12.345.678/0001-90' :
              formData.tipo_chave_pix === 'EMAIL' ? 'email@exemplo.com' :
              formData.tipo_chave_pix === 'TELEFONE' ? '(00) 00000-0000' :
              formData.tipo_chave_pix === 'ALEATORIA' ? 'Chave aleatória' :
              'Digite a chave PIX'
            }
            maxLength={
              formData.tipo_chave_pix === 'CPF' ? 14 : // 123.456.789-01 (14 caracteres)
              formData.tipo_chave_pix === 'CNPJ' ? 18 : // 12.345.678/0001-90 (18 caracteres)
              formData.tipo_chave_pix === 'TELEFONE' ? 15 : // (00) 00000-0000 (15 caracteres)
              formData.tipo_chave_pix === 'EMAIL' ? 100 : // tamanho máximo razoável para email
              formData.tipo_chave_pix === 'ALEATORIA' ? 36 : // UUID (36 caracteres)
              100 // padrão
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="observacoes" className="block text-sm font-medium text-white flex items-center">
          <DocumentTextIcon className="h-5 w-5 mr-2 text-purple-400" />
          Observações
        </label>
        <textarea
          id="observacoes"
          name="observacoes"
          value={formData.observacoes || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-xl bg-gray-800/50 border border-white/20 text-sm text-white placeholder-gray-400
                   focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 shadow-sm
                   transition-all duration-200 ease-in-out px-3 py-2"
          rows={4}
          placeholder="Descreva detalhes sobre o integrante"
        />
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 rounded-xl border border-white/20 text-sm text-white hover:bg-white/10
                   focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 ease-in-out
                   font-medium flex items-center justify-center"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-indigo-500 text-sm text-white hover:bg-indigo-600
                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900
                   transition-all duration-200 ease-in-out font-medium shadow-lg shadow-indigo-500/20
                   flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
              Salvando...
            </>
          ) : initialData ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  );
} 