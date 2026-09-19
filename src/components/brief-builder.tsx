"use client";

import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { briefMissing, briefToMarkdown, EMPTY_BRIEF, type Brief } from "@/lib/brief";
import { usePersistentState } from "@/lib/use-persistent-state";

const FIELDS: { key: keyof Brief; label: string; hint: string; placeholder: string }[] = [
  {
    key: "goal",
    label: "目标",
    hint: "一个行为变化。不要写「优化结算模块」。",
    placeholder: "发票逾期后给财务发一封只包含金额和链接的提醒，已提醒过的当天不再发。",
  },
  {
    key: "invariants",
    label: "不变式",
    hint: "绝对不能破坏的。写不出来就不要生成。",
    placeholder: "- 不改计费金额\n- 不发客户邮件\n- 失败必须可重试且不重复发送",
  },
  {
    key: "io",
    label: "接口",
    hint: "输入、输出、错误形状。AI 最爱自己发明错误类型。",
    placeholder: "输入：invoiceId。输出：{ sent: boolean }。错误：NotFound | AlreadySentToday | MailerDown。",
  },
  {
    key: "nonGoals",
    label: "非目标",
    hint: "这次明确不做。不写这一栏，AI 会顺便重构半个系统。",
    placeholder: "- 不做订阅提醒\n- 不改邮件模板系统\n- 不抽 NotificationService",
  },
  {
    key: "verify",
    label: "验证",
    hint: "你怎么知道它对。必须是你能执行的步骤。",
    placeholder: "本地跑逾期发票夹具；断言同一天第二次调用不发信；邮件失败返回 MailerDown 且不写已发送。",
  },
  {
    key: "files",
    label: "文件范围",
    hint: "最多这些文件。超出先停。",
    placeholder: "app/billing/remind.ts, app/billing/remind.test.ts, 现有 mailer 的调用处。",
  },
];

export function BriefBuilder() {
  const [brief, setBrief] = usePersistentState<Brief>("retell-brief", EMPTY_BRIEF);
  const missing = briefMissing(brief);
  const markdown = briefToMarkdown(brief);
  const ready = missing.length === 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
      <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
        {FIELDS.map((field) => (
          <div key={field.key} className="space-y-2">
            <div className="flex items-baseline justify-between gap-3">
              <Label htmlFor={field.key}>{field.label}</Label>
              <span className="font-mono text-[10px] text-muted-foreground">
                {field.hint}
              </span>
            </div>
            <Textarea
              id={field.key}
              value={brief[field.key]}
              placeholder={field.placeholder}
              className="min-h-28 bg-card"
              onChange={(event) =>
                setBrief({ ...brief, [field.key]: event.target.value })
              }
            />
          </div>
        ))}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setBrief(EMPTY_BRIEF)}
          >
            清空
          </Button>
        </div>
      </form>

      <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            生成前检查
          </p>
          {ready ? (
            <p className="mt-3 text-sm leading-7 text-ok">
              盒子画完了。把右边这段贴进对话，再让它写。超出范围就打回。
            </p>
          ) : (
            <div className="mt-3 space-y-2">
              <p className="text-sm leading-7 text-stamp">
                还缺：{missing.map(([name]) => name).join("、") || "全部" }。
                缺一栏就开聊，等于请人装修不给图纸。
              </p>
              <p className="text-sm leading-7 text-muted-foreground">
                空状态不是「还没填完表」。空状态是你还没想清楚问题，却准备外包答案。
              </p>
            </div>
          )}
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
              可粘贴任务卡
            </p>
            <CopyButton text={markdown} disabled={!ready} />
          </div>
          <pre className="max-h-[28rem] overflow-auto font-mono text-[11px] leading-6 text-muted-foreground whitespace-pre-wrap">
            {markdown}
          </pre>
        </div>
      </aside>
    </div>
  );
}
