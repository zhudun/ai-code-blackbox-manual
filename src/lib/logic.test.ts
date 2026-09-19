import assert from "node:assert/strict";
import test from "node:test";
import { briefMissing, briefToMarkdown, EMPTY_BRIEF } from "./brief.ts";
import { EMPTY_GATE, judgeGate } from "./gate.ts";
import { DEFAULT_SCORE, EMPTY_SCORE, scorePr } from "./score.ts";

test("empty brief is incomplete", () => {
  assert.equal(briefMissing(EMPTY_BRIEF).length, 6);
});

test("filled brief copies a hard stop", () => {
  const md = briefToMarkdown({
    goal: "逾期发票发提醒",
    invariants: "- 不改金额",
    io: "invoiceId -> { sent }",
    nonGoals: "- 不做订阅",
    verify: "跑 remind.test.ts",
    files: "remind.ts",
  });
  assert.match(md, /禁止：/);
  assert.match(md, /超出任务卡先停/);
});

test("empty gate rejects", () => {
  const verdict = judgeGate(EMPTY_GATE);
  assert.equal(verdict.status, "reject");
  assert.equal(verdict.title, "不准合");
});

test("vague behavior rejects", () => {
  const verdict = judgeGate({
    ...EMPTY_GATE,
    behavior: "优化了结算模块让整个流程更干净更好维护",
    flow: "从入口到出口经过校验然后写库再返回",
    failures: "- a\n- b\n- c",
    uncertain: "",
    verify: "跑现有测试看绿",
    testFingerprint: true,
    humanWritten: true,
  });
  assert.equal(verdict.status, "reject");
  assert.ok(verdict.reasons.some((reason) => reason.includes("优化")));
});

test("uncertain functions block merge", () => {
  const verdict = judgeGate({
    behavior: "逾期发票现在会给财务发提醒且同一天只发一封",
    flow: "从 remind(invoiceId) 读发票，过期且今日未发则调 mailer，成功写 sentAt 返回 sent",
    failures: "- mailer 超时\n- 发票不存在\n- 并发点两次",
    uncertain: "retry helper 没看懂",
    verify: "跑 remind.test.ts 并打本地接口",
    testFingerprint: true,
    humanWritten: true,
  });
  assert.equal(verdict.status, "reject");
  assert.ok(verdict.reasons.some((reason) => reason.includes("不确定")));
});

test("complete human retell can pass", () => {
  const verdict = judgeGate({
    behavior: "逾期发票现在会给财务发提醒且同一天只发一封",
    flow: "从 remind(invoiceId) 读发票，过期且今日未发则调 mailer，成功写 sentAt，已发送或未逾期返回 false。外部失败不写 sentAt。",
    failures: "- mailer 超时返回 MailerDown\n- 发票不存在返回 NotFound\n- 并发第二次 AlreadySentToday",
    uncertain: "",
    verify: "跑 remind.test.ts，再用过期发票打本地接口",
    testFingerprint: true,
    humanWritten: true,
  });
  assert.equal(verdict.status, "pass");
});

test("typical AI PR is an incident warning", () => {
  const result = scorePr(DEFAULT_SCORE);
  assert.ok(result.score >= 75);
  assert.equal(result.status, "incident");
});

test("tight human PR scores as mergeable", () => {
  const result = scorePr(EMPTY_SCORE);
  assert.ok(result.score < 25);
  assert.equal(result.status, "ok");
});
