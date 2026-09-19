import Link from "next/link";
import { CAUSES, MINIMUM_SYSTEM, RULES } from "@/lib/content";

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <section className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end">
        <div>
          <p className="font-mono text-[11px] tracking-[0.22em] text-stamp uppercase">
            现场手册 01
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-[1.15] tracking-tight sm:text-6xl">
            AI 写得动，
            <br />
            你讲不清，
            <br />
            就不准合。
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            问题不是模型太强。是你把理解外包了，却把责任留在自己身上。功能在，理解不在，on-call
            还在——这叫黑盒开发。它不在第一周爆，会在第三个月以「没人敢动的模块」的形式爆。
          </p>
        </div>
        <div className="rounded-lg border border-stamp/50 bg-stamp/10 p-5">
          <p className="font-mono text-[11px] tracking-[0.18em] text-stamp uppercase">
            唯一硬规则
          </p>
          <p className="mt-3 font-serif text-xl leading-8">
            90 秒内用自己的话讲不清：改了什么、为什么、失败时怎样、怎么证明——这段代码就不进主干。
          </p>
        </div>
      </section>

      <section className="mt-16 grid gap-4 md:grid-cols-3">
        {CAUSES.map((item) => (
          <article
            key={item.problem}
            className="flex flex-col rounded-lg border border-border bg-card p-5"
          >
            <h2 className="font-serif text-xl leading-snug">{item.problem}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.cause}</p>
            <p className="mt-auto pt-4 text-sm leading-7">{item.fix}</p>
          </article>
        ))}
      </section>

      <section className="mt-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-serif text-3xl tracking-tight">六条不可谈判</h2>
          <p className="hidden font-mono text-[11px] text-muted-foreground sm:block">
            缺一条，体系就塌
          </p>
        </div>
        <ol className="mt-6 divide-y divide-border border-y border-border">
          {RULES.map((rule) => (
            <li
              key={rule.id}
              className="grid gap-3 py-5 sm:grid-cols-[3rem_minmax(0,14rem)_minmax(0,1fr)] sm:gap-6"
            >
              <span className="font-mono text-sm text-stamp">0{rule.id}</span>
              <h3 className="font-serif text-lg leading-snug">{rule.title}</h3>
              <p className="text-sm leading-7 text-muted-foreground">{rule.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 grid gap-4 md:grid-cols-3">
        <ToolCard
          href="/brief"
          kicker="生成前"
          title="任务卡"
          body="先把盒子画小：不变式、接口、非目标、验证、文件范围。再让 AI 填，而不是让它发明问题。"
        />
        <ToolCard
          href="/gate"
          kicker="合并前"
          title="复述门"
          body="关掉对话，自己写行为、数据流、失败模式。不确定的函数非空 = 不准合。"
        />
        <ToolCard
          href="/score"
          kicker="自检"
          title="黑盒指数"
          body="用 diff 大小、关注点数、测试作者、状态机、关键路径打分。典型 AI PR 默认不及格。"
        />
      </section>

      <section className="mt-16 grid gap-6 rounded-lg border border-border bg-card p-6 md:grid-cols-2">
        <div>
          <h2 className="font-serif text-2xl">明天就能用的最小制度</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            不需要新工具、新 Agent、也不需要「AI 审 AI」。需要的是你重新把理解当成稀缺资源来配给。
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
              个人
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-7">
              {MINIMUM_SYSTEM.personal.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
              两人以上
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-7">
              {MINIMUM_SYSTEM.team.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function ToolCard({
  href,
  kicker,
  title,
  body,
}: {
  href: string;
  kicker: string;
  title: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-foreground/40"
    >
      <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
        {kicker}
      </p>
      <h3 className="mt-3 font-serif text-2xl group-hover:text-stamp">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{body}</p>
    </Link>
  );
}
