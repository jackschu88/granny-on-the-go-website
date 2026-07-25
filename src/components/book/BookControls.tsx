"use client";

import { BOOK_PAGES } from "@/lib/book-pages";

type Props = {
  pageIndex: number;
  turning: boolean;
  onPrev: () => void;
  onNext: () => void;
  onGoTo: (index: number) => void;
};

export default function BookControls({
  pageIndex,
  turning,
  onPrev,
  onNext,
  onGoTo,
}: Props) {
  const isFirst = pageIndex <= 0;
  const isLast = pageIndex >= BOOK_PAGES.length - 1;

  return (
    <div className="mt-2 flex w-full flex-col items-center gap-2 px-2 sm:mt-3 sm:gap-2.5">
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={turning}
          className="rounded-full border border-warm-beige bg-warm-white/95 px-4 py-2 font-sans text-sm text-deep-burgundy shadow-sm transition hover:bg-warm-beige/40 disabled:cursor-wait disabled:opacity-60"
          aria-label={isFirst ? "Close book and return to cover" : "Previous page"}
        >
          {isFirst ? "← Cover" : "← Previous"}
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={isLast || turning}
          className="btn-primary px-5 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-35"
          aria-label={isLast ? "End of book" : "Next page"}
        >
          {isLast ? "The End" : "Turn the Page →"}
        </button>
      </div>

      <div
        className="flex flex-wrap items-center justify-center gap-1.5"
        role="tablist"
        aria-label="Pages"
      >
        {BOOK_PAGES.map((p, i) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={i === pageIndex}
            aria-label={`Go to ${p.title}`}
            disabled={turning}
            onClick={() => onGoTo(i)}
            className={`h-2 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta disabled:cursor-wait ${
              i === pageIndex
                ? "w-5 bg-terracotta"
                : "w-2 bg-charcoal/20 hover:bg-charcoal/40"
            }`}
          />
        ))}
      </div>

      <p className="text-center font-sans text-[11px] text-charcoal/35">
        ← → keys · swipe · click page edges
      </p>
    </div>
  );
}
