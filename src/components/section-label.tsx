interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

/** Small uppercase terminal label with `>` prefix. Used above section headings. */
export function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return (
    <p className={`terminal-text text-xs uppercase tracking-[0.25em] text-accent mb-4 ${className}`}>
      <span className="terminal-prefix">&gt;</span>
      {children}
    </p>
  );
}
