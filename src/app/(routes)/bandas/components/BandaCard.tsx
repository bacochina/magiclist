'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Banda {
  id: string;
  nome: string;
  genero: string;
  descricao: string;
}

interface BandaCardProps {
  banda: Banda;
}

export function BandaCard({ banda }: BandaCardProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Tem certeza que deseja excluir a banda "${banda.nome}"?`)) {
      return;
    }

    try {
      const response = await fetch('/api/bandas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete',
          data: { id: banda.id }
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir banda');
      }

      router.refresh();
    } catch (error) {
      console.error('Erro ao excluir banda:', error);
      alert('Erro ao excluir banda');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{banda.nome}</span>
          <span className="text-sm font-normal px-2 py-1 bg-purple-100 text-purple-800 rounded">
            {banda.genero}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{banda.descricao}</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/bandas/editar/${banda.id}`)}
        >
          <Edit className="h-4 w-4 mr-1" />
          Editar
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-red-500 hover:bg-red-600 text-white hover:text-white border-red-500 hover:border-red-600"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Excluir
        </Button>
      </CardFooter>
    </Card>
  );
} 