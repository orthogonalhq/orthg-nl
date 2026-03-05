interface BodyTextProps {
  children: React.ReactNode;
  className?: string;
}

/** Terminal body text with consistent font, size, color, and leading. */
export function BodyText({ children, className = "" }: BodyTextProps) {
  return (
    <p className={`terminal-text text-sm text-white/55 leading-relaxed ${className}`}>
      {children}
    </p>
  );
}
