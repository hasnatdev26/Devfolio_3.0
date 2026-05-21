import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Navbar from "./Navbar";
import FooterQuickLinks from "./FooterQuickLinks";
import FooterSocialLinks from "./FooterSocialLinks";
import FooterEmailSignup from "./FooterEmailSignup";
import ScrollProgress from "./ScrollProgress";
import FloatingContactButtons from "./FloatingContactButtons";
import "./globals.css";
import "animate.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hasnatevan.top"),
  title: {
    default: "Home | Hasnat Evan",
    template: "%s | Hasnat Evan",
  },
  description:
    "Hasnat Evan's portfolio website showcasing modern web development projects, skills, and contact information.",
  keywords: [
    "Hasnat Evan",
    "Full Stack Developer",
    "Web Developer",
    "Next.js Developer",
    "React Developer",
    "Portfolio",
    "MERN Stack Developer",
    "Freelance Web Developer",
  ],
  applicationName: "Hasnat Evan Portfolio",
  authors: [{ name: "Hasnat Evan", url: "https://hasnatevan.top" }],
  creator: "Hasnat Evan",
  publisher: "Hasnat Evan",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "https://hasnatevan.top",
    title: "Hasnat Evan | Full Stack Web Developer",
    description:
      "Explore Hasnat Evan's portfolio, featured projects, technical skills, and professional contact details.",
    siteName: "Hasnat Evan",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Hasnat Evan Logo",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@hasnatevan",
    creator: "@hasnatevan",
    title: "Hasnat Evan | Full Stack Web Developer",
    description:
      "Explore Hasnat Evan's portfolio, featured projects, technical skills, and professional contact details.",
    images: ["/logo.jpg"],
  },
  verification: {
    google: "Zn-fTaNdtLALK3aJ5MVFrEVuo2Cgch0gq3wIC7cA9c4",
  },
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <ScrollProgress />
        <Navbar />
        <FloatingContactButtons />
        <main className="flex-1 pt-16">{children}</main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 text-sm text-slate-600 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
            <div className="space-y-3 text-left">
              <div className="flex items-center justify-start gap-2">
                <Image
                  src="/logo.jpg"
                  alt="Hasnat.Dev logo"
                  width={52}
                  height={52}
                  className="h-[52px] w-[52px] rounded-full object-cover"
                />
              </div>
              <p>
                I design and develop scalable web applications with clean architecture, strong performance, and intuitive user experiences that help ideas grow into reliable digital products.
              </p>
              <FooterSocialLinks />
            </div>

            <div className="space-y-3 text-left">
              <p className="text-base font-semibold text-slate-900">Quick Links</p>
              <FooterQuickLinks />
            </div>

            <div className="space-y-3 text-left md:col-span-2 lg:col-span-1">
              <p className="text-base font-semibold text-slate-900">Contact</p>
              <div className="space-y-2">
                <p>
                  Email:{" "}
                  <a
                    href="mailto:hasnatevan59@gmail.com"
                    className="inline-block max-w-full truncate align-bottom transition hover:text-slate-900"
                  >
                    hasnatevan59@gmail.com
                  </a>
                </p>
                <p>
                  Mobile:{" "}
                  <a href="tel:+8801814197707" className="transition hover:text-slate-900">
                    +8801814197707
                  </a>
                </p>
                <p>Location: Chittagong, Bangladesh</p>
              </div>
              <div className="pt-3">
                <p className="mb-2 text-base font-semibold text-slate-900">Email Signup</p>
                <FooterEmailSignup />
              </div>
            </div>
            <p className="border-t border-slate-200 pt-4 text-center text-xs sm:text-sm md:col-span-2 lg:col-span-3">
              © 2024 Hasnat Evan. All Rights Reserved.
            </p>
          </div>
        </footer>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  name: "Hasnat Evan",
                  jobTitle: "Full Stack Web Developer",
                  url: "https://hasnatevan.top",
                  email: "mailto:hasnatevan59@gmail.com",
                  telephone: "+8801814197707",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Chittagong",
                    addressCountry: "BD",
                  },
                  sameAs: ["https://facebook.com", "https://linkedin.com", "https://github.com"],
                },
                {
                  "@type": "WebSite",
                  name: "Hasnat Evan Portfolio",
                  url: "https://hasnatevan.top",
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}







