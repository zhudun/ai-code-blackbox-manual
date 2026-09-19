import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { RiskScore } from "@/components/risk-score";

export const metadata: Metadata = {
  title: "黑盒指数",
  description: "给一份 AI PR 打黑盒分：行数、关注点、测试作者、状态机、关键路径。",
};

export default function ScorePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <PageIntro
        kicker="自检"
        title="神秘代码量是风险指标"
        lede="覆盖率不会告诉你「团队里有几个人能讲这段」。黑盒指数会。50 分以上不准合；75 分以上是事故预告。先用默认的典型 AI PR 看你有多熟——那往往就是上周的你。"
      />
      <div className="mt-10">
        <RiskScore />
      </div>
    </div>
  );
}
