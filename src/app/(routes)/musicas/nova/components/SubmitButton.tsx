'use client';

import { Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  loading: boolean;
}

export default function SubmitButton({ loading }: SubmitButtonProps) {
  return (
    <div className="flex justify-end">
      <button
        type="submit"
        disabled={loading}
        className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-black ${
          loading ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600'
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
            Salvando...
          </>
        ) : (
          'Salvar Música'
        )}
      </button>
    </div>
  );
} 