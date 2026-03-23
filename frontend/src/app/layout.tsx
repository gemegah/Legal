import "./globals.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Playfair_Display, DM_Sans } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LegalOS",
    template: "%s | LegalOS",
  },
  description:
    "Ghana-first legal practice management for cases, deadlines, billing, documents, and review-first AI assistance.",
  applicationName: "LegalOS",
  metadataBase: new URL("https://legalos.local"),
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "LegalOS",
    description:
      "A Ghana-first legal operating system for cases, audit-ready work, and faster billing.",
    siteName: "LegalOS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LegalOS",
    description:
      "A Ghana-first legal operating system for cases, audit-ready work, and faster billing.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b2d1e",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="app-root">{children}</body>
    </html>
  );
}
