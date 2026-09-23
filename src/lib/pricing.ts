import { pricing, cohort } from "@/content/course";

export type Tier = "founding" | "standard";

export type SeatState = {
  /** Places already paid for. */
  taken: number;
  /** Places left in the whole cohort. */
  remaining: number;
  /** Which price the next buyer pays. */
  tier: Tier;
  amount: number;
  /** Founding-five places still available, 0 once they are gone. */
  foundingRemaining: number;
  soldOut: boolean;
};

/**
 * Resolve the price for the next place from the number already sold.
 *
 * Brief §3: AED 2,000 for the first five places, AED 2,500 for the rest,
 * 10–15 places in total.
 *
 * This is a statement of fact about the price list, not a scarcity device —
 * the brief explicitly forbids countdown timers and manufactured urgency, so
 * the UI reports the real number and nothing more.
 */
export function resolveSeats(taken: number): SeatState {
  const safeTaken = Math.max(0, Math.min(taken, pricing.cohortCapacity));
  const foundingRemaining = Math.max(0, pricing.founding.seats - safeTaken);
  const tier: Tier = foundingRemaining > 0 ? "founding" : "standard";

  return {
    taken: safeTaken,
    remaining: pricing.cohortCapacity - safeTaken,
    tier,
    amount: tier === "founding" ? pricing.founding.amount : pricing.standard.amount,
    foundingRemaining,
    soldOut: safeTaken >= pricing.cohortCapacity,
  };
}

/** Stripe works in the smallest currency unit. AED has 2 decimal places. */
export function toMinorUnits(amount: number): number {
  return Math.round(amount * 100);
}

export function formatAED(amount: number): string {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: pricing.currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Cohort start date for display. Null until the client confirms it. */
export function cohortStartLabel(): string {
  if (!cohort.startDate) return cohort.startDateLabel;
  return new Date(cohort.startDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ------------------------------------------------------------------ */
/* Enrolment call to action                                            */
/* ------------------------------------------------------------------ */

export type EnrolCta = {
  href: string;
  /** Button label. */
  label: string;
  /** Same label with the price appended, where there is room for it. */
  labelWithPrice: string;
  /** Short form for the sticky bar, which is width-constrained. */
  shortLabel: string;
  /** True when the button leads to payment rather than the waitlist. */
  payable: boolean;
};

/**
 * One source for every "next step" button on the site.
 *
 * Buttons used to be labelled "Secure your place" unconditionally while the
 * enrolment page decided separately whether payment was actually available.
 * With no Stripe keys in the environment the two disagreed: the button
 * promised payment and the page it opened offered the waitlist instead.
 *
 * The label now comes from the same two facts the enrolment page gates on, so
 * a visitor is never invited to do something the next page will not let them
 * do. Until payment goes live, every primary button reads as the waitlist.
 */
export function enrolCta(seats: SeatState, paymentsOpen: boolean): EnrolCta {
  if (seats.soldOut) {
    return {
      href: "/waitlist",
      label: "Join the waitlist",
      labelWithPrice: "Join the waitlist",
      shortLabel: "Join waitlist",
      payable: false,
    };
  }

  if (!paymentsOpen) {
    return {
      href: "/waitlist",
      label: "Join the founding-cohort waitlist",
      labelWithPrice: "Join the founding-cohort waitlist",
      shortLabel: "Join the waitlist",
      payable: false,
    };
  }

  return {
    href: "/enrol",
    label: "Secure your place",
    labelWithPrice: `Secure your place — ${formatAED(seats.amount)}`,
    shortLabel: "Secure your place",
    payable: true,
  };
}
