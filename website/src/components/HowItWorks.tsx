const steps = [
  {
    title: "Install the extension",
    description: "Add Trackmail to Chrome and sign in with Google.",
  },
  {
    title: "Enable tracking in compose",
    description: 'Flip "Track email" on before you hit Send.',
  },
  {
    title: "Send through Gmail",
    description:
      "Your email goes out normally — with an invisible tracking pixel.",
  },
  {
    title: "See when it's opened",
    description: "Check status in the extension popup or your tracked list.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-5xl px-6 py-16 lg:py-20">
      <h2 className="font-display text-3xl font-bold tracking-tight text-ink lg:text-4xl">
        How it works
      </h2>
      <ol className="mt-10 flex flex-col gap-4">
        {steps.map((step, i) => (
          <li
            key={step.title}
            className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-1 rounded-xl border border-ink/10 bg-surface px-6 py-5"
          >
            <span className="row-span-2 font-display text-2xl font-bold text-terracotta/70">
              {i + 1}
            </span>
            <strong className="font-display text-[17px]">{step.title}</strong>
            <span className="col-start-2 text-[15px] text-ink-muted">
              {step.description}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
