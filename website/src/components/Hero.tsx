import Link from "next/link";
import { ComposeMock } from "./ComposeMock";
import {
  ScribbleUnderline,
  HandDrawnOval,
  Highlighter,
} from "./DoodleSVGs";
import { TrackmailLogoIcon } from "./TrackmailLogo";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-6 pb-16 sm:pt-8 sm:pb-20 lg:pt-14 lg:pb-28">
      <div className="relative z-10 mx-auto grid max-w-5xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        {/* Headline Part: Copy & CTAs (Appears FIRST on mobile) */}
        <div className="order-1 min-w-0 w-full">
          {/* Top Pill Badge with Oval & Highlighter - Single Line */}
          <div className="mb-5 sm:mb-6 inline-flex max-w-full items-center gap-2 overflow-x-auto scrollbar-none rounded-full border border-border/80 bg-surface/90 px-3 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-medium text-ink shadow-xs backdrop-blur-xs transition-bounce hover:scale-[1.02] whitespace-nowrap select-none">
            <TrackmailLogoIcon className="size-4 shrink-0 sm:size-4.5 rounded-md shadow-xs" />
            <HandDrawnOval className="shrink-0 text-brand font-bold">
              100% stealth
            </HandDrawnOval>
            <span className="shrink-0 text-border">·</span>
            <span className="shrink-0">
              <span className="hidden sm:inline">Zero signatures or badges — </span>
              <Highlighter color="bg-amber-200/90">they'll never know</Highlighter>
            </span>
          </div>

          <h1 className="font-display text-3xl font-extrabold leading-[1.14] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
            Know when your emails are{" "}
            <span className="relative inline-block text-brand">
              actually
              <ScribbleUnderline className="text-accent" />
            </span>{" "}
            opened.
          </h1>

          <p className="mt-4 sm:mt-5 max-w-lg text-base sm:text-lg leading-relaxed text-ink-muted">
            Lives right inside Gmail. Just flip the toggle, hit send, and see who opened
            your email without ever leaving your inbox.
          </p>

          {/* CTAs - Stacked on phone, side-by-side on tablet/desktop */}
          <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row sm:items-center gap-3">
            <Link
              href="#install"
              className="group inline-flex w-full sm:w-auto shrink-0 whitespace-nowrap items-center justify-center gap-2.5 rounded-full bg-brand px-5 py-3.5 sm:px-6 sm:py-3.5 text-sm sm:text-base font-semibold text-white shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)] transition-bounce hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-[0_16px_32px_-5px_rgba(79,70,229,0.5)] active:scale-95 select-none"
            >
              <TrackmailLogoIcon className="size-5 shrink-0 rounded-md" />
              <span>Install for Chrome</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>

            <Link
              href="#how"
              className="inline-flex w-full sm:w-auto shrink-0 whitespace-nowrap items-center justify-center rounded-full border border-border bg-surface/90 px-5 py-3 sm:px-6 sm:py-3.5 text-sm sm:text-base font-semibold text-ink shadow-xs backdrop-blur-xs transition-smooth hover:border-brand/40 hover:bg-brand-soft hover:text-brand select-none"
            >
              See how it works
            </Link>
          </div>

          {/* Social Proof & Casual Badges */}
          <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-ink-muted select-none">
            <div className="flex items-center gap-1.5 shrink-0">
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-4 shrink-0 text-emerald-500"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clipRule="evenodd"
                />
              </svg>
              <span>No separate inbox app</span>
            </div>

            <span className="hidden sm:inline-block size-1 rounded-full bg-border" />

            <div className="flex items-center gap-1.5 shrink-0">
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-4 shrink-0 text-emerald-500"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                  clipRule="evenodd"
                />
              </svg>
              <span>100% private</span>
            </div>

            <span className="hidden sm:inline-block size-1 rounded-full bg-border" />

            <span className="font-doodle text-sm sm:text-base font-bold text-amber shrink-0">
              zero setup ✦
            </span>
          </div>
        </div>

        {/* Illustration Part: Live Mockup (Appears SECOND on mobile, right column on desktop) */}
        <div className="order-2 min-w-0 mx-auto w-full">
          <ComposeMock />
        </div>
      </div>
    </section>
  );
}
