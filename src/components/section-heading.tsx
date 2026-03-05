interface SectionHeadingProps {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  size?: "hero" | "large" | "default" | "small";
  className?: string;
}

const SIZES = {
  hero: "text-5xl sm:text-6xl md:text-7xl xl:text-8xl",
  large: "text-4xl sm:text-5xl md:text-6xl",
  default: "text-3xl sm:text-4xl md:text-5xl",
  small: "text-2xl sm:text-3xl md:text-4xl",
} as const;

/** Mono heading with consistent tracking and leading. */
export function SectionHeading({
  children,
  as: Tag = "h2",
  size = "default",
  className = "",
}: SectionHeadingProps) {
  return (
    <Tag
      className={`font-mono ${SIZES[size]} font-semibold tracking-[-0.02em] leading-tight ${className}`}
    >
      {children}
    </Tag>
  );
}
