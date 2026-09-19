import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { DEBUG_STEPS } from "@/lib/content";

export const metadata: Metadata = {
  title: "调试",
  description: "出问题先重建状态机。不要把 stacktrace 丢给模型当第一反应。",
};

export default function DebugPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <PageIntro
        kicker="出事时"
        title="先重建模型，再生成补丁"
        lede="调试慢，不是因为你生疏了快捷键，是因为你对这段代码没有心理模型。每次都是第一次读。默认动作如果是把报错丢给 AI，你不是在调试，你是在叠加第二层黑盒。"
      />

      <ol className="mt-10 space-y-4">
        {DEBUG_STEPS.map((step) => (
          <li
            key={step.n}
            className="grid gap-3 rounded-lg border border-border bg-card p-5 sm:grid-cols-[3rem_minmax(0,1fr)]"
          >
            <span className="font-mono text-sm text-stamp">{step.n}</span>
            <div>
              <h2 className="font-serif text-xl">{step.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
