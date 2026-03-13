import type { Metadata } from "next";
import { Geist, Montserrat_Alternates, IBM_Plex_Mono, Fira_Code } from "next/font/google";
import { GrainProvider } from "@/components/grain-overlay";
import { ScrollBar } from "@/components/scroll-bar";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const montserratAlternates = Montserrat_Alternates({
  variable: "--font-montserrat-alt",
  weight: ["600"],
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["600"],
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  weight: ["300", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Orthogonal",
  description: "Sovereign AI for everyone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full overflow-hidden">
      <body
        className={`${geist.variable} ${montserratAlternates.variable} ${ibmPlexMono.variable} ${firaCode.variable} antialiased h-full overflow-hidden`}
      >
        <GrainProvider>
          <div id="scroll-root" className="h-full">
            {children}
          </div>
          <ScrollBar />
        </GrainProvider>
      </body>
    </html>
  );
}
