'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10 shrink-0"></div>;
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-variant text-on-surface-variant hover:text-brand-orange hover:bg-brand-orange/10 transition-colors shrink-0"
      title="Toggle Theme"
    >
      <span className="material-symbols-outlined">
        {resolvedTheme === 'dark' ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  );
}
