import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Calendar, X } from 'lucide-react';

interface CustoShow {
  categoria: 'cachê' | 'transporte' | 'alimentacao' | 'equipamento' | 'hospedagem' | 'outros';
  descricao: string;
  valor: number;
  formaPagamento: 'dinheiro' | 'pix' | 'transferencia' | 'cartao' | 'outro';
  status: 'pendente' | 'pago' | 'cancelado';
  dataPagamento?: string;
  observacoes?: string;
}

interface CustosFormProps {
  custos: CustoShow[];
  onSave: (custos: CustoShow[]) => void;
  onClose: () => void;
}

export function CustosForm({ custos: custosIniciais, onSave, onClose }: CustosFormProps) {
  const [custos, setCustos] = useState<CustoShow[]>(custosIniciais || []);
  const [totalCustos, setTotalCustos] = useState(0);

  // Calcula o total dos custos sempre que houver mudança
  useEffect(() => {
    const total = custos.reduce((acc, custo) => acc + custo.valor, 0);
    setTotalCustos(total);
  }, [custos]);

  const handleAddCusto = () => {
    setCustos([...custos, {
      categoria: 'outros',
      descricao: '',
      valor: 0,
      formaPagamento: 'dinheiro',
      status: 'pendente',
      dataPagamento: '',
      observacoes: ''
    }]);
  };

  const handleRemoveCusto = (index: number) => {
    setCustos(custos.filter((_, i) => i !== index));
  };

  const handleUpdateCusto = (index: number, field: keyof CustoShow, value: any) => {
    const newCustos = [...custos];
    newCustos[index] = { ...newCustos[index], [field]: value };
    setCustos(newCustos);
  };

  const handleSubmit = () => {
    onSave(custos);
    onClose();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-white">Custos do Show</h2>
          <p className="text-sm text-gray-400 mt-1">Total: R$ {totalCustos.toFixed(2)}</p>
        </div>
        <Button
          type="button"
          onClick={handleAddCusto}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Adicionar Custo
        </Button>
      </div>

      <div className="space-y-6">
        {custos.map((custo, index) => (
          <div key={index} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 relative">
            <button
              onClick={() => handleRemoveCusto(index)}
              className="absolute right-2 top-2 text-gray-400 hover:text-red-400"
            >
              <X size={20} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-200">Categoria</Label>
                <Select
                  value={custo.categoria}
                  onValueChange={(value: any) => handleUpdateCusto(index, 'categoria', value)}
                >
                  <SelectTrigger className="bg-gray-700/50 border-gray-600">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cachê">Cachê</SelectItem>
                    <SelectItem value="transporte">Transporte</SelectItem>
                    <SelectItem value="alimentacao">Alimentação</SelectItem>
                    <SelectItem value="equipamento">Equipamento</SelectItem>
                    <SelectItem value="hospedagem">Hospedagem</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-200">Valor</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="number"
                    value={custo.valor}
                    onChange={(e) => handleUpdateCusto(index, 'valor', parseFloat(e.target.value))}
                    className="pl-9 bg-gray-700/50 border-gray-600"
                    placeholder="0,00"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-200">Forma de Pagamento</Label>
                <Select
                  value={custo.formaPagamento}
                  onValueChange={(value: any) => handleUpdateCusto(index, 'formaPagamento', value)}
                >
                  <SelectTrigger className="bg-gray-700/50 border-gray-600">
                    <SelectValue placeholder="Selecione a forma de pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="transferencia">Transferência</SelectItem>
                    <SelectItem value="cartao">Cartão</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-200">Status</Label>
                <Select
                  value={custo.status}
                  onValueChange={(value: any) => handleUpdateCusto(index, 'status', value)}
                >
                  <SelectTrigger className="bg-gray-700/50 border-gray-600">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-200">Data do Pagamento</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    type="date"
                    value={custo.dataPagamento}
                    onChange={(e) => handleUpdateCusto(index, 'dataPagamento', e.target.value)}
                    className="pl-9 bg-gray-700/50 border-gray-600"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm text-gray-200">Descrição</Label>
                <Input
                  value={custo.descricao}
                  onChange={(e) => handleUpdateCusto(index, 'descricao', e.target.value)}
                  className="bg-gray-700/50 border-gray-600"
                  placeholder="Descreva o custo..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-gray-200">Observações</Label>
              <Textarea
                value={custo.observacoes}
                onChange={(e) => handleUpdateCusto(index, 'observacoes', e.target.value)}
                className="bg-gray-700/50 border-gray-600"
                placeholder="Observações adicionais sobre o custo..."
              />
            </div>
          </div>
        ))}
      </div>

      {custos.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>Nenhum custo adicionado</p>
          <p className="text-sm mt-2">Clique em "Adicionar Custo" para começar</p>
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
          Salvar Custos
        </Button>
      </div>
    </div>
  );
} 