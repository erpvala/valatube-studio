import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCheck, Trash2, AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { toast } from "sonner";
import { pageHead } from "@/lib/seo";
import { PageLoad } from "@/components/app/PageLoad";
import { Chips, ConfirmAction, EmptyState, PageHeader } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { notifications as seed } from "@/data/mock";
import { useLocalState } from "@/lib/local-store";

export const Route = createFileRoute("/_studio/notifications")({
  head: pageHead("Notifications", "Alerts for tasks, approvals and publishing."),
  component: Notifications,
});

const ICON = { error: AlertCircle, warning: AlertTriangle, success: CheckCircle2, info: Info };
const TONE = { error: "text-destructive", warning: "text-warning", success: "text-success", info: "text-info" };

function Notifications() {
  const [list, setList] = useLocalState("notifications", seed);
  const [f, setF] = useState<"all" | "unread">("all");
  const rows = list.filter((n) => f === "all" || !n.read);
  return (
    <PageLoad>
      <PageHeader title="Notifications" description="Demo alerts generated from sample data."
        actions={<><Button size="sm" variant="outline" onClick={() => { setList(list.map((n) => ({ ...n, read: true }))); toast("All marked as read"); }}><CheckCheck /> Mark all read</Button>
          <ConfirmAction destructive title="Clear all notifications?" description="This removes all demo notifications locally." confirmLabel="Clear" onConfirm={() => setList([])} trigger={<Button size="sm" variant="outline"><Trash2 /> Clear</Button>} /></>} />
      <Chips value={f} onChange={setF} options={[{ value: "all", label: "All" }, { value: "unread", label: `Unread ${list.filter((n) => !n.read).length}` }]} />
      <div className="mt-4 space-y-2">
        {rows.length === 0 ? <EmptyState title="You're all caught up" body="No notifications to show." /> : rows.map((n) => {
          const I = ICON[n.level];
          return (
            <button key={n.id} onClick={() => setList(list.map((x) => (x.id === n.id ? { ...x, read: !x.read } : x)))} className={`flex w-full gap-3 rounded-xl border bg-card p-4 text-left ${!n.read ? "border-l-4 border-l-primary" : ""}`}>
              <I className={`mt-0.5 size-5 shrink-0 ${TONE[n.level]}`} />
              <div className="flex-1"><p className={`text-sm ${!n.read ? "font-semibold" : ""}`}>{n.title}</p><p className="text-xs text-muted-foreground">{n.body}</p></div>
              <span className="text-xs text-subtle">{n.time}</span>
            </button>
          );
        })}
      </div>
    </PageLoad>
  );
}
