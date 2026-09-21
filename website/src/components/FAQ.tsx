"use client";

import { useState } from "react";
import { DoodleStar } from "./DoodleSVGs";

const faqs = [
  {
    q: "How does email tracking work?",
    a: "A tiny 1×1 invisible pixel is added to your outgoing email. When the recipient opens the message, their email client fetches the pixel, recording an open event instantly.",
  },
  {
    q: "Do I need a separate app or inbox?",
    a: "Nope! Trackmail lives right inside Gmail's standard compose window. You compose and send emails as usual, with zero workflow interruption.",
  },
  {
    q: "Will the recipient know the email is tracked?",
    a: "No. The tracking pixel is completely invisible and does not alter the text, appearance, or delivery of your email.",
  },
  {
    q: "Is it free to use?",
    a: "Yes! Trackmail is free to install and use with unlimited tracking for your everyday emails.",
  },
  {
    q: "What data do you collect?",
    a: "Only the recipient address and subject line so you can identify your tracked messages in the popup. We never access, read, or store email bodies.",
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
        <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
          <DoodleStar className="size-3 text-amber" />
          <span>Got questions?</span>
        </div>
        <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
          Frequently asked questions
        </h2>
        <p className="mt-3 text-sm text-ink-muted">
          Everything you need to know about Trackmail and how it works.
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
                className="flex w-full items-center justify-between px-6 py-5 text-left font-display text-base font-bold text-ink transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-brand"
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
