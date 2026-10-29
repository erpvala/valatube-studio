import { createFileRoute, Link } from "@tanstack/react-router";
import { Tv, Video, CheckCircle2, CalendarClock, FilePen, Loader, XCircle, Eye, Users, DollarSign, Plus, Lightbulb, FileText, Send } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { PageLoad } from "@/components/app/PageLoad";
import { KpiCard, PageHeader, Panel, StatusBadge, Thumb } from "@/components/app/kit";
import { TrendChart, BarsChart, DonutChart } from "@/components/app/charts";
import { useChannel } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { channels, channelById, dailySeries, fmt, money, notifications, tasks, videos, workflows } from "@/data/mock";

export const Route = createFileRoute("/_studio/dashboard")({
  head: pageHead("Overview", "Studio-wide KPIs, trends, pipeline and task queue."),
  component: Dashboard,
});

function Dashboard() {
  const { channel } = useChannel();
  const chs = channel === "all" ? channels : channels.filter((c) => c.id === channel);
  const vids = videos.filter((v) => channel === "all" || v.channelId === channel);
  const tks = tasks.filter((t) => channel === "all" || t.channelId === channel);
  const count = (s: string) => vids.filter((v) => v.status === s).length;
  const views = chs.reduce((a, c) => a + c.views, 0);
  const subsGain = chs.reduce((a, c) => a + Math.round((c.subscribers * c.growth) / 100), 0);
  const viewKey = channel === "all" ? "views" : channel;
  const subKey = channel === "all" ? "subs" : `${channel}_subs`;
  const shorts = vids.filter((v) => v.type === "short").reduce((a, v) => a + v.views, 0);
  const longs = vids.filter((v) => v.type === "long").reduce((a, v) => a + v.views, 0);
  const pipeline = [
    { stage: "Ideas", n: 8 }, { stage: "Scripts", n: 5 }, { stage: "Production", n: count("processing") + 2 },
    { stage: "Review", n: 3 }, { stage: "Scheduled", n: count("scheduled") }, { stage: "Published", n: count("published") },
  ];

  return (
    <PageLoad>
      <PageHeader title="Overview" description="All figures are simulated — no YouTube account data has been retrieved."
        actions={<><Button asChild variant="outline" size="sm"><Link to="/ideas"><Lightbulb /> New idea</Link></Button><Button asChild size="sm"><Link to="/publishing"><Plus /> Create content</Link></Button></>} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <KpiCard label="Total Channels" value={`${chs.length}`} icon={Tv} />
        <KpiCard label="Total Videos" value={`${chs.reduce((a, c) => a + c.videos, 0)}`} icon={Video} tone="info" />
        <KpiCard label="Published (30d)" value={`${count("published")}`} icon={CheckCircle2} tone="success" />
        <KpiCard label="Scheduled" value={`${count("scheduled")}`} icon={CalendarClock} tone="info" />
        <KpiCard label="Drafts" value={`${count("draft")}`} icon={FilePen} tone="warning" />
        <KpiCard label="Processing Tasks" value={`${tks.filter((t) => t.status === "running" || t.status === "pending").length}`} icon={Loader} tone="info" />
        <KpiCard label="Failed Tasks" value={`${tks.filter((t) => t.status === "failed").length}`} icon={XCircle} tone="error" />
        <KpiCard label="Total Views" value={fmt(views)} delta="+8.1% vs prev. 30d" icon={Eye} />
        <KpiCard label="Subscriber Growth (30d)" value={`+${fmt(subsGain)}`} delta="+5.2%" icon={Users} tone="success" />
        <KpiCard label="Est. Revenue (30d)" value={money(chs.reduce((a, c) => a + c.revenue, 0))} delta="+3.4%" icon={DollarSign} tone="success" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel title="Views trend — last 30 days" className="xl:col-span-2"><TrendChart data={dailySeries} series={[{ key: viewKey, name: "Views", color: "var(--chart-1)" }]} /></Panel>
        <Panel title="Shorts vs long-form views"><DonutChart data={[{ name: "Shorts", value: shorts, color: "var(--chart-1)" }, { name: "Long-form", value: longs, color: "var(--chart-2)" }]} height={240} /></Panel>
        <Panel title="Subscriber growth"><TrendChart type="line" data={dailySeries} series={[{ key: subKey, name: "New subscribers", color: "var(--chart-3)" }]} height={200} /></Panel>
        <Panel title="Channel comparison (views)" className="xl:col-span-2"><BarsChart data={channels.map((c) => ({ name: c.name, views: c.views }))} series={[{ key: "views", name: "Views", color: "var(--chart-2)" }]} height={200} /></Panel>
      </div>

      <Panel title="Content production pipeline" className="mt-4">
        <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
          {pipeline.map((p, i) => (
            <div key={p.stage} className="rounded-lg bg-elevated p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-subtle">0{i + 1}</p>
              <p className="text-sm font-semibold">{p.stage}</p>
              <p className="font-display text-2xl font-bold text-primary">{p.n}</p>
            </div>
          ))}
        </div>
      </Panel>

      <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <Panel title="Top-performing content" action={<Link to="/analytics" className="text-xs text-primary">Analytics</Link>}>
          <ul className="space-y-3">
            {[...vids].filter((v) => v.views).sort((a, b) => b.views - a.views).slice(0, 4).map((v) => (
              <li key={v.id} className="flex items-center gap-3"><Thumb index={v.thumb} className="w-24 shrink-0" />
                <div className="min-w-0"><p className="truncate text-sm font-medium">{v.title}</p><p className="text-xs text-muted-foreground">{fmt(v.views)} views · {channelById(v.channelId).name}</p></div></li>
            ))}
          </ul>
        </Panel>
        <Panel title="Upcoming publications" action={<Link to="/calendar" className="text-xs text-primary">Calendar</Link>}>
          <ul className="space-y-2">
            {vids.filter((v) => v.status === "scheduled").sort((a, b) => a.date.localeCompare(b.date)).map((v) => (
              <li key={v.id} className="flex items-center justify-between gap-2 rounded-lg bg-elevated px-3 py-2"><div className="min-w-0"><p className="truncate text-sm">{v.title}</p><p className="text-xs text-muted-foreground">{v.date} · {channelById(v.channelId).name}</p></div><StatusBadge status={v.type} label={v.type === "short" ? "Short" : "Long"} /></li>
            ))}
            {!vids.some((v) => v.status === "scheduled") && <p className="text-sm text-muted-foreground">Nothing scheduled for this channel.</p>}
          </ul>
        </Panel>
        <Panel title="Task queue" action={<Link to="/tasks" className="text-xs text-primary">All tasks</Link>}>
          <ul className="space-y-3">
            {tks.slice(0, 5).map((t) => (
              <li key={t.id}><div className="flex items-center justify-between gap-2"><p className="truncate text-sm">{t.name}</p><StatusBadge status={t.status} /></div><Progress value={t.progress} className="mt-1.5 h-1.5" /></li>
            ))}
          </ul>
        </Panel>
        <Panel title="Recent videos">
          <ul className="divide-y divide-divider">
            {vids.slice(0, 6).map((v) => <li key={v.id} className="flex items-center justify-between gap-2 py-2"><span className="truncate text-sm">{v.title}</span><StatusBadge status={v.status} /></li>)}
          </ul>
        </Panel>
        <Panel title="Workflow health">
          <ul className="space-y-2">{workflows.map((w) => <li key={w.id} className="flex items-center justify-between text-sm"><span>{w.name}</span><StatusBadge status={w.status} /></li>)}</ul>
        </Panel>
        <Panel title="Recent activity & notifications">
          <ul className="space-y-2">{notifications.map((n) => <li key={n.id} className="flex gap-2 text-sm"><StatusBadge status={n.level} label={n.level} /><span className="min-w-0 truncate">{n.title}</span></li>)}</ul>
        </Panel>
      </div>

      <Panel title="Quick actions" className="mt-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[{ to: "/research", l: "Research topics", i: Lightbulb }, { to: "/scripts", l: "Write script", i: FileText }, { to: "/thumbnails", l: "Design thumbnail", i: Video }, { to: "/publishing", l: "Schedule upload", i: Send }].map((q) => (
            <Button key={q.to} asChild variant="outline" className="h-12 justify-start"><Link to={q.to}><q.i /> {q.l}</Link></Button>
          ))}
        </div>
      </Panel>
    </PageLoad>
  );
}
