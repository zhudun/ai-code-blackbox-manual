export type GateForm = {
  behavior: string;
  flow: string;
  failures: string;
  uncertain: string;
  verify: string;
  testFingerprint: boolean;
  humanWritten: boolean;
};

export const EMPTY_GATE: GateForm = {
  behavior: "",
  flow: "",
  failures: "",
  uncertain: "",
  verify: "",
  testFingerprint: false,
  humanWritten: false,
};

const VAGUE = /(优化了|重构了|完善了|修复了一些|更新了代码|提升了|改进了|做了调整|clean up|refactor)/i;

export type GateVerdict = {
  status: "reject" | "debt" | "pass";
  title: string;
  reasons: string[];
};

function lineCount(text: string) {
  return text
    .split(/\n|[；;]/)
    .map((line) => line.replace(/^[-*\d.\s]+/, "").trim())
    .filter((line) => line.length > 1).length;
}

export function judgeGate(form: GateForm): GateVerdict {
  const reasons: string[] = [];
  let reject = false;
  let debt = false;

  if (form.behavior.trim().length < 18) {
    reasons.push("行为变化写得太短。一句话说不清，就是你还没读完。");
    reject = true;
  } else if (VAGUE.test(form.behavior) && form.behavior.trim().length < 40) {
    reasons.push("「优化/重构/完善」不是行为变化。写出用户或系统多了什么、少了什么。");
    reject = true;
  }

  if (form.flow.trim().length < 24) {
    reasons.push("数据流太虚。从入口写到出口，经过哪些分叉。");
    reject = true;
  }

  if (lineCount(form.failures) < 3) {
    reasons.push("失败模式少于三个。至少覆盖：外部依赖挂了、脏输入、部分失败或重入。");
    reject = true;
  }

  if (form.uncertain.trim().length > 0) {
    reasons.push(
      `你列出了不确定的地方：「${form.uncertain.trim().slice(0, 80)}」。不确定就不准合。回去读、删、或缩小范围。`
    );
    reject = true;
  }

  if (form.verify.trim().length < 12) {
    reasons.push("验证方式是空的。你准备怎么证明它对——命令、请求、还是那条断言？");
    reject = true;
  }

  if (!form.testFingerprint) {
    reasons.push("测试期望值没有你的指纹。AI 给自己出的卷，不算证据。");
    reject = true;
  }

  if (!form.humanWritten) {
    reasons.push("复述不是你写的。让模型代写描述再合并，是正式的自我欺骗。");
    reject = true;
  }

  if (form.flow.trim().length > 0 && form.flow.trim().length < 60) {
    debt = true;
    if (!reject) {
      reasons.push("数据流能过门，但偏薄。合之前再对着 diff 走一遍分叉。");
    }
  }

  if (reject) {
    return {
      status: "reject",
      title: "不准合",
      reasons:
        reasons.length > 0
          ? reasons
          : ["还没写完。空的复述门就是大多数 PR 的真实状态。"],
    };
  }

  if (debt) {
    return {
      status: "debt",
      title: "勉强可合，但有债",
      reasons,
    };
  }

  return {
    status: "pass",
    title: "可以合",
    reasons: [
      "你能讲清行为、数据流、失败和验证，而且测试有你的指纹。这才叫拥有这段代码。",
    ],
  };
}
