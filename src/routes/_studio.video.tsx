import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Clapperboard, Play } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { PageLoad } from "@/components/app/PageLoad";
import { Chips, Field, PageHeader, Panel, StatusBadge, Thumb, UnavailableNote, Unavailable } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { useLocalState } from "@/lib/local-store";
import { SCENES, type Scene } from "@/data/storyboard";

export const Route = createFileRoute("/_studio/video")({
  head: pageHead("AI Video Studio", "Video concepts, scene sequences and job queue (demo)."),
  component: VideoStudio,
});

const QUEUE = [
  { n: "Meal Prep for Lazy People", s: "running", p: 64 },
  { n: "Best Tablets Under $300", s: "pending", p: 0 },
  { n: "Hidden Villages of the Alps", s: "failed", p: 37 },
];

function VideoStudio() {
  const [scenes] = useLocalState<Scene[]>("storyboard", SCENES);
  const [title, setTitle] = useState("Laptop Buying Guide 2027");
  const [concept, setConcept] = useState("Fast-paced explainer with spec overlays and a battery timelapse.");
  const [dur, setDur] = useState([12]);
  const [ratio, setRatio] = useState<"16:9" | "9:16" | "1:1">("16:9");
  const [active, setActive] = useState(0);

  return (
    <PageLoad>
      <PageHeader title="AI Video Studio" description="Previews use still sample frames. No video is rendered in Phase 01." />
      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-4">
          <Panel title="Preview">
            <div className={`relative mx-auto overflow-hidden rounded-lg bg-elevated ${ratio === "9:16" ? "aspect-[9/16] max-w-xs" : ratio === "1:1" ? "aspect-square max-w-md" : "aspect-video"}`}>
              <Thumb index={scenes[active]?.asset ?? 0} className="absolute inset-0 aspect-auto size-full rounded-none" />
              <div className="absolute inset-x-0 bottom-0 bg-background/80 p-3 text-sm">“{scenes[active]?.narration}”</div>
              <button onClick={() => Unavailable("Video playback")} aria-label="Play" className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow"><Play className="size-6" /></button>
            </div>
          </Panel>
          <Panel title="Scene sequence" action={<Link to="/storyboard" className="text-xs text-primary">Edit storyboard</Link>}>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {scenes.map((s, i) => <button key={s.id} onClick={() => setActive(i)} className={`w-36 shrink-0 rounded-lg border p-1.5 text-left ${active === i ? "border-primary" : ""}`}><Thumb index={s.asset} label={`${s.duration}s`} /><p className="mt-1 truncate text-xs">{i + 1}. {s.title}</p></button>)}
            </div>
          </Panel>
        </div>
        <div className="space-y-4">
          <Panel title="Concept">
            <div className="space-y-3">
              <Field label="Title"><Input value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
              <Field label="Concept"><Textarea rows={3} value={concept} onChange={(e) => setConcept(e.target.value)} /></Field>
              <Field label={`Target duration: ${dur[0]} min`}><Slider min={1} max={30} value={dur} onValueChange={setDur} /></Field>
              <Field label="Aspect ratio"><Chips value={ratio} onChange={setRatio} options={[{ value: "16:9", label: "16:9" }, { value: "9:16", label: "9:16" }, { value: "1:1", label: "1:1" }]} /></Field>
              <Button className="w-full" onClick={() => Unavailable("Video generation")}><Clapperboard /> Queue render</Button>
              <UnavailableNote>Asset assignment is managed per scene in Storyboard Studio.</UnavailableNote>
            </div>
          </Panel>
          <Panel title="Job queue (demo)"><ul className="space-y-3">{QUEUE.map((j) => <li key={j.n}><div className="flex justify-between gap-2 text-sm"><span className="truncate">{j.n}</span><StatusBadge status={j.s} /></div><Progress value={j.p} className="mt-1.5 h-1.5" /></li>)}</ul></Panel>
        </div>
      </div>
    </PageLoad>
  );
}
