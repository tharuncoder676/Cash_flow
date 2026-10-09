"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import Link from "next/link";

/**
 * Stripe Embedded Checkout, mounted on our own page.
 *
 * Card details are entered inside Stripe's iframe and never touch this
 * application — which keeps the build out of PCI scope and satisfies the
 * brief's instruction not to custom-build payments.
 */
export default function CheckoutPanel({
  publishableKey,
}: {
  publishableKey: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);

  // Seat Reservation Countdown Timer (15 minutes)
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const stripePromise = useMemo(
    () => loadStripe(publishableKey),
    [publishableKey],
  );

  const fetchClientSecret = useCallback(async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      if (data.error === "sold_out") {
        setError("sold_out");
      } else {
        setError(data.error ?? "Could not start checkout.");
      }
      throw new Error(data.error ?? "checkout_failed");
    }

    const data = (await res.json()) as { clientSecret: string };
    return data.clientSecret;
  }, []);

  if (error === "sold_out") {
    return (
      <Notice
        title="This cohort is full"
        body="All fifteen places have been taken. Join the waitlist and you'll be offered a place in the next cohort before it opens publicly."
        action={{ href: "/waitlist", label: "Join the waitlist" }}
      />
    );
  }

  if (error) {
    return (
      <Notice
        title="Checkout couldn’t start"
        body={error}
        action={{ href: "/enrol", label: "Try again" }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* ---------------------------------------------------------- */}
      {/* Live Seat Reservation Countdown Timer                       */}
      {/* ---------------------------------------------------------- */}
      <div className="flex items-center justify-between rounded-xs border border-gold-600/30 bg-gold-500/10 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold-600" />
          </span>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-900">
            Founding Seat Held For You
          </span>
        </div>
        <span className="tabular font-mono text-xs font-bold uppercase tracking-[0.14em] text-gold-800">
          {formattedTime}
        </span>
      </div>

      {/* Compliance & Policy Acceptance Checkbox --------------------- */}
      <div className="rounded-xs border border-ink-700/15 bg-paper-50 p-5 sm:p-6">
        <label className="flex items-start gap-3.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 h-4 w-4 rounded-xs border-ink-700/30 text-gold-600 focus:ring-gold-500"
          />
          <span className="text-[14px] leading-relaxed text-ink-700">
            I confirm that I have read and agree to the{" "}
            <Link
              href="/legal/terms"
              target="_blank"
              className="text-gold-700 underline underline-offset-4 hover:text-gold-800"
            >
              Course Terms of Sale
            </Link>
            ,{" "}
            <Link
              href="/legal/refunds"
              target="_blank"
              className="text-gold-700 underline underline-offset-4 hover:text-gold-800"
            >
              Refund and Cancellation Policy
            </Link>
            ,{" "}
            <Link
              href="/legal/privacy"
              target="_blank"
              className="text-gold-700 underline underline-offset-4 hover:text-gold-800"
            >
              Privacy Policy
            </Link>
            , and{" "}
            <Link
              href="/legal/disclaimer"
              target="_blank"
              className="text-gold-700 underline underline-offset-4 hover:text-gold-800"
            >
              Training Disclaimer
            </Link>
            .
          </span>
        </label>
      </div>

      {agreed ? (
        <div className="rounded-xs border border-ink-700/12 bg-white p-2 sm:p-3">
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ fetchClientSecret }}
          >
            <EmbeddedCheckout className="min-h-[520px]" />
          </EmbeddedCheckoutProvider>
        </div>
      ) : (
        <div className="rounded-xs border border-dashed border-ink-700/20 bg-paper-50/50 p-8 text-center sm:p-12">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-400">
            Step 2 — Policy Confirmation
          </p>
          <h3 className="mt-3 font-display text-xl text-ink-900">
            Please accept the policy terms above to proceed to payment
          </h3>
          <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-ink-400">
            Review the terms, refund conditions, and privacy notice. Checking the box activates the secure Stripe checkout.
          </p>
        </div>
      )}
    </div>
  );
}

function Notice({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action: { href: string; label: string };
}) {
  return (
    <div className="rounded-xs border border-ink-700/15 bg-paper-50 p-8 text-center sm:p-10">
      <h2 className="font-display text-2xl text-ink-900">{title}</h2>
      <p className="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-ink-400">
        {body}
      </p>
      <Link
        href={action.href}
        className="mt-7 inline-flex items-center justify-center whitespace-nowrap rounded-xs bg-ink-700 px-7 py-4 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-paper-100 transition-colors hover:bg-ink-900"
      >
        {action.label}
      </Link>
    </div>
  );
}
