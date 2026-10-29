import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Save, ShieldCheck, Zap, GitBranch, PlayCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { pageHead } from "@/lib/seo";
import { PageLoad } from "@/components/app/PageLoad";
import { Field, PageHeader, Panel, StatusBadge, UnavailableNote } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { workflows as seed } from "@/data/mock";
import { useLocalState } from "@/lib/local-store";

export const Route = createFileRoute("/_studio/workflows")({
  head: pageHead("Automation Workflows", "Design trigger, condition and action workflows (simulated)."),
  component: Workflows,
});

type Node = { id: string; kind: "trigger" | "condition" | "action"; label: string; config: string };
const START: Node[] = [
  { id: "n1", kind: "trigger", label: "Idea approved", config: "Any channel" },
  { id: "n2", kind: "action", label: "Draft script", config: "Script Assistant" },
  { id: "n3", kind: "condition", label: "Word count ≥ 1200", config: "else notify" },
  { id: "n4", kind: "action", label: "Send to Approval Center", config: "Reviewer: Demo Admin" },
];
const KIND = { trigger: { icon: Zap, cls: "border-warning text-warning" }, condition: { icon: GitBranch, cls: "border-info text-info" }, action: { icon: PlayCircle, cls: "border-primary text-primary" } };
const RUNS = [
  { id: "R-221", wf: "Idea → Script → Review", at: "2026-10-30 08:00", result: "completed" },
  { id: "R-220", wf: "Failed upload alert", at: "2026-10-29 21:04", result: "completed" },
  { id: "R-219", wf: "Long-form → 3 Shorts", at: "2026-10-29 19:12", result: "failed" },
];

function Workflows() {
  const [list, setList] = useLocalState("workflows", seed);
  const [nodes, setNodes] = useLocalState<Node[]>("wf-nodes", START);
  const [sel, setSel] = useState("n1");
  const [issues, setIssues] = useState<string[] | null>(null);
  const cur = nodes.find((n) => n.id === sel);
  const add = (kind: Node["kind"]) => { const n = { id: `n${Date.now()}`, kind, label: `New ${kind}`, config: "" }; setNodes([...nodes, n]); setSel(n.id); setIssues(null); };
  const validate = () => {
    const out: string[] = [];
    if (nodes[0]?.kind !== "trigger") out.push("Workflow must start with a trigger.");
    if (nodes.filter((n) => n.kind === "trigger").length > 1) out.push("Only one trigger is allowed.");
    if (!nodes.some((n) => n.kind === "action")) out.push("Add at least one action.");
    nodes.forEach((n) => !n.label.trim() && out.push("Every node needs a label."));
    setIssues(out);
    out.length ? toast.error(`${out.length} validation issue(s)`) : toast.success("Workflow is valid");
  };

  return (
    <PageLoad>
      <PageHeader title="Automation Workflows" description="Workflows are designed here but never executed in Phase 01." />
      <Tabs defaultValue="builder">
        <TabsList><TabsTrigger value="builder">Builder</TabsTrigger><TabsTrigger value="library">Library</TabsTrigger><TabsTrigger value="runs">Run history</TabsTrigger></TabsList>
        <TabsContent value="builder">
          <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
            <Panel title="Idea → Script → Review" action={<div className="flex gap-2"><Button size="sm" variant="outline" onClick={validate}><ShieldCheck /> Validate</Button><Button size="sm" onClick={() => toast.success("Workflow draft saved locally")}><Save /> Save draft</Button></div>} bodyClass="grid-dots min-h-[420px]">
              <div className="mx-auto flex max-w-sm flex-col items-center">
                {nodes.map((n, i) => {
                  const K = KIND[n.kind];
                  return (
                    <div key={n.id} className="flex w-full flex-col items-center">
                      {i > 0 && <div className="h-6 w-0.5 bg-border" />}
                      <button onClick={() => setSel(n.id)} className={`flex w-full items-center gap-3 rounded-xl border-2 bg-card p-3 text-left ${K.cls} ${sel === n.id ? "ring-2 ring-ring ring-offset-2 ring-offset-background" : ""}`}>
                        <K.icon className="size-5 shrink-0" /><span><span className="block text-[10px] font-semibold uppercase tracking-wider">{n.kind}</span><span className="text-sm font-semibold text-foreground">{n.label}</span></span>
                      </button>
                    </div>
                  );
                })}
                <div className="h-6 w-0.5 bg-border" />
                <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => add("trigger")}><Plus /> Trigger</Button><Button size="sm" variant="outline" onClick={() => add("condition")}><Plus /> Condition</Button><Button size="sm" variant="outline" onClick={() => add("action")}><Plus /> Action</Button></div>
              </div>
            </Panel>
            <div className="space-y-4">
              {cur && <Panel title="Node configuration" action={<Button size="icon" variant="ghost" aria-label="Delete node" onClick={() => { setNodes(nodes.filter((n) => n.id !== cur.id)); setSel(nodes[0]?.id); }}><Trash2 /></Button>}>
                <div className="space-y-3">
                  <Field label="Label"><Input value={cur.label} onChange={(e) => setNodes(nodes.map((n) => (n.id === cur.id ? { ...n, label: e.target.value } : n)))} /></Field>
                  <Field label="Configuration"><Input value={cur.config} onChange={(e) => setNodes(nodes.map((n) => (n.id === cur.id ? { ...n, config: e.target.value } : n)))} /></Field>
                </div>
              </Panel>}
              {issues && <Panel title="Validation">{issues.length ? <ul className="list-disc space-y-1 pl-4 text-sm text-destructive">{issues.map((x) => <li key={x}>{x}</li>)}</ul> : <p className="text-sm text-success">No issues found.</p>}</Panel>}
              <UnavailableNote>Execution engine and scheduler are planned for Phase 02.</UnavailableNote>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="library">
          <div className="grid gap-3 md:grid-cols-2">{list.map((w) => <div key={w.id} className="rounded-xl border bg-card p-4"><div className="flex items-start justify-between gap-2"><div><p className="font-semibold">{w.name}</p><p className="text-xs text-muted-foreground">Trigger: {w.trigger}</p></div><Switch checked={w.enabled} aria-label="Enable workflow" onCheckedChange={(v) => { setList(list.map((x) => (x.id === w.id ? { ...x, enabled: v, status: v ? "healthy" : "paused" } : x))); toast(v ? "Workflow enabled (simulation)" : "Workflow disabled"); }} /></div><div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground"><StatusBadge status={w.status} />{w.runs} demo runs · last {w.lastRun}</div></div>)}</div>
        </TabsContent>
        <TabsContent value="runs">
          <Panel bodyClass="p-0"><Table><TableHeader><TableRow><TableHead>Run</TableHead><TableHead>Workflow</TableHead><TableHead>Time</TableHead><TableHead>Result</TableHead></TableRow></TableHeader><TableBody>{RUNS.map((r) => <TableRow key={r.id}><TableCell className="font-mono text-xs">{r.id}</TableCell><TableCell>{r.wf}</TableCell><TableCell className="text-xs">{r.at}</TableCell><TableCell><StatusBadge status={r.result} /></TableCell></TableRow>)}</TableBody></Table></Panel>
        </TabsContent>
      </Tabs>
    </PageLoad>
  );
}
