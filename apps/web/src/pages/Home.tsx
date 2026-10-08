import { useEffect, useState } from 'react';
import type { Post, Tag } from '@hei-blog/shared';
import { listPosts, listTags } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { Masthead } from '@/components/masthead';
import { FeaturedPost } from '@/components/featured-post';
import { CategoryChips } from '@/components/category-chips';
import { PostCard } from '@/components/post-card';
import { SubscribeSection } from '@/components/subscribe-section';
import { Button } from '@/components/ui/button';

const PAGE_SIZE = 6;

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    listTags().then((data) => {
      if (active) setTags(data);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    listPosts({ pageSize, tag: selectedTag ?? undefined })
      .then((data) => {
        if (!active) return;
        setPosts(data.items);
        setTotal(data.total);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [selectedTag, pageSize]);

  const featured = posts[0];
  const grid = posts.slice(1);
  const lastUpdated = featured ? formatDate(featured.updatedAt) : '—';

  return (
    <main>
      <Masthead
        postCount={total}
        tagCount={tags.length}
        lastUpdated={lastUpdated}
      />

      {featured && (
        <section className="mx-auto w-full max-w-[1160px] px-6 py-9">
          <FeaturedPost post={featured} />
        </section>
      )}

      <section className="mx-auto w-full max-w-[1160px] px-6 py-2">
        <CategoryChips
          tags={tags}
          selected={selectedTag}
          onSelect={(slug) => {
            setSelectedTag(slug);
            setPageSize(PAGE_SIZE);
          }}
        />
      </section>

      <section id="latest" className="mx-auto w-full max-w-[1160px] px-6 py-9">
        <div className="mb-5 flex items-baseline justify-between">
          <h3 className="text-[22px] sm:text-[26px]">最新文章</h3>
          <a
            href="#latest"
            className="text-[15px] font-semibold text-accent-foreground"
          >
            查看全部 →
          </a>
        </div>

        {loading ? (
          <p className="text-muted-foreground">加载中…</p>
        ) : grid.length === 0 ? (
          <p className="text-muted-foreground">还没有文章。</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {grid.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}

        {total > posts.length && (
          <div className="mt-8 grid place-items-center">
            <Button
              variant="ghost"
              onClick={() => setPageSize((n) => n + PAGE_SIZE)}
            >
              加载更多文章
            </Button>
          </div>
        )}
      </section>

      <SubscribeSection />
    </main>
  );
}
