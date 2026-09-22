import { PaperPlaneDoodle, DoodleStar } from "./DoodleSVGs";

const steps = [
  {
    num: "01",
    title: "Add to Chrome",
    description: "Install the extension in one click and sign in seamlessly with Google.",
    tag: "30 seconds",
  },
  {
    num: "02",
    title: "Toggle in Compose",
    description: "Look beside Gmail's Send button and turn 'Track email' on whenever you want.",
    tag: "1-click toggle",
  },
  {
    num: "03",
    title: "Send normally",
    description: "Gmail sends your email exactly as usual — 100% stealth, no signatures, no tags.",
    tag: "zero friction",
  },
  {
    num: "04",
    title: "See who read it",
    description: "Watch open times and view counts update live in your extension popup.",
    tag: "instant updates",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-16 sm:py-20 lg:py-28 bg-canvas-subtle/50 border-y border-border/60">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber/30 bg-amber-soft px-3 py-1 text-xs font-semibold text-amber select-none">
            <DoodleStar className="size-3 text-amber" />
            <span>Effortless workflow</span>
          </div>
          <h2 className="mt-3 font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink">
            How it works
          </h2>
          <p className="mt-3 max-w-md text-xs sm:text-sm text-ink-muted">
            Four simple steps. No complicated onboarding, no tutorials needed.
          </p>
        </div>

        {/* Steps Cards */}
        <div className="mt-10 sm:mt-14 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <div
              key={step.title}
              className="group relative flex flex-col justify-between rounded-[20px] sm:rounded-[22px] border border-border/80 bg-surface p-5 sm:p-6 shadow-xs transition-bounce hover:-translate-y-2 hover:border-brand/40 hover:shadow-[0_16px_32px_-10px_rgba(79,70,229,0.12)]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl font-black text-brand/30 transition-smooth group-hover:text-brand">
                    {step.num}
                  </span>
                  <span className="rounded-full bg-canvas-subtle px-2.5 py-0.5 text-[11px] font-medium text-ink-muted select-none">
                    {step.tag}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-lg font-bold text-ink transition-smooth group-hover:text-brand">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-3">
                <span className="font-doodle text-sm font-semibold text-accent">
                  Step {idx + 1}
                </span>
                {idx === 2 && <PaperPlaneDoodle className="size-8 text-brand/70" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
