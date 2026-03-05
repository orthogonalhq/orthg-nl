import { SectionLabel } from "@/components/section-label";
import { SectionHeading } from "@/components/section-heading";

interface SectionHeaderProps {
  label: string;
  center?: boolean;
  size?: "hero" | "large" | "default" | "small";
  className?: string;
  children: React.ReactNode;
}

/** Combines SectionLabel + SectionHeading with consistent spacing. */
export function SectionHeader({
  label,
  center,
  size,
  className = "",
  children,
}: SectionHeaderProps) {
  return (
    <div className={`mb-8 ${center ? "text-center" : ""} ${className}`}>
      <SectionLabel>{label}</SectionLabel>
      <SectionHeading size={size}>{children}</SectionHeading>
    </div>
  );
}
