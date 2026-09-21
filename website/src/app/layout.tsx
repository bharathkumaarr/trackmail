import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, Caveat } from "next/font/google";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "Trackmail — Smooth, Simple Gmail Email Tracking",
  description:
    "Know when your emails are actually opened — directly inside Gmail. Zero clutter, buttery smooth, completely private.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Trackmail — Email Tracker for Gmail",
    description:
      "Know when your emails get read. A sleek Chrome extension that lives right inside Gmail.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${plusJakarta.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full font-body text-ink selection:bg-brand-light selection:text-brand">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
