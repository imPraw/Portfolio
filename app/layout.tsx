import type { Metadata, Viewport } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import { person } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const geist = localFont({ src: "./fonts/geist.woff2", variable: "--font-geist", weight: "100 900", display: "swap" });
const mono = localFont({ src: "./fonts/geist-mono.woff2", variable: "--font-mono", weight: "100 900", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: "Praw — Pratyush Halwai",
  description: person.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Praw — Pratyush Halwai",
    description: person.description,
    url: "/",
    siteName: "Praw",
    type: "website",
    images: [{ url: "/media/social.jpg", width: 1200, height: 630, alt: "Pratyush Halwai against an eclipse skyline" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Praw — Pratyush Halwai",
    description: person.description,
    images: ["/media/social.jpg"],
  },
};

export const viewport: Viewport = { themeColor: "#100e15" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        <Script id="portfolio-theme" strategy="beforeInteractive">
          {`try { if (localStorage.getItem('praw-theme') === 'light') document.documentElement.dataset.theme = 'light'; } catch {}`}
        </Script>
        {children}
      </body>
    </html>
  );
}
