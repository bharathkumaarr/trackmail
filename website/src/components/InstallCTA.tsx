import Link from "next/link";

export function InstallCTA() {
  return (
    <section id="install" className="mx-auto max-w-5xl px-6 py-16 lg:py-20">
      <div className="rounded-[20px] bg-gradient-to-br from-forest to-forest-dark px-8 py-14 text-center text-white">
        <h2 className="font-display text-3xl font-bold lg:text-4xl">
          Ready to track smarter?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-white/75">
          Free during development. Install locally or from the Chrome Web Store
          when published.
        </p>
        <Link
          href="#"
          className="mt-7 inline-flex items-center justify-center rounded-full bg-gold px-8 py-4 text-base font-semibold text-ink transition hover:bg-gold-hover"
        >
          Add Trackmail to Chrome
        </Link>
        <p className="mt-5 text-[13px] text-white/60">
          Requires Gmail on the web · Manifest V3 · Open source
        </p>
      </div>
    </section>
  );
}
