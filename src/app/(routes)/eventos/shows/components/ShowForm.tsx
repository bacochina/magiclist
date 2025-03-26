'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Hotel, DollarSign, Music2, Save } from 'lucide-react';
import { ShowEvento } from '@/lib/types';

interface ShowFormProps {
  evento: ShowEvento;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (value: string, name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onContatosClick: () => void;
  onEquipamentosClick: () => void;
  onHospedagemClick: () => void;
  onCustosClick: () => void;
}

export function ShowForm({
  evento,
  onInputChange,
  onSelectChange,
  onSubmit,
  onContatosClick,
  onEquipamentosClick,
  onHospedagemClick,
  onCustosClick
}: ShowFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="titulo">Nome do Show</Label>
            <Input
              id="titulo"
              name="titulo"
              value={evento.titulo}
              onChange={onInputChange}
              placeholder="Nome do show"
            />
          </div>

          <div>
            <Label htmlFor="data">Data</Label>
            <Input
              id="data"
              name="data"
              type="date"
              value={evento.data}
              onChange={onInputChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="horaInicio">Hora de Início</Label>
              <Input
                id="horaInicio"
                name="horaInicio"
                type="time"
                value={evento.horaInicio}
                onChange={onInputChange}
              />
            </div>

            <div>
              <Label htmlFor="horaFim">Hora de Término</Label>
              <Input
                id="horaFim"
                name="horaFim"
                type="time"
                value={evento.horaFim}
                onChange={onInputChange}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="local">Local</Label>
            <Input
              id="local"
              name="local"
              value={evento.local}
              onChange={onInputChange}
              placeholder="Local do show"
            />
          </div>

          <div>
            <Label htmlFor="valor">Valor</Label>
            <Input
              id="valor"
              name="valor"
              value={evento.valor}
              onChange={onInputChange}
              placeholder="Valor do show"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={evento.status}
              onValueChange={(value) => onSelectChange(value, 'status')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agendado">Agendado</SelectItem>
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
                <SelectItem value="realizado">Realizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              name="descricao"
              value={evento.descricao}
              onChange={onInputChange}
              placeholder="Descrição do show"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              name="observacoes"
              value={evento.observacoes}
              onChange={onInputChange}
              placeholder="Observações adicionais"
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onContatosClick}
        >
          <Phone className="mr-2 h-4 w-4" />
          Contatos
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onEquipamentosClick}
        >
          <Music2 className="mr-2 h-4 w-4" />
          Equipamentos
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onHospedagemClick}
        >
          <Hotel className="mr-2 h-4 w-4" />
          Hospedagem
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onCustosClick}
        >
          <DollarSign className="mr-2 h-4 w-4" />
          Custos
        </Button>
      </div>

      <div className="flex justify-end mt-6">
        <Button type="submit" className="w-full md:w-auto">
          <Save className="mr-2 h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>
    </form>
  );
} 