import Link from "next/link";
import { DoodleStar } from "./DoodleSVGs";

export function InstallCTA() {
  return (
    <section id="install" className="relative mx-auto max-w-5xl px-6 py-20 lg:py-28">
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-brand via-indigo-600 to-violet-700 px-8 py-16 text-center text-white shadow-[0_24px_50px_-12px_rgba(79,70,229,0.35)] lg:px-16 lg:py-20">
        {/* Ambient Glow Circles */}
        <div className="pointer-events-none absolute -left-12 -top-12 size-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -right-12 size-64 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
            <DoodleStar className="size-3 text-amber-300" />
            <span>Ready in under a minute</span>
          </div>

          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Start tracking smarter today.
          </h2>

          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/80">
            Join thousands of professionals, freelancers, and teams who never wonder
            if their emails got read.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="#"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-brand shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-bounce hover:-translate-y-1 hover:bg-amber-300 hover:text-ink hover:shadow-[0_16px_30px_rgba(0,0,0,0.2)] active:scale-95"
            >
              <span>Add Trackmail to Chrome</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          <p className="mt-6 text-xs text-white/70">
            Works natively inside Gmail on Chrome · Free forever · No credit card needed
          </p>
        </div>
      </div>
    </section>
  );
}
