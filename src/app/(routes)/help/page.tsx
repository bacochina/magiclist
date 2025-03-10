'use client';

import { useState } from 'react';

type MenuItem = {
  id: string;
  title: string;
};

type MenuGroup = {
  id: string;
  title: string;
  items: MenuItem[];
};

type SectionContent = {
  [key: string]: JSX.Element;
};

export default function HelpPage() {
  const [activeSection, setActiveSection] = useState('intro');
  const [expandedGroups, setExpandedGroups] = useState(['eventos', 'bandas', 'organizacao', 'musico', 'ajuda']);

  // Estrutura simplificada de menus
  const menuGroups: MenuGroup[] = [
    {
      id: 'eventos',
      title: 'Eventos',
      items: [
        { id: 'eventos', title: 'Eventos' }
      ]
    },
    {
      id: 'bandas',
      title: 'Bandas',
      items: [
        { id: 'bands', title: 'Bandas' },
        { id: 'integrantes', title: 'Integrantes' }
      ]
    },
    {
      id: 'organizacao',
      title: 'Organização',
      items: [
        { id: 'songs', title: 'Músicas' },
        { id: 'blocks', title: 'Blocos' },
        { id: 'repertoires', title: 'Repertórios' },
        { id: 'layouts', title: 'Layouts' }
      ]
    },
    {
      id: 'musico',
      title: 'Músico',
      items: [
        { id: 'estudos', title: 'Estudos' },
        { id: 'pedalboards', title: 'Pedaleiras' }
      ]
    },
    {
      id: 'ajuda',
      title: 'Ajuda',
      items: [
        { id: 'intro', title: 'Introdução' }
      ]
    }
  ];

  // Conteúdo das seções
  const sectionContent: SectionContent = {
    'intro': (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4">Bem-vindo ao MagicList!</h2>
        <p className="text-gray-600">
          O MagicList é uma plataforma completa para gerenciamento de sua carreira musical. 
          Este guia irá ajudá-lo a entender todas as funcionalidades disponíveis no sistema.
        </p>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">Principais Recursos:</h3>
          <ul className="list-disc pl-5 space-y-2 text-blue-700">
            <li>Gerenciamento de eventos e shows</li>
            <li>Organização de bandas e integrantes</li>
            <li>Cadastro de músicas e repertórios</li>
            <li>Sistema Kanban para estudos musicais</li>
            <li>Configurações de pedaleiras</li>
          </ul>
        </div>
      </div>
    ),
    'eventos': (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4">Gerenciamento de Eventos</h2>
        <p className="text-gray-600 mb-4">
          O módulo de eventos permite organizar todos os seus compromissos musicais de forma eficiente.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Tipos de Eventos</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Shows e apresentações</li>
              <li>Ensaios e passagens de som</li>
              <li>Reuniões com a banda</li>
              <li>Gravações em estúdio</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Informações do Evento</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Data e horário</li>
              <li>Local e endereço</li>
              <li>Tipo do evento</li>
              <li>Banda relacionada</li>
              <li>Repertório escolhido</li>
              <li>Status do pagamento</li>
              <li>Observações gerais</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    'bands': (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4">Gerenciamento de Bandas</h2>
        <p className="text-gray-600 mb-4">
          Organize todos os seus projetos musicais em um só lugar.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Informações da Banda</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Nome e logotipo</li>
              <li>Gênero musical</li>
              <li>Data de formação</li>
              <li>Redes sociais</li>
              <li>Contatos principais</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Recursos</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Lista de integrantes</li>
              <li>Repertórios da banda</li>
              <li>Agenda de eventos</li>
              <li>Histórico de shows</li>
              <li>Controle financeiro</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    'integrantes': (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4">Gestão de Integrantes</h2>
        <p className="text-gray-600 mb-4">
          Mantenha um cadastro completo de todos os músicos e profissionais.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Dados Pessoais</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Nome completo</li>
              <li>Nome artístico</li>
              <li>Contatos</li>
              <li>Redes sociais</li>
              <li>Documentos</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Informações Profissionais</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Instrumentos</li>
              <li>Experiência</li>
              <li>Equipamentos</li>
              <li>Disponibilidade</li>
              <li>Cachê base</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    'songs': (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4">Gerenciamento de Músicas</h2>
        <p className="text-gray-600 mb-4">
          Cadastre e organize seu repertório musical com todos os detalhes necessários.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Informações da Música</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Título</li>
              <li>Artista original</li>
              <li>Tom e BPM</li>
              <li>Duração</li>
              <li>Gênero</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Recursos Adicionais</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Cifra/Partitura</li>
              <li>Letra</li>
              <li>Áudios de referência</li>
              <li>Observações</li>
              <li>Links externos</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    'blocks': (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4">Organização em Blocos</h2>
        <p className="text-gray-600 mb-4">
          Agrupe suas músicas em blocos temáticos para facilitar a montagem de repertórios.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Tipos de Blocos</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Por gênero musical</li>
              <li>Por momento do show</li>
              <li>Por energia/intensidade</li>
              <li>Por década/época</li>
              <li>Por artista/banda</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Configurações</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Nome do bloco</li>
              <li>Descrição</li>
              <li>Ordem das músicas</li>
              <li>Duração total</li>
              <li>Observações</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    'repertoires': (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4">Montagem de Repertórios</h2>
        <p className="text-gray-600 mb-4">
          Monte repertórios completos combinando blocos e músicas individuais.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Estrutura</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Blocos musicais</li>
              <li>Músicas avulsas</li>
              <li>Intervalos</li>
              <li>Ordem de execução</li>
              <li>Duração total</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Recursos</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Exportação em PDF</li>
              <li>Compartilhamento</li>
              <li>Histórico de uso</li>
              <li>Músicas alternativas</li>
              <li>Observações técnicas</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    'layouts': (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4">Personalização de Layouts</h2>
        <p className="text-gray-600 mb-4">
          Crie layouts personalizados para seus repertórios e setlists.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Elementos Disponíveis</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Cabeçalho personalizado</li>
              <li>Informações da banda</li>
              <li>Blocos de músicas</li>
              <li>Observações</li>
              <li>Numeração de páginas</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Opções de Formatação</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Tamanho do papel</li>
              <li>Orientação da página</li>
              <li>Fontes e cores</li>
              <li>Espaçamentos</li>
              <li>Elementos visuais</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    'estudos': (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4">Sistema Kanban de Estudos</h2>
        <p className="text-gray-600 mb-4">
          Organize seus estudos musicais usando um sistema Kanban visual e eficiente.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Estrutura do Kanban</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Coluna "Estudar"</li>
              <li>Coluna "Em Andamento"</li>
              <li>Coluna "Concluído"</li>
              <li>Drag and Drop</li>
              <li>Contadores por coluna</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Cartões de Estudo</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Título e descrição</li>
              <li>Data limite</li>
              <li>Prioridade</li>
              <li>Código de cores</li>
              <li>Transparência personalizada</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    'pedalboards': (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4">Configurações de Pedaleiras</h2>
        <p className="text-gray-600 mb-4">
          Gerencie as configurações de suas pedaleiras para cada música.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Cadastro de Equipamentos</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Marca e modelo</li>
              <li>Número de série</li>
              <li>Firmware</li>
              <li>Bancos disponíveis</li>
              <li>Conexões MIDI</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Presets</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Nome do preset</li>
              <li>Música associada</li>
              <li>Cadeia de efeitos</li>
              <li>Parâmetros</li>
              <li>Backup e versionamento</li>
            </ul>
          </div>
        </div>
      </div>
    )
  };

  // Função para alternar grupos
  const toggleGroup = (groupId: string) => {
    if (expandedGroups.includes(groupId)) {
      setExpandedGroups(expandedGroups.filter(id => id !== groupId));
    } else {
      setExpandedGroups([...expandedGroups, groupId]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="grid grid-cols-12 divide-x divide-gray-200">
            {/* Menu */}
            <div className="col-span-3 p-6">
              <h2 className="text-lg font-semibold mb-4">Menu</h2>
              <nav className="space-y-2">
                {menuGroups.map(group => (
                  <div key={group.id} className="mb-2">
                    <button
                      onClick={() => toggleGroup(group.id)}
                      className={`w-full flex items-center justify-between px-4 py-2 text-left text-sm font-medium rounded-lg transition-colors ${
                        expandedGroups.includes(group.id)
                          ? 'bg-gray-100'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <span>{group.title}</span>
                      {group.items.length > 1 && (
                        <svg
                          className={`w-5 h-5 transform transition-transform ${
                            expandedGroups.includes(group.id) ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      )}
                    </button>
                    {expandedGroups.includes(group.id) && (
                      <div className="mt-1 pl-4 space-y-1 border-l-2 border-gray-100">
                        {group.items.map(item => (
                          <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
                              activeSection === item.id
                                ? 'bg-indigo-50 text-indigo-700 font-medium'
                                : 'hover:bg-gray-50 text-gray-600'
                            }`}
                          >
                            {item.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Conteúdo */}
            <div className="col-span-9 p-6">
              <div className="prose max-w-none">
                {sectionContent[activeSection]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 