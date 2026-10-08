import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('blog-theme', next ? 'dark' : 'light');
    } catch {
      /* ignore */
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full"
      onClick={toggle}
      aria-label="切换深浅色主题"
      title="切换深浅色主题"
    >
      {dark ? <Moon /> : <Sun />}
    </Button>
  );
}
