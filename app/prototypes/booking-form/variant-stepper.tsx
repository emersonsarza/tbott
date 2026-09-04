"use client";

import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bath,
  CalendarCheck,
  CheckCircle2,
  House,
  LoaderCircle,
  Scissors,
  Sparkles,
  Store,
  Upload,
} from "lucide-react";

/**
 * Stepper — a multi-step wizard that shows one section at a time.
 * Reduces cognitive load by hiding future steps; a progress bar orients the user.
 */

const inputClass =
  "h-11 w-full rounded-lg border border-[#dedbd2] bg-white px-3 text-base text-[#292822] placeholder:text-[#292822]/40 outline-none focus:border-[#c1d72d] focus:ring-2 focus:ring-[#c1d72d]/30";
const selectClass = `${inputClass} appearance-none`;
const labelClass = "block text-sm font-bold text-[#292822] mb-1.5";
const requiredStar = <span className="ml-0.5 text-[#d7432d]">*</span>;

const STEPS = ["Location & service", "Your details", "Pet info", "Availability"] as const;

export function StepperVariant() {
  const [step, setStep] = useState(0);
  const [location, setLocation] = useState<"salon" | "mobile">("salon");
  const [service, setService] = useState("full-groom");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function next() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function prev() {
    setStep((s) => Math.max(s - 1, 0));
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
            setStep(0);
          }}
          className="mt-7 rounded-full bg-[#d7432d] px-6 py-3 text-sm font-semibold text-white shadow-md"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Progress bar */}
      <div className="mb-8 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 flex-col items-center gap-1.5">
            <div
              className={`h-1.5 w-full rounded-full transition-colors duration-200 ${
                i <= step ? "bg-[#c1d72d]" : "bg-[#dedbd2]"
              }`}
            />
            <span
              className={`text-[11px] font-semibold tracking-wide ${
                i === step ? "text-[#292822]" : "text-[#292822]/40"
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
        {/* Step 1 — Location & service */}
        {step === 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[#292822]">Where should we groom?</h2>
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
                  className={`flex items-start gap-4 rounded-2xl border p-5 text-left transition ${
                    location === o.value
                      ? "border-[#667408] bg-[#f3f7d5] shadow-sm"
                      : "border-[#dedbd2] bg-white hover:border-[#292822]/20"
                  }`}
                >
                  <o.icon className="mt-0.5 size-5 shrink-0 text-[#d7432d]" />
                  <span>
                    <span className="block font-bold text-[#292822]">{o.title}</span>
                    <span className="mt-1 block text-sm text-[#292822]/55">{o.body}</span>
                  </span>
                </button>
              ))}
            </div>

            {location === "mobile" && (
              <div>
                <label className={labelClass} htmlFor="s-address">
                  Street address{requiredStar}
                </label>
                <input id="s-address" name="address" autoComplete="street-address" placeholder="Street address, city, ZIP" className={inputClass} />
              </div>
            )}

            <h2 className="pt-2 text-xl font-semibold text-[#292822]">Choose a service</h2>
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
        )}

        {/* Step 2 — Your details */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-[#292822]">Your details</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="s-name">Your name{requiredStar}</label>
                <input id="s-name" name="ownerName" autoComplete="name" className={inputClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="s-email">Email{requiredStar}</label>
                <input id="s-email" name="email" type="email" autoComplete="email" className={inputClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="s-phone">Phone{requiredStar}</label>
                <input id="s-phone" name="phone" type="tel" autoComplete="tel" className={inputClass} />
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — Pet info */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-[#292822]">Pet info</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="s-pet">Pet name{requiredStar}</label>
                <input id="s-pet" name="petName" className={inputClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="s-breed">Breed{requiredStar}</label>
                <input id="s-breed" name="breed" className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass} htmlFor="s-age">Age{requiredStar}</label>
                  <input id="s-age" name="age" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="s-weight">Weight{requiredStar}</label>
                  <input id="s-weight" name="weight" placeholder="e.g. 25 lb" className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass} htmlFor="s-gender">Gender{requiredStar}</label>
                <select id="s-gender" name="gender" defaultValue="" className={selectClass}>
                  <option value="" disabled>Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="unknown">Unknown / prefer not to say</option>
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="s-agg">Any aggression when handled?{requiredStar}</label>
                <select id="s-agg" name="aggression" defaultValue="" className={selectClass}>
                  <option value="" disabled>Select</option>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass} htmlFor="s-medical">Medical conditions since the last groom{requiredStar}</label>
              <textarea id="s-medical" name="medical" placeholder='Enter "None" if there are no conditions.' rows={3} className={`${inputClass} min-h-20 py-2.5`} />
            </div>
            <div>
              <label className={labelClass} htmlFor="s-notes">Comments or special requests</label>
              <textarea id="s-notes" name="notes" placeholder="Coat concerns, additional pets, anything else." rows={3} className={`${inputClass} min-h-20 py-2.5`} />
            </div>
            <div>
              <label className={labelClass}>Recent photo (optional)</label>
              <label
                htmlFor="s-photo"
                className="flex min-h-20 cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-[#dedbd2] bg-[#f7f4ed] px-5 text-sm font-semibold text-[#292822]/60 hover:border-[#667408] hover:bg-[#f3f7d5]"
              >
                <Upload className="size-5 text-[#d7432d]" />
                Choose JPG, PNG, or WebP · up to 5 MB
              </label>
              <input id="s-photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp" className="hidden" />
            </div>
          </div>
        )}

        {/* Step 4 — Availability */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-[#292822]">Availability</h2>
            <div className="rounded-2xl bg-[#f7f4ed] p-5">
              <label className={labelClass} htmlFor="s-avail">
                Please give us 3 detailed appointment options on your availability{requiredStar}
              </label>
              <textarea
                id="s-avail"
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
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          {step > 0 ? (
            <button
              type="button"
              onClick={prev}
              className="flex items-center gap-2 rounded-full border border-[#dedbd2] px-5 py-2.5 text-sm font-semibold text-[#292822] hover:bg-[#f7f4ed]"
            >
              <ArrowLeft className="size-4" /> Back
            </button>
          ) : (
            <span />
          )}
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="flex items-center gap-2 rounded-full bg-[#d7432d] px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#c03826]"
            >
              Continue <ArrowRight className="size-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-full bg-[#d7432d] px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#c03826] disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" /> Sending…
                </>
              ) : (
                <>
                  Request appointment <CalendarCheck className="size-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
