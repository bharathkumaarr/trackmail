import Link from "next/link";
import { DoodleStar } from "./DoodleSVGs";

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-canvas py-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-brand text-white shadow-xs">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </span>
          <span className="font-display text-lg font-bold text-ink">
            Trackmail
          </span>
          <DoodleStar className="size-3 text-amber" />
        </div>

        {/* Links */}
        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-ink-muted">
          <Link
            href="#how"
            className="transition-smooth hover:text-brand"
          >
            How it works
          </Link>
          <Link
            href="#features"
            className="transition-smooth hover:text-brand"
          >
            Features
          </Link>
          <Link
            href="#faq"
            className="transition-smooth hover:text-brand"
          >
            FAQ
          </Link>
          <Link
            href="#install"
            className="transition-smooth hover:text-brand"
          >
            Install
          </Link>
        </nav>

        {/* Copyright */}
        <p className="text-xs text-ink-faint">
          © {new Date().getFullYear()} Trackmail. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
