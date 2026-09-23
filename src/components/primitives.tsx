import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------------ */

export function Container({
  children,
  className,
  width = "default",
}: {
  children: ReactNode;
  className?: string;
  width?: "default" | "narrow" | "wide";
}) {
  const w = {
    narrow: "max-w-3xl",
    default: "max-w-6xl",
    wide: "max-w-7xl",
  }[width];
  return (
    <div className={cx("mx-auto w-full px-6 sm:px-8", w, className)}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */

/**
 * Small uppercase label that opens a section. Mono, wide tracking — the
 * typographic signature carried over from Independent Advisors.
 */
export function Eyebrow({
  children,
  tone = "gold",
  className,
  ...rest
}: {
  children: ReactNode;
  tone?: "gold" | "cream" | "ink";
  className?: string;
} & Omit<ComponentProps<"p">, "children" | "className">) {
  const tones = {
    gold: "text-gold-700",
    cream: "text-gold-400",
    ink: "text-ink-400",
  };
  return (
    <p
      className={cx(
        "font-mono text-[11.5px] uppercase tracking-[0.18em] sm:text-[12px]",
        tones[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */

export function Rule({ tone = "gold" }: { tone?: "gold" | "cream" }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "block h-px w-10",
        tone === "gold" ? "bg-gold-600" : "bg-gold-400/60",
      )}
    />
  );
}

/* ------------------------------------------------------------------ */

type ButtonVariant = "primary" | "gold" | "ghost" | "onDark";

const buttonBase =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xs font-mono text-[11px] font-medium uppercase tracking-[0.14em] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 sm:text-[12px]";

const buttonSizes = {
  md: "px-7 py-4",
  sm: "px-5 py-3",
};

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "btn-sheen bg-ink-700 text-paper-100 hover:bg-ink-900 hover:shadow-[0_12px_32px_-12px_rgba(5,14,36,0.6)] hover:-translate-y-0.5",
  gold: "btn-sheen bg-gold-500 text-ink-700 hover:bg-gold-400 hover:shadow-[0_12px_32px_-12px_rgba(168,122,42,0.65)] hover:-translate-y-0.5",
  ghost:
    "border border-ink-700/25 text-ink-700 hover:border-ink-700/60 hover:bg-ink-700/[0.04] hover:-translate-y-0.5",
  onDark:
    "border border-paper-100/25 text-paper-100 hover:border-gold-400 hover:text-gold-400 hover:-translate-y-0.5",
};

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: {
  href: string;
  variant?: ButtonVariant;
  size?: "md" | "sm";
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">) {
  // Downloads and off-site links both need a real anchor: routing a PDF
  // through the client router would navigate rather than download.
  const isFile = /\.(pdf|xlsx?|docx?|zip|csv)$/i.test(href);
  const external =
    href.startsWith("http") || href.startsWith("mailto:") || isFile;
  const classes = cx(
    buttonBase,
    buttonSizes[size],
    buttonVariants[variant],
    className,
  );

  // Only the weighty variants lean toward the cursor; ghost links stay put.
  const magnetic =
    variant === "primary" || variant === "gold" ? { "data-magnetic": "" } : {};

  if (external) {
    return (
      <a
        href={href}
        className={classes}
        {...(isFile
          ? { download: "" }
          : { target: "_blank", rel: "noopener noreferrer" })}
        {...magnetic}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...magnetic} {...rest}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: {
  variant?: ButtonVariant;
  size?: "md" | "sm";
} & ComponentProps<"button">) {
  return (
    <button
      className={cx(
        buttonBase,
        buttonSizes[size],
        buttonVariants[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */

/**
 * Section wrapper. `tone` sets the band colour — the page rhythm alternates
 * paper / sand / ink so long scrolls stay navigable.
 */
export function Section({
  children,
  tone = "paper",
  id,
  className,
  width,
}: {
  children: ReactNode;
  tone?: "paper" | "sand" | "ink" | "none";
  id?: string;
  className?: string;
  width?: "default" | "narrow" | "wide";
}) {
  const tones = {
    paper: "bg-paper-100 text-ink-800",
    sand: "bg-paper-200 text-ink-800",
    // band-ink adds a slow radial drift; grain stops the large navy
    // areas from banding on wide screens.
    ink: "bg-ink-700 text-paper-100 band-ink grain",
    none: "",
  };
  return (
    <section
      id={id}
      className={cx(
        "relative py-10 sm:py-14 lg:py-20",
        tones[tone],
        className,
      )}
    >
      <Container width={width}>{children}</Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function SectionHeading({
  eyebrow,
  title,
  lede,
  tone = "ink",
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  tone?: "ink" | "cream";
  align?: "left" | "center";
  className?: string;
}) {
  const dark = tone === "cream";
  return (
    <div
      className={cx(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <Eyebrow tone={dark ? "cream" : "gold"} className="mb-5">
          {eyebrow}
        </Eyebrow>
      )}
      <h2
        className={cx(
          "font-display text-[1.65rem] leading-[1.12] tracking-[-0.02em] text-balance sm:text-[2.3rem] lg:text-[2.9rem]",
          dark ? "text-paper-100" : "text-ink-900",
        )}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={cx(
            "mt-3.5 text-[16px] leading-[1.58] text-pretty sm:mt-4 sm:text-[17.5px]",
            dark ? "text-paper-300/80" : "text-ink-400",
          )}
        >
          {lede}
        </p>
      )}
    </div>
  );
}
