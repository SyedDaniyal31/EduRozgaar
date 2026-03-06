import React from 'react';

export const ThemeContext = React.createContext({ theme: 'light', toggleTheme: () => {} });

export function useTheme() {
  return React.useContext(ThemeContext);
}

export const colors = {
  light: {
    bg: '#ffffff',
    card: '#f9fafb',
    text: '#111827',
    subtext: '#6b7280',
    primary: '#059669',
    border: '#e5e7eb',
  },
  dark: {
    bg: '#111827',
    card: '#1f2937',
    text: '#f9fafb',
    subtext: '#9ca3af',
    primary: '#10b981',
    border: '#374151',
  },
};
