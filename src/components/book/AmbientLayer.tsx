"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/prefers-reduced-motion";

type Floater = {
  id: number;
  kind: "leaf" | "balloon" | "petal";
  left: number;
  delay: number;
  duration: number;
  size: number;
  drift: number;
  opacity: number;
};

type Flyer = {
  id: number;
  kind: "bee" | "butterfly";
  left: number;
  top: number;
  radius: number;
  duration: number;
  delay: number;
  size: number;
  reverse: boolean;
  opacity: number;
  palette: number;
};

function makeFloaters(count: number): Floater[] {
  const kinds: Floater["kind"][] = ["leaf", "petal", "balloon", "leaf", "petal"];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    kind: kinds[i % kinds.length],
    left: 4 + ((i * 17) % 92),
    delay: (i * 1.8) % 14,
    duration: 16 + (i % 6) * 2.5,
    size: 12 + (i % 4) * 3,
    drift: 10 + (i % 5) * 6,
    opacity: 0.28 + (i % 4) * 0.08,
  }));
}

function makeFlyers(count: number): Flyer[] {
  return Array.from({ length: count }, (_, i) => {
    const isBee = i % 2 === 0;
    return {
      id: i,
      kind: isBee ? "bee" : "butterfly",
      left: 8 + ((i * 19) % 80),
      top: 12 + ((i * 27) % 68),
      radius: 48 + (i % 5) * 22 + (isBee ? 0 : 12),
      duration: (isBee ? 9 : 14) + (i % 4) * 2.5,
      delay: -(i * 1.6) % 12,
      size: isBee ? 16 + (i % 3) * 2 : 22 + (i % 3) * 4,
      reverse: i % 3 === 0,
      opacity: 0.72 + (i % 3) * 0.08,
      palette: i % 4,
    };
  });
}

function ButterflyGlyph({ size, palette }: { size: number; palette: number }) {
  const wings = [
    ["#E8A090", "#D4A76A"],
    ["#9EC5DC", "#E8A0B0"],
    ["#D4A76A", "#E8C070"],
    ["#C9A0D4", "#E8A090"],
  ][palette];
  return (
    <svg width={size} height={size} viewBox="0 0 32 28" fill="none" aria-hidden>
      <g className="ambient-wing ambient-wing-l">
        <ellipse cx="9" cy="12" rx="8" ry="10" fill={wings[0]} opacity="0.9" />
        <ellipse cx="8" cy="14" rx="4" ry="5" fill="#FEFCF8" opacity="0.35" />
      </g>
      <g className="ambient-wing ambient-wing-r">
        <ellipse cx="23" cy="12" rx="8" ry="10" fill={wings[1]} opacity="0.9" />
        <ellipse cx="24" cy="14" rx="4" ry="5" fill="#FEFCF8" opacity="0.35" />
      </g>
      <ellipse cx="16" cy="13" rx="2.2" ry="7" fill="#5C3A2E" opacity="0.9" />
      <path
        d="M15 6 Q13 2 11 3"
        stroke="#5C3A2E"
        strokeWidth="1"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M17 6 Q19 2 21 3"
        stroke="#5C3A2E"
        strokeWidth="1"
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
}

function BeeGlyph({ size }: { size: number }) {
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 28 24" fill="none" aria-hidden>
      {/* wings */}
      <g className="ambient-wing ambient-wing-l">
        <ellipse cx="8" cy="8" rx="6" ry="4" fill="#FEFCF8" opacity="0.75" />
      </g>
      <g className="ambient-wing ambient-wing-r">
        <ellipse cx="20" cy="8" rx="6" ry="4" fill="#FEFCF8" opacity="0.75" />
      </g>
      {/* body */}
      <ellipse cx="14" cy="13" rx="9" ry="6" fill="#E8B84A" />
      <rect x="8" y="10" width="2.2" height="6" rx="0.5" fill="#3D2A1A" opacity="0.85" />
      <rect x="12" y="9.5" width="2.2" height="7" rx="0.5" fill="#3D2A1A" opacity="0.85" />
      <rect x="16" y="10" width="2.2" height="6" rx="0.5" fill="#3D2A1A" opacity="0.85" />
      {/* head */}
      <circle cx="23" cy="12.5" r="3.2" fill="#3D2A1A" />
      <circle cx="24.2" cy="11.6" r="0.7" fill="#FEFCF8" opacity="0.9" />
      {/* stinger hint */}
      <path d="M5 13 L2.5 13.5 L5 14" fill="#3D2A1A" opacity="0.7" />
    </svg>
  );
}

function FloaterGlyph({ kind, size }: { kind: Floater["kind"]; size: number }) {
  if (kind === "balloon") {
    return (
      <svg width={size} height={size * 1.35} viewBox="0 0 24 32" fill="none" aria-hidden>
        <ellipse cx="12" cy="12" rx="8" ry="10" fill="#E8634F" opacity="0.5" />
        <path d="M12 22 L12 30" stroke="#C17F59" strokeWidth="1" opacity="0.45" />
        <path d="M12 22 L10 24 L14 24 Z" fill="#C17F59" opacity="0.5" />
      </svg>
    );
  }
  if (kind === "leaf") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3 C18 6 20 14 12 21 C4 14 6 6 12 3 Z"
          fill="#5A7A4A"
          opacity="0.5"
        />
        <path d="M12 6 L12 18" stroke="#3d5a3a" strokeWidth="0.8" opacity="0.45" />
      </svg>
    );
  }
  return (
    <svg width={size * 0.85} height={size * 0.85} viewBox="0 0 24 24" fill="none" aria-hidden>
      <ellipse
        cx="12"
        cy="12"
        rx="5"
        ry="9"
        fill="#E8A0B0"
        opacity="0.55"
        transform="rotate(25 12 12)"
      />
    </svg>
  );
}

const TRAIL_STEPS = [14, 28, 42, 56, 70] as const;

/**
 * Ambient life: rising leaves/petals + bees & butterflies orbiting with trails.
 */
export default function AmbientLayer() {
  const [floaters, setFloaters] = useState<Floater[]>([]);
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setEnabled(false);
      return;
    }
    setEnabled(true);
    setFloaters(makeFloaters(7));
    setFlyers(makeFlyers(8));
  }, []);

  if (!enabled) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[5] overflow-hidden"
      aria-hidden
    >
      {/* Soft rising bits — stay quiet so flyers read clearly */}
      {floaters.map((f) => (
        <div
          key={`f-${f.id}`}
          className="ambient-floater"
          style={{
            left: `${f.left}%`,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            opacity: f.opacity,
            ["--drift" as string]: `${f.drift * (f.id % 2 === 0 ? 1 : -1)}px`,
          }}
        >
          <FloaterGlyph kind={f.kind} size={f.size} />
        </div>
      ))}

      {/* Bees & butterflies flying in circles with sparkle trails */}
      {flyers.map((fly) => (
        <div
          key={`fly-${fly.id}`}
          className="ambient-orbit"
          style={{
            left: `${fly.left}%`,
            top: `${fly.top}%`,
            opacity: fly.opacity,
          }}
        >
          <div
            className={`ambient-orbit-spin ${fly.reverse ? "ambient-orbit-reverse" : ""}`}
            style={{
              animationDuration: `${fly.duration}s`,
              animationDelay: `${fly.delay}s`,
            }}
          >
            {/* Trail dots lag behind on the same circle */}
            {TRAIL_STEPS.map((deg, i) => (
              <div
                key={deg}
                className="ambient-trail-arm"
                style={{
                  transform: `rotate(${fly.reverse ? deg : -deg}deg)`,
                }}
              >
                <span
                  className={`ambient-trail-dot ambient-trail-dot--${fly.kind}`}
                  style={{
                    transform: `translateX(${fly.radius}px) translate(-50%, -50%)`,
                    opacity: 0.55 - i * 0.09,
                    width: Math.max(3, fly.size * (0.22 - i * 0.02)),
                    height: Math.max(3, fly.size * (0.22 - i * 0.02)),
                  }}
                />
              </div>
            ))}

            {/* Creature on the orbit */}
            <div className="ambient-trail-arm">
              <div
                className="ambient-creature"
                style={{
                  transform: `translateX(${fly.radius}px) translate(-50%, -50%)`,
                  width: fly.size,
                  height: fly.size,
                }}
              >
                {/* Counter-rotate so glyph stays upright while orbiting */}
                <div
                  className="ambient-creature-face"
                  style={{
                    animationDuration: `${fly.duration}s`,
                    animationDelay: `${fly.delay}s`,
                  }}
                >
                  {fly.kind === "bee" ? (
                    <BeeGlyph size={fly.size} />
                  ) : (
                    <ButterflyGlyph size={fly.size} palette={fly.palette} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
