import { Link } from 'react-router-dom';
import type { Post } from '@hei-blog/shared';
import { Badge } from '@/components/ui/badge';
import { formatDate, readingTime } from '@/lib/format';

interface FeaturedPostProps {
  post: Post;
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <article className="grid overflow-hidden rounded-[26px] border bg-card shadow-[0_18px_40px_-24px_rgba(58,40,96,0.38)] md:grid-cols-[1.12fr_1fr]">
      <div className="self-center px-6 py-10 sm:px-11">
        <Badge
          variant="accent"
          className="h-auto px-3 py-1.5 text-[13px] font-bold tracking-wide"
        >
          精选
        </Badge>
        <h2 className="mt-4 text-[27px] leading-tight tracking-tight sm:text-[35px]">
          {post.title}
        </h2>
        <p className="mb-5 mt-3.5 max-w-[34em] text-[17px] text-muted-foreground">
          {post.excerpt}
        </p>
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-sm text-muted-foreground">
          <img
            src="/assets/cat-mascot.png"
            alt=""
            className="h-[26px] w-[26px] rounded-full bg-secondary object-contain"
          />
          <span>奶油笔记</span>
          <span className="dot" />
          <span>{formatDate(post.createdAt)}</span>
          <span className="dot" />
          <span>{readingTime(post.content)}</span>
        </div>
        <Link
          to={`/posts/${post.slug}`}
          className="mt-5 inline-block font-bold text-accent-foreground"
        >
          阅读全文 →
        </Link>
      </div>
      <div className="relative m-4 min-h-[240px] overflow-hidden rounded-[18px] md:min-h-[340px]">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="cover-1 cover-glow absolute inset-0" />
        )}
        <span className="absolute bottom-3.5 left-3.5 z-10 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-foreground dark:bg-[#13101c]/70 dark:text-foreground">
          {post.tags[0]?.name ?? '随笔'}
        </span>
      </div>
    </article>
  );
}
