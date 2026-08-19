"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-ink/10 bg-parchment/90 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight text-forest"
        >
          Trackmail
        </Link>
        <Link
          href="#install"
          className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-surface transition hover:-translate-y-px hover:bg-forest"
        >
          Add to Chrome
        </Link>
      </nav>
    </header>
  );
}
