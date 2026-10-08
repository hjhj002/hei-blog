import { Link } from 'react-router-dom';
import type { Post } from '@hei-blog/shared';
import { formatDate, readingTime } from '@/lib/format';

const covers = ['cover-2', 'cover-3', 'cover-4', 'cover-5', 'cover-6', 'cover-7'];

interface PostCardProps {
  post: Post;
  index: number;
}

export function PostCard({ post, index }: PostCardProps) {
  const cover = covers[index % covers.length];

  return (
    <article className="group flex flex-col overflow-hidden rounded-[18px] border bg-card shadow-[0_8px_22px_-16px_rgba(58,40,96,0.42)] transition-all hover:-translate-y-[3px] hover:shadow-[0_18px_40px_-24px_rgba(58,40,96,0.38)]">
      <Link
        to={`/posts/${post.slug}`}
        className={`${cover} cover-glow relative block aspect-[16/10]`}
      >
        <span className="absolute bottom-3.5 left-3.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-foreground dark:bg-[#13101c]/70 dark:text-foreground">
          {post.tags[0]?.name ?? '随笔'}
        </span>
      </Link>
      <div className="p-5">
        <Link to={`/posts/${post.slug}`}>
          <h4 className="text-[19px] font-bold leading-[1.35]">{post.title}</h4>
        </Link>
        <p className="mt-2.5 text-[14.5px] text-muted-foreground">
          {post.excerpt}
        </p>
        <div className="mt-3.5 flex items-center gap-2.5 text-[13px] text-muted-foreground">
          <span>{formatDate(post.createdAt)}</span>
          <span className="dot" />
          <span>{readingTime(post.content)}</span>
        </div>
      </div>
    </article>
  );
}
