import type { Metadata } from "next";

import { BookingCta, SectionHeading } from "@/components/marketing";
import { GalleryGrid } from "@/components/gallery-grid";

export const metadata: Metadata = {
  title: "Dog Grooming Gallery",
  description:
    "See real before-and-after dog grooming transformations from The Bark of the Town in Chicago.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <section className="page-hero">
        <div className="site-container py-16 text-center lg:py-24">
          <p className="eyebrow">Before & after</p>
          <h1 className="mx-auto mt-4 max-w-4xl text-balance font-heading text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-ink sm:text-7xl">
            The proof is in the poof.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Real Chicago pups, thoughtfully bathed, trimmed, styled, and sent
            home feeling their best.
          </p>
        </div>
      </section>
      <section className="site-container py-16 lg:py-24">
        <SectionHeading
          eyebrow="Fresh from the groomery"
          title="Six very good transformations."
          description="Open any photo for a closer look."
        />
        <div className="mt-12">
          <GalleryGrid />
        </div>
      </section>
      <BookingCta />
    </>
  );
}
