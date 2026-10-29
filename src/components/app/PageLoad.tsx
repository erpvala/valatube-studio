import type { ReactNode } from "react";
import { useSimulatedLoad } from "@/lib/local-store";
import { LoadingGrid } from "./kit";

/** Shows a short skeleton (simulated fetch) before rendering page content. */
export function PageLoad({ children }: { children: ReactNode }) {
  const loading = useSimulatedLoad();
  return loading ? <LoadingGrid /> : <div className="animate-in fade-in duration-300">{children}</div>;
}
