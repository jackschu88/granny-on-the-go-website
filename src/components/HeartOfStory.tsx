"use client";

import { motion } from "framer-motion";

const pillars = [
  {
    title: "Curiosity",
    desc: "Four curious children wait at the window. Every question, every “is she here yet?” is the first step toward adventure.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C17F59" strokeWidth="1.5" aria-hidden>
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    ),
  },
  {
    title: "Courage",
    desc: "Sometimes the bravest thing we can do is try one more time. Granny cheers for courage — not perfection.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C17F59" strokeWidth="1.5" aria-hidden>
        <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 004 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Wonder",
    desc: "Some people see children. Granny saw who they were becoming — in chalk drawings, bubble chases, and quiet noticing.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C17F59" strokeWidth="1.5" aria-hidden>
        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
];

export default function HeartOfStory() {
  return (
    <section id="heart-of-story" className="story-section">
      <div
        className="absolute inset-0 bg-gradient-to-b from-cream via-warm-beige/20 to-cream"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">The Heart of the Story</h2>
          <div className="mx-auto mb-6 h-0.5 w-20 bg-soft-gold" />
          <p className="section-subtitle mx-auto">
            A story about love, adventure, and the little things that mean the most.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {pillars.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.12 }}
              className="card text-left"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-terracotta/10">
                {item.icon}
              </div>
              <h3 className="mb-2 font-serif text-xl text-deep-burgundy">{item.title}</h3>
              <p className="font-sans text-sm leading-relaxed text-charcoal/60">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
