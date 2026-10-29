import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2, Play } from "lucide-react";
import { toast } from "sonner";
import { pageHead } from "@/lib/seo";
import { PageLoad } from "@/components/app/PageLoad";
import { ConfirmAction, Field, PageHeader, Panel, Thumb } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLocalState } from "@/lib/local-store";

export const Route = createFileRoute("/_studio/storyboard")({
  head: pageHead("Storyboard Studio", "Plan scenes, narration, shots and assets."),
  component: Storyboard,
});

export type Scene = { id: string; title: string; description: string; narration: string; visual: string; shot: string; duration: number; asset: number };
export const SCENES: Scene[] = [
  { id: "s1", title: "Cold open", description: "Stack of laptops on desk", narration: "You're probably about to overspend…", visual: "Slow push-in, red rim light", shot: "Close-up", duration: 6, asset: 0 },
  { id: "s2", title: "Intro", description: "Host to camera", narration: "I tested 23 laptops this year…", visual: "Two-camera setup", shot: "Medium", duration: 18, asset: 0 },
  { id: "s3", title: "Processor", description: "Spec graphic overlay", narration: "Processor: what the numbers mean.", visual: "Animated chart", shot: "Screen capture", duration: 95, asset: 3 },
  { id: "s4", title: "Battery test", description: "Timelapse of battery drain", narration: "How to read real-world numbers.", visual: "Timelapse", shot: "Wide", duration: 70, asset: 0 },
  { id: "s5", title: "Outro & CTA", description: "Host with checklist", narration: "Grab the free checklist…", visual: "End screen layout", shot: "Medium", duration: 20, asset: 0 },
];
const SHOTS = ["Wide", "Medium", "Close-up", "Overhead", "Screen capture", "B-roll"];

function Storyboard() {
  const [scenes, setScenes] = useLocalState<Scene[]>("storyboard", SCENES);
  const [active, setActive] = useState(scenes[0]?.id);
  const [preview, setPreview] = useState(false);
  const cur = scenes.find((s) => s.id === active);
  const update = (patch: Partial<Scene>) => setScenes(scenes.map((s) => (s.id === active ? { ...s, ...patch } : s)));
  const move = (i: number, d: number) => { const n = [...scenes]; const j = i + d; if (j < 0 || j >= n.length) return; [n[i], n[j]] = [n[j], n[i]]; setScenes(n); };
  const total = scenes.reduce((a, s) => a + s.duration, 0);

  return (
    <PageLoad>
      <PageHeader title="Storyboard Studio" description={`${scenes.length} scenes · ${Math.floor(total / 60)}m ${total % 60}s total`}
        actions={<><Button size="sm" variant="outline" onClick={() => setPreview(true)}><Play /> Preview</Button><Button size="sm" onClick={() => { const s = { id: `s${Date.now()}`, title: "New scene", description: "", narration: "", visual: "", shot: "Medium", duration: 10, asset: 0 }; setScenes([...scenes, s]); setActive(s.id); }}><Plus /> Add scene</Button></>} />
      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {scenes.map((s, i) => (
            <div key={s.id} onClick={() => setActive(s.id)} className={`cursor-pointer rounded-xl border bg-card p-2 transition ${active === s.id ? "border-primary ring-1 ring-primary" : ""}`}>
              <Thumb index={s.asset} label={`${s.duration}s`} />
              <div className="mt-2 flex items-center justify-between gap-1 px-1">
                <p className="truncate text-sm font-semibold"><span className="text-primary">{i + 1}.</span> {s.title}</p>
                <div className="flex">
                  <Button size="icon" variant="ghost" className="size-7" aria-label="Move up" onClick={(e) => { e.stopPropagation(); move(i, -1); }}><ArrowUp /></Button>
                  <Button size="icon" variant="ghost" className="size-7" aria-label="Move down" onClick={(e) => { e.stopPropagation(); move(i, 1); }}><ArrowDown /></Button>
                </div>
              </div>
              <p className="line-clamp-1 px-1 text-xs text-muted-foreground">{s.shot} · {s.description}</p>
            </div>
          ))}
        </div>
        {cur && (
          <Panel title={`Scene: ${cur.title}`} action={<ConfirmAction destructive title="Delete scene?" description="This scene will be removed." confirmLabel="Delete" onConfirm={() => { const n = scenes.filter((s) => s.id !== cur.id); setScenes(n); setActive(n[0]?.id); toast("Scene deleted"); }} trigger={<Button size="icon" variant="ghost" aria-label="Delete scene"><Trash2 /></Button>} />}>
            <div className="space-y-3">
              <Field label="Title"><Input value={cur.title} onChange={(e) => update({ title: e.target.value })} /></Field>
              <Field label="Scene description"><Textarea rows={2} value={cur.description} onChange={(e) => update({ description: e.target.value })} /></Field>
              <Field label="Narration"><Textarea rows={3} value={cur.narration} onChange={(e) => update({ narration: e.target.value })} /></Field>
              <Field label="Visual direction"><Input value={cur.visual} onChange={(e) => update({ visual: e.target.value })} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Shot type"><Select value={cur.shot} onValueChange={(v) => update({ shot: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{SHOTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></Field>
                <Field label="Duration (s)"><Input type="number" min={1} value={cur.duration} onChange={(e) => update({ duration: Math.max(1, +e.target.value || 1) })} /></Field>
              </div>
              <Field label="Assigned asset"><div className="grid grid-cols-4 gap-2">{[0, 1, 2, 3].map((a) => <button key={a} onClick={() => update({ asset: a })} aria-label={`Asset ${a + 1}`} className={`rounded-md ring-2 ${cur.asset === a ? "ring-primary" : "ring-transparent"}`}><Thumb index={a} /></button>)}</div></Field>
            </div>
          </Panel>
        )}
      </div>
      <Dialog open={preview} onOpenChange={setPreview}>
        <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader><DialogTitle>Storyboard preview</DialogTitle></DialogHeader>
          <div className="space-y-3">{scenes.map((s, i) => <div key={s.id} className="flex gap-3"><Thumb index={s.asset} className="w-40 shrink-0" /><div className="text-sm"><p className="font-semibold">{i + 1}. {s.title} <span className="text-xs text-muted-foreground">({s.shot}, {s.duration}s)</span></p><p className="text-muted-foreground">“{s.narration}”</p><p className="text-xs text-subtle">{s.visual}</p></div></div>)}</div>
        </DialogContent>
      </Dialog>
    </PageLoad>
  );
}
