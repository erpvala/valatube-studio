import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { hasDemoSession } from "@/lib/demo-auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ValaTube Studio — Create Smarter. Manage Better." },
      { name: "description", content: "ValaTube Studio by Software Vala™: plan, create, publish and analyse YouTube content from one studio." },
      { property: "og:title", content: "ValaTube Studio" },
      { property: "og:description", content: "Create Smarter. Manage Better. Powered by Software Vala™." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Splash,
});

/** Splash screen: brand moment, then routes to dashboard or login. */
function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate({ to: hasDemoSession() ? "/dashboard" : "/login", replace: true }), 1100);
    return () => clearTimeout(t);
  }, [navigate]);
  return (
    <div className="grid min-h-dvh place-items-center bg-background">
      <div className="flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-500">
        <LogoMark className="size-20 shadow-glow rounded-3xl" />
        <h1 className="mt-5 text-3xl font-extrabold">Vala<span className="text-primary">Tube</span> <span className="font-semibold text-muted-foreground">Studio</span></h1>
        <p className="mt-2 text-sm text-muted-foreground">Create Smarter. Manage Better.</p>
        <div className="mt-8 h-1 w-40 overflow-hidden rounded-full bg-elevated"><div className="h-full w-1/2 animate-pulse rounded-full bg-primary" /></div>
        <p className="mt-10 text-xs text-subtle">Powered by Software Vala™</p>
      </div>
    </div>
  );
}
