import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bookmark, BookmarkCheck, TrendingUp, Trash2, History } from "lucide-react";
import { toast } from "sonner";
import { pageHead } from "@/lib/seo";
import { PageLoad } from "@/components/app/PageLoad";
import { Chips, EmptyState, PageHeader, Panel, SearchBox, StatusBadge } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLocalState } from "@/lib/local-store";

export const Route = createFileRoute("/_studio/research")({
  head: pageHead("Content Research", "Explore demo topics, keywords and audience interests."),
  component: Research,
});

const TOPICS = [
  { t: "Budget foldable phones", cat: "Tech", vol: 74000, comp: "medium", trend: 38 },
  { t: "AI note-taking apps", cat: "Tech", vol: 52000, comp: "high", trend: 61 },
  { t: "High-protein breakfast", cat: "Food", vol: 91000, comp: "high", trend: 22 },
  { t: "Air fryer desserts", cat: "Food", vol: 48000, comp: "low", trend: 44 },
  { t: "Rail passes in Europe", cat: "Travel", vol: 33000, comp: "low", trend: 17 },
  { t: "Solo hiking safety", cat: "Travel", vol: 21000, comp: "low", trend: 29 },
  { t: "High-yield savings 2027", cat: "Finance", vol: 66000, comp: "medium", trend: 53 },
  { t: "Side hustles for students", cat: "Finance", vol: 88000, comp: "high", trend: 12 },
];
const INTERESTS = [{ n: "Budget-conscious", p: 34 }, { n: "Beginners", p: 27 }, { n: "Productivity", p: 18 }, { n: "Wellness", p: 12 }, { n: "Adventure", p: 9 }];

function Research() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [saved, setSaved] = useLocalState<string[]>("research-saved", ["AI note-taking apps"]);
  const [history, setHistory] = useLocalState<string[]>("research-history", ["foldable phones", "meal prep"]);
  const rows = TOPICS.filter((x) => (cat === "all" || x.cat === cat) && x.t.toLowerCase().includes(q.toLowerCase()));

  return (
    <PageLoad>
      <PageHeader title="Content Research" description="Demo topics and keyword volumes are illustrative — no live trend data is fetched." />
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <SearchBox value={q} onChange={setQ} placeholder="Explore topics or keywords…" className="sm:w-80" />
        <Button size="sm" variant="outline" onClick={() => { if (q.trim()) { setHistory([q.trim(), ...history.filter((h) => h !== q.trim())].slice(0, 8)); toast("Search added to research history"); } }}>Save search</Button>
        <Chips value={cat} onChange={setCat} options={[{ value: "all", label: "All" }, { value: "Tech", label: "Tech" }, { value: "Food", label: "Food" }, { value: "Travel", label: "Travel" }, { value: "Finance", label: "Finance" }]} />
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title={<span className="flex items-center gap-2"><TrendingUp className="size-4 text-primary" /> Topic & keyword explorer</span>} className="xl:col-span-2" bodyClass="p-0">
          {rows.length ? (
            <Table>
              <TableHeader><TableRow><TableHead>Topic</TableHead><TableHead className="hidden sm:table-cell">Category</TableHead><TableHead>Monthly searches</TableHead><TableHead className="hidden md:table-cell">Competition</TableHead><TableHead>Trend</TableHead><TableHead /></TableRow></TableHeader>
              <TableBody>{rows.map((r) => {
                const isSaved = saved.includes(r.t);
                return (
                  <TableRow key={r.t}>
                    <TableCell className="font-medium">{r.t}</TableCell>
                    <TableCell className="hidden sm:table-cell">{r.cat}</TableCell>
                    <TableCell>{r.vol.toLocaleString()}</TableCell>
                    <TableCell className="hidden md:table-cell"><StatusBadge status={r.comp === "low" ? "success" : r.comp === "medium" ? "warning" : "error"} label={r.comp} /></TableCell>
                    <TableCell className="text-success">+{r.trend}%</TableCell>
                    <TableCell><Button size="icon" variant="ghost" aria-label="Save topic" onClick={() => setSaved(isSaved ? saved.filter((s) => s !== r.t) : [...saved, r.t])}>{isSaved ? <BookmarkCheck className="text-primary" /> : <Bookmark />}</Button></TableCell>
                  </TableRow>
                );
              })}</TableBody>
            </Table>
          ) : <div className="p-4"><EmptyState title="No topics match" body="Try a different keyword or category." /></div>}
        </Panel>
        <div className="space-y-4">
          <Panel title="Audience-interest categories">
            {INTERESTS.map((i) => <div key={i.n} className="mb-2"><div className="flex justify-between text-xs"><span>{i.n}</span><span>{i.p}%</span></div><div className="mt-1 h-2 rounded-full bg-elevated"><div className="h-2 rounded-full bg-primary" style={{ width: `${i.p * 2.5}%` }} /></div></div>)}
          </Panel>
          <Panel title="Saved research" action={<Link to="/ideas" className="text-xs text-primary">Turn into ideas</Link>}>
            {saved.length ? <ul className="space-y-1">{saved.map((s) => <li key={s} className="flex items-center justify-between text-sm">{s}<Button size="icon" variant="ghost" aria-label="Remove" onClick={() => setSaved(saved.filter((x) => x !== s))}><Trash2 /></Button></li>)}</ul> : <EmptyState title="No saved topics" body="Bookmark topics from the explorer." />}
          </Panel>
          <Panel title={<span className="flex items-center gap-2"><History className="size-4" /> Research history</span>}>
            <div className="flex flex-wrap gap-1.5">{history.map((h) => <button key={h} onClick={() => setQ(h)} className="rounded-full bg-elevated px-2.5 py-1 text-xs">{h}</button>)}</div>
          </Panel>
          <Panel title="Competitor research"><p className="text-sm text-muted-foreground">Compare demo competitor channels and topics.</p><Button asChild size="sm" variant="outline" className="mt-2"><Link to="/competitors">Open Competitor Research</Link></Button></Panel>
        </div>
      </div>
    </PageLoad>
  );
}
