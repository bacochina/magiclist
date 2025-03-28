"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function DevsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Ferramentas para Desenvolvedores</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/devs/gemini-teste" className="block">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Teste da API Gemini</CardTitle>
              <CardDescription>
                Teste e configure a API do Gemini para geração de conteúdo
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Verificar funcionamento</span>
              <ArrowRight className="h-5 w-5 text-primary" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
} 