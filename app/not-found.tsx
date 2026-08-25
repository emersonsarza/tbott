import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <section className="site-container grid min-h-[65vh] items-center gap-10 py-16 text-center lg:grid-cols-2 lg:text-left">
      <div>
        <p className="eyebrow">404 · Lost scent</p>
        <h1 className="mt-4 text-balance font-heading text-5xl font-semibold tracking-[-0.045em] sm:text-7xl">
          This page wandered off.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
          The page you’re looking for doesn’t exist, but there are plenty of
          good dogs waiting back at home.
        </p>
        <Link
          href="/"
          className={cn(buttonVariants({ size: "lg" }), "mt-8 h-12 px-6")}
        >
          <ArrowLeft /> Back home
        </Link>
      </div>
      <Image
        src="/images/logo.png"
        alt="The Bark of the Town poodle looking in a mirror"
        width={440}
        height={440}
        className="mx-auto w-full max-w-sm object-contain"
      />
    </section>
  );
}
