/** Gold divider with the logo's bomb and spark at its centre. Decorative only. */
export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-full max-w-24 bg-gradient-to-r from-transparent via-gold to-gold" />
      <svg width="44" height="40" viewBox="0 0 44 40" fill="none" className="shrink-0">
        <path d="M21 13c1-5 5-8 10-8" stroke="#b09b63" strokeWidth="1.6" strokeLinecap="round" />
        <g className="spark" style={{ transformBox: "fill-box" }}>
          <path
            d="M33 1.5l1.3 2.6 2.8-.9-.9 2.8 2.6 1.3-2.6 1.3.9 2.8-2.8-.9L33 13l-1.3-2.6-2.8.9.9-2.8L27.2 7.3l2.6-1.3-.9-2.8 2.8.9z"
            stroke="#dabe7f"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
        </g>
        <rect x="16.5" y="12" width="8" height="4" rx="1" fill="#b09b63" />
        <circle cx="20.5" cy="26" r="11" fill="#8f2235" stroke="#b09b63" strokeWidth="1.6" />
        <path d="M14.5 22.5a7 7 0 0 1 5-4" stroke="#f0e9d8" strokeOpacity=".55" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      <span className="h-px w-full max-w-24 bg-gradient-to-l from-transparent via-gold to-gold" />
    </div>
  );
}

/** Wavy gold water line from the bottom of the badge. Decorative only. */
export function Waves({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 24"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M0 12c25 0 25-8 50-8s25 8 50 8 25-8 50-8 25 8 50 8 25-8 50-8 25 8 50 8 25-8 50-8 25 8 50 8"
        stroke="#b09b63"
        strokeOpacity=".7"
        strokeWidth="1.5"
      />
      <path
        d="M0 20c25 0 25-8 50-8s25 8 50 8 25-8 50-8 25 8 50 8 25-8 50-8 25 8 50 8 25-8 50-8 25 8 50 8"
        stroke="#084141"
        strokeWidth="2"
      />
    </svg>
  );
}
