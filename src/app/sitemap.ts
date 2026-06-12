import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://3rd-space-peach.vercel.app";

  const routes = [
    "",
    "/about",
    "/menu",
    "/store",
    "/events",
    "/gallery",
    "/bulletin",
    "/vouchers",
    "/events/lounge",
    "/events/tarot-thursday",
    "/events/tattoo-anniversary",
    "/events/cozy-venture",
    "/events/food",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));
}
