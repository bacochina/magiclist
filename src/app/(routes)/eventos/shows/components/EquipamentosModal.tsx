'use client';

import { memo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EquipamentosForm } from './EquipamentosForm';
import { EquipamentoShow } from '@/lib/types';

interface EquipamentosModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipamentos: EquipamentoShow[];
  onSave: (equipamentos: EquipamentoShow[]) => void;
}

export const EquipamentosModal = memo(function EquipamentosModal({ open, onOpenChange, equipamentos, onSave }: EquipamentosModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Equipamentos do Show</DialogTitle>
        </DialogHeader>
        <EquipamentosForm
          equipamentos={equipamentos}
          onSave={onSave}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}); 