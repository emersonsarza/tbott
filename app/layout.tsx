import type { Metadata } from "next";
import { Suspense } from "react";
import { Fraunces, Manrope } from "next/font/google";

import { ShowcaseBanner } from "@/components/showcase-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";
import { site } from "@/lib/site-content";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

/** Canonical production host; override with NEXT_PUBLIC_SITE_URL on showcase (by1002). */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://tbottinc.com";

const ogImage = {
  url: "/images/og.png",
  width: 1200,
  height: 630,
  alt: "The Bark of the Town — Chicago dog grooming",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "The Bark of the Town | Chicago Dog Grooming",
    template: "%s | The Bark of the Town",
  },
  description: site.description,
  applicationName: site.name,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  alternates: { canonical: "/" },
  openGraph: {
    title: "The Bark of the Town | Chicago Dog Grooming",
    description: site.description,
    url: siteUrl,
    siteName: site.name,
    locale: "en_US",
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Bark of the Town | Chicago Dog Grooming",
    description: site.description,
    images: [ogImage.url],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "PetGrooming",
  name: site.legalName,
  url: siteUrl,
  image: `${siteUrl}/images/og.png`,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: "US",
  },
  sameAs: [site.instagram],
  priceRange: "$$",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${fraunces.variable}`}>
      <body className="min-h-screen">
        <a
          href="#main-content"
          className="fixed left-4 top-3 z-100 -translate-y-24 rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white transition focus:translate-y-0"
        >
          Skip to content
        </a>
        <Suspense fallback={null}>
          <ShowcaseBanner />
        </Suspense>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <Toaster richColors position="top-center" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
