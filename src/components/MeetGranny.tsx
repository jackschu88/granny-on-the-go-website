"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function MeetGranny() {
  return (
    <section id="meet-granny" className="story-section">
      <div className="absolute inset-0 watercolor-bg opacity-60" aria-hidden />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="section-title">Meet Granny</h2>
          <div className="mx-auto mb-8 h-0.5 w-20 bg-soft-gold" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="card text-left"
        >
          <div className="flex flex-col items-center gap-8 md:flex-row">
            <div className="relative h-52 w-52 flex-shrink-0 overflow-hidden rounded-full border-2 border-soft-gold/40 shadow-md md:h-60 md:w-60">
              <Image
                src="/images/book-cover.jpg"
                alt="Granny on the Go — smiling, red adventure cap, colorful tote, little black convertible"
                fill
                sizes="240px"
                className="object-cover object-[42%_28%]"
              />
            </div>

            <div className="flex-1">
              <p className="mb-4 font-serif text-lg leading-relaxed text-charcoal/80 md:text-xl">
                She arrives in her little black convertible, wearing her adventure hat,
                carrying her colorful tote.
              </p>
              <p className="mb-4 font-serif text-lg leading-relaxed text-charcoal/80 md:text-xl">
                Her greatest gift isn&apos;t what&apos;s inside the tote.
              </p>
              <p className="font-serif text-xl font-semibold italic text-deep-burgundy md:text-2xl">
                It&apos;s how she notices children.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          {[
            "Adventure Cap",
            "Little Black Convertible",
            "Colorful Tote",
            "A Noticing Heart",
          ].map((label) => (
            <span
              key={label}
              className="rounded-full bg-warm-beige/50 px-4 py-2 font-sans text-sm text-charcoal/60"
            >
              ✦ {label}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
