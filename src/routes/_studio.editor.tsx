import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Play, Pause, Scissors, Save, Download, SkipBack, Type, Music, Film } from "lucide-react";
import { toast } from "sonner";
import { pageHead } from "@/lib/seo";
import { PageLoad } from "@/components/app/PageLoad";
import { Field, PageHeader, Panel, Thumb, Unavailable } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLocalState } from "@/lib/local-store";

export const Route = createFileRoute("/_studio/editor")({
  head: pageHead("Video Editor", "Timeline with video, audio and subtitle tracks (demo)."),
  component: Editor,
});

type Clip = { id: string; name: string; start: number; len: number; thumb: number };
const CLIPS: Clip[] = [
  { id: "c1", name: "Cold open", start: 0, len: 6, thumb: 0 }, { id: "c2", name: "Intro", start: 6, len: 18, thumb: 0 },
  { id: "c3", name: "Processor", start: 24, len: 40, thumb: 3 }, { id: "c4", name: "Battery", start: 64, len: 30, thumb: 2 }, { id: "c5", name: "Outro", start: 94, len: 16, thumb: 0 },
];
const TOTAL = 110;

function Editor() {
  const [clips, setClips] = useLocalState<Clip[]>("editor-clips", CLIPS);
  const [sel, setSel] = useState("c1");
  const [t, setT] = useState([0]);
  const t0 = t[0] ?? 0;
  const [playing, setPlaying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [res, setRes] = useState("1080p");
  const cur = clips.find((c) => c.start <= t0 && t0 < c.start + c.len) ?? clips[0] ?? CLIPS[0]!;
  const total = clips.reduce((a, c) => Math.max(a, c.start + c.len), TOTAL);

  const split = () => {
    const c = clips.find((x) => x.id === sel);
    if (!c || t0 <= c.start || t0 >= c.start + c.len) { toast.error("Move the playhead inside the selected clip to split it"); return; }
    const a = { ...c, len: t0 - c.start }; const b = { ...c, id: `${c.id}b${Date.now()}`, name: `${c.name} (2)`, start: t0, len: c.start + c.len - t0 };
    setClips(clips.flatMap((x) => (x.id === c.id ? [a, b] : [x])));
    toast.success("Clip split");
  };

  return (
    <PageLoad>
      <PageHeader title="Video Editor" description="Timeline editing is simulated; no media is processed."
        actions={<><Button size="sm" variant="outline" disabled={saving} onClick={() => { setSaving(true); setTimeout(() => { setSaving(false); toast.success("Project saved in this browser"); }, 700); }}><Save /> {saving ? "Saving…" : "Save project"}</Button><Button size="sm" onClick={() => setExportOpen(true)}><Download /> Export</Button></>} />
      <div className="grid gap-4 xl:grid-cols-[220px_1fr_260px]">
        <Panel title="Media bin" bodyClass="p-2">
          <div className="grid grid-cols-2 gap-2 xl:grid-cols-1">{[0, 1, 2, 3].map((i) => <button key={i} onClick={() => Unavailable("Importing media into timeline")} className="text-left"><Thumb index={i} /><p className="mt-1 truncate text-xs text-muted-foreground">clip-{i + 1}.mp4</p></button>)}</div>
        </Panel>
        <Panel title="Preview">
          <div className="relative overflow-hidden rounded-lg"><Thumb index={cur.thumb} className="rounded-none" /><div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded bg-background/85 px-2 py-1 text-xs">[{cur.name}] subtitle preview</div></div>
          <div className="mt-3 flex items-center gap-2">
            <Button size="icon" variant="ghost" aria-label="Back to start" onClick={() => setT([0])}><SkipBack /></Button>
            <Button size="icon" aria-label={playing ? "Pause" : "Play"} onClick={() => { setPlaying(!playing); if (!playing) toast.info("Playback is simulated — no video file is loaded"); }}>{playing ? <Pause /> : <Play />}</Button>
            <Slider className="flex-1" min={0} max={total} value={t} onValueChange={setT} aria-label="Playhead" />
            <span className="w-20 text-right font-mono text-xs">{Math.floor(t0 / 60)}:{String(t0 % 60).padStart(2, "0")} / {Math.floor(total / 60)}:{String(total % 60).padStart(2, "0")}</span>
          </div>
        </Panel>
        <Panel title="Project settings">
          <div className="space-y-3">
            <Field label="Project name"><Input defaultValue="Laptop Buying Guide 2027" /></Field>
            <Field label="Frame rate"><Select defaultValue="30"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["24", "30", "60"].map((f) => <SelectItem key={f} value={f}>{f} fps</SelectItem>)}</SelectContent></Select></Field>
            <Button variant="outline" className="w-full" onClick={split}><Scissors /> Split at playhead</Button>
          </div>
        </Panel>
      </div>
      <Panel title="Timeline" className="mt-4" bodyClass="overflow-x-auto">
        <div className="min-w-[640px] space-y-2">
          <div className="relative h-4 text-[10px] text-subtle">{Array.from({ length: 12 }).map((_, i) => <span key={i} className="absolute" style={{ left: `${(i * 10 / total) * 100}%` }}>{i * 10}s</span>)}</div>
          {[{ k: "Video", icon: Film }, { k: "Audio", icon: Music }, { k: "Subtitles", icon: Type }].map((tr) => (
            <div key={tr.k} className="flex items-center gap-2">
              <span className="flex w-24 shrink-0 items-center gap-1 text-xs text-muted-foreground"><tr.icon className="size-3.5" />{tr.k}</span>
              <div className="relative h-10 flex-1 rounded bg-elevated">
                {clips.map((c) => (
                  <button key={c.id + tr.k} onClick={() => { setSel(c.id); setT([c.start]); }}
                    className={`absolute top-1 h-8 truncate rounded px-1.5 text-left text-[10px] font-medium ${tr.k === "Video" ? "bg-primary/80 text-primary-foreground" : tr.k === "Audio" ? "bg-info/60" : "bg-success/50"} ${sel === c.id ? "ring-2 ring-foreground" : ""}`}
                    style={{ left: `${(c.start / total) * 100}%`, width: `calc(${(c.len / total) * 100}% - 2px)` }}>{c.name}</button>
                ))}
                <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-foreground" style={{ left: `${(t0 / total) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Panel>
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent><DialogHeader><DialogTitle>Export preview</DialogTitle></DialogHeader>
          <Field label="Resolution"><Select value={res} onValueChange={setRes}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["720p", "1080p", "4K"].map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select></Field>
          <p className="text-sm text-muted-foreground">{clips.length} clips · {total}s · {res} MP4 (H.264). Rendering is not available in Phase 01.</p>
          <Button onClick={() => { setExportOpen(false); Unavailable("Video rendering"); }}>Render (unavailable)</Button>
        </DialogContent>
      </Dialog>
    </PageLoad>
  );
}
