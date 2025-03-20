'use client';

import { memo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CustosForm } from './CustosForm';
import { CustoShow } from '@/lib/types';

interface CustosModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  custos: CustoShow[];
  onSave: (custos: CustoShow[]) => void;
}

export const CustosModal = memo(function CustosModal({ open, onOpenChange, custos, onSave }: CustosModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Custos do Show</DialogTitle>
        </DialogHeader>
        <CustosForm
          custos={custos}
          onSave={onSave}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}); 