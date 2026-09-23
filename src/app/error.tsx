"use client";

import { useEffect } from "react";
import {
  Button,
  ButtonLink,
  Container,
  Eyebrow,
} from "@/components/primitives";

/**
 * Shown when a page throws while rendering. The header and footer stay in
 * place, so the visitor is never stranded.
 *
 * The error message itself is never shown: it can contain internal detail.
 * Next.js supplies a short digest instead, which matches the server log and
 * is safe to give a visitor to quote to support.
 */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="bg-paper-200 py-20 sm:py-28">
      <Container width="narrow">
        <Eyebrow className="mb-6">Something went wrong</Eyebrow>
        <h1 className="font-display text-[2.6rem] leading-[1.12] tracking-[-0.025em] text-balance text-ink-900 sm:text-5xl">
          This page didn’t load properly.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-ink-400">
          It’s a problem on our side, not something you did. Try again — and
          if it keeps happening, email us and we’ll sort it out.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button type="button" onClick={reset}>
            Try again
          </Button>
          <ButtonLink href="/" variant="ghost">
            Back to the homepage
          </ButtonLink>
        </div>

        {error.digest && (
          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400">
            Reference: {error.digest}
          </p>
        )}
      </Container>
    </section>
  );
}
