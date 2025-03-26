import React from 'react';
import { confirmar } from '@/lib/sweetalert';

interface ConfirmacaoDeletarProps {
  mensagem: string;
  onConfirmar: () => void;
  onCancelar: () => void;
  titulo?: string;
}

export default function ConfirmacaoDeletar({
  mensagem,
  onConfirmar,
  onCancelar,
  titulo = 'Confirmar exclusão'
}: ConfirmacaoDeletarProps) {
  // Ao renderizar, mostra o SweetAlert2 imediatamente
  React.useEffect(() => {
    (async () => {
      const confirmado = await confirmar(titulo, mensagem, 'warning');
      if (confirmado) {
        onConfirmar();
      } else {
        onCancelar();
      }
    })();
  }, [titulo, mensagem, onConfirmar, onCancelar]);

  // O componente não renderiza nada visualmente
  return null;
} 