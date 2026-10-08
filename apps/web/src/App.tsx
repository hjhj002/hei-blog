import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/posts/:slug" element={<PostDetail />} />
    </Routes>
  );
}
