import type { ReactNode } from "react";

const ICONS: Record<string, string> = {
  info: "ℹ",
  warn: "⚠",
  note: "✦",
  perspective: "◉",
};

export function Callout({
  icon,
  children,
}: {
  icon?: string;
  children: ReactNode;
}) {
  const glyph = icon ? ICONS[icon] ?? icon : ICONS.note;

  return (
    <div className="flex gap-3 items-start border border-accent/12 bg-accent/[0.03] rounded px-4 py-3 mb-6 text-ui leading-relaxed t-card-desc [&_p]:contents">
      <span className="shrink-0 text-accent text-sm mt-px">{glyph}</span>
      {children}
    </div>
  );
}
