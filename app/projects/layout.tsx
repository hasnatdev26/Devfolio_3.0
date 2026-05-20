import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore featured projects by Hasnat Evan, including modern full-stack applications built with React, Next.js, Node.js, and MongoDB.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects | Hasnat Evan",
    description:
      "Case studies and selected full-stack projects by Hasnat Evan.",
    url: "https://hasnatevan.top/projects",
    type: "website",
    images: ["/logo.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Hasnat Evan",
    description:
      "Case studies and selected full-stack projects by Hasnat Evan.",
    images: ["/logo.jpg"],
  },
};

export default function ProjectsLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return children;
}
