import { describe, expect, it } from "vitest";
import { validateSchedule } from "@/lib/schedule";

describe("Local demo scheduling", () => {
  const now = new Date("2026-11-02T12:00:00");
  it("rejects scheduling at or before the browser clock", () => {
    expect(validateSchedule("2026-11-02", "12:00", [true, true, true, true], now)).not.toBe("");
    expect(validateSchedule("2026-11-02", "11:59", [true, true, true, true], now)).not.toBe("");
  });
  it("accepts a future date and time with all four checks", () => {
    expect(validateSchedule("2026-11-02", "12:01", [true, true, true, true], now)).toBe("");
  });
  it("requires all four publishing checks", () => {
    expect(validateSchedule("2026-11-03", "12:00", [true, true, true, false], now)).not.toBe("");
    expect(validateSchedule("2026-11-03", "12:00", [true, true, true], now)).not.toBe("");
  });
});