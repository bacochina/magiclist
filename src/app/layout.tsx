import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/ui/Navigation";
import { PopularDadosButton } from "@/components/ui/PopularDadosButton";

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
        {/* Background padrão para todas as páginas */}
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
          {/* Overlay com padrão musical */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M29 58h2v-2h2v-2h-2v-2h2v-2h-2v-2h2v-2h-2v-2h2v-2h-2v-2h2v-2h-2v-2h2v-2h-2v-2h2v-2h-2v-2h2v-2h-2v-2h2v-2h-2v-2h2v-2h-2v-2h2V8h-2V6h2V4h-2V2h2V0h-2v2h-2v2h2v2h-2v2h2v2h-2v2h2v2h-2v2h2v2h-2v2h2v2h-2v2h2v2h-2v2h2v2h-2v2h2v2h-2v2h2v2h-2v2h2v2h-2v2h2v2h-2v2h2v2h-2v2h2v2h-2v2h2v2h-2v2h2v2h-2v2h2zm0-4h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2v-2h-2v2zm0-4h2V6h-2v2zm0-4h2V2h-2v2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          
          {/* Conteúdo principal */}
          <div className="relative z-10">
            <Navigation />
            <div className="min-h-screen">
              {children}
            </div>
            <PopularDadosButton />
          </div>
        </div>
      </body>
    </html>
  );
}
