"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/prefers-reduced-motion";

type BookCoverProps = {
  onComplete: () => void;
};

export default function BookCover({ onComplete }: BookCoverProps) {
  const rootRef = useRef<HTMLElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const completedRef = useRef(false);
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;

    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }

    // Ensure overlay is gone even if React is slow to unmount
    if (rootRef.current) {
      rootRef.current.style.pointerEvents = "none";
      rootRef.current.style.opacity = "0";
    }

    onComplete();
  }, [onComplete]);

  const skipIntro = useCallback(() => {
    try {
      gsap.killTweensOf([rootRef.current, bookRef.current, ctaRef.current]);
    } catch {
      // ignore
    }
    finish();
  }, [finish]);

  const beginAdventure = useCallback(() => {
    if (busy || completedRef.current) return;
    setBusy(true);

    // Never leave the user stranded on the intro
    safetyTimerRef.current = setTimeout(() => {
      finish();
    }, 3500);

    if (prefersReducedMotion()) {
      finish();
      return;
    }

    const root = rootRef.current;
    const book = bookRef.current;
    const cta = ctaRef.current;

    if (!root || !book) {
      finish();
      return;
    }

    try {
      const isMobile = window.matchMedia("(max-width: 767px)").matches;

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut", overwrite: "auto" },
        onComplete: () => finish(),
      });

      if (cta) {
        tl.to(cta, { autoAlpha: 0, y: 16, duration: 0.3 }, 0);
      }

      // Lift the book toward the viewer
      tl.to(
        book,
        {
          scale: isMobile ? 1.06 : 1.1,
          y: isMobile ? -16 : -28,
          duration: 0.7,
          ease: "power3.out",
        },
        0.15
      );

      // Camera push into the cover
      tl.to(
        book,
        {
          scale: isMobile ? 2.2 : 2.8,
          y: isMobile ? 24 : 12,
          duration: 1.1,
          ease: "power3.inOut",
        },
        0.75
      );

      // Fade the whole intro away, then finish
      tl.to(
        root,
        {
          autoAlpha: 0,
          duration: 0.55,
          ease: "power2.in",
          onComplete: () => finish(),
        },
        1.5
      );
    } catch {
      finish();
    }
  }, [busy, finish]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") {
        // Enter only skips if focus isn't on the begin button (that has its own handler)
        if (e.key === "Escape") skipIntro();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
      try {
        gsap.killTweensOf([rootRef.current, bookRef.current, ctaRef.current]);
      } catch {
        // ignore
      }
    };
  }, [skipIntro]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const book = bookRef.current;
    if (!book) return;
    gsap.fromTo(
      book,
      { autoAlpha: 0, y: 28, scale: 0.96 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out" }
    );
  }, []);

  return (
    <section
      ref={rootRef}
      id="book-cover"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-cream"
      aria-label="Book cover introduction"
    >
      {/* Decorative layers must not steal clicks */}
      <div className="pointer-events-none absolute inset-0 watercolor-bg" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(122, 59, 59, 0.08) 100%)",
        }}
        aria-hidden
      />

      <button
        type="button"
        onClick={skipIntro}
        className="absolute top-4 right-4 z-30 rounded-full border border-warm-beige bg-warm-white/95 px-4 py-2 font-sans text-sm text-charcoal/70 shadow-sm backdrop-blur-sm transition-colors hover:text-deep-burgundy focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2"
      >
        Skip Intro
      </button>

      <div className="relative z-20 flex w-full max-w-4xl flex-col items-center px-6 text-center">
        <p className="mb-6 font-sans text-xs uppercase tracking-[0.35em] text-terracotta md:text-sm">
          Granny on the Go Adventures
        </p>

        <div
          ref={bookRef}
          className="relative mb-8 w-full max-w-[min(92vw,420px)] md:max-w-[min(90vw,560px)]"
        >
          <button
            type="button"
            onClick={beginAdventure}
            disabled={busy}
            className="relative block aspect-[3/4] w-full overflow-hidden rounded-r-2xl rounded-l-md shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-4 md:aspect-[4/5]"
            style={{
              boxShadow:
                "12px 18px 40px rgba(44,44,44,0.22), -3px 0 12px rgba(0,0,0,0.08)",
            }}
            aria-label="Begin the Adventure"
          >
            <span
              className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-3 bg-gradient-to-r from-black/35 via-black/10 to-transparent md:w-4"
              aria-hidden
            />
            <Image
              src="/images/book-cover.jpg"
              alt="Granny on the Go book cover — Granny arriving with her adventure tote as children run to greet her"
              fill
              priority
              sizes="(max-width: 768px) 92vw, 560px"
              className="object-cover object-center"
            />
          </button>
        </div>

        <div ref={ctaRef} className="flex flex-col items-center gap-4">
          <p className="max-w-md font-serif text-lg italic text-terracotta md:text-xl">
            Every adventure begins with a single page…
          </p>
          <button
            type="button"
            onClick={beginAdventure}
            disabled={busy}
            className="btn-primary relative z-30 px-10 py-4 text-lg disabled:cursor-wait disabled:opacity-70"
          >
            {busy ? "Opening…" : "Begin the Adventure"}
            {!busy && (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
