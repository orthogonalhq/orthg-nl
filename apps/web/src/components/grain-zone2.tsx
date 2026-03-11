"use client";

import { useEffect } from "react";
import { useGrainContext } from "@/components/grain-overlay";

/** Locks grain to zone 2 (steady-state) while mounted. */
export function GrainZone2() {
  const { setLockZone2 } = useGrainContext();

  useEffect(() => {
    setLockZone2(true);
    return () => setLockZone2(false);
  }, [setLockZone2]);

  return null;
}
