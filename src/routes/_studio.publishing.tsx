import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarClock, Trash2, Upload, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { pageHead } from "@/lib/seo";
import { PageLoad } from "@/components/app/PageLoad";
import { Chips, ConfirmAction, EmptyState, Field, PageHeader, SearchBox, StatusBadge, Thumb, UnavailableNote } from "@/components/app/kit";
import { useChannel } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { channelById, fmt, videos as seed, type Video, type VideoStatus } from "@/data/mock";
import { useLocalState } from "@/lib/local-store";
import { validateSchedule } from "@/lib/schedule";

export const Route = createFileRoute("/_studio/publishing")({
  head: pageHead("Publishing Manager", "Drafts, scheduled, published and failed content."),
  component: Publishing,
  validateSearch: (search: Record<string, unknown>): { video?: string } => typeof search["video"] === "string" ? { video: search["video"] } : {},
});

type Filter = "all" | VideoStatus;
const CHECK = ["Title & description reviewed", "Thumbnail approved", "Captions attached", "Age/rights declarations confirmed"];

function Publishing() {
  const { video: selectedVideo } = Route.useSearch();
  const { channel } = useChannel();
  const [list, setList] = useLocalState<Video[]>("videos", seed);
  const [f, setF] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState<Video | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("18:00");
  const [checks, setChecks] = useState<boolean[]>([]);
  const [err, setErr] = useState("");
  const [upload, setUpload] = useState<number | null>(null);

  useEffect(() => {
    if (upload === null || upload >= 100) return;
    const t = setTimeout(() => setUpload(Math.min(100, upload + 12)), 220);
    return () => clearTimeout(t);
  }, [upload]);

  const rows = list.filter((v) => (!selectedVideo || v.id === selectedVideo) && (channel === "all" || v.channelId === channel) && (f === "all" || v.status === f) && v.title.toLowerCase().includes(q.toLowerCase()));
  const count = (s: VideoStatus) => list.filter((v) => (channel === "all" || v.channelId === channel) && v.status === s).length;
  const open = (v: Video) => { setEdit(v); setDate(v.date); setTime(v.time ?? "18:00"); setChecks(CHECK.map(() => false)); setErr(""); setUpload(null); };
  const schedule = () => {
    if (!edit) return;
    const error = validateSchedule(date, time, checks);
    if (error) return setErr(error);
    setList(list.map((v) => (v.id === edit.id ? { ...v, status: "scheduled", date, time } : v)));
    toast.success("Scheduled in ValaTube (simulation)", { description: "Nothing was sent to YouTube." });
    setEdit(null);
  };

  return (
    <PageLoad>
      <PageHeader title="Publishing Manager" description="Local simulation only — no videos are uploaded, scheduled or published on YouTube." />
      {selectedVideo && <Button asChild variant="outline" className="mb-3"><a href="/publishing">Show all content</a></Button>}
      <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-center">
        <Chips value={f} onChange={setF} options={[{ value: "all", label: "All" }, { value: "draft", label: `Drafts ${count("draft")}` }, { value: "scheduled", label: `Scheduled ${count("scheduled")}` }, { value: "published", label: `Published ${count("published")}` }, { value: "processing", label: `Processing ${count("processing")}` }, { value: "failed", label: `Failed ${count("failed")}` }]} />
        <SearchBox value={q} onChange={setQ} placeholder="Search videos…" className="lg:ml-auto lg:w-64" />
      </div>
      {rows.length === 0 ? <EmptyState title="No content in this view" body="Try another status or channel." /> : (
        <div className="space-y-2">
          {rows.map((v) => (
            <div key={v.id} className="flex flex-col gap-3 rounded-xl border bg-card p-3 sm:flex-row sm:items-center">
              <Thumb index={v.thumb} label={v.duration} className="sm:w-40 sm:shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{v.title}</p>
                <p className="text-xs text-muted-foreground">{channelById(v.channelId).name} · {v.type === "short" ? "Short" : "Long-form"} · {v.status === "published" ? `${fmt(v.views)} views` : `${v.date}${v.time ? ` · ${v.time}` : ""}`}</p>
                <div className="mt-1"><StatusBadge status={v.status} /></div>
              </div>
              <div className="flex gap-2">
                {(v.status === "draft" || v.status === "scheduled") && <Button size="sm" variant="outline" onClick={() => open(v)}><CalendarClock /> {v.status === "draft" ? "Schedule" : "Reschedule"}</Button>}
                {v.status === "failed" && <Button size="sm" variant="outline" onClick={() => { setList(list.map((x) => (x.id === v.id ? { ...x, status: "draft" } : x))); toast("Moved back to drafts"); }}><RotateCcw /> Retry as draft</Button>}
                {v.status !== "published" && <ConfirmAction destructive title="Delete this item?" description={`“${v.title}” will be removed from this browser's demo data.`} confirmLabel="Delete" onConfirm={() => { setList(list.filter((x) => x.id !== v.id)); toast("Deleted"); }} trigger={<Button size="icon" variant="ghost" aria-label="Delete"><Trash2 /></Button>} />}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto">
          <DialogHeader><DialogTitle>Schedule: {edit?.title}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date"><Input type="date" value={date} onChange={(e) => { setDate(e.target.value); setErr(""); }} /></Field>
            <Field label="Time"><Input type="time" value={time} onChange={(e) => setTime(e.target.value)} /></Field>
          </div>
          <div className="rounded-lg bg-elevated p-3 text-xs"><p className="font-semibold">Metadata preview</p><p className="mt-1 text-muted-foreground">{edit?.title} · {edit && channelById(edit.channelId).name}</p></div>
          <div className="space-y-2"><p className="text-xs font-medium text-muted-foreground">Publishing checklist</p>{CHECK.map((c, i) => <label key={c} className="flex items-center gap-2 text-sm"><Checkbox checked={!!checks[i]} onCheckedChange={(v) => { const n = [...checks]; n[i] = !!v; setChecks(n); setErr(""); }} />{c}</label>)}</div>
          <div className="space-y-2">
            <Button size="sm" variant="outline" onClick={() => setUpload(0)} disabled={upload !== null && upload < 100}><Upload /> Upload demo</Button>
            {upload !== null && <><Progress value={upload} className="h-2" /><p className="text-xs text-muted-foreground">{upload < 100 ? `Simulated upload ${upload}%` : "Simulated upload finished — no file left your device."}</p></>}
          </div>
          <UnavailableNote>Real YouTube scheduling requires channel authorization (Phase 02).</UnavailableNote>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <DialogFooter><Button variant="outline" onClick={() => setEdit(null)}>Cancel</Button><Button onClick={schedule}>Confirm schedule</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLoad>
  );
}
