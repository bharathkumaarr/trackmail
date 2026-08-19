import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-8 border-t border-ink/10 px-6 py-8">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
        <span className="font-display text-xl font-bold text-forest">
          Trackmail
        </span>
        <nav className="flex gap-6">
          <Link
            href="https://github.com/bharathkumaarr/trackmail"
            className="text-sm text-ink-muted transition hover:text-terracotta"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Link>
          <Link
            href="#faq"
            className="text-sm text-ink-muted transition hover:text-terracotta"
          >
            FAQ
          </Link>
        </nav>
        <p className="w-full text-center text-[13px] text-ink-faint sm:w-auto sm:text-right">
          © 2026 Trackmail
        </p>
      </div>
    </footer>
  );
}
