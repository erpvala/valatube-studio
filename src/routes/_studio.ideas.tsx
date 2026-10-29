import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, FileText, Smartphone, MonitorPlay } from "lucide-react";
import { toast } from "sonner";
import { pageHead } from "@/lib/seo";
import { PageLoad } from "@/components/app/PageLoad";
import { Chips, ConfirmAction, EmptyState, Field, PageHeader, SearchBox, StatusBadge } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { ideas as seed, type Idea } from "@/data/mock";
import { useLocalState } from "@/lib/local-store";

export const Route = createFileRoute("/_studio/ideas")({
  head: pageHead("Ideas Studio", "Capture, filter and develop video and Shorts ideas."),
  component: Ideas,
});

const NICHES = ["Tech Reviews", "Cooking", "Travel", "Personal Finance"];
const blank: Idea = { id: "", title: "", type: "long", niche: "Tech Reviews", audience: "", score: 70, notes: "" };

function Ideas() {
  const navigate = useNavigate();
  const [list, setList] = useLocalState<Idea[]>("ideas", seed);
  const [q, setQ] = useState("");
  const [type, setType] = useState<"all" | "long" | "short">("all");
  const [niche, setNiche] = useState("all");
  const [edit, setEdit] = useState<Idea | null>(null);
  const [err, setErr] = useState("");
  const rows = list.filter((i) => (type === "all" || i.type === type) && (niche === "all" || i.niche === niche) && i.title.toLowerCase().includes(q.toLowerCase()));

  const save = () => {
    if (!edit) return;
    if (edit.title.trim().length < 5) return setErr("Title must be at least 5 characters.");
    if (edit.id) setList(list.map((i) => (i.id === edit.id ? edit : i)));
    else setList([{ ...edit, id: `i${Date.now()}` }, ...list]);
    toast.success("Idea saved locally");
    setEdit(null);
  };

  return (
    <PageLoad>
      <PageHeader title="Ideas Studio" description="Demo idea scores are illustrative." actions={<Button size="sm" onClick={() => { setEdit({ ...blank }); setErr(""); }}><Plus /> New idea</Button>} />
      <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-center">
        <SearchBox value={q} onChange={setQ} placeholder="Search ideas…" className="lg:w-72" />
        <Chips value={type} onChange={setType} options={[{ value: "all", label: "All" }, { value: "long", label: "Long-form" }, { value: "short", label: "Shorts" }]} />
        <Select value={niche} onValueChange={setNiche}><SelectTrigger className="h-9 w-48 bg-surface" aria-label="Niche filter"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All niches</SelectItem>{NICHES.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent></Select>
      </div>
      {rows.length === 0 ? <EmptyState title="No ideas match" body="Adjust filters or create a new idea." action={<Button size="sm" onClick={() => setEdit({ ...blank })}><Plus /> New idea</Button>} /> : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {rows.map((i) => (
            <article key={i.id} className="flex flex-col rounded-xl border bg-card p-4 shadow-card">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">{i.type === "short" ? <Smartphone className="size-3.5 text-primary" /> : <MonitorPlay className="size-3.5" />}{i.niche}</span>
                <span className="font-display text-sm font-bold text-primary">{i.score}</span>
              </div>
              <h3 className="mt-2 font-semibold leading-snug">{i.title}</h3>
              <p className="mt-1 line-clamp-2 flex-1 text-xs text-muted-foreground">{i.notes || "No notes yet."}</p>
              <div className="mt-2"><StatusBadge status={i.type} label={i.audience || "General audience"} /></div>
              <div className="mt-3 flex gap-1 border-t border-divider pt-3">
                <Button size="sm" variant="soft" className="flex-1" onClick={() => navigate({ to: "/scripts", search: { idea: i.title } as never })}><FileText /> To script</Button>
                <Button size="icon" variant="ghost" aria-label="Edit idea" onClick={() => { setEdit(i); setErr(""); }}><Pencil /></Button>
                <ConfirmAction destructive title="Delete idea?" description={`“${i.title}” will be removed from this browser.`} confirmLabel="Delete" onConfirm={() => { setList(list.filter((x) => x.id !== i.id)); toast("Idea deleted"); }} trigger={<Button size="icon" variant="ghost" aria-label="Delete idea"><Trash2 /></Button>} />
              </div>
            </article>
          ))}
        </div>
      )}

      <Sheet open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader><SheetTitle>{edit?.id ? "Edit idea" : "New idea"}</SheetTitle></SheetHeader>
          {edit && <div className="space-y-3 px-4">
            <Field label="Title" error={err}><Input value={edit.title} onChange={(e) => { setEdit({ ...edit, title: e.target.value }); setErr(""); }} /></Field>
            <Field label="Format"><Chips value={edit.type} onChange={(v) => setEdit({ ...edit, type: v })} options={[{ value: "long", label: "Long-form" }, { value: "short", label: "Short" }]} /></Field>
            <Field label="Niche"><Select value={edit.niche} onValueChange={(v) => setEdit({ ...edit, niche: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{NICHES.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent></Select></Field>
            <Field label="Target audience"><Input value={edit.audience} onChange={(e) => setEdit({ ...edit, audience: e.target.value })} placeholder="e.g. Beginners" /></Field>
            <Field label="Notes"><Textarea rows={4} value={edit.notes} onChange={(e) => setEdit({ ...edit, notes: e.target.value })} /></Field>
          </div>}
          <SheetFooter><Button onClick={save}>Save idea</Button></SheetFooter>
        </SheetContent>
      </Sheet>
    </PageLoad>
  );
}
