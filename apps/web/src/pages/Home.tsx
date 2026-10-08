import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '@hei-blog/shared';
import { listPosts } from '../lib/api';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listPosts({ pageSize: 20 })
      .then((result) => setPosts(result.items))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <h1>hei-blog</h1>
      {loading ? (
        <p>加载中…</p>
      ) : posts.length === 0 ? (
        <p>还没有文章。</p>
      ) : (
        posts.map((post) => (
          <Link
            key={post.id}
            className="post-card"
            to={`/posts/${post.slug}`}
          >
            <h2>{post.title}</h2>
            {post.excerpt && <p>{post.excerpt}</p>}
            <div style={{ marginTop: 12 }}>
              {post.tags.map((tag) => (
                <span key={tag.id} className="tag">
                  {tag.name}
                </span>
              ))}
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
