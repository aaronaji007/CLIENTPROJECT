import Link from "next/link";
import { Emblem } from "@/components/header";
import { ConsultBooking } from "@/components/consult-booking";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Plan your care",
  description:
    "Start a confidential care conversation with a Carte Clinique clinical lead.",
};

export default function ConsultPage() {
  return (
    <div className="bg-paper">
      <section className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
        <div className="mb-6 inline-flex items-center gap-3">
          <Emblem className="h-10 w-10" />
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink/60">
            The Clinic Charter
          </span>
        </div>
        <h1 className="font-display text-4xl font-medium leading-tight text-ink sm:text-5xl">
          Plan your care
        </h1>
        <p className="mt-4 text-ink/70">
          A short, confidential form. No commitment and no sales call — a
          clinical lead replies with a realistic path and a written estimate.
        </p>

        <div className="mt-10 rounded-3xl border border-line bg-paper p-6 shadow-panel sm:p-8">
          <ConsultBooking />
        </div>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline" className="px-6 py-3 text-sm">
              Back to home
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
