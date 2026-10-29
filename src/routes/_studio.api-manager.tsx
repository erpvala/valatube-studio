import { createFileRoute } from "@tanstack/react-router";
import { Activity, Gauge, AlertTriangle, Timer } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { PageLoad } from "@/components/app/PageLoad";
import { CopyButton, KpiCard, PageHeader, Panel, StatusBadge, UnavailableNote } from "@/components/app/kit";
import { BarsChart } from "@/components/app/charts";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { dailySeries } from "@/data/mock";

export const Route = createFileRoute("/_studio/api-manager")({
  head: pageHead("API Manager", "Demo API usage dashboard and endpoint reference."),
  component: ApiManager,
});

const ENDPOINTS = [
  { m: "GET", p: "/v1/channels", d: "List workspace channels." },
  { m: "GET", p: "/v1/videos?status=scheduled", d: "List videos filtered by status." },
  { m: "POST", p: "/v1/ideas", d: "Create an idea." },
  { m: "POST", p: "/v1/tasks/{id}/retry", d: "Retry a failed task." },
  { m: "GET", p: "/v1/analytics/views?range=30d", d: "Views time series." },
];
const usage = dailySeries.slice(-14).map((r, i) => ({ date: r["date"], calls: 800 + ((i * 137) % 600), errors: (i * 7) % 30 }));

function ApiManager() {
  return (
    <PageLoad>
      <PageHeader title="API Manager" description="Planned ValaTube API — usage numbers are illustrative. No API is live in Phase 01." />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Calls (14d)" value={usage.reduce((a, u) => a + u.calls, 0).toLocaleString()} icon={Activity} />
        <KpiCard label="Quota used" value="38%" icon={Gauge} tone="info" />
        <KpiCard label="Errors (14d)" value={`${usage.reduce((a, u) => a + u.errors, 0)}`} icon={AlertTriangle} tone="error" />
        <KpiCard label="p95 latency" value="212 ms" icon={Timer} tone="warning" />
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_360px]">
        <Panel title="Usage"><BarsChart data={usage} xKey="date" stacked series={[{ key: "calls", name: "Calls", color: "var(--chart-2)" }, { key: "errors", name: "Errors", color: "var(--chart-1)" }]} /></Panel>
        <Panel title="Integration status">
          {(["YouTube Data API", "YouTube Analytics API", "AI provider router", "Webhook delivery"] as const).map((n) => [n, "not_connected"] as const).map(([n, s]) => <div key={n} className="mb-2 flex items-center justify-between text-sm">{n}<StatusBadge status={s} /></div>)}
          <UnavailableNote>API keys are not generated or stored in Phase 01.</UnavailableNote>
        </Panel>
      </div>
      <Panel title="Endpoint documentation (draft)" className="mt-4">
        <Accordion type="single" collapsible>
          {ENDPOINTS.map((e) => (
            <AccordionItem key={e.p} value={e.p}>
              <AccordionTrigger><span className="flex items-center gap-2 font-mono text-sm"><span className={`rounded px-1.5 text-[10px] font-bold ${e.m === "GET" ? "bg-info/15 text-info" : "bg-success/15 text-success"}`}>{e.m}</span>{e.p}</span></AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground">{e.d}</p>
                <pre className="mt-2 overflow-x-auto rounded-lg bg-elevated p-3 font-mono text-xs">{`curl -X ${e.m} https://api.valatube.example${e.p} \\\n  -H "Authorization: Bearer <YOUR_KEY>"`}</pre>
                <div className="mt-2"><CopyButton text={`curl -X ${e.m} https://api.valatube.example${e.p}`} label="Copy cURL" /></div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Panel>
    </PageLoad>
  );
}
