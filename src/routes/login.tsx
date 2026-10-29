import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Sparkles, AlertCircle, PlayCircle, BarChart3, CalendarDays } from "lucide-react";
import { Wordmark, PoweredBy } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { checkDemoCredentials, DEMO_CREDENTIALS, startDemoSession } from "@/lib/demo-auth";
import { THUMBS } from "@/data/mock";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — ValaTube Studio" },
      { name: "description", content: "Sign in to ValaTube Studio by Software Vala™." },
      { property: "og:title", content: "Sign in — ValaTube Studio" },
      { property: "og:description", content: "Create Smarter. Manage Better." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ username?: string; password?: string; form?: string }>({});
  const [busy, setBusy] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!username.trim()) next.username = "Enter your username or email.";
    else if (!/^\S+@\S+\.\S+$/.test(username.trim())) next.username = "Enter a valid email address.";
    if (!password) next.password = "Enter your password.";
    if (Object.keys(next).length) return setErrors(next);
    setBusy(true);
    setTimeout(() => {
      if (checkDemoCredentials(username, password)) {
        startDemoSession(remember);
        navigate({ to: "/dashboard" });
      } else {
        setErrors({ form: "Those credentials don't match the demo account. Use the demo login shortcut below." });
        setBusy(false);
      }
    }, 450);
  };

  return (
    <div className="grid min-h-dvh bg-background lg:grid-cols-[1.1fr_1fr]">
      {/* Brand / preview panel */}
      <aside className="relative hidden overflow-hidden border-r bg-sidebar p-10 lg:flex lg:flex-col">
        <div className="grid-dots absolute inset-0 opacity-60" />
        <div className="relative"><Wordmark /></div>
        <div className="relative mt-auto">
          <h1 className="max-w-md text-4xl font-extrabold leading-tight">Create Smarter.<br /><span className="text-primary">Manage Better.</span></h1>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">Research, script, produce, review and publish across every channel — from one studio.</p>
          <div className="mt-8 grid max-w-lg grid-cols-2 gap-3">
            {THUMBS.map((t, i) => (
              <div key={i} className="overflow-hidden rounded-xl border bg-card">
                <img src={t} alt="" width={1280} height={720} className="aspect-video w-full object-cover" />
                <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
                  {[<PlayCircle key="a" className="size-3.5 text-primary" />, <BarChart3 key="b" className="size-3.5 text-info" />, <CalendarDays key="c" className="size-3.5 text-success" />, <Sparkles key="d" className="size-3.5 text-warning" />][i]}
                  {["Publishing", "Analytics", "Calendar", "AI Studios"][i]}
                </div>
              </div>
            ))}
          </div>
          <PoweredBy className="mt-10" />
        </div>
      </aside>

      {/* Form */}
      <main className="safe-top flex flex-col justify-center px-5 py-10 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="lg:hidden"><Wordmark /></div>
          <h2 className="mt-8 text-2xl font-bold lg:mt-0">Welcome back</h2>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to ValaTube Studio</p>

          {errors.form && (
            <div role="alert" className="mt-5 flex gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" /> {errors.form}
            </div>
          )}

          <form onSubmit={submit} noValidate className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="u" className="text-xs font-medium text-muted-foreground">Username (email)</label>
              <Input id="u" type="email" autoComplete="username" value={username} onChange={(e) => { setUsername(e.target.value); setErrors({}); }} className="h-11 bg-surface" aria-invalid={!!errors.username} placeholder="you@company.com" />
              {errors.username && <p className="text-xs text-destructive">{errors.username}</p>}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="p" className="text-xs font-medium text-muted-foreground">Password</label>
                <Link to="/reset-password" className="text-xs font-semibold text-primary">Forgot password?</Link>
              </div>
              <div className="relative">
                <Input id="p" type={show ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => { setPassword(e.target.value); setErrors({}); }} className="h-11 bg-surface pr-10" aria-invalid={!!errors.password} />
                <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center text-muted-foreground">
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} /> Remember me
            </label>
            <Button type="submit" className="h-11 w-full" disabled={busy}>{busy ? "Signing in…" : "Log in"}</Button>
          </form>

          <div className="mt-5 rounded-xl border border-dashed p-4">
            <p className="text-xs font-semibold">Demo access</p>
            <p className="mt-1 text-xs text-muted-foreground">Frontend-only demo account for Phase 01. Not production authentication.</p>
            <Button variant="soft" className="mt-3 w-full" onClick={() => { setUsername(DEMO_CREDENTIALS.username); setPassword(DEMO_CREDENTIALS.password); setErrors({}); }}>
              <Sparkles /> Fill demo credentials
            </Button>
          </div>
          <PoweredBy className="mt-8 text-center lg:hidden" />
        </div>
      </main>
    </div>
  );
}
