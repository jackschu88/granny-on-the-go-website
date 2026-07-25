"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const TRACK_SRC = "/audio/golden-evening-light.mp3";
const VOLUME = 0.32;

/**
 * Golden Evening Light ambient music.
 * Tries autoplay on load; if the browser blocks it, starts on the first
 * user gesture (click / key / touch). Mute control always available.
 */
export default function AmbientSound({ unlockToken }: { unlockToken: number }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [on, setOn] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const userMutedRef = useRef(false);

  const play = useCallback(async () => {
    if (userMutedRef.current) return false;
    const el = audioRef.current;
    if (!el) return false;
    try {
      el.volume = VOLUME;
      el.loop = true;
      if (el.paused) {
        await el.play();
      }
      setOn(true);
      setBlocked(false);
      return true;
    } catch {
      setBlocked(true);
      setOn(false);
      return false;
    }
  }, []);

  const pause = useCallback(() => {
    const el = audioRef.current;
    if (el) {
      el.pause();
    }
    setOn(false);
  }, []);

  const toggle = useCallback(async () => {
    if (on) {
      userMutedRef.current = true;
      pause();
      return;
    }
    userMutedRef.current = false;
    await play();
  }, [on, pause, play]);

  // Attempt autoplay as soon as the element can load
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    el.loop = true;
    el.volume = VOLUME;
    el.preload = "auto";

    void play();

    const onCanPlay = () => {
      if (!userMutedRef.current && el.paused) void play();
    };
    el.addEventListener("canplaythrough", onCanPlay);

    return () => {
      el.removeEventListener("canplaythrough", onCanPlay);
      el.pause();
    };
  }, [play]);

  // Retry when visitor begins the adventure (unlockToken bumps)
  useEffect(() => {
    if (unlockToken > 0 && !userMutedRef.current) {
      void play();
    }
  }, [unlockToken, play]);

  // Browsers often block autoplay until a gesture — catch the first one
  useEffect(() => {
    const resume = () => {
      if (userMutedRef.current) return;
      const el = audioRef.current;
      if (el && el.paused) void play();
    };

    window.addEventListener("pointerdown", resume, { passive: true });
    window.addEventListener("keydown", resume);
    window.addEventListener("touchstart", resume, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
      window.removeEventListener("touchstart", resume);
    };
  }, [play]);

  return (
    <div className="fixed bottom-4 left-4 z-40 flex flex-col items-start gap-1">
      <audio
        ref={audioRef}
        src={TRACK_SRC}
        loop
        playsInline
        preload="auto"
        // Hint autoplay where allowed (some browsers honor muted autoplay only;
        // we keep sound on and fall back to gesture unlock above).
        autoPlay
      />
      <button
        type="button"
        onClick={() => void toggle()}
        className="rounded-full border border-warm-beige bg-warm-white/95 px-3 py-2 font-sans text-xs text-charcoal/70 shadow-sm backdrop-blur-sm transition hover:text-deep-burgundy"
        aria-pressed={on}
        aria-label={on ? "Mute music" : "Play Golden Evening Light"}
      >
        {on ? "🔊 Music on" : "🔈 Music off"}
      </button>
      {blocked && !on && (
        <p className="max-w-[11rem] rounded-lg bg-warm-white/90 px-2 py-1 font-sans text-[10px] text-charcoal/50 shadow-sm">
          Tap anywhere (or Music on) to start the soundtrack
        </p>
      )}
    </div>
  );
}
