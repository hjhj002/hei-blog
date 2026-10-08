import { Link, NavLink } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';

export function SiteNav() {
  const linkClass = 'rounded-full px-3.5 py-2 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-card hover:text-foreground';

  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur-md backdrop-saturate-150">
      <div className="mx-auto flex h-[70px] w-full max-w-[1160px] items-center gap-7 px-6">
        <Link to="/" className="flex items-center gap-2.5 font-extrabold">
          <img
            src="/assets/cat-mascot.png"
            alt=""
            className="h-9 w-9 object-contain"
          />
          <span className="text-lg tracking-tight">奶油笔记</span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1.5 md:flex">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(linkClass, isActive && 'bg-card text-foreground shadow-sm')
            }
          >
            首页
          </NavLink>
          <a href="/#latest" className={linkClass}>
            文章
          </a>
          <a href="#" className={linkClass}>
            项目
          </a>
          <a href="#" className={linkClass}>
            关于
          </a>
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <ThemeToggle />
          <label className="hidden h-[42px] items-center gap-2 rounded-full border bg-card px-4 text-muted-foreground sm:flex">
            <Search className="h-4 w-4" />
            <Input
              type="search"
              placeholder="搜索文章"
              className="h-auto w-[130px] border-0 p-0 shadow-none focus-visible:ring-0"
            />
          </label>
          <Button asChild>
            <a href="#subscribe">订阅</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
