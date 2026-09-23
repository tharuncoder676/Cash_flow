"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Button, ButtonLink, Eyebrow } from "./primitives";
import { Honeypot, useFillTimer } from "./FormGuard";
import {
  MAX_SCORE,
  answerOptions,
  focusCopy,
  questions,
  scoreDiagnostic,
} from "@/content/diagnostic";

type Stage = "questions" | "result";

export default function DiagnosticForm() {
  const [stage, setStage] = useState<Stage>("questions");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const headingRef = useRef<HTMLParagraphElement>(null);

  const question = questions[index];
  const answered = Object.keys(answers).length;
  const progress = (answered / questions.length) * 100;

  const result = useMemo(
    () => (stage === "result" ? scoreDiagnostic(answers) : null),
    [stage, answers],
  );

  function choose(value: number) {
    const next = { ...answers, [question.id]: value };
    setAnswers(next);

    if (index < questions.length - 1) {
      setIndex(index + 1);
      // Move focus to the new question so keyboard and screen-reader users
      // are not left on a button that has just changed meaning.
      requestAnimationFrame(() => headingRef.current?.focus());
    } else {
      setStage("result");
    }
  }

  function back() {
    if (index === 0) return;
    setIndex(index - 1);
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  function restart() {
    setAnswers({});
    setIndex(0);
    setStage("questions");
  }

  /* ---------------------------------------------------------------- */

  if (stage === "result" && result) {
    return (
      <DiagnosticResult
        total={result.total}
        bandLabel={result.band.label}
        headline={result.band.headline}
        body={result.band.body}
        focusTitle={focusCopy[result.focus].title}
        focusWhy={focusCopy[result.focus].why}
        onRestart={restart}
      />
    );
  }

  return (
    <div className="rounded-xs border border-ink-700/12 bg-paper-50">
      {/* Progress -------------------------------------------------- */}
      <div className="border-b border-ink-700/10 px-6 py-4 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
            Question {index + 1} of {questions.length}
          </span>
          <span className="tabular font-mono text-[10px] tracking-[0.12em] text-gold-700">
            {Math.round(progress)}%
          </span>
        </div>
        <div
          className="mt-3 h-0.5 w-full overflow-hidden rounded-full bg-ink-700/10"
          role="progressbar"
          aria-valuenow={answered}
          aria-valuemin={0}
          aria-valuemax={questions.length}
          aria-label="Diagnostic progress"
        >
          <div
            className="h-full bg-gold-600 transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question --------------------------------------------------- */}
      <div className="px-6 py-10 sm:px-10 sm:py-14">
        <p
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-[1.65rem] leading-[1.25] text-balance text-ink-900 outline-none sm:text-[2.1rem]"
        >
          {question.statement}
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          {answerOptions.map((opt) => {
            const selected = answers[question.id] === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => choose(opt.value)}
                aria-pressed={selected}
                className={`flex-1 rounded-xs border px-6 py-4 text-left font-mono text-[11px] uppercase tracking-[0.14em] transition-all duration-200 sm:text-center ${
                  selected
                    ? "border-gold-600 bg-gold-500/15 text-gold-700"
                    : "border-ink-700/20 text-ink-700 hover:border-ink-700/50 hover:bg-ink-700/[0.03]"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={back}
            disabled={index === 0}
            className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-400 transition-colors hover:text-ink-900 disabled:cursor-not-allowed disabled:opacity-35"
          >
            ← Previous
          </button>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-300">
            No email needed to see your result
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Result + lead capture                                               */
/* ------------------------------------------------------------------ */

function DiagnosticResult({
  total,
  bandLabel,
  headline,
  body,
  focusTitle,
  focusWhy,
  onRestart,
}: {
  total: number;
  bandLabel: string;
  headline: string;
  body: string;
  focusTitle: string;
  focusWhy: string;
  onRestart: () => void;
}) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);
  const { elapsed } = useFillTimer();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setState("sending");
    setMessage(null);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "diagnostic",
          website: data.get("website"),
          elapsedMs: elapsed(),
          name: data.get("name"),
          email: data.get("email"),
          company: data.get("company"),
          marketingConsent: data.get("consent") === "on",
          score: total,
        }),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(payload.error ?? "Something went wrong.");
      }

      setState("done");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="overflow-hidden rounded-xs border border-ink-700/12 bg-paper-50">
      {/* Score ------------------------------------------------------ */}
      <div className="border-b border-ink-700/10 bg-ink-700 px-6 py-10 text-paper-100 sm:px-10">
        <Eyebrow tone="cream" className="mb-5">
          {bandLabel}
        </Eyebrow>
        <div className="flex flex-wrap items-end gap-x-5 gap-y-2">
          <span className="tabular font-display text-[3.5rem] leading-none text-paper-100">
            {total}
            <span className="text-2xl text-paper-300/65">/{MAX_SCORE}</span>
          </span>
          <h2 className="font-display text-2xl leading-tight text-gold-500 sm:text-3xl">
            {headline}
          </h2>
        </div>
        <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-paper-300/75">
          {body}
        </p>

        {/* Honest scale */}
        <div
          className="mt-8 h-1 w-full max-w-md overflow-hidden rounded-full bg-paper-100/15"
          role="img"
          aria-label={`Score ${total} out of ${MAX_SCORE}`}
        >
          <div
            className="h-full bg-gold-500 transition-[width] duration-700 ease-out"
            style={{ width: `${(total / MAX_SCORE) * 100}%` }}
          />
        </div>
      </div>

      {/* Focus ------------------------------------------------------ */}
      <div className="border-b border-ink-700/10 px-6 py-9 sm:px-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
          Start with
        </p>
        <h3 className="mt-3 font-display text-2xl text-ink-900">
          {focusTitle}
        </h3>
        <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink-400">
          {focusWhy}
        </p>
      </div>

      {/* Lead capture ----------------------------------------------- */}
      <div className="px-6 py-9 sm:px-10">
        {state === "done" ? (
          <div>
            <h3 className="font-display text-2xl text-ink-900">
              On its way.
            </h3>
            <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-ink-400">
              Check your inbox for the Cash Visibility Diagnostic worksheet and
              the cash warning-signs checklist. If nothing arrives in ten
              minutes, look in spam — then email us and we will send it again.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/course">See the founding cohort</ButtonLink>
              <Button variant="ghost" onClick={onRestart} type="button">
                Retake the diagnostic
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="relative">
            <Honeypot />
            <h3 className="font-display text-2xl text-ink-900">
              Send me the worksheet
            </h3>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-400">
              We will email the full diagnostic worksheet and the cash
              warning-signs checklist so you can work through it properly.
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <Field name="name" label="Your name" autoComplete="name" />
              <Field
                name="email"
                label="Email"
                type="email"
                required
                autoComplete="email"
              />
              <div className="sm:col-span-2">
                <Field
                  name="company"
                  label="Company (optional)"
                  autoComplete="organization"
                />
              </div>
            </div>

            {/* Consent — brief §8 requires explicit capture, never pre-ticked */}
            <label className="mt-6 flex cursor-pointer items-start gap-3.5">
              <input
                type="checkbox"
                name="consent"
                className="mt-1 h-4 w-4 shrink-0 accent-gold-600"
              />
              <span className="text-[14px] leading-relaxed text-ink-400">
                Email me occasional practical cash-flow guidance and news about
                the founding cohort. You can unsubscribe from any email. We do
                not share your details. See our{" "}
                <Link
                  href="/legal/privacy"
                  className="text-gold-700 underline underline-offset-4"
                >
                  privacy policy
                </Link>
                .
              </span>
            </label>

            {state === "error" && message && (
              <p
                role="alert"
                className="mt-5 rounded-xs border border-signal-low/30 bg-signal-low/8 px-4 py-3 text-[14px] text-signal-low"
              >
                {message}
              </p>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Button type="submit" disabled={state === "sending"}>
                {state === "sending" ? "Sending…" : "Send me the worksheet"}
              </Button>
              <button
                type="button"
                onClick={onRestart}
                className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-400 transition-colors hover:text-ink-900"
              >
                Retake
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Field({
  name,
  label,
  type = "text",
  required,
  autoComplete,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block font-mono text-[10px] uppercase tracking-[0.14em] text-ink-400"
      >
        {label}
        {required && <span className="text-gold-700"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-xs border border-ink-700/20 bg-white px-4 py-3 text-[15px] text-ink-900 transition-colors placeholder:text-ink-300 focus:border-gold-600 focus:outline-none"
      />
    </div>
  );
}
