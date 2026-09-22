import Link from "next/link";
import { DoodleStar } from "./DoodleSVGs";
import { TrackmailLogoIcon } from "./TrackmailLogo";

export function InstallCTA() {
  return (
    <section id="install" className="relative mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-20 lg:py-28">
      <div className="relative overflow-hidden rounded-[22px] sm:rounded-[28px] bg-ink px-5 py-12 sm:px-8 sm:py-16 text-center text-white border border-ink/20 shadow-[0_20px_40px_rgba(15,23,42,0.15)] lg:px-16 lg:py-20">
        <div className="relative z-10">
          <div className="mx-auto mb-5 sm:mb-6 flex size-12 sm:size-14 items-center justify-center rounded-2xl bg-white/10 p-2 sm:p-2.5 backdrop-blur-xs border border-white/15 shadow-[0_8px_24px_rgba(79,70,229,0.35)]">
            <TrackmailLogoIcon className="size-8 sm:size-9 rounded-xl shadow-xs" />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 sm:px-4 py-1.5 text-[11px] sm:text-xs font-semibold text-white select-none">
            <DoodleStar className="size-3 text-amber-400" />
            <span>Ready in under a minute</span>
          </div>

          <h2 className="mt-4 sm:mt-5 font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Start tracking smarter today.
          </h2>

          <p className="mx-auto mt-3 sm:mt-4 max-w-md text-sm sm:text-base leading-relaxed text-slate-300">
            Stop guessing if your pitch or follow-up got seen. Takes 20 seconds to set up,
            zero credit card needed, no catch.
          </p>

          <div className="mt-7 sm:mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="#"
              className="group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-brand px-6 py-3.5 sm:px-8 sm:py-4 text-sm sm:text-base font-bold text-white shadow-sm transition-bounce hover:-translate-y-1 hover:bg-brand-hover active:scale-95 select-none"
            >
              <TrackmailLogoIcon className="size-5 rounded-md" />
              <span>Add Trackmail to Chrome</span>
              <span className="transition-transform duration-500 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          <p className="mt-5 sm:mt-6 text-[11px] sm:text-xs text-slate-400 max-w-sm sm:max-w-none mx-auto leading-relaxed">
            Works right inside your regular Gmail · 100% free · Zero credit card required
          </p>
        </div>
      </div>
    </section>
  );
}
