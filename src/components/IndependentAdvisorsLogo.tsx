/**
 * Independent Advisors logo.
 *
 * Redrawn as vector from the supplied artwork so it stays crisp at every
 * size, needs no image request, and takes its navy and gold from the site's
 * own tokens rather than a slightly different pair baked into a bitmap.
 *
 * Replace with the official SVG when brand assets arrive (docs/OPEN-ITEMS.md).
 *
 * `variant="mark"` gives the IA monogram alone, for tight spaces.
 */
export default function IndependentAdvisorsLogo({
  className = "h-7",
  variant = "full",
  tone = "light",
}: {
  className?: string;
  variant?: "full" | "mark";
  /** "dark" inverts the wordmark for navy backgrounds. */
  tone?: "light" | "dark";
}) {
  const navy = tone === "dark" ? "#FBF8F1" : "#0B1E45";
  const gold = tone === "dark" ? "#E8BC6C" : "#C8912B";

  if (variant === "mark") {
    return (
      <svg
        viewBox="0 0 92 86"
        className={`overflow-visible ${className}`}
        role="img"
        aria-label="Independent Advisors"
      >
        <text
          x="0"
          y="70"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="86"
          fontWeight="700"
          fill={navy}
        >
          I
        </text>
        <text
          x="26"
          y="70"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="86"
          fontWeight="700"
          fill={gold}
        >
          A
        </text>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 320 92"
      className={`overflow-visible ${className}`}
      role="img"
      aria-label="Independent Advisors"
    >
      {/* IA monogram — navy I, gold A, as in the supplied artwork. */}
      <text
        x="0"
        y="72"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="88"
        fontWeight="700"
        fill={navy}
      >
        I
      </text>
      <text
        x="27"
        y="72"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="88"
        fontWeight="700"
        fill={gold}
      >
        A
      </text>

      {/* Wordmark, stacked on two lines. */}
      <text
        x="100"
        y="42"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="40"
        fill={navy}
      >
        Independent
      </text>
      <text
        x="100"
        y="84"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="40"
        fill={navy}
      >
        Advisors
      </text>
    </svg>
  );
}
