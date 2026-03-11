import type { Metadata } from "next";
import { Geist, Montserrat_Alternates, IBM_Plex_Mono, Fira_Code } from "next/font/google";
import { RootProvider } from "fumadocs-ui/provider/next";
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
  title: {
    template: "%s | Orthogonal Docs",
    default: "Orthogonal Docs",
  },
  description: "Documentation for Nous — Sovereign AI for everyone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geist.variable} ${montserratAlternates.variable} ${ibmPlexMono.variable} ${firaCode.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased scanlines">
        <div className="grain fixed inset-0 pointer-events-none z-[9998]" />
        <RootProvider
          theme={{
            enabled: false,
            defaultTheme: "dark",
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
