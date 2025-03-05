'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

export default function HelpPage() {
  const [activeSection, setActiveSection] = useState<string>('intro');

  const sections: Section[] = [
    {
      id: 'intro',
      title: 'Introdução',
      content: (
        <div className="space-y-4">
          <p>
            Bem-vindo ao MagicList! Este guia completo irá ajudá-lo a entender todas as funcionalidades
            disponíveis em nossa plataforma para gerenciamento de bandas, músicas e repertórios.
          </p>
          <p>
            Navegue pelo menu lateral para encontrar informações detalhadas sobre cada seção do sistema.
          </p>
        </div>
      ),
    },
    {
      id: 'bands',
      title: 'Bandas',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Cadastro de Bandas</h3>
          <div className="space-y-4">
            <p>
              Na seção de bandas, você pode gerenciar todas as suas bandas e projetos musicais.
              O formulário de cadastro inclui:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nome da banda</li>
              <li>Descrição</li>
              <li>Gênero musical</li>
              <li>Data de formação</li>
              <li>Membros da banda</li>
            </ul>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Dica:</h4>
              <p>
                Você pode adicionar múltiplos membros à banda, especificando seus instrumentos
                e funções dentro do grupo.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'songs',
      title: 'Músicas',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Gerenciamento de Músicas</h3>
          <div className="space-y-4">
            <p>
              O cadastro de músicas permite organizar todo o seu repertório musical.
              Para cada música, você pode registrar:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nome da música</li>
              <li>Artista original</li>
              <li>Tom</li>
              <li>Observações</li>
            </ul>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Recursos disponíveis:</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Organização por blocos temáticos</li>
                <li>Inclusão em repertórios</li>
                <li>Notas específicas por apresentação</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'blocks',
      title: 'Blocos',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Organização em Blocos</h3>
          <div className="space-y-4">
            <p>
              Blocos são conjuntos de músicas agrupadas por tema, estilo ou qualquer outro critério.
              Com os blocos, você pode:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Criar grupos temáticos de músicas</li>
              <li>Organizar músicas por momento do show</li>
              <li>Definir a ordem de execução</li>
              <li>Adicionar notas e observações específicas</li>
            </ul>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Exemplo de uso:</h4>
              <p>
                Crie blocos como "Abertura", "Momento Dançante", "Românticas", "Encerramento"
                para organizar melhor seu repertório durante as apresentações.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'setlists',
      title: 'Repertórios',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Criação de Repertórios</h3>
          <div className="space-y-4">
            <p>
              Repertórios são coleções organizadas de músicas e blocos para um show ou evento específico.
              Recursos disponíveis:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Organização de músicas em ordem de apresentação</li>
              <li>Inclusão de blocos pré-definidos</li>
              <li>Tempo total estimado</li>
              <li>Notas específicas para cada apresentação</li>
              <li>Exportação em PDF</li>
            </ul>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Dica profissional:</h4>
              <p>
                Mantenha alguns repertórios alternativos preparados para diferentes tipos de público
                e duração de evento.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'layouts',
      title: 'Layouts',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Gerador de Layouts</h3>
          <div className="space-y-4">
            <p>
              O gerador de layouts permite criar documentos personalizados para suas músicas e repertórios.
              Funcionalidades principais:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Elementos arrastaveis para montagem do layout</li>
              <li>Formatação de texto avançada</li>
              <li>Opções de tamanho de papel (A4, Carta, Ofício)</li>
              <li>Orientação retrato ou paisagem</li>
              <li>Pré-visualização em tempo real</li>
            </ul>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h4 className="font-medium">Elementos disponíveis:</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Cabeçalho</h5>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Nome da Banda</li>
                    <li>Título do Show</li>
                    <li>Data</li>
                    <li>Página</li>
                    <li>Texto do Título</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Blocos</h5>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Nome do Bloco</li>
                    <li>Texto do Bloco</li>
                  </ul>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Dicas</h5>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Dica</li>
                    <li>Texto da Dica</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Detalhes</h5>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Número</li>
                    <li>Nome da Música</li>
                    <li>Tom</li>
                    <li>Texto dos Detalhes</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Formatação de texto:</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fonte e tamanho personalizáveis</li>
                <li>Negrito, itálico e sublinhado</li>
                <li>Cores de texto e fundo</li>
                <li>Bordas personalizáveis</li>
                <li>Alinhamento de texto</li>
                <li>Copiar e colar formatação</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'pedalboards',
      title: 'Pedaleiras',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Gerenciamento de Pedaleiras</h3>
          <div className="space-y-4">
            <p>
              Organize suas configurações de pedaleira para cada música ou momento do show.
              Recursos disponíveis:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Cadastro de pedaleiras e equipamentos</li>
              <li>Presets por música</li>
              <li>Configurações detalhadas de efeitos</li>
              <li>Organização por patches</li>
            </ul>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Dica:</h4>
              <p>
                Mantenha suas configurações de pedaleira sincronizadas com o repertório
                para facilitar as trocas durante o show.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="grid grid-cols-12 divide-x divide-gray-200">
            {/* Índice */}
            <div className="col-span-3 p-6">
              <h2 className="text-lg font-semibold mb-4">Índice</h2>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-indigo-50 text-indigo-700 font-medium'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>

            {/* Conteúdo */}
            <div className="col-span-9 p-6">
              <div className="prose max-w-none">
                {sections.find((s) => s.id === activeSection)?.content}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 