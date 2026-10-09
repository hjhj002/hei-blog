import { Route, Routes } from 'react-router-dom';
import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Projects from './pages/Projects';

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts/:slug" element={<PostDetail />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
      <SiteFooter />
    </div>
  );
}
