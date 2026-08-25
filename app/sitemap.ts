import type { MetadataRoute } from "next";

const routes = [
  "",
  "/services",
  "/mobile-services",
  "/gallery",
  "/contact",
  "/book",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((route) => ({
    url: `https://tbottinc.com${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/book" ? 0.9 : 0.8,
  }));
}
