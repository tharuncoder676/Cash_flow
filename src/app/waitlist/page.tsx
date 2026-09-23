import type { Metadata } from "next";
import WaitlistForm from "@/components/WaitlistForm";
import { Container, Eyebrow } from "@/components/primitives";
import { countEnrolments } from "@/lib/enrolments";
import { resolveSeats } from "@/lib/pricing";
import { pricing } from "@/content/course";

export const metadata: Metadata = {
  title: "Join the waitlist",
  description:
    "Be offered a place in the next Cash Flow Mastery cohort before it opens publicly.",
  alternates: { canonical: "/waitlist" },
};

export const dynamic = "force-dynamic";

export default async function WaitlistPage() {
  const seats = resolveSeats(await countEnrolments());

  return (
    <div className="bg-paper-200">
      <Container width="default" className="py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow className="mb-6">
            {seats.soldOut
              ? "This cohort is full"
              : `${seats.remaining} of ${pricing.cohortCapacity} places remain`}
          </Eyebrow>
          <h1 className="font-display text-[2.5rem] leading-[1.12] tracking-[-0.025em] text-balance text-ink-900 sm:text-5xl">
            Join the waitlist
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-pretty text-ink-400">
            {seats.soldOut
              ? "All places in the founding cohort have been taken. Leave your details and you will be offered a place in the next one before it is announced publicly."
              : "Not ready for this cohort? Leave your details and you will hear about the next one first, with dates and pricing."}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-2xl">
          <WaitlistForm />
        </div>
      </Container>
    </div>
  );
}
