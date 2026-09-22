"use client";

import { useState } from "react";
import { HandDrawnArrow, DoodleStar } from "./DoodleSVGs";
import { TrackmailLogoIcon } from "./TrackmailLogo";

export function ComposeMock() {
  const [isTracked, setIsTracked] = useState(true);
  const [openCount, setOpenCount] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative mx-auto w-full max-w-lg select-none">
      {/* Hand-drawn arrow pointing to toggle */}
      <div className="pointer-events-none absolute -bottom-10 -left-16 z-20 hidden items-center gap-2 lg:flex">
        <HandDrawnArrow className="size-16 -rotate-12 text-accent" />
        <span className="font-doodle text-xl font-bold -rotate-6 text-accent">
          click here to test!
        </span>
      </div>

      {/* Floating status card badge */}
      <div className="animate-float absolute -right-4 -top-6 z-20 hidden rounded-2xl border border-border bg-surface px-3.5 py-2 shadow-[0_16px_32px_rgba(0,0,0,0.08)] sm:flex items-center gap-2.5 select-none">
        <TrackmailLogoIcon className="size-5 rounded-md shadow-xs" />
        <span className="relative flex size-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
        </span>
        <p className="text-xs font-semibold text-ink">Live Open Tracker</p>
      </div>

      {/* Main Compose Card */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative overflow-hidden rounded-[24px] border border-border/80 bg-surface shadow-[0_24px_60px_-15px_rgba(79,70,229,0.12)] transition-smooth hover:shadow-[0_32px_70px_-12px_rgba(79,70,229,0.18)]"
      >
        {/* Window Topbar */}
        <div className="flex items-center justify-between border-b border-border/60 bg-canvas-subtle/70 px-3 sm:px-4 py-2.5 sm:py-3 select-none">
          <div className="flex items-center gap-2">
            <span className="size-2.5 sm:size-3 rounded-full bg-rose-400" />
            <span className="size-2.5 sm:size-3 rounded-full bg-amber-400" />
            <span className="size-2.5 sm:size-3 rounded-full bg-emerald-400" />
            <span className="ml-1.5 sm:ml-2 text-xs font-medium text-ink-faint">
              New Message
            </span>
          </div>
          <span className="rounded-full bg-brand-soft px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-brand select-none">
            Interactive Preview
          </span>
        </div>

        {/* Email Header */}
        <div className="px-4 sm:px-6 pt-3 sm:pt-4">
          <div className="flex items-center gap-2 sm:gap-3 border-b border-border/60 py-2 sm:py-2.5 text-xs sm:text-sm">
            <span className="w-12 sm:w-14 text-xs font-medium text-ink-faint shrink-0">To</span>
            <span className="font-medium text-ink truncate">sarah@designstudio.io</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 border-b border-border/60 py-2 sm:py-2.5 text-xs sm:text-sm">
            <span className="w-12 sm:w-14 text-xs font-medium text-ink-faint shrink-0">Subject</span>
            <span className="font-medium text-ink truncate">
              Quick follow-up on project proposal ✦
            </span>
          </div>

          {/* Email Body */}
          <div className="py-3 sm:py-4 text-xs sm:text-sm leading-relaxed text-ink-muted">
            <p>Hey Sarah,</p>
            <p className="mt-2">
              Just checking in to see if you had a chance to look over the proposal
              we discussed yesterday. Excited to collaborate!
            </p>
          </div>

          {/* Compose Bottom Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 py-2.5 sm:py-3.5">
            <div className="flex items-center gap-2">
              {/* Send Button */}
              <button
                type="button"
                onClick={() => setOpenCount((prev) => prev + 1)}
                className="flex items-center gap-1.5 rounded-full bg-brand px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-white shadow-sm transition-bounce hover:bg-brand-hover active:scale-95 cursor-pointer select-none"
              >
                <span>Send</span>
                <span className="text-[10px] opacity-80">⌘Enter</span>
              </button>

              {/* TRACK EMAIL TOGGLE - Interactive! */}
              <button
                type="button"
                onClick={() => setIsTracked(!isTracked)}
                className={`group flex cursor-pointer items-center gap-1.5 sm:gap-2 rounded-full border px-2.5 py-1.5 sm:px-3 text-xs font-medium transition-smooth select-none ${
                  isTracked
                    ? "border-brand/40 bg-brand-soft text-brand font-semibold shadow-xs"
                    : "border-border bg-canvas hover:bg-canvas-subtle text-ink-muted"
                }`}
              >
                <span
                  className={`flex size-3.5 sm:size-4 items-center justify-center rounded transition-smooth ${
                    isTracked ? "bg-brand text-white" : "border border-ink-faint bg-white"
                  }`}
                >
                  {isTracked && (
                    <svg viewBox="0 0 14 14" fill="none" className="size-2.5 sm:size-3 stroke-white stroke-2">
                      <path d="M3 7.5L5.5 10L11 4.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="flex items-center gap-1 text-xs">
                  Track email
                  <TrackmailLogoIcon className="size-3.5 rounded-xs" />
                </span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 text-ink-faint text-xs">
              <span>Font</span>
              <span className="size-1 rounded-full bg-border" />
              <span role="img" aria-label="attachment">
                🔗
              </span>
            </div>
          </div>
        </div>

        {/* Live Open Notification Toast */}
        <div
          className={`mx-3 sm:mx-6 mb-4 sm:mb-6 rounded-xl sm:rounded-2xl border transition-smooth ${
            isTracked
              ? "border-brand/30 bg-brand-soft shadow-xs"
              : "border-border/60 bg-canvas-subtle/50 opacity-60"
          } p-3 sm:p-4`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-xs sm:text-sm font-semibold text-ink truncate">
                  Quick follow-up on project proposal ✦
                </span>
              </div>
              <p className="mt-0.5 text-[11px] sm:text-xs text-ink-faint truncate">sarah@designstudio.io</p>
            </div>

            <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-brand/20 bg-brand-soft px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-brand whitespace-nowrap select-none">
              <TrackmailLogoIcon className="size-3 shrink-0 rounded-xs" />
              <span>{isTracked ? "Trackmail Active" : "Off"}</span>
            </span>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-1 border-t border-border/40 pt-2">
            <span className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-emerald-600">
              <span className="size-1.5 sm:size-2 rounded-full bg-emerald-500" />
              {isTracked ? (
                <span>👁 Opened {openCount > 1 ? `${openCount} times` : "just now"} · 10:42 AM</span>
              ) : (
                <span className="text-ink-faint">Tracking disabled</span>
              )}
            </span>
            <span className="text-[10px] sm:text-[11px] text-ink-faint">via Gmail</span>
          </div>
        </div>
      </div>
    </div>
  );
}
