import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <span
      className={cn(
        'inline-flex select-none items-center justify-center rounded-[12px] bg-gradient-to-br from-[#a98bff] to-[#7c5cf0] font-bold text-white',
        className,
      )}
      aria-hidden="true"
    >
      慢
    </span>
  );
}
