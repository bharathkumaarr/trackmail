import React from "react";

interface TrackmailLogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function TrackmailLogoIcon({
  className = "size-8",
  ...props
}: TrackmailLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <rect width="32" height="32" rx="7.5" fill="#4F46E5" />
      <path
        d="M6.5 15.5L25.5 6.5L16.5 25.5L13.5 18.5L6.5 15.5Z"
        fill="#FFFFFF"
        stroke="#FFFFFF"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      <path
        d="M25.5 6.5L13.5 18.5"
        stroke="#4F46E5"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Amber/yellow accent dot at the paper plane tip */}
      <circle cx="25.5" cy="6.5" r="2.2" fill="#F59E0B" />
    </svg>
  );
}
