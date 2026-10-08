import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

declare global {
  interface Window {
    KittenWidget?: {
      create: (
        root: HTMLElement,
        options: Record<string, unknown>,
      ) => { destroy: () => void };
    };
  }
}

interface CatWidgetProps {
  className?: string;
}

export function CatWidget({ className }: CatWidgetProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.KittenWidget) return;

    const widget = window.KittenWidget.create(el, {
      manifestUrl: '/widget/compile.json',
      desktop: '/widget/desktop.webm',
      mobile: '/widget/mobile.webm',
      poster: '/widget/poster.png',
      track: 'window',
    });

    return () => widget.destroy();
  }, []);

  return (
    <div
      ref={ref}
      className={cn('h-full w-full', className)}
      role="img"
      aria-label="会跟着鼠标扭头的小猫"
    />
  );
}
