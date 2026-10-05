import type { Metadata } from "next";
import { NotFoundInteractive } from "@/components/NotFoundInteractive";

export const metadata: Metadata = {
  title: "404 — Ledger Entry Not Found | Cash Flow Mastery",
  description:
    "The requested page is not found on the Cash Flow Mastery ledger. Reconcile your direction with our interactive forecast model, course syllabus, or free diagnostic.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundInteractive />;
}
