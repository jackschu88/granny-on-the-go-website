"use client";

import { motion } from "framer-motion";

const previews = [
  {
    label: "She Arrives",
    blurb:
      "A little car rolls into the driveway. It isn’t fancy. It isn’t loud. But somehow… it looks like adventure.",
  },
  {
    label: "What Sounds Like an Adventure?",
    blurb:
      "Bubbles, chalk, jump ropes, books, and surprises wait in her tote — and Granny knows exactly what each child needs.",
  },
  {
    label: "Who They’re Becoming",
    blurb:
      "At the end of the day, children remember not only the toys and popsicles, but that someone saw something special inside them.",
  },
];

export default function PeekIntoAdventure() {
  return (
    <section id="peek-adventure" className="story-section">
      <div
        className="absolute inset-0 bg-gradient-to-b from-cream via-warm-beige/30 to-cream"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <h2 className="section-title">Peek Into the Adventure</h2>
          <div className="mx-auto mb-6 h-0.5 w-20 bg-soft-gold" />
          <p className="section-subtitle mx-auto">
            A glimpse into the world waiting between the pages — without spoiling the pictures.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {previews.map((preview, i) => (
            <motion.div
              key={preview.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.12 }}
              className="card text-left"
            >
              <p className="mb-2 font-sans text-xs uppercase tracking-[0.2em] text-terracotta">
                Chapter hush
              </p>
              <h3 className="mb-3 font-serif text-xl text-deep-burgundy">{preview.label}</h3>
              <p className="font-sans text-sm leading-relaxed text-charcoal/60">{preview.blurb}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
