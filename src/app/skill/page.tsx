import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "Skill",
  description: "复述门 Skill：分析 HEAD 或指定 commit，写出能当 PR 说明的复述文档。",
};

export default function SkillPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <PageIntro
        kicker="可执行"
        title="对着提交复述，不要对着空气总结"
        lede="手册讲的是制度。Skill 逼模型去做那套制度：读 diff 和函数上下文，按关注点切开，难懂的单独标红，风险写成排查步骤，最后给 90 秒口播。不确定的函数必须写进文档。写不出来就写不准合。"
      />

      <section className="mt-10 space-y-4">
        <h2 className="font-serif text-3xl tracking-tight">怎么装</h2>
        <p className="text-sm leading-7 text-muted-foreground">
          完整说明在{" "}
          <code className="font-mono text-foreground">
            .cursor/skills/retell-gate/INSTALL.md
          </code>
          。下面三层不要混。
        </p>
        <ol className="space-y-4">
          <li className="rounded-lg border border-border bg-card p-5">
            <p className="font-mono text-[11px] tracking-[0.18em] text-stamp uppercase">
              1 · 没有上架市场
            </p>
            <p className="mt-3 text-sm leading-7">
              没发 npm，没走 Cursor Marketplace。仓库里也没有 marketplace
              清单。skills.sh 若出现同名页，只是按 GitHub 的 owner/repo
              做发现，文件不托管在那儿。
            </p>
          </li>
          <li className="rounded-lg border border-border bg-card p-5">
            <p className="font-mono text-[11px] tracking-[0.18em] text-stamp uppercase">
              2 · 只从 GitHub 拿
            </p>
            <p className="mt-3 text-sm leading-7">
              <a
                href="https://github.com/zhudun/ai-code-blackbox-manual"
                className="underline underline-offset-4"
              >
                github.com/zhudun/ai-code-blackbox-manual
              </a>
              。
              <code className="font-mono text-foreground">
                npx skills add zhudun/ai-code-blackbox-manual
              </code>{" "}
              和 git clone 拉的是同一份。Skill 在{" "}
              <code className="font-mono text-foreground">
                .cursor/skills/retell-gate/
              </code>
              ，不要把整个 Next.js 站点拷进 skills 目录。
            </p>
          </li>
          <li className="rounded-lg border border-border bg-card p-5">
            <p className="font-mono text-[11px] tracking-[0.18em] text-stamp uppercase">
              3 · 拿到 ≠ 已安装
            </p>
            <p className="mt-3 text-sm leading-7">
              要在任意项目里用，把这一层拷到本机：
            </p>
            <pre className="mt-3 overflow-auto font-mono text-[12px] leading-6 text-muted-foreground">
              {`git clone https://github.com/zhudun/ai-code-blackbox-manual.git
mkdir -p ~/.cursor/skills
cp -R ai-code-blackbox-manual/.cursor/skills/retell-gate \\
  ~/.cursor/skills/retell-gate`}
            </pre>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              确认{" "}
              <code className="font-mono text-foreground">
                ~/.cursor/skills/retell-gate/SKILL.md
              </code>{" "}
              在。然后打开你要复述的业务仓库，说「分析最新提交」。没拷这一步，本机就还没装。
            </p>
          </li>
        </ol>
      </section>

      <section className="mt-12 grid gap-4 md:grid-cols-2">
        <article className="rounded-lg border border-border bg-card p-5">
          <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            怎么用
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-7">
            <li>「分析最新提交」→ 复述 HEAD</li>
            <li>「复述 abc1234」→ 指定 hash</li>
            <li>「给这个 commit 写 PR 说明」</li>
            <li>「这段 AI 代码我看不懂」</li>
            <li>工作区还没 commit：说清「看工作区」</li>
          </ul>
        </article>
        <article className="rounded-lg border border-border bg-card p-5">
          <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            落在哪
          </p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Skill 文件在{" "}
            <code className="font-mono text-foreground">
              .cursor/skills/retell-gate/SKILL.md
            </code>
            。跑完应写出{" "}
            <code className="font-mono text-foreground">
              docs/retell/日期-短号.md
            </code>
            ，对话里只回 90 秒复述和裁决。
          </p>
        </article>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-3xl tracking-tight">触发之后它必须做的事</h2>
        <ol className="mt-6 divide-y divide-border border-y border-border">
          {[
            ["锁目标", "HEAD、hash、工作区或 range。hash 不存在就停，不准猜。"],
            ["取证", "stat、完整 diff、改动函数的全文、调用方、测试期望值。只看 --stat 就开写，等于没看。"],
            ["按关注点切", "每个关注点必须能说「系统多了或少了什么」。文件流水账禁止。"],
            ["难懂单列", "抽象层、隐式状态、吞错、你画不出的分支。写路径和符号，不准写「比较复杂」。"],
            ["风险对上八件事", "吞错、边界、耦合、并发、兼容、权限、日志、回滚。排查命令必须具体到这次 diff。"],
            ["90 秒复述 + 裁决", "超过 8 句就删。不确定非空 = 不准合。然后落盘。"],
          ].map(([title, body], index) => (
            <li
              key={title}
              className="grid gap-3 py-5 sm:grid-cols-[3rem_minmax(0,12rem)_minmax(0,1fr)]"
            >
              <span className="font-mono text-sm text-stamp">0{index + 1}</span>
              <h3 className="font-serif text-xl">{title}</h3>
              <p className="text-sm leading-7 text-muted-foreground">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-3xl tracking-tight">文档骨架</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          完整模板在{" "}
          <code className="font-mono text-foreground">
            .cursor/skills/retell-gate/template.md
          </code>
          。下面是评审一眼该看到的节。假复述对照见{" "}
          <code className="font-mono text-foreground">anti-patterns.md</code>。
        </p>
        <pre className="mt-5 overflow-auto rounded-lg border border-border bg-card p-5 font-mono text-[12px] leading-6 text-muted-foreground">
          {`# 复述：<一句话行为变化>
- 目标 / SHA / 裁决
## 90 秒复述
## 行为变化
## 关注点（做什么 / 为什么 / 数据流 / 三个失败）
## 难懂清单
## 风险（八行表 + 怎么查）
## 出问题怎么排
## 怎么证明它对
## 不确定
## 给作者的下一步`}
        </pre>
      </section>

      <section className="mt-12 rounded-lg border border-stamp/50 bg-stamp/10 p-5">
        <p className="font-mono text-[11px] tracking-[0.18em] text-stamp uppercase">
          这份 Skill 不替你懂
        </p>
        <p className="mt-3 text-sm leading-7">
          模型仍可能把没看懂的函数写得很顺。所以不确定栏是硬门槛：空才能过。你要做的是对着 90
          秒复述讲给别人听。讲不出来，文档就是假的，打回去。
        </p>
      </section>
    </div>
  );
}
