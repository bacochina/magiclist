'use client';

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/ui/page-header';
import { IntegranteForm } from '../components/IntegranteForm';

export default function NovoIntegrantePage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Novo Integrante"
          description="Cadastre um novo músico ou membro da equipe"
        />

        {/* Formulário */}
        <IntegranteForm />
      </div>
    </div>
  );
} 