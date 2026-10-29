/**
 * ValaTube Studio — Phase 01 demonstration dataset.
 * Everything in this file is FICTIONAL sample data. No real YouTube data is retrieved.
 */
import thumb1 from "@/assets/thumb-1.jpg";
import thumb2 from "@/assets/thumb-2.jpg";
import thumb3 from "@/assets/thumb-3.jpg";
import thumb4 from "@/assets/thumb-4.jpg";

export const THUMBS = [thumb1, thumb2, thumb3, thumb4];
export const DEMO_TODAY = new Date("2026-10-30T10:00:00");

export type Channel = {
  id: string;
  name: string;
  handle: string;
  niche: string;
  subscribers: number;
  views: number;
  videos: number;
  revenue: number; // estimated, USD, last 30d
  growth: number; // subs growth %, last 30d
  status: "connected" | "attention" | "disconnected";
  color: string; // chart token name
  thumb: number;
  description: string;
};

export const channels: Channel[] = [
  { id: "ch-tech", name: "Circuit Bay", handle: "@circuitbay", niche: "Tech Reviews", subscribers: 482300, views: 3120000, videos: 312, revenue: 9840, growth: 4.2, status: "connected", color: "var(--chart-1)", thumb: 0, description: "Honest gadget reviews and buying guides." },
  { id: "ch-food", name: "Green Pan Kitchen", handle: "@greenpan", niche: "Cooking", subscribers: 216900, views: 1480000, videos: 188, revenue: 3620, growth: 6.8, status: "connected", color: "var(--chart-3)", thumb: 1, description: "Fast, healthy weeknight recipes." },
  { id: "ch-travel", name: "Ridgeline Diaries", handle: "@ridgeline", niche: "Travel", subscribers: 134500, views: 920000, videos: 97, revenue: 2110, growth: 2.1, status: "attention", color: "var(--chart-4)", thumb: 2, description: "Slow travel and mountain adventures." },
  { id: "ch-money", name: "Coin Compass", handle: "@coincompass", niche: "Personal Finance", subscribers: 98700, views: 610000, videos: 143, revenue: 4380, growth: 9.4, status: "connected", color: "var(--chart-2)", thumb: 3, description: "Plain-language money lessons." },
];

export type VideoStatus = "published" | "scheduled" | "draft" | "processing" | "failed";
export type Video = {
  id: string;
  title: string;
  channelId: string;
  type: "long" | "short";
  status: VideoStatus;
  views: number;
  likes: number;
  ctr: number;
  watchHours: number;
  date: string; // ISO
  duration: string;
  thumb: number;
};

const vt = (
  id: string, title: string, channelId: string, type: "long" | "short", status: VideoStatus,
  views: number, date: string, duration: string, thumb: number,
): Video => ({
  id, title, channelId, type, status, views,
  likes: Math.round(views * 0.041), ctr: +(3 + ((views % 70) / 10)).toFixed(1),
  watchHours: Math.round(views * (type === "long" ? 0.14 : 0.012)), date, duration, thumb,
});

export const videos: Video[] = [
  vt("v1", "I Tested 7 Budget Earbuds So You Don't Have To", "ch-tech", "long", "published", 412000, "2026-10-21", "14:32", 0),
  vt("v2", "This $40 Phone Shocked Me", "ch-tech", "short", "published", 1240000, "2026-10-24", "0:48", 0),
  vt("v3", "Laptop Buying Guide 2027", "ch-tech", "long", "scheduled", 0, "2026-11-02", "18:05", 0),
  vt("v4", "Smart Home Setup Mistakes", "ch-tech", "long", "draft", 0, "2026-11-08", "12:10", 0),
  vt("v5", "15-Minute Salmon Bowls", "ch-food", "long", "published", 188000, "2026-10-19", "9:41", 1),
  vt("v6", "One Pan, Five Dinners", "ch-food", "long", "published", 96000, "2026-10-26", "11:20", 1),
  vt("v7", "The Garlic Trick Chefs Use", "ch-food", "short", "scheduled", 0, "2026-10-31", "0:35", 1),
  vt("v8", "Meal Prep for Lazy People", "ch-food", "long", "processing", 0, "2026-11-04", "13:02", 1),
  vt("v9", "Sunrise Above the Clouds — Solo Hike", "ch-travel", "long", "published", 141000, "2026-10-12", "21:44", 2),
  vt("v10", "Pack Light: 7 Days, 1 Bag", "ch-travel", "short", "published", 302000, "2026-10-22", "0:58", 2),
  vt("v11", "Hidden Villages of the Alps", "ch-travel", "long", "failed", 0, "2026-10-29", "16:30", 2),
  vt("v12", "Index Funds Explained in 10 Minutes", "ch-money", "long", "published", 233000, "2026-10-18", "10:12", 3),
  vt("v13", "Stop Doing This With Your Salary", "ch-money", "short", "published", 517000, "2026-10-25", "0:41", 3),
  vt("v14", "Emergency Fund: How Much Is Enough?", "ch-money", "long", "scheduled", 0, "2026-11-03", "12:48", 3),
  vt("v15", "Credit Score Myths", "ch-money", "short", "draft", 0, "2026-11-06", "0:52", 3),
  vt("v16", "Best Tablets Under $300", "ch-tech", "long", "scheduled", 0, "2026-11-05", "15:15", 0),
];

/** Deterministic pseudo-random for stable charts. */
function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
}

/** 30-day daily series per channel (views & subscribers gained). */
export const dailySeries = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(DEMO_TODAY);
  d.setDate(d.getDate() - (29 - i));
  const row: Record<string, number | string> = { date: d.toISOString().slice(5, 10) };
  channels.forEach((c, ci) => {
    const r = seeded(i * 31 + ci * 7 + 3);
    const base = c.views / 30;
    row[c.id] = Math.round(base * (0.75 + r() * 0.5) * (1 + i / 120));
    row[`${c.id}_subs`] = Math.round((c.subscribers * c.growth) / 100 / 30 * (0.6 + r() * 0.8));
    row[`${c.id}_rev`] = Math.round((c.revenue / 30) * (0.7 + r() * 0.6));
  });
  row.views = channels.reduce((a, c) => a + (row[c.id] as number), 0);
  row.subs = channels.reduce((a, c) => a + (row[`${c.id}_subs`] as number), 0);
  row.revenue = channels.reduce((a, c) => a + (row[`${c.id}_rev`] as number), 0);
  row.watch = Math.round((row.views as number) * 0.09);
  return row;
});

export type TaskStatus = "pending" | "running" | "completed" | "failed";
export type Task = {
  id: string; name: string; kind: string; channelId: string; status: TaskStatus;
  progress: number; created: string; eta: string; logs: string[];
};
export const tasks: Task[] = [
  { id: "T-1042", name: "Render 'Meal Prep for Lazy People'", kind: "Video assembly", channelId: "ch-food", status: "running", progress: 64, created: "2026-10-30 08:12", eta: "6 min", logs: ["Queued", "Loaded 14 scenes", "Encoding segment 9/14"] },
  { id: "T-1041", name: "Narration — Laptop Buying Guide", kind: "Voice", channelId: "ch-tech", status: "completed", progress: 100, created: "2026-10-30 07:40", eta: "—", logs: ["Queued", "Generated 18:05 audio (simulated)", "Done"] },
  { id: "T-1040", name: "Upload 'Hidden Villages of the Alps'", kind: "Publishing", channelId: "ch-travel", status: "failed", progress: 37, created: "2026-10-29 21:03", eta: "—", logs: ["Queued", "Uploading 37%", "Error: channel authorization expired (simulated)"] },
  { id: "T-1039", name: "SEO metadata — Emergency Fund", kind: "SEO", channelId: "ch-money", status: "completed", progress: 100, created: "2026-10-29 18:22", eta: "—", logs: ["Queued", "Title variants drafted", "Done"] },
  { id: "T-1038", name: "Thumbnail set — Best Tablets", kind: "Thumbnail", channelId: "ch-tech", status: "pending", progress: 0, created: "2026-10-30 09:01", eta: "In queue", logs: ["Queued"] },
  { id: "T-1037", name: "Research — winter recipes", kind: "Research", channelId: "ch-food", status: "running", progress: 22, created: "2026-10-30 09:15", eta: "3 min", logs: ["Queued", "Collecting demo topics"] },
  { id: "T-1036", name: "Script — Credit Score Myths", kind: "Script", channelId: "ch-money", status: "pending", progress: 0, created: "2026-10-30 09:20", eta: "In queue", logs: ["Queued"] },
  { id: "T-1035", name: "Shorts cut — Pack Light", kind: "Shorts", channelId: "ch-travel", status: "completed", progress: 100, created: "2026-10-28 14:10", eta: "—", logs: ["Queued", "3 clips extracted", "Done"] },
  { id: "T-1034", name: "Captions — Index Funds", kind: "Subtitles", channelId: "ch-money", status: "failed", progress: 80, created: "2026-10-28 11:00", eta: "—", logs: ["Queued", "Aligning words", "Error: timing drift > 2s (simulated)"] },
  { id: "T-1033", name: "Storyboard — Smart Home Mistakes", kind: "Storyboard", channelId: "ch-tech", status: "completed", progress: 100, created: "2026-10-27 16:45", eta: "—", logs: ["Queued", "8 scenes created", "Done"] },
];

export type Idea = { id: string; title: string; type: "long" | "short"; niche: string; audience: string; score: number; notes: string };
export const ideas: Idea[] = [
  { id: "i1", title: "Phones that age the best after 3 years", type: "long", niche: "Tech Reviews", audience: "Budget buyers", score: 88, notes: "Compare battery health data from our own testing." },
  { id: "i2", title: "The 10-second charger test", type: "short", niche: "Tech Reviews", audience: "Gen Z", score: 81, notes: "Visual, hook in first frame." },
  { id: "i3", title: "5 freezer meals under $3", type: "long", niche: "Cooking", audience: "Students", score: 84, notes: "Pair with printable shopping list." },
  { id: "i4", title: "Knife skill you're doing wrong", type: "short", niche: "Cooking", audience: "Home cooks", score: 77, notes: "Split-screen before/after." },
  { id: "i5", title: "Travelling Japan by local trains only", type: "long", niche: "Travel", audience: "Backpackers", score: 79, notes: "Needs b-roll from archive." },
  { id: "i6", title: "Airport hack nobody uses", type: "short", niche: "Travel", audience: "Frequent flyers", score: 72, notes: "" },
  { id: "i7", title: "Your first $1,000 invested — step by step", type: "long", niche: "Personal Finance", audience: "Beginners", score: 91, notes: "Avoid specific stock picks." },
  { id: "i8", title: "Subscription audit in 60 seconds", type: "short", niche: "Personal Finance", audience: "Young professionals", score: 86, notes: "" },
];

export type Approval = { id: string; title: string; channelId: string; kind: string; submittedBy: string; date: string; status: "pending" | "approved" | "rejected"; thumb: number; comments: { by: string; text: string }[] };
export const approvals: Approval[] = [
  { id: "a1", title: "Laptop Buying Guide 2027 — final cut", channelId: "ch-tech", kind: "Video", submittedBy: "Priya N.", date: "2026-10-30", status: "pending", thumb: 0, comments: [{ by: "Priya N.", text: "Ready for review, trimmed intro to 12s." }] },
  { id: "a2", title: "The Garlic Trick — Short", channelId: "ch-food", kind: "Short", submittedBy: "Marco L.", date: "2026-10-29", status: "pending", thumb: 1, comments: [] },
  { id: "a3", title: "Emergency Fund — thumbnail B", channelId: "ch-money", kind: "Thumbnail", submittedBy: "Aisha K.", date: "2026-10-29", status: "pending", thumb: 3, comments: [] },
  { id: "a4", title: "Hidden Villages — script v3", channelId: "ch-travel", kind: "Script", submittedBy: "Tom R.", date: "2026-10-27", status: "approved", thumb: 2, comments: [{ by: "You", text: "Great pacing." }] },
  { id: "a5", title: "Index Funds — description", channelId: "ch-money", kind: "Metadata", submittedBy: "Aisha K.", date: "2026-10-26", status: "rejected", thumb: 3, comments: [{ by: "You", text: "Needs a risk disclaimer." }] },
];

export type Asset = { id: string; name: string; kind: "image" | "audio" | "video" | "script" | "storyboard"; size: string; date: string; channelId: string; thumb?: number };
export const assets: Asset[] = [
  { id: "as1", name: "earbuds-hero.jpg", kind: "image", size: "2.1 MB", date: "2026-10-20", channelId: "ch-tech", thumb: 0 },
  { id: "as2", name: "salmon-flatlay.jpg", kind: "image", size: "3.4 MB", date: "2026-10-18", channelId: "ch-food", thumb: 1 },
  { id: "as3", name: "ridge-sunrise.jpg", kind: "image", size: "4.0 MB", date: "2026-10-11", channelId: "ch-travel", thumb: 2 },
  { id: "as4", name: "coins-chart.jpg", kind: "image", size: "1.8 MB", date: "2026-10-17", channelId: "ch-money", thumb: 3 },
  { id: "as5", name: "narration-laptop-guide.wav", kind: "audio", size: "42 MB", date: "2026-10-30", channelId: "ch-tech" },
  { id: "as6", name: "bg-music-lofi-02.mp3", kind: "audio", size: "6.2 MB", date: "2026-10-02", channelId: "ch-food" },
  { id: "as7", name: "broll-alps-drone.mp4", kind: "video", size: "820 MB", date: "2026-10-09", channelId: "ch-travel", thumb: 2 },
  { id: "as8", name: "unboxing-raw-a.mp4", kind: "video", size: "1.2 GB", date: "2026-10-19", channelId: "ch-tech", thumb: 0 },
  { id: "as9", name: "Emergency Fund — script v2", kind: "script", size: "14 KB", date: "2026-10-28", channelId: "ch-money" },
  { id: "as10", name: "Meal Prep — script v4", kind: "script", size: "11 KB", date: "2026-10-27", channelId: "ch-food" },
  { id: "as11", name: "Smart Home — storyboard", kind: "storyboard", size: "8 scenes", date: "2026-10-27", channelId: "ch-tech", thumb: 0 },
  { id: "as12", name: "Pack Light — storyboard", kind: "storyboard", size: "5 scenes", date: "2026-10-21", channelId: "ch-travel", thumb: 2 },
];

export const competitors = [
  { id: "c1", name: "Gadget Lagoon", niche: "Tech Reviews", subs: 1240000, uploadsPerWeek: 4, avgViews: 310000, topTopic: "Phone comparisons", saved: true },
  { id: "c2", name: "Byte Size Tech", niche: "Tech Reviews", subs: 620000, uploadsPerWeek: 7, avgViews: 92000, topTopic: "Shorts tips", saved: false },
  { id: "c3", name: "Pantry Hero", niche: "Cooking", subs: 880000, uploadsPerWeek: 3, avgViews: 210000, topTopic: "Budget meals", saved: true },
  { id: "c4", name: "Northbound Nomad", niche: "Travel", subs: 410000, uploadsPerWeek: 1, avgViews: 160000, topTopic: "Itineraries", saved: false },
  { id: "c5", name: "Wallet Wise", niche: "Personal Finance", subs: 970000, uploadsPerWeek: 5, avgViews: 240000, topTopic: "Investing basics", saved: true },
];

export const notifications = [
  { id: "n1", title: "Upload failed — Hidden Villages of the Alps", body: "Simulated authorization error on Ridgeline Diaries.", time: "12m ago", level: "error" as const, read: false },
  { id: "n2", title: "3 items awaiting your approval", body: "Approval Center has new submissions.", time: "40m ago", level: "warning" as const, read: false },
  { id: "n3", title: "Narration completed", body: "Laptop Buying Guide narration is ready (demo).", time: "2h ago", level: "success" as const, read: false },
  { id: "n4", title: "Scheduled: The Garlic Trick", body: "Goes live Oct 31, 18:00.", time: "5h ago", level: "info" as const, read: true },
  { id: "n5", title: "Weekly demo report ready", body: "Views up 8.1% week over week.", time: "1d ago", level: "info" as const, read: true },
];

export const team = [
  { id: "u1", name: "Demo Admin", email: "demo@valatube.local", role: "Owner", status: "active" },
  { id: "u2", name: "Priya Nair", email: "priya@example.test", role: "Editor", status: "active" },
  { id: "u3", name: "Marco Lin", email: "marco@example.test", role: "Producer", status: "active" },
  { id: "u4", name: "Aisha Khan", email: "aisha@example.test", role: "SEO Specialist", status: "active" },
  { id: "u5", name: "Tom Reyes", email: "tom@example.test", role: "Writer", status: "invited" },
];

export const integrations = [
  { id: "youtube", name: "YouTube Data & Upload", category: "Platform", status: "not_connected", desc: "Channel stats, uploads and scheduling via official APIs. Planned for Phase 02." },
  { id: "analytics", name: "YouTube Analytics", category: "Platform", status: "not_connected", desc: "Watch time, retention and revenue reports. Planned for Phase 02." },
  { id: "gemini", name: "Google Gemini", category: "AI Provider", status: "not_connected", desc: "Research and script drafting." },
  { id: "openai", name: "OpenAI", category: "AI Provider", status: "not_connected", desc: "Script, SEO and image models." },
  { id: "openrouter", name: "OpenRouter", category: "AI Provider", status: "not_connected", desc: "Multi-model routing and fallback." },
  { id: "deepseek", name: "DeepSeek", category: "AI Provider", status: "not_connected", desc: "Low-cost text generation." },
  { id: "tts", name: "Neural TTS", category: "Voice", status: "not_connected", desc: "Narration voices (e.g. edge-tts style engines)." },
  { id: "pexels", name: "Pexels", category: "Stock media", status: "not_connected", desc: "Royalty-free stock video & photos." },
  { id: "pixabay", name: "Pixabay", category: "Stock media", status: "error", desc: "Demo error state: invalid key example." },
  { id: "slack", name: "Slack", category: "Notifications", status: "not_connected", desc: "Approval and failure alerts." },
];

export const workflows = [
  { id: "w1", name: "Idea → Script → Review", trigger: "New idea approved", runs: 42, lastRun: "2026-10-30 08:00", enabled: true, status: "healthy" },
  { id: "w2", name: "Long-form → 3 Shorts", trigger: "Video published", runs: 18, lastRun: "2026-10-29 19:12", enabled: true, status: "healthy" },
  { id: "w3", name: "Weekly SEO refresh", trigger: "Every Monday 09:00", runs: 9, lastRun: "2026-10-26 09:00", enabled: false, status: "paused" },
  { id: "w4", name: "Failed upload alert", trigger: "Task failed", runs: 5, lastRun: "2026-10-29 21:04", enabled: true, status: "warning" },
];

export const agents = [
  { id: "ag-research", name: "Research Agent", role: "Finds topics and keyword gaps", status: "idle", tasks: 128, model: "Not connected", channelIds: ["ch-tech", "ch-food"] },
  { id: "ag-script", name: "Script Assistant", role: "Drafts hooks, outlines and full scripts", status: "busy", tasks: 96, model: "Not connected", channelIds: ["ch-tech", "ch-money"] },
  { id: "ag-seo", name: "SEO Assistant", role: "Titles, descriptions, tags", status: "idle", tasks: 211, model: "Not connected", channelIds: ["ch-money"] },
  { id: "ag-plan", name: "Content Planning Agent", role: "Builds the publishing calendar", status: "paused", tasks: 34, model: "Not connected", channelIds: ["ch-travel"] },
];

export const voices = [
  { id: "vo1", name: "Aria", lang: "English (US)", gender: "Female", style: "Warm narrator" },
  { id: "vo2", name: "Leo", lang: "English (UK)", gender: "Male", style: "Documentary" },
  { id: "vo3", name: "Meera", lang: "Hindi", gender: "Female", style: "Friendly" },
  { id: "vo4", name: "Kenji", lang: "Japanese", gender: "Male", style: "Calm" },
  { id: "vo5", name: "Sofia", lang: "Spanish", gender: "Female", style: "Energetic" },
  { id: "vo6", name: "Noah", lang: "English (US)", gender: "Male", style: "Upbeat explainer" },
];

export const fmt = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${n}`;
export const money = (n: number) => `$${n.toLocaleString("en-US")}`;
export const channelById = (id: string) => channels.find((c) => c.id === id)!;
