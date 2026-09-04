"use client";

import { FormEvent, useState } from "react";
import {
  Bath,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  House,
  LoaderCircle,
  Scissors,
  Sparkles,
  Store,
  Upload,
} from "lucide-react";

/**
 * Accordion — all sections visible as collapsible panels.
 * Lets the user scan the entire form shape without scrolling through open fields.
 */

const inputClass =
  "h-11 w-full rounded-lg border border-[#dedbd2] bg-white px-3 text-base text-[#292822] placeholder:text-[#292822]/40 outline-none focus:border-[#c1d72d] focus:ring-2 focus:ring-[#c1d72d]/30";
const selectClass = `${inputClass} appearance-none`;
const labelClass = "block text-sm font-bold text-[#292822] mb-1.5";
const requiredStar = <span className="ml-0.5 text-[#d7432d]">*</span>;

function Section({
  title,
  number,
  open,
  onToggle,
  children,
}: {
  title: string;
  number: number;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-4 p-5 text-left sm:p-6"
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#c1d72d] text-sm font-bold text-[#292822]">
          {number}
        </span>
        <span className="flex-1 text-lg font-semibold text-[#292822]">{title}</span>
        <ChevronDown
          className={`size-5 text-[#292822]/40 transition-transform duration-200 ease-out ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && <div className="border-t border-[#dedbd2] px-5 pb-6 pt-5 sm:px-6">{children}</div>}
    </div>
  );
}

export function AccordionVariant() {
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([0]));
  const [location, setLocation] = useState<"salon" | "mobile">("salon");
  const [service, setService] = useState("full-groom");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function toggle(i: number) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
    }, 1200);
  }

  if (success) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow-xl ring-1 ring-black/5">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#c1d72d]">
          <CheckCircle2 className="size-8 text-[#292822]" />
        </span>
        <h2 className="mt-6 text-2xl font-semibold text-[#292822]">Request received</h2>
        <p className="mx-auto mt-3 max-w-md text-[#292822]/60">
          We&apos;ll reply to confirm availability and pricing. Your appointment is not confirmed
          until our team gets back to you.
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            setOpenSections(new Set([0]));
          }}
          className="mt-7 rounded-full bg-[#d7432d] px-6 py-3 text-sm font-semibold text-white shadow-md"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      {/* Section 1 — Location & service */}
      <Section title="Location & service" number={1} open={openSections.has(0)} onToggle={() => toggle(0)}>
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { value: "salon" as const, icon: Store, title: "Uptown salon", body: "1041 W Lawrence Avenue" },
              { value: "mobile" as const, icon: House, title: "Mobile service", body: "We come to your door" },
            ].map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  setLocation(o.value);
                  if (o.value === "mobile" && service === "nail-trim") setService("bath");
                }}
                className={`flex items-start gap-4 rounded-2xl border p-4 text-left transition ${
                  location === o.value
                    ? "border-[#667408] bg-[#f3f7d5] shadow-sm"
                    : "border-[#dedbd2] bg-white hover:border-[#292822]/20"
                }`}
              >
                <o.icon className="mt-0.5 size-5 shrink-0 text-[#d7432d]" />
                <span>
                  <span className="block font-bold text-[#292822]">{o.title}</span>
                  <span className="mt-0.5 block text-sm text-[#292822]/55">{o.body}</span>
                </span>
              </button>
            ))}
          </div>
          {location === "mobile" && (
            <div>
              <label className={labelClass} htmlFor="a-address">Street address{requiredStar}</label>
              <input id="a-address" name="address" autoComplete="street-address" placeholder="Street address, city, ZIP" className={inputClass} />
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { value: "nail-trim", icon: Sparkles, title: "Nail trim", price: "Salon only" },
              { value: "bath", icon: Bath, title: "Bath only", price: location === "mobile" ? "From $130" : "From $65" },
              { value: "full-groom", icon: Scissors, title: "Full groom", price: location === "mobile" ? "From $145" : "From $85" },
            ].map((s) => {
              const disabled = location === "mobile" && s.value === "nail-trim";
              return (
                <button
                  key={s.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => setService(s.value)}
                  className={`rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
                    service === s.value
                      ? "border-[#667408] bg-[#f3f7d5]"
                      : "border-[#dedbd2] bg-white hover:border-[#292822]/20"
                  }`}
                >
                  <s.icon className="size-5 text-[#d7432d]" />
                  <span className="mt-3 block font-bold text-[#292822]">{s.title}</span>
                  <span className="mt-1 block text-sm text-[#292822]/55">{s.price}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Section 2 — Your details */}
      <Section title="Your details" number={2} open={openSections.has(1)} onToggle={() => toggle(1)}>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="a-name">Your name{requiredStar}</label>
            <input id="a-name" name="ownerName" autoComplete="name" className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="a-email">Email{requiredStar}</label>
            <input id="a-email" name="email" type="email" autoComplete="email" className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="a-phone">Phone{requiredStar}</label>
            <input id="a-phone" name="phone" type="tel" autoComplete="tel" className={inputClass} />
          </div>
        </div>
      </Section>

      {/* Section 3 — Pet info */}
      <Section title="Pet info" number={3} open={openSections.has(2)} onToggle={() => toggle(2)}>
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="a-pet">Pet name{requiredStar}</label>
              <input id="a-pet" name="petName" className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="a-breed">Breed{requiredStar}</label>
              <input id="a-breed" name="breed" className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass} htmlFor="a-age">Age{requiredStar}</label>
                <input id="a-age" name="age" className={inputClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="a-weight">Weight{requiredStar}</label>
                <input id="a-weight" name="weight" placeholder="e.g. 25 lb" className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass} htmlFor="a-gender">Gender{requiredStar}</label>
              <select id="a-gender" name="gender" defaultValue="" className={selectClass}>
                <option value="" disabled>Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="unknown">Unknown / prefer not to say</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="a-agg">Any aggression when handled?{requiredStar}</label>
              <select id="a-agg" name="aggression" defaultValue="" className={selectClass}>
                <option value="" disabled>Select</option>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass} htmlFor="a-medical">Medical conditions since the last groom{requiredStar}</label>
            <textarea id="a-medical" name="medical" placeholder='Enter "None" if there are no conditions.' rows={3} className={`${inputClass} min-h-20 py-2.5`} />
          </div>
          <div>
            <label className={labelClass} htmlFor="a-notes">Comments or special requests</label>
            <textarea id="a-notes" name="notes" placeholder="Coat concerns, additional pets, anything else." rows={3} className={`${inputClass} min-h-20 py-2.5`} />
          </div>
          <div>
            <label className={labelClass}>Recent photo (optional)</label>
            <label
              htmlFor="a-photo"
              className="flex min-h-20 cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-[#dedbd2] bg-[#f7f4ed] px-5 text-sm font-semibold text-[#292822]/60 hover:border-[#667408] hover:bg-[#f3f7d5]"
            >
              <Upload className="size-5 text-[#d7432d]" />
              Choose JPG, PNG, or WebP · up to 5 MB
            </label>
            <input id="a-photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp" className="hidden" />
          </div>
        </div>
      </Section>

      {/* Section 4 — Availability */}
      <Section title="Availability" number={4} open={openSections.has(3)} onToggle={() => toggle(3)}>
        <div className="space-y-5">
          <div className="rounded-2xl bg-[#f7f4ed] p-5">
            <label className={labelClass} htmlFor="a-avail">
              Please give us 3 detailed appointment options on your availability{requiredStar}
            </label>
            <textarea
              id="a-avail"
              name="availability"
              rows={4}
              placeholder={"Mon (9/8) 10:00-12:00\nTue (9/9) 1:00-3:30\nWed (9/10) 4:00-6:00"}
              className={`${inputClass} min-h-32 py-2.5`}
            />
            <p className="mt-3 text-sm text-[#292822]/55">
              Same-day and next-day appointments aren&apos;t available through this form.
            </p>
          </div>
          <label className="flex items-start gap-3 rounded-2xl border border-[#dedbd2] bg-white p-5 text-sm leading-6 text-[#292822]/60">
            <input type="checkbox" name="consent" className="mt-1 size-4 accent-[#d7432d]" />
            <span>
              I understand this is an appointment request. The Bark of the Town will reply to
              confirm availability, pricing, and the final appointment.
            </span>
          </label>
        </div>
      </Section>

      <button
        type="submit"
        disabled={submitting}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#d7432d] py-3.5 text-base font-semibold text-white shadow-[0_15px_35px_rgba(215,67,45,0.25)] hover:bg-[#c03826] disabled:opacity-60"
      >
        {submitting ? (
          <>
            <LoaderCircle className="size-5 animate-spin" /> Sending request…
          </>
        ) : (
          <>
            Request appointment <CalendarCheck className="size-5" />
          </>
        )}
      </button>
      <p className="mt-4 text-center text-sm text-[#292822]/55">
        Prefer email? Contact{" "}
        <a className="font-bold text-[#d7432d] underline" href="mailto:tbottinc1@gmail.com">
          tbottinc1@gmail.com
        </a>
        .
      </p>
    </form>
  );
}
