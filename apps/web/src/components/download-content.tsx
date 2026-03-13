"use client";

import { useState, useEffect, useCallback } from "react";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";
import { PanelBar } from "@/components/panel-bar";
import { CardTitle } from "@/components/card-title";
import { BodyText } from "@/components/body-text";

/* ── Config ────────────────────────────────────────────────────── */

/** Flip to `true` once real release artifacts exist. */
const RELEASED = false;

const VERSION = "v0.1.0";

/* ── Types & data ──────────────────────────────────────────────── */

type Platform = "macos" | "windows" | "linux";
type CLITab = "macos" | "windows" | "linux" | "npm" | "git";

interface PlatformInfo {
  label: string;
  icon: React.ReactNode;
  description: string;
  detail: string;
  ext: string;
  href: string;
}

const PLATFORMS: Record<Platform, PlatformInfo> = {
  macos: {
    label: "macOS",
    icon: <AppleIcon />,
    description: "Universal binary. Apple Silicon & Intel.",
    detail: "Apple Silicon & Intel · .dmg · 48 MB",
    ext: ".dmg",
    href: "#",
  },
  windows: {
    label: "Windows",
    icon: <WindowsIcon />,
    description: "Windows 10+ (64-bit). .exe installer.",
    detail: "Windows 10+ (64-bit) · .exe · 52 MB",
    ext: ".exe",
    href: "#",
  },
  linux: {
    label: "Linux",
    icon: <LinuxIcon />,
    description: "Ubuntu 22.04+, Debian, Fedora, Arch. .AppImage.",
    detail: "Ubuntu 22.04+, Debian, Fedora, Arch · .AppImage · 56 MB",
    ext: ".AppImage",
    href: "#",
  },
};

const CLI_TABS: { key: CLITab; label: string }[] = [
  { key: "macos", label: "macOS" },
  { key: "windows", label: "Windows" },
  { key: "linux", label: "Linux" },
  { key: "npm", label: "npm" },
  { key: "git", label: "git clone" },
];

const CLI_COMMANDS: Record<CLITab, string> = {
  macos: "brew install orthogonal/tap/nous",
  windows: "winget install Orthogonal.Nous",
  linux: "curl -fsSL https://get.nous.dev | sh",
  npm: "npm install -g @orthogonal/nous",
  git: "git clone https://github.com/orthogonal-research/nous.git && cd nous && make install",
};

const CLI_DEFAULT: Record<Platform, CLITab> = {
  macos: "macos",
  windows: "windows",
  linux: "linux",
};

const SYSREQ = [
  { label: "OS", value: "macOS 13+, Windows 10+, Ubuntu 22.04+" },
  { label: "RAM", value: "8 GB minimum, 16 GB recommended" },
  { label: "Disk", value: "500 MB for Nous, more for local models" },
  { label: "GPU", value: "Optional. Enables faster and higher-quality local inference." },
];

/* ── Platform detection ────────────────────────────────────────── */

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "macos";
  const ua = navigator.userAgent.toLowerCase();
  const platform = (navigator.platform ?? "").toLowerCase();
  if (ua.includes("mac") || platform.includes("mac")) return "macos";
  if (ua.includes("win") || platform.includes("win")) return "windows";
  if (ua.includes("linux") || platform.includes("linux")) return "linux";
  return "macos";
}

/* ── Icons ─────────────────────────────────────────────────────── */

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function WindowsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M3 12V6.5l8-1.1V12H3zm0 .5h8v6.6l-8-1.1V12.5zM11.5 12V5.3l9.5-1.3V12h-9.5zm0 .5H21v7.8l-9.5-1.3V12.5z" />
    </svg>
  );
}

function LinuxIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="currentColor" aria-hidden="true"><path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.4-.313.136-.658.269-.864.68-.09.189-.136.394-.132.602 0 .199.027.4.055.536.058.399.116.728.04.97-.249.68-.28 1.145-.106 1.484.174.334.535.47.94.601.81.2 1.91.135 2.774.6.926.466 1.866.67 2.616.47.526-.116.97-.464 1.208-.946.587-.003 1.23-.269 2.26-.334.699-.058 1.574.267 2.577.2.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071.771-.06 1.592-.536 2.257-1.306.631-.765 1.683-1.084 2.378-1.503.348-.199.629-.469.649-.853.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.357.357 0 00-.19-.064c.431-1.278.264-2.55-.173-3.694-.533-1.41-1.465-2.638-2.175-3.483-.796-1.005-1.576-1.957-1.56-3.368.026-2.152.236-6.133-3.544-6.139zm.529 3.405h.013c.213 0 .396.062.584.198.19.135.33.332.438.533.105.259.158.459.166.724 0-.02.006-.04.006-.06v.105a.086.086 0 01-.004-.021l-.004-.024a1.807 1.807 0 01-.15.706.953.953 0 01-.213.335.71.71 0 00-.088-.042c-.104-.045-.198-.064-.284-.133a1.312 1.312 0 00-.22-.066c.05-.06.146-.133.183-.198.053-.128.082-.264.088-.402v-.02a1.21 1.21 0 00-.061-.4c-.045-.134-.101-.2-.183-.333-.084-.066-.167-.132-.267-.132h-.016c-.093 0-.176.03-.262.132a.8.8 0 00-.205.334 1.18 1.18 0 00-.09.4v.019c.002.089.008.179.02.267-.193-.067-.438-.135-.607-.202a1.635 1.635 0 01-.018-.2v-.02a1.772 1.772 0 01.15-.768c.082-.22.232-.406.43-.533a.985.985 0 01.594-.2zm-2.962.059h.036c.142 0 .27.048.399.135.146.129.264.288.344.465.09.199.14.4.153.667v.004c.007.134.006.2-.002.266v.08c-.03.007-.056.018-.083.024-.152.055-.274.135-.393.2.012-.09.013-.18.003-.267v-.015c-.012-.133-.04-.2-.082-.333a.613.613 0 00-.166-.267.248.248 0 00-.183-.064h-.021c-.071.006-.13.04-.186.132a.552.552 0 00-.12.27.944.944 0 00-.023.33v.015c.012.135.037.2.08.334.046.134.098.2.166.268.01.009.02.018.034.024-.07.057-.117.07-.176.136a.304.304 0 01-.131.068 2.62 2.62 0 01-.275-.402 1.772 1.772 0 01-.155-.667 1.759 1.759 0 01.08-.668 1.43 1.43 0 01.283-.535c.128-.133.26-.2.418-.2zm1.37 1.706c.332 0 .733.065 1.216.399.293.2.523.269 1.052.468h.003c.255.136.405.266.478.399v-.131a.571.571 0 01.016.47c-.123.31-.516.643-1.063.842v.002c-.268.135-.501.333-.775.465-.276.135-.588.292-1.012.267a1.139 1.139 0 01-.448-.067 3.566 3.566 0 01-.322-.198c-.195-.135-.363-.332-.612-.465v-.005h-.005c-.4-.246-.616-.512-.686-.71-.07-.268-.005-.47.193-.6.224-.135.38-.271.483-.336.104-.074.143-.102.176-.131h.002v-.003c.169-.202.436-.47.839-.601.139-.036.294-.065.466-.065zm2.8 2.142c.358 1.417 1.196 3.475 1.735 4.473.286.534.855 1.659 1.102 3.024.156-.005.33.018.513.064.646-1.671-.546-3.467-1.089-3.966-.22-.2-.232-.335-.123-.335.59.534 1.365 1.572 1.646 2.757.13.535.16 1.104.021 1.67.067.028.135.06.205.067 1.032.534 1.413.938 1.23 1.537v-.043c-.06-.003-.12 0-.18 0h-.016c.151-.467-.182-.825-1.065-1.224-.915-.4-1.646-.336-1.77.465-.008.043-.013.066-.018.135-.068.023-.139.053-.209.064-.43.268-.662.669-.793 1.187-.13.533-.17 1.156-.205 1.869v.003c-.02.334-.17.838-.319 1.35-1.5 1.072-3.58 1.538-5.348.334a2.645 2.645 0 00-.402-.533 1.45 1.45 0 00-.275-.333c.182 0 .338-.03.465-.067a.615.615 0 00.314-.334c.108-.267 0-.697-.345-1.163-.345-.467-.931-.995-1.788-1.521-.63-.4-.986-.87-1.15-1.396-.165-.534-.143-1.085-.015-1.645.245-1.07.873-2.11 1.274-2.763.107-.065.037.135-.408.974-.396.751-1.14 2.497-.122 3.854a8.123 8.123 0 01.647-2.876c.564-1.278 1.743-3.504 1.836-5.268.048.036.217.135.289.202.218.133.38.333.59.465.21.201.477.335.876.335.039.003.075.006.11.006.412 0 .73-.134.997-.268.29-.134.52-.334.74-.4h.005c.467-.135.835-.402 1.044-.7zm2.185 8.958c.037.6.343 1.245.882 1.377.588.134 1.434-.333 1.791-.765l.211-.01c.315-.007.577.01.847.268l.003.003c.208.199.305.53.391.876.085.4.154.78.409 1.066.486.527.645.906.636 1.14l.003-.007v.018l-.003-.012c-.015.262-.185.396-.498.595-.63.401-1.746.712-2.457 1.57-.618.737-1.37 1.14-2.036 1.191-.664.053-1.237-.2-1.574-.898l-.005-.003c-.21-.4-.12-1.025.056-1.69.176-.668.428-1.344.463-1.897.037-.714.076-1.335.195-1.814.12-.465.308-.797.641-.984l.045-.022zm-10.814.049h.01c.053 0 .105.005.157.014.376.055.706.333 1.023.752l.91 1.664.003.003c.243.533.754 1.064 1.189 1.637.434.598.77 1.131.729 1.57v.006c-.057.744-.48 1.148-1.125 1.294-.645.135-1.52.002-2.395-.464-.968-.536-2.118-.469-2.857-.602-.369-.066-.61-.2-.723-.4-.11-.2-.113-.602.123-1.23v-.004l.002-.003c.117-.334.03-.752-.027-1.118-.055-.401-.083-.71.043-.94.16-.334.396-.4.69-.533.294-.135.64-.202.915-.47h.002v-.002c.256-.268.445-.601.668-.838.19-.201.38-.336.663-.336zm7.159-9.074c-.435.201-.945.535-1.488.535-.542 0-.97-.267-1.28-.466-.154-.134-.28-.268-.373-.335-.164-.134-.144-.333-.074-.333.109.016.129.134.199.2.096.066.215.2.36.333.292.2.68.467 1.167.467.485 0 1.053-.267 1.398-.466.195-.135.445-.334.648-.467.156-.136.149-.267.279-.267.128.016.034.134-.147.332a8.097 8.097 0 01-.69.468zm-1.082-1.583V5.64c-.006-.02.013-.042.029-.05.074-.043.18-.027.26.004.063 0 .16.067.15.135-.006.049-.085.066-.135.066-.055 0-.092-.043-.141-.068-.052-.018-.146-.008-.163-.065zm-.551 0c-.02.058-.113.049-.166.066-.047.025-.086.068-.14.068-.05 0-.13-.02-.136-.068-.01-.066.088-.133.15-.133.08-.031.184-.047.259-.005.019.009.036.03.03.05v.02h.003z"></path></svg>
  );
}

function TerminalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

function AndroidIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.532 15.106a1.003 1.003 0 111.001 1.738 1.003 1.003 0 01-1.001-1.738m-11.044 0a1.003 1.003 0 111.001 1.738 1.003 1.003 0 01-1.001-1.738m11.4-6.018 2.006-3.459a.413.413 0 10-.715-.414L17.16 8.69c-1.506-.755-3.2-1.18-5.04-1.18-1.838 0-3.534.425-5.04 1.18L5.063 5.215a.413.413 0 10-.715.414l2.006 3.459C2.76 11.291.345 15.192.011 19.72h23.978c-.334-4.528-2.749-8.43-6.303-10.632" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 t-panel-label">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

function CompanionIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 t-card-title">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
      <path d="M8 10h.01M12 10h.01M16 10h.01" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

/* ── Copy button ───────────────────────────────────────────────── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="cursor-pointer shrink-0 p-1.5 t-meta hover:t-card-title transition-colors"
      aria-label="Copy to clipboard"
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
}

/* ── Coming soon badge ─────────────────────────────────────────── */

function ComingSoonBadge() {
  return (
    <span className="terminal-text text-[10px] uppercase tracking-[0.15em] bg-white/[0.06] t-meta px-2 py-0.5">
      coming soon
    </span>
  );
}

/* ── Main component ────────────────────────────────────────────── */

export function DownloadContent() {
  const [platform, setPlatform] = useState<Platform>("macos");
  const [cliTab, setCliTab] = useState<CLITab>("macos");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobile =
      typeof navigator !== "undefined" &&
      /android|iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsMobile(mobile);
    if (!mobile) {
      const detected = detectPlatform();
      setPlatform(detected);
      setCliTab(CLI_DEFAULT[detected]);
    }
  }, []);

  const hero = PLATFORMS[platform];
  const allPlatforms: { key: Platform | "cli"; info?: PlatformInfo }[] = [
    { key: "macos", info: PLATFORMS.macos },
    { key: "windows", info: PLATFORMS.windows },
    { key: "linux", info: PLATFORMS.linux },
    { key: "cli" },
  ];

  return (
    <div className="pt-28">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative px-6 md:px-12 lg:px-20 py-20 md:py-28 text-center">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="terminal-text text-xs t-meta tracking-[0.15em] uppercase">
                {VERSION}
              </span>
              {!RELEASED && <ComingSoonBadge />}
            </div>
            {isMobile ? (
              <>
                <SectionHeader center size="large">
                  Nous Companion
                </SectionHeader>
                <BodyText className="max-w-xl mx-auto">
                  Chat and voice interface for your self-hosted Nous agent.
                  Connect from anywhere &mdash; your AI stays on your machine.
                </BodyText>
              </>
            ) : (
              <>
                <SectionHeader center size="large">
                  Download Nous
                </SectionHeader>
                <BodyText className="max-w-xl mx-auto">
                  Install the open source AI operating system on your machine.
                  <br className="hidden sm:inline" />
                  Self-hosted. Model-agnostic. Yours.
                </BodyText>
              </>
            )}
          </Reveal>

          <Reveal delay={100}>
            {isMobile ? (
              <div className="mt-10 flex flex-col items-center gap-3">
                <div className="flex flex-wrap justify-center gap-3">
                  {[
                    { label: "iOS", icon: <AppleIcon /> },
                    { label: "Android", icon: <AndroidIcon /> },
                  ].map(({ label, icon }) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-2 border border-white/[0.06] px-5 py-2.5 font-accent text-xs uppercase tracking-[0.15em] t-meta cursor-default"
                    >
                      {icon}
                      {label} &mdash; Coming soon
                    </span>
                  ))}
                </div>
                <span className="terminal-text text-[11px] t-meta">
                  Desktop downloads available below
                </span>
              </div>
            ) : (
              <div className="mt-10 flex flex-col items-center gap-3">
                {RELEASED ? (
                  <a
                    href={hero.href}
                    className="inline-flex items-center gap-3 border border-accent/60 px-8 py-3.5 font-accent text-xs uppercase tracking-[0.15em] text-accent transition-all duration-200 hover:bg-accent hover:text-white hover:border-accent"
                  >
                    {hero.icon}
                    <DownloadIcon />
                    Download for {hero.label}
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-3 border border-white/[0.06] px-8 py-3.5 font-accent text-xs uppercase tracking-[0.15em] t-meta cursor-default">
                    {hero.icon}
                    <DownloadIcon />
                    Download for {hero.label}
                  </span>
                )}
                <span className="terminal-text text-[11px] t-meta">
                  {RELEASED ? hero.detail : "Release builds are not yet available"}
                </span>
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* ── All platforms grid ─────────────────────────────────────── */}
      <section className="relative px-6 md:px-12 lg:px-20 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="flex items-center gap-3">
              <SectionHeader label="Platforms" size="small">
                All downloads
              </SectionHeader>
              {!RELEASED && <ComingSoonBadge />}
            </div>
          </Reveal>

          <div className="backdrop-blur-xl">
            <Reveal delay={100}>
              <div className="border-y border-white/[0.06]">
                <PanelBar label="nous::download" meta={RELEASED ? VERSION : "unreleased"} />

                <div className="grid grid-cols-1 sm:grid-cols-2">
                  {/* Interior dividers only — vertical between cols, horizontal between rows */}
                  {allPlatforms.map(({ key, info }, i) => {
                    const isActive = !isMobile && key === platform;
                    const isCli = key === "cli";
                    const isLeftCol = i % 2 === 0;
                    const isLast = i === allPlatforms.length - 1;
                    const isTopRow = i < 2;

                    return (
                      <div
                        key={key}
                        className={`relative p-6 flex flex-col border-white/[0.06] ${
                          isActive && !isCli ? "bg-white/[0.02]" : ""
                        } ${isLeftCol ? "sm:border-r" : ""} ${!isLast ? "border-b" : ""} ${!isTopRow ? "sm:border-b-0" : ""}`}
                      >
                        {isActive && !isCli && (
                          <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 terminal-text text-[10px] uppercase tracking-[0.15em] bg-accent text-black px-1.5 py-0.5 whitespace-nowrap">
                            detected
                          </span>
                        )}

                        <div className="flex items-center gap-2 mb-2">
                          <span className="t-card-title">
                            {isCli ? <TerminalIcon /> : info!.icon}
                          </span>
                          <CardTitle>{isCli ? "CLI" : info!.label}</CardTitle>
                        </div>

                        <p className="terminal-text text-xs t-card-desc leading-relaxed flex-1 mb-4">
                          {isCli
                            ? "Install from your terminal. npm, Homebrew, or curl."
                            : info!.description}
                        </p>

                        {isCli ? (
                          RELEASED ? (
                            <a
                              href="#cli"
                              className="mt-auto block w-full text-center border border-white/[0.12] px-6 py-3 font-accent text-xs uppercase tracking-[0.15em] t-card-title transition-all duration-200 hover:border-accent/60 hover:text-accent"
                            >
                              See commands ↓
                            </a>
                          ) : (
                            <span className="mt-auto block w-full text-center border border-white/[0.06] px-6 py-3 font-accent text-xs uppercase tracking-[0.15em] t-meta cursor-default">
                              Coming soon
                            </span>
                          )
                        ) : RELEASED ? (
                          <a
                            href={info!.href}
                            className={`mt-auto block w-full text-center px-6 py-3 font-accent text-xs uppercase tracking-[0.15em] transition-all duration-200 ${
                              isActive
                                ? "border border-accent/60 text-accent hover:bg-accent hover:text-white hover:border-accent"
                                : "border border-white/[0.12] t-card-title hover:border-accent/60 hover:text-accent"
                            }`}
                          >
                            Download {info!.ext} ↓
                          </a>
                        ) : (
                          <span className="mt-auto block w-full text-center border border-white/[0.06] px-6 py-3 font-accent text-xs uppercase tracking-[0.15em] t-meta cursor-default">
                            Coming soon
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CLI install ────────────────────────────────────────────── */}
      <section id="cli" className="relative px-6 md:px-12 lg:px-20 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="flex items-center gap-3">
              <SectionHeader label="Terminal" size="small">
                Install via CLI
              </SectionHeader>
              {!RELEASED && <ComingSoonBadge />}
            </div>
          </Reveal>

          <div className="bg-black/10 backdrop-blur-xl">
            <Reveal delay={100}>
              <div className="border-y border-white/[0.06]">
                <PanelBar label="nous::cli" meta={`${CLI_TABS.length} Methods`} />

                {/* Tabs */}
                <div className="flex flex-wrap border-b border-white/[0.06]">
                  {CLI_TABS.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setCliTab(key)}
                      className={`cursor-pointer px-5 py-3 font-mono text-xs tracking-wide transition-colors ${
                        cliTab === key
                          ? "bg-white/[0.06] t-card-title"
                          : "t-meta hover:t-body"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Code block */}
                <div className={`px-6 md:px-10 py-6 md:py-8 ${!RELEASED ? "opacity-40" : ""}`}>
                  <div className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] px-4 py-3 rounded-[3px]">
                    <span className="terminal-text text-xs t-meta select-none">$</span>
                    <code className="terminal-text text-sm t-card-title flex-1 overflow-x-auto whitespace-nowrap">
                      {CLI_COMMANDS[cliTab]}
                    </code>
                    {RELEASED && <CopyButton text={CLI_COMMANDS[cliTab]} />}
                  </div>
                </div>

                {!RELEASED && (
                  <div className="border-t border-white/[0.06] px-6 md:px-10 py-4">
                    <p className="terminal-text text-[11px] text-accent">
                      These commands will work once the first release is published.
                    </p>
                  </div>
                )}

                {/* Docs callout */}
                <div className="border-t border-white/[0.06] px-6 md:px-10 py-6 md:py-8">
                  <div className="border border-accent/20 bg-accent/3 px-6 py-5">
                    <p className="terminal-text text-xs t-card-title leading-relaxed mb-3">
                      For detailed installation instructions, troubleshooting, and build-from-source guides:
                    </p>
                    <a
                      href="https://docs.orthg.nl/docs/installation"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-accent/60 px-5 py-2.5 font-accent text-xs uppercase tracking-[0.15em] text-accent transition-all duration-200 hover:bg-accent hover:text-white hover:border-accent"
                    >
                      Read the docs →
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Companion app ──────────────────────────────────────────── */}
      <section className="relative px-6 md:px-12 lg:px-20 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="flex items-center gap-3">
              <SectionHeader label="Interface" size="small">
                Companion App
              </SectionHeader>
              {!RELEASED && <ComingSoonBadge />}
            </div>
          </Reveal>

          <div className="bg-black/10 backdrop-blur-xl">
            <Reveal delay={100}>
              <div className="border-y border-white/[0.06]">
                <PanelBar label="nous::companion" meta={RELEASED ? VERSION : "unreleased"} />

                <div className="px-6 md:px-10 py-8 md:py-10">
                  <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                    {/* Chat preview mock */}
                    <div className="flex-1 border border-white/[0.06] rounded-[3px] overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
                        <ChatIcon />
                        <span className="terminal-text text-[10px] uppercase tracking-[0.15em] t-panel-label">
                          nous::chat
                        </span>
                      </div>
                      <div className="px-4 py-5 space-y-4">
                        <div className="flex gap-3">
                          <span className="terminal-text text-[10px] t-meta shrink-0 pt-0.5">you</span>
                          <p className="terminal-text text-xs t-card-desc leading-relaxed">
                            Draft a reply to the supplier email about the late shipment. Keep it firm but polite.
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <span className="terminal-text text-[10px] text-accent shrink-0 pt-0.5">nous</span>
                          <p className="terminal-text text-xs t-card-title leading-relaxed">
                            Done. I referenced the original delivery date from the contract and requested a revised timeline by Friday. Want me to send it?
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-3">
                        <CompanionIcon />
                        <CardTitle>Chat & Voice</CardTitle>
                      </div>
                      <p className="terminal-text text-xs t-card-desc leading-relaxed mb-4">
                        A conversational interface to Nous. Ask questions, run tasks, search your knowledge base — by text or voice. Works with any model backend.
                      </p>

                      <div className="space-y-2 mb-6">
                        {[
                          "Natural language chat with full context",
                          "Voice input & response",
                          "Connects to local and remote models",
                          "Web, desktop, and mobile",
                        ].map((feature) => (
                          <div key={feature} className="flex items-center gap-2">
                            <span className="text-accent text-[10px]">▸</span>
                            <span className="terminal-text text-[11px] t-card-desc">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {[
                          { label: "iOS", icon: <AppleIcon /> },
                          { label: "Android", icon: <AndroidIcon /> },
                        ].map(({ label, icon }) => (
                          <span
                            key={label}
                            className="inline-flex items-center gap-2 border border-white/[0.06] px-5 py-2.5 font-accent text-xs uppercase tracking-[0.15em] t-meta cursor-default"
                          >
                            {icon}
                            {label} — Coming soon
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── System requirements ────────────────────────────────────── */}
      <section className="relative px-6 md:px-12 lg:px-20 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <SectionHeader label="Requirements" size="small">
              System requirements
            </SectionHeader>
          </Reveal>

          <div className="bg-black/10 backdrop-blur-xl">
            <Reveal delay={100}>
              <div className="border-y border-white/[0.06]">
                <PanelBar label="nous::sysreq" meta="Minimum" />

                <div className="px-6 md:px-10 py-6 md:py-8">
                  <div className="space-y-4">
                    {SYSREQ.map((req, i) => (
                      <div key={req.label}>
                        <div className="flex items-baseline gap-4">
                          <span className="terminal-text text-[10px] uppercase tracking-[0.2em] t-panel-label w-12 shrink-0">
                            {req.label}
                          </span>
                          <span className="terminal-text text-xs t-card-desc leading-relaxed">
                            {req.value}
                          </span>
                        </div>
                        {i < SYSREQ.length - 1 && (
                          <div className="border-b border-white/4 mt-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ─────────────────────────────────────────────── */}
      <section className="relative px-6 md:px-12 lg:px-20 py-20 md:py-28">
        <div className="mx-auto max-w-5xl text-center">
          <Reveal>
            <p className="terminal-text text-sm t-card-desc mb-3">
              Don&apos;t want to self-host?
            </p>
            <a
              href="/#cta"
              className="terminal-text text-sm text-accent hover:underline transition-colors"
            >
              Nous Cloud is coming soon →
            </a>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
