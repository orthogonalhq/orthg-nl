export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="font-brand text-2xl font-semibold tracking-[-0.05em]">
        O°
      </span>
      <span className="font-brand text-xl font-semibold tracking-[-0.05em]">
        Orthogonal
      </span>
    </div>
  );
}
