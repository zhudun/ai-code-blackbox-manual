import type { Metadata } from "next";
import { BriefBuilder } from "@/components/brief-builder";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "任务卡",
  description: "生成前把盒子画小。没写不变式、接口、非目标、验证和文件范围，就不要开聊。",
};

export default function BriefPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <PageIntro
        kicker="生成前"
        title="先画盒子，再让它填"
        lede="没写这五样就开聊，等于请人装修不给图纸。任务卡不是仪式，是你自己先把问题定义写死。想不清楚就不要生成——生成只会把糊涂变成一千行能跑的糊涂。"
      />
      <div className="mt-10">
        <BriefBuilder />
      </div>
    </div>
  );
}
