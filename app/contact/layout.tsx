import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Hasnat Evan for freelance MERN stack development, web app maintenance, UI improvements, and full-stack project collaboration.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact | Hasnat Evan",
    description:
      "Get in touch with Hasnat Evan for your next web project and technical consultation.",
    url: "https://hasnatevan.top/contact",
    type: "website",
    images: ["/logo.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Hasnat Evan",
    description:
      "Get in touch with Hasnat Evan for your next web project and technical consultation.",
    images: ["/logo.jpg"],
  },
};

export default function ContactLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return children;
}
