'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle, Book, Music, Users, Calendar } from 'lucide-react';

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

// Card de estatísticas para a página de ajuda
const HelpStatCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => (
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
        <h2 className="text-2xl font-bold mb-4 text-white">Bem-vindo ao MagicList!</h2>
        <p className="text-gray-300">
          O MagicList é uma plataforma completa para gerenciamento de sua carreira musical. 
          Este guia irá ajudá-lo a entender todas as funcionalidades disponíveis no sistema.
        </p>
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <h3 className="font-medium text-purple-400 mb-2">Principais Recursos:</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
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
        <h2 className="text-2xl font-bold mb-4 text-white">Gerenciamento de Eventos</h2>
        <p className="text-gray-300 mb-4">
          O módulo de eventos permite organizar todos os seus compromissos musicais de forma eficiente.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h3 className="font-medium text-purple-400 mb-3">Tipos de Eventos</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
              <li>Shows e apresentações</li>
              <li>Ensaios e passagens de som</li>
              <li>Reuniões com a banda</li>
              <li>Gravações em estúdio</li>
            </ul>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h3 className="font-medium text-purple-400 mb-3">Informações do Evento</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
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
        <h2 className="text-2xl font-bold mb-4 text-white">Gerenciamento de Bandas</h2>
        <p className="text-gray-300 mb-4">
          Organize todos os seus projetos musicais em um só lugar.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h3 className="font-medium text-purple-400 mb-3">Informações da Banda</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
              <li>Nome e logotipo</li>
              <li>Gênero musical</li>
              <li>Data de formação</li>
              <li>Redes sociais</li>
              <li>Contatos principais</li>
            </ul>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h3 className="font-medium text-purple-400 mb-3">Recursos</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
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
        <h2 className="text-2xl font-bold mb-4 text-white">Gestão de Integrantes</h2>
        <p className="text-gray-300 mb-4">
          Mantenha um cadastro completo de todos os músicos e profissionais.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h3 className="font-medium text-purple-400 mb-3">Dados Pessoais</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
              <li>Nome completo</li>
              <li>Nome artístico</li>
              <li>Contatos</li>
              <li>Redes sociais</li>
              <li>Documentos</li>
            </ul>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h3 className="font-medium text-purple-400 mb-3">Informações Profissionais</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
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
        <h2 className="text-2xl font-bold mb-4 text-white">Gerenciamento de Músicas</h2>
        <p className="text-gray-300 mb-4">
          Cadastre e organize seu repertório musical com todos os detalhes necessários.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h3 className="font-medium text-purple-400 mb-3">Informações da Música</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
              <li>Título</li>
              <li>Artista original</li>
              <li>Tom e BPM</li>
              <li>Duração</li>
              <li>Gênero</li>
            </ul>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h3 className="font-medium text-purple-400 mb-3">Recursos Adicionais</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
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
        <h2 className="text-2xl font-bold mb-4 text-white">Organização em Blocos</h2>
        <p className="text-gray-300 mb-4">
          Agrupe suas músicas em blocos temáticos para facilitar a montagem de repertórios.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h3 className="font-medium text-purple-400 mb-3">Tipos de Blocos</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
              <li>Por gênero musical</li>
              <li>Por momento do show</li>
              <li>Por energia/intensidade</li>
              <li>Por década/época</li>
              <li>Por artista/banda</li>
            </ul>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h3 className="font-medium text-purple-400 mb-3">Configurações</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
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
        <h2 className="text-2xl font-bold mb-4 text-white">Montagem de Repertórios</h2>
        <p className="text-gray-300 mb-4">
          Monte repertórios completos combinando blocos e músicas individuais.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h3 className="font-medium text-purple-400 mb-3">Estrutura</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
              <li>Blocos musicais</li>
              <li>Músicas avulsas</li>
              <li>Intervalos</li>
              <li>Ordem de execução</li>
              <li>Duração total</li>
            </ul>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h3 className="font-medium text-purple-400 mb-3">Recursos</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
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
        <h2 className="text-2xl font-bold mb-4 text-white">Personalização de Layouts</h2>
        <p className="text-gray-300 mb-4">
          Crie layouts personalizados para seus repertórios e setlists.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h3 className="font-medium text-purple-400 mb-3">Elementos Disponíveis</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
              <li>Cabeçalho personalizado</li>
              <li>Informações da banda</li>
              <li>Blocos de músicas</li>
              <li>Observações</li>
              <li>Numeração de páginas</li>
            </ul>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h3 className="font-medium text-purple-400 mb-3">Opções de Formatação</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
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
        <h2 className="text-2xl font-bold mb-4 text-white">Sistema Kanban de Estudos</h2>
        <p className="text-gray-300 mb-4">
          Organize seus estudos musicais usando um sistema Kanban visual e eficiente.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h3 className="font-medium text-purple-400 mb-3">Estrutura do Kanban</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
              <li>Coluna "Estudar"</li>
              <li>Coluna "Em Andamento"</li>
              <li>Coluna "Concluído"</li>
              <li>Drag and Drop</li>
              <li>Contadores por coluna</li>
            </ul>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h3 className="font-medium text-purple-400 mb-3">Cartões de Estudo</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
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
        <h2 className="text-2xl font-bold mb-4 text-white">Configurações de Pedaleiras</h2>
        <p className="text-gray-300 mb-4">
          Gerencie as configurações de suas pedaleiras para cada música.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h3 className="font-medium text-purple-400 mb-3">Cadastro de Equipamentos</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
              <li>Marca e modelo</li>
              <li>Número de série</li>
              <li>Firmware</li>
              <li>Bancos disponíveis</li>
              <li>Conexões MIDI</li>
            </ul>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h3 className="font-medium text-purple-400 mb-3">Presets</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
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

  // Estatísticas para cards
  const totalTopicos = Object.keys(sectionContent).length;
  const totalCategorias = menuGroups.length;
  const topicosPopulares = 5;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Ajuda</h1>
          <p className="text-gray-400">Guia completo de utilização do MagicList</p>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <HelpStatCard 
          title="Total de Tópicos" 
          value={totalTopicos} 
          icon={<Book size={20} />}
        />
        <HelpStatCard 
          title="Categorias" 
          value={totalCategorias} 
          icon={<HelpCircle size={20} />}
        />
        <HelpStatCard 
          title="Tópicos Populares" 
          value={topicosPopulares} 
          icon={<Users size={20} />}
        />
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
        <div className="grid grid-cols-12 divide-x divide-gray-700">
          {/* Menu */}
          <div className="col-span-12 md:col-span-3 p-6 border-r border-gray-700">
            <h2 className="text-lg font-semibold mb-4 text-white">Menu</h2>
            <nav className="space-y-2">
              {menuGroups.map(group => (
                <div key={group.id} className="mb-2">
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className={`w-full flex items-center justify-between px-4 py-2 text-left text-sm font-medium rounded-lg transition-colors ${
                      expandedGroups.includes(group.id)
                        ? 'bg-gray-700/70 text-white'
                        : 'hover:bg-gray-700/50 text-gray-300'
                    }`}
                  >
                    <span>{group.title}</span>
                    {group.items.length > 1 && (
                      <ChevronDown
                        className={`w-5 h-5 transform transition-transform ${
                          expandedGroups.includes(group.id) ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>
                  {expandedGroups.includes(group.id) && (
                    <div className="mt-1 pl-4 space-y-1 border-l-2 border-gray-700">
                      {group.items.map(item => (
                        <button
                          key={item.id}
                          onClick={() => setActiveSection(item.id)}
                          className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
                            activeSection === item.id
                              ? 'bg-purple-900/50 text-purple-300 font-medium'
                              : 'hover:bg-gray-700/30 text-gray-400'
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
          <div className="col-span-12 md:col-span-9 p-6">
            <div className="prose prose-invert max-w-none">
              {sectionContent[activeSection]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 