import Image from "next/image";
import {
  Terminal,
  Package,
  Server,
  FileText,
  Radio,
  ScrollText,
  TrendingUp,
} from "lucide-react";
import type { LucideProps } from "lucide-react";

const ICONS: Record<string, React.FC<LucideProps>> = {
  terminal: Terminal,
  package: Package,
  server: Server,
  "file-text": FileText,
  radio: Radio,
  "scroll-text": ScrollText,
  "trending-up": TrendingUp,
};

export function NavIcon({
  name,
  size = 14,
  className = "",
}: {
  name?: string;
  size?: number;
  className?: string;
}) {
  if (!name) return null;
  if (name === "worktree") {
    return (
      <Image
        src="/worktree-logomark.png"
        alt=""
        width={size}
        height={size}
        className={className}
      />
    );
  }

  const Icon = ICONS[name];
  if (!Icon) return null;
  return <Icon size={size} className={className} />;
}
