import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, X, Send } from "lucide-react";
import { toast } from "sonner";
import { pageHead } from "@/lib/seo";
import { PageLoad } from "@/components/app/PageLoad";
import { Chips, ConfirmAction, EmptyState, PageHeader, Panel, StatusBadge, Thumb } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { approvals as seed, channelById, type Approval } from "@/data/mock";
import { useLocalState } from "@/lib/local-store";

export const Route = createFileRoute("/_studio/approvals")({
  head: pageHead("Approval Center", "Review, comment on, approve or reject content."),
  component: Approvals,
});

function Approvals() {
  const [list, setList] = useLocalState<Approval[]>("approvals", seed);
  const [f, setF] = useState<Approval["status"]>("pending");
  const rows = list.filter((a) => a.status === f);
  const [sel, setSel] = useState<string | null>(rows[0]?.id ?? null);
  const [comment, setComment] = useState("");
  const cur = list.find((a) => a.id === sel && a.status === f) ?? rows[0];
  const n = (s: Approval["status"]) => list.filter((a) => a.status === s).length;
  const decide = (status: Approval["status"]) => { if (!cur) return; setList(list.map((a) => (a.id === cur.id ? { ...a, status } : a))); toast.success(`Marked as ${status}`); setSel(null); };

  return (
    <PageLoad>
      <PageHeader title="Approval Center" description="Decisions update local demo data only." />
      <Chips value={f} onChange={(v) => { setF(v); setSel(null); }} options={[{ value: "pending", label: `Awaiting review ${n("pending")}` }, { value: "approved", label: `Approved ${n("approved")}` }, { value: "rejected", label: `Rejected ${n("rejected")}` }]} />
      <div className="mt-4 grid gap-4 lg:grid-cols-[340px_1fr]">
        <div className="space-y-2">
          {rows.length === 0 ? <EmptyState title="Queue is clear" body="No items in this status." /> : rows.map((a) => (
            <button key={a.id} onClick={() => setSel(a.id)} className={`flex w-full gap-3 rounded-xl border bg-card p-2 text-left ${cur?.id === a.id ? "border-primary" : ""}`}>
              <Thumb index={a.thumb} className="w-24 shrink-0" />
              <div className="min-w-0"><p className="truncate text-sm font-medium">{a.title}</p><p className="text-xs text-muted-foreground">{a.kind} · {a.submittedBy}</p><p className="text-xs text-subtle">{a.date}</p></div>
            </button>
          ))}
        </div>
        {cur && (
          <Panel title="Review details" action={<StatusBadge status={cur.status} />}>
            <Thumb index={cur.thumb} />
            <h2 className="mt-3 font-semibold">{cur.title}</h2>
            <p className="text-sm text-muted-foreground">{channelById(cur.channelId).name} · {cur.kind} · submitted by {cur.submittedBy}</p>
            <p className="mb-2 mt-4 text-xs font-medium text-muted-foreground">Comments</p>
            <ul className="space-y-2">{cur.comments.length ? cur.comments.map((c, i) => <li key={i} className="rounded-lg bg-elevated px-3 py-2 text-sm"><span className="font-semibold">{c.by}: </span>{c.text}</li>) : <li className="text-sm text-subtle">No comments yet.</li>}</ul>
            <div className="mt-3 flex gap-2"><Textarea rows={2} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment…" /><Button size="icon" aria-label="Post comment" disabled={!comment.trim()} onClick={() => { setList(list.map((a) => (a.id === cur.id ? { ...a, comments: [...a.comments, { by: "You", text: comment.trim() }] } : a))); setComment(""); }}><Send /></Button></div>
            {cur.status === "pending" && <div className="mt-4 flex gap-2">
              <ConfirmAction title="Approve this item?" description="It will move to Approved." confirmLabel="Approve" onConfirm={() => decide("approved")} trigger={<Button><Check /> Approve</Button>} />
              <ConfirmAction destructive title="Reject this item?" description="It will move to Rejected. Add a comment explaining why." confirmLabel="Reject" onConfirm={() => decide("rejected")} trigger={<Button variant="outline"><X /> Reject</Button>} />
            </div>}
            {cur.status !== "pending" && <Button variant="outline" className="mt-4" onClick={() => decide("pending")}>Move back to review</Button>}
          </Panel>
        )}
      </div>
    </PageLoad>
  );
}
