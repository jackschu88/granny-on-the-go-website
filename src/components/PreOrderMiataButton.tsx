"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/prefers-reduced-motion";
import {
  gumroadUrl,
  PREORDER_PRODUCTS,
  type PreorderProduct,
} from "@/lib/gumroad";

export { GUMROAD_PREORDER_URL } from "@/lib/gumroad";

type Props = {
  className?: string;
  /** Which pre-order product this button sells */
  product?: PreorderProduct;
};

/**
 * Square Miata preorder control — form target=_blank to Gumroad.
 */
export default function PreOrderMiataButton({
  className = "",
  product = PREORDER_PRODUCTS.standard,
}: Props) {
  const carRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);
  const [animating, setAnimating] = useState(false);

  const ready = Boolean(product.slug);
  const checkoutUrl = ready ? gumroadUrl(product.slug) : "";

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
    if (animating || !ready) return;
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
  }, [animating, ready, resetCar]);

  const borderClass =
    product.id === "signed"
      ? "border-terracotta/60"
      : "border-soft-gold/50";

  return (
    <div className={`flex w-full flex-col items-center ${className}`}>
      {ready ? (
        <form
          action={checkoutUrl}
          method="get"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-[200px]"
          onSubmit={playDriveOff}
        >
          <button
            type="submit"
            className={`group relative mx-auto block aspect-square w-full overflow-hidden rounded-2xl border-2 bg-cream shadow-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 ${borderClass}`}
            style={{
              boxShadow:
                "0 12px 28px rgba(44,44,44,0.12), 0 4px 10px rgba(0,0,0,0.06)",
            }}
            aria-label={`${product.title} ${product.priceLabel} — opens Gumroad`}
          >
            <TileFace
              carRef={carRef}
              dustRef={dustRef}
              title={product.title}
              priceLine={animating ? "Vroom…" : `Gumroad · ${product.priceLabel}`}
              signed={product.id === "signed"}
            />
          </button>
        </form>
      ) : (
        <div
          className={`relative mx-auto aspect-square w-full max-w-[200px] overflow-hidden rounded-2xl border-2 border-dashed border-warm-beige bg-cream opacity-90 ${borderClass}`}
          aria-label={`${product.title} — checkout link coming soon`}
        >
          <TileFace
            carRef={carRef}
            dustRef={dustRef}
            title={product.title}
            priceLine={`${product.priceLabel} · link soon`}
            signed={product.id === "signed"}
          />
        </div>
      )}

      {ready ? (
        <a
          href={checkoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 font-sans text-xs text-terracotta underline-offset-2 hover:underline"
        >
          {product.shortLabel} checkout →
        </a>
      ) : (
        <p className="mt-2 font-sans text-[11px] text-charcoal/45">
          Signed link activates when slug is set
        </p>
      )}
    </div>
  );
}

function TileFace({
  carRef,
  dustRef,
  title,
  priceLine,
  signed,
}: {
  carRef: React.RefObject<HTMLDivElement | null>;
  dustRef: React.RefObject<HTMLDivElement | null>;
  title: string;
  priceLine: string;
  signed: boolean;
}) {
  return (
    <>
      <span
        className="absolute inset-0"
        style={{
          background: signed
            ? "linear-gradient(180deg, #f7efe4 0%, #f0dfc8 55%, #e8d0b8 100%)"
            : "linear-gradient(180deg, #f7f0e4 0%, #efe4d0 55%, #e8dcc8 100%)",
        }}
        aria-hidden
      />

      <div ref={carRef} className="absolute inset-0 will-change-transform">
        <Image
          src="/images/miata-preorder.jpg"
          alt="Granny's little black convertible"
          fill
          sizes="200px"
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

      {signed && (
        <span className="absolute top-2 right-2 z-10 rounded-full bg-deep-burgundy/90 px-2 py-0.5 font-sans text-[9px] font-semibold uppercase tracking-wider text-warm-white">
          Signed
        </span>
      )}

      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-black/60 via-black/28 to-transparent"
        aria-hidden
      />

      <span className="absolute inset-x-0 bottom-0 z-10 px-2.5 pb-3 pt-6 text-center">
        <span className="block font-serif text-base font-semibold leading-tight text-warm-white drop-shadow-sm sm:text-lg">
          {title}
        </span>
        <span className="mt-0.5 block font-sans text-[10px] uppercase tracking-[0.16em] text-warm-white/85">
          {priceLine}
        </span>
      </span>
    </>
  );
}
