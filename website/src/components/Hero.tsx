import Link from "next/link";
import { ComposeMock } from "./ComposeMock";

export function Hero() {
  return (
    <section className="mx-auto grid max-w-5xl items-center gap-12 px-6 pb-20 pt-8 lg:grid-cols-2 lg:gap-16">
      <div className="order-2 lg:order-1">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-terracotta">
          Gmail email tracking
        </p>
        <h1 className="font-display text-4xl font-bold leading-[1.15] tracking-tight text-ink sm:text-5xl lg:text-[3.25rem]">
          Know when your emails
          <br />
          are <em className="italic text-forest">actually</em> opened.
        </h1>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-muted">
          A lightweight Chrome extension that lives inside Gmail. Toggle tracking
          on, send as usual — see opens without leaving your inbox.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="#install"
            className="inline-flex items-center justify-center rounded-full bg-terracotta px-6 py-3 text-[15px] font-semibold text-white shadow-[0_4px_16px_rgba(184,70,42,0.25)] transition hover:-translate-y-0.5 hover:bg-terracotta-hover hover:shadow-[0_8px_24px_rgba(184,70,42,0.3)]"
          >
            Install for Chrome — Free
          </Link>
          <Link
            href="#how"
            className="inline-flex items-center justify-center rounded-full border-[1.5px] border-ink/10 px-6 py-3 text-[15px] font-semibold text-ink transition hover:border-ink-muted hover:bg-surface"
          >
            See how it works
          </Link>
        </div>
        <p className="mt-6 text-[13px] text-ink-faint">
          Works with Gmail on the web · No separate email app · $0 to start
        </p>
      </div>

      <div className="order-1 mx-auto w-full max-w-md lg:order-2 lg:max-w-none">
        <ComposeMock />
      </div>
    </section>
  );
}
