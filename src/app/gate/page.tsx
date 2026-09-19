import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { RetellGate } from "@/components/retell-gate";

export const metadata: Metadata = {
  title: "复述门",
  description: "合并前用自己的话复述行为、数据流和失败模式。不确定就不准合。",
};

export default function GatePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <PageIntro
        kicker="合并前"
        title="关掉对话，自己写"
        lede="让 AI 写 PR 描述再合并，是正式的自我欺骗。复述必须在你合上对话之后发生。不确定的函数只要有一条，就回去读、删、或缩小。不准把「明天再看」写进主干。"
      />
      <div className="mt-10">
        <RetellGate />
      </div>
    </div>
  );
}
