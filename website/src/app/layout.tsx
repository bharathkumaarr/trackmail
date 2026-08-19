import type { Metadata } from "next";
import { Petrona, Albert_Sans } from "next/font/google";
import "./globals.css";

const petrona = Petrona({
  variable: "--font-petrona",
  subsets: ["latin"],
  weight: ["500", "700"],
  style: ["normal", "italic"],
});

const albertSans = Albert_Sans({
  variable: "--font-albert",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Trackmail — Email Tracker for Gmail",
  description:
    "Track when your Gmail emails are opened — directly inside Gmail. No separate email client.",
  openGraph: {
    title: "Trackmail — Email Tracker for Gmail",
    description:
      "Know when your emails are opened. A Chrome extension that lives inside Gmail.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${petrona.variable} ${albertSans.variable} h-full antialiased`}
    >
      <body className="min-h-full font-body">{children}</body>
    </html>
  );
}
