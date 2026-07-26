"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { BOOK_PAGES } from "@/lib/book-pages";
import BookPageContent from "@/components/book/BookPageContent";
import MobilePageFit from "@/components/book/MobilePageFit";
import { prefersReducedMotion } from "@/lib/prefers-reduced-motion";

type Props = {
  pageIndex: number;
  direction: "next" | "prev" | "none";
  turning: boolean;
  onTurnComplete: () => void;
  onEdgePrev: () => void;
  onEdgeNext: () => void;
  onNextPage?: () => void;
};

const SCROLLABLE_PAGE_IDS = new Set(["coming-soon", "contact"]);

/**
 * Desktop: large open landscape 9×7 spread.
 * Mobile: full-height portrait paper page that fits the screen — story
 * pages scale-to-fit so iPhone users do not scroll to read a page.
 */
export default function OpenBook({
  pageIndex,
  direction,
  turning,
  onTurnComplete,
  onEdgePrev,
  onEdgeNext,
  onNextPage,
}: Props) {
  const spreadRef = useRef<HTMLDivElement>(null);
  const page = BOOK_PAGES[pageIndex];
  const allowScroll = page ? SCROLLABLE_PAGE_IDS.has(page.id) : false;

  useEffect(() => {
    const spread = spreadRef.current;
    if (!spread) return;

    if (prefersReducedMotion() || direction === "none") {
      gsap.set(spread, {
        clearProps: "transform,opacity",
        autoAlpha: 1,
        x: 0,
        scale: 1,
      });
      if (turning) onTurnComplete();
      return;
    }

    const fromX = direction === "next" ? 28 : -28;

    const tl = gsap.timeline({
      onComplete: () => onTurnComplete(),
    });

    gsap.set(spread, { transformOrigin: "50% 50%" });

    tl.fromTo(
      spread,
      { autoAlpha: 0.8, x: fromX, scale: 0.992 },
      { autoAlpha: 1, x: 0, scale: 1, duration: 0.42, ease: "power2.out" }
    );

    return () => {
      tl.kill();
    };
  }, [pageIndex, direction, turning, onTurnComplete]);

  return (
    <div className="book-stage-frame">
      <div className="book-stage-book relative mx-auto">
        <button
          type="button"
          className="absolute left-0 top-0 z-30 hidden h-full w-[8%] cursor-w-resize bg-transparent md:block"
          aria-label="Previous page"
          onClick={onEdgePrev}
        />
        <button
          type="button"
          className="absolute right-0 top-0 z-30 hidden h-full w-[8%] cursor-e-resize bg-transparent md:block"
          aria-label="Next page"
          onClick={onEdgeNext}
        />

        <div
          ref={spreadRef}
          className="relative mx-auto h-full w-full overflow-hidden rounded-xl border border-warm-beige/90 md:rounded-2xl"
          style={{
            background: "#fefcf8",
            boxShadow:
              "0 24px 60px rgba(44,44,44,0.16), 0 8px 20px rgba(0,0,0,0.06)",
          }}
        >
          {/* Desktop spread — fills 9×7 face */}
          <div
            className="hidden h-full md:grid md:grid-cols-2"
            style={{
              background:
                "linear-gradient(90deg, #faf6ef 0%, #fefcf8 46%, #e8dcc8 49.5%, #d9cbb3 50%, #e8dcc8 50.5%, #fefcf8 54%, #faf6ef 100%)",
            }}
          >
            <div className="relative flex flex-col justify-between px-8 py-8 lg:px-14 lg:py-12">
              <div>
                <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-terracotta/75">
                  Granny on the Go
                </p>
                <h2 className="mt-3 font-serif text-3xl leading-tight text-deep-burgundy lg:text-5xl">
                  {page?.title}
                </h2>
                {page?.kicker && (
                  <p className="mt-3 max-w-sm font-serif text-base italic text-charcoal/50 lg:text-lg">
                    {page.kicker}
                  </p>
                )}
              </div>
              <div className="mt-8">
                <div className="h-px w-16 bg-soft-gold/70" />
                <p className="mt-4 font-sans text-xs text-charcoal/40 lg:text-sm">
                  Page {pageIndex + 1} of {BOOK_PAGES.length}
                </p>
                <p className="mt-6 font-serif text-sm leading-relaxed text-charcoal/45 lg:text-base">
                  {pageIndex === 0
                    ? "Turn the page and step into Granny's world."
                    : "Turn the page to continue the adventure."}
                </p>
              </div>
              <div
                className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black/[0.05] to-transparent"
                aria-hidden
              />
            </div>

            <div className="relative flex min-h-0 flex-col px-8 py-8 lg:px-14 lg:py-12">
              <div className="book-page-scroll relative min-h-0 flex-1">
                {page && (
                  <BookPageContent pageId={page.id} onNext={onNextPage} />
                )}
              </div>
              <div
                className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-black/[0.05] to-transparent"
                aria-hidden
              />
            </div>
          </div>

          {/* Mobile: full-height portrait page (not landscape 9×7) */}
          <div
            className="flex h-full min-h-0 flex-col md:hidden"
            style={{
              background:
                "linear-gradient(90deg, #e8dcc8 0%, #f7f1e6 8px, #fefcf8 14px, #fefcf8 100%)",
            }}
          >
            <header className="shrink-0 border-b border-warm-beige/70 px-4 pb-2 pt-3">
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-sans text-[9px] uppercase tracking-[0.28em] text-terracotta/80">
                  Granny on the Go
                </p>
                <p className="shrink-0 font-sans text-[10px] text-charcoal/35">
                  {pageIndex + 1}/{BOOK_PAGES.length}
                </p>
              </div>
              <h2 className="mt-0.5 font-serif text-xl leading-tight text-deep-burgundy">
                {page?.title}
              </h2>
              {page?.kicker && (
                <p className="mt-0.5 line-clamp-2 font-serif text-xs italic leading-snug text-charcoal/50">
                  {page.kicker}
                </p>
              )}
            </header>

            <MobilePageFit pageKey={page?.id ?? pageIndex} allowScroll={allowScroll}>
              {page && (
                <BookPageContent pageId={page.id} onNext={onNextPage} />
              )}
            </MobilePageFit>
          </div>
        </div>
      </div>
    </div>
  );
}
