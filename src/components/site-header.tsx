"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-baseline gap-3">
            <span className="font-serif text-xl tracking-tight">复述门</span>
            <span className="hidden font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase sm:inline">
              Retell Gate
            </span>
          </Link>
          <p className="hidden font-mono text-[11px] text-muted-foreground md:block">
            理解是合并门槛
          </p>
        </div>
        <nav
          aria-label="手册章节"
          className="-mx-1 flex gap-1 overflow-x-auto pb-1"
        >
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "shrink-0 rounded-md px-2.5 py-1 font-mono text-xs tracking-wide transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
