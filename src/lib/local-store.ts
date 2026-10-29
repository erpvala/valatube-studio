import { useEffect, useRef, useState } from "react";

const PREFIX = "vt:data:";

/** useState persisted to localStorage (demo data only). Hydration-safe. */
export function useLocalState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const loaded = useRef(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (raw) setValue(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    loaded.current = true;
  }, [key]);
  useEffect(() => {
    if (loaded.current) localStorage.setItem(PREFIX + key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue] as const;
}

/** Clears every locally edited demo record. */
export function resetDemoData() {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(PREFIX))
    .forEach((k) => localStorage.removeItem(k));
}

/** Short simulated loading state so pages can show skeletons. */
export function useSimulatedLoad(ms = 450) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return loading;
}
