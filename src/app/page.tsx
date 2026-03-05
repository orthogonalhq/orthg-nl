import { Hero } from "@/sections/hero";
import { SixWalls } from "@/sections/six-walls";
import { MeetNous } from "@/sections/meet-nous";
import { Architecture } from "@/sections/architecture";
import { Capabilities } from "@/sections/capabilities";
import { Ecosystem } from "@/sections/ecosystem";
import { Differentiation } from "@/sections/differentiation";
import { Responsibility } from "@/sections/responsibility";
import { CTA } from "@/sections/cta";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="scanlines phosphor relative min-h-svh bg-black">
      <Header />
      <main>
        <Hero />
        <div className="relative">
          {/* Rail lines connecting terminal boxes */}
          <div
            className="pointer-events-none absolute inset-0 z-10 px-6 md:px-12 lg:px-20"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent 180px, black 220px, black calc(100% - 60px), transparent calc(100% - 30px))",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 180px, black 220px, black calc(100% - 60px), transparent calc(100% - 30px))",
            }}
          >
            <div className="mx-auto h-full max-w-5xl border-l border-r border-white/[0.06]" />
          </div>
          <SixWalls />
          <MeetNous />
          <Architecture />
          <Capabilities />
          <Ecosystem />
          <Differentiation />
          <Responsibility />
        </div>
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
