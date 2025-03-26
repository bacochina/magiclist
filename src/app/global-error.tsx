'use client';

import { useEffect } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to the console
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 bg-slate-800 rounded-lg border border-slate-700 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-3">Algo deu errado!</h2>
            <p className="text-slate-300 mb-4">
              Desculpe, encontramos um problema ao carregar a página.
            </p>
            <button
              onClick={() => reset()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </body>
    </html>
  );
} 