'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FieldTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const FIELD_TYPES = [
  { value: 'text', label: 'Texto' },
  { value: 'integer', label: 'Número Inteiro' },
  { value: 'decimal', label: 'Número Decimal' },
  { value: 'boolean', label: 'Booleano' },
  { value: 'date', label: 'Data' },
  { value: 'timestamp', label: 'Data e Hora' },
  { value: 'json', label: 'JSON' },
  { value: 'uuid', label: 'UUID' },
  { value: 'array', label: 'Array' }
];

export function FieldTypeSelector({ value, onChange }: FieldTypeSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px] bg-slate-900 border-slate-700 text-white">
        <SelectValue placeholder="Selecione o tipo" />
      </SelectTrigger>
      <SelectContent className="bg-slate-800 border-slate-700">
        {FIELD_TYPES.map((type) => (
          <SelectItem key={type.value} value={type.value} className="text-white hover:bg-slate-700">
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 