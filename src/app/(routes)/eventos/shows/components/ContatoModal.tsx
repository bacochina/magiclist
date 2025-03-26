'use client';

import { memo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ContatoForm } from './ContatoForm';
import { ContatoShow } from '@/lib/types';

interface ContatoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contatos: ContatoShow[];
  onSave: (contatos: ContatoShow[]) => void;
}

export const ContatoModal = memo(function ContatoModal({ open, onOpenChange, contatos, onSave }: ContatoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contatos do Show</DialogTitle>
        </DialogHeader>
        <ContatoForm
          contatos={contatos}
          onSave={onSave}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}); 