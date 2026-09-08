"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";

import { cta, navigation } from "@/lib/site-content";
import { buttonVariants, Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/6 bg-background/92 backdrop-blur-xl">
      <div className="site-container flex h-20 items-center justify-between gap-6">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
          aria-label="The Bark of the Town home"
        >
          <Image
            src="/images/logo.png"
            alt=""
            width={64}
            height={64}
            className="size-14 object-contain"
            priority
          />
          <span className="hidden font-heading text-xl font-semibold leading-none tracking-[-0.02em] text-ink sm:block">
            The Bark
            <span className="block text-sm font-medium text-muted-foreground">
              of the Town
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3.5 py-2 text-sm font-semibold text-ink/75 transition hover:bg-lime-soft hover:text-ink focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/book"
            className={cn(buttonVariants({ size: "lg" }), "ml-3 h-11 px-5")}
          >
            {cta.bookGroom}
          </Link>
        </nav>

        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="icon-lg"
                className="lg:hidden"
                aria-label="Open Navigation"
              />
            }
          >
            <Menu />
          </SheetTrigger>
          <SheetContent className="w-[88vw] max-w-sm">
            <SheetHeader className="border-b p-6">
              <SheetTitle className="font-heading text-2xl">
                The Bark of the Town
              </SheetTitle>
              <SheetDescription>
                Salon and mobile grooming in Chicago.
              </SheetDescription>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4" aria-label="Mobile navigation">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-4 py-3 text-lg font-semibold hover:bg-lime-soft"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/book"
                className={cn(buttonVariants({ size: "lg" }), "mt-3 h-12")}
              >
                {cta.bookGroom}
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
