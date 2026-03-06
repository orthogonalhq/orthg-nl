interface CornerBracketCardProps {
  className?: string;
  children: React.ReactNode;
}

export function CornerBracketCard({ className = "", children }: CornerBracketCardProps) {
  return (
    <div className={`relative border border-panel bg-card p-6 ${className}`}>
      <div className="absolute -top-px -left-px w-2.5 h-2.5 border-t border-l border-white/20" />
      <div className="absolute -top-px -right-px w-2.5 h-2.5 border-t border-r border-white/20" />
      <div className="absolute -bottom-px -left-px w-2.5 h-2.5 border-b border-l border-white/20" />
      <div className="absolute -bottom-px -right-px w-2.5 h-2.5 border-b border-r border-white/20" />
      {children}
    </div>
  );
}
