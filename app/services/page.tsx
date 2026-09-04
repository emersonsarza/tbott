import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck, CircleDollarSign } from "lucide-react";

import { BookingCta, SectionHeading } from "@/components/marketing";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { salonPricing, services } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Uptown Salon Grooming",
  description:
    "Nail trims, baths, and full dog grooms at our Uptown Chicago salon. View transparent starting prices and request an appointment.",
  alternates: { canonical: "/services" },
};

function PriceList({
  items,
}: {
  items: ReadonlyArray<readonly [string, string]>;
}) {
  return (
    <dl className="mt-6 divide-y divide-black/7">
      {items.map(([label, price]) => (
        <div
          key={label}
          className="flex items-center justify-between gap-6 py-3.5"
        >
          <dt className="text-ink/70">{label}</dt>
          <dd className="font-heading text-lg font-semibold text-ink">{price}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function ServicesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="site-container grid items-center gap-10 py-16 lg:grid-cols-[1fr_0.7fr] lg:py-24">
          <div>
            <p className="eyebrow">Uptown grooming salon</p>
            <h1 className="mt-4 max-w-4xl text-balance font-heading text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-ink sm:text-7xl">
              Salon care that puts your dog first.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              From quick nail care to a complete haircut, each service is
              handled patiently with pet-friendly, hypoallergenic products.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/book?location=salon"
                className={cn(buttonVariants({ size: "lg" }), "h-12 px-6")}
              >
                Request salon service <ArrowRight />
              </Link>
              <a
                href="#pricing"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 bg-white/60 px-6",
                )}
              >
                View pricing
              </a>
            </div>
          </div>
          <div className="relative mx-auto max-w-sm">
            <div className="absolute inset-4 rounded-full bg-lime blur-3xl opacity-40" />
            <Image
              src="/images/services/full-groom.png"
              alt=""
              width={420}
              height={420}
              className="relative w-full object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </section>

      <section className="site-container py-16 lg:py-24" id="pricing">
        <SectionHeading
          eyebrow="Services & starting prices"
          title="Clear options for every kind of cleanup."
          description="Final pricing depends on coat condition, size, temperament, and the time needed. Please contact us about weight restrictions."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Card
            id="nails"
            className="scroll-mt-28 border-0 bg-white p-7 shadow-sm ring-1 ring-black/7 sm:p-9"
          >
            <div className="flex items-center gap-4">
              <Image
                src={services[0].image}
                alt=""
                width={80}
                height={80}
                className="size-16 object-contain"
              />
              <div>
                <p className="eyebrow">Quick care</p>
                <h2 className="mt-1 font-heading text-3xl font-semibold">
                  Nail trim
                </h2>
              </div>
            </div>
            <p className="mt-5 leading-7 text-muted-foreground">
              Nail trim and/or gentle dremel when your pet is comfortable.
            </p>
            <PriceList items={salonPricing.nails} />
          </Card>

          <Card className="border-0 bg-lime-soft p-7 shadow-sm ring-1 ring-lime-dark/10 sm:p-9">
            <div className="flex items-center gap-4">
              <span className="grid size-16 place-items-center rounded-2xl bg-white text-red shadow-sm">
                <CircleDollarSign className="size-7" />
              </span>
              <div>
                <p className="eyebrow">Customize the visit</p>
                <h2 className="mt-1 font-heading text-3xl font-semibold">
                  Add-on care
                </h2>
              </div>
            </div>
            <PriceList items={salonPricing.addOns} />
          </Card>

          <Card
            id="bath"
            className="scroll-mt-28 border-0 bg-white p-7 shadow-sm ring-1 ring-black/7 sm:p-9"
          >
            <div className="flex items-center gap-4">
              <Image
                src={services[1].image}
                alt=""
                width={80}
                height={80}
                className="size-16 object-contain"
              />
              <div>
                <p className="eyebrow">Fresh & clean</p>
                <h2 className="mt-1 font-heading text-3xl font-semibold">
                  Bath only
                </h2>
              </div>
            </div>
            <p className="mt-5 leading-7 text-muted-foreground">
              Hypoallergenic bath, towel or hand blow dry, ear cleaning, and
              nail trim or dremel. Teeth brushing and glands included on request.
            </p>
            <PriceList items={salonPricing.bath} />
          </Card>

          <Card
            id="fullgroom"
            className="scroll-mt-28 border-0 bg-ink p-7 text-white shadow-xl ring-0 sm:p-9"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white p-1">
                <Image
                  src={services[2].image}
                  alt=""
                  width={80}
                  height={80}
                  className="size-14 object-contain"
                />
              </div>
              <div>
                <p className="eyebrow text-lime">The full treatment</p>
                <h2 className="mt-1 font-heading text-3xl font-semibold">
                  Full groom
                </h2>
              </div>
            </div>
            <p className="mt-5 leading-7 text-white/65">
              Everything in the bath service, plus a complete haircut and
              careful hand-scissor finish.
            </p>
            <div className="mt-6">
              <dl className="divide-y divide-white/10">
                {salonPricing.groom.map(([label, price]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-6 py-3.5"
                  >
                    <dt className="text-white/65">{label}</dt>
                    <dd className="font-heading text-lg font-semibold">{price}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Card>
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-black/8 bg-warm p-5">
          <CalendarCheck className="mt-0.5 size-5 shrink-0 text-red" />
          <p className="text-sm leading-6 text-muted-foreground">
            Appointments are preferred. Space-available walk-ins are welcome.
            Same-day availability is not guaranteed.
          </p>
        </div>
      </section>

      <BookingCta
        title="A cleaner coat is just a request away."
        body="Choose salon service and share a few details about your dog. We’ll reply with availability and a tailored estimate."
      />
    </>
  );
}
