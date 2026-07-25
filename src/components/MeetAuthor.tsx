"use client";

import { motion } from "framer-motion";

export default function MeetAuthor() {
  return (
    <section id="meet-author" className="story-section">
      <div className="absolute inset-0 watercolor-bg opacity-50" aria-hidden />

      <div className="relative z-10 mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-10 text-center"
        >
          <h2 className="section-title">Meet the Author</h2>
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
            <div className="flex h-40 w-40 flex-shrink-0 items-center justify-center rounded-full border-2 border-deep-burgundy/20 bg-gradient-to-br from-deep-burgundy/10 to-soft-gold/10 md:h-48 md:w-48">
              <span className="font-serif text-3xl text-deep-burgundy" aria-hidden>
                HS
              </span>
            </div>

            <div className="flex-1">
              <h3 className="mb-1 font-serif text-2xl text-deep-burgundy">Haley Schumacher</h3>
              <p className="mb-4 font-sans text-sm text-terracotta">Author &amp; Creator</p>
              <p className="mb-4 font-serif text-lg leading-relaxed text-charcoal/80">
                Haley Schumacher is a mother of four living in the Las Vegas area.
              </p>
              <p className="mb-4 font-serif text-lg leading-relaxed text-charcoal/80">
                Granny on the Go grew from the adventures her children experienced with the
                real-life inspiration for Granny.
              </p>
              <p className="font-serif text-lg leading-relaxed text-charcoal/80">
                The long-term vision is a growing children&apos;s brand focused on curiosity,
                courage, imagination, and everyday wonder.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
