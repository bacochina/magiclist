import { toast } from "sonner"

export function alertaSucesso(mensagem: string) {
  toast.success(mensagem)
}

export function alertaErro(mensagem: string) {
  toast.error(mensagem)
}

export function alertaInfo(mensagem: string) {
  toast.info(mensagem)
}

export function alertaAviso(mensagem: string) {
  toast.warning(mensagem)
} 