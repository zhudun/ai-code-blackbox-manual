export type ScoreInput = {
  lines: number;
  concerns: number;
  tests: "ai" | "mixed" | "human";
  canDraw: boolean;
  critical: boolean;
  abstractions: number;
  uncertain: number;
  observability: boolean;
};

export const DEFAULT_SCORE: ScoreInput = {
  lines: 420,
  concerns: 4,
  tests: "ai",
  canDraw: false,
  critical: false,
  abstractions: 2,
  uncertain: 3,
  observability: false,
};

export const EMPTY_SCORE: ScoreInput = {
  lines: 80,
  concerns: 1,
  tests: "human",
  canDraw: true,
  critical: false,
  abstractions: 0,
  uncertain: 0,
  observability: true,
};

export type ScoreResult = {
  score: number;
  status: "ok" | "debt" | "reject" | "incident";
  title: string;
  drivers: string[];
};

export function scorePr(input: ScoreInput): ScoreResult {
  let score = 0;
  const drivers: string[] = [];

  if (input.lines > 400) {
    score += 25;
    drivers.push(`有效业务 diff ${input.lines} 行，已经超过人能认真审完的上限。`);
  } else if (input.lines > 200) {
    score += 15;
    drivers.push(`diff ${input.lines} 行，评审会开始跳。能拆就拆。`);
  } else if (input.lines > 80) {
    score += 6;
  }

  if (input.concerns > 1) {
    const add = Math.min(30, (input.concerns - 1) * 10);
    score += add;
    drivers.push(
      `一个 PR 里塞了 ${input.concerns} 个关注点。人脑必漏，漏的就是坑。`
    );
  }

  if (input.tests === "ai") {
    score += 25;
    drivers.push("测试全是 AI 写的：循环论证，绿条证明不了正确。");
  } else if (input.tests === "mixed") {
    score += 10;
    drivers.push("测试是混血。核心断言必须能指出哪几条是你定的。");
  }

  if (!input.canDraw) {
    score += 20;
    drivers.push("你画不出状态机。没有心理模型，出了问题你只能继续问 AI。");
  }

  if (input.critical) {
    score += 15;
    drivers.push("关键路径上的黑盒不是技术债，是事故预告。必须人手重写核心分支。");
  }

  if (input.abstractions > 0) {
    score += Math.min(15, input.abstractions * 5);
    drivers.push(
      `新增 ${input.abstractions} 个抽象。默认拒绝，除非你能证明三次重复。`
    );
  }

  if (input.uncertain > 0) {
    score += Math.min(20, input.uncertain * 5);
    drivers.push(`有 ${input.uncertain} 处你讲不清。讲不清的函数不准进主干。`);
  }

  if (!input.observability) {
    score += 10;
    drivers.push("对外行为没有开始/成功/失败日志。出事时你在盲飞。");
  }

  score = Math.min(100, score);

  if (score >= 75) {
    return { score, status: "incident", title: "事故预告", drivers };
  }
  if (score >= 50) {
    return { score, status: "reject", title: "黑盒，不准合", drivers };
  }
  if (score >= 25) {
    return { score, status: "debt", title: "有债，先拆或走读", drivers };
  }
  return {
    score,
    status: "ok",
    title: "可合，债很少",
    drivers:
      drivers.length > 0
        ? drivers
        : ["范围小、你能讲、测试有指纹、没有新抽象。这才是该有的默认态。"],
  };
}
