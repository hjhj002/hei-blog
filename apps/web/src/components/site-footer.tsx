import { BrandLogo } from './brand-logo';

export function SiteFooter() {
  return (
    <footer className="mt-7 border-t bg-muted/40">
      <div className="mx-auto grid w-full max-w-[1160px] gap-6 px-6 py-10 md:grid-cols-[1.6fr_1fr_1fr]">
        <div className="flex gap-3.5">
          <BrandLogo className="h-12 w-12 text-2xl" />
          <div>
            <div className="text-[17px] font-extrabold">慢写</div>
            <p className="mt-1 text-sm text-muted-foreground">
              写作、设计与一点点前端。
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground">文章</a>
          <a href="#" className="hover:text-foreground">项目</a>
          <a href="#" className="hover:text-foreground">关于</a>
          <a href="#" className="hover:text-foreground">RSS</a>
        </div>
        <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground">GitHub</a>
          <a href="#" className="hover:text-foreground">X</a>
          <a href="#" className="hover:text-foreground">Email</a>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto w-full max-w-[1160px] px-6 py-4 text-[13px] text-muted-foreground">
          © 2026 慢写 · 用 React 与 shadcn/ui 重写
        </div>
      </div>
    </footer>
  );
}
