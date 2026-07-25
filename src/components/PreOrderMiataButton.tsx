"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/prefers-reduced-motion";

const gumroadUrl =
  process.env.NEXT_PUBLIC_GUMROAD_URL ||
  "https://theveilpress.gumroad.com/l/rsmfcb";

type Props = {
  href?: string;
  className?: string;
};

/**
 * Square Miata image button — animates drive-off, then opens Gumroad pre-order.
 */
export default function PreOrderMiataButton({
  href = gumroadUrl,
  className = "",
}: Props) {
  const carRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  const resetCar = useCallback(() => {
    if (carRef.current) {
      gsap.set(carRef.current, { clearProps: "transform,filter" });
    }
    if (dustRef.current) {
      gsap.set(dustRef.current, { clearProps: "all" });
    }
    setBusy(false);
  }, []);

  const finishCheckout = useCallback(
    (tab: Window | null) => {
      if (tab && !tab.closed) {
        try {
          tab.location.href = href;
        } catch {
          window.open(href, "_blank", "noopener,noreferrer");
        }
      } else {
        // Popup blocked — same-tab fallback so checkout still works
        window.location.assign(href);
      }
      window.setTimeout(resetCar, 250);
    },
    [href, resetCar]
  );

  const playAndGo = useCallback(() => {
    if (busy) return;
    setBusy(true);

    // Open during the user gesture so popup blockers allow it
    const tab = window.open("about:blank", "_blank");

    if (prefersReducedMotion() || !carRef.current) {
      finishCheckout(tab);
      return;
    }

    const car = carRef.current;
    const dust = dustRef.current;
    const tl = gsap.timeline({
      onComplete: () => finishCheckout(tab),
    });

    // Soft rev / bounce, then drive right off the tile
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
  }, [busy, finishCheckout]);

  return (
    <button
      type="button"
      onClick={playAndGo}
      disabled={busy}
      className={`group relative mx-auto block aspect-square w-full max-w-[220px] overflow-hidden rounded-2xl border-2 border-soft-gold/50 bg-cream shadow-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 disabled:cursor-wait ${className}`}
      style={{
        boxShadow:
          "0 12px 28px rgba(44,44,44,0.12), 0 4px 10px rgba(0,0,0,0.06)",
      }}
      aria-label="Preorder the Adventure — opens Gumroad checkout"
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
          className="object-cover object-center transition duration-300 group-hover:scale-[1.03] group-hover:brightness-[1.03]"
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
          {busy ? "Vroom…" : "Tap to go"}
        </span>
      </span>
    </button>
  );
}
