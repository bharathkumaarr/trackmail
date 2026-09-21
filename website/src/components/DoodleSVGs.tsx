import React from "react";

export function ScribbleUnderline({ className = "text-accent" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 250 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute -bottom-2 left-0 w-full overflow-visible ${className}`}
      aria-hidden="true"
    >
      <path
        d="M2 14C45 4.5 115 2 248 11M15 17C65 7 150 5 235 15"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HandDrawnArrow({ className = "text-amber" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`overflow-visible ${className}`}
      aria-hidden="true"
    >
      <path
        d="M8 48C28 42 55 24 88 12"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M68 8C78 9 86 11 90 12C88 18 85 28 84 34"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DoodleStar({ className = "text-amber" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`size-5 ${className}`}
      aria-hidden="true"
    >
      <path d="M12 0C12.5 6.5 17.5 11.5 24 12C17.5 12.5 12.5 17.5 12 24C11.5 17.5 6.5 12.5 0 12C6.5 11.5 11.5 6.5 12 0Z" />
    </svg>
  );
}

export function HandDrawnCircle({
  children,
  className = "text-brand",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className="relative inline-block px-2">
      <span className="relative z-10">{children}</span>
      <svg
        viewBox="0 0 120 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`pointer-events-none absolute -inset-x-2 -inset-y-1.5 h-[calc(100%+12px)] w-[calc(100%+16px)] overflow-visible ${className}`}
        aria-hidden="true"
      >
        <path
          d="M12 26C10 14 35 6 62 6C92 6 112 14 110 27C107 40 78 45 48 45C22 45 6 38 7 24C8 12 30 8 52 8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export function PaperPlaneDoodle({ className = "text-brand" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2 38C16 35 28 22 24 10C20 -1 8 8 16 20C24 32 44 28 60 22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        strokeLinecap="round"
      />
      <path
        d="M58 14L78 20L62 30L65 23L72 20L60 19L58 14Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SquiggleDoodle({ className = "text-accent" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2 8C8 3 14 13 20 8C26 3 32 13 38 8C44 3 50 13 56 8"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
