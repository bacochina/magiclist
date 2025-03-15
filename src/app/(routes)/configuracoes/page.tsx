'use client';

import { useState, useEffect } from 'react';
import { 
  Palette, 
  Settings, 
  Type, 
  Layout, 
  Check, 
  RotateCcw, 
  Save,
  Sliders 
} from 'lucide-react';
import { useTheme } from '@/app/providers/ThemeProvider';
import { alertaSucesso } from '@/lib/sweetalert';

// Componente para card de estatísticas
const StatCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => (
  <div className="stat-card p-5">
    <div className="flex items-center space-x-3 mb-2">
      <div className="p-2 rounded-md bg-gray-700 text-purple-400">
        {icon}
      </div>
      <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
    </div>
    <div className="text-2xl font-bold text-white">{value}</div>
  </div>
);

// Componente para exibir amostra de cor
const ColorSwatch = ({ color, active, onClick }: { color: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-8 h-8 rounded-full transition-all duration-200 ${active ? 'ring-2 ring-white scale-110' : 'hover:scale-105'}`}
    style={{ backgroundColor: color }}
    aria-label={`Cor ${color}`}
  />
);

// Componente para exibir amostra de tema
const ThemeSwatch = ({ 
  name, 
  primary, 
  background, 
  text, 
  active, 
  onClick 
}: { 
  name: string, 
  primary: string, 
  background: string, 
  text: string, 
  active: boolean, 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center transition-all duration-200 ${active ? 'ring-2 ring-white scale-105 bg-gray-700/50 p-2 rounded-lg' : 'hover:bg-gray-800/30 p-2 rounded-lg'}`}
  >
    <div className="w-20 h-12 rounded-md overflow-hidden mb-2 border border-gray-700">
      <div className="h-full" style={{ backgroundColor: background }}>
        <div className="h-1/3 w-full" style={{ backgroundColor: primary }}></div>
        <div className="flex items-center justify-center h-2/3">
          <div className="w-1/2 h-3 rounded" style={{ backgroundColor: text }}></div>
        </div>
      </div>
    </div>
    <span className="text-xs text-gray-300">{name}</span>
    {active && <Check className="h-3 w-3 text-green-400 mt-1" />}
  </button>
);

// Componente para visualização de cor
const ColorPreview = ({ 
  primaryColor, 
  backgroundColor, 
  textColor,
  accentColor,
  darkShade
}: { 
  primaryColor: string, 
  backgroundColor: string, 
  textColor: string,
  accentColor: string,
  darkShade: string
}) => (
  <div
    className="p-4 rounded-lg border border-gray-700 mb-4"
    style={{ backgroundColor }}
  >
    <div 
      className="p-4 rounded-lg border border-gray-700" 
      style={{ backgroundColor: darkShade }}
    >
      <h4 className="font-bold mb-2" style={{ color: textColor }}>Pré-visualização</h4>
      <p className="text-sm mb-3" style={{ color: textColor }}>
        Este é um exemplo de como o conteúdo irá aparecer com as cores selecionadas.
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: accentColor }}>Link de exemplo</span>
        <button
          className="text-xs py-1 px-2 rounded"
          style={{ backgroundColor: primaryColor, color: textColor }}
        >
          Botão
        </button>
      </div>
    </div>
  </div>
);

export default function ConfiguracoesPage() {
  const { theme, updateTheme, resetTheme } = useTheme();
  
  // Estados para as configurações locais (para edição)
  const [primaryColor, setPrimaryColor] = useState(theme.primary);
  const [backgroundColor, setBackgroundColor] = useState(theme.background);
  const [textColor, setTextColor] = useState(theme.text);
  const [accentColor, setAccentColor] = useState(theme.accent);
  const [darkShade, setDarkShade] = useState(theme.dark);
  
  // Estado para indicar se houve mudanças não salvas
  const [hasChanges, setHasChanges] = useState(false);
  
  // Atualiza os estados locais quando o tema global muda
  useEffect(() => {
    setPrimaryColor(theme.primary);
    setBackgroundColor(theme.background);
    setTextColor(theme.text);
    setAccentColor(theme.accent);
    setDarkShade(theme.dark);
    setHasChanges(false);
  }, [theme]);
  
  // Verificar mudanças
  useEffect(() => {
    const isChanged = 
      primaryColor !== theme.primary ||
      backgroundColor !== theme.background ||
      textColor !== theme.text ||
      accentColor !== theme.accent ||
      darkShade !== theme.dark;
    
    setHasChanges(isChanged);
  }, [primaryColor, backgroundColor, textColor, accentColor, darkShade, theme]);
  
  // Opções de cores primárias (destaque)
  const primaryOptions = [
    { color: '#7C3AED', name: 'Roxo' }, // Roxo (padrão)
    { color: '#3B82F6', name: 'Azul' }, // Azul
    { color: '#EC4899', name: 'Rosa' }, // Rosa
    { color: '#10B981', name: 'Verde' }, // Verde
    { color: '#F59E0B', name: 'Âmbar' }, // Âmbar
    { color: '#EF4444', name: 'Vermelho' }, // Vermelho
    { color: '#6366F1', name: 'Índigo' }, // Índigo
    { color: '#06B6D4', name: 'Ciano' }  // Ciano
  ];
  
  // Opções de cores de fundo
  const backgroundOptions = [
    { color: '#111827', name: 'Preto Azulado' }, // Preto azulado (padrão)
    { color: '#0F172A', name: 'Azul Escuro' }, // Azul escuro
    { color: '#18181B', name: 'Zinc' }, // Zinc
    { color: '#1E1B4B', name: 'Índigo Escuro' }, // Índigo escuro
    { color: '#0C0A09', name: 'Preto' }, // Preto
    { color: '#0F172A', name: 'Slate' }, // Slate
    { color: '#1A1C2C', name: 'Tech' }, // Tech
    { color: '#1C1917', name: 'Stone' }  // Stone
  ];
  
  // Opções para cores de texto
  const textOptions = [
    { color: '#FFFFFF', name: 'Branco' }, // Branco (padrão)
    { color: '#F3F4F6', name: 'Cinza Claro' }, // Cinza claro
    { color: '#E5E7EB', name: 'Cinza' }, // Cinza
    { color: '#D1D5DB', name: 'Cinza Médio' }, // Cinza médio
    { color: '#FEF3C7', name: 'Âmbar Claro' }, // Âmbar claro
    { color: '#ECFDF5', name: 'Verde Claro' }, // Verde claro
    { color: '#EFF6FF', name: 'Azul Claro' }, // Azul claro
    { color: '#F5F3FF', name: 'Púrpura Claro' } // Púrpura claro
  ];
  
  // Temas predefinidos
  const presetThemes = [
    { 
      name: 'Padrão', 
      primary: '#7C3AED', 
      background: '#111827', 
      text: '#FFFFFF',
      accent: '#3B82F6',
      dark: '#1F2937'
    },
    { 
      name: 'Azul Tech', 
      primary: '#3B82F6', 
      background: '#0F172A', 
      text: '#F3F4F6',
      accent: '#38BDF8',
      dark: '#1E293B'
    },
    { 
      name: 'Verde Neon', 
      primary: '#10B981', 
      background: '#18181B', 
      text: '#ECFDF5',
      accent: '#34D399',
      dark: '#27272A'
    },
    { 
      name: 'Dark Rose', 
      primary: '#EC4899', 
      background: '#1C1917', 
      text: '#FFFFFF',
      accent: '#F472B6',
      dark: '#292524'
    },
    { 
      name: 'Amber Gold', 
      primary: '#F59E0B', 
      background: '#0C0A09', 
      text: '#FEF3C7',
      accent: '#FBBF24',
      dark: '#1C1917'
    },
    { 
      name: 'Tech Night', 
      primary: '#6366F1', 
      background: '#0F172A', 
      text: '#F3F4F6',
      accent: '#818CF8',
      dark: '#1E293B'
    }
  ];
  
  // Função para salvar as configurações
  const saveSettings = () => {
    console.log("Salvando configurações:", {
      primary: primaryColor,
      background: backgroundColor,
      text: textColor,
      accent: accentColor,
      dark: darkShade
    });
    
    updateTheme({
      primary: primaryColor,
      background: backgroundColor,
      text: textColor,
      accent: accentColor,
      dark: darkShade
    });
    
    alertaSucesso('Configurações salvas com sucesso!');
    setHasChanges(false);
  };
  
  // Aplicar um tema predefinido
  const applyTheme = (theme: any) => {
    setPrimaryColor(theme.primary);
    setBackgroundColor(theme.background);
    setTextColor(theme.text);
    setAccentColor(theme.accent);
    setDarkShade(theme.dark);
  };

  // Estatísticas para a página
  const totalColors = primaryOptions.length + backgroundOptions.length + textOptions.length;
  const totalThemes = presetThemes.length;
  const userSavedThemes = 1; // Para o futuro: contagem de temas salvos pelo usuário

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Configurações</h1>
          <p className="text-gray-400">Personalize a aparência do MagicList para sua preferência</p>
        </div>
        
        <div className="flex space-x-3 mt-4 md:mt-0">
          <button
            onClick={resetTheme}
            className="btn-secondary flex items-center space-x-2"
            title="Restaurar configurações padrão"
          >
            <RotateCcw size={16} />
            <span>Restaurar Padrão</span>
          </button>
          
          <button
            onClick={saveSettings}
            disabled={!hasChanges}
            className={`btn-primary flex items-center space-x-2 ${!hasChanges ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Salvar configurações"
          >
            <Save size={16} />
            <span>Salvar Alterações</span>
          </button>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total de Cores" 
          value={totalColors} 
          icon={<Palette size={20} />}
        />
        <StatCard 
          title="Temas Predefinidos" 
          value={totalThemes} 
          icon={<Layout size={20} />}
        />
        <StatCard 
          title="Temas Salvos" 
          value={userSavedThemes} 
          icon={<Settings size={20} />}
        />
      </div>

      {/* Conteúdo principal */}
      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Palette className="mr-2 h-5 w-5 text-purple-400" />
            Temas Predefinidos
          </h2>
          <p className="text-gray-400 mt-1">
            Escolha um dos temas predefinidos ou personalize suas próprias cores abaixo
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mt-6">
            {presetThemes.map((themePreset, index) => (
              <ThemeSwatch
                key={index}
                name={themePreset.name}
                primary={themePreset.primary}
                background={themePreset.background}
                text={themePreset.text}
                active={
                  themePreset.primary === primaryColor &&
                  themePreset.background === backgroundColor &&
                  themePreset.text === textColor
                }
                onClick={() => applyTheme(themePreset)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Visualização da combinação atual */}
      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Settings className="mr-2 h-5 w-5 text-purple-400" />
            Pré-visualização
          </h2>
          <p className="text-gray-400 mt-1">
            Veja como suas escolhas ficarão antes de salvar
          </p>
        </div>
        <div className="p-6">
          <ColorPreview 
            primaryColor={primaryColor}
            backgroundColor={backgroundColor}
            textColor={textColor}
            accentColor={accentColor}
            darkShade={darkShade}
          />
        </div>
      </div>

      {/* Área de personalização */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cor de destaque (primária) */}
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <div className="w-5 h-5 rounded mr-2" style={{ backgroundColor: primaryColor }}></div>
              Cor de Destaque
            </h2>
            <p className="text-gray-400 mt-1 text-sm">
              Esta cor é usada para botões, links e elementos de destaque
            </p>
          </div>
          
          <div className="p-6">
            <div className="flex flex-wrap gap-4">
              {primaryOptions.map((option, index) => (
                <ColorSwatch
                  key={index}
                  color={option.color}
                  active={option.color === primaryColor}
                  onClick={() => setPrimaryColor(option.color)}
                />
              ))}
            </div>
            
            <div className="mt-6">
              <label htmlFor="primaryColorPicker" className="block text-sm font-medium text-gray-400 mb-2">
                Personalizar Cor (Avançado)
              </label>
              <div className="flex items-center">
                <input
                  type="color"
                  id="primaryColorPicker"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-10 w-20 border-0 rounded-l-md"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="p-2 text-sm bg-gray-900 text-white border border-gray-700 rounded-r-md flex-1"
                />
              </div>
            </div>
            
            <div className="mt-6 p-4 rounded-lg bg-gray-700/50 border border-gray-600">
              <h3 className="text-white text-sm font-medium mb-3">Exemplo de Visualização</h3>
              <div className="flex flex-wrap gap-3">
                <button className="py-2 px-4 rounded-md text-white text-sm" style={{ backgroundColor: primaryColor }}>
                  Botão Primário
                </button>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                      style={{ backgroundColor: `${primaryColor}30`, color: primaryColor }}>
                  Badge
                </span>
                <div className="w-8 h-8 rounded-full flex items-center justify-center" 
                     style={{ backgroundColor: primaryColor }}>
                  <Check className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Cor de Fundo */}
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <div className="w-5 h-5 rounded mr-2" style={{ backgroundColor: backgroundColor }}></div>
              Cor de Fundo
            </h2>
            <p className="text-gray-400 mt-1 text-sm">
              Esta cor é usada para o fundo da aplicação
            </p>
          </div>
          
          <div className="p-6">
            <div className="flex flex-wrap gap-4">
              {backgroundOptions.map((option, index) => (
                <ColorSwatch
                  key={index}
                  color={option.color}
                  active={option.color === backgroundColor}
                  onClick={() => setBackgroundColor(option.color)}
                />
              ))}
            </div>
            
            <div className="mt-6">
              <label htmlFor="backgroundColorPicker" className="block text-sm font-medium text-gray-400 mb-2">
                Personalizar Cor (Avançado)
              </label>
              <div className="flex items-center">
                <input
                  type="color"
                  id="backgroundColorPicker"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="h-10 w-20 border-0 rounded-l-md"
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="p-2 text-sm bg-gray-900 text-white border border-gray-700 rounded-r-md flex-1"
                />
              </div>
            </div>
            
            <div className="mt-6 p-4 rounded-lg bg-gray-700/50 border border-gray-600">
              <h3 className="text-white text-sm font-medium mb-3">Exemplo de Visualização</h3>
              <div className="p-4 rounded-lg" style={{ backgroundColor }}>
                <div className="w-full h-12 rounded-lg" style={{ backgroundColor: darkShade, borderColor: `${primaryColor}80` }}>
                  <div className="h-full rounded-lg flex items-center justify-center">
                    <span className="text-xs" style={{ color: textColor }}>Exemplo de conteúdo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Cor do Texto */}
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <Type className="mr-2 h-5 w-5" style={{ color: textColor }} />
              Cor do Texto
            </h2>
            <p className="text-gray-400 mt-1 text-sm">
              Esta cor é usada para textos em toda a aplicação
            </p>
          </div>
          
          <div className="p-6">
            <div className="flex flex-wrap gap-4">
              {textOptions.map((option, index) => (
                <ColorSwatch
                  key={index}
                  color={option.color}
                  active={option.color === textColor}
                  onClick={() => setTextColor(option.color)}
                />
              ))}
            </div>
            
            <div className="mt-6">
              <label htmlFor="textColorPicker" className="block text-sm font-medium text-gray-400 mb-2">
                Personalizar Cor (Avançado)
              </label>
              <div className="flex items-center">
                <input
                  type="color"
                  id="textColorPicker"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="h-10 w-20 border-0 rounded-l-md"
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="p-2 text-sm bg-gray-900 text-white border border-gray-700 rounded-r-md flex-1"
                />
              </div>
            </div>
            
            <div className="mt-6 p-4 rounded-lg bg-gray-700/50 border border-gray-600">
              <h3 className="text-white text-sm font-medium mb-3">Exemplo de Visualização</h3>
              <div className="space-y-2">
                <p className="text-base" style={{ color: textColor }}>
                  Texto normal para conteúdo geral
                </p>
                <p className="text-sm" style={{ color: textColor }}>
                  Texto menor para informações secundárias
                </p>
                <h4 className="text-lg font-semibold" style={{ color: textColor }}>
                  Texto em destaque para títulos
                </h4>
              </div>
            </div>
          </div>
        </div>
        
        {/* Outras opções de personalização */}
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <Sliders className="mr-2 h-5 w-5 text-gray-400" />
              Outras Personalizações
            </h2>
            <p className="text-gray-400 mt-1 text-sm">
              Opções adicionais para personalizar a aparência do sistema
            </p>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Configurações de Cor para Cards */}
            <div>
              <h3 className="text-white text-sm font-medium mb-3">Cor dos Cards e Painéis</h3>
              <div className="flex flex-wrap gap-3 mb-4">
                <ColorSwatch color="#1F2937" active={darkShade === "#1F2937"} onClick={() => setDarkShade("#1F2937")} />
                <ColorSwatch color="#111827" active={darkShade === "#111827"} onClick={() => setDarkShade("#111827")} />
                <ColorSwatch color="#1E293B" active={darkShade === "#1E293B"} onClick={() => setDarkShade("#1E293B")} />
                <ColorSwatch color="#27272A" active={darkShade === "#27272A"} onClick={() => setDarkShade("#27272A")} />
                <ColorSwatch color="#292524" active={darkShade === "#292524"} onClick={() => setDarkShade("#292524")} />
              </div>
              
              <div className="flex items-center">
                <input
                  type="color"
                  id="darkShadeColorPicker"
                  value={darkShade}
                  onChange={(e) => setDarkShade(e.target.value)}
                  className="h-10 w-20 border-0 rounded-l-md"
                />
                <input
                  type="text"
                  value={darkShade}
                  onChange={(e) => setDarkShade(e.target.value)}
                  className="p-2 text-sm bg-gray-900 text-white border border-gray-700 rounded-r-md flex-1"
                />
              </div>
            </div>
            
            {/* Configurações de Cor para Links e Detalhes */}
            <div>
              <h3 className="text-white text-sm font-medium mb-3">Cor para Links e Detalhes</h3>
              <div className="flex flex-wrap gap-3 mb-4">
                <ColorSwatch color="#3B82F6" active={accentColor === "#3B82F6"} onClick={() => setAccentColor("#3B82F6")} />
                <ColorSwatch color="#38BDF8" active={accentColor === "#38BDF8"} onClick={() => setAccentColor("#38BDF8")} />
                <ColorSwatch color="#34D399" active={accentColor === "#34D399"} onClick={() => setAccentColor("#34D399")} />
                <ColorSwatch color="#F472B6" active={accentColor === "#F472B6"} onClick={() => setAccentColor("#F472B6")} />
                <ColorSwatch color="#FBBF24" active={accentColor === "#FBBF24"} onClick={() => setAccentColor("#FBBF24")} />
              </div>
              
              <div className="flex items-center">
                <input
                  type="color"
                  id="accentColorPicker"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-10 w-20 border-0 rounded-l-md"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="p-2 text-sm bg-gray-900 text-white border border-gray-700 rounded-r-md flex-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 