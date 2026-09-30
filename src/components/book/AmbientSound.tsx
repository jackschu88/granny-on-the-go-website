"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const TRACK_SRC = "/audio/golden-evening-light.mp3";
const VOLUME = 0.32;

/** Dispatched from Begin the Adventure (user gesture) so browsers allow audio. */
export const START_MUSIC_EVENT = "granny-start-music";

type SoundState = {
  started: boolean;
  playing: boolean;
  toggle: () => void;
};

const SoundContext = createContext<SoundState | null>(null);

/** Pause / resume. Renders nothing until the visitor has started the music. */
export function SoundToggle({ className = "" }: { className?: string }) {
  const sound = useContext(SoundContext);
  if (!sound?.started) return null;

  return (
    <button
      type="button"
      onClick={sound.toggle}
      aria-pressed={sound.playing}
      aria-label={sound.playing ? "Pause music" : "Play music"}
      className={className}
    >
      {sound.playing ? "Sound on" : "Sound off"}
    </button>
  );
}

/**
 * Golden Evening Light — hidden player.
 * Starts when Begin the Adventure (or Skip) fires START_MUSIC_EVENT / unlockToken.
 * Pauses when the tab/app is backgrounded or the page is closing so music
 * does not keep playing after a normal (non-force) close.
 * The file stays unloaded until Begin, so the cover does not download the track.
 */
export default function AmbientSound({
  unlockToken,
  children,
}: {
  unlockToken: number;
  children?: ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);
  /** Visitor chose Sound off — do not resume over that choice. */
  const userPausedRef = useRef(false);
  /** True only when we intentionally paused for background — resume on return. */
  const pausedForBackgroundRef = useRef(false);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);

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

  const attachSource = useCallback(() => {
    const el = audioRef.current;
    if (!el || el.getAttribute("src")) return;
    el.preload = "auto";
    el.src = TRACK_SRC;
  }, []);

  const play = useCallback(async () => {
    const el = audioRef.current;
    if (!el || userPausedRef.current) return;
    try {
      attachSource();
      el.volume = VOLUME;
      el.loop = true;
      if (el.paused || el.ended) {
        await el.play();
      }
      startedRef.current = true;
      pausedForBackgroundRef.current = false;
      setStarted(true);
      setPlaying(true);
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
      setPlaying(false);
    }
  }, [attachSource]);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (!el.paused && !el.ended) {
      userPausedRef.current = true;
      pausedForBackgroundRef.current = false;
      pauseHard();
      setPlaying(false);
      return;
    }
    userPausedRef.current = false;
    void play();
  }, [pauseHard, play]);

  // Sync listener: runs inside the click stack when Begin dispatches the event
  useEffect(() => {
    const onStart = () => {
      userPausedRef.current = false;
      setStarted(true);
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
          setPlaying(false);
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
    <SoundContext.Provider value={{ started, playing, toggle }}>
      {children}
      <audio
        ref={audioRef}
        loop
        playsInline
        preload="none"
        className="hidden"
        aria-hidden
      />
    </SoundContext.Provider>
  );
}
