"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16"
    >
      <div className="absolute inset-0 watercolor-bg" aria-hidden />

      {/* Soft cover wash in background — not a second full cover, just warmth */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.12]" aria-hidden>
        <Image
          src="/images/book-cover.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[center_30%] blur-sm scale-105"
          priority
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cream/90 via-cream/80 to-cream"
        aria-hidden
      />

      {!reduceMotion && (
        <>
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-24 left-10 h-8 w-8 rounded-full bg-soft-gold/20 md:left-20"
            aria-hidden
          />
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-32 right-10 h-12 w-12 rounded-full bg-sky-blue/20 md:right-20"
            aria-hidden
          />
        </>
      )}

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-10 max-w-3xl text-center"
      >
        <p className="mb-6 font-sans text-sm uppercase tracking-[0.3em] text-terracotta md:text-base">
          Granny on the Go Adventures
        </p>

        <h1 className="mb-6 font-serif text-5xl leading-tight text-deep-burgundy md:text-7xl lg:text-8xl">
          Granny
          <span className="mt-2 block text-3xl text-terracotta md:text-5xl lg:text-6xl">
            on the Go
          </span>
        </h1>

        <p className="mx-auto mb-4 max-w-xl font-sans text-lg text-charcoal/70 md:text-xl">
          The official home of Granny on the Go Adventures
        </p>
        <p className="mx-auto mb-10 max-w-lg font-serif text-base italic text-charcoal/55 md:text-lg">
          Ordinary days become extraordinary adventures when someone takes the time
          to truly see a child.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a href="#coming-soon" className="btn-primary">
            Coming Soon
          </a>
          <a href="#meet-granny" className="btn-secondary">
            Meet Granny
          </a>
        </div>
      </motion.div>

      {!reduceMotion && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          aria-hidden
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-terracotta/30 pt-2"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-terracotta/50" />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
