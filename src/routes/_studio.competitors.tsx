import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Star, ArrowUpDown } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { PageLoad } from "@/components/app/PageLoad";
import { Chips, EmptyState, PageHeader, Panel } from "@/components/app/kit";
import { BarsChart } from "@/components/app/charts";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { competitors as seed, fmt } from "@/data/mock";
import { useLocalState } from "@/lib/local-store";

export const Route = createFileRoute("/_studio/competitors")({
  head: pageHead("Competitor Research", "Compare fictional competitor channels, topics and cadence."),
  component: Competitors,
});

const TOPICS = [
  { topic: "Buying guides", you: 6, them: 9 }, { topic: "Comparisons", you: 4, them: 12 },
  { topic: "Tutorials", you: 8, them: 5 }, { topic: "Shorts tips", you: 10, them: 14 },
];

function Competitors() {
  const [list, setList] = useLocalState("competitors", seed);
  const [niche, setNiche] = useState("all");
  const [savedOnly, setSavedOnly] = useState(false);
  const [sort, setSort] = useState<"subs" | "avgViews" | "uploadsPerWeek">("subs");
  const rows = list.filter((c) => (niche === "all" || c.niche === niche) && (!savedOnly || c.saved)).sort((a, b) => b[sort] - a[sort]);

  return (
    <PageLoad>
      <PageHeader title="Competitor Research" description="Competitor channels and figures are fictional examples." />
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Chips value={niche} onChange={setNiche} options={[{ value: "all", label: "All" }, ...["Tech Reviews", "Cooking", "Travel", "Personal Finance"].map((n) => ({ value: n, label: n }))]} />
        <Button size="sm" variant={savedOnly ? "soft" : "outline"} onClick={() => setSavedOnly(!savedOnly)}><Star /> Saved only</Button>
      </div>
      {rows.length === 0 ? <EmptyState title="No competitors" body="Clear filters to see all." /> : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {rows.map((c) => (
            <div key={c.id} className="rounded-xl border bg-card p-4">
              <div className="flex items-start justify-between"><div className="grid size-10 place-items-center rounded-full bg-elevated font-display font-bold">{c.name[0]}</div><Button size="icon" variant="ghost" aria-label="Save competitor" onClick={() => setList(list.map((x) => (x.id === c.id ? { ...x, saved: !x.saved } : x)))}><Star className={c.saved ? "fill-primary text-primary" : ""} /></Button></div>
              <p className="mt-2 font-semibold">{c.name}</p><p className="text-xs text-muted-foreground">{c.niche}</p>
              <p className="mt-2 text-xs">Top topic: <span className="text-foreground">{c.topTopic}</span></p>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Panel title="Video comparison" bodyClass="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Channel</TableHead>{([["subs", "Subscribers"], ["avgViews", "Avg views"], ["uploadsPerWeek", "Uploads/wk"]] as const).map(([k, l]) => <TableHead key={k}><button className="inline-flex items-center gap-1" onClick={() => setSort(k)}>{l}<ArrowUpDown className={`size-3 ${sort === k ? "text-primary" : ""}`} /></button></TableHead>)}</TableRow></TableHeader>
            <TableBody>{rows.map((c) => <TableRow key={c.id}><TableCell className="font-medium">{c.name}</TableCell><TableCell>{fmt(c.subs)}</TableCell><TableCell>{fmt(c.avgViews)}</TableCell><TableCell>{c.uploadsPerWeek}</TableCell></TableRow>)}</TableBody>
          </Table>
        </Panel>
        <Panel title="Publishing frequency (uploads / week)"><BarsChart data={rows.map((c) => ({ name: c.name.split(" ")[0], uploads: c.uploadsPerWeek }))} series={[{ key: "uploads", name: "Uploads/wk", color: "var(--chart-4)" }]} height={220} /></Panel>
        <Panel title="Topic comparison — videos last 90 days" className="xl:col-span-2"><BarsChart data={TOPICS} xKey="topic" series={[{ key: "you", name: "Your channels", color: "var(--chart-1)" }, { key: "them", name: "Saved competitors", color: "var(--chart-2)" }]} height={220} /></Panel>
      </div>
    </PageLoad>
  );
}
