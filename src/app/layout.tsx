import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/ui/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MagicList - Gerador de Repertórios",
  description: "Crie e gerencie repertórios musicais de forma fácil e profissional",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-50`}>
        <Navigation />
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
