import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { LIES } from "@/lib/content";

export const metadata: Metadata = {
  title: "自我欺骗",
  description: "你正在用来回避理解的八句话。",
};

export default function LiesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <PageIntro
        kicker="反模式"
        title="你正在说的八句假话"
        lede="这些话听起来像职业素养，实际是在保护速度、伤害理解。每一句都有对应的真话。对号入座比再读一篇「最佳实践」有用。"
      />

      <ol className="mt-10 divide-y divide-border border-y border-border">
        {LIES.map((item, index) => (
          <li key={item.lie} className="grid gap-4 py-6 md:grid-cols-2">
            <div>
              <p className="font-mono text-[11px] text-stamp">0{index + 1}</p>
              <h2 className="mt-2 font-serif text-2xl leading-snug">
                「{item.lie}」
              </h2>
            </div>
            <p className="text-sm leading-7 text-muted-foreground md:pt-6">
              {item.truth}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
