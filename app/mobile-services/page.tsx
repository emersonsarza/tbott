import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  House,
  Sparkles,
  Truck,
} from "lucide-react";

import {
  BookingCta,
  FeatureList,
  SectionHeading,
} from "@/components/marketing";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { mobilePricing } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Mobile Grooming at Your Door",
  description:
    "Private, one-on-one mobile dog grooming at your Chicago home or workplace. Baths start at $130 and full grooms at $145.",
  alternates: { canonical: "/mobile-services" },
};

const benefits = [
  "No driving to and from a salon",
  "No waiting for hours in a busy environment",
  "Helpful for senior pets and motion sickness",
  "A calmer option for separation anxiety",
  "Private, one-on-one attention",
  "Professional equipment at your door",
] as const;

export default function MobileServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(193,215,45,0.24),transparent_34rem)]" />
        <div className="site-container relative grid items-center gap-12 py-16 lg:min-h-[660px] lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <p className="eyebrow text-lime">Mobile grooming</p>
            <h1 className="mt-4 max-w-3xl text-balance font-heading text-5xl font-semibold leading-[0.96] tracking-[-0.045em] sm:text-7xl">
              A full groomery, right outside your door.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">
              Our self-contained mobile unit brings professional, private
              grooming to your home or workplace—without the stressful drive or
              long salon wait.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/book?location=mobile"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 bg-lime px-6 text-ink hover:bg-lime/85",
                )}
              >
                Request mobile service <ArrowRight />
              </Link>
              <a
                href="#mobile-pricing"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 border-white/20 bg-white/5 px-6 text-white hover:bg-white/10 hover:text-white",
                )}
              >
                See starting prices
              </a>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-6 rounded-full border border-lime/20" />
            <div className="absolute -inset-14 rounded-full border border-lime/10" />
            <div className="relative overflow-hidden rounded-[2rem] border-8 border-white bg-white shadow-2xl">
              <Image
                src="/images/gallery/3.jpg"
                alt="A small dog before and after a professional groom"
                width={800}
                height={400}
                className="w-full"
                priority
              />
              <div className="flex items-center gap-3 p-5 text-ink">
                <Truck className="size-5 text-red" />
                <p className="font-bold">Private care, wherever you are</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <SectionHeading
            eyebrow="Why mobile"
            title="Less disruption for you. Less stress for your dog."
            description="Everything needed for a polished groom is on board. Your dog gets focused care in a calm space just steps from home."
          />
          <FeatureList items={benefits} />
        </div>
      </section>

      <section className="bg-lime-soft py-20 lg:py-28">
        <div className="site-container">
          <SectionHeading
            eyebrow="A simple process"
            title="From request to fresh in three steps."
            align="center"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              [
                "01",
                House,
                "Tell us where",
                "Share your location, your dog’s details, and a few preferred appointment times.",
              ],
              [
                "02",
                Clock3,
                "We confirm",
                "Our team replies with availability, timing, and a tailored price estimate.",
              ],
              [
                "03",
                Sparkles,
                "We roll up",
                "The mobile unit arrives for a private grooming visit lasting about 60–90 minutes.",
              ],
            ].map(([number, Icon, title, body]) => {
              const IconComponent = Icon as typeof House;
              return (
                <Card
                  key={String(number)}
                  className="border-0 bg-white p-7 shadow-sm ring-1 ring-black/5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-4xl font-semibold text-lime-dark/25">
                      {String(number)}
                    </span>
                    <span className="grid size-12 place-items-center rounded-2xl bg-red text-white">
                      <IconComponent className="size-5" />
                    </span>
                  </div>
                  <h3 className="mt-8 font-heading text-2xl font-semibold">
                    {String(title)}
                  </h3>
                  <p className="mt-3 leading-7 text-muted-foreground">
                    {String(body)}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="mobile-pricing"
        className="site-container scroll-mt-28 py-20 lg:py-28"
      >
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="eyebrow">Mobile pricing</p>
            <h2 className="mt-3 text-balance font-heading text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
              Premium convenience, transparent starting points.
            </h2>
            <p className="mt-5 leading-7 text-muted-foreground">
              Final pricing depends on breed, size, coat condition, and
              temperament. Contact us for weight restrictions and a detailed
              estimate.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Card className="border-0 bg-white p-7 shadow-md ring-1 ring-black/7">
              <h3 className="font-heading text-2xl font-semibold tracking-wide text-ink">
                {mobilePricing.bath.title}
              </h3>
              <p className="mt-5 leading-7 text-muted-foreground">
                Hypoallergenic bath, dry, ears, nails, teeth brushing, and
                glands on request.
              </p>
              <p className="mt-6 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-base text-ink">
                <span className="font-normal tracking-wide">
                  {mobilePricing.bath.lead}
                </span>
                <span className="font-bold">{mobilePricing.bath.price}</span>
              </p>
              <Link
                href="/book?location=mobile&service=bath"
                className="mt-7 inline-flex items-center gap-2 font-bold text-red"
              >
                Request a bath <ArrowRight className="size-4" />
              </Link>
            </Card>
            <Card className="border-0 bg-red p-7 text-white shadow-xl ring-0">
              <h3 className="font-heading text-2xl font-semibold text-white">
                {mobilePricing.groom.title}
              </h3>
              <p className="mt-5 leading-7 text-white/70">
                Complete bath service plus haircut and a careful hand-scissor
                finish.
              </p>
              <p className="mt-6 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-base text-white">
                <span className="font-normal tracking-wide">
                  {mobilePricing.groom.lead}
                </span>
                <span className="font-bold">{mobilePricing.groom.price}</span>
              </p>
              <Link
                href="/book?location=mobile&service=full-groom"
                className="mt-7 inline-flex items-center gap-2 font-bold text-white"
              >
                Request a full groom <ArrowRight className="size-4" />
              </Link>
            </Card>
          </div>
        </div>
        <div className="mt-8 flex items-start gap-3 rounded-2xl bg-warm p-5 text-sm leading-6 text-muted-foreground">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-lime-dark" />
          Mobile service is a request, not an instant booking. We will confirm
          the service area, time, and final estimate before your appointment.
        </div>
      </section>

      <BookingCta
        title="Let the groomery come to you."
        body="Share your address, dog’s details, and preferred times. We’ll respond with availability and a tailored estimate."
      />
    </>
  );
}
