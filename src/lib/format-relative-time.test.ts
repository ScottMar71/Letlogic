import { describe, expect, it, vi, afterEach } from "vitest";
import { formatRelativeTime } from "./format-relative-time";

describe("formatRelativeTime", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns Just now for recent timestamps", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-18T12:00:00Z"));
    expect(formatRelativeTime("2026-06-18T11:59:30Z")).toBe("Just now");
  });

  it("returns minutes ago", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-18T12:00:00Z"));
    expect(formatRelativeTime("2026-06-18T11:45:00Z")).toBe("15m ago");
  });

  it("returns days ago", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-18T12:00:00Z"));
    expect(formatRelativeTime("2026-06-16T12:00:00Z")).toBe("2d ago");
  });

  it("falls back to formatted date for older timestamps", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-18T12:00:00Z"));
    expect(formatRelativeTime("2026-05-01T12:00:00Z")).toBe("1 May");
  });
});
