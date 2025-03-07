import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Estado para armazenar o valor
  // Passe a função inicial para useState para que seja executada apenas uma vez
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Verifica se estamos no navegador
      if (typeof window === 'undefined') {
        return initialValue;
      }

      // Tenta pegar do localStorage pelo key
      const item = window.localStorage.getItem(key);
      // Parse o JSON armazenado ou retorna initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Se houver erro, retorna initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Retorna uma versão wrapped da função setState de useState que persiste
  // o novo valor no localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permite que o valor seja uma função para que tenhamos a mesma API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Salva o estado
      setStoredValue(valueToStore);
      // Salva no localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
} 