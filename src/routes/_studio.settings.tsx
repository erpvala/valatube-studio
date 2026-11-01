import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Moon, Sun, RotateCcw, Check } from "lucide-react";
import { toast } from "sonner";
import { pageHead } from "@/lib/seo";
import { PageLoad } from "@/components/app/PageLoad";
import { ConfirmAction, Field, PageHeader, Panel } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/lib/theme";
import { resetDemoData, useLocalState } from "@/lib/local-store";
import { channels } from "@/data/mock";

export const Route = createFileRoute("/_studio/settings")({
  head: pageHead("Settings", "Profile, workspace, theme, language, notifications and plan."),
  component: Settings,
});

const PLANS = [
  { n: "Creator", p: "$19", f: ["1 channel", "Core studios", "Basic analytics"] },
  { n: "Studio", p: "$49", f: ["5 channels", "Automation workflows", "Approval center"], current: true },
  { n: "Agency", p: "$149", f: ["Unlimited channels", "Team roles", "API access"] },
];

function Settings() {
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useLocalState("profile", { name: "Demo Admin", email: "demo@valatube.local" });
  const [ws, setWs] = useLocalState("workspace", { name: "Software Vala Demo", timezone: "Asia/Kolkata", lang: "en" });
  const [notif, setNotif] = useLocalState("notif-prefs", { failed: true, approvals: true, weekly: false, published: true });
  const [defCh, setDefCh] = useLocalState("default-channel", "all");
  const [err, setErr] = useState("");

  return (
    <PageLoad>
      <PageHeader title="Settings" description="Preferences are stored in this browser only." />
      <Tabs defaultValue="profile">
        <TabsList className="flex h-auto flex-wrap justify-start">
          {["profile", "workspace", "appearance", "notifications", "channels", "plan", "privacy"].map((t) => <TabsTrigger key={t} value={t} className="capitalize">{t}</TabsTrigger>)}
        </TabsList>
        <TabsContent value="profile"><Panel title="Profile"><div className="grid max-w-xl gap-3">
          <Field label="Display name"><Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></Field>
          <Field label="Email" error={err}><Input value={profile.email} onChange={(e) => { setProfile({ ...profile, email: e.target.value }); setErr(/^\S+@\S+\.\S+$/.test(e.target.value) ? "" : "Enter a valid email"); }} /></Field>
          <Button className="w-fit" disabled={!!err} onClick={() => toast.success("Profile saved locally")}>Save profile</Button>
        </div></Panel></TabsContent>
        <TabsContent value="workspace"><Panel title="Workspace"><div className="grid max-w-xl gap-3">
          <Field label="Workspace name"><Input value={ws.name} onChange={(e) => setWs({ ...ws, name: e.target.value })} /></Field>
          <Field label="Time zone"><Select value={ws.timezone} onValueChange={(v) => setWs({ ...ws, timezone: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Asia/Kolkata", "UTC", "America/New_York", "Europe/London"].map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}</SelectContent></Select></Field>
          <Field label="Language" hint="Only English UI copy is available in Phase 01."><Select value={ws.lang} onValueChange={(v) => { setWs({ ...ws, lang: v }); if (v !== "en") toast.info("Translations are planned for a later phase"); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="hi">हिन्दी (planned)</SelectItem><SelectItem value="es">Español (planned)</SelectItem></SelectContent></Select></Field>
          <Link to="/team" className="text-sm text-primary">Manage team members & roles →</Link>
        </div></Panel></TabsContent>
        <TabsContent value="appearance"><Panel title="Theme"><div className="grid max-w-md grid-cols-2 gap-3">
          {(["dark", "light"] as const).map((t) => <button key={t} onClick={() => setTheme(t)} className={`relative rounded-xl border-2 p-4 text-left ${theme === t ? "border-primary" : ""}`}>{t === "dark" ? <Moon /> : <Sun />}<p className="mt-2 font-semibold capitalize">{t}</p>{theme === t && <Check className="absolute right-3 top-3 size-4 text-primary" />}</button>)}
        </div></Panel></TabsContent>
        <TabsContent value="notifications"><Panel title="Notification settings"><div className="max-w-xl space-y-2">
          {([["failed", "Failed tasks & uploads"], ["approvals", "New approval requests"], ["published", "Content published"], ["weekly", "Weekly performance summary"]] as const).map(([k, l]) => <label key={k} className="flex items-center justify-between rounded-lg bg-elevated p-3 text-sm">{l}<Switch checked={notif[k]} onCheckedChange={(v) => setNotif({ ...notif, [k]: v })} /></label>)}
          <p className="text-xs text-subtle">In-app only. Email/push delivery is not available in Phase 01.</p>
        </div></Panel></TabsContent>
        <TabsContent value="channels"><Panel title="Channel preferences"><div className="max-w-xl space-y-3">
          <Field label="Default channel on login"><Select value={defCh} onValueChange={setDefCh}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All channels</SelectItem>{channels.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></Field>
          <label className="flex items-center justify-between rounded-lg bg-elevated p-3 text-sm">Require approval before scheduling <Switch defaultChecked /></label>
        </div></Panel></TabsContent>
        <TabsContent value="plan"><div className="grid gap-3 md:grid-cols-3">{PLANS.map((p) => <div key={p.n} className={`rounded-xl border bg-card p-5 ${p.current ? "border-primary" : ""}`}><p className="font-semibold">{p.n}</p><p className="mt-1 font-display text-3xl font-bold">{p.p}<span className="text-sm font-normal text-muted-foreground">/mo</span></p><ul className="mt-3 space-y-1 text-sm text-muted-foreground">{p.f.map((x) => <li key={x}>• {x}</li>)}</ul><Button className="mt-4 w-full" variant={p.current ? "soft" : "outline"} disabled>{p.current ? "Current (demo)" : "Billing unavailable"}</Button></div>)}</div><p className="mt-2 text-xs text-subtle">Illustrative pricing presentation. Billing is not implemented.</p></TabsContent>
        <TabsContent value="privacy"><Panel title="Privacy & demo data">
          <p className="text-sm text-muted-foreground">Phase 01 stores edits only in your browser's local storage. No data is sent to a server, YouTube or any AI provider. Demo credentials are not production authentication.</p>
          <ConfirmAction destructive title="Reset all demo data?" description="Every local edit (ideas, scripts, schedules, tasks, settings) will be restored to the original samples." confirmLabel="Reset" onConfirm={() => { resetDemoData(); toast.success("Demo data reset"); }} trigger={<Button variant="outline" className="mt-3"><RotateCcw /> Reset demo data</Button>} />
          <div className="mt-4 flex gap-4 text-sm"><Link to="/help" className="text-primary">Help & Support</Link><Link to="/about" className="text-primary">About ValaTube Studio</Link></div>
        </Panel></TabsContent>
      </Tabs>
    </PageLoad>
  );
}
