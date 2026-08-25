import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  AtSign,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircleQuestion,
} from "lucide-react";

import { BookingCta, SectionHeading } from "@/components/marketing";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { policies, site } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact The Bark of the Town dog grooming salon at 1041 W Lawrence Avenue in Chicago, or request salon and mobile grooming online.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <section className="page-hero">
        <div className="site-container grid items-center gap-10 py-16 lg:grid-cols-[1fr_0.8fr] lg:py-24">
          <div>
            <p className="eyebrow">Contact us</p>
            <h1 className="mt-4 max-w-3xl text-balance font-heading text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-ink sm:text-7xl">
              Questions? We’re all ears.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Ask about a service, pricing, your dog’s needs, or mobile
              availability. For appointment requests, use our short booking
              form so we have everything needed to help.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/book"
                className={cn(buttonVariants({ size: "lg" }), "h-12 px-6")}
              >
                Request appointment <ArrowRight />
              </Link>
              <a
                href={`mailto:${site.email}`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 bg-white/60 px-6",
                )}
              >
                Email us
              </a>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] bg-lime p-8 text-ink shadow-[0_30px_80px_rgba(103,116,8,0.18)] sm:p-10">
            <div className="absolute -right-16 -top-16 size-48 rounded-full border-[32px] border-white/20" />
            <MessageCircleQuestion className="size-10" />
            <p className="mt-7 font-heading text-3xl font-semibold">
              Need advice before booking?
            </p>
            <p className="mt-3 leading-7 text-ink/70">
              Send a note with your dog’s breed, size, and coat concerns. We’ll
              point you toward the best service.
            </p>
            <a
              className="mt-7 inline-flex items-center gap-2 font-bold underline decoration-2 underline-offset-4"
              href={`mailto:${site.email}`}
            >
              {site.email} <ExternalLink className="size-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="site-container py-20 lg:py-28">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-0 bg-white p-7 shadow-sm ring-1 ring-black/7">
            <span className="grid size-12 place-items-center rounded-2xl bg-lime-soft text-lime-dark">
              <MapPin className="size-5" />
            </span>
            <h2 className="mt-6 font-heading text-2xl font-semibold">Visit us</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              {site.address.full}
            </p>
            <a
              href={site.address.maps}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 font-bold text-red"
            >
              Get directions <ArrowRight className="size-4" />
            </a>
          </Card>
          <Card className="border-0 bg-white p-7 shadow-sm ring-1 ring-black/7">
            <span className="grid size-12 place-items-center rounded-2xl bg-lime-soft text-lime-dark">
              <Mail className="size-5" />
            </span>
            <h2 className="mt-6 font-heading text-2xl font-semibold">Email</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              The best way to ask a quick question about care or availability.
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-5 inline-flex items-center gap-2 break-all font-bold text-red"
            >
              {site.email}
            </a>
          </Card>
          <Card className="border-0 bg-white p-7 shadow-sm ring-1 ring-black/7">
            <span className="grid size-12 place-items-center rounded-2xl bg-lime-soft text-lime-dark">
              <AtSign className="size-5" />
            </span>
            <h2 className="mt-6 font-heading text-2xl font-semibold">Follow</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              See fresh transformations and groomery updates on Instagram.
            </p>
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 font-bold text-red"
            >
              {site.instagramLabel} <ArrowRight className="size-4" />
            </a>
          </Card>
        </div>
      </section>

      <section className="bg-warm py-20 lg:py-28">
        <div className="site-container">
          <SectionHeading
            eyebrow="Before your appointment"
            title="Good to know."
            description="Clear expectations help every visit run smoothly for pets, people, and groomers."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {policies.map((policy, index) => (
              <Card
                key={policy.title}
                className="border-0 bg-white p-7 shadow-sm ring-1 ring-black/6 sm:p-8"
              >
                <p className="font-heading text-sm font-semibold text-lime-dark/60">
                  0{index + 1}
                </p>
                <h2 className="mt-3 font-heading text-2xl font-semibold">
                  {policy.title}
                </h2>
                <p className="mt-3 leading-7 text-muted-foreground">
                  {policy.body}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <BookingCta
        title="Tell us about your pup."
        body="Use one streamlined request form for salon or mobile grooming. We’ll follow up to confirm the service, price, and time."
      />
    </>
  );
}
