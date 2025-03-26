'use client';

import Link from 'next/link';
import { Music, ArrowLeft } from 'lucide-react';

export default function PageHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
          <Music className="h-8 w-8 mr-3 text-purple-400" />
          Nova Música
        </h1>
        <p className="text-gray-400">Cadastre uma nova música para seu repertório</p>
      </div>
      <Link 
        href="/musicas" 
        className="flex items-center text-purple-400 hover:text-purple-300 mt-4 md:mt-0"
      >
        <ArrowLeft className="h-5 w-5 mr-1" />
        Voltar
      </Link>
    </div>
  );
} 