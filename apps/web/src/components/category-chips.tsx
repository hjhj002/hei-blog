import type { Tag } from '@hei-blog/shared';
import { cn } from '@/lib/utils';

interface CategoryChipsProps {
  tags: Tag[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
}

export function CategoryChips({
  tags,
  selected,
  onSelect,
}: CategoryChipsProps) {
  const chipClass = (active: boolean) =>
    cn(
      'h-[34px] rounded-full border px-3.5 text-sm transition-colors',
      active
        ? 'border-transparent bg-foreground text-background'
        : 'border-border bg-card text-muted-foreground hover:text-foreground',
    );

  return (
    <div className="flex flex-wrap gap-2.5 py-1.5">
      <button
        type="button"
        className={chipClass(selected === null)}
        onClick={() => onSelect(null)}
      >
        全部
      </button>
      {tags.map((tag) => (
        <button
          key={tag.id}
          type="button"
          className={chipClass(selected === tag.slug)}
          onClick={() => onSelect(tag.slug)}
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
}
