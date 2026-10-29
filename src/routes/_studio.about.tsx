import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { PageLoad } from "@/components/app/PageLoad";
import { PageHeader, Panel } from "@/components/app/kit";
import { LogoMark } from "@/components/brand/Logo";

export const Route = createFileRoute("/_studio/about")({
  head: pageHead("About", "ValaTube Studio by Software Vala™ — Create Smarter. Manage Better."),
  component: About,
});

function About() {
  return (
    <PageLoad>
      <PageHeader title="About ValaTube Studio" demo={false} />
      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="grid-dots flex flex-col items-center px-6 py-12 text-center">
          <LogoMark className="size-20 rounded-3xl shadow-glow" />
          <h2 className="mt-4 text-3xl font-extrabold">Vala<span className="text-primary">Tube</span> <span className="text-muted-foreground">Studio</span></h2>
          <p className="mt-2 text-muted-foreground">Create Smarter. Manage Better.</p>
          <p className="mt-6 text-sm font-semibold">Powered by Software Vala™</p>
          <p className="mt-1 text-xs text-subtle">Version 0.1 · Phase 01 (UI/UX preview)</p>
        </div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Panel title="What it is"><p className="text-sm text-muted-foreground">A multi-channel YouTube management studio covering research, scripting, production, review, publishing, automation and analytics — built as an original commercial product by Software Vala™.</p></Panel>
        <Panel title="Independence notice"><p className="text-sm text-muted-foreground">ValaTube Studio is not affiliated with, endorsed by or sponsored by YouTube or Google. “YouTube” is a trademark of Google LLC and is used only to describe compatibility.</p></Panel>
        <Panel title="Open-source acknowledgements" className="md:col-span-2">
          <p className="text-sm text-muted-foreground">Workflow concepts were studied (not copied) from these MIT-licensed projects:</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• youtube-automation-agent — © 2025 YouTube Automation Agent Contributors (MIT)</li>
            <li>• youtube-agentic-ai-studio (YAAS) — © 2025 YouTube AI Agent Studio Contributors (MIT)</li>
          </ul>
          <p className="mt-2 text-xs text-subtle">Built with React, TanStack, Tailwind CSS, Radix UI, Recharts and Lucide icons (MIT / ISC licensed).</p>
        </Panel>
      </div>
    </PageLoad>
  );
}
