"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/prefers-reduced-motion";

/**
 * Soft nature ambience (birds / outdoor hush).
 * Never autoplays without a user gesture — master prompt forbids autoplay audio.
 * Tries /audio/birds.mp3; falls back to a gentle synthesized outdoor pad.
 */
export default function AmbientSound({ unlockToken }: { unlockToken: number }) {
  const [on, setOn] = useState(false);
  const [ready, setReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ stop: () => void } | null>(null);

  const stopSynth = useCallback(() => {
    nodesRef.current?.stop();
    nodesRef.current = null;
    if (ctxRef.current) {
      void ctxRef.current.close().catch(() => undefined);
      ctxRef.current = null;
    }
  }, []);

  const startSynth = useCallback(async () => {
    stopSynth();
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    ctxRef.current = ctx;
    if (ctx.state === "suspended") await ctx.resume();

    // Soft filtered noise ≈ distant outdoor air
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1800;
    filter.Q.value = 0.6;

    const gain = ctx.createGain();
    gain.gain.value = 0.035;

    // Occasional soft chirp-ish blips
    const chirpGain = ctx.createGain();
    chirpGain.gain.value = 0;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 2400;
    osc.connect(chirpGain);
    chirpGain.connect(ctx.destination);
    osc.start();

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();

    let chirpTimer: ReturnType<typeof setInterval> | null = setInterval(() => {
      if (!ctxRef.current) return;
      const t = ctx.currentTime;
      chirpGain.gain.cancelScheduledValues(t);
      chirpGain.gain.setValueAtTime(0, t);
      chirpGain.gain.linearRampToValueAtTime(0.012, t + 0.02);
      chirpGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      osc.frequency.setValueAtTime(1800 + Math.random() * 1200, t);
    }, 2800 + Math.random() * 2200);

    nodesRef.current = {
      stop: () => {
        if (chirpTimer) clearInterval(chirpTimer);
        chirpTimer = null;
        try {
          noise.stop();
          osc.stop();
        } catch {
          // already stopped
        }
      },
    };
  }, [stopSynth]);

  const startFile = useCallback(async () => {
    const el = audioRef.current;
    if (!el) return false;
    try {
      el.volume = 0.28;
      el.loop = true;
      await el.play();
      return true;
    } catch {
      return false;
    }
  }, []);

  const enable = useCallback(async () => {
    if (prefersReducedMotion()) return;
    const played = await startFile();
    if (!played) {
      await startSynth();
    }
    setOn(true);
  }, [startFile, startSynth]);

  const disable = useCallback(() => {
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
    stopSynth();
    setOn(false);
  }, [stopSynth]);

  // After user begins the adventure (unlockToken bumps), offer sound ready
  useEffect(() => {
    if (unlockToken > 0) setReady(true);
  }, [unlockToken]);

  useEffect(() => () => disable(), [disable]);

  if (!ready) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <audio ref={audioRef} src="/audio/birds.mp3" preload="none" />
      <button
        type="button"
        onClick={() => (on ? disable() : void enable())}
        className="rounded-full border border-warm-beige bg-warm-white/95 px-3 py-2 font-sans text-xs text-charcoal/70 shadow-sm backdrop-blur-sm transition hover:text-deep-burgundy"
        aria-pressed={on}
        aria-label={on ? "Mute ambient sounds" : "Play soft bird ambience"}
      >
        {on ? "🔊 Sounds on" : "🔈 Sounds off"}
      </button>
    </div>
  );
}
