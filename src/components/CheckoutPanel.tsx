"use client";

import { useCallback, useMemo, useState } from "react";
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
    <div className="rounded-xs border border-ink-700/12 bg-white p-2 sm:p-3">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ fetchClientSecret }}
      >
        <EmbeddedCheckout className="min-h-[520px]" />
      </EmbeddedCheckoutProvider>
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
