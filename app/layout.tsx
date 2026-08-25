import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://tbottinc.com"),
  title: {
    default: "The Bark of the Town | Chicago Dog Grooming",
    template: "%s | The Bark of the Town",
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    title: "The Bark of the Town",
    description: site.description,
    url: "https://tbottinc.com",
    siteName: site.name,
    locale: "en_US",
    type: "website",
    images: [{ url: "/images/gallery/1.jpg", width: 800, height: 400 }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: ["/images/gallery/1.jpg"],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "PetGrooming",
  name: site.legalName,
  url: "https://tbottinc.com",
  image: "https://tbottinc.com/images/logo.png",
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
