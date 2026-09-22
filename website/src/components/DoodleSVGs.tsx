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
    <span className="relative inline-block px-3 py-0.5">
      <span className="relative z-10">{children}</span>
      <svg
        viewBox="0 0 140 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className={`pointer-events-none absolute -inset-x-2.5 -inset-y-1.5 h-[calc(100%+12px)] w-[calc(100%+20px)] overflow-visible ${className}`}
        aria-hidden="true"
      >
        <path
          d="M10 22 C8 10 32 4 70 4 C110 4 135 10 133 22 C130 34 105 40 70 40 C30 40 5 34 7 21 C8 11 34 5 72 5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
}

export function HandDrawnOval({
  children,
  className = "text-amber",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className="relative inline-block px-3 py-0.5">
      <span className="relative z-10">{children}</span>
      <svg
        viewBox="0 0 160 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className={`pointer-events-none absolute -inset-x-2.5 -inset-y-1.5 h-[calc(100%+12px)] w-[calc(100%+20px)] overflow-visible ${className}`}
        aria-hidden="true"
      >
        <path
          d="M12 24C10 12 40 5 80 5C125 5 152 12 150 24C147 36 118 43 78 43C35 43 6 36 8 23C9 13 42 7 84 7"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </span>
  );
}

export function Highlighter({
  children,
  color = "bg-amber-200/80",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span className="relative inline-block px-1.5 py-0.5">
      <span
        className={`absolute inset-x-0 bottom-0.5 top-1 -rotate-1 rounded-sm ${color} -z-0`}
        aria-hidden="true"
      />
      <span className="relative z-10 font-bold">{children}</span>
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
