import type { Metadata } from "next";
import DiagnosticForm from "@/components/DiagnosticForm";
import { Container, Eyebrow } from "@/components/primitives";
import Mark from "@/components/Mark";
import { questions } from "@/content/diagnostic";

export const metadata: Metadata = {
  title: "Cash Visibility Diagnostic",
  description:
    "Ten questions about how your business handles money. Free, takes about four minutes, and tells you which part of your cash cycle to fix first.",
  alternates: { canonical: "/diagnostic" },
};

export default function DiagnosticPage() {
  return (
    <div className="bg-paper-200">
      <Container width="default" className="py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow className="mb-6">Free · no payment needed</Eyebrow>
          <h1 className="font-display text-[2.5rem] leading-[1.12] tracking-[-0.025em] text-balance text-ink-900 sm:text-5xl">
            How much of your cash
            <br className="hidden sm:block" />{" "}
            <span className="italic text-gold-600">can you actually see?</span>
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-pretty text-ink-400">
            {questions.length} questions, about four minutes. You get your
            result immediately —{" "}
            <Mark>no email required to see it</Mark>.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-3xl">
          <DiagnosticForm />
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center text-[14px] leading-relaxed text-ink-400">
          This is a self-assessment to point you at the right starting place.
          It is not an audit, and it is not financial advice about your
          business.
        </p>
      </Container>
    </div>
  );
}
