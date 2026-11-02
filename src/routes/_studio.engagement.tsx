import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle, MessageSquareReply, Heart, HelpCircle, Pin, EyeOff, Eye, Send, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { pageHead } from "@/lib/seo";
import { PageLoad } from "@/components/app/PageLoad";
import { Chips, EmptyState, KpiCard, PageHeader, Panel, SearchBox, StatusBadge, UnavailableNote } from "@/components/app/kit";
import { DonutChart } from "@/components/app/charts";
import { useChannel } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { channelById, videos } from "@/data/mock";
import { comments as seed, savedReplies, type Comment, type Sentiment } from "@/data/engagement";
import { useLocalState } from "@/lib/local-store";

export const Route = createFileRoute("/_studio/engagement")({
  head: pageHead("Audience Engagement", "Review audience comments, filter by sentiment and draft responses (demo)."),
  component: Engagement,
});

const SENT_STATUS: Record<Sentiment, string> = { positive: "success", neutral: "draft", negative: "error", question: "info" };

function Engagement() {
  const { channel } = useChannel();
  const [list, setList] = useLocalState<Comment[]>("engagement", seed);
  const [view, setView] = useState<"open" | "replied" | "hidden">("open");
  const [sent, setSent] = useState<"all" | Sentiment>("all");
  const [video, setVideo] = useState("all");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"likes" | "recent">("likes");
  const [sel, setSel] = useState<string | null>(null);
  const [reply, setReply] = useState("");

  const scoped = list.filter((c) => channel === "all" || c.channelId === channel);
  const rows = scoped
    .filter((c) => c.status === view && (sent === "all" || c.sentiment === sent) && (video === "all" || c.videoId === video) && `${c.author} ${c.text}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (sort === "likes" ? b.likes - a.likes : list.indexOf(a) - list.indexOf(b)))
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));
  const cur = rows.find((c) => c.id === sel) ?? rows[0];
  const vidOptions = videos.filter((v) => scoped.some((c) => c.videoId === v.id));
  const count = (s: Sentiment) => scoped.filter((c) => c.sentiment === s).length;
  const upd = (id: string, patch: Partial<Comment>) => setList(list.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const send = () => {
    if (!cur || reply.trim().length < 2) return;
    upd(cur.id, { status: "replied", replies: [...cur.replies, { by: channelById(cur.channelId).name, text: reply.trim() }] });
    setReply("");
    toast.success("Reply saved locally", { description: "Not posted to YouTube (Phase 01)." });
  };

  return (
    <PageLoad>
      <PageHeader title="Audience Engagement" description="Comments are fictional samples. Replies are stored in this browser only and never posted." />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Total comments" value={`${scoped.length}`} icon={MessageCircle} />
        <KpiCard label="Awaiting response" value={`${scoped.filter((c) => c.status === "open").length}`} icon={MessageSquareReply} tone="warning" />
        <KpiCard label="Open questions" value={`${scoped.filter((c) => c.sentiment === "question" && c.status === "open").length}`} icon={HelpCircle} tone="info" />
        <KpiCard label="Positive share" value={`${Math.round((count("positive") / Math.max(1, scoped.length)) * 100)}%`} icon={Heart} tone="success" />
      </div>

      <div className="mt-4 flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-center">
        <Chips value={view} onChange={(v) => { setView(v); setSel(null); }} options={[{ value: "open", label: `Needs reply ${scoped.filter((c) => c.status === "open").length}` }, { value: "replied", label: `Responded ${scoped.filter((c) => c.status === "replied").length}` }, { value: "hidden", label: `Hidden ${scoped.filter((c) => c.status === "hidden").length}` }]} />
        <Chips value={sent} onChange={setSent} options={[{ value: "all", label: "All sentiment" }, { value: "positive", label: "Positive" }, { value: "question", label: "Questions" }, { value: "neutral", label: "Neutral" }, { value: "negative", label: "Negative" }]} />
        <Select value={video} onValueChange={setVideo}><SelectTrigger className="h-9 w-full bg-surface lg:w-56" aria-label="Video filter"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All videos</SelectItem>{vidOptions.map((v) => <SelectItem key={v.id} value={v.id}>{v.title}</SelectItem>)}</SelectContent></Select>
        <Button size="sm" variant="outline" onClick={() => setSort(sort === "likes" ? "recent" : "likes")}><ArrowUpDown /> {sort === "likes" ? "Most liked" : "Most recent"}</Button>
        <SearchBox value={q} onChange={setQ} placeholder="Search comments…" className="lg:ml-auto lg:w-60" />
      </div>

      <div className="mt-4 grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="min-w-0 space-y-2">
          {rows.length === 0 ? <EmptyState title="No comments match" body="Try another view, sentiment or video filter." /> : rows.map((c) => (
            <button key={c.id} onClick={() => setSel(c.id)} className={`w-full rounded-xl border bg-card p-4 text-left ${cur?.id === c.id ? "border-primary" : ""}`}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="grid size-7 place-items-center rounded-full bg-elevated text-xs font-bold">{c.author[0]}</span>
                <span className="text-sm font-semibold">{c.author}</span>
                <span className="text-xs text-subtle">{c.time}</span>
                {c.pinned && <Pin className="size-3.5 text-primary" />}
                <span className="ml-auto"><StatusBadge status={SENT_STATUS[c.sentiment]} label={c.sentiment} /></span>
              </div>
              <p className="mt-2 text-sm">{c.text}</p>
              <p className="mt-1 truncate text-xs text-muted-foreground">♥ {c.likes} · {videos.find((v) => v.id === c.videoId)?.title} · {c.replies.length} repl{c.replies.length === 1 ? "y" : "ies"}</p>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {cur && (
            <Panel title="Response" action={<div className="flex gap-1">
              <Button size="icon" variant="ghost" aria-label={cur.pinned ? "Unpin" : "Pin"} onClick={() => upd(cur.id, { pinned: !cur.pinned })}><Pin className={cur.pinned ? "text-primary" : ""} /></Button>
              <Button size="icon" variant="ghost" aria-label={cur.status === "hidden" ? "Unhide" : "Hide"} onClick={() => { upd(cur.id, { status: cur.status === "hidden" ? "open" : "hidden" }); toast(cur.status === "hidden" ? "Comment restored" : "Comment hidden locally"); }}>{cur.status === "hidden" ? <Eye /> : <EyeOff />}</Button>
            </div>}>
              <p className="text-xs text-muted-foreground">{cur.author} on “{videos.find((v) => v.id === cur.videoId)?.title}”</p>
              <p className="mt-1 text-sm">{cur.text}</p>
              <ul className="mt-3 space-y-2">{cur.replies.map((r, i) => <li key={i} className="ml-4 rounded-lg border-l-2 border-primary bg-elevated px-3 py-2 text-sm"><span className="font-semibold">{r.by}: </span>{r.text}</li>)}</ul>
              {cur.status !== "hidden" && <>
                <p className="mb-1.5 mt-4 text-xs font-medium text-muted-foreground">Saved replies</p>
                <div className="flex flex-wrap gap-1.5">{savedReplies.map((s) => <button key={s} onClick={() => setReply(s)} className="rounded-full bg-elevated px-2.5 py-1 text-left text-xs">{s}</button>)}</div>
                <Textarea rows={3} className="mt-3" value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a response…" maxLength={500} />
                <div className="mt-2 flex items-center justify-between"><span className="text-xs text-subtle">{reply.length}/500</span><Button size="sm" onClick={send} disabled={reply.trim().length < 2}><Send /> Save reply</Button></div>
              </>}
              <div className="mt-3"><UnavailableNote>Posting replies to YouTube needs channel authorization (Phase 02).</UnavailableNote></div>
            </Panel>
          )}
          <Panel title="Sentiment mix (demo)">
            <DonutChart data={[{ name: "Positive", value: count("positive"), color: "var(--success)" }, { name: "Questions", value: count("question"), color: "var(--info)" }, { name: "Neutral", value: count("neutral"), color: "var(--subtle)" }, { name: "Negative", value: count("negative"), color: "var(--destructive)" }]} />
          </Panel>
        </div>
      </div>
    </PageLoad>
  );
}
