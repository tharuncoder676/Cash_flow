"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, ButtonLink } from "./primitives";
import { Honeypot, useFillTimer } from "./FormGuard";

export default function WaitlistForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);
  const { elapsed } = useFillTimer();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    setState("sending");
    setMessage(null);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "waitlist",
          website: data.get("website"),
          elapsedMs: elapsed(),
          name: data.get("name"),
          email: data.get("email"),
          company: data.get("company"),
          marketingConsent: data.get("consent") === "on",
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

  if (state === "done") {
    return (
      <div className="rounded-xs border border-ink-700/12 bg-paper-50 p-8 sm:p-10">
        <h2 className="font-display text-2xl text-ink-900">
          You’re on the list.
        </h2>
        <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-ink-400">
          When the next cohort opens you will hear about it before it is
          announced publicly, with the dates and the price. No other email
          unless you ticked the box.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/diagnostic" variant="gold">
            Take the free diagnostic
          </ButtonLink>
          <ButtonLink href="/course" variant="ghost">
            See the programme
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="relative rounded-xs border border-ink-700/12 bg-paper-50 p-7 sm:p-10"
    >
      <Honeypot />
      <div className="grid gap-4 sm:grid-cols-2">
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

      <label className="mt-6 flex cursor-pointer items-start gap-3.5">
        <input
          type="checkbox"
          name="consent"
          className="mt-1 h-4 w-4 shrink-0 accent-gold-600"
        />
        <span className="text-[14px] leading-relaxed text-ink-400">
          Also email me occasional practical cash-flow guidance. You can
          unsubscribe from any email, and we do not share your details. See our{" "}
          <Link
            href="/legal/privacy"
            className="text-gold-700 underline underline-offset-4"
          >
            privacy policy
          </Link>
          .
        </span>
      </label>

      <p className="mt-4 text-[13px] leading-relaxed text-ink-300">
        Joining the waitlist does not reserve a place and costs nothing.
      </p>

      {state === "error" && message && (
        <p
          role="alert"
          className="mt-5 rounded-xs border border-signal-low/30 bg-signal-low/8 px-4 py-3 text-[14px] text-signal-low"
        >
          {message}
        </p>
      )}

      <Button type="submit" disabled={state === "sending"} className="mt-7">
        {state === "sending" ? "Adding you…" : "Join the waitlist"}
      </Button>
    </form>
  );
}

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
