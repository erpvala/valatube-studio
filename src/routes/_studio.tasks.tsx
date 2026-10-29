import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpDown, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";
import { pageHead } from "@/lib/seo";
import { PageLoad } from "@/components/app/PageLoad";
import { Chips, ConfirmAction, EmptyState, PageHeader, Panel, SearchBox, StatusBadge } from "@/components/app/kit";
import { useChannel } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { channelById, tasks as seed, type Task, type TaskStatus } from "@/data/mock";
import { useLocalState } from "@/lib/local-store";

export const Route = createFileRoute("/_studio/tasks")({
  head: pageHead("Task Manager", "Queue of pending, running, completed and failed tasks."),
  component: Tasks,
});

const PER = 6;

function Tasks() {
  const { channel } = useChannel();
  const [list, setList] = useLocalState<Task[]>("tasks", seed);
  const [f, setF] = useState<"all" | TaskStatus>("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<{ k: "created" | "name" | "progress"; dir: 1 | -1 }>({ k: "created", dir: -1 });
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<Task | null>(null);

  const rows = list
    .filter((t) => (channel === "all" || t.channelId === channel) && (f === "all" || t.status === f) && `${t.name} ${t.id} ${t.kind}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (a[sort.k] > b[sort.k] ? 1 : -1) * sort.dir);
  const pages = Math.max(1, Math.ceil(rows.length / PER));
  const view = rows.slice((page - 1) * PER, page * PER);
  const n = (s: TaskStatus) => list.filter((t) => t.status === s).length;
  const setStatus = (id: string, status: TaskStatus, log: string) => setList(list.map((t) => (t.id === id ? { ...t, status, progress: status === "pending" ? 0 : t.progress, logs: [...t.logs, log] } : t)));
  const S = ({ k, label }: { k: typeof sort.k; label: string }) => <button className="inline-flex items-center gap-1" onClick={() => setSort({ k, dir: sort.k === k ? (-sort.dir as 1 | -1) : 1 })}>{label}<ArrowUpDown className="size-3" /></button>;

  return (
    <PageLoad>
      <PageHeader title="Task Manager" description="Tasks are simulated; retry and cancel only update local state." />
      <div className="mb-3 flex flex-col gap-2 lg:flex-row lg:items-center">
        <Chips value={f} onChange={(v) => { setF(v); setPage(1); }} options={[{ value: "all", label: "All" }, { value: "pending", label: `Pending ${n("pending")}` }, { value: "running", label: `Running ${n("running")}` }, { value: "completed", label: `Completed ${n("completed")}` }, { value: "failed", label: `Failed ${n("failed")}` }]} />
        <SearchBox value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search tasks…" className="lg:ml-auto lg:w-64" />
      </div>
      <Panel bodyClass="p-0">
        {view.length === 0 ? <div className="p-4"><EmptyState title="No tasks found" body="Change the filter or search." /></div> : (
          <Table>
            <TableHeader><TableRow><TableHead className="hidden sm:table-cell">ID</TableHead><TableHead><S k="name" label="Task" /></TableHead><TableHead className="hidden md:table-cell">Type</TableHead><TableHead className="hidden lg:table-cell"><S k="created" label="Created" /></TableHead><TableHead><S k="progress" label="Progress" /></TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>{view.map((t) => (
              <TableRow key={t.id} className="cursor-pointer" onClick={() => setOpen(t)}>
                <TableCell className="hidden font-mono text-xs sm:table-cell">{t.id}</TableCell>
                <TableCell><p className="font-medium">{t.name}</p><p className="text-xs text-muted-foreground">{channelById(t.channelId).name}</p></TableCell>
                <TableCell className="hidden md:table-cell">{t.kind}</TableCell>
                <TableCell className="hidden text-xs lg:table-cell">{t.created}</TableCell>
                <TableCell className="w-28"><Progress value={t.progress} className="h-1.5" /></TableCell>
                <TableCell><StatusBadge status={t.status} /></TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  {t.status === "failed" && <Button size="sm" variant="outline" onClick={() => { setStatus(t.id, "pending", "Retry requested (simulated)"); toast("Task re-queued (simulation)"); }}><RotateCcw /> Retry</Button>}
                  {(t.status === "running" || t.status === "pending") && <ConfirmAction destructive title="Cancel task?" description={`${t.id} will be marked as failed (cancelled).`} confirmLabel="Cancel task" onConfirm={() => { setStatus(t.id, "failed", "Cancelled by user"); toast("Task cancelled"); }} trigger={<Button size="sm" variant="ghost"><X /> Cancel</Button>} />}
                </TableCell>
              </TableRow>
            ))}</TableBody>
          </Table>
        )}
      </Panel>
      {pages > 1 && <Pagination className="mt-3"><PaginationContent>{Array.from({ length: pages }).map((_, i) => <PaginationItem key={i}><PaginationLink href="#" isActive={page === i + 1} onClick={(e) => { e.preventDefault(); setPage(i + 1); }}>{i + 1}</PaginationLink></PaginationItem>)}</PaginationContent></Pagination>}
      <Sheet open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader><SheetTitle>{open?.id} · {open?.name}</SheetTitle></SheetHeader>
          {open && <div className="space-y-3 px-4 text-sm">
            <div className="grid grid-cols-2 gap-2"><div className="rounded-lg bg-elevated p-2"><p className="text-xs text-muted-foreground">Status</p><StatusBadge status={open.status} /></div><div className="rounded-lg bg-elevated p-2"><p className="text-xs text-muted-foreground">ETA</p>{open.eta}</div></div>
            <p className="text-xs font-medium text-muted-foreground">Logs</p>
            <ul className="space-y-1 font-mono text-xs">{(list.find((t) => t.id === open.id)?.logs ?? []).map((l, i) => <li key={i} className={`rounded bg-elevated px-2 py-1 ${l.startsWith("Error") ? "text-destructive" : ""}`}>{l}</li>)}</ul>
          </div>}
        </SheetContent>
      </Sheet>
    </PageLoad>
  );
}
