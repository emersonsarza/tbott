import { z } from "zod";

import { site } from "@/lib/site-content";

export const BOOKING_TIME_ZONE = "America/Chicago";
export const BUSINESS_OPEN = site.hours.open;
export const BUSINESS_CLOSE = site.hours.close;

export type AvailabilityWindow = {
  date: string;
  start: string;
  end: string;
};

export function chicagoDateString(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BOOKING_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function addCalendarDays(yyyyMmDd: string, days: number) {
  const [year, month, day] = yyyyMmDd.split("-").map(Number);
  const utc = Date.UTC(year, month - 1, day + days);
  return new Date(utc).toISOString().slice(0, 10);
}

export function minBookableDateString(now = new Date()) {
  const local = addCalendarDays(ymdFromDate(now), 2);
  const chicago = addCalendarDays(chicagoDateString(now), 2);
  return local > chicago ? local : chicago;
}

export function dateFromYmd(yyyyMmDd: string) {
  const [year, month, day] = yyyyMmDd.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function ymdFromDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatTime12(hhmm: string) {
  const [hourRaw, minuteRaw] = hhmm.split(":");
  const hour24 = Number(hourRaw);
  const minute = Number(minuteRaw);
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour = hour24 % 12 || 12;
  return {
    display: `${hour}:${String(minute).padStart(2, "0")}`,
    period,
  };
}

export function formatTimeRange(start: string, end: string) {
  const startTime = formatTime12(start);
  const endTime = formatTime12(end);
  if (startTime.period === endTime.period) {
    return `${startTime.display}–${endTime.display} ${startTime.period}`;
  }
  return `${startTime.display} ${startTime.period}–${endTime.display} ${endTime.period}`;
}

export function formatAvailabilityLine(window: AvailabilityWindow) {
  const date = dateFromYmd(window.date);
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.getDate();
  return `${weekday}, ${month} ${day}    ${formatTimeRange(window.start, window.end)}`;
}

export function formatAvailability(windows: AvailabilityWindow[]) {
  return windows.map(formatAvailabilityLine).join("\n");
}

export const TIME_OPTIONS = (() => {
  const options: string[] = [];
  const [openHour, openMinute] = BUSINESS_OPEN.split(":").map(Number);
  const [closeHour, closeMinute] = BUSINESS_CLOSE.split(":").map(Number);
  let minutes = openHour * 60 + openMinute;
  const endMinutes = closeHour * 60 + closeMinute;
  while (minutes <= endMinutes) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    options.push(
      `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    );
    minutes += 30;
  }
  return options;
})();

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date");
const timeString = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Choose a time");

export const availabilityWindowSchema = z
  .object({
    date: dateString,
    start: timeString,
    end: timeString,
  })
  .superRefine((window, context) => {
    if (window.start >= window.end) {
      context.addIssue({
        code: "custom",
        path: ["end"],
        message: "End time must be after the start time",
      });
    }
    if (
      window.start < BUSINESS_OPEN ||
      window.end > BUSINESS_CLOSE ||
      !TIME_OPTIONS.includes(window.start) ||
      !TIME_OPTIONS.includes(window.end)
    ) {
      context.addIssue({
        code: "custom",
        path: ["start"],
        message: `Choose a time between ${site.hours.label}`,
      });
    }
    if (window.date < minBookableDateString()) {
      context.addIssue({
        code: "custom",
        path: ["date"],
        message: "Same-day and next-day appointments aren’t available",
      });
    }
  });

export const availabilityWindowsSchema = z
  .array(availabilityWindowSchema)
  .length(3, "Please choose 3 appointment options");

export function parseAvailabilityWindowsJson(value: unknown) {
  if (typeof value !== "string" || !value.trim()) {
    return {
      success: false as const,
      error: "Please choose 3 appointment options",
    };
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    const result = availabilityWindowsSchema.safeParse(parsed);
    if (!result.success) {
      const message =
        result.error.issues[0]?.message || "Please choose 3 appointment options";
      return { success: false as const, error: message };
    }
    return { success: true as const, data: result.data };
  } catch {
    return {
      success: false as const,
      error: "Please choose 3 appointment options",
    };
  }
}
