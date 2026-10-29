import {
  LayoutDashboard, Tv, Search, Lightbulb, FileText, Film, Mic, ImageIcon, Clapperboard, Scissors,
  Frame, Tags, Send, CalendarDays, Smartphone, Workflow, Bot, ListChecks, BarChart3, Swords,
  DollarSign, FolderOpen, CheckCircle2, Code2, Plug, Bell, Users, Settings, LifeBuoy, Info,
  type LucideIcon,
} from "lucide-react";

export type NavItem = { n: string; label: string; to: string; icon: LucideIcon; group: string };

export const NAV: NavItem[] = [
  { n: "01", label: "Overview", to: "/dashboard", icon: LayoutDashboard, group: "Workspace" },
  { n: "02", label: "Channel Manager", to: "/channels", icon: Tv, group: "Workspace" },
  { n: "03", label: "Content Research", to: "/research", icon: Search, group: "Plan" },
  { n: "04", label: "Ideas Studio", to: "/ideas", icon: Lightbulb, group: "Plan" },
  { n: "05", label: "Script Studio", to: "/scripts", icon: FileText, group: "Plan" },
  { n: "06", label: "Storyboard Studio", to: "/storyboard", icon: Film, group: "Plan" },
  { n: "07", label: "AI Voice Studio", to: "/voice", icon: Mic, group: "Create" },
  { n: "08", label: "AI Image Studio", to: "/images", icon: ImageIcon, group: "Create" },
  { n: "09", label: "AI Video Studio", to: "/video", icon: Clapperboard, group: "Create" },
  { n: "10", label: "Video Editor", to: "/editor", icon: Scissors, group: "Create" },
  { n: "11", label: "Thumbnail Studio", to: "/thumbnails", icon: Frame, group: "Create" },
  { n: "12", label: "SEO Studio", to: "/seo", icon: Tags, group: "Publish" },
  { n: "13", label: "Publishing Manager", to: "/publishing", icon: Send, group: "Publish" },
  { n: "14", label: "Content Calendar", to: "/calendar", icon: CalendarDays, group: "Publish" },
  { n: "15", label: "Shorts Studio", to: "/shorts", icon: Smartphone, group: "Create" },
  { n: "16", label: "Automation Workflows", to: "/workflows", icon: Workflow, group: "Automate" },
  { n: "17", label: "AI Agents", to: "/agents", icon: Bot, group: "Automate" },
  { n: "18", label: "Task Manager", to: "/tasks", icon: ListChecks, group: "Automate" },
  { n: "19", label: "Analytics", to: "/analytics", icon: BarChart3, group: "Grow" },
  { n: "20", label: "Competitor Research", to: "/competitors", icon: Swords, group: "Grow" },
  { n: "21", label: "Revenue Overview", to: "/revenue", icon: DollarSign, group: "Grow" },
  { n: "22", label: "Asset Library", to: "/assets", icon: FolderOpen, group: "Workspace" },
  { n: "23", label: "Approval Center", to: "/approvals", icon: CheckCircle2, group: "Publish" },
  { n: "24", label: "API Manager", to: "/api-manager", icon: Code2, group: "System" },
  { n: "25", label: "Integrations", to: "/integrations", icon: Plug, group: "System" },
  { n: "26", label: "Notifications", to: "/notifications", icon: Bell, group: "System" },
  { n: "27", label: "Team Management", to: "/team", icon: Users, group: "System" },
  { n: "28", label: "Settings", to: "/settings", icon: Settings, group: "System" },
  { n: "29", label: "Help & Support", to: "/help", icon: LifeBuoy, group: "System" },
  { n: "30", label: "About ValaTube Studio", to: "/about", icon: Info, group: "System" },
];

export const NAV_GROUPS = ["Workspace", "Plan", "Create", "Publish", "Automate", "Grow", "System"];
export const MOBILE_PRIMARY = ["/dashboard", "/ideas", "/publishing", "/analytics"];
