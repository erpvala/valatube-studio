import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Info } from "lucide-react";
import { Wordmark, PoweredBy } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — ValaTube Studio" },
      { name: "description", content: "Reset your ValaTube Studio password (Phase 01 simulation)." },
      { property: "og:title", content: "Reset password — ValaTube Studio" },
      { property: "og:description", content: "Password reset for ValaTube Studio." },
    ],
  }),
  component: Reset,
});

function Reset() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  return (
    <div className="safe-top grid min-h-dvh place-items-center bg-background px-5">
      <div className="w-full max-w-sm">
        <Wordmark />
        {done ? (
          <div className="mt-8 rounded-xl border bg-card p-5">
            <div className="flex gap-2 text-info"><Info className="size-5 shrink-0" /><h1 className="text-lg font-bold text-foreground">Simulated reset request</h1></div>
            <p className="mt-2 text-sm text-muted-foreground">
              This is a Phase 01 demo. <strong className="text-foreground">No email was sent and no password was changed.</strong> Real password recovery for <span className="text-foreground">{email}</span> will arrive with production authentication.
            </p>
            <Button asChild className="mt-4 w-full"><Link to="/login">Back to sign in</Link></Button>
          </div>
        ) : (
          <form className="mt-8 space-y-4" noValidate onSubmit={(e) => { e.preventDefault(); if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email address."); setDone(true); }}>
            <div>
              <h1 className="text-2xl font-bold">Reset password</h1>
              <p className="mt-1 text-sm text-muted-foreground">Enter the email linked to your workspace.</p>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="e" className="text-xs font-medium text-muted-foreground">Email</label>
              <Input id="e" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} className="h-11 bg-surface" aria-invalid={!!error} />
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>
            <Button type="submit" className="h-11 w-full">Request reset (demo)</Button>
            <Link to="/login" className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Back to sign in</Link>
          </form>
        )}
        <PoweredBy className="mt-10 text-center" />
      </div>
    </div>
  );
}
