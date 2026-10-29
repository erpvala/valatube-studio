import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mic, Volume2, Wand2, Lock } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { PageLoad } from "@/components/app/PageLoad";
import { Field, PageHeader, Panel, StatusBadge, UnavailableNote, Unavailable } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { voices } from "@/data/mock";

export const Route = createFileRoute("/_studio/voice")({
  head: pageHead("AI Voice Studio", "Voice library, narration editor and job status (demo)."),
  component: Voice,
});

const JOBS = [
  { n: "Laptop Buying Guide — narration", s: "completed", p: 100 },
  { n: "Meal Prep — narration", s: "running", p: 48 },
  { n: "Hidden Villages — narration", s: "failed", p: 12 },
];

function Voice() {
  const langs = Array.from(new Set(voices.map((v) => v.lang)));
  const [lang, setLang] = useState("all");
  const [voice, setVoice] = useState(voices[0].id);
  const [speed, setSpeed] = useState([1]);
  const [pitch, setPitch] = useState([0]);
  const [text, setText] = useState("You're probably about to overspend on your next laptop — here's how to avoid it.");
  const list = voices.filter((v) => lang === "all" || v.lang === lang);

  return (
    <PageLoad>
      <PageHeader title="AI Voice Studio" description="Voice names are fictional samples. No speech is generated in Phase 01." />
      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <Panel title="Voice library" action={<Select value={lang} onValueChange={setLang}><SelectTrigger className="h-8 w-44" aria-label="Language"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All languages</SelectItem>{langs.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent></Select>}>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((v) => (
                <button key={v.id} onClick={() => setVoice(v.id)} className={`flex items-center gap-3 rounded-lg border p-3 text-left ${voice === v.id ? "border-primary bg-primary-soft" : "bg-surface"}`}>
                  <span className="grid size-9 place-items-center rounded-full bg-elevated"><Mic className="size-4 text-primary" /></span>
                  <span><span className="block text-sm font-semibold">{v.name}</span><span className="text-xs text-muted-foreground">{v.lang} · {v.style}</span></span>
                </button>
              ))}
            </div>
          </Panel>
          <Panel title="Narration editor">
            <Textarea rows={6} value={text} onChange={(e) => setText(e.target.value)} className="bg-surface" />
            <p className="mt-1 text-xs text-subtle">{text.length} characters · ~{Math.max(1, Math.round(text.split(/\s+/).length / 2.5))}s spoken</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button onClick={() => Unavailable("Voice generation")}><Wand2 /> Generate narration</Button>
              <Button variant="outline" onClick={() => Unavailable("Audio preview")}><Volume2 /> Preview voice</Button>
            </div>
            <div className="mt-3"><UnavailableNote>No demo audio files are bundled, so preview playback is disabled. Real TTS providers can be connected in Phase 02.</UnavailableNote></div>
          </Panel>
        </div>
        <div className="space-y-4">
          <Panel title="Voice settings">
            <div className="space-y-5">
              <Field label={`Speed: ${speed[0].toFixed(1)}×`}><Slider min={0.5} max={2} step={0.1} value={speed} onValueChange={setSpeed} /></Field>
              <Field label={`Pitch: ${pitch[0] > 0 ? "+" : ""}${pitch[0]}`}><Slider min={-10} max={10} step={1} value={pitch} onValueChange={setPitch} /></Field>
              <p className="text-xs text-muted-foreground">Selected: <span className="text-foreground">{voices.find((v) => v.id === voice)?.name}</span></p>
            </div>
          </Panel>
          <Panel title="Generation jobs (demo)">
            <ul className="space-y-3">{JOBS.map((j) => <li key={j.n}><div className="flex items-center justify-between gap-2 text-sm"><span className="truncate">{j.n}</span><StatusBadge status={j.s} /></div><Progress value={j.p} className="mt-1.5 h-1.5" /></li>)}</ul>
          </Panel>
          <Panel title={<span className="flex items-center gap-2"><Lock className="size-4" /> Voice cloning</span>}>
            <p className="text-sm text-muted-foreground">Concept only — unavailable in Phase 01. Will require explicit voice-owner consent and a licensed provider.</p>
            <Button size="sm" variant="outline" className="mt-3" disabled>Unavailable</Button>
          </Panel>
        </div>
      </div>
    </PageLoad>
  );
}
