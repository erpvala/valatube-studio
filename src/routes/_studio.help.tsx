import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, MessageSquare, Keyboard } from "lucide-react";
import { toast } from "sonner";
import { pageHead } from "@/lib/seo";
import { PageLoad } from "@/components/app/PageLoad";
import { EmptyState, Field, PageHeader, Panel, SearchBox } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/_studio/help")({
  head: pageHead("Help & Support", "FAQs, guides and support contact for ValaTube Studio."),
  component: Help,
});

const FAQ = [
  { q: "Is my YouTube channel connected?", a: "No. Phase 01 is a frontend-only demo with fictional channels. Real connections are planned for Phase 02." },
  { q: "Where are my edits saved?", a: "In your browser's local storage. Use Settings → Privacy → Reset demo data to restore samples." },
  { q: "Does ValaTube generate videos or voices?", a: "Not yet. AI Voice, Image and Video Studios show the planned workflows without calling any provider." },
  { q: "How do I switch channels?", a: "Use the channel selector in the top bar (or above the page on mobile). Dashboards, tasks, publishing and analytics filter by it." },
  { q: "Is ValaTube Studio affiliated with YouTube?", a: "No. ValaTube Studio is an independent product by Software Vala™ and is not endorsed by YouTube or Google." },
];

function Help() {
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState({ subject: "", body: "" });
  const [err, setErr] = useState("");
  const rows = FAQ.filter((f) => `${f.q} ${f.a}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <PageLoad>
      <PageHeader title="Help & Support" demo={false} />
      <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <Panel title="Frequently asked questions" action={<SearchBox value={q} onChange={setQ} placeholder="Search help…" className="w-48" />}>
          {rows.length ? <Accordion type="single" collapsible>{rows.map((f) => <AccordionItem key={f.q} value={f.q}><AccordionTrigger>{f.q}</AccordionTrigger><AccordionContent className="text-muted-foreground">{f.a}</AccordionContent></AccordionItem>)}</Accordion> : <EmptyState title="No answers found" body="Try different words or contact support." />}
        </Panel>
        <div className="space-y-4">
          <Panel title={<span className="flex items-center gap-2"><MessageSquare className="size-4" /> Contact support</span>}>
            <div className="space-y-3">
              <Field label="Subject"><Input value={msg.subject} onChange={(e) => { setMsg({ ...msg, subject: e.target.value }); setErr(""); }} /></Field>
              <Field label="Message"><Textarea rows={4} value={msg.body} onChange={(e) => { setMsg({ ...msg, body: e.target.value }); setErr(""); }} /></Field>
              {err && <p className="text-xs text-destructive">{err}</p>}
              <Button className="w-full" onClick={() => { if (!msg.subject.trim() || msg.body.trim().length < 10) return setErr("Add a subject and at least 10 characters."); toast.info("Support messaging isn't live in Phase 01", { description: "Your message was not sent." }); }}>Send</Button>
            </div>
          </Panel>
          <Panel title={<span className="flex items-center gap-2"><Keyboard className="size-4" /> Shortcuts</span>}><p className="text-sm"><kbd className="rounded border px-1.5 text-xs">Ctrl / ⌘ K</kbd> Global search</p></Panel>
          <Panel title={<span className="flex items-center gap-2"><BookOpen className="size-4" /> Guides</span>}>
            <ul className="space-y-1 text-sm">{[["/ideas", "From idea to script"], ["/storyboard", "Building a storyboard"], ["/publishing", "Scheduling content"], ["/workflows", "Designing automations"]].map(([to, l]) => <li key={to}><Link to={to} className="text-primary">{l}</Link></li>)}</ul>
          </Panel>
        </div>
      </div>
    </PageLoad>
  );
}
