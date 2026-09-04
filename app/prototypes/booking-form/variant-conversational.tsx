"use client";

import { FormEvent, useState } from "react";
import {
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
 * Conversational — a spacious single-column flow where each question group
 * has generous whitespace and large labels. The availability textarea gets
 * hero-level prominence instead of being buried at the bottom.
 */

const inputClass =
  "h-12 w-full rounded-xl border border-[#dedbd2] bg-white px-4 text-base text-[#292822] placeholder:text-[#292822]/35 outline-none focus:border-[#c1d72d] focus:ring-2 focus:ring-[#c1d72d]/30";
const selectClass = `${inputClass} appearance-none`;
const labelClass = "block text-[15px] font-bold text-[#292822] mb-2";
const requiredStar = <span className="ml-0.5 text-[#d7432d]">*</span>;

function Q({ children }: { children: React.ReactNode }) {
  return <div className="border-b border-[#dedbd2]/60 pb-10 last:border-0 last:pb-0">{children}</div>;
}

export function ConversationalVariant() {
  const [location, setLocation] = useState<"salon" | "mobile">("salon");
  const [service, setService] = useState("full-groom");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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
      <div className="rounded-3xl bg-white p-10 text-center shadow-xl ring-1 ring-black/5 sm:p-14">
        <span className="mx-auto grid size-20 place-items-center rounded-full bg-[#c1d72d]">
          <CheckCircle2 className="size-10 text-[#292822]" />
        </span>
        <h2 className="mt-8 text-3xl font-semibold text-[#292822]">We got your request!</h2>
        <p className="mx-auto mt-4 max-w-lg text-lg leading-7 text-[#292822]/55">
          We&apos;ll reply to confirm availability and pricing. Remember — your appointment is not
          confirmed until our team gets back to you.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-8 rounded-full bg-[#d7432d] px-8 py-3.5 font-semibold text-white shadow-md"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="rounded-3xl bg-white px-6 py-10 shadow-sm ring-1 ring-black/5 sm:px-10 sm:py-12">
        <div className="space-y-10">
          {/* Availability — hero position */}
          <Q>
            <p className="text-xs font-bold uppercase tracking-widest text-[#667408]">Most important</p>
            <h2 className="mt-3 text-2xl font-semibold text-[#292822]">When are you available?</h2>
            <p className="mt-2 text-sm leading-6 text-[#292822]/50">
              Give us 3 detailed options — a day, date, and time window for each. Same-day and
              next-day aren&apos;t available through this form.
            </p>
            <textarea
              id="c-avail"
              name="availability"
              rows={5}
              placeholder={"Mon (9/8) 10:00-12:00\nTue (9/9) 1:00-3:30\nWed (9/10) 4:00-6:00"}
              className={`mt-4 ${inputClass} min-h-36 py-3`}
            />
          </Q>

          {/* Location */}
          <Q>
            <h2 className="text-xl font-semibold text-[#292822]">Where should we groom?</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
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
                      : "border-[#dedbd2] hover:border-[#292822]/20"
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
              <div className="mt-5">
                <label className={labelClass} htmlFor="c-address">Street address{requiredStar}</label>
                <input id="c-address" name="address" autoComplete="street-address" placeholder="Street address, city, ZIP" className={inputClass} />
              </div>
            )}
          </Q>

          {/* Service */}
          <Q>
            <h2 className="text-xl font-semibold text-[#292822]">Choose a service</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
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
                        : "border-[#dedbd2] hover:border-[#292822]/20"
                    }`}
                  >
                    <s.icon className="size-5 text-[#d7432d]" />
                    <span className="mt-3 block font-bold text-[#292822]">{s.title}</span>
                    <span className="mt-1 block text-sm text-[#292822]/55">{s.price}</span>
                  </button>
                );
              })}
            </div>
          </Q>

          {/* About you */}
          <Q>
            <h2 className="text-xl font-semibold text-[#292822]">About you</h2>
            <div className="mt-5 space-y-5">
              <div>
                <label className={labelClass} htmlFor="c-name">Your name{requiredStar}</label>
                <input id="c-name" name="ownerName" autoComplete="name" className={inputClass} />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="c-email">Email{requiredStar}</label>
                  <input id="c-email" name="email" type="email" autoComplete="email" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="c-phone">Phone{requiredStar}</label>
                  <input id="c-phone" name="phone" type="tel" autoComplete="tel" className={inputClass} />
                </div>
              </div>
            </div>
          </Q>

          {/* About the pet */}
          <Q>
            <h2 className="text-xl font-semibold text-[#292822]">About the pet</h2>
            <div className="mt-5 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="c-pet">Pet name{requiredStar}</label>
                  <input id="c-pet" name="petName" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="c-breed">Breed{requiredStar}</label>
                  <input id="c-breed" name="breed" className={inputClass} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass} htmlFor="c-age">Age{requiredStar}</label>
                  <input id="c-age" name="age" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="c-weight">Weight{requiredStar}</label>
                  <input id="c-weight" name="weight" placeholder="e.g. 25 lb" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="c-gender">Gender{requiredStar}</label>
                  <select id="c-gender" name="gender" defaultValue="" className={selectClass}>
                    <option value="" disabled>Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass} htmlFor="c-agg">Any aggression when handled or groomed?{requiredStar}</label>
                <select id="c-agg" name="aggression" defaultValue="" className={selectClass}>
                  <option value="" disabled>Select</option>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="c-medical">Medical conditions since the last groom{requiredStar}</label>
                <textarea id="c-medical" name="medical" placeholder='Enter "None" if there are no conditions.' rows={3} className={`${inputClass} min-h-20 py-3`} />
              </div>
              <div>
                <label className={labelClass} htmlFor="c-notes">Comments or special requests</label>
                <textarea id="c-notes" name="notes" placeholder="Coat concerns, temperament notes, additional pets." rows={3} className={`${inputClass} min-h-20 py-3`} />
              </div>
              <div>
                <label className={labelClass}>Recent photo (optional)</label>
                <label
                  htmlFor="c-photo"
                  className="flex min-h-24 cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-[#dedbd2] bg-[#f7f4ed] px-5 text-sm font-semibold text-[#292822]/60 hover:border-[#667408] hover:bg-[#f3f7d5]"
                >
                  <Upload className="size-5 text-[#d7432d]" />
                  Choose JPG, PNG, or WebP · up to 5 MB
                </label>
                <input id="c-photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp" className="hidden" />
              </div>
            </div>
          </Q>
        </div>

        {/* Consent + submit */}
        <div className="mt-10 space-y-6">
          <label className="flex items-start gap-3 rounded-2xl border border-[#dedbd2] bg-[#f7f4ed] p-5 text-sm leading-6 text-[#292822]/60">
            <input type="checkbox" name="consent" className="mt-1 size-4 accent-[#d7432d]" />
            <span>
              I understand this is an appointment request. The Bark of the Town will reply to
              confirm availability, pricing, and the final appointment.
            </span>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#d7432d] py-4 text-base font-semibold text-white shadow-[0_15px_35px_rgba(215,67,45,0.25)] hover:bg-[#c03826] disabled:opacity-60"
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
          <p className="text-center text-sm text-[#292822]/55">
            Prefer email? Contact{" "}
            <a className="font-bold text-[#d7432d] underline" href="mailto:tbottinc1@gmail.com">
              tbottinc1@gmail.com
            </a>
            .
          </p>
        </div>
      </div>
    </form>
  );
}
