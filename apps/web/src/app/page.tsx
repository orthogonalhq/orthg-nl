import { Hero } from "@/sections/hero";

import { MeetNous } from "@/sections/meet-nous";
import { Architecture } from "@/sections/architecture";
import { Capabilities } from "@/sections/capabilities";
import { Ecosystem } from "@/sections/ecosystem";

import { Responsibility } from "@/sections/responsibility";
import { RecentPosts } from "@/sections/recent-posts";
import { CTA } from "@/sections/cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="scanlines phosphor relative z-10 min-h-svh">
      <main>
        <Hero />
        <MeetNous />
        <Architecture />
        <Capabilities />
        <Ecosystem />
        <Responsibility />
        <RecentPosts />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
