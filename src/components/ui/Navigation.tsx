'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type MenuItem = {
  id: string;
  title: string;
  href: string;
};

type MenuGroup = {
  id: string;
  title: string;
  items: MenuItem[];
};

const menuGroups: MenuGroup[] = [
  {
    id: 'eventos',
    title: 'Eventos',
    items: [
      { id: 'eventos', title: 'Eventos', href: '/eventos' }
    ]
  },
  {
    id: 'bandas',
    title: 'Bandas',
    items: [
      { id: 'bands', title: 'Bandas', href: '/bandas' },
      { id: 'integrantes', title: 'Integrantes', href: '/integrantes' }
    ]
  },
  {
    id: 'organizacao',
    title: 'Organização',
    items: [
      { id: 'songs', title: 'Músicas', href: '/musicas' },
      { id: 'blocks', title: 'Blocos', href: '/blocos' },
      { id: 'repertoires', title: 'Repertórios', href: '/repertorios' },
      { id: 'layouts', title: 'Layouts', href: '/layouts' }
    ]
  },
  {
    id: 'musico',
    title: 'Músico',
    items: [
      { id: 'estudos', title: 'Estudos', href: '/estudos' },
      { id: 'pedalboards', title: 'Pedaleiras', href: '/pedaleiras' }
    ]
  },
  {
    id: 'ajuda',
    title: 'Ajuda',
    items: [
      { id: 'help', title: 'Ajuda', href: '/help' }
    ]
  }
];

export default function Navigation() {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  // Função para alternar a abertura/fechamento dos submenus
  const toggleGroup = (groupId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setOpenGroup(prevOpenGroup => prevOpenGroup === groupId ? null : groupId);
  };

  // Função para definir a referência de cada dropdown
  const setDropdownRef = (el: HTMLDivElement | null, groupId: string) => {
    if (dropdownRefs.current) {
      dropdownRefs.current[groupId] = el;
    }
  };

  // Fechar o submenu quando a rota muda
  useEffect(() => {
    setOpenGroup(null);
  }, [pathname]);

  // Fechar submenus quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openGroup && !Object.values(dropdownRefs.current).some(ref => 
        ref && ref.contains(event.target as Node)
      )) {
        setOpenGroup(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openGroup]);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              href="/"
              className="flex items-center px-4 text-lg font-semibold text-blue-600 hover:text-blue-500"
            >
              MagicList
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {menuGroups.map((group) => (
                <div 
                  key={group.id} 
                  className="relative group"
                  ref={(el) => setDropdownRef(el, group.id)}
                >
                  {group.items.length === 1 ? (
                    // Item único - renderiza apenas como link
                    <Link
                      href={group.items[0].href}
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium border-b-2 ${
                        pathname === group.items[0].href
                          ? 'border-blue-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                    >
                      {group.title}
                    </Link>
                  ) : (
                    // Grupo com múltiplos itens
                    <>
                      <button
                        onClick={(e) => toggleGroup(group.id, e)}
                        className={`inline-flex items-center px-3 py-2 text-sm font-medium border-b-2 ${
                          openGroup === group.id || group.items.some(item => pathname === item.href)
                            ? 'border-blue-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        }`}
                        aria-expanded={openGroup === group.id}
                        aria-haspopup="true"
                      >
                        {group.title}
                        <svg
                          className={`ml-2 h-4 w-4 transition-transform ${
                            openGroup === group.id ? 'rotate-180' : ''
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
                      </button>
                      {openGroup === group.id && (
                        <div 
                          className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                          role="menu"
                          aria-orientation="vertical"
                        >
                          <div className="py-1">
                            {group.items.map((item) => (
                              <Link
                                key={item.id}
                                href={item.href}
                                className={`block px-4 py-2 text-sm ${
                                  pathname === item.href
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                                role="menuitem"
                                onClick={() => setOpenGroup(null)}
                              >
                                {item.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Menu mobile */}
          <div className="sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setOpenGroup(openGroup ? null : 'mobile')}
              aria-expanded={openGroup === 'mobile'}
            >
              <span className="sr-only">Abrir menu principal</span>
              <svg 
                className="h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {openGroup === 'mobile' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Menu mobile dropdown */}
      {openGroup === 'mobile' && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {menuGroups.map((group) => (
              <div key={group.id}>
                {group.items.length === 1 ? (
                  <Link
                    href={group.items[0].href}
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      pathname === group.items[0].href
                        ? 'border-blue-500 text-blue-700 bg-blue-50'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                    }`}
                    onClick={() => setOpenGroup(null)}
                  >
                    {group.title}
                  </Link>
                ) : (
                  <>
                    <button
                      className={`w-full text-left flex items-center justify-between pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                        openGroup === `mobile-${group.id}`
                          ? 'border-blue-500 text-blue-700 bg-blue-50'
                          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenGroup(openGroup === `mobile-${group.id}` ? 'mobile' : `mobile-${group.id}`);
                      }}
                    >
                      {group.title}
                      <svg
                        className={`ml-2 h-4 w-4 transition-transform ${
                          openGroup === `mobile-${group.id}` ? 'rotate-180' : ''
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
                    </button>
                    {openGroup === `mobile-${group.id}` && (
                      <div className="pl-4 pr-2">
                        {group.items.map((item) => (
                          <Link
                            key={item.id}
                            href={item.href}
                            className={`block pl-3 pr-4 py-2 border-l-4 text-sm font-medium ${
                              pathname === item.href
                                ? 'border-blue-500 text-blue-700 bg-blue-50'
                                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                            }`}
                            onClick={() => setOpenGroup(null)}
                          >
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
} 