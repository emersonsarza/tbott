import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, AtSign, Mail, MapPin } from "lucide-react";

import { navigation, site } from "@/lib/site-content";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/8 bg-ink text-white">
      <div className="site-container grid gap-10 py-14 md:grid-cols-[1.3fr_0.7fr_1fr] lg:py-20">
        <div className="max-w-md">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-white p-1.5">
              <Image
                src="/images/logo.png"
                alt=""
                width={72}
                height={72}
                className="size-16 object-contain"
              />
            </div>
            <p className="font-heading text-2xl font-semibold">
              The Bark of the Town
            </p>
          </div>
          <p className="mt-6 text-base leading-7 text-white/68">
            Thoughtful, one-on-one salon and mobile dog grooming for Chicago
            pets and their people.
          </p>
        </div>

        <div>
          <p className="eyebrow text-lime">Explore</p>
          <ul className="mt-5 space-y-3">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  className="text-white/70 transition hover:text-white"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link className="font-semibold text-lime" href="/book">
                Book a groom
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-lime">Visit & connect</p>
          <ul className="mt-5 space-y-4 text-white/70">
            <li>
              <a
                className="flex items-start gap-3 transition hover:text-white"
                href={site.address.maps}
                target="_blank"
                rel="noreferrer"
              >
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span>{site.address.full}</span>
                <ArrowUpRight className="mt-0.5 size-3.5 shrink-0" />
              </a>
            </li>
            <li>
              <a
                className="flex items-center gap-3 transition hover:text-white"
                href={`mailto:${site.email}`}
              >
                <Mail className="size-4" />
                {site.email}
              </a>
            </li>
            <li>
              <a
                className="flex items-center gap-3 transition hover:text-white"
                href={site.instagram}
                target="_blank"
                rel="noreferrer"
              >
                <AtSign className="size-4" />
                {site.instagramLabel}
              </a>
            </li>
          </ul>
          <p className="mt-5 text-sm text-white/50">
            Appointments preferred. Walk-ins as space allows.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="site-container flex flex-col gap-3 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.legalName}</p>
          <p>Designed with care in Chicago.</p>
        </div>
      </div>
    </footer>
  );
}
