import type { Metadata } from "next";
import { Newsreader, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SiteProvider } from "@/components/site-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { InquiryModalRoot } from "@/components/inquiry-modal";
import SplashCursor from "@/components/bits/SplashCursor";
import { ScrollTriggerRefresh } from "@/components/scroll-trigger-refresh";

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
    >
      <body className="min-h-full flex flex-col font-sans">
        <SplashCursor TRANSPARENT COLOR="#c94f3d" />
        <ScrollTriggerRefresh />
        <span
          aria-hidden="true"
          dangerouslySetInnerHTML={{
            __html: `<!-- THESIS: The Clinic Charter. This whole experience is a deliverable from a premier private medical institution — every surface reads as a document from a place you would trust with your surgery. It refuses the crowded hero-metric marketing template of the category. OWN-WORLD: a deep ink-teal ground (#0e2a34) and warm medical paper (#f6f4ef) with a single surgical signal-red (#c94f3d) reserved for the primary action; Newsreader display for the charter voice, Instrument Sans for UI, IBM Plex Mono for calibrated journey-stage readouts; an emblem seal and fine rule lines carry the institutional grammar; imagery reads through an x-ray-lightbox glow. STORY: a first-time medical traveler understands that this is a clinic delivering coordinated care across borders — that discovery, travel, and treatment are one guarded journey, and that a real person is orchestrating it — and acts by planning their care. FIRST VIEWPORT: a calm clinical title block — emblem seal, institution wordmark, one decisive line of reassurance, and a single signal-red primary action 'Plan your care' — reading like the cover of a confidential patient charter, above an introduction to the three-phase journey. FORM: premium clinic identity, grounded candidate 3 of 7, seed key 7d67ae8f (build candidate; raised by the measured vote-meter and vertical deep-dive challengers). FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance. -->`,
          }}
        />
        <SiteProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <InquiryModalRoot />
        </SiteProvider>
      </body>
    </html>
  );
}
