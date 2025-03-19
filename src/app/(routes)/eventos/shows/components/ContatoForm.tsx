import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, User, X } from 'lucide-react';

interface ContatoShow {
  nome: string;
  telefone: string;
  email: string;
  funcao: 'contratante' | 'tecnico' | 'produtor' | 'outro';
  observacoes?: string;
}

interface ContatoFormProps {
  contatos: ContatoShow[];
  onSave: (contatos: ContatoShow[]) => void;
  onClose: () => void;
}

export function ContatoForm({ contatos: contatosIniciais, onSave, onClose }: ContatoFormProps) {
  const [contatos, setContatos] = useState<ContatoShow[]>(contatosIniciais || []);

  const handleAddContato = () => {
    setContatos([...contatos, {
      nome: '',
      telefone: '',
      email: '',
      funcao: 'contratante',
      observacoes: ''
    }]);
  };

  const handleRemoveContato = (index: number) => {
    setContatos(contatos.filter((_, i) => i !== index));
  };

  const handleUpdateContato = (index: number, field: keyof ContatoShow, value: string) => {
    const newContatos = [...contatos];
    newContatos[index] = { ...newContatos[index], [field]: value };
    setContatos(newContatos);
  };

  const handleSubmit = () => {
    onSave(contatos);
    onClose();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Contatos do Show</h2>
        <Button
          type="button"
          onClick={handleAddContato}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Adicionar Contato
        </Button>
      </div>

      <div className="space-y-6">
        {contatos.map((contato, index) => (
          <div key={index} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 relative">
            <button
              onClick={() => handleRemoveContato(index)}
              className="absolute right-2 top-2 text-gray-400 hover:text-red-400"
            >
              <X size={20} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-200">Nome</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    value={contato.nome}
                    onChange={(e) => handleUpdateContato(index, 'nome', e.target.value)}
                    className="pl-9 bg-gray-700/50 border-gray-600"
                    placeholder="Nome do contato"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-200">Função</Label>
                <Select
                  value={contato.funcao}
                  onValueChange={(value) => handleUpdateContato(index, 'funcao', value)}
                >
                  <SelectTrigger className="bg-gray-700/50 border-gray-600">
                    <SelectValue placeholder="Selecione a função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contratante">Contratante</SelectItem>
                    <SelectItem value="tecnico">Técnico</SelectItem>
                    <SelectItem value="produtor">Produtor</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-200">Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    value={contato.telefone}
                    onChange={(e) => handleUpdateContato(index, 'telefone', e.target.value)}
                    className="pl-9 bg-gray-700/50 border-gray-600"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-200">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    value={contato.email}
                    onChange={(e) => handleUpdateContato(index, 'email', e.target.value)}
                    className="pl-9 bg-gray-700/50 border-gray-600"
                    type="email"
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-gray-200">Observações</Label>
              <Textarea
                value={contato.observacoes}
                onChange={(e) => handleUpdateContato(index, 'observacoes', e.target.value)}
                className="bg-gray-700/50 border-gray-600"
                placeholder="Observações adicionais sobre o contato..."
              />
            </div>
          </div>
        ))}
      </div>

      {contatos.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>Nenhum contato adicionado</p>
          <p className="text-sm mt-2">Clique em "Adicionar Contato" para começar</p>
        </div>
      )}

      <div className="flex justify-end space-x-4 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="bg-gray-700/30 border-gray-600 hover:bg-gray-700/50 text-gray-200"
        >
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Salvar Contatos
        </Button>
      </div>
    </div>
  );
} 