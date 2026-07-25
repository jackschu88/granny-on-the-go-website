"use client";

import { useCallback, useEffect, useRef } from "react";

const TRACK_SRC = "/audio/golden-evening-light.mp3";
const VOLUME = 0.32;

/** Dispatched from Begin the Adventure (user gesture) so browsers allow audio. */
export const START_MUSIC_EVENT = "granny-start-music";

/**
 * Golden Evening Light — hidden player.
 * Starts when Begin the Adventure (or Skip) fires START_MUSIC_EVENT / unlockToken.
 * No on-screen play button.
 */
export default function AmbientSound({ unlockToken }: { unlockToken: number }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);

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

  useEffect(() => {
    return () => {
      const el = audioRef.current;
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
