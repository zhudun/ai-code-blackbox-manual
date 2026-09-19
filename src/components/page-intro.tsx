export function PageIntro({
  kicker,
  title,
  lede,
}: {
  kicker: string;
  title: string;
  lede: string;
}) {
  return (
    <header className="max-w-3xl">
      <p className="font-mono text-[11px] tracking-[0.22em] text-stamp uppercase">
        {kicker}
      </p>
      <h1 className="mt-3 font-serif text-3xl leading-tight tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 text-base leading-8 text-muted-foreground sm:text-lg">
        {lede}
      </p>
    </header>
  );
}
