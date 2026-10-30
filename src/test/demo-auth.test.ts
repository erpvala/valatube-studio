import { describe, expect, it } from "vitest";
import { checkDemoCredentials, DEMO_CREDENTIALS } from "@/lib/demo-auth";

describe("Phase 01 demo login", () => {
  it("accepts the demo account demo@valatube.local / ValaDemo@2026", () => {
    expect(DEMO_CREDENTIALS).toEqual({ username: "demo@valatube.local", password: "ValaDemo@2026" });
    expect(checkDemoCredentials("demo@valatube.local", "ValaDemo@2026")).toBe(true);
  });
  it("rejects a wrong password", () => {
    expect(checkDemoCredentials("demo@valatube.local", "wrong")).toBe(false);
  });
  it("rejects an unknown user", () => {
    expect(checkDemoCredentials("someone@valatube.local", "ValaDemo@2026")).toBe(false);
  });
});
