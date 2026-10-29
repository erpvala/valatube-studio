import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DollarSign, TrendingUp, Wallet, PieChart } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { PageLoad } from "@/components/app/PageLoad";
import { Chips, KpiCard, PageHeader, Panel } from "@/components/app/kit";
import { BarsChart, DonutChart, TrendChart } from "@/components/app/charts";
import { useChannel } from "@/components/app/AppShell";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { channels, dailySeries, money } from "@/data/mock";

export const Route = createFileRoute("/_studio/revenue")({
  head: pageHead("Revenue Overview", "Estimated revenue by channel and category (simulated)."),
  component: Revenue,
});

const CATS = [{ name: "Ad revenue", share: 0.62, color: "var(--chart-1)" }, { name: "Memberships", share: 0.14, color: "var(--chart-2)" }, { name: "Super Thanks", share: 0.06, color: "var(--chart-3)" }, { name: "Sponsorships", share: 0.18, color: "var(--chart-4)" }];

function Revenue() {
  const { channel } = useChannel();
  const [range, setRange] = useState<"7" | "30">("30");
  const data = dailySeries.slice(-Number(range));
  const key = channel === "all" ? "revenue" : `${channel}_rev`;
  const total = data.reduce((a, r) => a + (r[key] as number), 0);
  const rpm = total / (data.reduce((a, r) => a + (r[channel === "all" ? "views" : channel] as number), 0) / 1000);

  return (
    <PageLoad>
      <PageHeader title="Revenue Overview" description="All amounts are fictional estimates. No earnings data or billing is connected." actions={<Chips value={range} onChange={setRange} options={[{ value: "7", label: "7 days" }, { value: "30", label: "30 days" }]} />} />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label={`Est. revenue (${range}d)`} value={money(total)} icon={DollarSign} tone="success" />
        <KpiCard label="Est. RPM" value={`$${rpm.toFixed(2)}`} icon={TrendingUp} />
        <KpiCard label="Avg per day" value={money(Math.round(total / data.length))} icon={Wallet} tone="info" />
        <KpiCard label="Top category" value="Ad revenue" icon={PieChart} tone="warning" />
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel title="Revenue trend" className="xl:col-span-2"><TrendChart data={data} series={[{ key, name: "Est. revenue ($)", color: "var(--chart-3)" }]} /></Panel>
        <Panel title="Revenue categories"><DonutChart height={240} data={CATS.map((c) => ({ name: c.name, value: Math.round(total * c.share), color: c.color }))} /></Panel>
        <Panel title="Channel comparison" className="xl:col-span-3"><BarsChart data={channels.map((c) => ({ name: c.name, revenue: data.reduce((a, r) => a + (r[`${c.id}_rev`] as number), 0) }))} series={[{ key: "revenue", name: "Est. revenue ($)", color: "var(--chart-1)" }]} height={220} /></Panel>
      </div>
      <Panel title="Earnings detail (demo)" className="mt-4" bodyClass="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>Channel</TableHead>{CATS.map((c) => <TableHead key={c.name} className="hidden md:table-cell">{c.name}</TableHead>)}<TableHead>Total</TableHead></TableRow></TableHeader>
          <TableBody>{channels.map((c) => { const t = data.reduce((a, r) => a + (r[`${c.id}_rev`] as number), 0); return <TableRow key={c.id}><TableCell className="font-medium">{c.name}</TableCell>{CATS.map((k) => <TableCell key={k.name} className="hidden md:table-cell">{money(Math.round(t * k.share))}</TableCell>)}<TableCell className="font-semibold">{money(t)}</TableCell></TableRow>; })}</TableBody>
        </Table>
      </Panel>
    </PageLoad>
  );
}
