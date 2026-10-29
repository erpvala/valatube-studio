import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plug, ShieldCheck, AlertTriangle } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { PageLoad } from "@/components/app/PageLoad";
import { Chips, ErrorState, PageHeader, Panel, StatusBadge, UnavailableNote } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { integrations } from "@/data/mock";

export const Route = createFileRoute("/_studio/integrations")({
  head: pageHead("Integrations", "Catalog of YouTube, AI provider and media integrations."),
  component: Integrations,
});

const PERMS = ["View channel statistics", "Upload & schedule videos", "Edit video metadata", "Read analytics reports"];

function Integrations() {
  const cats = Array.from(new Set(integrations.map((i) => i.category)));
  const [cat, setCat] = useState("all");
  const [wizard, setWizard] = useState<(typeof integrations)[number] | null>(null);
  const [step, setStep] = useState(1);
  const rows = integrations.filter((i) => cat === "all" || i.category === cat);

  return (
    <PageLoad>
      <PageHeader title="Integrations" description="No services are connected in Phase 01. ValaTube Studio is not affiliated with or endorsed by YouTube or Google." />
      <Panel title={<span className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" /> About the YouTube integration</span>} className="mb-4">
        <p className="text-sm text-muted-foreground">Phase 02 will use Google OAuth and the official YouTube Data & Analytics APIs. You'll be asked to grant:</p>
        <ul className="mt-2 grid gap-1 text-sm sm:grid-cols-2">{PERMS.map((p) => <li key={p} className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-primary" />{p}</li>)}</ul>
      </Panel>
      <Chips value={cat} onChange={setCat} options={[{ value: "all", label: "All" }, ...cats.map((c) => ({ value: c, label: c }))]} />
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map((i) => (
          <div key={i.id} className="flex flex-col rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between"><span className="grid size-10 place-items-center rounded-lg bg-elevated"><Plug className="size-5 text-primary" /></span><StatusBadge status={i.status} /></div>
            <p className="mt-3 font-semibold">{i.name}</p><p className="text-xs text-subtle">{i.category}</p>
            <p className="mt-1 flex-1 text-sm text-muted-foreground">{i.desc}</p>
            {i.status === "error" && <p className="mt-2 flex items-center gap-1 text-xs text-destructive"><AlertTriangle className="size-3.5" /> Example error state: credentials rejected</p>}
            <Button size="sm" variant="outline" className="mt-3" onClick={() => { setWizard(i); setStep(1); }}>Set up</Button>
          </div>
        ))}
      </div>
      <Dialog open={!!wizard} onOpenChange={(o) => !o && setWizard(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Connect {wizard?.name} · Step {step}/3</DialogTitle></DialogHeader>
          {step === 1 && <div className="space-y-2 text-sm"><p>{wizard?.desc}</p><p className="text-muted-foreground">Permissions requested:</p><ul className="list-disc pl-5 text-muted-foreground">{PERMS.slice(0, wizard?.category === "Platform" ? 4 : 1).map((p) => <li key={p}>{p}</li>)}</ul></div>}
          {step === 2 && <UnavailableNote>Authorization and credential storage require a secure backend. This step is a preview only — nothing will be stored.</UnavailableNote>}
          {step === 3 && <ErrorState title="Connection unavailable in Phase 01" body="This integration cannot be activated yet. It will remain “Not connected”." />}
          <DialogFooter>{step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>}{step < 3 ? <Button onClick={() => setStep(step + 1)}>Continue</Button> : <Button onClick={() => setWizard(null)}>Close</Button>}</DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLoad>
  );
}
