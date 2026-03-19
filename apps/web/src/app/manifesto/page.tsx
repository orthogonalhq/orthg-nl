import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { GrainZone2 } from "@/components/grain-zone2";
import { ManifestoContent } from "@/components/manifesto-content";

export const metadata: Metadata = {
  title: "Manifesto — Orthogonal",
  description:
    "The Hierarchy of Stewardship. Our immutable mandates for building sovereign intelligence.",
};

export default function ManifestoPage() {
  return (
    <div className="scanlines phosphor relative z-10 min-h-svh">
      <GrainZone2 />
      <main>
        <ManifestoContent />
      </main>
      <Footer />
    </div>
  );
}
