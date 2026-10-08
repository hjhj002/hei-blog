import { CatWidget } from './cat-widget';

interface MastheadProps {
  postCount: number;
  tagCount: number;
  lastUpdated: string;
}

export function Masthead({ postCount, tagCount, lastUpdated }: MastheadProps) {
  return (
    <section className="masthead-bg py-12">
      <div className="mx-auto grid w-full max-w-[1160px] items-end gap-6 px-6 md:grid-cols-[minmax(0,620px)_1fr]">
        <div>
          <p className="mb-3.5 text-sm font-bold uppercase tracking-[0.14em] text-accent-foreground">
            写作 · 设计 · 一点点前端
          </p>
          <h1 className="text-[42px] leading-[1.08] tracking-tight sm:text-[60px]">
            把想到的东西，
            <br />
            慢慢写下来。
          </h1>
          <p className="mt-4 max-w-[30em] text-lg text-muted-foreground">
            这里记录我做产品、做设计、写代码时的思考与踩坑。不定期更新，尽量写得有用。
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[15px] text-muted-foreground">
            <span>
              <strong className="font-extrabold text-foreground">{postCount}</strong>{' '}
              篇文章
            </span>
            <span className="dot" />
            <span>
              <strong className="font-extrabold text-foreground">{tagCount}</strong>{' '}
              个分类
            </span>
            <span className="dot" />
            <span>最近更新 · {lastUpdated}</span>
          </div>
        </div>

        <div className="order-first flex items-end justify-center gap-2.5 md:order-none">
          <div className="-mb-4">
            <img
              src="/assets/boy-line.png"
              alt=""
              className="h-[210px] w-auto dark:hidden sm:h-[250px] lg:h-[288px]"
            />
            <img
              src="/assets/boy-line-dark.png"
              alt=""
              className="hidden h-[210px] w-auto dark:block sm:h-[250px] lg:h-[288px]"
            />
          </div>
          <div className="relative h-[78px] w-[78px] drop-shadow-[0_14px_20px_rgba(58,40,96,0.28)] dark:drop-shadow-[0_18px_28px_rgba(0,0,0,0.6)] sm:h-[92px] sm:w-[92px] lg:h-[108px] lg:w-[108px]">
            <CatWidget />
          </div>
        </div>
      </div>
    </section>
  );
}
