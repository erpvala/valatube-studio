import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { hasDemoSession } from "@/lib/demo-auth";
import { LogoMark } from "@/components/brand/Logo";

export const Route = createFileRoute("/_studio")({
  component: StudioLayout,
});

/** Frontend-only demo guard (Phase 01). Not a security boundary. */
function StudioLayout() {
  const navigate = useNavigate();
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (hasDemoSession()) setOk(true);
    else navigate({ to: "/login", replace: true });
  }, [navigate]);
  if (!ok)
    return (
      <div className="grid min-h-dvh place-items-center bg-background">
        <LogoMark className="size-12 animate-pulse" />
      </div>
    );
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
