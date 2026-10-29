import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Save, Columns2, Download } from "lucide-react";
import { toast } from "sonner";
import { pageHead } from "@/lib/seo";
import { PageLoad } from "@/components/app/PageLoad";
import { Chips, Field, PageHeader, Panel, Unavailable } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { THUMBS } from "@/data/mock";
import { useLocalState } from "@/lib/local-store";

export const Route = createFileRoute("/_studio/thumbnails")({
  head: pageHead("Thumbnail Studio", "Design, version and compare thumbnails."),
  component: Thumbnails,
});

type Design = { text: string; sub: string; img: number; layout: "left" | "center" | "bottom"; size: number; badge: boolean };
const TEMPLATES: { name: string; d: Design }[] = [
  { name: "Bold Left", d: { text: "DON'T BUY YET", sub: "Watch this first", img: 0, layout: "left", size: 44, badge: true } },
  { name: "Center Punch", d: { text: "15 MIN MEALS", sub: "", img: 1, layout: "center", size: 52, badge: false } },
  { name: "Lower Third", d: { text: "ABOVE THE CLOUDS", sub: "Solo hike", img: 2, layout: "bottom", size: 38, badge: false } },
  { name: "Money Shot", d: { text: "$1,000 → ?", sub: "Beginner guide", img: 3, layout: "left", size: 48, badge: true } },
];
const RATIOS = { "16:9": "aspect-video", "9:16": "aspect-[9/16]", "1:1": "aspect-square" } as const;

function Canvas({ d, ratio = "16:9" }: { d: Design; ratio?: keyof typeof RATIOS }) {
  const pos = { left: "items-start justify-center text-left pl-[6%]", center: "items-center justify-center text-center", bottom: "items-start justify-end text-left p-[5%]" }[d.layout];
  return (
    <div className={`relative w-full overflow-hidden rounded-lg ${RATIOS[ratio]}`} style={{ containerType: "inline-size" }}>
      <img src={THUMBS[d.img]} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
      <div className={`absolute inset-0 flex flex-col ${pos}`}>
        <p className="font-display font-extrabold leading-none text-foreground drop-shadow" style={{ fontSize: `${d.size / 6}cqw` }}>{d.text}</p>
        {d.sub && <p className="mt-[1.5%] rounded bg-primary px-[1.5%] py-[0.5%] font-bold text-primary-foreground" style={{ fontSize: `${d.size / 14}cqw` }}>{d.sub}</p>}
      </div>
      {d.badge && <span className="absolute right-[3%] top-[4%] rounded bg-primary px-[1.5%] font-bold text-primary-foreground" style={{ fontSize: "3.2cqw" }}>NEW</span>}
    </div>
  );
}

function Thumbnails() {
  const [d, setD] = useState<Design>(TEMPLATES[0].d);
  const [ratio, setRatio] = useState<keyof typeof RATIOS>("16:9");
  const [versions, setVersions] = useLocalState<Design[]>("thumb-versions", [TEMPLATES[0].d, TEMPLATES[3].d]);
  const [compare, setCompare] = useState(false);

  return (
    <PageLoad>
      <PageHeader title="Thumbnail Studio" description="Original templates. Side-by-side compare is visual only — no YouTube A/B tests run."
        actions={<><Button size="sm" variant="outline" onClick={() => setCompare(!compare)}><Columns2 /> {compare ? "Single view" : "Compare"}</Button><Button size="sm" variant="outline" onClick={() => Unavailable("Image export")}><Download /> Export</Button><Button size="sm" onClick={() => { setVersions([d, ...versions].slice(0, 8)); toast.success("Thumbnail version saved locally"); }}><Save /> Save draft</Button></>} />
      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Panel title="Canvas">
            {compare && versions.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2"><div><p className="mb-1 text-xs text-muted-foreground">Current (A)</p><Canvas d={d} /></div><div><p className="mb-1 text-xs text-muted-foreground">Last saved (B)</p><Canvas d={versions[0]} /></div></div>
            ) : <div className={ratio === "9:16" ? "mx-auto max-w-xs" : ratio === "1:1" ? "mx-auto max-w-md" : ""}><Canvas d={d} ratio={ratio} /></div>}
          </Panel>
          <Panel title="Templates">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{TEMPLATES.map((t) => <button key={t.name} onClick={() => setD(t.d)} className="text-left"><Canvas d={t.d} /><p className="mt-1 text-xs font-medium">{t.name}</p></button>)}</div>
          </Panel>
          <Panel title={`Versions (${versions.length})`}>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{versions.map((v, i) => <button key={i} onClick={() => setD(v)} className="text-left"><Canvas d={v} /><p className="mt-1 text-xs text-muted-foreground">v{versions.length - i}</p></button>)}</div>
          </Panel>
        </div>
        <Panel title="Text & layout">
          <div className="space-y-4">
            <Field label="Headline" hint={`${d.text.length}/30 — short text reads best`}><Input maxLength={30} value={d.text} onChange={(e) => setD({ ...d, text: e.target.value })} /></Field>
            <Field label="Sub-label"><Input maxLength={24} value={d.sub} onChange={(e) => setD({ ...d, sub: e.target.value })} /></Field>
            <Field label={`Text size: ${d.size}`}><Slider min={24} max={64} value={[d.size]} onValueChange={(v) => setD({ ...d, size: v[0] })} /></Field>
            <Field label="Layout"><Chips value={d.layout} onChange={(v) => setD({ ...d, layout: v })} options={[{ value: "left", label: "Left" }, { value: "center", label: "Center" }, { value: "bottom", label: "Bottom" }]} /></Field>
            <Field label="Aspect preset"><Chips value={ratio} onChange={setRatio} options={[{ value: "16:9", label: "16:9" }, { value: "9:16", label: "9:16" }, { value: "1:1", label: "1:1" }]} /></Field>
            <Field label="Background asset"><div className="grid grid-cols-4 gap-2">{THUMBS.map((t, i) => <button key={i} aria-label={`Asset ${i + 1}`} onClick={() => setD({ ...d, img: i })} className={`overflow-hidden rounded ring-2 ${d.img === i ? "ring-primary" : "ring-transparent"}`}><img src={t} alt="" className="aspect-video object-cover" /></button>)}</div></Field>
            <label className="flex items-center justify-between text-sm">“NEW” badge <Switch checked={d.badge} onCheckedChange={(v) => setD({ ...d, badge: v })} /></label>
          </div>
        </Panel>
      </div>
    </PageLoad>
  );
}
