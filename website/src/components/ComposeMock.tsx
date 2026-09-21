"use client";

import { useState } from "react";
import { HandDrawnArrow, DoodleStar } from "./DoodleSVGs";

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
      <div className="animate-float absolute -right-4 -top-6 z-20 hidden rounded-2xl border border-border bg-surface p-3.5 shadow-[0_16px_32px_rgba(0,0,0,0.08)] backdrop-blur-md sm:flex items-center gap-3">
        <span className="relative flex size-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex size-3 rounded-full bg-emerald-500" />
        </span>
        <div>
          <p className="text-xs font-semibold text-ink">Live Open Tracker</p>
          <p className="text-[11px] text-ink-muted">Tracking 1×1 pixel active</p>
        </div>
      </div>

      {/* Main Compose Card */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative overflow-hidden rounded-[24px] border border-border/80 bg-surface shadow-[0_24px_60px_-15px_rgba(79,70,229,0.12)] transition-smooth hover:shadow-[0_32px_70px_-12px_rgba(79,70,229,0.18)]"
      >
        {/* Window Topbar */}
        <div className="flex items-center justify-between border-b border-border/60 bg-canvas-subtle/70 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-rose-400" />
            <span className="size-3 rounded-full bg-amber-400" />
            <span className="size-3 rounded-full bg-emerald-400" />
            <span className="ml-2 text-xs font-medium text-ink-faint">
              New Message
            </span>
          </div>
          <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-semibold text-brand">
            Interactive Preview
          </span>
        </div>

        {/* Email Header */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-3 border-b border-border/60 py-2.5 text-sm">
            <span className="w-14 text-xs font-medium text-ink-faint">To</span>
            <span className="font-medium text-ink">sarah@designstudio.io</span>
          </div>
          <div className="flex items-center gap-3 border-b border-border/60 py-2.5 text-sm">
            <span className="w-14 text-xs font-medium text-ink-faint">Subject</span>
            <span className="font-medium text-ink">
              Quick follow-up on project proposal ✦
            </span>
          </div>

          {/* Email Body */}
          <div className="py-4 text-sm leading-relaxed text-ink-muted">
            <p>Hey Sarah,</p>
            <p className="mt-2">
              Just checking in to see if you had a chance to look over the proposal
              we discussed yesterday. Excited to collaborate!
            </p>
          </div>

          {/* Compose Bottom Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 py-3.5">
            <div className="flex items-center gap-2">
              {/* Send Button */}
              <button
                type="button"
                onClick={() => setOpenCount((prev) => prev + 1)}
                className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white shadow-sm transition-bounce hover:bg-brand-hover active:scale-95"
              >
                <span>Send</span>
                <span className="text-[10px] opacity-80">⌘Enter</span>
              </button>

              {/* TRACK EMAIL TOGGLE - Interactive! */}
              <button
                type="button"
                onClick={() => setIsTracked(!isTracked)}
                className={`group flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-smooth ${
                  isTracked
                    ? "border-brand/40 bg-brand-soft text-brand font-semibold shadow-xs"
                    : "border-border bg-canvas hover:bg-canvas-subtle text-ink-muted"
                }`}
              >
                <span
                  className={`flex size-4 items-center justify-center rounded transition-smooth ${
                    isTracked ? "bg-brand text-white" : "border border-ink-faint bg-white"
                  }`}
                >
                  {isTracked && (
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-3"
                    >
                      <polyline points="3 8 6.5 12 13 4" />
                    </svg>
                  )}
                </span>
                <span>{isTracked ? "Track email ✓" : "Track email"}</span>
              </button>
            </div>

            {/* Fake formatting buttons */}
            <div className="flex items-center gap-1.5 text-ink-faint">
              <span className="flex size-7 items-center justify-center rounded-md hover:bg-canvas text-xs font-bold">
                Aa
              </span>
              <span className="flex size-7 items-center justify-center rounded-md hover:bg-canvas text-xs">
                📎
              </span>
              <span className="flex size-7 items-center justify-center rounded-md hover:bg-canvas text-xs">
                🔗
              </span>
            </div>
          </div>
        </div>

        {/* Live Open Notification Toast */}
        <div
          className={`mx-6 mb-6 rounded-2xl border transition-smooth ${
            isTracked
              ? "border-brand/20 bg-gradient-to-r from-brand-soft/80 to-amber-soft/40 shadow-xs"
              : "border-border/60 bg-canvas-subtle/50 opacity-60"
          } p-4`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-semibold text-ink">
                  Quick follow-up on project proposal ✦
                </span>
              </div>
              <p className="mt-0.5 text-xs text-ink-faint">sarah@designstudio.io</p>
            </div>

            <span className="flex items-center gap-1 text-xs font-semibold text-brand">
              <DoodleStar className="size-3.5 text-amber" />
              {isTracked ? "Active" : "Off"}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2.5">
            <span className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
              <span className="size-2 rounded-full bg-emerald-500" />
              {isTracked ? (
                <>👁 Opened {openCount > 1 ? `${openCount} times` : "just now"} · 10:42 AM</>
              ) : (
                <span className="text-ink-faint">Tracking disabled</span>
              )}
            </span>
            <span className="text-[11px] text-ink-faint">via Gmail</span>
          </div>
        </div>
      </div>
    </div>
  );
}
