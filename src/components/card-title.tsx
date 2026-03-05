interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

/** Mono semibold card heading used inside bordered grid cards. */
export function CardTitle({ children, className = "" }: CardTitleProps) {
  return (
    <h3 className={`font-mono text-sm font-semibold t-card-title ${className}`}>
      {children}
    </h3>
  );
}
