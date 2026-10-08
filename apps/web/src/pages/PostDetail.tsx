import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Post } from '@hei-blog/shared';
import { getPost } from '../lib/api';

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (slug) {
      getPost(slug).then(setPost);
    }
  }, [slug]);

  if (!post) {
    return (
      <div className="container">
        <p>加载中…</p>
      </div>
    );
  }

  return (
    <div className="container">
      <Link to="/">← 返回首页</Link>
      <h1>{post.title}</h1>
      <div style={{ marginBottom: 16 }}>
        {post.tags.map((tag) => (
          <span key={tag.id} className="tag">
            {tag.name}
          </span>
        ))}
      </div>
      <article style={{ whiteSpace: 'pre-wrap' }}>{post.content}</article>
    </div>
  );
}
