import { pricing, cohort } from "@/content/course";

export type Tier = "founding" | "founding_five" | "founding_cohort" | "standard";

export type SeatState = {
  /** Places already paid for. */
  taken: number;
  /** Places left in the whole cohort (out of 15). */
  remaining: number;
  /** Which price tier the next buyer pays. */
  tier: "founding_five" | "founding_cohort";
  /** The price amount in USD. */
  amount: number;
  /** Label for the tier. */
  tierLabel: string;
  /** Anchor future price ($995). */
  anchorPrice: number;
  /** Founding-five places still available (out of 5), 0 once taken >= 5. */
  foundingRemaining: number;
  soldOut: boolean;
};

/**
 * Resolve the price for the next place from the number already sold.
 *
 * Requirements:
 * - First Five Founder Places: First 5 participants -> USD 550
 * - Founding Cohort (Remaining): Next 10 participants -> USD 695
 * - The price automatically changes from USD 550 to USD 695 after the first 5 places are purchased.
 * - Total founding cohort capacity: 15 places.
 */
export function resolveSeats(taken: number): SeatState {
  const safeTaken = Math.max(0, Math.min(taken, pricing.cohortCapacity));
  const foundingFiveRemaining = Math.max(0, pricing.foundingFive.seats - safeTaken);
  const isFoundingFive = foundingFiveRemaining > 0;

  const tier: "founding_five" | "founding_cohort" = isFoundingFive
    ? "founding_five"
    : "founding_cohort";

  const amount = isFoundingFive
    ? pricing.foundingFive.amount
    : pricing.foundingCohort.amount;

  const tierLabel = isFoundingFive
    ? pricing.foundingFive.label
    : pricing.foundingCohort.label;

  return {
    taken: safeTaken,
    remaining: pricing.cohortCapacity - safeTaken,
    tier,
    amount,
    tierLabel,
    anchorPrice: 995,
    foundingRemaining: foundingFiveRemaining,
    soldOut: safeTaken >= pricing.cohortCapacity,
  };
}

/** Stripe works in the smallest currency unit. USD has 2 decimal places (cents). */
export function toMinorUnits(amount: number): number {
  return Math.round(amount * 100);
}

/** Format currency in USD ($550, $1,795). */
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Alias for formatUSD */
export function formatPrice(amount: number): string {
  return formatUSD(amount);
}

/** Backwards-compatible alias */
export const formatAED = formatUSD;

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
    labelWithPrice: `Secure your place — ${formatUSD(seats.amount)}`,
    shortLabel: "Secure your place",
    payable: true,
  };
}
