import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X, CheckCircle2, Circle } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { PageLoad } from "@/components/app/PageLoad";
import { CopyButton, Field, PageHeader, Panel, Thumb } from "@/components/app/kit";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/_studio/seo")({
  head: pageHead("SEO Studio", "Edit titles, descriptions and tags with a demo SEO score."),
  component: Seo,
});

function Counter({ n, max }: { n: number; max: number }) {
  return <span className={`text-xs ${n > max ? "text-destructive" : "text-subtle"}`}>{n}/{max}</span>;
}

function Seo() {
  const [title, setTitle] = useState("Laptop Buying Guide 2027: The Only 5 Specs That Matter");
  const [desc, setDesc] = useState("I tested 23 laptops this year. Here are the five specs that actually matter when buying a laptop in 2027 — processor, memory, storage, display and battery.\n\n00:00 Intro\n01:10 Processor\n04:30 Memory");
  const [keyword, setKeyword] = useState("laptop buying guide");
  const [tags, setTags] = useState<string[]>(["laptop buying guide", "best laptop 2027", "laptop specs"]);
  const [tag, setTag] = useState("");
  const kw = keyword.toLowerCase();
  const checks = [
    { l: "Keyword in title", ok: !!kw && title.toLowerCase().includes(kw) },
    { l: "Title 40–70 characters", ok: title.length >= 40 && title.length <= 70 },
    { l: "Keyword in first 150 chars of description", ok: !!kw && desc.slice(0, 150).toLowerCase().includes(kw) },
    { l: "Description over 200 characters", ok: desc.length > 200 },
    { l: "Includes chapters / timestamps", ok: /\d{1,2}:\d{2}/.test(desc) },
    { l: "5+ tags", ok: tags.length >= 5 },
    { l: "Tags under 500 characters total", ok: tags.join(",").length <= 500 },
  ];
  const thumbChecks = ["Readable at small size", "3–4 words max", "High contrast subject", "Matches title promise"];
  const score = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100);
  const addTag = () => { const t = tag.trim(); if (t && !tags.includes(t)) setTags([...tags, t]); setTag(""); };

  return (
    <PageLoad>
      <PageHeader title="SEO Studio" description="Score is a local checklist heuristic, not a YouTube ranking prediction." />
      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <Panel>
          <div className="space-y-4">
            <Field label="Focus keyword"><Input value={keyword} onChange={(e) => setKeyword(e.target.value)} /></Field>
            <div className="space-y-1.5"><div className="flex justify-between"><span className="text-xs font-medium text-muted-foreground">Title</span><Counter n={title.length} max={100} /></div><Input value={title} onChange={(e) => setTitle(e.target.value)} /><div className="flex justify-end"><CopyButton text={title} /></div></div>
            <div className="space-y-1.5"><div className="flex justify-between"><span className="text-xs font-medium text-muted-foreground">Description</span><Counter n={desc.length} max={5000} /></div><Textarea rows={8} value={desc} onChange={(e) => setDesc(e.target.value)} /><div className="flex justify-end"><CopyButton text={desc} /></div></div>
            <div className="space-y-1.5">
              <div className="flex justify-between"><span className="text-xs font-medium text-muted-foreground">Tags</span><Counter n={tags.join(",").length} max={500} /></div>
              <div className="flex flex-wrap gap-1.5 rounded-md border bg-surface p-2">
                {tags.map((t) => <span key={t} className="flex items-center gap-1 rounded-full bg-elevated px-2 py-0.5 text-xs">{t}<button aria-label={`Remove ${t}`} onClick={() => setTags(tags.filter((x) => x !== t))}><X className="size-3" /></button></span>)}
                <input value={tag} onChange={(e) => setTag(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }} placeholder="Add tag + Enter" className="min-w-32 flex-1 bg-transparent text-sm outline-none" />
              </div>
              <div className="flex justify-end"><CopyButton text={tags.join(", ")} label="Copy tags" /></div>
            </div>
          </div>
        </Panel>
        <div className="space-y-4">
          <Panel title="Demo SEO score">
            <p className="font-display text-4xl font-bold" style={{ color: score >= 80 ? "var(--success)" : score >= 50 ? "var(--warning)" : "var(--destructive)" }}>{score}<span className="text-base text-subtle">/100</span></p>
            <Progress value={score} className="mt-2 h-2" />
            <ul className="mt-4 space-y-2">{checks.map((c) => <li key={c.l} className="flex items-center gap-2 text-sm">{c.ok ? <CheckCircle2 className="size-4 text-success" /> : <Circle className="size-4 text-subtle" />}{c.l}</li>)}</ul>
          </Panel>
          <Panel title="Metadata preview">
            <Thumb index={0} label="18:05" />
            <p className="mt-2 line-clamp-2 text-sm font-semibold">{title || "Untitled"}</p>
            <p className="text-xs text-muted-foreground">Circuit Bay · demo preview</p>
            <p className="mt-1 line-clamp-2 text-xs text-subtle">{desc}</p>
          </Panel>
          <Panel title="Thumbnail checklist"><ul className="space-y-2">{thumbChecks.map((t) => <li key={t}><label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-primary" /> {t}</label></li>)}</ul></Panel>
        </div>
      </div>
    </PageLoad>
  );
}
