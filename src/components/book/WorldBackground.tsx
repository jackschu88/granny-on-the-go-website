"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { prefersReducedMotion } from "@/lib/prefers-reduced-motion";

type Bubble = {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  opacity: number;
};

type Spark = {
  id: number;
  left: number;
  top: number;
  delay: number;
  duration: number;
  size: number;
};

function makeBubbles(count: number): Bubble[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: 3 + ((i * 17) % 94),
    size: 8 + (i % 5) * 5,
    delay: (i * 1.7) % 14,
    duration: 16 + (i % 6) * 3,
    drift: 18 + (i % 5) * 8,
    opacity: 0.25 + (i % 4) * 0.08,
  }));
}

function makeSparks(count: number): Spark[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: 8 + ((i * 23) % 84),
    top: 10 + ((i * 31) % 70),
    delay: (i * 0.9) % 8,
    duration: 4 + (i % 4) * 1.2,
    size: 3 + (i % 3),
  }));
}

/**
 * Full-viewport adventure-world backdrop behind the book.
 * Pattern art + soft ken-burns + floating bubbles (reduced-motion safe).
 */
export default function WorldBackground() {
  const [animate, setAnimate] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [sparks, setSparks] = useState<Spark[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setAnimate(false);
      return;
    }
    setAnimate(true);
    setBubbles(makeBubbles(14));
    setSparks(makeSparks(10));
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      {/* Cream base while image loads */}
      <div className="absolute inset-0 bg-[#f5ead4]" />

      {/* Full-bleed pattern — gentle living scale */}
      <div
        className={`absolute inset-0 ${animate ? "world-bg-breathe" : ""}`}
        style={{
          transform: animate ? undefined : "scale(1.06)",
        }}
      >
        <Image
          src="/images/world-bg.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          quality={85}
        />
      </div>

      {/* Soft wash so icons don't fight the book */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 50% 48%, rgba(254, 252, 248, 0.72) 0%, rgba(254, 252, 248, 0.35) 42%, rgba(245, 234, 212, 0.18) 70%, transparent 100%)",
        }}
      />

      {/* Warm edge vignette — frames the stage */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(122, 59, 59, 0.07) 78%, rgba(90, 50, 40, 0.14) 100%)",
        }}
      />

      {/* Slow light drift (warm spotlight) */}
      {animate && (
        <div
          className="world-light-drift absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(circle 40% at 30% 35%, rgba(255, 248, 230, 0.55) 0%, transparent 60%)",
          }}
        />
      )}

      {/* Rising soap bubbles */}
      {animate &&
        bubbles.map((b) => (
          <span
            key={`b-${b.id}`}
            className="world-bubble absolute rounded-full border border-white/50"
            style={{
              left: `${b.left}%`,
              width: b.size,
              height: b.size,
              opacity: b.opacity,
              animationDuration: `${b.duration}s`,
              animationDelay: `${b.delay}s`,
              ["--drift" as string]: `${b.drift * (b.id % 2 === 0 ? 1 : -1)}px`,
              background:
                "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.7), rgba(180,220,240,0.15) 55%, transparent 70%)",
              boxShadow: "inset 0 0 4px rgba(255,255,255,0.4)",
            }}
          />
        ))}

      {/* Soft sparkle twinkles */}
      {animate &&
        sparks.map((s) => (
          <span
            key={`s-${s.id}`}
            className="world-spark absolute rounded-full bg-soft-gold/70"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
    </div>
  );
}
