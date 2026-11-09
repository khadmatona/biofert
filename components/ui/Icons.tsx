type IconProps = { className?: string; size?: number };

export function TagIcon({ className = "", size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M8.4 1.5H3a1.5 1.5 0 00-1.5 1.5v5.4c0 .4.16.78.44 1.06l6.1 6.1a1.5 1.5 0 002.12 0l4.9-4.9a1.5 1.5 0 000-2.12l-6.1-6.1a1.5 1.5 0 00-1.06-.44z"
        fill="currentColor"
      />
      <circle cx="5" cy="5" r="1" fill="var(--pale-yellow)" />
    </svg>
  );
}

export function SearchIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M17 17l-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function UserIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <circle cx="10" cy="6.5" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.5 17c1.2-3.2 4-5 6.5-5s5.3 1.8 6.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function CartIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M4 6h13l-1.2 8.4a1.5 1.5 0 01-1.48 1.28H6.68A1.5 1.5 0 015.2 14.4L4 6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M6.5 6V5a3.5 3.5 0 017 0v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function MenuIcon({ className = "", size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M3 5.5h14M3 10h14M3 14.5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function CloseXIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ChevronDownIcon({ className = "", size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" className={className} aria-hidden="true">
      <path d="M2.5 5l4.5 4.5L11.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlusMinusIcon({ open, size = 16 }: { open: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M8 2v12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="origin-center transition-transform duration-200"
        style={{ transform: open ? "scaleY(0)" : "scaleY(1)" }}
      />
    </svg>
  );
}

export function CheckIcon({ className = "", size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" className={className} aria-hidden="true">
      <path d="M2.5 7.5l3 3 6-6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GoogleIcon({ className = "", size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" className={className} aria-hidden="true">
      <path
        d="M19.6 10.23c0-.68-.06-1.32-.17-1.94H10v3.9h5.38a4.6 4.6 0 01-2 3.02v2.5h3.23c1.9-1.75 2.99-4.32 2.99-7.48z"
        fill="#4285F4"
      />
      <path
        d="M10 20c2.7 0 4.96-.9 6.61-2.42l-3.23-2.5c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.75-5.59-4.12H1.07v2.59A10 10 0 0010 20z"
        fill="#34A853"
      />
      <path
        d="M4.41 11.92a6 6 0 010-3.84V5.49H1.07a10 10 0 000 9.02l3.34-2.59z"
        fill="#FBBC05"
      />
      <path
        d="M10 3.96c1.47 0 2.79.5 3.83 1.5l2.87-2.87C14.95.99 12.7 0 10 0A10 10 0 001.07 5.49l3.34 2.59C5.2 5.71 7.4 3.96 10 3.96z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function WhatsAppIcon({ className = "", size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M10 17.5c-1.1 0-2.15-.24-3.1-.68L3.5 17.5l.72-3.3A7.5 7.5 0 1110 17.5z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M7.3 7.55c.13-.3.27-.3.4-.3h.32c.1 0 .24 0 .34.27.13.3.4 1.02.43 1.1.04.08.06.17.01.27-.05.1-.07.16-.15.25-.07.09-.15.2-.22.26-.07.07-.14.15-.06.29.08.14.36.62.78 1 .54.49.99.64 1.14.71.15.07.24.06.32-.03.09-.1.38-.44.48-.6.1-.14.2-.12.33-.07.13.05.81.38.96.45.14.07.22.1.26.16.04.06.04.36-.08.71-.12.35-.68.65-.95.7-.25.03-.55.06-.89-.05a8 8 0 01-.81-.3c-1.43-.62-2.36-2.06-2.44-2.16-.07-.1-.59-.78-.59-1.49 0-.71.37-1.05.5-1.2z"
        fill="currentColor"
        transform="translate(10 10) scale(1.5) translate(-10 -10)"
      />
    </svg>
  );
}

export function FacebookIcon({ className = "", size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M11.6 10.2h1.6l.25-2h-1.85V6.9c0-.58.16-.97 1-.97h1.06V4.14C13.44 4.1 12.83 4 12.13 4c-1.47 0-2.48.9-2.48 2.55v1.65H8v2h1.65v5.7h2v-5.7z"
        fill="currentColor"
      />
    </svg>
  );
}

export function InstagramIcon({ className = "", size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="10" cy="10" r="3.4" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="13.6" cy="6.4" r="1" fill="currentColor" />
    </svg>
  );
}

export function LinkedInIcon({ className = "", size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="14" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="7" cy="7.3" r="0.9" fill="currentColor" />
      <path d="M7 9.5v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path
        d="M10 14.5v-3.2c0-1 .6-1.8 1.7-1.8s1.6.8 1.6 1.8v3.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 9.5v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function TikTokIcon({ className = "", size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M11.2 3v8.7a1.9 1.9 0 11-1.7-1.88"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.2 3.1c.25 1.7 1.5 3 3.2 3.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function XIcon({ className = "", size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M4.5 4.5l11 11M15.5 4.5l-11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * `direction` is semantic ("prev"/"next"), not visual — `next` points at
 * the reading-end (right in LTR, flipped to left in RTL via `rtl:rotate-180`)
 * and `prev` is its mirror, so every call site stays correct across
 * directions without branching on the current locale.
 */
export function ArrowIcon({ className = "", size = 16, direction = "next" }: IconProps & { direction?: "prev" | "next" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={`${direction === "prev" ? "rotate-180 rtl:rotate-0" : "rtl:rotate-180"} ${className}`}
      aria-hidden="true"
    >
      <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
