import { MapPin, Phone, MessageCircle, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/contact-form";

export const metadata = {
  title: "Contact Us",
  description:
    "Connect directly with MedyCare 2₹ism regional coordination teams in Sydney, Australia and Thrissur, Kerala, India.",
};

const offices = [
  {
    region: "Australia Office",
    location: "Australia — Sydney",
    subLocation: "Sydney, New South Wales, Australia",
    phoneDisplay: "+61 466588037",
    phoneHref: "tel:+61466588037",
    whatsappHref: "https://wa.me/61466588037",
    summary:
      "Patient consultations, clinical record intake, travel planning, and post-return recovery coordination for Australian and international patients.",
  },
  {
    region: "India Office",
    location: "India — Thrissur, Kerala",
    subLocation: "Thrissur, Kerala, India",
    phoneDisplay: "+91 72931 19311",
    phoneHref: "tel:+917293119311",
    whatsappHref: "https://wa.me/917293119311",
    summary:
      "Direct hospital liaison, specialist scheduling, airport & clinical transfers, and on-ground patient concierge care.",
  },
];

export default function ContactPage() {
  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-signal font-semibold">
            Contact Us
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium leading-tight text-ink sm:text-5xl">
            Reach our regional coordination teams
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink/70">
            With dedicated presence in both Sydney, Australia and Thrissur, Kerala, India, one
            coordinated team supports you before departure, on the ground, and after you return home.
          </p>
        </div>

        {/* Regional Office Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {offices.map((office) => (
            <div
              key={office.location}
              className="flex flex-col justify-between rounded-2xl border border-line bg-[#18231c] dark:bg-[#121614] p-7 text-[#f4efe2] shadow-panel sm:p-8"
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#f4efe2]/15 bg-[#f4efe2]/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-signal font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden="true" />
                    {office.region}
                  </span>
                </div>

                <h2 className="mt-5 font-display text-2xl font-medium text-[#f4efe2] sm:text-3xl">
                  {office.location}
                </h2>

                <p className="mt-2 flex items-center gap-2 text-sm text-[#f4efe2]/70">
                  <MapPin className="h-4 w-4 shrink-0 text-signal" />
                  <span>{office.subLocation}</span>
                </p>

                <p className="mt-4 text-sm leading-relaxed text-[#f4efe2]/80">
                  {office.summary}
                </p>

                <div className="mt-6 border-t border-[#f4efe2]/15 pt-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#f4efe2]/55">
                    Mobile Number
                  </p>
                  <a
                    href={office.phoneHref}
                    className="mt-1.5 inline-flex items-center gap-2.5 font-mono text-xl font-semibold text-[#f4efe2] hover:text-signal transition-colors sm:text-2xl"
                  >
                    <Phone className="h-5 w-5 text-signal" />
                    <span>{office.phoneDisplay}</span>
                  </a>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 pt-2">
                <a
                  href={office.phoneHref}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm bg-signal px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-signal-deep"
                >
                  <Phone className="h-4 w-4" />
                  Call directly
                </a>
                <a
                  href={office.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm border border-[#f4efe2]/25 bg-[#f4efe2]/10 px-4 py-2.5 text-sm font-medium text-[#f4efe2] transition-colors hover:border-[#f4efe2] hover:bg-[#f4efe2]/15"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form + Reassurance */}
        <div className="mt-14 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <ContactForm />

          <aside className="rounded-2xl border border-line bg-paper-deep/50 p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-6 w-6 shrink-0 text-signal mt-0.5" />
              <div>
                <h3 className="font-display text-xl font-medium text-ink">
                  Seamless cross-border support
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  Whether you are reaching out from Australia, India, or anywhere else, your case is
                  handled by one connected team — never passed between disconnected agencies.
                </p>
              </div>
            </div>

            <div className="border-t border-line pt-5 space-y-4 text-sm">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/50">
                  Australia — Sydney
                </p>
                <a
                  href="tel:+61466588037"
                  className="mt-1 block font-mono font-semibold text-ink hover:text-signal"
                >
                  +61 466588037
                </a>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/50">
                  India — Thrissur, Kerala
                </p>
                <a
                  href="tel:+917293119311"
                  className="mt-1 block font-mono font-semibold text-ink hover:text-signal"
                >
                  +91 72931 19311
                </a>
              </div>
            </div>

            <div className="border-t border-line pt-5 text-xs leading-relaxed text-ink/60">
              24/7 recovery coordination line available for active travelling patients and families.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
