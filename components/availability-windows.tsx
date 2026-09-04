"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  BUSINESS_CLOSE,
  TIME_OPTIONS,
  dateFromYmd,
  formatTime12,
  minBookableDateString,
  ymdFromDate,
  type AvailabilityWindow,
} from "@/lib/availability";

const inputClass =
  "h-11 w-full rounded-lg border border-input bg-white px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

function timeLabel(hhmm: string) {
  const { display, period } = formatTime12(hhmm);
  return `${display} ${period}`;
}

function DatePicker({
  id,
  value,
  minDate,
  minYmd,
  onChange,
}: {
  id: string;
  value: string;
  minDate: Date;
  minYmd: string;
  onChange: (next: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = value ? dateFromYmd(value) : undefined;
  const label = selected
    ? selected.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : "Choose date";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={id}
        type="button"
        className={cn(
          inputClass,
          "flex items-center justify-between gap-3 text-left font-medium",
          value ? "text-ink" : "text-muted-foreground/65",
        )}
        aria-label="Appointment date"
      >
        <span className="truncate">{label}</span>
        <CalendarDays className="size-4 shrink-0 text-red" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-2">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            if (!date) return;
            onChange(ymdFromDate(date));
            setOpen(false);
          }}
          disabled={(date) => ymdFromDate(date) < minYmd}
          startMonth={minDate}
        />
      </PopoverContent>
    </Popover>
  );
}

export function AvailabilityWindows({
  windows,
  onChange,
  error,
}: {
  windows: AvailabilityWindow[];
  onChange: (windows: AvailabilityWindow[]) => void;
  error?: string[];
}) {
  const minYmd = minBookableDateString();
  const minDate = dateFromYmd(minYmd);

  function update(index: number, patch: Partial<AvailabilityWindow>) {
    onChange(
      windows.map((window, windowIndex) =>
        windowIndex === index ? { ...window, ...patch } : window,
      ),
    );
  }

  return (
    <div className="space-y-3">
      {windows.map((window, index) => (
        <div
          key={index}
          className="rounded-2xl border border-black/7 bg-white p-4"
        >
          <p className="text-xs font-bold tracking-wide text-ink/45 uppercase">
            Option {index + 1}
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1.2fr)_1fr_1fr]">
            <div className="space-y-1.5">
              <label
                htmlFor={`availability-date-${index}`}
                className="text-sm font-semibold text-ink"
              >
                Date
              </label>
              <DatePicker
                id={`availability-date-${index}`}
                value={window.date}
                minDate={minDate}
                minYmd={minYmd}
                onChange={(date) => update(index, { date })}
              />
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor={`availability-start-${index}`}
                className="text-sm font-semibold text-ink"
              >
                From
              </label>
              <select
                id={`availability-start-${index}`}
                value={window.start}
                onChange={(event) => update(index, { start: event.target.value })}
                className={inputClass}
              >
                <option value="">Start</option>
                {TIME_OPTIONS.filter((time) => time < BUSINESS_CLOSE).map(
                  (time) => (
                  <option key={time} value={time}>
                    {timeLabel(time)}
                  </option>
                ),
                )}
              </select>
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor={`availability-end-${index}`}
                className="text-sm font-semibold text-ink"
              >
                To
              </label>
              <select
                id={`availability-end-${index}`}
                value={window.end}
                onChange={(event) => update(index, { end: event.target.value })}
                className={inputClass}
              >
                <option value="">End</option>
                {TIME_OPTIONS.filter(
                  (time) => !window.start || time > window.start,
                ).map((time) => (
                  <option key={time} value={time}>
                    {timeLabel(time)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ))}
      {error?.[0] ? (
        <p className="text-sm font-medium text-destructive">{error[0]}</p>
      ) : null}
    </div>
  );
}
