import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { Clock3, FlaskConical, Mail, ShieldCheck } from "lucide-react";

import { BookingForm } from "@/components/booking-form";
import { Card } from "@/components/ui/card";
import { isShowcaseMode } from "@/lib/booking-delivery";
import { site } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Request a salon or mobile dog grooming appointment with The Bark of the Town in Chicago.",
  alternates: { canonical: "/book" },
};

export default async function BookPage() {
  await connection();
  const showcase = isShowcaseMode();

  return (
    <>
      <section className="page-hero">
        <div className="site-container py-14 text-center lg:py-20">
          <p className="eyebrow">Appointment Request</p>
          <h1 className="mx-auto mt-4 max-w-4xl text-balance font-heading text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-ink sm:text-7xl">
            Tell us about your pup.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            {showcase
              ? "Try the booking form for this showcase rebuild. Submissions are validated for demo purposes and are not emailed live."
              : "Choose salon or mobile service, share a few details, and request a time. We’ll reply to confirm availability and final pricing."}
          </p>
        </div>
      </section>

      <section className="site-container grid gap-8 py-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:py-20">
        <Suspense
          fallback={
            <Card className="min-h-[700px] animate-pulse border-0 bg-white shadow-sm ring-1 ring-black/7" />
          }
        >
          <BookingForm />
        </Suspense>

        <aside className="space-y-4 lg:sticky lg:top-28">
          {showcase ? (
            <Card className="border-0 bg-lime-soft p-6 ring-1 ring-lime-dark/15">
              <FlaskConical className="size-7 text-lime-dark" />
              <h2 className="mt-5 font-heading text-2xl font-semibold">
                Showcase Mode
              </h2>
              <p className="mt-3 text-sm leading-6 text-ink/70">
                This form is for testing the new site. Requests are not
                delivered. Email {site.email} for a real appointment.
              </p>
            </Card>
          ) : null}
          <Card className="border-0 bg-ink p-6 text-white shadow-xl ring-0">
            <ShieldCheck className="size-7 text-lime" />
            <h2 className="mt-5 font-heading text-2xl font-semibold">
              A request, not a reservation
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/65">
              {site.bookingNote}
            </p>
          </Card>
          <Card className="border-0 bg-lime-soft p-6 ring-1 ring-lime-dark/10">
            <Clock3 className="size-6 text-lime-dark" />
            <h2 className="mt-4 font-heading text-xl font-semibold">
              Planning Ahead
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Same-day and next-day appointments are not available through this
              form. Please provide 3 date and time windows so we can find a
              time that works.
            </p>
          </Card>
          <Card className="border-0 bg-white p-6 ring-1 ring-black/7">
            <Mail className="size-6 text-red" />
            <h2 className="mt-4 font-heading text-xl font-semibold">
              Need help first?
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Email questions about coat condition, size restrictions, or which
              service fits.
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-4 block break-all text-sm font-bold text-red"
            >
              {site.email}
            </a>
          </Card>
        </aside>
      </section>
    </>
  );
}
