export default function About() {
  return (
    <main className="mx-auto w-full max-w-[760px] px-6 py-12">
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent-foreground">
        关于
      </p>
      <h1 className="mt-3 text-4xl">关于慢写</h1>

      <div className="mt-8 space-y-4 text-[17px] leading-relaxed">
        <p>
          慢写是一个把想法慢慢写下来的地方。这里记录做产品、做设计、写代码时的思考与踩坑，不定期更新，尽量写得有用。
        </p>
        <p className="text-muted-foreground">
          名字取「慢慢写下来」的意思——不追热点，不赶进度，把一件事想清楚、写明白。
        </p>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl">关于我</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          一个同时做产品、设计和前端的人。白天写代码，晚上写点别的。
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl">联系</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          有问题或想交流，可以发邮件到{' '}
          <a className="text-accent-foreground" href="mailto:me@mansie.me">
            me@mansie.me
          </a>
          。
        </p>
      </section>
    </main>
  );
}
