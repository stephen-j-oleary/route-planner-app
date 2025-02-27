import type { MetadataRoute } from "next";

import pages from "@/pages";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://loopmapping.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE_URL}${pages.root}`,
      priority: 1,
      lastModified: new Date(),
      changeFrequency: "weekly",
    },
    {
      url: `${BASE_URL}${pages.plans}`,
      priority: 0.9,
      lastModified: new Date(),
      changeFrequency: "weekly",
    },
    {
      url: `${BASE_URL}${pages.contact}`,
      priority: 0.6,
      lastModified: new Date(),
      changeFrequency: "weekly",
    },
    {
      url: `${BASE_URL}${pages.login}`,
      priority: 0.5,
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
    {
      url: `${BASE_URL}${pages.cookies}`,
      priority: 0.5,
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
    {
      url: `${BASE_URL}${pages.privacy}`,
      priority: 0.5,
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
  ];
}