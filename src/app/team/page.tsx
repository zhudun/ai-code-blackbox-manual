import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { TEAM_RULES } from "@/lib/content";

export const metadata: Metadata = {
  title: "团队",
  description: "个人习惯撑不过三个月。用能讲清楚的人数管理模块。",
};

export default function TeamPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <PageIntro
        kicker="制度"
        title="个人习惯撑不过三个月"
        lede="一个人还能靠羞耻感撑一阵。三个人以上，默认就会变成「反正测试绿了」。把神秘代码量当成风险指标来管，比再买一个 AI 评审 bot 有用。"
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {TEAM_RULES.map((rule) => (
          <article
            key={rule.title}
            className="rounded-lg border border-border bg-card p-5"
          >
            <h2 className="font-serif text-xl leading-snug">{rule.title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {rule.body}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
