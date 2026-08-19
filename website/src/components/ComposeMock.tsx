export function ComposeMock() {
  return (
    <div
      className="overflow-hidden rounded-[20px] border border-ink/10 bg-surface shadow-[0_24px_48px_rgba(28,24,20,0.08)] lg:rotate-1"
      aria-hidden
    >
      <div className="flex gap-1.5 border-b border-ink/10 bg-parchment-warm px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#d4a574]" />
        <span className="size-2.5 rounded-full bg-gold" />
        <span className="size-2.5 rounded-full bg-[#7a9b76]" />
      </div>

      <div className="px-6 pb-4 pt-5">
        <div className="flex gap-4 border-b border-ink/10 pb-2 text-sm">
          <span className="min-w-12 text-ink-faint">To</span>
          <span className="text-ink-muted">alex@company.com</span>
        </div>
        <div className="mt-2 flex gap-4 border-b border-ink/10 pb-2 text-sm">
          <span className="min-w-12 text-ink-faint">Subject</span>
          <span className="text-ink-muted">Follow-up on proposal</span>
        </div>
        <p className="my-4 text-sm leading-relaxed text-ink-muted">
          Hi Alex, just checking in on the proposal we sent last week…
        </p>
        <div className="flex items-center justify-between border-t border-ink/10 pt-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-forest">
            <input type="checkbox" checked disabled className="accent-forest" />
            Track email ✓
          </label>
          <span className="rounded-md bg-forest px-4 py-1.5 text-sm font-semibold text-white">
            Send
          </span>
        </div>
      </div>

      <div className="mx-6 mb-6 rounded-xl border-l-[3px] border-gold bg-parchment-warm px-5 py-4">
        <p className="font-display text-[15px] font-semibold">
          Follow-up on proposal
        </p>
        <p className="mt-1 text-xs text-ink-faint">alex@company.com</p>
        <p className="mt-2 text-sm font-semibold text-forest">
          👁 Opened · 10:42 PM
        </p>
      </div>
    </div>
  );
}
