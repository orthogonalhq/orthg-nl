"use client";

import { GrainZone2 } from "@/components/grain-zone2";

export default function InvestorsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GrainZone2 />
      {children}
    </>
  );
}
