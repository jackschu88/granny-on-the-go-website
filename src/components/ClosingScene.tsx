"use client";

import { motion } from "framer-motion";

export default function ClosingScene() {
  return (
    <section
      id="closing-scene"
      className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden px-6"
    >
      <div
        className="absolute inset-0 bg-gradient-to-b from-cream via-warm-beige/40 to-deep-burgundy/5"
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative z-10 max-w-2xl text-center"
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C17F59"
          strokeWidth="1"
          className="mx-auto mb-8"
          aria-hidden
        >
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>

        <p className="mb-6 font-serif text-2xl italic text-deep-burgundy md:text-3xl">
          “Today was a very good adventure.”
        </p>
        <p className="mb-4 font-serif text-lg text-charcoal/55">
          Tomorrow is another ordinary day… the perfect day for another adventure.
        </p>
        <p className="mb-10 font-sans text-sm text-charcoal/40">
          When you leave this page, we hope you want to return for the next one.
        </p>

        <a href="#hero" className="btn-secondary">
          Begin Again
        </a>
      </motion.div>
    </section>
  );
}
