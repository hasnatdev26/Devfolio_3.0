import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about Hasnat Evan, a MERN stack developer focused on scalable architecture, modern UI, and performance-driven web apps.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About | Hasnat Evan",
    description:
      "Professional background, education, and development journey of Hasnat Evan.",
    url: "https://hasnatevan.top/about",
    type: "profile",
    images: ["/logo.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Hasnat Evan",
    description:
      "Professional background, education, and development journey of Hasnat Evan.",
    images: ["/logo.jpg"],
  },
};

export default function AboutLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return children;
}
