import { type ReactNode, useState } from "react";
import { AlertTriangle, Inbox, RefreshCw, Search, FlaskConical, Lock, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { THUMBS } from "@/data/mock";

export function PageHeader({ title, description, actions, demo = true }: { title: string; description?: string; actions?: ReactNode; demo?: boolean }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-bold sm:text-2xl">{title}</h1>
          {demo && <DemoBadge />}
        </div>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function DemoBadge({ label = "Demo data" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-warning/40 bg-warning/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-warning">
      <FlaskConical className="size-3" /> {label}
    </span>
  );
}

export function Panel({ title, action, children, className, bodyClass }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string; bodyClass?: string }) {
  return (
    <section className={cn("rounded-xl border bg-card text-card-foreground shadow-card", className)}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-2 border-b border-divider px-4 py-3">
          <h2 className="text-sm font-semibold">{title}</h2>
          {action}
        </header>
      )}
      <div className={cn("p-4", bodyClass)}>{children}</div>
    </section>
  );
}

export function KpiCard({ label, value, delta, icon: Icon, tone = "default" }: { label: string; value: string; delta?: string; icon?: React.ComponentType<{ className?: string }>; tone?: "default" | "success" | "warning" | "error" | "info" }) {
  const toneCls = { default: "text-primary bg-primary-soft", success: "text-success bg-success/10", warning: "text-warning bg-warning/10", error: "text-destructive bg-destructive/10", info: "text-info bg-info/10" }[tone];
  return (
    <div className="rounded-xl border bg-card p-4 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        {Icon && <span className={cn("grid size-8 place-items-center rounded-lg", toneCls)}><Icon className="size-4" /></span>}
      </div>
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
      {delta && <p className={cn("mt-1 text-xs", delta.startsWith("-") ? "text-destructive" : "text-success")}>{delta}</p>}
    </div>
  );
}

const STATUS: Record<string, string> = {
  published: "bg-success/15 text-success", approved: "bg-success/15 text-success", completed: "bg-success/15 text-success", connected: "bg-success/15 text-success", healthy: "bg-success/15 text-success", active: "bg-success/15 text-success", idle: "bg-success/15 text-success",
  scheduled: "bg-info/15 text-info", running: "bg-info/15 text-info", processing: "bg-info/15 text-info", busy: "bg-info/15 text-info", info: "bg-info/15 text-info",
  pending: "bg-warning/15 text-warning", draft: "bg-muted text-muted-foreground", attention: "bg-warning/15 text-warning", warning: "bg-warning/15 text-warning", paused: "bg-muted text-muted-foreground", invited: "bg-warning/15 text-warning",
  failed: "bg-destructive/15 text-destructive", rejected: "bg-destructive/15 text-destructive", error: "bg-destructive/15 text-destructive", disconnected: "bg-destructive/15 text-destructive",
  not_connected: "bg-muted text-muted-foreground", short: "bg-primary-soft text-primary", long: "bg-elevated text-foreground", success: "bg-success/15 text-success",
};
export function StatusBadge({ status, label }: { status: string; label?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize", STATUS[status] ?? "bg-muted text-muted-foreground")}>
      {label ?? status.replace("_", " ")}
    </span>
  );
}

export function SearchBox({ value, onChange, placeholder = "Search…", className }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-subtle" />
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-9 bg-surface pl-8" aria-label={placeholder} />
    </div>
  );
}

export function Chips<T extends string>({ options, value, onChange }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5" role="tablist">
      {options.map((o) => (
        <button key={o.value} role="tab" aria-selected={value === o.value} onClick={() => onChange(o.value)}
          className={cn("h-8 rounded-full border px-3 text-xs font-medium transition-colors", value === o.value ? "border-primary bg-primary text-primary-foreground" : "bg-surface text-muted-foreground hover:text-foreground")}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function EmptyState({ title = "Nothing here yet", body, action }: { title?: string; body?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-10 text-center">
      <span className="grid size-11 place-items-center rounded-full bg-elevated"><Inbox className="size-5 text-muted-foreground" /></span>
      <p className="mt-3 text-sm font-semibold">{title}</p>
      {body && <p className="mt-1 max-w-sm text-xs text-muted-foreground">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", body, onRetry }: { title?: string; body?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/40 bg-destructive/5 px-6 py-8 text-center">
      <AlertTriangle className="size-6 text-destructive" />
      <p className="mt-2 text-sm font-semibold">{title}</p>
      {body && <p className="mt-1 max-w-sm text-xs text-muted-foreground">{body}</p>}
      {onRetry && <Button size="sm" variant="outline" className="mt-3" onClick={onRetry}><RefreshCw /> Retry</Button>}
    </div>
  );
}

export function LoadingGrid({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
      {Array.from({ length: rows }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
    </div>
  );
}

export function UnavailableNote({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-info/30 bg-info/5 px-3 py-2 text-xs text-muted-foreground">
      <Lock className="mt-0.5 size-3.5 shrink-0 text-info" /><span>{children}</span>
    </div>
  );
}

export function ConfirmAction({ trigger, title, description, confirmLabel = "Confirm", onConfirm, destructive }: { trigger: ReactNode; title: string; description: string; confirmLabel?: string; onConfirm: () => void; destructive?: boolean }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className={destructive ? "bg-destructive hover:bg-destructive/90" : undefined}>{confirmLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <Button size="sm" variant="outline" onClick={async () => {
      try { await navigator.clipboard.writeText(text); setDone(true); toast.success("Copied to clipboard"); setTimeout(() => setDone(false), 1500); }
      catch { toast.error("Clipboard is not available in this browser"); }
    }}>
      {done ? <Check /> : <Copy />} {label}
    </Button>
  );
}

export function Thumb({ index, className, label }: { index: number; className?: string; label?: string }) {
  return (
    <div className={cn("relative aspect-video overflow-hidden rounded-lg bg-elevated", className)}>
      <img src={THUMBS[index % THUMBS.length]} alt={label ?? ""} loading="lazy" width={1280} height={720} className="size-full object-cover" />
      {label && <span className="absolute bottom-1.5 right-1.5 rounded bg-background/80 px-1.5 py-0.5 text-[10px] font-semibold">{label}</span>}
    </div>
  );
}

export function Field({ label, children, hint, error }: { label: string; children: ReactNode; hint?: string; error?: string }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
      {error ? <span className="block text-xs text-destructive">{error}</span> : hint ? <span className="block text-xs text-subtle">{hint}</span> : null}
    </label>
  );
}

export function Unavailable(feature: string) {
  toast.info(`${feature} is not available in Phase 01`, { description: "This needs a backend or external service (planned for Phase 02)." });
}
