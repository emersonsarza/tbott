import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Heart,
  Home as HomeIcon,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";

import { GalleryGrid } from "@/components/gallery-grid";
import {
  BookingCta,
  SectionHeading,
  ServiceCards,
  TrustPill,
} from "@/components/marketing";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site-content";

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-warm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,rgba(193,215,45,0.48),transparent_35rem)]" />
        <div className="site-container relative grid min-h-[720px] items-center gap-12 py-16 lg:grid-cols-[1.03fr_0.97fr] lg:py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-lime-dark/15 bg-white/80 px-3.5 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-lime-dark shadow-sm">
              <Star className="size-3.5 fill-lime text-lime-dark" />
              Chicago salon & mobile grooming
            </div>
            <h1 className="mt-7 text-balance font-heading text-[clamp(3.4rem,7vw,6.6rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-ink">
              Good dogs.
              <span className="block text-red">Great hair days.</span>
            </h1>
            <p className="mt-7 max-w-xl text-pretty text-lg leading-8 text-ink/65 sm:text-xl">
              Calm, one-on-one grooming for Chicago pups—at our Uptown salon or
              right outside your door.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/book"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-13 px-7 text-base shadow-[0_12px_30px_rgba(215,67,45,0.25)]",
                )}
              >
                Request an appointment <ArrowRight />
              </Link>
              <Link
                href="/services"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-13 border-black/12 bg-white/60 px-7 text-base",
                )}
              >
                Explore services
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-2.5">
              <TrustPill>Gentle one-on-one care</TrustPill>
              <TrustPill>Salon or mobile</TrustPill>
              <TrustPill>Hypoallergenic products</TrustPill>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -left-8 top-10 size-28 rounded-full bg-red/15 blur-2xl" />
            <div className="absolute -right-10 bottom-20 size-40 rounded-full bg-lime blur-3xl" />
            <div className="relative rotate-2 overflow-hidden rounded-[2.5rem] border-8 border-white bg-white shadow-[0_35px_100px_rgba(42,41,36,0.2)]">
              <Image
                src="/images/gallery/1.jpg"
                alt="A doodle before and after a fresh groom"
                width={800}
                height={400}
                className="aspect-2/1 w-full object-cover"
                priority
              />
              <div className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-heading text-xl font-semibold text-ink">
                    From scruffy to stunning
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    A thoughtful groom, tailored to your pup.
                  </p>
                </div>
                <div className="grid size-12 shrink-0 place-items-center rounded-full bg-lime">
                  <Sparkles className="size-5 text-ink" />
                </div>
              </div>
            </div>
            <Image
              src="/images/logo.png"
              alt=""
              width={180}
              height={180}
              className="absolute -bottom-20 -left-6 size-36 -rotate-8 object-contain drop-shadow-xl sm:size-44"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-black/6 bg-white">
        <div className="site-container grid gap-px bg-black/6 sm:grid-cols-3">
          {[
            [MapPin, "Uptown salon", "1041 W Lawrence Ave"],
            [Clock3, "Appointments preferred", "Walk-ins as space allows"],
            [Heart, "Care-first grooming", "Every coat. Every temperament."],
          ].map(([Icon, title, body]) => {
            const IconComponent = Icon as typeof MapPin;
            return (
              <div
                key={String(title)}
                className="flex items-center gap-4 bg-white px-5 py-6 sm:px-7"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-lime-soft text-lime-dark">
                  <IconComponent className="size-5" />
                </span>
                <div>
                  <p className="font-bold text-ink">{String(title)}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {String(body)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="site-container py-20 lg:py-28">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Salon services"
            title="Everything your dog needs to feel their best."
            description="Straightforward care, transparent starting prices, and no assembly-line grooming."
          />
          <Link
            href="/services"
            className="inline-flex shrink-0 items-center gap-2 font-bold text-red hover:gap-3"
          >
            See full pricing <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-12">
          <ServiceCards />
        </div>
      </section>

      <section className="bg-ink py-20 text-white lg:py-28">
        <div className="site-container grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] border border-white/10">
              <Image
                src="/images/gallery/5.jpg"
                alt="Small dog before and after professional grooming"
                width={800}
                height={400}
                className="w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-3 rounded-2xl bg-lime p-5 text-ink shadow-xl sm:-right-6">
              <p className="font-heading text-3xl font-semibold">1:1</p>
              <p className="mt-0.5 text-xs font-bold uppercase tracking-widest">
                attentive care
              </p>
            </div>
          </div>
          <div>
            <p className="eyebrow text-lime">Why pet parents choose us</p>
            <h2 className="mt-4 text-balance font-heading text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
              Less waiting. Less stress. More tail wags.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/65">
              We make grooming more comfortable for nervous, senior, and
              high-energy dogs with focused attention and a patient approach.
            </p>
            <div className="mt-9 grid gap-5 sm:grid-cols-2">
              {[
                [ShieldCheck, "Experienced groomers", "Knowledgeable care from trained professionals."],
                [HomeIcon, "Calmer environment", "A more private, personal grooming experience."],
                [Truck, "We come to you", "Mobile service at your home or workplace."],
                [Sparkles, "Quality finish", "Careful bathing, drying, clipping, and details."],
              ].map(([Icon, title, body]) => {
                const IconComponent = Icon as typeof Sparkles;
                return (
                  <div key={String(title)} className="flex gap-3">
                    <IconComponent className="mt-1 size-5 shrink-0 text-lime" />
                    <div>
                      <h3 className="font-bold">{String(title)}</h3>
                      <p className="mt-1 text-sm leading-6 text-white/55">
                        {String(body)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <Link
              href="/mobile-services"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "mt-10 h-12 border-white/20 bg-white/5 px-6 text-white hover:bg-white/10 hover:text-white",
              )}
            >
              Explore mobile grooming <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <section className="site-container py-20 lg:py-28">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Fresh from the groomery"
            title="Real pups. Real transformations."
            description="A few of our favorite before-and-after moments."
          />
          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-2 font-bold text-red"
          >
            Follow {site.instagramLabel} <ArrowRight className="size-4" />
          </a>
        </div>
        <div className="mt-12">
          <GalleryGrid limit={4} />
        </div>
      </section>

      <BookingCta />
    </>
  );
}
