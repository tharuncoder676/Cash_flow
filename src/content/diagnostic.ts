/**
 * Cash Visibility Diagnostic — brief §5D / §4 "Start Here".
 *
 * Ten statements. Each maps to the week of the course that addresses it, so
 * the result can point somewhere specific instead of producing a vanity score.
 */

export type Focus = "week-1" | "week-2" | "week-3" | "week-4";

export type Question = {
  id: string;
  statement: string;
  focus: Focus;
  /**
   * Which answer indicates good cash discipline.
   *
   * Required, not optional. An optional "reverse" flag meant a negatively
   * worded statement could score the wrong way simply by nobody having
   * thought about it — which is what had happened to q3. Making the field
   * mandatory means the build fails until someone states the direction for
   * every statement, so `npm run build` is the systematic check on direction
   * that a reading pass cannot be relied on to be.
   */
  good: "yes" | "no";
};

export const answerOptions = [
  { value: 2, label: "Yes" },
  { value: 1, label: "Partly" },
  { value: 0, label: "No" },
] as const;

export const questions: Question[] = [
  {
    id: "q1",
    statement:
      "I could state my total cash position right now, without asking anyone.",
    focus: "week-1",
    good: "yes",
  },
  {
    id: "q2",
    statement:
      "I know the difference between last month’s profit and last month’s cash movement.",
    focus: "week-1",
    good: "yes",
  },
  {
    id: "q3",
    statement:
      "I understand why a fast-growing month can leave less cash in the bank, not more.",
    focus: "week-1",
    good: "yes",
  },
  {
    id: "q4",
    statement:
      "I know which customer owes us the most, and how overdue it is.",
    focus: "week-2",
    good: "yes",
  },
  {
    id: "q5",
    statement: "I know what we owe suppliers over the next 30 days.",
    focus: "week-2",
    good: "yes",
  },
  {
    id: "q6",
    statement:
      "We have delayed a supplier payment to manage cash in the last 12 months.",
    focus: "week-2",
    good: "no",
  },
  {
    id: "q7",
    statement: "I could tell you what our cash balance will be in eight weeks.",
    focus: "week-3",
    good: "yes",
  },
  {
    id: "q8",
    statement:
      "We have a written cash forecast that someone updates at least monthly.",
    focus: "week-3",
    good: "yes",
  },
  {
    id: "q9",
    statement:
      "A tax, VAT or annual payment has caught us out in the last year.",
    focus: "week-4",
    good: "no",
  },
  {
    id: "q10",
    statement:
      "We review cash on a fixed rhythm, out loud, with at least one other person.",
    focus: "week-4",
    good: "yes",
  },
];

export const MAX_SCORE = questions.length * 2;

export const bands = [
  {
    min: 16,
    label: "Good visibility",
    headline: "You can see most of it.",
    body: "You are already running with more cash discipline than most owner-led businesses. The value here is in the forecast itself — turning what you know into something you can test scenarios against before you commit.",
  },
  {
    min: 9,
    label: "Partial visibility",
    headline: "You can see the present, not the future.",
    body: "You know roughly where you stand today, but not where you will stand in two months. That is the gap where decisions get made on instinct — and it is exactly what the 13-week forecast closes.",
  },
  {
    min: 0,
    label: "Limited visibility",
    headline: "You are running on the bank balance.",
    body: "Right now the bank balance is doing the job a forecast should do. That works until one late payment and one lumpy bill land in the same fortnight. The good news: this is the fastest situation to improve.",
  },
] as const;

export const focusCopy: Record<Focus, { title: string; why: string }> = {
  "week-1": {
    title: "Week 1 — Profit is not cash",
    why: "Start here. Until the profit-versus-cash distinction is second nature, every other number is easy to misread.",
  },
  "week-2": {
    title: "Week 2 — Find the cash blockage",
    why: "Your cash is most likely trapped in the operating cycle — in receivables, stock or supplier terms. This is where the quick wins are.",
  },
  "week-3": {
    title: "Week 3 — Build your 13-week forecast",
    why: "You understand the position; what is missing is forward visibility. The forecast is the single highest-value thing you can build.",
  },
  "week-4": {
    title: "Week 4 — Run the business from cash",
    why: "You have the information but not the rhythm. A short weekly cash routine is what turns a forecast into decisions.",
  },
};

export function scoreDiagnostic(answers: Record<string, number>) {
  let total = 0;
  const byFocus: Record<Focus, { score: number; max: number }> = {
    "week-1": { score: 0, max: 0 },
    "week-2": { score: 0, max: 0 },
    "week-3": { score: 0, max: 0 },
    "week-4": { score: 0, max: 0 },
  };

  for (const q of questions) {
    const raw = answers[q.id];
    if (raw === undefined) continue;
    const value = q.good === "no" ? 2 - raw : raw;
    total += value;
    byFocus[q.focus].score += value;
    byFocus[q.focus].max += 2;
  }

  const band = bands.find((b) => total >= b.min) ?? bands[bands.length - 1];

  // Weakest area, measured as a proportion so uneven section sizes are fair.
  const focus = (Object.keys(byFocus) as Focus[])
    .filter((k) => byFocus[k].max > 0)
    .sort(
      (a, b) =>
        byFocus[a].score / byFocus[a].max - byFocus[b].score / byFocus[b].max,
    )[0];

  return { total, band, focus, byFocus };
}
