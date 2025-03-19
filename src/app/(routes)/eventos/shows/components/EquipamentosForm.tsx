import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Music2, Package, User, DollarSign, X } from 'lucide-react';

interface EquipamentoShow {
  tipo: 'instrumento' | 'som' | 'luz' | 'estrutura' | 'outro';
  nome: string;
  quantidade: number;
  fornecedor: string;
  valorAluguel?: number;
  observacoes?: string;
  responsavel?: string;
}

interface EquipamentosFormProps {
  equipamentos: EquipamentoShow[];
  onSave: (equipamentos: EquipamentoShow[]) => void;
  onClose: () => void;
}

export function EquipamentosForm({ equipamentos: equipamentosIniciais, onSave, onClose }: EquipamentosFormProps) {
  const [equipamentos, setEquipamentos] = useState<EquipamentoShow[]>(equipamentosIniciais || []);

  const handleAddEquipamento = () => {
    setEquipamentos([...equipamentos, {
      tipo: 'instrumento',
      nome: '',
      quantidade: 1,
      fornecedor: '',
      valorAluguel: 0,
      observacoes: '',
      responsavel: ''
    }]);
  };

  const handleRemoveEquipamento = (index: number) => {
    setEquipamentos(equipamentos.filter((_, i) => i !== index));
  };

  const handleUpdateEquipamento = (index: number, field: keyof EquipamentoShow, value: any) => {
    const newEquipamentos = [...equipamentos];
    newEquipamentos[index] = { ...newEquipamentos[index], [field]: value };
    setEquipamentos(newEquipamentos);
  };

  const handleSubmit = () => {
    onSave(equipamentos);
    onClose();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Equipamentos do Show</h2>
        <Button
          type="button"
          onClick={handleAddEquipamento}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Adicionar Equipamento
        </Button>
      </div>

      <div className="space-y-6">
        {equipamentos.map((equipamento, index) => (
          <div key={index} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 relative">
            <button
              onClick={() => handleRemoveEquipamento(index)}
              className="absolute right-2 top-2 text-gray-400 hover:text-red-400"
            >
              <X size={20} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-200">Tipo</Label>
                <Select
                  value={equipamento.tipo}
                  onValueChange={(value: any) => handleUpdateEquipamento(index, 'tipo', value)}
                >
                  <SelectTrigger className="bg-gray-700/50 border-gray-600">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instrumento">Instrumento</SelectItem>
                    <SelectItem value="som">Som</SelectItem>
                    <SelectItem value="luz">Luz</SelectItem>
                    <SelectItem value="estrutura">Estrutura</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-200">Nome/Descrição</Label>
                <div className="relative">
                  <Music2 className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    value={equipamento.nome}
                    onChange={(e) => handleUpdateEquipamento(index, 'nome', e.target.value)}
                    className="pl-9 bg-gray-700/50 border-gray-600"
                    placeholder="Nome ou descrição do equipamento"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-200">Quantidade</Label>
                <div className="relative">
                  <Package className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    value={equipamento.quantidade}
                    onChange={(e) => handleUpdateEquipamento(index, 'quantidade', parseInt(e.target.value))}
                    className="pl-9 bg-gray-700/50 border-gray-600"
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-200">Fornecedor</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    value={equipamento.fornecedor}
                    onChange={(e) => handleUpdateEquipamento(index, 'fornecedor', e.target.value)}
                    className="pl-9 bg-gray-700/50 border-gray-600"
                    placeholder="Nome do fornecedor"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-200">Valor do Aluguel</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    value={equipamento.valorAluguel}
                    onChange={(e) => handleUpdateEquipamento(index, 'valorAluguel', parseFloat(e.target.value))}
                    className="pl-9 bg-gray-700/50 border-gray-600"
                    placeholder="0,00"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-200">Responsável</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    value={equipamento.responsavel}
                    onChange={(e) => handleUpdateEquipamento(index, 'responsavel', e.target.value)}
                    className="pl-9 bg-gray-700/50 border-gray-600"
                    placeholder="Nome do responsável"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-gray-200">Observações</Label>
              <Textarea
                value={equipamento.observacoes}
                onChange={(e) => handleUpdateEquipamento(index, 'observacoes', e.target.value)}
                className="bg-gray-700/50 border-gray-600"
                placeholder="Observações adicionais sobre o equipamento..."
              />
            </div>
          </div>
        ))}
      </div>

      {equipamentos.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>Nenhum equipamento adicionado</p>
          <p className="text-sm mt-2">Clique em "Adicionar Equipamento" para começar</p>
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
          Salvar Equipamentos
        </Button>
      </div>
    </div>
  );
} 