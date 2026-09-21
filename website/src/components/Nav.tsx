"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DoodleStar } from "./DoodleSVGs";
import { TrackmailLogoIcon } from "./TrackmailLogo";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/80 bg-canvas/85 shadow-[0_4px_20px_rgba(0,0,0,0.03)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-display text-2xl font-bold tracking-tight text-ink transition-smooth"
        >
          <TrackmailLogoIcon className="size-8.5 rounded-xl shadow-[0_2px_10px_rgba(79,70,229,0.35)] transition-smooth group-hover:rotate-6 group-hover:scale-105" />
          <span className="flex items-center gap-1">
            Trackmail
            <DoodleStar className="size-3.5 text-amber opacity-90 transition-transform duration-300 group-hover:rotate-45 group-hover:scale-125" />
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="#how"
            className="hidden text-sm font-medium text-ink-muted transition-smooth hover:text-brand sm:block"
          >
            How it works
          </Link>
          <Link
            href="#features"
            className="hidden text-sm font-medium text-ink-muted transition-smooth hover:text-brand sm:block"
          >
            Features
          </Link>
          <Link
            href="#faq"
            className="hidden text-sm font-medium text-ink-muted transition-smooth hover:text-brand sm:block"
          >
            FAQ
          </Link>

          <Link
            href="#install"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-bounce hover:-translate-y-0.5 hover:bg-brand hover:shadow-[0_8px_20px_rgba(79,70,229,0.35)]"
          >
            <span>Add to Chrome</span>
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
