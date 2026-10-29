import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Wand2, Check, Frame } from "lucide-react";
import { toast } from "sonner";
import { pageHead } from "@/lib/seo";
import { PageLoad } from "@/components/app/PageLoad";
import { Chips, Field, PageHeader, Panel, UnavailableNote, Unavailable } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { THUMBS } from "@/data/mock";

export const Route = createFileRoute("/_studio/images")({
  head: pageHead("AI Image Studio", "Prompt, style and aspect-ratio controls with a sample gallery."),
  component: Images,
});

const STYLES = ["Cinematic", "Flat illustration", "3D render", "Photoreal", "Minimal"];
const RATIOS = { "16:9": "aspect-video", "9:16": "aspect-[9/16]", "1:1": "aspect-square", "4:5": "aspect-[4/5]" } as const;
type Ratio = keyof typeof RATIOS;

function Images() {
  const [prompt, setPrompt] = useState("Tech reviewer at a desk, dramatic red rim light, cinematic");
  const [style, setStyle] = useState(STYLES[0]);
  const [ratio, setRatio] = useState<Ratio>("16:9");
  const [selected, setSelected] = useState<number[]>([]);
  const [open, setOpen] = useState<number | null>(null);
  const gallery = [...THUMBS, ...THUMBS];

  return (
    <PageLoad>
      <PageHeader title="AI Image Studio" description="Gallery shows bundled sample images. Image generation is not connected." />
      <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
        <Panel title="Prompt">
          <div className="space-y-4">
            <Field label="Prompt" error={prompt.trim().length < 5 ? "Describe the image in at least 5 characters" : undefined}><Textarea rows={5} value={prompt} onChange={(e) => setPrompt(e.target.value)} /></Field>
            <Field label="Style"><div className="flex flex-wrap gap-1.5">{STYLES.map((s) => <button key={s} onClick={() => setStyle(s)} className={`rounded-full border px-3 py-1 text-xs ${style === s ? "border-primary bg-primary text-primary-foreground" : "bg-surface"}`}>{s}</button>)}</div></Field>
            <Field label="Aspect ratio"><Chips value={ratio} onChange={setRatio} options={(Object.keys(RATIOS) as Ratio[]).map((r) => ({ value: r, label: r }))} /></Field>
            <Button className="w-full" disabled={prompt.trim().length < 5} onClick={() => Unavailable("Image generation")}><Wand2 /> Generate</Button>
            <UnavailableNote>Generation requires an AI provider (Phase 02). Use the sample gallery to try selection and the thumbnail workflow.</UnavailableNote>
          </div>
        </Panel>
        <Panel title={`Gallery · ${selected.length} selected`} action={<div className="flex gap-2"><Button size="sm" variant="outline" disabled={!selected.length} onClick={() => { toast.success(`${selected.length} image(s) marked for Asset Library (local)`); setSelected([]); }}>Add to assets</Button><Button asChild size="sm" variant="soft"><Link to="/thumbnails"><Frame /> Thumbnail workflow</Link></Button></div>}>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            {gallery.map((src, i) => {
              const on = selected.includes(i);
              return (
                <div key={i} className={`group relative overflow-hidden rounded-lg ring-2 ${on ? "ring-primary" : "ring-transparent"}`}>
                  <button onClick={() => setOpen(i)} className={`block w-full ${RATIOS[ratio]}`} aria-label="Preview image"><img src={src} alt={`Sample ${i + 1}`} loading="lazy" className="size-full object-cover" /></button>
                  <button aria-label="Select image" onClick={() => setSelected(on ? selected.filter((x) => x !== i) : [...selected, i])} className={`absolute left-2 top-2 grid size-6 place-items-center rounded-md border ${on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background/80"}`}>{on && <Check className="size-4" />}</button>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
      <Dialog open={open !== null} onOpenChange={() => setOpen(null)}>
        <DialogContent className="sm:max-w-3xl"><DialogHeader><DialogTitle>Sample image {open !== null ? open + 1 : ""}</DialogTitle></DialogHeader>{open !== null && <img src={gallery[open]} alt="" className="w-full rounded-lg" />}<p className="text-xs text-muted-foreground">Style: {style} · Ratio: {ratio} (display only)</p></DialogContent>
      </Dialog>
    </PageLoad>
  );
}
