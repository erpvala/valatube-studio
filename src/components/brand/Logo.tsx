import { cn } from "@/lib/utils";

/** Original ValaTube Studio mark: rounded tile with an offset play-chevron forming a "V". */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn("size-9", className)} aria-hidden="true">
      <rect x="2" y="2" width="44" height="44" rx="13" fill="var(--primary)" />
      <path d="M16 13.5 L35 24 L16 34.5 Z" fill="var(--primary-foreground)" strokeLinejoin="round" stroke="var(--primary-foreground)" strokeWidth="3" />
      <path d="M16 13.5 L24.5 24 L16 34.5" fill="none" stroke="var(--primary)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Wordmark({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      {!compact && (
        <div className="leading-none">
          <div className="font-display text-[17px] font-bold tracking-tight">
            Vala<span className="text-primary">Tube</span>
          </div>
          <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">Studio</div>
        </div>
      )}
    </div>
  );
}

export function PoweredBy({ className }: { className?: string }) {
  return <p className={cn("text-xs text-subtle", className)}>Powered by Software Vala™</p>;
}
