"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  DEFAULT_SCORE,
  EMPTY_SCORE,
  scorePr,
  type ScoreInput,
} from "@/lib/score";
import { usePersistentState } from "@/lib/use-persistent-state";
import { cn } from "@/lib/utils";

export function RiskScore() {
  const [input, setInput] = usePersistentState<ScoreInput>(
    "retell-score",
    DEFAULT_SCORE
  );
  const result = scorePr(input);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
      <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
        <p className="text-sm leading-7 text-muted-foreground">
          默认值是一份典型的 AI PR：四百行、四个关注点、测试是它写的、你画不出状态机。
          先看分数被什么拉爆，再决定你要不要承认这就是你上周合进去的东西。
        </p>

        <NumberField
          label="有效业务 diff 行数"
          hint="不含 lockfile / 生成物。"
          value={input.lines}
          min={0}
          max={5000}
          onChange={(lines) => setInput({ ...input, lines })}
        />
        <NumberField
          label="一个 PR 里的关注点数"
          hint="行为、重构、抽象、改配置，各算一个。"
          value={input.concerns}
          min={1}
          max={12}
          onChange={(concerns) => setInput({ ...input, concerns })}
        />
        <NumberField
          label="这次新发明的抽象"
          hint="BaseXxx、utils、wrapper、策略层。"
          value={input.abstractions}
          min={0}
          max={20}
          onChange={(abstractions) => setInput({ ...input, abstractions })}
        />
        <NumberField
          label="你讲不清的函数个数"
          hint="大于 0 就不该合。"
          value={input.uncertain}
          min={0}
          max={50}
          onChange={(uncertain) => setInput({ ...input, uncertain })}
        />

        <fieldset className="space-y-2">
          <Label>测试是谁写的</Label>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["ai", "全是 AI"],
                ["mixed", "混血"],
                ["human", "期望值是我定的"],
              ] as const
            ).map(([value, label]) => (
              <Button
                key={value}
                type="button"
                variant={input.tests === value ? "default" : "outline"}
                onClick={() => setInput({ ...input, tests: value })}
              >
                {label}
              </Button>
            ))}
          </div>
        </fieldset>

        <label className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
          <Checkbox
            checked={input.canDraw}
            onCheckedChange={(checked) =>
              setInput({ ...input, canDraw: checked === true })
            }
          />
          <span className="text-sm leading-6">
            我能不看代码画出这段改动的状态机（入口、分叉、成功、失败）。
          </span>
        </label>
        <label className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
          <Checkbox
            checked={input.critical}
            onCheckedChange={(checked) =>
              setInput({ ...input, critical: checked === true })
            }
          />
          <span className="text-sm leading-6">
            这是关键路径：支付、权限、删除、迁移、加密、配额。
          </span>
        </label>
        <label className="flex items-start gap-3 rounded-lg border border-border bg-card p-3">
          <Checkbox
            checked={input.observability}
            onCheckedChange={(checked) =>
              setInput({ ...input, observability: checked === true })
            }
          />
          <span className="text-sm leading-6">
            对外行为有开始 / 成功 / 失败日志，字段能重建请求。
          </span>
        </label>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setInput(DEFAULT_SCORE)}
          >
            典型 AI PR
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setInput(EMPTY_SCORE)}
          >
            收敛后的样子
          </Button>
        </div>
      </form>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div
          className={cn(
            "rounded-lg border p-5",
            result.status === "ok" && "border-ok/50 bg-ok/10",
            result.status === "debt" && "border-warn/50 bg-warn/10",
            (result.status === "reject" || result.status === "incident") &&
              "border-stamp/60 bg-stamp/10"
          )}
        >
          <p className="font-mono text-[11px] tracking-[0.22em] uppercase">
            黑盒指数
          </p>
          <p className="mt-2 font-serif text-5xl tracking-tight tabular-nums">
            {result.score}
          </p>
          <p className="mt-2 font-serif text-2xl">{result.title}</p>
          <Progress value={result.score} className="mt-5">
            <span className="sr-only">黑盒指数 {result.score}</span>
          </Progress>
          <ul className="mt-5 space-y-2 text-sm leading-7">
            {result.drivers.map((driver) => (
              <li key={driver}>{driver}</li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

function NumberField({
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <Label>{label}</Label>
        <span className="font-mono text-[10px] text-muted-foreground">{hint}</span>
      </div>
      <Input
        type="number"
        min={min}
        max={max}
        value={Number.isFinite(value) ? value : 0}
        className="bg-card"
        onChange={(event) => {
          const next = Number(event.target.value);
          onChange(Number.isFinite(next) ? Math.min(max, Math.max(min, next)) : min);
        }}
      />
    </div>
  );
}
