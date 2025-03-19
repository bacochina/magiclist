'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { HospedagemShow } from '@/lib/types';
import { X, Plus } from 'lucide-react';

interface Hospede {
  nome: string;
  telefone: string;
}

interface Quarto {
  numero: string;
  andar: string;
  tipo: 'standard' | 'superior' | 'luxo' | 'suite';
  hospedes: Hospede[];
  ssidWifi: string;
  senhaWifi: string;
}

interface HospedagemFormProps {
  hospedagem: HospedagemShow | null;
  onSave: (hospedagem: HospedagemShow) => void;
  onClose: () => void;
}

export function HospedagemForm({ hospedagem, onSave, onClose }: HospedagemFormProps) {
  const [form, setForm] = useState<HospedagemShow>({
    endereco: '',
    cidade: '',
    estado: '',
    checkInData: '',
    checkInHora: '',
    checkOutData: '',
    checkOutHora: '',
    valorDiaria: 0,
    incluiCafe: false,
    ramalRecepcao: '',
    ramalCozinha: '',
    quartos: [],
    observacoes: ''
  });

  useEffect(() => {
    if (hospedagem) {
      setForm(hospedagem);
    }
  }, [hospedagem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const adicionarQuarto = () => {
    setForm(prev => ({
      ...prev,
      quartos: [...prev.quartos || [], {
        numero: '',
        andar: '',
        tipo: 'standard',
        hospedes: [],
        ssidWifi: '',
        senhaWifi: ''
      }]
    }));
  };

  const removerQuarto = (index: number) => {
    setForm(prev => ({
      ...prev,
      quartos: prev.quartos?.filter((_, i) => i !== index) || []
    }));
  };

  const adicionarHospede = (quartoIndex: number) => {
    setForm(prev => ({
      ...prev,
      quartos: prev.quartos?.map((quarto, i) => {
        if (i === quartoIndex) {
          return {
            ...quarto,
            hospedes: [...quarto.hospedes, { nome: '', telefone: '' }]
          };
        }
        return quarto;
      }) || []
    }));
  };

  const removerHospede = (quartoIndex: number, hospedeIndex: number) => {
    setForm(prev => ({
      ...prev,
      quartos: prev.quartos?.map((quarto, i) => {
        if (i === quartoIndex) {
          return {
            ...quarto,
            hospedes: quarto.hospedes.filter((_, j) => j !== hospedeIndex)
          };
        }
        return quarto;
      }) || []
    }));
  };

  const atualizarQuarto = (index: number, campo: keyof Quarto, valor: any) => {
    setForm(prev => ({
      ...prev,
      quartos: prev.quartos?.map((quarto, i) => {
        if (i === index) {
          return { ...quarto, [campo]: valor };
        }
        return quarto;
      }) || []
    }));
  };

  const atualizarHospede = (quartoIndex: number, hospedeIndex: number, campo: keyof Hospede, valor: string) => {
    setForm(prev => ({
      ...prev,
      quartos: prev.quartos?.map((quarto, i) => {
        if (i === quartoIndex) {
          return {
            ...quarto,
            hospedes: quarto.hospedes.map((hospede, j) => {
              if (j === hospedeIndex) {
                return { ...hospede, [campo]: valor };
              }
              return hospede;
            })
          };
        }
        return quarto;
      }) || []
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto p-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="endereco">Endereço</Label>
          <Input
            id="endereco"
            value={form.endereco}
            onChange={(e) => setForm(prev => ({ ...prev, endereco: e.target.value }))}
            className="bg-gray-700/50 border-gray-600 text-white"
            placeholder="Endereço completo"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cidade">Cidade</Label>
            <Input
              id="cidade"
              value={form.cidade}
              onChange={(e) => setForm(prev => ({ ...prev, cidade: e.target.value }))}
              className="bg-gray-700/50 border-gray-600 text-white"
              placeholder="Cidade"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Input
              id="estado"
              value={form.estado}
              onChange={(e) => setForm(prev => ({ ...prev, estado: e.target.value }))}
              className="bg-gray-700/50 border-gray-600 text-white"
              placeholder="Estado"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Data do Check-in</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                value={form.checkInData}
                onChange={(e) => setForm(prev => ({ ...prev, checkInData: e.target.value }))}
                className="bg-gray-700/50 border-gray-600 text-white"
              />
              <Input
                type="time"
                value={form.checkInHora}
                onChange={(e) => setForm(prev => ({ ...prev, checkInHora: e.target.value }))}
                className="bg-gray-700/50 border-gray-600 text-white"
              />
            </div>
          </div>

          <div>
            <Label>Data do Check-out</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                value={form.checkOutData}
                onChange={(e) => setForm(prev => ({ ...prev, checkOutData: e.target.value }))}
                className="bg-gray-700/50 border-gray-600 text-white"
              />
              <Input
                type="time"
                value={form.checkOutHora}
                onChange={(e) => setForm(prev => ({ ...prev, checkOutHora: e.target.value }))}
                className="bg-gray-700/50 border-gray-600 text-white"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 items-center">
          <div className="space-y-2">
            <Label htmlFor="valorDiaria">Valor da Diária</Label>
            <Input
              id="valorDiaria"
              type="number"
              min="0"
              step="0.01"
              value={form.valorDiaria}
              onChange={(e) => setForm(prev => ({ ...prev, valorDiaria: parseFloat(e.target.value) }))}
              className="bg-gray-700/50 border-gray-600 text-white"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="incluiCafe"
              checked={form.incluiCafe}
              onCheckedChange={(checked) => setForm(prev => ({ ...prev, incluiCafe: checked }))}
            />
            <Label htmlFor="incluiCafe">Inclui Café da Manhã</Label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ramalRecepcao">Ramal da Recepção</Label>
            <Input
              id="ramalRecepcao"
              value={form.ramalRecepcao}
              onChange={(e) => setForm(prev => ({ ...prev, ramalRecepcao: e.target.value }))}
              className="bg-gray-700/50 border-gray-600 text-white"
              placeholder="Ramal da recepção"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ramalCozinha">Ramal da Cozinha</Label>
            <Input
              id="ramalCozinha"
              value={form.ramalCozinha}
              onChange={(e) => setForm(prev => ({ ...prev, ramalCozinha: e.target.value }))}
              className="bg-gray-700/50 border-gray-600 text-white"
              placeholder="Ramal da cozinha"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Quartos</Label>
            <Button
              type="button"
              onClick={adicionarQuarto}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Quarto
            </Button>
          </div>

          {form.quartos?.map((quarto, quartoIndex) => (
            <div key={quartoIndex} className="p-4 bg-gray-800 rounded-lg space-y-4 relative">
              <Button
                type="button"
                onClick={() => removerQuarto(quartoIndex)}
                className="absolute right-2 top-2 p-1 h-6 w-6"
                variant="ghost"
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Número</Label>
                  <Input
                    value={quarto.numero}
                    onChange={(e) => atualizarQuarto(quartoIndex, 'numero', e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white"
                    placeholder="Número do quarto"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Andar</Label>
                  <Input
                    value={quarto.andar}
                    onChange={(e) => atualizarQuarto(quartoIndex, 'andar', e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white"
                    placeholder="Andar"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select
                    value={quarto.tipo}
                    onValueChange={(value: any) => atualizarQuarto(quartoIndex, 'tipo', value)}
                  >
                    <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="superior">Superior</SelectItem>
                      <SelectItem value="luxo">Luxo</SelectItem>
                      <SelectItem value="suite">Suíte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Hóspedes</Label>
                  <Button
                    type="button"
                    onClick={() => adicionarHospede(quartoIndex)}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Hóspede
                  </Button>
                </div>

                {quarto.hospedes.map((hospede, hospedeIndex) => (
                  <div key={hospedeIndex} className="grid grid-cols-2 gap-4 items-center relative pr-8">
                    <Input
                      value={hospede.nome}
                      onChange={(e) => atualizarHospede(quartoIndex, hospedeIndex, 'nome', e.target.value)}
                      className="bg-gray-700/50 border-gray-600 text-white"
                      placeholder="Nome do hóspede"
                    />
                    <div className="flex gap-2">
                      <Input
                        value={hospede.telefone}
                        onChange={(e) => atualizarHospede(quartoIndex, hospedeIndex, 'telefone', e.target.value)}
                        className="bg-gray-700/50 border-gray-600 text-white"
                        placeholder="(00) 00000-0000"
                      />
                      <Button
                        type="button"
                        onClick={() => removerHospede(quartoIndex, hospedeIndex)}
                        className="p-1 h-10 w-10"
                        variant="ghost"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>SSID Wi-Fi</Label>
                  <Input
                    value={quarto.ssidWifi}
                    onChange={(e) => atualizarQuarto(quartoIndex, 'ssidWifi', e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white"
                    placeholder="Nome da rede Wi-Fi"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Senha Wi-Fi</Label>
                  <Input
                    value={quarto.senhaWifi}
                    onChange={(e) => atualizarQuarto(quartoIndex, 'senhaWifi', e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white"
                    placeholder="Senha da rede"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea
            id="observacoes"
            value={form.observacoes}
            onChange={(e) => setForm(prev => ({ ...prev, observacoes: e.target.value }))}
            className="bg-gray-700/50 border-gray-600 text-white min-h-[100px]"
            placeholder="Observações adicionais sobre a hospedagem..."
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="bg-gray-700/30 border-gray-600 hover:bg-gray-700/50 text-gray-200"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          Salvar
        </Button>
      </div>
    </form>
  );
} 