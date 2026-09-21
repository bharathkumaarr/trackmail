import Link from "next/link";
import { DoodleStar } from "./DoodleSVGs";
import { TrackmailLogoIcon } from "./TrackmailLogo";

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-canvas py-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <TrackmailLogoIcon className="size-7.5 rounded-lg shadow-xs" />
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
