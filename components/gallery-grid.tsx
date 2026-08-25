"use client";

import Image from "next/image";
import { useState } from "react";
import { Expand } from "lucide-react";

import { galleryImages } from "@/lib/site-content";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

export function GalleryGrid({ limit }: { limit?: number }) {
  const [active, setActive] = useState<(typeof galleryImages)[number] | null>(
    null,
  );
  const images = limit ? galleryImages.slice(0, limit) : galleryImages;

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            className="group relative overflow-hidden rounded-3xl bg-muted text-left shadow-[0_18px_50px_rgba(42,41,36,0.08)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/40"
            onClick={() => setActive(image)}
            aria-label={`Open image: ${image.alt}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={800}
              height={400}
              className="aspect-2/1 w-full object-cover transition duration-500 group-hover:scale-[1.025]"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={index < 2}
            />
            <span className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/90 text-ink opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-visible:opacity-100">
              <Expand className="size-4" />
            </span>
          </button>
        ))}
      </div>

      <Dialog open={Boolean(active)} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="w-[min(96vw,1100px)] max-w-none overflow-hidden border-0 bg-black p-2">
          <DialogTitle className="sr-only">Grooming transformation</DialogTitle>
          <DialogDescription className="sr-only">
            {active?.alt}
          </DialogDescription>
          {active ? (
            <Image
              src={active.src}
              alt={active.alt}
              width={1200}
              height={600}
              className="h-auto w-full rounded-lg object-contain"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
