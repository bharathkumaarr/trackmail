const faqs = [
  {
    q: "How does email tracking work?",
    a: "A tiny invisible image (tracking pixel) is embedded in your email. When the recipient's email client loads images, our server records an open event.",
  },
  {
    q: "Do I need a separate email app?",
    a: "No. Trackmail enhances Gmail's existing compose window. You never leave Gmail.",
  },
  {
    q: "How accurate is open tracking?",
    a: "An open means the pixel was fetched — often via Gmail's image proxy — not proof a human read the email. Some opens may be false positives from prefetching.",
  },
  {
    q: "Is it free?",
    a: "Yes for the MVP. The stack runs locally for $0 during development — PostgreSQL, Go backend, Chrome extension.",
  },
  {
    q: "What data do you collect?",
    a: "Recipient address, subject line, open timestamps, and aggregated open counts. We do not store email body content.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-5xl px-6 py-16 lg:py-20">
      <h2 className="font-display text-3xl font-bold tracking-tight text-ink lg:text-4xl">
        Questions
      </h2>
      <div className="mt-10 flex flex-col gap-2">
        {faqs.map((faq) => (
          <details
            key={faq.q}
            className="group overflow-hidden rounded-xl border border-ink/10 bg-surface"
          >
            <summary className="flex items-center justify-between px-5 py-4 font-display text-base font-semibold">
              {faq.q}
              <span className="ml-4 text-xl font-normal text-terracotta transition group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="px-5 pb-5 text-[15px] leading-relaxed text-ink-muted">
              {faq.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
