import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cta, services, site } from "@/lib/site-content";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-balance font-heading text-4xl font-semibold tracking-[-0.035em] text-ink sm:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-pretty text-lg leading-8 text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function ServiceCards() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {services.map((service) => (
        <Card
          key={service.id}
          className="group border-0 bg-white py-0 shadow-[0_20px_55px_rgba(42,41,36,0.08)] ring-1 ring-black/6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_70px_rgba(42,41,36,0.13)]"
        >
          <div className="relative flex aspect-[1.35] items-center justify-center overflow-hidden bg-lime-soft">
            <div className="absolute inset-6 rounded-full border border-lime-dark/10" />
            <Image
              src={service.image}
              alt=""
              width={220}
              height={220}
              className="relative size-44 object-contain transition duration-500 group-hover:scale-105"
            />
          </div>
          <CardHeader className="px-6 pt-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">{service.eyebrow}</p>
                <h3 className="mt-2 font-heading text-2xl font-semibold text-ink">
                  {service.title}
                </h3>
              </div>
              <Badge variant="secondary" className="bg-lime-soft text-ink">
                {service.price}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-7">
            <p className="leading-6 text-muted-foreground">
              {service.description}
            </p>
            <Link
              href={`/services#${service.id}`}
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-red transition hover:gap-3"
            >
              {cta.viewService} <ArrowRight className="size-4" />
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function BookingCta({
  title = "Ready for a fresh, happy pup?",
  body = "Tell us about your dog and your preferred time. We’ll reply to confirm the details.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="site-container py-16 lg:py-24">
      <div className="relative overflow-hidden rounded-[2rem] bg-red px-6 py-12 text-white shadow-[0_30px_80px_rgba(194,55,38,0.25)] sm:px-12 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:px-16 lg:py-16">
        <div className="absolute -right-24 -top-24 size-72 rounded-full border-[48px] border-white/7" />
        <div className="relative max-w-2xl">
          <p className="eyebrow text-white/70">{cta.requestAppointment}</p>
          <h2 className="mt-3 text-balance font-heading text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
            {title}
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-8 text-white/80">{body}</p>
        </div>
        <div className="relative mt-8 flex shrink-0 flex-col gap-3 sm:flex-row lg:mt-0 lg:flex-col">
          <Link
            href="/book"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-12 bg-white px-6 text-red hover:bg-white/90",
            )}
          >
            {cta.requestAppointment} <ArrowRight />
          </Link>
          <a
            href={`mailto:${site.email}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-12 border-white/30 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white",
            )}
          >
            {cta.askQuestion}
          </a>
        </div>
      </div>
    </section>
  );
}

export function FeatureList({ items }: { items: readonly string[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-lime text-ink">
            <Check className="size-3.5 stroke-[3]" />
          </span>
          <span className="leading-6 text-ink/75">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function TrustPill({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-black/8 bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-sm">
      <Sparkles className="size-4 text-red" />
      {children}
    </div>
  );
}

/** Price rows: WP-style labels (normal weight) / prices (bold), same typeface. */
export function PriceList({
  items,
  dark = false,
}: {
  items: ReadonlyArray<readonly [string, string]>;
  dark?: boolean;
}) {
  return (
    <dl
      className={
        dark ? "mt-6 divide-y divide-white/10" : "mt-6 divide-y divide-black/7"
      }
    >
      {items.map(([label, price]) => (
        <div
          key={label}
          className="flex items-baseline justify-between gap-6 py-3.5 font-sans text-base"
        >
          <dt className={dark ? "font-normal text-white/70" : "font-normal text-ink/70"}>
            {label}
          </dt>
          <dd
            className={
              dark
                ? "shrink-0 font-bold text-white"
                : "shrink-0 font-bold text-ink"
            }
          >
            {price}
          </dd>
        </div>
      ))}
    </dl>
  );
}
