import type { Metadata } from "next";
import { BannerContent } from "./banner-content";

export const metadata: Metadata = {
  title: "LinkedIn Banner — Orthogonal",
  robots: "noindex",
};

/**
 * Set browser to 1584 x 396 via DevTools responsive mode, then screenshot.
 * The grain canvas from the layout fills the viewport — face emerges from grain.
 */
export default function LinkedInBanner() {
  return <BannerContent />;
}
