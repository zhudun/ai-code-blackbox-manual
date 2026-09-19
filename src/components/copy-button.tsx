"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyButton({
  text,
  disabled,
  label = "复制 Markdown",
}: {
  text: string;
  disabled?: boolean;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      type="button"
      disabled={disabled || !text}
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      }}
    >
      {copied ? "已复制" : label}
    </Button>
  );
}
