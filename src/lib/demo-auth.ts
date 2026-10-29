/**
 * Phase 01 FRONTEND-ONLY demo authentication.
 * Not secure. Replace with real authentication in Phase 02.
 */
export const DEMO_CREDENTIALS = {
  username: "demo@valatube.local",
  password: "ValaDemo@2026",
} as const;

const KEY = "vt:session";

export function checkDemoCredentials(username: string, password: string) {
  return username.trim().toLowerCase() === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password;
}

export function startDemoSession(remember: boolean) {
  const store = remember ? localStorage : sessionStorage;
  store.setItem(KEY, JSON.stringify({ user: DEMO_CREDENTIALS.username, at: Date.now() }));
}

export function hasDemoSession() {
  if (typeof window === "undefined") return false;
  return !!(localStorage.getItem(KEY) || sessionStorage.getItem(KEY));
}

export function endDemoSession() {
  localStorage.removeItem(KEY);
  sessionStorage.removeItem(KEY);
}
