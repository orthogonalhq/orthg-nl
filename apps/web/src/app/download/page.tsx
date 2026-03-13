import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { GrainZone2 } from "@/components/grain-zone2";
import { DownloadContent } from "@/components/download-content";

export const metadata: Metadata = {
  title: "Download — Orthogonal",
  description: "Download Nous, the open source AI operating system. macOS, Windows, Linux, and CLI.",
};

export default function DownloadPage() {
  return (
    <div className="scanlines phosphor relative z-10 min-h-svh">
      <GrainZone2 />
      <main>
        <DownloadContent />
      </main>
      <Footer />
    </div>
  );
}
