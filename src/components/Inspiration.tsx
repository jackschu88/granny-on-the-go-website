"use client";

import { motion } from "framer-motion";

export default function Inspiration() {
  return (
    <section id="inspiration" className="story-section">
      <div className="absolute inset-0 watercolor-bg" aria-hidden />

      <div className="relative z-10 mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-10 text-center"
        >
          <h2 className="section-title">The Inspiration</h2>
          <div className="mx-auto h-0.5 w-20 bg-soft-gold" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="card"
        >
          <div className="flex flex-col items-center gap-8 md:flex-row">
            <div className="flex h-40 w-40 flex-shrink-0 items-center justify-center rounded-full border-2 border-sky-blue/30 bg-gradient-to-br from-sky-blue/20 to-soft-gold/20 md:h-48 md:w-48">
              <span className="font-serif text-4xl text-deep-burgundy" aria-hidden>
                E
              </span>
            </div>

            <div className="flex-1">
              <h3 className="mb-3 font-serif text-2xl text-deep-burgundy">Edie Denzel</h3>
              <p className="mb-4 font-serif text-lg leading-relaxed text-charcoal/80 md:text-xl">
                The character of Granny is inspired by Edie Denzel — a beloved babysitter who
                encouraged children through curiosity, kindness, and adventure.
              </p>
              <p className="font-serif text-lg leading-relaxed text-charcoal/80 md:text-xl">
                Her legacy lives on in every page: the belief that the greatest gift we can give a
                child is knowing they are capable of wonderful things.
              </p>
              <div className="mt-6 border-t border-warm-beige pt-6">
                <p className="font-sans text-sm italic text-charcoal/50">
                  Shared with respect and gratitude for the real person who made ordinary days feel
                  like adventures.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
