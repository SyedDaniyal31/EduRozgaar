import { useState, useCallback } from 'react';

export function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        setStored(value);
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.warn('useLocalStorage setItem error', e);
      }
    },
    [key]
  );

  return [stored, setValue];
}
