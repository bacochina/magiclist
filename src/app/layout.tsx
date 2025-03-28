import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/ui/Navigation";
import 'sweetalert2/dist/sweetalert2.min.css'
import { ThemeProvider } from "./providers/ThemeProvider";
import { Providers } from "./providers";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MagicList",
  description: "Gerencie suas músicas, bandas e repertórios",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          <ThemeProvider>
            {/* Fundo escuro com gradiente sutil */}
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 transition-opacity duration-300">
              {/* Elemento decorativo com padrão sutil */}
              <div 
                className="absolute inset-0 opacity-3 pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238A2BE2' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
              
              {/* Estrutura principal com menu lateral e conteúdo */}
              <div className="flex min-h-screen relative z-10">
                {/* Menu de navegação lateral */}
                <Navigation />
                
                {/* Conteúdo principal */}
                <div className="flex-1 overflow-auto">
                  <main className="p-6">
                    {children}
                  </main>
                </div>
              </div>
            </div>
          </ThemeProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
