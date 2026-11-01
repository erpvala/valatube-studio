import { useCallback, useEffect, useState, type SetStateAction } from "react";

const PREFIX = "vt:data:";
const CHANGE_EVENT = "vt:demo-data-changed";

/** useState persisted to localStorage (demo data only). Hydration-safe. */
export function useLocalState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem(PREFIX + key);
        setValue(raw ? JSON.parse(raw) : initial);
      } catch { setValue(initial); }
    };
    read();
    window.addEventListener(CHANGE_EVENT, read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener(CHANGE_EVENT, read);
      window.removeEventListener("storage", read);
    };
  }, [key]);
  const update = useCallback((next: SetStateAction<T>) => {
    let current = value;
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (raw) current = JSON.parse(raw);
    } catch { /* use current state */ }
    const result = typeof next === "function" ? (next as (v: T) => T)(current) : next;
    localStorage.setItem(PREFIX + key, JSON.stringify(result));
    setValue(result);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, [key, value]);
  return [value, update] as const;
}

/** Clears every locally edited demo record. */
export function resetDemoData() {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(PREFIX))
    .forEach((k) => localStorage.removeItem(k));
  window.dispatchEvent(new Event(CHANGE_EVENT));
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
