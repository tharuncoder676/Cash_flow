"use client";

import { useRef, useState } from "react";
import { cohort, weeks } from "@/content/course";

/**
 * The four-week curriculum as a guided walk rather than a wall of text.
 *
 * A proper ARIA tablist: arrow keys move between weeks, Home/End jump to the
 * ends, and only the active tab is in the tab order. The panel is focusable
 * so a keyboard user lands on the content they just selected.
 */
export default function CurriculumExplorer() {
  const [active, setActive] = useState(1); // open on Week 1, not "Start here"
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const week = weeks[active];

  function onKeyDown(event: React.KeyboardEvent) {
    const last = weeks.length - 1;
    let next: number | null = null;

    if (event.key === "ArrowDown" || event.key === "ArrowRight")
      next = active === last ? 0 : active + 1;
    if (event.key === "ArrowUp" || event.key === "ArrowLeft")
      next = active === 0 ? last : active - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = last;

    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,290px)_minmax(0,1fr)] lg:gap-14">
      {/* Week rail ------------------------------------------------- */}
      <div
        role="tablist"
        aria-label="Course curriculum by week"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {weeks.map((w, i) => {
          const selected = i === active;
          return (
            <button
              key={w.slug}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`week-tab-${w.slug}`}
              aria-selected={selected}
              aria-controls={`week-panel-${w.slug}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={`group relative shrink-0 text-left transition-colors duration-300 lg:w-full lg:shrink ${
                selected ? "text-ink-900" : "text-ink-400 hover:text-ink-900"
              }`}
            >
              {/* Desktop: a rail with a gold marker that slides to the
                  active week. Mobile: pill-style chips. */}
              <span className="hidden lg:block">
                <span className="flex items-baseline gap-4 border-l border-ink-700/15 py-4 pl-5">
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 w-px bg-gold-600 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      selected ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      top: `${active * (100 / weeks.length)}%`,
                      height: `${100 / weeks.length}%`,
                    }}
                  />
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-gold-700">
                    {w.label}
                  </span>
                </span>
                <span
                  className={`block pb-4 pl-5 font-display text-lg leading-snug transition-all duration-300 ${
                    selected ? "translate-x-1" : "translate-x-0"
                  }`}
                >
                  {w.title}
                </span>
              </span>

              <span
                className={`flex items-center gap-2.5 whitespace-nowrap rounded-xs border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-300 lg:hidden ${
                  selected
                    ? "border-gold-600 bg-gold-500/12 text-gold-700"
                    : "border-ink-700/20"
                }`}
              >
                {w.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Panel ------------------------------------------------------ */}
      <div
        key={week.slug}
        role="tabpanel"
        id={`week-panel-${week.slug}`}
        aria-labelledby={`week-tab-${week.slug}`}
        tabIndex={0}
        className="animate-[panelIn_0.5s_cubic-bezier(0.16,1,0.3,1)] rounded-xs border border-ink-700/12 bg-paper-50 p-7 sm:p-9 lg:p-10"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold-700">
            {week.label}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-400">
            {week.lessons.length} lesson{week.lessons.length === 1 ? "" : "s"} ·{" "}
            {active + 1} of {weeks.length}
          </p>
        </div>

        <h3 className="mt-3 font-display text-[1.9rem] leading-[1.12] tracking-[-0.02em] text-ink-900 sm:text-[2.4rem]">
          {week.title}
        </h3>

        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-400">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-300">
            Outcome —{" "}
          </span>
          {week.outcome}
        </p>

        {/* Lessons stagger in as the panel changes. */}
        <ol className="mt-8 space-y-px overflow-hidden rounded-xs bg-ink-700/8">
          {week.lessons.map((lesson, i) => (
            <li
              key={lesson.title}
              className="flex animate-[lessonIn_0.5s_backwards_cubic-bezier(0.16,1,0.3,1)] items-baseline gap-4 bg-paper-50 px-5 py-3.5 transition-colors duration-200 hover:bg-paper-100"
              style={{ animationDelay: `${80 + i * 55}ms` }}
            >
              <span className="font-mono text-[10px] tracking-[0.12em] text-gold-700">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[15.5px] leading-relaxed text-ink-800">
                {lesson.title}
              </span>
            </li>
          ))}
        </ol>

        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-300">
          {cohort.weeklyCommitment}
        </p>

        <dl className="mt-6 grid gap-6 border-t border-ink-700/10 pt-6 sm:grid-cols-2">
          {week.exercise && (
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-300">
                Your exercise
              </dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-ink-400">
                {week.exercise}
              </dd>
            </div>
          )}
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-300">
              Live session
            </dt>
            <dd className="mt-2 text-[15px] leading-relaxed text-ink-400">
              {week.live}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
