import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Save, History, Eye, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { pageHead } from "@/lib/seo";
import { PageLoad } from "@/components/app/PageLoad";
import { CopyButton, Field, PageHeader, Panel } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLocalState } from "@/lib/local-store";

export const Route = createFileRoute("/_studio/scripts")({
  validateSearch: (s: Record<string, unknown>) => ({ idea: typeof s["idea"] === "string" ? (s["idea"] as string) : undefined }),
  head: pageHead("Script Studio", "Write structured video scripts with word count and duration estimates."),
  component: Scripts,
});

type Script = { title: string; topic: string; hook: string; intro: string; body: string; ending: string; cta: string };
const SAMPLE: Script = {
  title: "Laptop Buying Guide 2027",
  topic: "How to choose a laptop without overspending",
  hook: "You're probably about to overspend on your next laptop — here's how to avoid it.",
  intro: "I tested 23 laptops this year. In the next 15 minutes I'll show you the only five specs that matter.",
  body: "1. Processor: what the numbers really mean.\n2. Memory: why 16 GB is the new minimum.\n3. Storage: SSD speeds you can actually feel.\n4. Display: brightness beats resolution.\n5. Battery: how to read the real-world numbers.",
  ending: "So the best laptop isn't the most expensive — it's the one matched to how you work.",
  cta: "Grab the free checklist in the description and subscribe for next week's tablet guide.",
};
const SECTIONS: { k: keyof Script; label: string; rows: number }[] = [
  { k: "hook", label: "Hook (first 5 seconds)", rows: 2 }, { k: "intro", label: "Introduction", rows: 3 },
  { k: "body", label: "Main sections", rows: 8 }, { k: "ending", label: "Ending", rows: 2 }, { k: "cta", label: "Call to action", rows: 2 },
];

function Scripts() {
  const { idea } = Route.useSearch();
  const [saved, setSaved] = useLocalState<Script>("script", SAMPLE);
  const [versions, setVersions] = useLocalState<{ at: string; s: Script }[]>("script-versions", [{ at: "2026-10-28 14:02", s: SAMPLE }]);
  const [s, setS] = useState<Script>(idea ? { ...SAMPLE, title: idea, topic: idea, hook: "", intro: "", body: "", ending: "", cta: "" } : saved);
  const [preview, setPreview] = useState(false);
  const [histOpen, setHistOpen] = useState(false);
  const full = useMemo(() => SECTIONS.map((x) => s[x.k]).join("\n\n"), [s]);
  const words = full.trim() ? full.trim().split(/\s+/).length : 0;
  const mins = words / 150;
  const dirty = JSON.stringify(s) !== JSON.stringify(saved);

  const save = () => {
    if (!s.title.trim()) { toast.error("Add a title before saving"); return; }
    setSaved(s);
    setVersions([{ at: new Date().toLocaleString(), s }, ...versions].slice(0, 10));
    toast.success("Draft saved in this browser");
  };

  return (
    <PageLoad>
      <PageHeader title="Script Studio" description="Local editor — AI drafting is not connected in Phase 01."
        actions={<><Button size="sm" variant="outline" onClick={() => setHistOpen(true)}><History /> Versions ({versions.length})</Button><Button size="sm" variant="outline" onClick={() => setPreview(true)}><Eye /> Export preview</Button><Button size="sm" onClick={save} disabled={!dirty}><Save /> {dirty ? "Save draft" : "Saved"}</Button></>} />
      <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
        <Panel>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Title" error={!s.title.trim() ? "Title is required" : undefined}><Input value={s.title} onChange={(e) => setS({ ...s, title: e.target.value })} /></Field>
            <Field label="Topic"><Input value={s.topic} onChange={(e) => setS({ ...s, topic: e.target.value })} /></Field>
          </div>
          <div className="mt-4 space-y-4">
            {SECTIONS.map((x) => <Field key={x.k} label={x.label}><Textarea rows={x.rows} value={s[x.k]} onChange={(e) => setS({ ...s, [x.k]: e.target.value })} className="bg-surface" /></Field>)}
          </div>
        </Panel>
        <div className="space-y-4">
          <Panel title="Script stats">
            <dl className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-lg bg-elevated p-3"><dt className="text-xs text-muted-foreground">Words</dt><dd className="font-display text-xl font-bold">{words}</dd></div>
              <div className="rounded-lg bg-elevated p-3"><dt className="text-xs text-muted-foreground">Est. duration</dt><dd className="font-display text-xl font-bold">{Math.floor(mins)}:{String(Math.round((mins % 1) * 60)).padStart(2, "0")}</dd></div>
            </dl>
            <p className="mt-2 text-xs text-subtle">Based on ~150 spoken words per minute.</p>
          </Panel>
          <Panel title="Actions"><div className="flex flex-wrap gap-2"><CopyButton text={full} label="Copy script" /><Button size="sm" variant="outline" onClick={() => { setS(saved); toast("Reverted to last saved draft"); }}><RotateCcw /> Revert</Button></div></Panel>
        </div>
      </div>

      <Dialog open={preview} onOpenChange={setPreview}>
        <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader><DialogTitle>{s.title}</DialogTitle></DialogHeader>
          <div className="space-y-3 text-sm">{SECTIONS.map((x) => <div key={x.k}><p className="text-[10px] font-semibold uppercase tracking-wider text-primary">{x.label}</p><p className="whitespace-pre-wrap">{s[x.k] || "—"}</p></div>)}</div>
          <p className="text-xs text-subtle">Export preview only — file export arrives in a later phase.</p>
        </DialogContent>
      </Dialog>
      <Dialog open={histOpen} onOpenChange={setHistOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Version history</DialogTitle></DialogHeader>
          <ul className="space-y-2">{versions.map((v, i) => <li key={i} className="flex items-center justify-between rounded-lg bg-elevated px-3 py-2 text-sm"><span>{v.at} — {v.s.title}</span><Button size="sm" variant="ghost" onClick={() => { setS(v.s); setHistOpen(false); toast("Version restored into editor"); }}>Restore</Button></li>)}</ul>
        </DialogContent>
      </Dialog>
    </PageLoad>
  );
}
