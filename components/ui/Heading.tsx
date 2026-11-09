import { ElementType, ReactNode } from "react";

type HeadingLevel = "h1" | "h2" | "h3" | "h4";

const sizeStyles: Record<string, string> = {
  hero: "text-[2.5rem] leading-[1.05] sm:text-[3.25rem] lg:text-[3.75rem]",
  section: "text-[1.9rem] leading-[1.1] sm:text-[2.4rem] lg:text-[2.75rem]",
  sub: "text-2xl sm:text-3xl",
  card: "text-lg sm:text-xl",
};

interface HeadingProps {
  as?: HeadingLevel;
  size?: keyof typeof sizeStyles;
  italic?: boolean;
  className?: string;
  children: ReactNode;
}

export function Heading({
  as = "h2",
  size = "section",
  italic = false,
  className = "",
  children,
}: HeadingProps) {
  const Tag: ElementType = as;
  return (
    <Tag
      className={`font-display font-medium tracking-tight text-ink ${
        italic ? "italic" : ""
      } ${sizeStyles[size]} ${className}`}
    >
      {children}
    </Tag>
  );
}
