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
      <g transform="translate(7, 7) scale(0.75)">
        <path
          d="m22 2-7 20-4-9-9-4Z"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 2 11 13"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="22" cy="2" r="2.6" fill="#F59E0B" />
      </g>
    </svg>
  );
}
