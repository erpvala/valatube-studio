import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Save, Scissors, Heart, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";
import { pageHead } from "@/lib/seo";
import { PageLoad } from "@/components/app/PageLoad";
import { Field, PageHeader, Panel, StatusBadge, Thumb } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ideas, THUMBS, videos } from "@/data/mock";
import { useLocalState } from "@/lib/local-store";

export const Route = createFileRoute("/_studio/shorts")({
  head: pageHead("Shorts Studio", "Plan, script and preview vertical Shorts."),
  component: Shorts,
});

const LONGS = videos.filter((v) => v.type === "long" && v.status === "published");

function Shorts() {
  const [script, setScript] = useLocalState("shorts-script", "Stop scrolling — this $40 phone beat my flagship in one test.\nHere's the test.\nHere's the result.\nFollow for part two.");
  const [thumb, setThumb] = useState(0);
  const [captions, setCaptions] = useState(true);
  const [scene, setScene] = useState(0);
  const [plan, setPlan] = useLocalState<string[]>("shorts-plan", []);
  const lines = script.split("\n").filter(Boolean);
  const drafts = videos.filter((v) => v.type === "short" && v.status !== "published");

  return (
    <PageLoad>
      <PageHeader title="Shorts Studio" description="Preview is a mock-up using still frames." actions={<Button size="sm" onClick={() => toast.success("Shorts draft saved locally")}><Save /> Save draft</Button>} />
      <div className="grid gap-4 lg:grid-cols-[300px_1fr] xl:grid-cols-[300px_1fr_320px]">
        <div className="mx-auto w-full max-w-[300px]">
          <div className="relative aspect-[9/16] overflow-hidden rounded-[28px] border-4 border-elevated bg-background">
            <img src={THUMBS[thumb]} alt="" className="absolute inset-0 size-full object-cover" />
            {captions && lines[scene] && <p className="absolute inset-x-4 top-1/2 -translate-y-1/2 rounded-lg bg-background/75 p-2 text-center font-display text-lg font-bold">{lines[scene]}</p>}
            <div className="absolute bottom-16 right-3 flex flex-col items-center gap-4 text-foreground">{[Heart, MessageCircle, Share2].map((I, i) => <I key={i} className="size-6 drop-shadow" />)}</div>
            <p className="absolute bottom-4 left-3 right-14 text-xs font-semibold drop-shadow">@circuitbay · Demo Short</p>
          </div>
          <div className="mt-2 flex justify-center gap-1">{lines.map((_, i) => <button key={i} aria-label={`Scene ${i + 1}`} onClick={() => setScene(i)} className={`h-1.5 w-6 rounded-full ${i === scene ? "bg-primary" : "bg-elevated"}`} />)}</div>
        </div>
        <div className="space-y-4">
          <Panel title="Shorts script (one line per scene)"><Textarea rows={7} value={script} onChange={(e) => setScript(e.target.value)} /><p className="mt-1 text-xs text-subtle">{lines.length} scenes · ~{lines.length * 4}s</p></Panel>
          <Panel title="Scene sequence & subtitles">
            <ol className="space-y-1.5">{lines.map((l, i) => <li key={i}><button onClick={() => setScene(i)} className={`flex w-full gap-2 rounded-lg px-3 py-2 text-left text-sm ${i === scene ? "bg-primary-soft" : "bg-elevated"}`}><span className="font-mono text-xs text-subtle">00:{String(i * 4).padStart(2, "0")}</span>{l}</button></li>)}</ol>
            <label className="mt-3 flex items-center justify-between text-sm">Burned-in caption preview <Switch checked={captions} onCheckedChange={setCaptions} /></label>
          </Panel>
          <Panel title="Thumbnail / cover frame"><div className="grid grid-cols-4 gap-2">{THUMBS.map((t, i) => <button key={i} aria-label={`Cover ${i + 1}`} onClick={() => setThumb(i)} className={`overflow-hidden rounded ring-2 ${thumb === i ? "ring-primary" : "ring-transparent"}`}><img src={t} alt="" className="aspect-[9/16] object-cover" /></button>)}</div></Panel>
        </div>
        <div className="space-y-4 lg:col-span-2 xl:col-span-1">
          <Panel title="Shorts ideas">{ideas.filter((i) => i.type === "short").map((i) => <button key={i.id} onClick={() => setScript(`${i.title}.\n${i.notes || "Show it."}\nFollow for more.`)} className="mb-1.5 block w-full rounded-lg bg-elevated px-3 py-2 text-left text-sm">{i.title}</button>)}</Panel>
          <Panel title="Draft & scheduled Shorts">{drafts.map((v) => <div key={v.id} className="mb-2 flex items-center justify-between gap-2 text-sm"><span className="truncate">{v.title}</span><StatusBadge status={v.status} /></div>)}</Panel>
          <Panel title="Long-form → Shorts planning">
            {LONGS.map((v) => (
              <div key={v.id} className="mb-2 flex items-center gap-2"><Thumb index={v.thumb} className="w-16 shrink-0" /><p className="flex-1 truncate text-xs">{v.title}</p>
                <Button size="sm" variant={plan.includes(v.id) ? "soft" : "outline"} onClick={() => { setPlan(plan.includes(v.id) ? plan.filter((x) => x !== v.id) : [...plan, v.id]); }}><Scissors /> {plan.includes(v.id) ? "Planned" : "Plan 3"}</Button></div>
            ))}
          </Panel>
        </div>
      </div>
    </PageLoad>
  );
}
