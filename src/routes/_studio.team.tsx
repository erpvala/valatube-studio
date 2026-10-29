import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { UserPlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { pageHead } from "@/lib/seo";
import { PageLoad } from "@/components/app/PageLoad";
import { ConfirmAction, Field, PageHeader, Panel, StatusBadge } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { team as seed } from "@/data/mock";
import { useLocalState } from "@/lib/local-store";

export const Route = createFileRoute("/_studio/team")({
  head: pageHead("Team Management", "Members, roles and permissions."),
  component: Team,
});

const ROLES = ["Owner", "Admin", "Editor", "Producer", "Writer", "SEO Specialist", "Viewer"];
const MATRIX: [string, string[]][] = [
  ["Manage billing & workspace", ["Owner"]],
  ["Connect channels & integrations", ["Owner", "Admin"]],
  ["Approve & publish", ["Owner", "Admin", "Editor"]],
  ["Create & edit content", ["Owner", "Admin", "Editor", "Producer", "Writer"]],
  ["Edit SEO metadata", ["Owner", "Admin", "Editor", "SEO Specialist"]],
  ["View analytics", ROLES],
];

function Team() {
  const [list, setList] = useLocalState("team", seed);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "Editor" });
  const [err, setErr] = useState("");
  const invite = () => {
    if (!form.name.trim()) return setErr("Name is required.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setErr("Enter a valid email.");
    if (list.some((m) => m.email === form.email)) return setErr("This email is already on the team.");
    setList([...list, { id: `u${Date.now()}`, ...form, status: "invited" }]);
    toast.success("Member added locally", { description: "No invitation email was sent (Phase 01)." });
    setOpen(false);
  };
  return (
    <PageLoad>
      <PageHeader title="Team Management" description="Local team list — invitations are not emailed." actions={<Button size="sm" onClick={() => { setForm({ name: "", email: "", role: "Editor" }); setErr(""); setOpen(true); }}><UserPlus /> Invite member</Button>} />
      <Panel bodyClass="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>Member</TableHead><TableHead>Role</TableHead><TableHead className="hidden sm:table-cell">Status</TableHead><TableHead /></TableRow></TableHeader>
          <TableBody>{list.map((m) => (
            <TableRow key={m.id}>
              <TableCell><p className="font-medium">{m.name}</p><p className="text-xs text-muted-foreground">{m.email}</p></TableCell>
              <TableCell>{m.role === "Owner" ? "Owner" : <Select value={m.role} onValueChange={(v) => { setList(list.map((x) => (x.id === m.id ? { ...x, role: v } : x))); toast(`Role changed to ${v}`); }}><SelectTrigger className="h-8 w-36"><SelectValue /></SelectTrigger><SelectContent>{ROLES.filter((r) => r !== "Owner").map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select>}</TableCell>
              <TableCell className="hidden sm:table-cell"><StatusBadge status={m.status} /></TableCell>
              <TableCell>{m.role !== "Owner" && <ConfirmAction destructive title="Remove member?" description={`${m.name} will lose access.`} confirmLabel="Remove" onConfirm={() => setList(list.filter((x) => x.id !== m.id))} trigger={<Button size="icon" variant="ghost" aria-label="Remove"><Trash2 /></Button>} />}</TableCell>
            </TableRow>
          ))}</TableBody>
        </Table>
      </Panel>
      <Panel title="Roles & permissions" className="mt-4" bodyClass="overflow-x-auto p-0">
        <Table>
          <TableHeader><TableRow><TableHead>Permission</TableHead>{ROLES.map((r) => <TableHead key={r} className="text-center text-xs">{r}</TableHead>)}</TableRow></TableHeader>
          <TableBody>{MATRIX.map(([p, rs]) => <TableRow key={p}><TableCell className="text-sm">{p}</TableCell>{ROLES.map((r) => <TableCell key={r} className="text-center">{rs.includes(r) ? <span className="text-success">●</span> : <span className="text-disabled">○</span>}</TableCell>)}</TableRow>)}</TableBody>
        </Table>
      </Panel>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Invite member</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Field label="Name"><Input value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); setErr(""); }} /></Field>
            <Field label="Email"><Input type="email" value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); setErr(""); }} /></Field>
            <Field label="Role"><Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{ROLES.filter((r) => r !== "Owner").map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select></Field>
            {err && <p className="text-sm text-destructive">{err}</p>}
          </div>
          <DialogFooter><Button onClick={invite}>Add member</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLoad>
  );
}
