'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Interface para o tema
interface ThemeConfig {
  // Cores principais
  primary: string;       // Cor principal (botões, links, etc)
  background: string;    // Cor de fundo da aplicação
  text: string;          // Cor principal do texto
  accent: string;        // Cor secundária para detalhes
  dark: string;          // Cor escura para cards e containers
  
  // Cores para status
  statusSuccess: string; // Verde para sucesso, confirmado, ativo
  statusWarning: string; // Amarelo para avisos, pendentes
  statusDanger: string;  // Vermelho para erros, cancelado, excluído
  statusInfo: string;    // Azul para informações, agendado
  
  // Cores para gráficos e visualizações
  chart1: string;        // Cor primária para gráficos
  chart2: string;        // Cor secundária para gráficos
  chart3: string;        // Cor terciária para gráficos
  chart4: string;        // Cor quaternária para gráficos
  
  // Cores para estados específicos
  semItem: string;       // Para "Sem banda", "Sem bloco", etc
  destacar: string;      // Para destacar itens importantes
}

// Valores padrão do tema
const defaultTheme: ThemeConfig = {
  // Cores principais
  primary: '#7C3AED',    // Roxo padrão
  background: '#111827', // Cinza escuro padrão
  text: '#FFFFFF',       // Branco padrão
  accent: '#3B82F6',     // Azul padrão
  dark: '#1F2937',       // Cinza escuro para cards
  
  // Cores para status
  statusSuccess: '#10B981', // Verde
  statusWarning: '#F59E0B', // Amarelo
  statusDanger: '#EF4444',  // Vermelho
  statusInfo: '#3B82F6',    // Azul
  
  // Cores para gráficos e visualizações
  chart1: '#8B5CF6',     // Roxo mais claro
  chart2: '#F472B6',     // Rosa
  chart3: '#2DD4BF',     // Turquesa
  chart4: '#F59E0B',     // Âmbar
  
  // Cores para estados específicos
  semItem: '#6B7280',    // Cinza médio
  destacar: '#F472B6',   // Rosa para destaque
};

// Contexto do tema
interface ThemeContextType {
  theme: ThemeConfig;
  updateTheme: (newTheme: Partial<ThemeConfig>) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Hook para usar o tema
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
}

// Funções de utilidade para cores
const convertHexToRGB = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

const lightenColor = (hex: string, amount: number) => {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + amount);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + amount);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const darkenColor = (hex: string, amount: number) => {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - amount);
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - amount);
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// ID único para o elemento style da scrollbar
const THEME_STYLE_ID = 'theme-custom-style';

// Provedor de Tema
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carrega o tema salvo ao inicializar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem('userTheme');
        if (savedTheme) {
          setTheme({
            ...defaultTheme,
            ...JSON.parse(savedTheme)
          });
        }
      } catch (e) {
        console.error('Erro ao carregar tema:', e);
      } finally {
        setIsLoaded(true);
      }
    }
  }, []);

  // Aplica as variáveis CSS ao mudar o tema
  useEffect(() => {
    if (!isLoaded) return;
    
    // Aplicando estilos diretos nos elementos HTML usando variáveis CSS
    const root = document.documentElement;
    
    // Atualizar a cor primária
    root.style.setProperty('--primary', convertHexToRGB(theme.primary));
    root.style.setProperty('--primary-light', convertHexToRGB(lightenColor(theme.primary, 30)));
    
    // Atualizar cores de fundo
    root.style.setProperty('--background-start-rgb', convertHexToRGB(theme.background));
    root.style.setProperty('--background-end-rgb', convertHexToRGB(darkenColor(theme.background, 10)));
    
    // Atualizar cor do texto
    root.style.setProperty('--foreground-rgb', convertHexToRGB(theme.text));
    
    // Atualizar cores de card
    root.style.setProperty('--card-bg', convertHexToRGB(theme.dark));
    root.style.setProperty('--card-border', convertHexToRGB(lightenColor(theme.dark, 20)));
    
    // Atualizar cores de status
    root.style.setProperty('--success', convertHexToRGB(theme.statusSuccess));
    root.style.setProperty('--warning', convertHexToRGB(theme.statusWarning));
    root.style.setProperty('--danger', convertHexToRGB(theme.statusDanger));
    root.style.setProperty('--info', convertHexToRGB(theme.accent));

    // Atualiza os estilos personalizados
    let styleElement = document.getElementById(THEME_STYLE_ID) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = THEME_STYLE_ID;
      document.head.appendChild(styleElement);
    }
    
    styleElement.innerHTML = `
      /* Scrollbar personalizada */
      ::-webkit-scrollbar-thumb {
        background: rgba(${convertHexToRGB(theme.primary)}, 0.5) !important;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(${convertHexToRGB(theme.primary)}, 0.7) !important;
      }
      
      /* Botões e elementos interativos */
      .btn-primary {
        background-color: rgb(${convertHexToRGB(theme.primary)}) !important;
      }
      .btn-primary:hover {
        background-color: rgb(${convertHexToRGB(darkenColor(theme.primary, 20))}) !important;
      }
      
      .btn-success {
        background-color: rgb(${convertHexToRGB(theme.statusSuccess)}) !important;
      }
      .btn-success:hover {
        background-color: rgb(${convertHexToRGB(darkenColor(theme.statusSuccess, 20))}) !important;
      }
      
      .btn-danger {
        background-color: rgb(${convertHexToRGB(theme.statusDanger)}) !important;
      }
      .btn-danger:hover {
        background-color: rgb(${convertHexToRGB(darkenColor(theme.statusDanger, 20))}) !important;
      }
      
      .btn-warning {
        background-color: rgb(${convertHexToRGB(theme.statusWarning)}) !important;
      }
      .btn-warning:hover {
        background-color: rgb(${convertHexToRGB(darkenColor(theme.statusWarning, 20))}) !important;
      }
      
      /* Classes de texto de cor */
      .text-purple-400 {
        color: rgb(${convertHexToRGB(theme.primary)}) !important;
      }
      
      .text-red-500, .text-red-400, .text-red-300 {
        color: rgb(${convertHexToRGB(theme.statusDanger)}) !important;
      }
      
      .text-green-500, .text-green-400, .text-green-300 {
        color: rgb(${convertHexToRGB(theme.statusSuccess)}) !important;
      }
      
      .text-yellow-500, .text-yellow-400, .text-yellow-300, .text-amber-400, .text-amber-300 {
        color: rgb(${convertHexToRGB(theme.statusWarning)}) !important;
      }
      
      .text-blue-500, .text-blue-400, .text-blue-300 {
        color: rgb(${convertHexToRGB(theme.statusInfo)}) !important;
      }
      
      .text-indigo-200, .text-indigo-300, .text-indigo-400 {
        color: rgb(${convertHexToRGB(theme.accent)}) !important;
      }
      
      /* Classes de fundo de cor */
      .bg-purple-400, .bg-purple-500, .bg-purple-600, .bg-purple-700 {
        background-color: rgb(${convertHexToRGB(theme.primary)}) !important;
      }
      
      .bg-purple-800 {
        background-color: rgb(${convertHexToRGB(darkenColor(theme.primary, 20))}) !important;
      }
      
      .bg-red-500, .bg-red-600 {
        background-color: rgb(${convertHexToRGB(theme.statusDanger)}) !important;
      }
      
      .bg-green-500, .bg-green-600 {
        background-color: rgb(${convertHexToRGB(theme.statusSuccess)}) !important;
      }
      
      .bg-yellow-500, .bg-yellow-600, .bg-amber-500, .bg-amber-600 {
        background-color: rgb(${convertHexToRGB(theme.statusWarning)}) !important;
      }
      
      .bg-blue-500, .bg-blue-600 {
        background-color: rgb(${convertHexToRGB(theme.statusInfo)}) !important;
      }
      
      /* Estados específicos */
      .text-gray-500 {
        color: rgb(${convertHexToRGB(theme.semItem)}) !important;
      }
      
      /* Badges e status */
      .badge-success, .bg-green-100 {
        background-color: rgba(${convertHexToRGB(theme.statusSuccess)}, 0.2) !important;
        color: rgb(${convertHexToRGB(theme.statusSuccess)}) !important;
      }
      
      .badge-warning, .bg-yellow-100 {
        background-color: rgba(${convertHexToRGB(theme.statusWarning)}, 0.2) !important;
        color: rgb(${convertHexToRGB(theme.statusWarning)}) !important;
      }
      
      .badge-danger, .bg-red-100 {
        background-color: rgba(${convertHexToRGB(theme.statusDanger)}, 0.2) !important;
        color: rgb(${convertHexToRGB(theme.statusDanger)}) !important;
      }
      
      .badge-info, .bg-blue-100 {
        background-color: rgba(${convertHexToRGB(theme.statusInfo)}, 0.2) !important;
        color: rgb(${convertHexToRGB(theme.statusInfo)}) !important;
      }
      
      /* Tabela KanBan e Cards de Status */
      .text-gray-700 {
        color: rgb(${convertHexToRGB(theme.text)}) !important;
      }
      
      .text-blue-700 {
        color: rgb(${convertHexToRGB(theme.statusInfo)}) !important;
      }
      
      .text-green-700 {
        color: rgb(${convertHexToRGB(theme.statusSuccess)}) !important;
      }
      
      /* Para gráficos na dashboard */
      [data-chart-color="1"] {
        background-color: rgb(${convertHexToRGB(theme.chart1)}) !important;
      }
      [data-chart-color="2"] {
        background-color: rgb(${convertHexToRGB(theme.chart2)}) !important;
      }
      [data-chart-color="3"] {
        background-color: rgb(${convertHexToRGB(theme.chart3)}) !important;
      }
      [data-chart-color="4"] {
        background-color: rgb(${convertHexToRGB(theme.chart4)}) !important;
      }
      
      /* Alertas e confirmações */
      .swal2-confirm {
        background-color: rgb(${convertHexToRGB(theme.primary)}) !important;
      }
      .swal2-cancel {
        background-color: rgb(${convertHexToRGB(theme.statusDanger)}) !important;
      }
      
      /* Foco em elementos */
      .focus\\:ring-purple-500:focus {
        --tw-ring-color: rgb(${convertHexToRGB(theme.primary)}) !important;
      }
      
      /* Cabeçalhos de cards com gradientes */
      .bg-gradient-to-r.from-indigo-800.to-indigo-900 {
        background-image: linear-gradient(to right, rgb(${convertHexToRGB(darkenColor(theme.primary, 30))}) 0%, rgb(${convertHexToRGB(darkenColor(theme.primary, 40))}) 100%) !important;
        border-color: rgb(${convertHexToRGB(darkenColor(theme.primary, 20))}) !important;
      }
      
      .bg-purple-800\\/70, .bg-purple-900.bg-opacity-40 {
        background-color: rgba(${convertHexToRGB(theme.primary)}, 0.5) !important;
        color: rgb(${convertHexToRGB(lightenColor(theme.primary, 80))}) !important;
      }
      
      .text-purple-300, .text-purple-100 {
        color: rgb(${convertHexToRGB(lightenColor(theme.primary, 60))}) !important;
      }
      
      .hover\\:border-indigo-500\\/50:hover {
        border-color: rgba(${convertHexToRGB(theme.primary)}, 0.5) !important;
      }
      
      /* Círculos numerados e elementos visuais dos blocos */
      .flex.items-center.justify-center.w-6.h-6.bg-indigo-900\\/60.rounded-full.border.border-indigo-700,
      div[class*="rounded-full border"] > span[class*="text-sm font-semibold"],
      div[class*="rounded-full"] > span[class*="text-sm"] {
        background-color: rgba(${convertHexToRGB(darkenColor(theme.primary, 40))}, 0.8) !important;
        border-color: ${darkenColor(theme.primary, 30)} !important;
      }
      
      .text-sm.font-semibold.text-indigo-200,
      div[class*="rounded-full"] > span[class*="text-sm"] {
        color: rgb(${convertHexToRGB(lightenColor(theme.primary, 60))}) !important;
      }
      
      /* Botões de ação arredondados */
      .inline-flex.items-center.justify-center.w-8.h-8.rounded-full, 
      button[class*="rounded-full"].bg-gray-700.text-blue-300 {
        color: rgb(${convertHexToRGB(lightenColor(theme.primary, 40))}) !important;
      }
      
      .hover\\:bg-blue-800\\/30:hover {
        background-color: rgba(${convertHexToRGB(theme.primary)}, 0.3) !important;
      }
      
      /* Textos azuis gerais */
      .hover\\:text-blue-400:hover, .text-blue-400, .text-blue-600 {
        color: rgb(${convertHexToRGB(theme.primary)}) !important;
      }
      
      /* Badges "Desconhecida" */
      .inline-flex.items-center.px-2.py-0\\.5.rounded-full {
        background-color: rgba(${convertHexToRGB(theme.primary)}, 0.5) !important;
        color: rgb(${convertHexToRGB(lightenColor(theme.primary, 80))}) !important;
      }
      
      .ring-blue-500, .focus\\:ring-blue-500, .focus\\:border-blue-500 {
        --tw-ring-color: rgb(${convertHexToRGB(theme.primary)}) !important;
        border-color: rgb(${convertHexToRGB(theme.primary)}) !important;
      }
      
      .border-blue-500, .border-blue-500\\/40 {
        border-color: rgba(${convertHexToRGB(theme.primary)}, 0.4) !important;
      }
      
      .bg-gradient-to-br.from-blue-900\\/50.to-cyan-900\\/50 {
        background-image: linear-gradient(to bottom right, 
          rgba(${convertHexToRGB(darkenColor(theme.primary, 30))}, 0.5),
          rgba(${convertHexToRGB(darkenColor(theme.primary, 20))}, 0.5)
        ) !important;
      }
      
      .shadow-blue-900\\/20 {
        --tw-shadow-color: rgba(${convertHexToRGB(theme.primary)}, 0.2) !important;
      }
      
      /* Textos em formulários */
      .text-blue-400, h6[class*="font-semibold text-blue-400"] {
        color: rgb(${convertHexToRGB(theme.primary)}) !important;
      }
      
      .bg-gradient-to-b.from-gray-800.to-gray-850 {
        background-image: linear-gradient(to bottom, rgb(${convertHexToRGB(theme.dark)}), rgb(${convertHexToRGB(darkenColor(theme.dark, 10))})) !important;
      }
      
      .inline-block.w-1\\.5.h-1\\.5.rounded-full.bg-indigo-500 {
        background-color: rgb(${convertHexToRGB(theme.primary)}) !important;
      }
      
      .hover\\:bg-indigo-700\\/50:hover {
        background-color: rgba(${convertHexToRGB(theme.primary)}, 0.5) !important;
      }
      
      /* Aplicar tema ao corpo da página */
      body {
        color: rgb(${convertHexToRGB(theme.text)}) !important;
        background: linear-gradient(
          135deg,
          rgb(${convertHexToRGB(theme.background)}),
          rgb(${convertHexToRGB(darkenColor(theme.background, 10))})
        ) !important;
      }
      
      /* Aplicar tema aos cards */
      .card, .dashboard-card, .stat-card, .chart-container, .modal-content {
        background-color: rgb(${convertHexToRGB(theme.dark)}) !important;
        border-color: rgb(${convertHexToRGB(lightenColor(theme.dark, 20))}) !important;
      }
      
      /* Aplicar tema às tabelas */
      .table {
        background-color: rgb(${convertHexToRGB(theme.dark)}) !important;
        border-color: rgb(${convertHexToRGB(lightenColor(theme.dark, 20))}) !important;
      }
      
      .table th {
        background-color: rgb(${convertHexToRGB(darkenColor(theme.dark, 10))}) !important;
        border-color: rgb(${convertHexToRGB(lightenColor(theme.dark, 20))}) !important;
      }
      
      .table td {
        border-color: rgb(${convertHexToRGB(lightenColor(theme.dark, 20))}) !important;
      }

      /* Botões primários com fundo azul e roxo */
      .btn-primary, 
      a.btn-primary, 
      button.btn-primary,
      .bg-indigo-600, 
      .bg-purple-600, 
      .bg-blue-600,
      [class*="bg-indigo-"][class*="hover:bg-indigo-"],
      [class*="bg-purple-"][class*="hover:bg-purple-"],
      [class*="bg-blue-"][class*="hover:bg-blue-"] {
        background-color: rgb(${convertHexToRGB(theme.primary)}) !important;
        color: white !important;
      }
      
      /* Círculos numerados azuis específicos */
      [class*="rounded-full"].bg-blue-600,
      [class*="rounded-full"].bg-blue-500,
      [class*="rounded-full"].bg-blue-400,
      [class*="rounded-full"].bg-indigo-600,
      [class*="rounded-full"].bg-indigo-500,
      [class*="rounded-full"].bg-indigo-400,
      [class*="rounded-full"].bg-purple-600,
      [class*="rounded-full"].bg-purple-500,
      [class*="rounded-full"].bg-purple-400,
      [class*="flex items-center justify-center"][class*="rounded-full"],
      div[class*="rounded-full"][class*="bg-blue"],
      div[class*="rounded-full"][class*="bg-indigo"],
      div[class*="rounded-full"][class*="bg-purple"],
      div.flex.items-center.justify-center[class*="rounded-full"][class*="w-"] {
        background-color: rgb(${convertHexToRGB(theme.primary)}) !important;
        border-color: rgb(${convertHexToRGB(darkenColor(theme.primary, 15))}) !important;
        color: white !important;
      }

      .hover\\:bg-indigo-700:hover, 
      .hover\\:bg-purple-700:hover, 
      .hover\\:bg-blue-700:hover,
      .bg-indigo-700, 
      .bg-purple-700, 
      .bg-blue-700 {
        background-color: rgb(${convertHexToRGB(darkenColor(theme.primary, 15))}) !important;
      }

      /* Classes específicas para componentes */
      .bg-gradient-to-r.from-indigo-800.to-indigo-900,
      .bg-gradient-to-r.from-purple-800.to-purple-900,
      .bg-gradient-to-r.from-blue-800.to-blue-900 {
        background-image: linear-gradient(to right, 
          rgb(${convertHexToRGB(darkenColor(theme.primary, 30))}) 0%, 
          rgb(${convertHexToRGB(darkenColor(theme.primary, 40))}) 100%
        ) !important;
      }
    `;
    
    // Atualizar também o padrão no fundo da página
    const patternElement = document.querySelector('.absolute.inset-0.opacity-3.pointer-events-none') as HTMLElement;
    if (patternElement) {
      const svgFill = encodeURIComponent(theme.primary).replace(/#/g, '%23');
      const patternUrl = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${svgFill}' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;
      patternElement.style.backgroundImage = patternUrl;
    }
    
    console.log("Tema aplicado com sucesso:", theme);
  }, [theme, isLoaded]);

  // Função para atualizar o tema
  const updateTheme = (newTheme: Partial<ThemeConfig>) => {
    console.log("Atualizando tema com:", newTheme);
    const updatedTheme = { ...theme, ...newTheme };
    setTheme(updatedTheme);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('userTheme', JSON.stringify(updatedTheme));
    }
  };

  // Função para resetar o tema para o padrão
  const resetTheme = () => {
    console.log("Resetando tema para o padrão");
    setTheme(defaultTheme);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userTheme');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
} 