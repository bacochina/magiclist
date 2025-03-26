import { toast } from "sonner"

export async function confirmar(mensagem: string): Promise<boolean> {
  return new Promise((resolve) => {
    toast(mensagem, {
      action: {
        label: "Confirmar",
        onClick: () => resolve(true),
      },
      cancel: {
        label: "Cancelar",
        onClick: () => resolve(false),
      },
      onDismiss: () => resolve(false),
    })
  })
} 