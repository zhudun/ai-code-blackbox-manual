import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { REVIEW_POINTS } from "@/lib/content";

export const metadata: Metadata = {
  title: "审 diff",
  description: "人审风险，不审美观。八个必须猎杀的点。",
};

export default function ReviewPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <PageIntro
        kicker="评审"
        title="审风险，不审美观"
        lede="不要用「这段写得真整齐」来读 AI 的 diff。用「假设这行是错的，用户会怎样」。命名、DRY、新模式，全部后置。人只负责下面八件事，别的可以粗看。"
      />

      <div className="mt-8 rounded-lg border border-border bg-card p-5 text-sm leading-7 text-muted-foreground">
        复述栏空 = 作者自己没读完，打回去，不要开始审。上下文长到看不完 = 这不是一个
        PR，是五个 PR 叠在一起，打回去。你没有义务消化别人的过载。
      </div>

      <ol className="mt-8 divide-y divide-border border-y border-border">
        {REVIEW_POINTS.map((point, index) => (
          <li
            key={point.title}
            className="grid gap-3 py-6 sm:grid-cols-[3rem_minmax(0,12rem)_minmax(0,1fr)] sm:gap-6"
          >
            <span className="font-mono text-sm text-stamp">
              0{index + 1}
            </span>
            <h2 className="font-serif text-xl leading-snug">{point.title}</h2>
            <p className="text-sm leading-7 text-muted-foreground">{point.hunt}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
