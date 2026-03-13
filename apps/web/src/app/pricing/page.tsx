import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { GrainZone2 } from "@/components/grain-zone2";
import { PricingContent } from "@/components/pricing-content";

export const metadata: Metadata = {
  title: "Pricing — Orthogonal",
  description: "Your intelligence. Your infrastructure. Pick your seat and add intelligence when you need it.",
};

export default function PricingPage() {
  return (
    <div className="scanlines phosphor relative z-10 min-h-svh">
      <GrainZone2 />
      <Header />
      <main>
        <PricingContent />
      </main>
      <Footer />
    </div>
  );
}
