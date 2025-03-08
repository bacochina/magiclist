'use client';

import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useHydratedLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [isHydrated, setIsHydrated] = useState(false);
  const [storedValue, setStoredValue] = useLocalStorage<T>(key, initialValue);
  const [hydratedValue, setHydratedValue] = useState<T>(initialValue);

  useEffect(() => {
    setIsHydrated(true);
    setHydratedValue(storedValue);
  }, [storedValue]);

  return [isHydrated ? storedValue : initialValue, setStoredValue];
} 