"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/prefers-reduced-motion";

/**
 * Fixed product URL. Do not read from env for the open action —
 * an empty NEXT_PUBLIC_* on Vercel must never produce a blank href.
 */
export const GUMROAD_PREORDER_URL =
  "https://theveilpress.gumroad.com/l/rsmfcb";

type Props = {
  className?: string;
};

/**
 * Square Miata preorder control.
 *
 * Uses a real HTML form with action=Gumroad + target=_blank.
 * That is the only reliable way browsers open an external checkout
 * without about:blank or hijacking the current tab.
 * Animation is purely decorative (never preventDefault / window.open).
 */
export default function PreOrderMiataButton({ className = "" }: Props) {
  const carRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);
  const [animating, setAnimating] = useState(false);

  const resetCar = useCallback(() => {
    if (carRef.current) {
      gsap.set(carRef.current, { clearProps: "transform,filter" });
    }
    if (dustRef.current) {
      gsap.set(dustRef.current, { clearProps: "all" });
    }
    setAnimating(false);
  }, []);

  const playDriveOff = useCallback(() => {
    if (animating) return;
    setAnimating(true);

    if (prefersReducedMotion() || !carRef.current) {
      window.setTimeout(resetCar, 400);
      return;
    }

    const car = carRef.current;
    const dust = dustRef.current;
    const tl = gsap.timeline({
      onComplete: () => {
        window.setTimeout(resetCar, 280);
      },
    });

    tl.fromTo(
      car,
      { x: 0, y: 0, scale: 1, rotate: 0 },
      {
        y: -4,
        scale: 1.04,
        duration: 0.18,
        ease: "power1.out",
        yoyo: true,
        repeat: 1,
      }
    );
    tl.to(car, {
      x: "118%",
      rotate: 2,
      duration: 0.75,
      ease: "power2.in",
    });
    if (dust) {
      tl.fromTo(
        dust,
        { autoAlpha: 0, scale: 0.6, x: 0 },
        {
          autoAlpha: 0.7,
          scale: 1.2,
          x: -12,
          duration: 0.45,
          ease: "power1.out",
        },
        "-=0.7"
      );
      tl.to(
        dust,
        { autoAlpha: 0, duration: 0.25, ease: "power1.in" },
        "-=0.15"
      );
    }
  }, [animating, resetCar]);

  return (
    <div className={`flex w-full flex-col items-center ${className}`}>
      {/*
        Native form navigation → new tab.
        No window.open, no about:blank, no location.assign on this window.
      */}
      <form
        action={GUMROAD_PREORDER_URL}
        method="get"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full max-w-[220px]"
        onSubmit={playDriveOff}
      >
        <button
          type="submit"
          className="group relative mx-auto block aspect-square w-full overflow-hidden rounded-2xl border-2 border-soft-gold/50 bg-cream shadow-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2"
          style={{
            boxShadow:
              "0 12px 28px rgba(44,44,44,0.12), 0 4px 10px rgba(0,0,0,0.06)",
          }}
          aria-label="Preorder the Adventure — opens Gumroad checkout in a new tab"
        >
          <span
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, #f7f0e4 0%, #efe4d0 55%, #e8dcc8 100%)",
            }}
            aria-hidden
          />

          <div ref={carRef} className="absolute inset-0 will-change-transform">
            <Image
              src="/images/miata-preorder.jpg"
              alt="Granny's little black convertible"
              fill
              sizes="220px"
              className="pointer-events-none object-cover object-center transition duration-300 group-hover:scale-[1.03] group-hover:brightness-[1.03]"
            />
          </div>

          <div
            ref={dustRef}
            className="pointer-events-none absolute bottom-[18%] left-[12%] h-10 w-16 rounded-full opacity-0"
            style={{
              background:
                "radial-gradient(ellipse, rgba(200,180,150,0.65) 0%, transparent 70%)",
              filter: "blur(2px)",
            }}
            aria-hidden
          />

          <span
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-black/55 via-black/25 to-transparent"
            aria-hidden
          />

          <span className="absolute inset-x-0 bottom-0 z-10 px-3 pb-3.5 pt-6 text-center">
            <span className="block font-serif text-lg font-semibold leading-tight text-warm-white drop-shadow-sm md:text-xl">
              Preorder the Adventure
            </span>
            <span className="mt-0.5 block font-sans text-[10px] uppercase tracking-[0.18em] text-warm-white/80">
              {animating ? "Vroom…" : "Gumroad · $15.99"}
            </span>
          </span>
        </button>
      </form>

      {/* Plain fallback — always works even if the form tab is blocked */}
      <a
        href={GUMROAD_PREORDER_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 font-sans text-sm text-terracotta underline-offset-2 hover:underline"
      >
        Open Gumroad checkout →
      </a>
    </div>
  );
}
