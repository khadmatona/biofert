export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      dir="ltr"
      className={`whitespace-nowrap ${className}`}
      style={{
        fontFamily: "var(--font-logo)",
        fontWeight: 600,
        fontStyle: "normal",
        letterSpacing: "-0.03em",
        wordSpacing: "0.15em",
        color: "#2B1008",
        fontVariationSettings: '"SOFT" 60, "WONK" 0, "opsz" 144',
      }}
    >
      Biofert Maroc
      <span
        style={{
          display: "inline-block",
          fontStyle: "italic",
          transform: "skew(-12deg)",
          marginLeft: "0.15em",
        }}
      >
        !
      </span>
    </span>
  );
}
