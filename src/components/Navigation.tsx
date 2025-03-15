'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Navigation = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [eventosExpanded, setEventosExpanded] = useState(false);

  // Fechar o menu mobile quando o caminho mudar
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Expandir o menu Eventos se estiver em alguma rota de eventos
  useEffect(() => {
    if (pathname.includes('/eventos')) {
      setEventosExpanded(true);
    }
  }, [pathname]);

  const isActive = (path: string) => pathname === path;
  const isEventoActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  const menuItems = [
    { 
      href: '/eventos', 
      label: 'Eventos', 
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      color: 'from-blue-400 to-indigo-400',
      hasSubmenu: true,
      submenu: [
        { href: '/eventos/shows', label: 'Shows' },
        { href: '/eventos/ensaios', label: 'Ensaios' },
        { href: '/eventos/reunioes', label: 'Reuniões' }
      ]
    },
    { 
      href: '/bandas', 
      label: 'Bandas', 
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      color: 'from-purple-400 to-pink-400'
    },
    { 
      href: '/musicas', 
      label: 'Músicas', 
      icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
      color: 'from-orange-400 to-amber-400'
    },
    { 
      href: '/blocos', 
      label: 'Blocos', 
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
      color: 'from-red-400 to-rose-400'
    },
    { 
      href: '/repertorios', 
      label: 'Repertórios', 
      icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      color: 'from-teal-400 to-emerald-400'
    },
    { 
      href: '/layouts', 
      label: 'Layouts', 
      icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
      color: 'from-cyan-400 to-sky-400'
    },
    { 
      href: '/estudos', 
      label: 'Estudos', 
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      color: 'from-green-400 to-emerald-400'
    },
    { 
      href: '/pedaleira', 
      label: 'Pedaleira', 
      icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
      color: 'from-violet-400 to-purple-400'
    },
  ];

  return (
    <nav className="bg-black/50 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text hover:opacity-80 transition-opacity">
                MagicList
              </span>
            </Link>
          </div>

          {/* Menu Desktop */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-1">
              {menuItems.map((item) => (
                <div key={item.href} className="relative">
                  {item.hasSubmenu ? (
                    <div className="flex flex-col">
                      <button
                        onClick={() => setEventosExpanded(!eventosExpanded)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 group
                          ${isEventoActive(item.href)
                            ? 'bg-white/10 text-white shadow-lg shadow-white/5'
                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
                          }`}
                      >
                        <div className={`p-1.5 rounded-lg bg-gradient-to-r ${item.color} 
                          ${isEventoActive(item.href) 
                            ? 'opacity-100 shadow-lg' 
                            : 'opacity-70 group-hover:opacity-100'} 
                          transition-all duration-300`}
                        >
                          <svg
                            className="h-4 w-4 text-white transition-transform duration-300 group-hover:scale-110"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                          </svg>
                        </div>
                        <span className="transition-all duration-300 group-hover:translate-x-0.5">
                          {item.label}
                        </span>
                        {eventosExpanded ? 
                          <ChevronUp className="h-4 w-4 ml-1" /> : 
                          <ChevronDown className="h-4 w-4 ml-1" />
                        }
                      </button>
                      
                      {/* Submenu */}
                      <div className={`absolute top-full left-0 mt-1 rounded-lg bg-gray-800 shadow-lg overflow-hidden transition-all duration-300 z-10
                        ${eventosExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
                      >
                        <div className="py-1 w-40">
                          {item.submenu?.map(subItem => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={`block px-4 py-2 text-sm transition-colors duration-200
                                ${isActive(subItem.href)
                                  ? 'bg-gray-700 text-white'
                                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 group
                        ${isActive(item.href)
                          ? 'bg-white/10 text-white shadow-lg shadow-white/5'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                      <div className={`p-1.5 rounded-lg bg-gradient-to-r ${item.color} 
                        ${isActive(item.href) 
                          ? 'opacity-100 shadow-lg' 
                          : 'opacity-70 group-hover:opacity-100'} 
                        transition-all duration-300`}
                      >
                        <svg
                          className="h-4 w-4 text-white transition-transform duration-300 group-hover:scale-110"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                      </div>
                      <span className="transition-all duration-300 group-hover:translate-x-0.5">
                        {item.label}
                      </span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Menu Mobile Button */}
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none transition-colors duration-300"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Abrir menu principal</span>
              {mobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Dropdown */}
      <div 
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen 
            ? 'max-h-screen opacity-100' 
            : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {menuItems.map((item) => (
            <div key={item.href}>
              {item.hasSubmenu ? (
                <div>
                  <button
                    onClick={() => setEventosExpanded(!eventosExpanded)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-base font-medium transition-all duration-300
                      ${isEventoActive(item.href)
                        ? 'bg-white/10 text-white'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-1.5 rounded-lg bg-gradient-to-r ${item.color} 
                        ${isEventoActive(item.href) ? 'opacity-100' : 'opacity-70'} 
                        transition-all duration-300`}
                      >
                        <svg
                          className="h-5 w-5 text-white transition-transform duration-300 hover:scale-110"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                        </svg>
                      </div>
                      <span className="transition-all duration-300 hover:translate-x-0.5">{item.label}</span>
                    </div>
                    {eventosExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                  
                  {/* Mobile Submenu */}
                  <div className={`transition-all duration-300 overflow-hidden pl-10 
                    ${eventosExpanded ? 'max-h-40 opacity-100 pt-1' : 'max-h-0 opacity-0'}`}
                  >
                    {item.submenu?.map(subItem => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-3 py-2 text-sm rounded-lg transition-colors duration-200 mb-1
                          ${isActive(subItem.href)
                            ? 'bg-gray-700 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          }`}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-all duration-300
                    ${isActive(item.href)
                      ? 'bg-white/10 text-white'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <div className={`p-1.5 rounded-lg bg-gradient-to-r ${item.color} 
                    ${isActive(item.href) ? 'opacity-100' : 'opacity-70'} 
                    transition-all duration-300`}
                  >
                    <svg
                      className="h-5 w-5 text-white transition-transform duration-300 hover:scale-110"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                  <span className="transition-all duration-300 hover:translate-x-0.5">{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 