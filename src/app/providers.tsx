'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function Providers({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useAppStore();

  useEffect(() => {
    // Initialize theme from system preference or saved preference
    const savedTheme = theme;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (!savedTheme && systemPrefersDark) {
      setTheme('dark');
    } else {
      setTheme(savedTheme);
    }
  }, [theme, setTheme]);

  return <>{children}</>;
}

