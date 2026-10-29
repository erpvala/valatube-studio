import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Settings, Link2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { pageHead } from "@/lib/seo";
import { PageLoad } from "@/components/app/PageLoad";
import { Field, KpiCard, PageHeader, Panel, StatusBadge, Thumb, UnavailableNote } from "@/components/app/kit";
import { BarsChart, TrendChart } from "@/components/app/charts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { channels, dailySeries, fmt, money, videos, type Channel } from "@/data/mock";
import { useLocalState } from "@/lib/local-store";

export const Route = createFileRoute("/_studio/channels")({
  head: pageHead("Channel Manager", "Manage, compare and configure your channels."),
  component: Channels,
});

function Channels() {
  const [list, setList] = useLocalState<Channel[]>("channels", channels);
  const [sel, setSel] = useState<string | null>(null);
  const [onboard, setOnboard] = useState(false);
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState({ name: "", handle: "", niche: "" });
  const [err, setErr] = useState("");
  const ch = list.find((c) => c.id === sel);

  if (ch) return <PageLoad><ChannelDetail ch={ch} onBack={() => setSel(null)} onSave={(c) => { setList(list.map((x) => (x.id === c.id ? c : x))); toast.success("Channel settings saved locally"); }} /></PageLoad>;

  return (
    <PageLoad>
      <PageHeader title="Channel Manager" description="Fictional channels. Real YouTube connections arrive in Phase 02."
        actions={<Button size="sm" onClick={() => { setOnboard(true); setStep(1); setDraft({ name: "", handle: "", niche: "" }); }}><Plus /> Add channel</Button>} />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {list.map((c) => (
          <button key={c.id} onClick={() => setSel(c.id)} className="overflow-hidden rounded-xl border bg-card text-left shadow-card transition hover:border-primary">
            <Thumb index={c.thumb} className="rounded-none" />
            <div className="p-4">
              <div className="flex items-center justify-between gap-2"><p className="font-semibold">{c.name}</p><StatusBadge status={c.status} /></div>
              <p className="text-xs text-muted-foreground">{c.handle} · {c.niche}</p>
              <div className="mt-3 grid grid-cols-3 text-center text-xs">
                <div><p className="font-bold">{fmt(c.subscribers)}</p><p className="text-subtle">Subs</p></div>
                <div><p className="font-bold">{fmt(c.views)}</p><p className="text-subtle">Views</p></div>
                <div><p className="font-bold">{c.videos}</p><p className="text-subtle">Videos</p></div>
              </div>
            </div>
          </button>
        ))}
      </div>
      <Panel title="Multi-channel comparison" className="mt-4">
        <BarsChart data={list.map((c) => ({ name: c.name, subscribers: c.subscribers, views: c.views / 10 }))} series={[{ key: "subscribers", name: "Subscribers", color: "var(--chart-1)" }, { key: "views", name: "Views ÷10", color: "var(--chart-2)" }]} />
      </Panel>

      <Dialog open={onboard} onOpenChange={setOnboard}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add channel · Step {step} of 3</DialogTitle></DialogHeader>
          {step === 1 && <div className="space-y-3">
            <Field label="Channel name" error={err}><Input value={draft.name} onChange={(e) => { setDraft({ ...draft, name: e.target.value }); setErr(""); }} /></Field>
            <Field label="Handle"><Input value={draft.handle} placeholder="@yourchannel" onChange={(e) => setDraft({ ...draft, handle: e.target.value })} /></Field>
            <Field label="Niche"><Input value={draft.niche} onChange={(e) => setDraft({ ...draft, niche: e.target.value })} /></Field>
          </div>}
          {step === 2 && <div className="space-y-3"><p className="text-sm">Connect your YouTube account</p><UnavailableNote>Google sign-in and YouTube API access are not part of Phase 01. The channel will be added locally as “disconnected”.</UnavailableNote></div>}
          {step === 3 && <p className="text-sm text-muted-foreground">Review: <strong className="text-foreground">{draft.name}</strong> {draft.handle} — {draft.niche || "General"}. It will be stored only in this browser.</p>}
          <DialogFooter>
            {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>}
            {step < 3 ? <Button onClick={() => { if (step === 1 && !draft.name.trim()) return setErr("Channel name is required."); setStep(step + 1); }}>Next</Button>
              : <Button onClick={() => { setList([...list, { id: `ch-${Date.now()}`, name: draft.name, handle: draft.handle || "@new", niche: draft.niche || "General", subscribers: 0, views: 0, videos: 0, revenue: 0, growth: 0, status: "disconnected", color: "var(--chart-5)", thumb: list.length % 4, description: "" }]); setOnboard(false); toast.success("Channel added locally (not connected)"); }}>Add channel</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLoad>
  );
}

function ChannelDetail({ ch, onBack, onSave }: { ch: Channel; onBack: () => void; onSave: (c: Channel) => void }) {
  const [form, setForm] = useState(ch);
  const vids = videos.filter((v) => v.channelId === ch.id);
  return (
    <>
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-2"><ArrowLeft /> All channels</Button>
      <div className="overflow-hidden rounded-xl border bg-card">
        <Thumb index={ch.thumb} className="aspect-[5/1] rounded-none" />
        <div className="flex flex-wrap items-center gap-4 p-4">
          <div className="grid size-16 -mt-10 place-items-center rounded-full border-4 border-card bg-primary font-display text-xl font-bold text-primary-foreground">{ch.name[0]}</div>
          <div className="flex-1"><h1 className="text-xl font-bold">{ch.name}</h1><p className="text-sm text-muted-foreground">{ch.handle} · {ch.description}</p></div>
          <StatusBadge status={ch.status} />
        </div>
      </div>
      <Tabs defaultValue="performance" className="mt-4">
        <TabsList><TabsTrigger value="performance">Performance</TabsTrigger><TabsTrigger value="videos">Recent videos</TabsTrigger><TabsTrigger value="branding">Branding</TabsTrigger><TabsTrigger value="settings"><Settings className="size-3.5" /> Settings</TabsTrigger></TabsList>
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4"><KpiCard label="Subscribers" value={fmt(ch.subscribers)} delta={`+${ch.growth}%`} /><KpiCard label="Views" value={fmt(ch.views)} /><KpiCard label="Videos" value={`${ch.videos}`} /><KpiCard label="Est. revenue (30d)" value={money(ch.revenue)} /></div>
          <Panel title="Daily views (demo)"><TrendChart data={dailySeries} series={[{ key: ch.id, name: "Views", color: "var(--chart-1)" }]} /></Panel>
        </TabsContent>
        <TabsContent value="videos"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{vids.map((v) => <div key={v.id} className="rounded-xl border bg-card p-2"><Thumb index={v.thumb} label={v.duration} /><p className="mt-2 line-clamp-2 text-sm font-medium">{v.title}</p><div className="mt-1 flex justify-between text-xs text-muted-foreground"><span>{v.views ? `${fmt(v.views)} views` : v.date}</span><StatusBadge status={v.status} /></div></div>)}</div></TabsContent>
        <TabsContent value="branding"><Panel title="Branding preview"><div className="flex flex-wrap items-center gap-4"><div className="grid size-20 place-items-center rounded-full bg-primary font-display text-3xl font-bold text-primary-foreground">{form.name[0]}</div><div><p className="font-semibold">{form.name}</p><p className="text-sm text-muted-foreground">{form.handle}</p><p className="mt-1 text-sm">{form.description}</p></div></div></Panel></TabsContent>
        <TabsContent value="settings"><Panel title="Channel settings"><div className="grid gap-3 md:grid-cols-2">
          <Field label="Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Handle"><Input value={form.handle} onChange={(e) => setForm({ ...form, handle: e.target.value })} /></Field>
          <Field label="Description"><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          <div className="space-y-3"><label className="flex items-center justify-between rounded-lg bg-elevated p-3 text-sm">Require approval before publish <Switch defaultChecked /></label><div className="flex items-center gap-2 rounded-lg bg-elevated p-3 text-sm"><Link2 className="size-4" /> Connection: <StatusBadge status={ch.status} /></div></div>
        </div><Button className="mt-4" onClick={() => onSave(form)}>Save changes</Button></Panel></TabsContent>
      </Tabs>
    </>
  );
}
