'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { 
  Calendar, 
  Mic2, 
  Users, 
  Music2, 
  ListMusic, 
  BookOpen, 
  Layout, 
  BookMarked, 
  Settings, 
  HelpCircle,
  BarChart2,
  Bell,
  Menu,
  X,
  Home,
  ChevronDown,
  ChevronRight,
  Database,
  FileCode2
} from 'lucide-react';

<<<<<<< HEAD
const navigation = [
  { name: 'Bandas', href: '/bandas' },
  { name: 'Músicas', href: '/musicas' },
  { name: 'Blocos', href: '/blocos' },
  { name: 'Repertórios', href: '/repertorios' },
  { name: 'Layouts', href: '/layouts' },
  { name: 'Pedaleiras', href: '/pedaleiras' },
  { name: 'Ajuda', href: '/help' },
=======
type MenuItem = {
  id: string;
  title: string;
  href: string;
  icon: React.ReactNode;
};

type MenuGroup = {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: MenuItem[];
};

const menuGroups: MenuGroup[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: <Home className="w-5 h-5" />,
    items: [
      { id: 'home', title: 'Home', href: '/', icon: <Home className="w-5 h-5" /> }
    ]
  },
  {
    id: 'templates',
    title: 'Templates',
    icon: <FileCode2 className="w-5 h-5" />,
    items: [
      { id: 'templates-list', title: 'Templates', href: '/templates', icon: <FileCode2 className="w-5 h-5" /> },
      { id: 'templates-cadastros', title: 'Cadastros', href: '/templates/cadastros', icon: <Database className="w-5 h-5" /> }
    ]
  },
  {
    id: 'eventos',
    title: 'Eventos',
    icon: <Calendar className="w-5 h-5" />,
    items: [
      { id: 'dashboard', title: 'Dashboard', href: '/eventos', icon: <BarChart2 className="w-5 h-5" /> },
      { id: 'shows', title: 'Shows', href: '/eventos/shows', icon: <Calendar className="w-5 h-5" /> },
      { id: 'ensaios', title: 'Ensaios', href: '/eventos/ensaios', icon: <Calendar className="w-5 h-5" /> },
      { id: 'reunioes', title: 'Reuniões', href: '/eventos/reunioes', icon: <Calendar className="w-5 h-5" /> }
    ]
  },
  {
    id: 'bandas',
    title: 'Bandas',
    icon: <Mic2 className="w-5 h-5" />,
    items: [
      { id: 'bands', title: 'Bandas', href: '/bandas', icon: <Mic2 className="w-5 h-5" /> },
      { id: 'integrantes', title: 'Integrantes', href: '/integrantes', icon: <Users className="w-5 h-5" /> }
    ]
  },
  {
    id: 'organizacao',
    title: 'Organização',
    icon: <ListMusic className="w-5 h-5" />,
    items: [
      { id: 'songs', title: 'Músicas', href: '/musicas', icon: <Music2 className="w-5 h-5" /> },
      { id: 'blocks', title: 'Blocos', href: '/blocos', icon: <ListMusic className="w-5 h-5" /> },
      { id: 'repertoires', title: 'Repertórios', href: '/repertorios', icon: <BookMarked className="w-5 h-5" /> },
      { id: 'layouts', title: 'Layouts', href: '/layouts', icon: <Layout className="w-5 h-5" /> }
    ]
  },
  {
    id: 'musico',
    title: 'Músico',
    icon: <BookOpen className="w-5 h-5" />,
    items: [
      { id: 'estudos', title: 'Estudos', href: '/estudo-musicas', icon: <BookOpen className="w-5 h-5" /> },
      { id: 'pedalboards', title: 'Pedaleiras', href: '/pedaleiras', icon: <Settings className="w-5 h-5" /> }
    ]
  },
  {
    id: 'relatorios',
    title: 'Relatórios',
    icon: <BarChart2 className="w-5 h-5" />,
    items: [
      { id: 'analytics', title: 'Analytics', href: '/analytics', icon: <BarChart2 className="w-5 h-5" /> },
      { id: 'reports', title: 'Relatórios', href: '/reports', icon: <BarChart2 className="w-5 h-5" /> }
    ]
  },
  {
    id: 'dev',
    title: 'Dev Tools',
    icon: <Settings className="w-5 h-5" />,
    items: [
      { id: 'dbtest', title: 'Teste de DB', href: '/db-test', icon: <Database className="w-5 h-5" /> }
    ]
  },
  {
    id: 'configuracoes',
    title: 'Configurações',
    icon: <Settings className="w-5 h-5" />,
    items: [
      { id: 'settings', title: 'Configurações', href: '/configuracoes', icon: <Settings className="w-5 h-5" /> }
    ]
  },
  {
    id: 'ajuda',
    title: 'Ajuda',
    icon: <HelpCircle className="w-5 h-5" />,
    items: [
      { id: 'help', title: 'Ajuda', href: '/help', icon: <HelpCircle className="w-5 h-5" /> }
    ]
  }
>>>>>>> 5d49630809b82c0fd6e9b76bf3898e17ba9220c6
];

export default function Navigation() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const isLinkActive = (href: string) => {
    // Tratamento especial para submenu de Eventos
    if (href === '/eventos' && (
      pathname === '/eventos/shows' || 
      pathname === '/eventos/ensaios' || 
      pathname === '/eventos/reunioes' ||
      pathname.startsWith('/eventos/shows/') || 
      pathname.startsWith('/eventos/ensaios/') || 
      pathname.startsWith('/eventos/reunioes/')
    )) {
      return false;
    }
    
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const getLinkClasses = (href: string) => {
    const isActive = isLinkActive(href);
    return `flex items-center px-4 py-2 rounded-md text-sm transition-colors duration-200 ${
      isActive 
        ? 'bg-purple-700 bg-opacity-25 text-white font-medium' 
        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
    }`;
  };

  const getGroupClasses = (groupId: string) => {
    // Verifica se qualquer item do grupo está ativo
    const isActive = menuGroups
      .find(g => g.id === groupId)
      ?.items.some(item => isLinkActive(item.href));
    
    return `flex items-center justify-between w-full px-4 py-2 text-sm transition-colors duration-200 ${
      isActive && !openGroups[groupId]
        ? 'text-purple-400'
        : 'text-gray-300 hover:text-white'
    }`;
  };

  return (
    <>
      {/* Menu para Mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-gray-300 hover:bg-gray-800"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="ml-3 text-lg font-semibold text-white">MagicList</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full text-gray-300 hover:bg-gray-800 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-500"></span>
          </button>
        </div>
      </div>

      {/* Menu Mobile Slide-in */}
      <div className={`lg:hidden fixed inset-0 z-30 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}>
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}></div>
        <nav className="relative w-64 max-w-xs h-full bg-gray-900 shadow-xl overflow-y-auto transform transition-all">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-white">MagicList</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-md text-gray-300 hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="p-2 space-y-1">
            {menuGroups.map((group) => (
              <div key={group.id} className="mb-1">
                {group.items.length === 1 ? (
                  <Link 
                    href={group.items[0].href} 
                    className={getLinkClasses(group.items[0].href)}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {group.icon}
                    <span className="ml-3">{group.title}</span>
                  </Link>
                ) : (
                  <>
                    <button 
                      onClick={() => toggleGroup(group.id)} 
                      className={getGroupClasses(group.id)}
                    >
                      <span className="flex items-center">
                        {group.icon}
                        <span className="ml-3">{group.title}</span>
                      </span>
                      {openGroups[group.id] ? 
                        <ChevronDown className="w-4 h-4" /> : 
                        <ChevronRight className="w-4 h-4" />
                      }
                    </button>
                    
                    {openGroups[group.id] && (
                      <div className="mt-1 ml-4 pl-4 border-l border-gray-800 space-y-1">
                        {group.items.map((item) => (
                          <Link 
                            key={item.id} 
                            href={item.href}
                            className={getLinkClasses(item.href)}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.icon}
                            <span className="ml-3">{item.title}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </nav>
      </div>

      {/* Menu Desktop */}
      <aside className="hidden lg:block w-64 h-screen bg-gray-900 border-r border-gray-800 flex-shrink-0 overflow-y-auto">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center">
            <span className="text-xl font-bold text-white">MagicList</span>
          </div>
        </div>
        
        <div className="p-2 space-y-1">
          {menuGroups.map((group) => (
            <div key={group.id} className="mb-1">
              {group.items.length === 1 ? (
                <Link href={group.items[0].href} className={getLinkClasses(group.items[0].href)}>
                  {group.icon}
                  <span className="ml-3">{group.title}</span>
                </Link>
              ) : (
                <>
                  <button 
                    onClick={() => toggleGroup(group.id)} 
                    className={getGroupClasses(group.id)}
                  >
                    <span className="flex items-center">
                      {group.icon}
                      <span className="ml-3">{group.title}</span>
                    </span>
                    {openGroups[group.id] ? 
                      <ChevronDown className="w-4 h-4" /> : 
                      <ChevronRight className="w-4 h-4" />
                    }
                  </button>
                  
                  {openGroups[group.id] && (
                    <div className="mt-1 ml-4 pl-4 border-l border-gray-800 space-y-1">
                      {group.items.map((item) => (
                        <Link key={item.id} href={item.href} className={getLinkClasses(item.href)}>
                          {item.icon}
                          <span className="ml-3">{item.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
} 