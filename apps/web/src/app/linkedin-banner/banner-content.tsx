"use client";

import { useEffect } from "react";
import { useGrainContext } from "@/components/grain-overlay";

/**
 * Continuously pumps grain overrides for extra contrast on the banner.
 * Renders copy over the full-viewport grain canvas.
 *
 * Usage: DevTools responsive mode -> 1584 x 396 -> screenshot viewport.
 */
export function BannerContent() {
  const { handleKnob } = useGrainContext();

  // Pump high-contrast grain params every 500ms so overrides never expire
  useEffect(() => {
    function boost() {
      handleKnob("maxPop", 0.25);
      handleKnob("popAlphaMin", 50);
      handleKnob("popAlphaMax", 65);
      handleKnob("churnRate", 0.22);
      handleKnob("baseAlpha", 10);
      handleKnob("basePop", 0.0);
    }
    boost();
    const id = setInterval(boost, 500);
    return () => clearInterval(id);
  }, [handleKnob]);

  // Type scale (golden ratio ~1.618):
  // Nous:        72px (hero)
  // Orthogonal:  34px (72 / 2.12)
  // Tagline:     26px (34 / 1.3)
  // Subtitle:    16px (26 / 1.618)

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#050505",
      }}
    >
      {/* Brand mark — top right */}
      <div
        style={{
          position: "absolute",
          right: "6%",
          top: "12%",
          zIndex: 10,
          textAlign: "right",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-montserrat-alt), system-ui, sans-serif",
            fontSize: 34,
            fontWeight: 600,
            letterSpacing: "-0.04em",
            color: "rgba(255,255,255,0.92)",
            textShadow: "0 0 4px rgba(255,255,255,0.06), 0 0 12px rgba(255,255,255,0.03)",
          }}
        >
          O° Orthogonal
        </div>
      </div>

      {/* Nous group — vertically centered right */}
      <div
        style={{
          position: "absolute",
          right: "6%",
          top: "50%",
          transform: "translateY(-35%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          textAlign: "right",
          zIndex: 10,
        }}
      >
        {/* Product name */}
        <h1
          style={{
            fontFamily: "var(--font-ibm-plex-mono), ui-monospace, monospace",
            fontSize: 72,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            color: "rgba(255,255,255,0.80)",
            margin: 0,
          }}
        >
          Nous
        </h1>

        {/* System subtitle */}
        <p
          style={{
            fontFamily: "var(--font-fira-code), ui-monospace, monospace",
            fontSize: 16,
            fontWeight: 300,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.40)",
            margin: 0,
            marginTop: 18,
          }}
        >
          A Neural Orchestration Unification System
        </p>

        {/* Tagline */}
        <p
          style={{
            fontFamily: "var(--font-fira-code), ui-monospace, monospace",
            fontSize: 26,
            fontWeight: 300,
            lineHeight: 1.3,
            color: "#FA5D2B",
            margin: 0,
            marginTop: 18,
            opacity: 0.85,
          }}
        >
          Open Source. Free. Forever.
        </p>
      </div>

      {/* Vignette — subtle edge darkening */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 140% 160% at 40% 50%, transparent 45%, rgba(0,0,0,0.35) 100%)",
          zIndex: 5,
        }}
      />
    </div>
  );
}
