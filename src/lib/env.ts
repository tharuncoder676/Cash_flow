/**
 * Indexing guard.
 *
 * Default is NOT indexable. A pre-launch site on a preview URL that Google
 * crawls is a real problem: it competes with the eventual live domain, and a
 * half-finished page can sit in search results for weeks after launch.
 *
 * So indexing is opt-in, once, deliberately — set `NEXT_PUBLIC_ALLOW_INDEXING`
 * to "true" in the production environment only, at go-live. Every preview
 * deployment and every local build stays hidden without anyone remembering to
 * do anything.
 */
export function isIndexable(): boolean {
  return process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
}

/** True on client review builds — drives the visible staging banner. */
export function isPreview(): boolean {
  return !isIndexable();
}
