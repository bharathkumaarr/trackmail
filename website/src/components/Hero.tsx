import Link from "next/link";
import { ComposeMock } from "./ComposeMock";
import { DoodleCanvas } from "./DoodleCanvas";
import { ScribbleUnderline, HandDrawnCircle, DoodleStar, PaperPlaneDoodle } from "./DoodleSVGs";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-8 pb-20 lg:pt-14 lg:pb-28">
      {/* Interactive Canvas Background */}
      <DoodleCanvas />

      <div className="relative z-10 mx-auto grid max-w-5xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
        {/* Left Column: Copy & CTAs */}
        <div className="order-2 lg:order-1">
          {/* Top Pill Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-soft/80 px-4 py-1.5 text-xs font-semibold text-brand shadow-xs backdrop-blur-xs transition-bounce hover:scale-105">
            <span className="flex size-2 rounded-full bg-brand animate-ping" />
            <span>Smooth, zero-clutter tracking</span>
            <DoodleStar className="size-3 text-amber" />
          </div>

          <h1 className="font-display text-4xl font-extrabold leading-[1.12] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
            Know when your emails are{" "}
            <span className="relative inline-block text-brand">
              actually
              <ScribbleUnderline className="text-accent" />
            </span>{" "}
            opened.
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-muted">
            A lightweight Chrome extension that lives right inside your normal Gmail
            compose box. Toggle tracking on, click send, and see opens without
            ever leaving your inbox.
          </p>

          {/* CTAs */}
          <div className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:items-center">
            <Link
              href="#install"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-3.5 text-base font-semibold text-white shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)] transition-bounce hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-[0_16px_32px_-5px_rgba(79,70,229,0.5)] active:scale-95"
            >
              <span>Install for Chrome — Free</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>

            <Link
              href="#how"
              className="inline-flex items-center justify-center rounded-full border border-border bg-surface/90 px-6 py-3.5 text-base font-semibold text-ink shadow-xs backdrop-blur-xs transition-smooth hover:border-brand/40 hover:bg-brand-soft hover:text-brand"
            >
              See how it works
            </Link>
          </div>

          {/* Social Proof & Casual Badges */}
          <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-medium text-ink-muted">
            <div className="flex items-center gap-1.5">
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-4 text-emerald-500"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clipRule="evenodd"
                />
              </svg>
              <span>No separate inbox app</span>
            </div>

            <span className="size-1 rounded-full bg-border" />

            <div className="flex items-center gap-1.5">
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-4 text-emerald-500"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clipRule="evenodd"
                />
              </svg>
              <HandDrawnCircle className="text-brand">
                100% private
              </HandDrawnCircle>
            </div>

            <span className="size-1 rounded-full bg-border" />

            <span className="font-doodle text-base font-bold text-amber">
              zero setup ✦
            </span>
          </div>
        </div>

        {/* Right Column: Live Mockup */}
        <div className="order-1 mx-auto w-full lg:order-2">
          <ComposeMock />
        </div>
      </div>
    </section>
  );
}
