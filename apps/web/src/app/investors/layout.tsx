"use client";

import { useEffect } from "react";
import { useGrainContext } from "@/components/grain-overlay";

export default function InvestorsLayout({ children }: { children: React.ReactNode }) {
  const { setGrainEnabled } = useGrainContext();

  useEffect(() => {
    setGrainEnabled(false);
    return () => setGrainEnabled(true);
  }, [setGrainEnabled]);

  return <>{children}</>;
}
