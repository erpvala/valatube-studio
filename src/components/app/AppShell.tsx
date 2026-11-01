import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Bell, ChevronsLeft, ChevronsRight, LogOut, Menu, Moon, Search, Sun, User, Settings as Cog, RotateCcw, Grid2x2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { NAV, NAV_GROUPS, MOBILE_PRIMARY } from "@/lib/nav";
import { Wordmark, PoweredBy, LogoMark } from "@/components/brand/Logo";
import { useTheme } from "@/lib/theme";
import { endDemoSession } from "@/lib/demo-auth";
import { resetDemoData, useLocalState } from "@/lib/local-store";
import { DEMO_CREDENTIALS } from "@/lib/demo-auth";
import { channels, notifications, videos } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const ChannelCtx = createContext<{ channel: string; setChannel: (c: string) => void; channelList: typeof channels; setChannelList: (c: typeof channels) => void }>({ channel: "all", setChannel: () => {}, channelList: channels, setChannelList: () => {} });
export const useChannel = () => useContext(ChannelCtx);

export function ChannelSelect({ className }: { className?: string }) {
  const { channel, setChannel, channelList } = useChannel();
  return (
    <Select value={channel} onValueChange={setChannel}>
      <SelectTrigger className={cn("h-9 w-[180px] bg-surface", className)} aria-label="Channel selector"><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All channels</SelectItem>
        {channelList.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

function NavLinks({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const { pathname } = useLocation();
  return (
    <nav className="space-y-4">
      {NAV_GROUPS.map((g) => (
        <div key={g}>
          {!collapsed && <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-subtle">{g}</p>}
          {NAV.filter((n) => n.group === g).map((n) => {
            const active = pathname.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to} onClick={onNavigate} title={collapsed ? n.label : undefined}
                className={cn("group flex h-9 items-center gap-3 rounded-lg px-3 text-sm transition-colors",
                  active ? "bg-primary-soft font-semibold text-primary" : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                  collapsed && "justify-center px-0")}>
                <n.icon className="size-[18px] shrink-0" />
                {!collapsed && <span className="truncate">{n.label}</span>}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function GlobalSearch({ open, setOpen }: { open: boolean; setOpen: (o: boolean) => void }) {
  const navigate = useNavigate();
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setOpen(!open); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, setOpen]);
  const go = (to: string) => { setOpen(false); navigate({ to }); };
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages and demo videos…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          {NAV.map((n) => <CommandItem key={n.to} onSelect={() => go(n.to)}><n.icon className="mr-2 size-4" />{n.label}</CommandItem>)}
        </CommandGroup>
        <CommandGroup heading="Videos (demo)">
          {videos.map((v) => <CommandItem key={v.id} onSelect={() => { setOpen(false); navigate({ to: "/publishing", search: { video: v.id } }); }}>{v.title}</CommandItem>)}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

function UserMenu() {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="User menu" title="User menu" size="icon" className="rounded-full font-bold">DA</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel><p className="text-sm">Demo Admin</p><p className="text-xs font-normal text-muted-foreground">{DEMO_CREDENTIALS.username}</p></DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}><User /> Profile</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}><Cog /> Settings</DropdownMenuItem>
        <DropdownMenuItem onClick={() => { resetDemoData(); toast.success("Demo data reset"); }}><RotateCcw /> Reset demo data</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => { endDemoSession(); navigate({ to: "/login" }); }}><LogOut /> Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationsPopover() {
  const [list] = useLocalState("notifications", notifications);
  const unread = list.filter((n) => !n.read).length;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell />{unread > 0 && <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">{unread}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="border-b px-3 py-2 text-sm font-semibold">Notifications <span className="text-xs font-normal text-warning">(demo)</span></div>
        <ul className="max-h-72 overflow-auto">
          {list.map((n) => (
            <li key={n.id} className="border-b border-divider px-3 py-2 last:border-0">
              <p className={cn("text-sm", !n.read && "font-semibold")}>{n.title}</p>
              <p className="text-xs text-muted-foreground">{n.time}</p>
            </li>
          ))}
        </ul>
        <Link to="/notifications" className="block px-3 py-2 text-center text-xs font-semibold text-primary">View all</Link>
      </PopoverContent>
    </Popover>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [channelList, setChannelList] = useLocalState("channels", channels);
  const [channel, setChannel] = useLocalState("active-channel", "all");
  const [defaultChannel] = useLocalState("default-channel", "all");
  useEffect(() => {
    if (!localStorage.getItem("vt:data:active-channel")) setChannel(defaultChannel);
  }, [defaultChannel]);
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();
  const current = NAV.find((n) => pathname.startsWith(n.to));

  return (
    <ChannelCtx.Provider value={{ channel, setChannel, channelList, setChannelList }}>
      <div className="flex min-h-dvh bg-background">
        {/* Desktop sidebar */}
        <aside className={cn("sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] md:flex", collapsed ? "w-[68px]" : "w-64")}>
          <div className={cn("flex h-14 items-center border-b border-sidebar-border px-4", collapsed && "justify-center px-0")}>
            <Link to="/dashboard">{collapsed ? <LogoMark /> : <Wordmark />}</Link>
          </div>
          <div className="scrollbar-thin flex-1 overflow-y-auto px-2 py-3"><NavLinks collapsed={collapsed} /></div>
          <div className="border-t border-sidebar-border p-2">
            <Button variant="ghost" size="sm" className="w-full justify-center" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">
              {collapsed ? <ChevronsRight /> : <><ChevronsLeft /> Collapse</>}
            </Button>
            {!collapsed && <PoweredBy className="mt-1 text-center" />}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top bar */}
          <header className="safe-top sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
            <div className="flex h-14 items-center gap-2 px-3 sm:px-5">
              <Link to="/dashboard" className="md:hidden"><Wordmark /></Link>
              <Button variant="outline" onClick={() => setSearchOpen(true)} className="ml-auto hidden h-9 w-full max-w-md justify-start bg-surface text-subtle md:ml-0 md:flex">
                <Search className="size-4" /> Search ValaTube Studio… <kbd className="ml-auto rounded border px-1.5 text-[10px]">Ctrl K</kbd>
              </Button>
              <div className="ml-auto flex items-center gap-1">
                <ChannelSelect className="hidden lg:flex" />
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Search" onClick={() => setSearchOpen(true)}><Search /></Button>
                <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggle}>{theme === "dark" ? <Sun /> : <Moon />}</Button>
                <NotificationsPopover />
                <UserMenu />
              </div>
            </div>
          </header>

          <main className="flex-1 px-3 pb-24 pt-4 sm:px-5 md:pb-8">
            {current && (
              <Breadcrumb className="mb-3 hidden sm:block">
                <BreadcrumbList>
                  <BreadcrumbItem><Link to="/dashboard" className="hover:text-foreground">Studio</Link></BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>{current.group}</BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem><BreadcrumbPage>{current.label}</BreadcrumbPage></BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            )}
            <div className="mb-3 lg:hidden"><ChannelSelect className="w-full sm:w-[220px]" /></div>
            {children}
          </main>
        </div>

        {/* Mobile bottom nav */}
        <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t bg-surface md:hidden" aria-label="Primary">
          <div className="grid grid-cols-5">
            {MOBILE_PRIMARY.map((to) => {
              const n = NAV.find((x) => x.to === to);
              if (!n) return null;
              const active = pathname.startsWith(to);
              return (
                <Link key={to} to={to} className={cn("flex h-16 flex-col items-center justify-center gap-1 text-[10px] font-medium", active ? "text-primary" : "text-muted-foreground")}>
                  <n.icon className="size-5" />{n.label.split(" ")[0]}
                </Link>
              );
            })}
            <Button variant="ghost" onClick={() => setMoreOpen(true)} className="h-16 flex-col gap-1 rounded-none text-[10px] text-muted-foreground">
              <Grid2x2 className="size-5" />More
            </Button>
          </div>
        </nav>
        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetContent side="bottom" className="safe-bottom max-h-[85dvh] overflow-y-auto rounded-t-2xl">
            <SheetHeader><SheetTitle className="flex items-center gap-2"><Menu className="size-4" /> All modules</SheetTitle></SheetHeader>
            <div className="grid grid-cols-3 gap-2 p-4 pt-0">
              {NAV.map((n) => (
                <Link key={n.to} to={n.to} onClick={() => setMoreOpen(false)} className={cn("flex flex-col items-center gap-1.5 rounded-xl border bg-card p-3 text-center text-[11px] font-medium", pathname.startsWith(n.to) && "border-primary text-primary")}>
                  <n.icon className="size-5" />{n.label}
                </Link>
              ))}
            </div>
            <PoweredBy className="pb-4 text-center" />
          </SheetContent>
        </Sheet>
        <GlobalSearch open={searchOpen} setOpen={setSearchOpen} />
      </div>
    </ChannelCtx.Provider>
  );
}
