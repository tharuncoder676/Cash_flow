import Image from "next/image";
import { ViewTransition } from "react";
import ElectricBorder from "./ElectricBorder";
import { carl } from "@/content/course";

/**
 * Carl's portrait, treated rather than dropped in.
 *
 * The source is a studio headshot on a neutral grey backdrop. Left alone it
 * sits outside the palette; graded toward the navy it belongs to the page,
 * and lifts back to full colour on hover so the person is never hidden
 * behind an effect.
 *
 * The frame used to be two static gold corner rules, offset behind the
 * image. It is now the same gold hairline drawn live around the full edge —
 * the site's rule, rendered as a filament. The corner brackets were removed
 * rather than kept: two gold frames on one portrait competed with each other.
 *
 * Named for a view transition: going from the homepage to About, the small
 * portrait grows into the large one instead of one photo swapping for another.
 */
export default function Portrait({
  priority = false,
  className = "",
  size = "default",
}: {
  priority?: boolean;
  className?: string;
  size?: "default" | "compact";
}) {
  return (
    <ViewTransition name="carl-portrait" share="morph" default="none">
    <figure className={`group relative ${className}`}>
      <ElectricBorder color="#a87a2a" speed={1.1} chaos={0.12} thickness={2}>
        <div
          className={`relative overflow-hidden rounded-xs bg-ink-800 ${
            size === "compact" ? "aspect-[4/5]" : "aspect-[3/4]"
          }`}
        >
          <Image
            src="/carl-lewis.jpg"
            alt={`${carl.name}, ${carl.credentials} — ${carl.role}`}
            fill
            priority={priority}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 420px"
            className="object-cover object-[center_18%] grayscale-[35%] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] group-hover:grayscale-0"
          />

          {/* Navy grade — lifts away on hover. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-ink-700 mix-blend-color opacity-45 transition-opacity duration-700 group-hover:opacity-0"
          />
          {/* Bottom scrim so any caption below stays legible against the suit. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-900/55 to-transparent"
          />
        </div>
      </ElectricBorder>
    </figure>
    </ViewTransition>
  );
}
