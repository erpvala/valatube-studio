import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bot, Save } from "lucide-react";
import { toast } from "sonner";
import { pageHead } from "@/lib/seo";
import { PageLoad } from "@/components/app/PageLoad";
import { Field, PageHeader, Panel, StatusBadge, UnavailableNote } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { agents as seed, channels } from "@/data/mock";
import { useLocalState } from "@/lib/local-store";

export const Route = createFileRoute("/_studio/agents")({
  head: pageHead("AI Agents", "Configure and assign research, script, SEO and planning agents."),
  component: Agents,
});

const LOGS = [
  "08:02 Research Agent — compiled 12 demo topics for Circuit Bay",
  "08:15 Script Assistant — outline drafted for 'Laptop Buying Guide' (simulated)",
  "09:01 SEO Assistant — 5 title variants prepared (simulated)",
  "09:20 Content Planning Agent — paused by Demo Admin",
];

function Agents() {
  const [list, setList] = useLocalState("agents", seed);
  const [sel, setSel] = useState(list[0]?.id ?? "");
  const a = list.find((x) => x.id === sel) ?? list[0]!;
  const [creativity, setCreativity] = useState([0.6]);
  const upd = (patch: Partial<typeof a>) => setList(list.map((x) => (x.id === sel ? { ...x, ...patch } : x)));

  return (
    <PageLoad>
      <PageHeader title="AI Agents" description="Agents are configuration mock-ups. None are executed and no model is connected." />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {list.map((x) => (
          <button key={x.id} onClick={() => setSel(x.id)} className={`rounded-xl border bg-card p-4 text-left ${sel === x.id ? "border-primary" : ""}`}>
            <div className="flex items-center justify-between"><span className="grid size-9 place-items-center rounded-lg bg-primary-soft"><Bot className="size-5 text-primary" /></span><StatusBadge status={x.status} /></div>
            <p className="mt-3 font-semibold">{x.name}</p><p className="text-xs text-muted-foreground">{x.role}</p><p className="mt-2 text-xs text-subtle">{x.tasks} demo tasks</p>
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_380px]">
        <Panel title={`Configure: ${a.name}`} action={<Button size="sm" onClick={() => toast.success("Agent configuration saved locally")}><Save /> Save</Button>}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Status"><Select value={a.status} onValueChange={(v) => upd({ status: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="idle">Idle</SelectItem><SelectItem value="paused">Paused</SelectItem></SelectContent></Select></Field>
            <Field label="Model provider" hint="Connect providers in Integrations (Phase 02)"><Select value="none" disabled><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">Not connected</SelectItem></SelectContent></Select></Field>
            <Field label={`Creativity: ${(creativity[0] ?? 0).toFixed(1)}`}><Slider min={0} max={1} step={0.1} value={creativity} onValueChange={setCreativity} /></Field>
            <Field label="Instructions"><Textarea rows={3} defaultValue={`You are the ${a.name}. ${a.role}. Keep a friendly, factual tone.`} /></Field>
          </div>
          <p className="mb-2 mt-5 text-xs font-medium text-muted-foreground">Channel assignment</p>
          <div className="grid gap-2 sm:grid-cols-2">{channels.map((c) => <label key={c.id} className="flex items-center gap-2 rounded-lg bg-elevated p-3 text-sm"><Checkbox checked={a.channelIds.includes(c.id)} onCheckedChange={(v) => upd({ channelIds: v ? [...a.channelIds, c.id] : a.channelIds.filter((x) => x !== c.id) })} />{c.name}</label>)}</div>
          <div className="mt-4"><UnavailableNote>“Run agent” is disabled in Phase 01 — no AI calls are made.</UnavailableNote></div>
        </Panel>
        <Panel title="Activity log (demo)"><ul className="space-y-2 font-mono text-xs">{LOGS.map((l) => <li key={l} className="rounded bg-elevated px-2 py-1.5">{l}</li>)}</ul></Panel>
      </div>
    </PageLoad>
  );
}
