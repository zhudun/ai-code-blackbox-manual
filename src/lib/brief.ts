export type Brief = {
  goal: string;
  invariants: string;
  io: string;
  nonGoals: string;
  verify: string;
  files: string;
};

export const EMPTY_BRIEF: Brief = {
  goal: "",
  invariants: "",
  io: "",
  nonGoals: "",
  verify: "",
  files: "",
};

export function briefToMarkdown(brief: Brief) {
  return [
    "## 任务卡",
    "",
    `**目标：** ${brief.goal.trim() || "（未写）"}`,
    "",
    "**不变式（绝对不能破坏）：**",
    brief.invariants.trim() || "- （未写）",
    "",
    "**接口（输入 / 输出 / 错误形状）：**",
    brief.io.trim() || "- （未写）",
    "",
    "**非目标（这次明确不做）：**",
    brief.nonGoals.trim() || "- （未写）",
    "",
    "**验证方式（我怎么知道它对）：**",
    brief.verify.trim() || "- （未写）",
    "",
    `**文件范围：** ${brief.files.trim() || "（未写）"}`,
    "",
    "**禁止：** 顺便重构、新抽象、改无关测试、扩大范围前不先问我。",
    "",
    "超出任务卡先停，问我。不要自己发明问题。",
  ].join("\n");
}

export function briefMissing(brief: Brief) {
  return (
    [
      ["目标", brief.goal],
      ["不变式", brief.invariants],
      ["接口", brief.io],
      ["非目标", brief.nonGoals],
      ["验证", brief.verify],
      ["文件范围", brief.files],
    ] as const
  ).filter(([, value]) => value.trim().length < 4);
}
