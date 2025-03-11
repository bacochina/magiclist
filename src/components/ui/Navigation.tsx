'use client';

import { useState, useEffect } from 'react';
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

  const toggleGroup = (groupId: string) => {
    setOpenGroup(openGroup === groupId ? null : groupId);
  };

  // Fechar o submenu quando a rota muda
  useEffect(() => {
    setOpenGroup(null);
  }, [pathname]);

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
                <div key={group.id} className="relative group">
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
                        onClick={() => toggleGroup(group.id)}
                        className={`inline-flex items-center px-3 py-2 text-sm font-medium border-b-2 ${
                          group.items.some(item => pathname === item.href)
                            ? 'border-blue-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        }`}
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
                        <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                          <div className="py-1" role="menu">
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
        </div>
      </div>
    </nav>
  );
} 