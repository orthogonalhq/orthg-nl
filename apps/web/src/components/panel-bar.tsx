interface PanelBarProps {
  label: string;
  meta?: string;
  /** Override the default meta color class */
  metaCls?: string;
}

/** Terminal-style header bar inside bordered containers (e.g. "nous::modules | 6 Loaded"). */
export function PanelBar({ label, meta, metaCls = "t-panel-meta" }: PanelBarProps) {
  return (
    <div className="border-b border-white/[0.06] px-6 md:px-10 py-3 flex items-center justify-between">
      <span className="terminal-text text-caption uppercase tracking-[0.2em] t-panel-label">
        {label}
      </span>
      {meta && (
        <span className={`terminal-text text-label capitalize ${metaCls}`}>{meta}</span>
      )}
    </div>
  );
}
