const features = [
  {
    num: "01",
    title: "Stays inside Gmail",
    description:
      "Compose, format, attach, and send exactly as you always do. We add a toggle — not a new inbox.",
  },
  {
    num: "02",
    title: "Open notifications",
    description:
      "See when a recipient opens your email. Follow up while you're still top of mind.",
  },
  {
    num: "03",
    title: "Per-email control",
    description:
      "Enable tracking only when you need it. One click on, one click off.",
  },
  {
    num: "04",
    title: "Private by design",
    description:
      "We don't store email bodies. Tracking tokens are hashed. IPs are never kept in raw form.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="border-y border-ink/10 bg-surface py-16 lg:py-20"
    >
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="font-display text-3xl font-bold tracking-tight text-ink lg:text-4xl">
          Why Trackmail
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:gap-12">
          {features.map((f) => (
            <article key={f.num} className="py-2">
              <span className="font-display text-sm font-bold text-terracotta">
                {f.num}
              </span>
              <h3 className="mt-3 font-display text-xl font-semibold">
                {f.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
                {f.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
