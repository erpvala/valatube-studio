import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, Clock, Users, ThumbsUp } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { PageLoad } from "@/components/app/PageLoad";
import { Chips, KpiCard, PageHeader, Panel, Thumb } from "@/components/app/kit";
import { BarsChart, DonutChart, TrendChart } from "@/components/app/charts";
import { useChannel } from "@/components/app/AppShell";
import { channels, channelById, dailySeries, fmt, videos } from "@/data/mock";

export const Route = createFileRoute("/_studio/analytics")({
  head: pageHead("Analytics", "Views, watch time, subscribers and engagement (simulated)."),
  component: Analytics,
});

function Analytics() {
  const { channel } = useChannel();
  const [range, setRange] = useState<"7" | "14" | "30">("30");
  const data = dailySeries.slice(-Number(range));
  const vk = channel === "all" ? "views" : channel;
  const sk = channel === "all" ? "subs" : `${channel}_subs`;
  const views = data.reduce((a, r) => a + (r[vk] as number), 0);
  const subs = data.reduce((a, r) => a + (r[sk] as number), 0);
  const vids = videos.filter((v) => v.views && (channel === "all" || v.channelId === channel));
  const likes = vids.reduce((a, v) => a + v.likes, 0);
  const watch = Math.round(views * 0.09);
  const sv = vids.filter((v) => v.type === "short"), lv = vids.filter((v) => v.type === "long");

  return (
    <PageLoad>
      <PageHeader title="Analytics" description="Simulated metrics from the demo dataset — not YouTube Analytics." actions={<Chips value={range} onChange={setRange} options={[{ value: "7", label: "7 days" }, { value: "14", label: "14 days" }, { value: "30", label: "30 days" }]} />} />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label={`Views (${range}d)`} value={fmt(views)} icon={Eye} />
        <KpiCard label="Watch time (hrs)" value={fmt(watch)} icon={Clock} tone="info" />
        <KpiCard label="New subscribers" value={`+${fmt(subs)}`} icon={Users} tone="success" />
        <KpiCard label="Engagement rate" value={`${((likes / Math.max(1, vids.reduce((a, v) => a + v.views, 0))) * 100).toFixed(1)}%`} icon={ThumbsUp} tone="warning" />
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Panel title="Views & watch time"><TrendChart data={data.map((r) => ({ ...r, watchSel: Math.round((r[vk] as number) * 0.09) }))} series={[{ key: vk, name: "Views", color: "var(--chart-1)" }, { key: "watchSel", name: "Watch hrs", color: "var(--chart-2)" }]} /></Panel>
        <Panel title="Subscriber growth"><BarsChart data={data} xKey="date" series={[{ key: sk, name: "New subscribers", color: "var(--chart-3)" }]} /></Panel>
        <Panel title="Shorts vs long-form"><div className="grid gap-4 sm:grid-cols-2"><DonutChart data={[{ name: "Shorts views", value: sv.reduce((a, v) => a + v.views, 0), color: "var(--chart-1)" }, { name: "Long views", value: lv.reduce((a, v) => a + v.views, 0), color: "var(--chart-2)" }]} /><DonutChart data={[{ name: "Shorts watch hrs", value: sv.reduce((a, v) => a + v.watchHours, 0), color: "var(--chart-1)" }, { name: "Long watch hrs", value: lv.reduce((a, v) => a + v.watchHours, 0), color: "var(--chart-2)" }]} /></div></Panel>
        <Panel title="Channel comparison (views per day)"><TrendChart type="line" data={data} series={channels.map((c) => ({ key: c.id, name: c.name, color: c.color }))} /></Panel>
      </div>
      <Panel title="Top-performing videos" className="mt-4" bodyClass="p-0">
        <div className="divide-y divide-divider">{[...vids].sort((a, b) => b.views - a.views).map((v, i) => (
          <div key={v.id} className="flex items-center gap-3 px-4 py-2.5"><span className="w-5 font-display font-bold text-subtle">{i + 1}</span><Thumb index={v.thumb} className="w-20 shrink-0" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{v.title}</p><p className="text-xs text-muted-foreground">{channelById(v.channelId).name} · CTR {v.ctr}%</p></div><div className="text-right text-sm"><p className="font-semibold">{fmt(v.views)}</p><p className="text-xs text-muted-foreground">{fmt(v.likes)} likes</p></div></div>
        ))}</div>
      </Panel>
    </PageLoad>
  );
}
