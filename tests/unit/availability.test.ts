import { describe, expect, it } from "vitest";

import {
  TIME_OPTIONS,
  formatAvailability,
  formatTimeRange,
  minBookableDateString,
  parseAvailabilityWindowsJson,
} from "@/lib/availability";

describe("business hours", () => {
  it("only offers times from 9:00 AM to 6:00 PM", () => {
    expect(TIME_OPTIONS[0]).toBe("09:00");
    expect(TIME_OPTIONS.at(-1)).toBe("18:00");
    expect(TIME_OPTIONS).not.toContain("08:30");
    expect(TIME_OPTIONS).not.toContain("18:30");
  });
});

describe("availability formatting", () => {
  it("shows a shared AM/PM once when the window stays in the same period", () => {
    expect(formatTimeRange("09:30", "11:00")).toBe("9:30–11:00 AM");
    expect(formatTimeRange("14:00", "16:00")).toBe("2:00–4:00 PM");
  });

  it("keeps both periods when a window crosses noon", () => {
    expect(formatTimeRange("10:00", "13:00")).toBe("10:00 AM–1:00 PM");
  });

  it("formats three windows for the email", () => {
    expect(
      formatAvailability([
        { date: "2026-09-08", start: "09:30", end: "11:00" },
        { date: "2026-09-09", start: "14:00", end: "16:00" },
        { date: "2026-09-10", start: "10:00", end: "12:30" },
      ]),
    ).toBe(
      "Tue, Sep 8    9:30–11:00 AM\nWed, Sep 9    2:00–4:00 PM\nThu, Sep 10    10:00 AM–12:30 PM",
    );
  });
});

describe("availability windows schema", () => {
  it("requires three complete windows", () => {
    const result = parseAvailabilityWindowsJson("[]");
    expect(result.success).toBe(false);
  });

  it("rejects same-day and next-day dates", () => {
    const tooSoon = minBookableDateString();
    const [year, month, day] = tooSoon.split("-").map(Number);
    const previous = new Date(Date.UTC(year, month - 1, day - 1))
      .toISOString()
      .slice(0, 10);
    const window = { date: previous, start: "10:00", end: "12:00" };
    const result = parseAvailabilityWindowsJson(
      JSON.stringify([window, window, window]),
    );
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Same-day");
    }
  });

  it("accepts three future windows", () => {
    const date = minBookableDateString();
    const window = { date, start: "10:00", end: "12:00" };
    const result = parseAvailabilityWindowsJson(
      JSON.stringify([window, window, window]),
    );
    expect(result.success).toBe(true);
  });
});
