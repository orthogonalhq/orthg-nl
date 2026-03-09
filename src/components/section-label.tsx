interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

/** Small uppercase terminal label with `>` prefix. Used above section headings. */
export function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return (
    <p className={`terminal-text text-xs uppercase tracking-[0.25em] mb-4 ${className}`}>
      <span className="bg-accent text-black font-normal">&gt;{children}</span>
    </p>
  );
}
