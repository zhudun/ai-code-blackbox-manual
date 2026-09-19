"use client";

import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EMPTY_GATE, judgeGate, type GateForm } from "@/lib/gate";
import { usePersistentState } from "@/lib/use-persistent-state";
import { cn } from "@/lib/utils";

const FIELDS: {
  key: keyof Pick<GateForm, "behavior" | "flow" | "failures" | "uncertain" | "verify">;
  label: string;
  hint: string;
  placeholder: string;
}[] = [
  {
    key: "behavior",
    label: "一句话：系统多了或少了什么行为",
    hint: "禁止写优化、重构、完善。",
    placeholder: "逾期发票现在会给财务发提醒，同一张票同一天最多一封。",
  },
  {
    key: "flow",
    label: "数据怎么流",
    hint: "入口 → 分叉 → 出口。",
    placeholder: "从 remind(invoiceId) 读发票 → 过期且今日未发则调 mailer → 成功写 sentAt → 返回 sent。已发送或未逾期直接返回 false。",
  },
  {
    key: "failures",
    label: "三个失败模式",
    hint: "一行一个。少于三个不准合。",
    placeholder: "- mailer 超时：返回 MailerDown，不写 sentAt\n- invoice 不存在：NotFound\n- 并发点两次：第二次 AlreadySentToday",
  },
  {
    key: "uncertain",
    label: "我不确定的函数（有就不准合）",
    hint: "诚实比速度贵。空着才能过门。",
    placeholder: "空着。若你要写「helper 里那段重试我没看懂」——停下，不准合。",
  },
  {
    key: "verify",
    label: "我准备怎么验证",
    hint: "命令、请求、或那条你改过的断言。",
    placeholder: "跑 remind.test.ts；再用一条过期发票打本地接口，看只发出一封。",
  },
];

function toPrBody(form: GateForm) {
  return [
    "## 复述",
    "",
    `**行为：** ${form.behavior.trim()}`,
    "",
    `**数据流：** ${form.flow.trim()}`,
    "",
    "**失败模式：**",
    form.failures.trim(),
    "",
    `**不确定：** ${form.uncertain.trim() || "无"}`,
    "",
    `**验证：** ${form.verify.trim()}`,
    "",
    `- 测试期望值有我的指纹：${form.testFingerprint ? "是" : "否"}`,
    `- 这段复述是我写的：${form.humanWritten ? "是" : "否"}`,
  ].join("\n");
}

export function RetellGate() {
  const [form, setForm] = usePersistentState<GateForm>("retell-gate", EMPTY_GATE);
  const verdict = judgeGate(form);
  const empty =
    !form.behavior &&
    !form.flow &&
    !form.failures &&
    !form.uncertain &&
    !form.verify &&
    !form.testFingerprint &&
    !form.humanWritten;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
      <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
        {FIELDS.map((field) => (
          <div key={field.key} className="space-y-2">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <Label htmlFor={field.key}>{field.label}</Label>
              <span className="font-mono text-[10px] text-muted-foreground">
                {field.hint}
              </span>
            </div>
            <Textarea
              id={field.key}
              value={form[field.key]}
              placeholder={field.placeholder}
              className="min-h-28 bg-card"
              onChange={(event) =>
                setForm({ ...form, [field.key]: event.target.value })
              }
            />
          </div>
        ))}

        <label className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
          <Checkbox
            checked={form.testFingerprint}
            onCheckedChange={(checked) =>
              setForm({ ...form, testFingerprint: checked === true })
            }
          />
          <span className="text-sm leading-6">
            核心路径的期望值是我想的，或我亲手改过。不是整份测试都是模型生成后原样提交。
          </span>
        </label>

        <label className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
          <Checkbox
            checked={form.humanWritten}
            onCheckedChange={(checked) =>
              setForm({ ...form, humanWritten: checked === true })
            }
          />
          <span className="text-sm leading-6">
            以上复述是我合上对话自己写的。不是让 AI「顺便写个 PR 描述」。
          </span>
        </label>

        <Button type="button" variant="outline" onClick={() => setForm(EMPTY_GATE)}>
          清空
        </Button>
      </form>

      <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
        <div
          className={cn(
            "rounded-lg border p-5",
            verdict.status === "pass" && "border-ok/50 bg-ok/10",
            verdict.status === "debt" && "border-warn/50 bg-warn/10",
            verdict.status === "reject" && "border-stamp/60 bg-stamp/10"
          )}
        >
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase">
            {empty ? "空复述" : "当场裁决"}
          </p>
          <p className="mt-2 font-serif text-3xl tracking-tight">
            {empty ? "还没写" : verdict.title}
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-7">
            {empty ? (
              <li>你还什么都没写。这就是大多数已经点了 Merge 的 PR 的真实状态。</li>
            ) : (
              verdict.reasons.map((reason) => <li key={reason}>{reason}</li>)
            )}
          </ul>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
              贴进 PR
            </p>
            <CopyButton
              text={toPrBody(form)}
              disabled={verdict.status === "reject"}
              label="复制复述"
            />
          </div>
          <p className="text-sm leading-7 text-muted-foreground">
            复述栏空的 PR，评审有权不看直接打回。作者自己都没读完，你更不必读。
          </p>
        </div>
      </aside>
    </div>
  );
}
