import type { Metadata } from "next";
import { Newsreader, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SiteProvider } from "@/components/site-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { InquiryModalRoot } from "@/components/inquiry-modal";
import { ScrollTriggerRefresh } from "@/components/scroll-trigger-refresh";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { GlobalUtilities } from "@/components/global-utilities";
import { ThemeProvider } from "@/components/theme-provider";
import { CookieBanner } from "@/components/cookie-banner";
import { UTMTracker } from "@/components/utm-tracker";
import { Suspense } from "react";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

const plex = IBM_Plex_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Carte Clinique — Global Surgery & Care Concierge",
    template: "%s — Carte Clinique",
  },
  description:
    "A medical tourism and healthcare concierge connecting international patients with vetted providers, coordinated care, and a guided journey from discovery to recovery.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${instrument.variable} ${plex.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ScrollTriggerRefresh />
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2 focus:font-medium focus:text-paper"
          >
            Skip to content
          </a>
          <SiteProvider>
            <Header />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
            <InquiryModalRoot />
            <Analytics />
            <SpeedInsights />
            <GlobalUtilities />
            <CookieBanner />
            <Suspense fallback={null}>
              <UTMTracker />
            </Suspense>
          </SiteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
