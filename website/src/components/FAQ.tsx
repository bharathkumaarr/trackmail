"use client";

import { useState } from "react";
import { DoodleStar } from "./DoodleSVGs";

const faqs = [
  {
    q: "Is it completely free? What's the catch?",
    a: "Honestly, there's no catch. It's 100% free to use as of right now while we build and polish things. If demand keeps blowing up and server costs grow, we might roll out a premium tier down the road for heavy power users — but for now, enjoy unlimited tracking on the house.",
  },
  {
    q: "Do I have to switch to another email app?",
    a: "Heck no. We hate switching apps too. Trackmail sits right inside your regular Gmail compose window. You write, format, and hit send exactly like you always do.",
  },
  {
    q: "Will people know I'm tracking their email?",
    a: "Nope, totally stealth. It's completely invisible to recipients — zero signatures, zero watermarks, zero badges. Your email looks 100% normal.",
  },
  {
    q: "Are you guys reading my emails?",
    a: "Zero chance. We don't read, store, or even look at what's inside your email body. We only keep the recipient address and subject line so you can tell which email got opened in your popup. That's literally it.",
  },
  {
    q: "How accurate is the open tracking?",
    a: "Pretty darn accurate for real opens! Just keep in mind that sometimes Gmail's image proxy or corporate spam filters pre-load images, which might trigger an instant open ping. But if you see 3x or 4x opens over a couple days, someone is definitely re-reading your email.",
  },
];

export function FAQ() {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggle = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section id="faq" className="mx-auto max-w-4xl px-6 py-20 lg:py-28">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-soft px-3 py-1 text-xs font-semibold text-brand select-none">
          <DoodleStar className="size-3 text-amber" />
          <span>Got questions?</span>
        </div>
        <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
          Frequently asked questions
        </h2>
        <p className="mt-3 text-sm text-ink-muted">
          All the straight-up answers, no corporate fluff.
        </p>
      </div>

      <div className="mt-12 flex flex-col gap-3.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIndexes.includes(idx);
          return (
            <div
              key={faq.q}
              className={`overflow-hidden rounded-[20px] border bg-surface transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isOpen
                  ? "border-brand/40 shadow-[0_12px_28px_rgba(79,70,229,0.06)]"
                  : "border-border/80 hover:border-brand/30"
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="flex w-full items-center justify-between px-6 py-5 text-left font-display text-base font-bold text-ink transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-brand select-none cursor-pointer"
              >
                <span>{faq.q}</span>
                <span
                  className={`flex size-7 items-center justify-center rounded-full text-base font-semibold text-brand transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isOpen
                      ? "rotate-45 bg-brand-soft"
                      : "rotate-0 bg-canvas-subtle"
                  }`}
                >
                  +
                </span>
              </button>

              {/* Smooth Slower Accordion Collapse/Expand via CSS Grid */}
              <div
                className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-border/40 px-6 pb-6 pt-3 text-sm leading-relaxed text-ink-muted">
                    <p>{faq.a}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
