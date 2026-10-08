import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function SubscribeSection() {
  return (
    <section id="subscribe" className="mx-auto w-full max-w-[1160px] px-6 py-9">
      <div className="subscribe-bg grid items-center gap-6 rounded-[26px] border p-8 sm:p-10 md:grid-cols-[1fr_auto]">
        <div>
          <h3 className="text-[22px] sm:text-[26px]">订阅更新</h3>
          <p className="mt-2 text-muted-foreground">
            有新文章时发一封邮件，不发广告，随时可以退订。
          </p>
        </div>
        <form
          className="flex gap-2.5"
          onSubmit={(event) => event.preventDefault()}
        >
          <Input
            type="email"
            placeholder="你的邮箱地址"
            aria-label="邮箱地址"
            className="h-[46px] w-full sm:w-[280px]"
          />
          <Button type="submit" className="h-[46px]">
            订阅
          </Button>
        </form>
      </div>
    </section>
  );
}
