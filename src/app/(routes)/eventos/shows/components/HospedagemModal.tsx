'use client';

import { memo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HospedagemForm } from './HospedagemForm';
import { HospedagemShow } from '@/lib/types';

interface HospedagemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hospedagem: HospedagemShow | null;
  onSave: (hospedagem: HospedagemShow) => void;
}

export const HospedagemModal = memo(function HospedagemModal({ open, onOpenChange, hospedagem, onSave }: HospedagemModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hospedagem do Show</DialogTitle>
        </DialogHeader>
        <HospedagemForm
          hospedagem={hospedagem}
          onSave={onSave}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}); 