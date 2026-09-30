"use client";

import { BOOK_PAGES } from "@/lib/book-pages";
import { SoundToggle } from "@/components/book/AmbientSound";

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
    <div className="mt-1 flex w-full flex-col items-center gap-2 px-1 sm:mt-2 sm:gap-2 sm:px-2">
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={turning}
          className="min-h-11 rounded-full border border-warm-beige bg-warm-white/95 px-3 py-1.5 font-sans text-xs text-deep-burgundy shadow-sm transition hover:bg-warm-beige/40 disabled:cursor-default disabled:opacity-60 sm:px-4 sm:py-2 sm:text-sm"
          aria-label={isFirst ? "Close book and return to cover" : "Previous page"}
        >
          {isFirst ? "← Cover" : "← Previous"}
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={isLast || turning}
          className="btn-primary min-h-11 px-4 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-35 sm:px-5 sm:py-2 sm:text-sm"
          aria-label={isLast ? "End of book" : "Next page"}
        >
          {isLast ? "The End" : "Turn the Page →"}
        </button>

        <SoundToggle className="min-h-11 rounded-full border border-warm-beige bg-warm-white/95 px-3 py-1.5 font-sans text-xs text-deep-burgundy shadow-sm transition hover:bg-warm-beige/40" />
      </div>

      <div
        className="flex flex-wrap items-center justify-center gap-0"
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
            className="relative -mx-[5px] flex h-6 w-6 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta disabled:cursor-default"
          >
            <span
              className={`pointer-events-none block rounded-full transition-all ${
                i === pageIndex
                  ? "h-1.5 w-4 bg-terracotta sm:h-2 sm:w-5"
                  : "h-1.5 w-1.5 bg-charcoal/30 sm:h-2 sm:w-2"
              }`}
            />
          </button>
        ))}
      </div>

      <p className="hidden text-center font-sans text-[11px] text-charcoal/55 sm:block">
        ← → keys · swipe · click page edges
      </p>
    </div>
  );
}
