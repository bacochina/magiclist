import { useEffect, useState } from 'react';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';

export interface GenerationProgress {
  step: number;
  message: string;
  error: string | null;
}

interface GenerationProgressProps {
  isGenerating: boolean;
  currentStep: number;
  message: string;
  error: string | null;
  onComplete: () => void;
}

export function GenerationProgress({ 
  isGenerating, 
  currentStep: externalStep, 
  message: externalMessage, 
  error: externalError,
  onComplete 
}: GenerationProgressProps) {
  const [internalStep, setInternalStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    { id: 0, label: 'Validando estrutura de diretórios' },
    { id: 1, label: 'Criando diretório da página' },
    { id: 2, label: 'Criando diretório de componentes' },
    { id: 3, label: 'Criando diretório de API' },
    { id: 4, label: 'Gerando arquivos base' },
    { id: 5, label: 'Configurando rotas' },
    { id: 6, label: 'Finalizando' }
  ];

  // Usar o passo externo se fornecido, caso contrário usar o interno
  const currentStepToShow = externalStep ?? internalStep;

  useEffect(() => {
    if (isGenerating && !externalStep) {
      const interval = setInterval(() => {
        setInternalStep(current => {
          if (current >= steps.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              onComplete();
            }, 1000);
            return current;
          }
          return current + 1;
        });
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [isGenerating, steps.length, onComplete, externalStep]);

  // Atualizar erro quando o erro externo mudar
  useEffect(() => {
    if (externalError) {
      setError(externalError);
    }
  }, [externalError]);

  return (
    <div className="space-y-4">
      {steps.map((step) => (
        <div key={step.id} className="flex items-center space-x-3">
          {currentStepToShow > step.id ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : currentStepToShow === step.id ? (
            <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
          ) : (
            <Circle className="h-5 w-5 text-slate-500" />
          )}
          <span className={`text-sm ${currentStepToShow >= step.id ? 'text-white' : 'text-slate-500'}`}>
            {externalMessage && currentStepToShow === step.id ? externalMessage : step.label}
          </span>
        </div>
      ))}

      {error && (
        <div className="mt-4 p-4 bg-red-900/30 border border-red-900/50 rounded-lg flex items-start space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <h4 className="text-red-400 font-medium mb-1">Erro no processo:</h4>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
} 