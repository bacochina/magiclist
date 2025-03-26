import Swal from 'sweetalert2';

// Tema personalizado para o SweetAlert2
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

// Utilitário para alertas de sucesso
export const alertaSucesso = (mensagem: string) => {
  Toast.fire({
    icon: 'success',
    title: mensagem,
  });
};

// Utilitário para alertas de erro
export const alertaErro = (mensagem: string) => {
  Toast.fire({
    icon: 'error',
    title: mensagem,
  });
};

// Utilitário para alertas informativos
export const alertaInfo = (mensagem: string) => {
  Toast.fire({
    icon: 'info',
    title: mensagem,
  });
};

// Utilitário para alertas de aviso
export const alertaAviso = (mensagem: string) => {
  Toast.fire({
    icon: 'warning',
    title: mensagem,
  });
};

// Utilitário para confirmações
export const confirmar = async (
  titulo: string,
  texto: string,
  icone: 'warning' | 'error' | 'success' | 'info' | 'question' = 'question'
): Promise<boolean> => {
  const resultado = await Swal.fire({
    title: titulo,
    text: texto,
    icon: icone,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar'
  });

  return resultado.isConfirmed;
};

// Alerta modal padrão
export const alerta = (
  titulo: string,
  texto?: string,
  icone: 'warning' | 'error' | 'success' | 'info' | 'question' = 'info'
) => {
  Swal.fire({
    title: titulo,
    text: texto,
    icon: icone,
    confirmButtonText: 'OK'
  });
};

// Alerta com suporte a HTML
export const alertaHTML = (
  titulo: string,
  html: string,
  icone: 'warning' | 'error' | 'success' | 'info' | 'question' = 'info'
) => {
  Swal.fire({
    title: titulo,
    html,
    icon: icone,
    confirmButtonText: 'OK'
  });
};

// Input de texto
export const inputTexto = async (
  titulo: string,
  texto?: string,
  placeholder?: string,
  valorInicial?: string
): Promise<string | null> => {
  const resultado = await Swal.fire({
    title: titulo,
    text: texto,
    input: 'text',
    inputPlaceholder: placeholder,
    inputValue: valorInicial || '',
    showCancelButton: true,
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
    inputValidator: (valor) => {
      if (!valor) {
        return 'O campo não pode estar vazio!';
      }
      return null;
    }
  });

  return resultado.isConfirmed ? resultado.value : null;
};

// Personalizar tema do SweetAlert2
export const definirTema = (temaEscuro: boolean = false) => {
  Swal.update({
    background: temaEscuro ? '#333' : '#fff',
  });
};

// Alerta com temporizador
export const alertaComTempo = (
  titulo: string,
  texto: string,
  icone: 'warning' | 'error' | 'success' | 'info' | 'question' = 'info',
  tempoMs: number = 2000
) => {
  Swal.fire({
    title: titulo,
    text: texto,
    icon: icone,
    timer: tempoMs,
    timerProgressBar: true,
    showConfirmButton: false
  });
};

interface AlertaConfirmacaoOpcoes {
  titulo: string;
  texto?: string;
  icone?: 'warning' | 'error' | 'success' | 'info' | 'question';
  confirmButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
}

export const alertaConfirmacao = async (opcoes: AlertaConfirmacaoOpcoes) => {
  return await Swal.fire({
    title: opcoes.titulo,
    text: opcoes.texto,
    icon: opcoes.icone || 'warning',
    showCancelButton: opcoes.showCancelButton !== false,
    confirmButtonColor: opcoes.confirmButtonColor || '#3085d6',
    cancelButtonColor: opcoes.cancelButtonColor || '#d33',
    confirmButtonText: opcoes.confirmButtonText || 'Confirmar',
    cancelButtonText: opcoes.cancelButtonText || 'Cancelar',
    background: '#1f2937', // gray-800
    color: '#fff',
    showClass: {
      popup: 'animate__animated animate__fadeIn animate__faster'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOut animate__faster'
    }
  });
};

// Exportando SweetAlert para casos específicos
export default Swal; 