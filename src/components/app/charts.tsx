import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { fmt } from "@/data/mock";

const axis = { stroke: "var(--subtle)", fontSize: 11, tickLine: false, axisLine: false } as const;
const tip = {
  contentStyle: { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--popover-foreground)", fontSize: 12 },
  labelStyle: { color: "var(--muted-foreground)" },
};

type Series = { key: string; name: string; color: string };

export function TrendChart({ data, series, height = 240, type = "area" }: { data: object[]; series: Series[]; height?: number; type?: "area" | "line" }) {
  const C = type === "area" ? AreaChart : LineChart;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <C data={data} margin={{ left: -12, right: 8, top: 8 }}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`g-${s.key}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid stroke="var(--divider)" vertical={false} />
        <XAxis dataKey="date" {...axis} interval="preserveStartEnd" minTickGap={24} />
        <YAxis {...axis} tickFormatter={(v) => fmt(v)} width={48} />
        <Tooltip {...tip} formatter={(v: number) => v.toLocaleString()} />
        {series.length > 1 && <Legend wrapperStyle={{ fontSize: 11 }} />}
        {series.map((s) =>
          type === "area" ? (
            <Area key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color} strokeWidth={2} fill={`url(#g-${s.key})`} />
          ) : (
            <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color} strokeWidth={2} dot={false} />
          ),
        )}
      </C>
    </ResponsiveContainer>
  );
}

export function BarsChart({ data, series, xKey = "name", height = 240, stacked }: { data: object[]; series: Series[]; xKey?: string; height?: number; stacked?: boolean }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ left: -12, right: 8, top: 8 }}>
        <CartesianGrid stroke="var(--divider)" vertical={false} />
        <XAxis dataKey={xKey} {...axis} />
        <YAxis {...axis} tickFormatter={(v) => fmt(v)} width={48} />
        <Tooltip {...tip} cursor={{ fill: "var(--elevated)" }} formatter={(v: number) => v.toLocaleString()} />
        {series.length > 1 && <Legend wrapperStyle={{ fontSize: 11 }} />}
        {series.map((s) => (
          <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color} radius={[4, 4, 0, 0]} {...(stacked ? { stackId: "a" } : {})} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DonutChart({ data, height = 200 }: { data: { name: string; value: number; color: string }[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="85%" paddingAngle={2} stroke="none">
          {data.map((d) => <Cell key={d.name} fill={d.color} />)}
        </Pie>
        <Tooltip {...tip} formatter={(v: number) => v.toLocaleString()} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
