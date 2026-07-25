"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/prefers-reduced-motion";

type Props = {
  onBegin: () => void;
  onSkip: () => void;
};

/**
 * Closed book — exact 9×7 landscape ratio (physical book), large in the viewport.
 * Cover art fills the book face (no letterbox bars).
 */
export default function BookCoverIntro({ onBegin, onSkip }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const doneRef = useRef(false);

  const finish = useCallback(
    (skipped: boolean) => {
      if (doneRef.current) return;
      doneRef.current = true;
      if (skipped) onSkip();
      else onBegin();
    },
    [onBegin, onSkip]
  );

  const playOpen = useCallback(
    (skipped: boolean) => {
      if (busy || doneRef.current) return;
      setBusy(true);

      if (skipped || prefersReducedMotion()) {
        finish(skipped);
        return;
      }

      const root = rootRef.current;
      const book = bookRef.current;
      if (!root || !book) {
        finish(skipped);
        return;
      }

      const safety = window.setTimeout(() => finish(skipped), 2200);

      try {
        const tl = gsap.timeline({
          onComplete: () => {
            clearTimeout(safety);
            finish(skipped);
          },
        });

        gsap.set(book, { transformOrigin: "50% 50%" });
        tl.to(book, {
          scale: 1.02,
          y: -6,
          duration: 0.45,
          ease: "power2.out",
        });
        tl.to(book, {
          scale: 1.04,
          duration: 0.5,
          ease: "power2.inOut",
        });
        tl.to(
          root,
          {
            autoAlpha: 0,
            duration: 0.4,
            ease: "power2.in",
          },
          "-=0.15"
        );
      } catch {
        clearTimeout(safety);
        finish(skipped);
      }
    },
    [busy, finish]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") playOpen(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playOpen]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const book = bookRef.current;
    if (!book) return;
    gsap.fromTo(
      book,
      { autoAlpha: 0, y: 16, scale: 0.985 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.85, ease: "power3.out" }
    );
  }, []);

  return (
    <section
      ref={rootRef}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-transparent"
      aria-label="Closed book — begin the adventure"
    >
      {/* World art lives under this layer (BookExperience → WorldBackground) */}

      <button
        type="button"
        onClick={() => playOpen(true)}
        className="absolute top-3 right-3 z-30 rounded-full border border-warm-beige bg-warm-white/95 px-4 py-2 font-sans text-sm text-charcoal/70 shadow-sm md:top-5 md:right-5"
      >
        Skip Intro
      </button>

      {/* Stage: book dominates the window; chrome stays tight */}
      <div className="relative z-20 flex h-full w-full flex-col items-center justify-center px-2 py-3 text-center sm:px-4 sm:py-4">
        <p className="mb-2 shrink-0 font-sans text-[10px] uppercase tracking-[0.35em] text-terracotta sm:mb-3 sm:text-xs md:text-sm">
          Granny on the Go Adventures
        </p>

        {/*
          Physical book = 9×7 landscape.
          Size by the limiting viewport axis so the book is as large as possible
          while keeping exact 9/7 and room for caption + CTA.
        */}
        <div
          ref={bookRef}
          className="relative mx-auto shrink-0"
          style={{
            // Leave ~7.5rem for title + caption + button + padding
            width: "min(96vw, calc((100dvh - 7.5rem) * 9 / 7), 1400px)",
            aspectRatio: "9 / 7",
          }}
        >
          <button
            type="button"
            onClick={() => playOpen(false)}
            disabled={busy}
            className="relative block h-full w-full overflow-hidden rounded-r-xl rounded-l-md shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-4 md:rounded-r-2xl"
            style={{
              boxShadow:
                "0 22px 50px rgba(44,44,44,0.22), 0 8px 18px rgba(0,0,0,0.08), inset -6px 0 12px rgba(0,0,0,0.06)",
            }}
            aria-label="Begin the Adventure"
          >
            {/* Spine edge of closed book */}
            <span
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-2 bg-gradient-to-r from-black/40 via-black/15 to-transparent md:w-3"
              aria-hidden
            />
            {/* Cover fills the 9×7 face — no beige letterbox */}
            <Image
              src="/images/book-cover-landscape.jpg"
              alt="Granny on the Go book cover"
              fill
              priority
              sizes="(max-width: 768px) 96vw, 1400px"
              className="object-cover object-center"
            />
          </button>
        </div>

        <p className="mt-2 shrink-0 max-w-md font-serif text-sm italic text-terracotta sm:mt-3 sm:text-base md:text-lg">
          Every adventure begins with a single page…
        </p>

        <button
          type="button"
          onClick={() => playOpen(false)}
          disabled={busy}
          className="btn-primary mt-2 shrink-0 px-8 py-3 text-base disabled:opacity-70 sm:mt-3 sm:px-10 sm:py-3.5 sm:text-lg"
        >
          {busy ? "Opening…" : "Begin the Adventure"}
        </button>
      </div>
    </section>
  );
}
