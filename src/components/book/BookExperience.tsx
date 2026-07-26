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
 * Root is locked to the viewport so iOS Safari does not rubber-band the book.
 */
export default function BookExperience() {
  const [phase, setPhase] = useState<Phase>("cover");
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>("none");
  const [turning, setTurning] = useState(false);
  const [soundUnlock, setSoundUnlock] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // Lock document scroll for the whole experience (critical on iOS Safari)
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      htmlOverscroll: html.style.overscrollBehavior,
      bodyOverscroll: body.style.overscrollBehavior,
      bodyPosition: body.style.position,
      bodyWidth: body.style.width,
      bodyTop: body.style.top,
      bodyHeight: body.style.height,
      scrollY: window.scrollY,
    };

    html.classList.add("book-experience-active");
    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    // iOS: fixed body prevents document bounce without breaking inner scroll
    body.style.position = "fixed";
    body.style.width = "100%";
    body.style.top = `-${prev.scrollY}px`;
    body.style.height = "100%";

    return () => {
      html.classList.remove("book-experience-active");
      html.style.overflow = prev.htmlOverflow;
      html.style.overscrollBehavior = prev.htmlOverscroll;
      body.style.overflow = prev.bodyOverflow;
      body.style.overscrollBehavior = prev.bodyOverscroll;
      body.style.position = prev.bodyPosition;
      body.style.width = prev.bodyWidth;
      body.style.top = prev.bodyTop;
      body.style.height = prev.bodyHeight;
      window.scrollTo(0, prev.scrollY);
    };
  }, []);

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
    const t = e.changedTouches[0];
    if (!t) return;
    // Ignore swipes that start inside form fields
    const target = e.target as HTMLElement | null;
    if (target?.closest("input, textarea, select, button, a, [role='tab']")) {
      touchStart.current = null;
      return;
    }
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current == null) return;
    const t = e.changedTouches[0];
    if (!t) {
      touchStart.current = null;
      return;
    }
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;

    // Require a clearly horizontal swipe so vertical page scroll wins on iOS
    if (Math.abs(dx) < 56) return;
    if (Math.abs(dx) < Math.abs(dy) * 1.35) return;

    if (dx < 0) next();
    else prev();
  };

  return (
    <div className="book-experience-root relative h-[100dvh] max-h-[100dvh] overflow-hidden bg-[#f5ead4]">
      {/* Full-screen animated adventure world (always under the book) */}
      <WorldBackground />

      {/* Always-on subtle floats (cover + reading) */}
      <AmbientLayer />

      {phase === "cover" && (
        <BookCoverIntro onBegin={openBook} onSkip={openBook} />
      )}

      {phase === "reading" && (
        <div
          className="relative z-10 flex h-full max-h-[100dvh] flex-col overflow-hidden px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-3 sm:pt-3"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <a href="#book-paper" className="skip-link">
            Skip to page content
          </a>

          {/* Book fills remaining height above controls — no document scroll */}
          <div
            id="book-paper"
            className="flex min-h-0 w-full flex-1 flex-col items-center justify-center"
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
          </div>

          <div className="w-full shrink-0">
            <BookControls
              pageIndex={pageIndex}
              turning={turning}
              onPrev={prev}
              onNext={next}
              onGoTo={(i) => goTo(i, i > pageIndex ? "next" : "prev")}
            />
          </div>

          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {BOOK_PAGES[pageIndex]?.title}, page {pageIndex + 1} of{" "}
            {TOTAL_PAGES}
          </div>
        </div>
      )}

      <AmbientSound unlockToken={soundUnlock} />
    </div>
  );
}
