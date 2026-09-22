import { DoodleStar } from "./DoodleSVGs";

const features = [
  {
    num: "01",
    badge: "Native Gmail",
    title: "Lives directly in your inbox",
    description:
      "No clunky secondary dashboard or external web client. Compose, format, attach files, and send exactly how you always have.",
    accent: "bg-brand-soft text-brand border-brand/20",
  },
  {
    num: "02",
    badge: "Real-Time",
    title: "Instant open alerts",
    description:
      "Find out the moment your prospect, client, or teammate opens your message so you can follow up while you're still on their mind.",
    accent: "bg-amber-soft text-amber border-amber/20",
  },
  {
    num: "03",
    badge: "One-Click",
    title: "Track only what matters",
    description:
      "Don't want to track personal emails to friends or family? Just flip the toggle off with one click. You have full per-email control.",
    accent: "bg-accent-soft text-accent border-accent/20",
  },
  {
    num: "04",
    badge: "Zero Creepiness",
    title: "Private & secure by design",
    description:
      "We never read or store email bodies. Tracking tokens are one-way hashed, and your sensitive communication stays strictly yours.",
    accent: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-6">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-soft px-3 py-1 text-xs font-semibold text-brand select-none">
              <DoodleStar className="size-3 text-amber" />
              <span>Built for simplicity</span>
            </div>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Everything you need.{" "}
              <span className="text-brand">Nothing you don't.</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm text-ink-muted">
            Designed to feel like a natural, buttery-smooth extension of your daily email routine.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-[24px] border border-border/80 bg-surface p-8 shadow-xs transition-bounce hover:-translate-y-1.5 hover:border-brand/40 hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.12)]"
            >
              {/* Header inside card - Clean typography without emojis */}
              <div className="flex items-center justify-between">
                <span className="font-display text-2xl font-black text-ink-faint transition-smooth group-hover:text-brand">
                  {f.num}
                </span>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold select-none ${f.accent}`}
                >
                  {f.badge}
                </span>
              </div>

              <h3 className="mt-6 font-display text-xl font-bold text-ink transition-smooth group-hover:text-brand">
                {f.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
