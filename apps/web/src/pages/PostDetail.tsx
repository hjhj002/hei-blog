import { useRequest } from 'alova/client';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getPost } from '@/lib/api';
import { formatDate, readingTime } from '@/lib/format';
import { Badge } from '@/components/ui/badge';
import { Markdown } from '@/components/markdown';

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, loading, error } = useRequest(
    () => getPost(slug ?? ''),
    { immediate: true },
  );

  if (error) {
    return (
      <main className="mx-auto w-full max-w-[760px] px-6 py-16 text-center">
        <p className="text-muted-foreground">文章不存在或已被删除。</p>
        <Link
          to="/"
          className="mt-4 inline-block font-semibold text-accent-foreground"
        >
          返回首页
        </Link>
      </main>
    );
  }

  if (loading || !post) {
    return (
      <main className="mx-auto w-full max-w-[760px] px-6 py-16 text-muted-foreground">
        加载中…
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[760px] px-6 py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        返回首页
      </Link>
      <h1 className="mt-6 text-3xl sm:text-4xl">{post.title}</h1>
      <div className="mt-4 flex flex-wrap items-center gap-2.5 text-sm text-muted-foreground">
        <span>{formatDate(post.createdAt)}</span>
        <span className="dot" />
        <span>{readingTime(post.content)}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Badge key={tag.id} variant="secondary">
            {tag.name}
          </Badge>
        ))}
      </div>
      <article className="markdown mt-8">
        <Markdown>{post.content}</Markdown>
      </article>
    </main>
  );
}
