"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BOOK_PAGES, TOTAL_PAGES } from "@/lib/book-pages";
import BookCoverIntro from "@/components/book/BookCoverIntro";
import OpenBook from "@/components/book/OpenBook";
import BookControls from "@/components/book/BookControls";
import AmbientLayer from "@/components/book/AmbientLayer";
import AmbientSound, {
  START_MUSIC_EVENT,
} from "@/components/book/AmbientSound";
import WorldBackground from "@/components/book/WorldBackground";

type Phase = "cover" | "reading";
type Direction = "next" | "prev" | "none";

/**
 * Full-viewport centered book experience.
 * Cover → large open spread → page turns, with subtle ambient life.
 */
export default function BookExperience() {
  const [phase, setPhase] = useState<Phase>("cover");
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>("none");
  const [turning, setTurning] = useState(false);
  const [soundUnlock, setSoundUnlock] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const openBook = useCallback(() => {
    // Fire inside the user gesture so the browser allows audio
    window.dispatchEvent(new Event(START_MUSIC_EVENT));
    setPhase("reading");
    setPageIndex(0);
    setDirection("none");
    setTurning(false);
    setSoundUnlock((n) => n + 1);
  }, []);

  const closeBook = useCallback(() => {
    setPhase("cover");
    setPageIndex(0);
    setDirection("none");
    setTurning(false);
  }, []);

  const goTo = useCallback(
    (index: number, dir: Direction) => {
      if (turning) return;
      if (index < 0 || index >= TOTAL_PAGES) return;
      if (index === pageIndex) return;

      setTurning(true);
      setDirection(dir);
      setPageIndex(index);

      // Safety unlock — OpenBook also calls onTurnComplete (~0.4s)
      window.setTimeout(() => {
        setTurning(false);
        setDirection("none");
      }, 500);
    },
    [pageIndex, turning]
  );

  const next = useCallback(() => {
    if (pageIndex >= TOTAL_PAGES - 1) return;
    goTo(pageIndex + 1, "next");
  }, [goTo, pageIndex]);

  /** Previous page, or close the book when on the first page */
  const prev = useCallback(() => {
    if (pageIndex <= 0) {
      closeBook();
      return;
    }
    goTo(pageIndex - 1, "prev");
  }, [closeBook, goTo, pageIndex]);

  const onTurnComplete = useCallback(() => {
    setTurning(false);
    setDirection("none");
  }, []);

  useEffect(() => {
    if (phase !== "reading") return;

    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        prev();
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0, "prev");
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(TOTAL_PAGES - 1, "next");
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, next, prev, goTo]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 50) return;
    if (delta < 0) next();
    else prev();
  };

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-[#f5ead4]">
      {/* Full-screen animated adventure world (always under the book) */}
      <WorldBackground />

      {/* Always-on subtle floats (cover + reading) */}
      <AmbientLayer />

      {phase === "cover" && (
        <BookCoverIntro onBegin={openBook} onSkip={openBook} />
      )}

      {phase === "reading" && (
        <div
          className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-2 py-2 sm:px-3 sm:py-3"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <a href="#book-paper" className="skip-link">
            Skip to page content
          </a>

          <div
            id="book-paper"
            className="flex w-full flex-col items-center"
          >
            <OpenBook
              pageIndex={pageIndex}
              direction={direction}
              turning={turning}
              onTurnComplete={onTurnComplete}
              onEdgePrev={prev}
              onEdgeNext={next}
              onNextPage={next}
            />

            <BookControls
              pageIndex={pageIndex}
              turning={turning}
              onPrev={prev}
              onNext={next}
              onGoTo={(i) => goTo(i, i > pageIndex ? "next" : "prev")}
            />
          </div>

          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {BOOK_PAGES[pageIndex]?.title}, page {pageIndex + 1} of {TOTAL_PAGES}
          </div>
        </div>
      )}

      <AmbientSound unlockToken={soundUnlock} />
    </div>
  );
}
