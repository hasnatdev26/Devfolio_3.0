import type { MetadataRoute } from "next";

const siteUrl = "https://hasnatevan.top";
export const dynamic = "force-static";

function withTrailingSlash(pathname: string) {
  if (pathname === "/") return siteUrl;
  return `${siteUrl}${pathname.endsWith("/") ? pathname : `${pathname}/`}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: withTrailingSlash("/about"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: withTrailingSlash("/projects"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: withTrailingSlash("/contact"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
