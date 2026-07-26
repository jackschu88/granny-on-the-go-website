"use client";

import { useCallback, useEffect, useRef } from "react";

const TRACK_SRC = "/audio/golden-evening-light.mp3";
const VOLUME = 0.32;

/** Dispatched from Begin the Adventure (user gesture) so browsers allow audio. */
export const START_MUSIC_EVENT = "granny-start-music";

/**
 * Golden Evening Light — hidden player.
 * Starts when Begin the Adventure (or Skip) fires START_MUSIC_EVENT / unlockToken.
 * Pauses when the tab/app is backgrounded or the page is closing so music
 * does not keep playing after a normal (non-force) close.
 * No on-screen play button.
 */
export default function AmbientSound({ unlockToken }: { unlockToken: number }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);
  /** True only when we intentionally paused for background — resume on return. */
  const pausedForBackgroundRef = useRef(false);

  const pauseHard = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    el.pause();
    try {
      if ("mediaSession" in navigator) {
        navigator.mediaSession.playbackState = "paused";
      }
    } catch {
      // mediaSession not available or blocked
    }
  }, []);

  const play = useCallback(async () => {
    const el = audioRef.current;
    if (!el) return;
    try {
      el.volume = VOLUME;
      el.loop = true;
      if (el.paused || el.ended) {
        await el.play();
      }
      startedRef.current = true;
      pausedForBackgroundRef.current = false;
      try {
        if ("mediaSession" in navigator) {
          navigator.mediaSession.playbackState = "playing";
        }
      } catch {
        // ignore
      }
    } catch {
      // Gesture may have been lost; unlockToken retry or another Begin click can retry
      startedRef.current = false;
    }
  }, []);

  // Preload only — do not autoplay until Begin
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.loop = true;
    el.volume = VOLUME;
    el.preload = "auto";
    el.load();
  }, []);

  // Sync listener: runs inside the click stack when Begin dispatches the event
  useEffect(() => {
    const onStart = () => {
      void play();
    };
    window.addEventListener(START_MUSIC_EVENT, onStart);
    return () => window.removeEventListener(START_MUSIC_EVENT, onStart);
  }, [play]);

  // Backup if event was missed (e.g. state-only unlock)
  useEffect(() => {
    if (unlockToken > 0 && !startedRef.current) {
      void play();
    }
  }, [unlockToken, play]);

  // Stop when tab/app is backgrounded, page is hidden, frozen, or unloaded.
  // "Background close" on mobile often keeps the process alive with audio still playing.
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        const el = audioRef.current;
        if (el && !el.paused) {
          pausedForBackgroundRef.current = true;
          pauseHard();
        }
      } else if (pausedForBackgroundRef.current && startedRef.current) {
        void play();
      }
    };

    const onPageHide = () => {
      pausedForBackgroundRef.current = false;
      pauseHard();
      // Reset so a restored bfcache page does not keep a half-playing element
      const el = audioRef.current;
      if (el) {
        el.currentTime = 0;
      }
    };

    const onFreeze = () => {
      pausedForBackgroundRef.current = true;
      pauseHard();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    // Page Lifecycle API (Chrome / some WebViews)
    document.addEventListener("freeze", onFreeze);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
      document.removeEventListener("freeze", onFreeze);
      pauseHard();
    };
  }, [pauseHard, play]);

  useEffect(() => {
    const el = audioRef.current;
    return () => {
      if (el) {
        el.pause();
        el.currentTime = 0;
      }
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      src={TRACK_SRC}
      loop
      playsInline
      preload="auto"
      className="hidden"
      aria-hidden
    />
  );
}
