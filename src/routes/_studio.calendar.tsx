import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { toast } from "sonner";
import { addDays, addMonths, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek } from "date-fns";
import { pageHead } from "@/lib/seo";
import { PageLoad } from "@/components/app/PageLoad";
import { Chips, PageHeader, Panel, StatusBadge } from "@/components/app/kit";
import { useChannel } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { channelById, DEMO_TODAY, videos as seed, type Video } from "@/data/mock";
import { useLocalState } from "@/lib/local-store";

export const Route = createFileRoute("/_studio/calendar")({
  head: pageHead("Content Calendar", "Month, week and list views of planned content."),
  component: Calendar,
});

function Card({ v, onClick }: { v: Video; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`block w-full truncate rounded px-1.5 py-0.5 text-left text-[11px] font-medium ${v.type === "short" ? "bg-primary-soft text-primary" : "bg-info/15 text-info"}`}>
      {v.type === "short" ? "▮ " : "▬ "}{v.title}
    </button>
  );
}

function Calendar() {
  const { channel } = useChannel();
  const [list, setList] = useLocalState<Video[]>("videos", seed);
  const [view, setView] = useState<"month" | "week" | "list">("month");
  const [cursor, setCursor] = useState(DEMO_TODAY);
  const [type, setType] = useState<"all" | "long" | "short">("all");
  const [sel, setSel] = useState<Video | null>(null);
  const [newDate, setNewDate] = useState("");
  const items = list.filter((v) => (channel === "all" || v.channelId === channel) && (type === "all" || v.type === type));
  const on = (d: Date) => items.filter((v) => isSameDay(new Date(v.date), d));
  const start = view === "month" ? startOfWeek(startOfMonth(cursor)) : startOfWeek(cursor);
  const end = view === "month" ? endOfWeek(endOfMonth(cursor)) : endOfWeek(cursor);
  const days: Date[] = []; for (let d = start; d <= end; d = addDays(d, 1)) days.push(d);
  const step = (n: number) => setCursor(view === "week" ? addDays(cursor, 7 * n) : addMonths(cursor, n));

  return (
    <PageLoad>
      <PageHeader title="Content Calendar" description="Rescheduling changes only local demo data." actions={<Button asChild size="sm"><Link to="/ideas"><Plus /> Create content</Link></Button>} />
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Button size="icon" variant="outline" aria-label="Previous" onClick={() => step(-1)}><ChevronLeft /></Button>
        <Button size="sm" variant="outline" onClick={() => setCursor(DEMO_TODAY)}>Today</Button>
        <Button size="icon" variant="outline" aria-label="Next" onClick={() => step(1)}><ChevronRight /></Button>
        <h2 className="ml-1 font-semibold">{view === "week" ? `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}` : format(cursor, "MMMM yyyy")}</h2>
        <div className="ml-auto flex flex-wrap gap-2">
          <Chips value={type} onChange={setType} options={[{ value: "all", label: "All" }, { value: "long", label: "Long-form" }, { value: "short", label: "Shorts" }]} />
          <Chips value={view} onChange={setView} options={[{ value: "month", label: "Month" }, { value: "week", label: "Week" }, { value: "list", label: "List" }]} />
        </div>
      </div>
      {view === "list" ? (
        <Panel bodyClass="p-0"><ul className="divide-y divide-divider">{[...items].sort((a, b) => a.date.localeCompare(b.date)).map((v) => <li key={v.id}><button onClick={() => { setSel(v); setNewDate(v.date); }} className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-elevated"><span className="w-20 text-xs text-muted-foreground">{format(new Date(v.date), "MMM d")}</span><span className="flex-1 truncate text-sm">{v.title}</span><span className="hidden text-xs text-muted-foreground sm:block">{channelById(v.channelId).name}</span><StatusBadge status={v.status} /></button></li>)}</ul></Panel>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <div className="grid min-w-[640px] grid-cols-7">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d} className="border-b border-divider px-2 py-1.5 text-xs font-semibold text-muted-foreground">{d}</div>)}
            {days.map((d) => (
              <div key={d.toISOString()} className={`border-b border-r border-divider p-1.5 ${view === "week" ? "min-h-56" : "min-h-24"} ${!isSameMonth(d, cursor) && view === "month" ? "opacity-40" : ""}`}>
                <p className={`mb-1 text-xs ${isSameDay(d, DEMO_TODAY) ? "inline-grid size-5 place-items-center rounded-full bg-primary font-bold text-primary-foreground" : "text-muted-foreground"}`}>{format(d, "d")}</p>
                <div className="space-y-1">{on(d).map((v) => <Card key={v.id} v={v} onClick={() => { setSel(v); setNewDate(v.date); }} />)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Dialog open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{sel?.title}</DialogTitle></DialogHeader>
          {sel && <div className="space-y-3"><p className="text-sm text-muted-foreground">{channelById(sel.channelId).name} · {sel.type === "short" ? "Short" : "Long-form"} · <StatusBadge status={sel.status} /></p>
            {sel.status === "published" ? <p className="text-sm">Published items can't be rescheduled.</p> : <><Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} aria-label="New date" /><Button onClick={() => { if (!newDate) return; setList(list.map((v) => (v.id === sel.id ? { ...v, date: newDate } : v))); toast.success(`Moved to ${newDate} (local simulation)`); setSel(null); }}>Reschedule</Button></>}
          </div>}
        </DialogContent>
      </Dialog>
    </PageLoad>
  );
}
