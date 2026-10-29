import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, FileText, Music, Film, Image as ImageIcon, LayoutGrid, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { pageHead } from "@/lib/seo";
import { PageLoad } from "@/components/app/PageLoad";
import { Chips, ConfirmAction, EmptyState, PageHeader, SearchBox, Thumb, Unavailable } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { assets as seed, channelById, type Asset } from "@/data/mock";
import { useLocalState } from "@/lib/local-store";

export const Route = createFileRoute("/_studio/assets")({
  head: pageHead("Asset Library", "Images, audio, video, scripts and storyboards."),
  component: Assets,
});

const ICON = { image: ImageIcon, audio: Music, video: Film, script: FileText, storyboard: LayoutGrid };
type K = "all" | Asset["kind"];

function Assets() {
  const [list, setList] = useLocalState<Asset[]>("assets", seed);
  const [k, setK] = useState<K>("all");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<string[]>([]);
  const [preview, setPreview] = useState<Asset | null>(null);
  const rows = list.filter((a) => (k === "all" || a.kind === k) && a.name.toLowerCase().includes(q.toLowerCase()));
  const toggle = (id: string) => setSel(sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]);

  return (
    <PageLoad>
      <PageHeader title="Asset Library" description="Sample assets only. File upload and cloud storage arrive in Phase 02."
        actions={<><Button size="sm" variant="outline" onClick={() => Unavailable("File upload")}><Upload /> Upload</Button>
          <ConfirmAction destructive title={`Delete ${sel.length} asset(s)?`} description="Selected assets will be removed from local demo data." confirmLabel="Delete" onConfirm={() => { setList(list.filter((a) => !sel.includes(a.id))); toast(`${sel.length} asset(s) deleted`); setSel([]); }} trigger={<Button size="sm" variant="outline" disabled={!sel.length}><Trash2 /> Delete ({sel.length})</Button>} /></>} />
      <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-center">
        <Chips value={k} onChange={setK} options={[{ value: "all", label: "All" }, { value: "image", label: "Images" }, { value: "audio", label: "Audio" }, { value: "video", label: "Videos" }, { value: "script", label: "Scripts" }, { value: "storyboard", label: "Storyboards" }]} />
        <SearchBox value={q} onChange={setQ} placeholder="Search assets…" className="lg:ml-auto lg:w-64" />
      </div>
      {rows.length === 0 ? <EmptyState title="No assets found" body="Try another category or search term." /> : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {rows.map((a) => {
            const I = ICON[a.kind]; const on = sel.includes(a.id);
            return (
              <div key={a.id} className={`relative rounded-xl border bg-card p-2 ${on ? "border-primary ring-1 ring-primary" : ""}`}>
                <button onClick={() => setPreview(a)} className="block w-full" aria-label={`Preview ${a.name}`}>
                  {a.thumb !== undefined ? <Thumb index={a.thumb} /> : <div className="grid aspect-video place-items-center rounded-lg bg-elevated"><I className="size-8 text-muted-foreground" /></div>}
                </button>
                <button onClick={() => toggle(a.id)} aria-label="Select asset" className={`absolute left-3 top-3 grid size-6 place-items-center rounded-md border ${on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background/80"}`}>{on && <Check className="size-4" />}</button>
                <p className="mt-2 truncate text-xs font-medium">{a.name}</p>
                <p className="flex items-center gap-1 text-[11px] text-muted-foreground"><I className="size-3" /> {a.size} · {a.date}</p>
              </div>
            );
          })}
        </div>
      )}
      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader><DialogTitle>{preview?.name}</DialogTitle></DialogHeader>
          {preview && <>{preview.thumb !== undefined ? <Thumb index={preview.thumb} /> : <div className="grid aspect-video place-items-center rounded-lg bg-elevated text-sm text-muted-foreground">No preview available for this sample {preview.kind}</div>}
            <dl className="grid grid-cols-3 gap-2 text-sm"><div><dt className="text-xs text-muted-foreground">Type</dt><dd className="capitalize">{preview.kind}</dd></div><div><dt className="text-xs text-muted-foreground">Size</dt><dd>{preview.size}</dd></div><div><dt className="text-xs text-muted-foreground">Channel</dt><dd>{channelById(preview.channelId).name}</dd></div></dl></>}
        </DialogContent>
      </Dialog>
    </PageLoad>
  );
}
