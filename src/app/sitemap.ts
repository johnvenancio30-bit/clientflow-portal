import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://clientflow-portal.vercel.app";
  return [
    { url: baseUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/demo`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/case-study`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/dashboard`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/portal`, changeFrequency: "monthly", priority: 0.7 },
  ];
}
