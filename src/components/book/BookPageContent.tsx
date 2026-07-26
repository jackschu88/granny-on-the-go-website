"use client";

import Image from "next/image";
import type { BookPageId } from "@/lib/book-pages";
import ComingSoon from "@/components/ComingSoon";
import Contact from "@/components/Contact";

type Props = {
  pageId: BookPageId;
  /** Turn to the next page (Welcome CTA) */
  onNext?: () => void;
};

/**
 * Right-page (desktop) / body (mobile) content.
 * Sized for a half-spread — keep type moderate, stack vertically.
 */
export default function BookPageContent({ pageId, onNext }: Props) {
  switch (pageId) {
    case "hero":
      return (
        <div className="book-copy flex h-full flex-col items-center justify-center text-center">
          <div className="relative mb-2.5 h-16 w-16 overflow-hidden rounded-full border-2 border-soft-gold/35 shadow-md md:mb-4 md:h-28 md:w-28">
            <Image
              src="/images/book-cover.jpg"
              alt=""
              fill
              sizes="112px"
              className="object-cover object-[42%_28%]"
            />
          </div>
          <p className="mb-2 max-w-sm font-serif text-sm leading-snug text-charcoal/80 md:mb-3 md:text-lg md:leading-relaxed">
            Welcome to Granny on the Go Adventures.
          </p>
          <p className="mb-2 max-w-sm font-serif text-[13px] leading-snug text-charcoal/70 md:mb-3 md:text-base md:leading-relaxed">
            This is the official home of Granny on the Go—a place where imagination
            is encouraged, kindness is celebrated, and the smallest moments often
            become the greatest adventures.
          </p>
          <p className="mb-2 max-w-sm font-serif text-[13px] leading-snug text-charcoal/70 md:mb-4 md:text-base md:leading-relaxed">
            Turn the page and step into Granny&apos;s world.
          </p>
          <p className="mb-3 max-w-sm font-serif text-[13px] italic text-deep-burgundy md:mb-5 md:text-base">
            &ldquo;Adventure begins the moment someone believes today can be
            special.&rdquo;
          </p>
          {onNext ? (
            <button type="button" onClick={onNext} className="btn-primary px-5 py-2 text-xs md:px-6 md:py-2.5 md:text-sm">
              Turn the Page →
            </button>
          ) : (
            <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-terracotta/80">
              Turn the Page →
            </p>
          )}
        </div>
      );

    case "meet-granny":
      return (
        <div className="book-copy flex h-full flex-col justify-center">
          <div className="relative mx-auto mb-2 aspect-square w-full max-w-[72px] overflow-hidden rounded-full border-2 border-soft-gold/40 shadow-md md:mb-3 md:max-w-[110px]">
            <Image
              src="/images/book-cover.jpg"
              alt="Granny arriving with her adventure tote"
              fill
              sizes="110px"
              className="object-cover object-[42%_28%]"
            />
          </div>
          <p className="mb-1 font-serif text-[13px] leading-snug text-charcoal/80 md:mb-2 md:text-base md:leading-relaxed">
            Every time Granny arrives, no one knows exactly where the day will lead.
          </p>
          <p className="mb-1 font-serif text-[13px] leading-snug text-charcoal/80 md:mb-2 md:text-base md:leading-relaxed">
            That&apos;s part of the magic.
          </p>
          <p className="mb-1 font-serif text-[13px] leading-snug text-charcoal/80 md:mb-2 md:text-base md:leading-relaxed">
            The best adventures aren&apos;t carefully planned.
          </p>
          <p className="mb-1 font-serif text-[13px] leading-snug text-charcoal/80 md:mb-2 md:text-base md:leading-relaxed">
            They&apos;re discovered together.
          </p>
          <p className="mb-1 font-serif text-[13px] leading-snug text-charcoal/80 md:mb-2 md:text-base md:leading-relaxed">
            She arrives in her little black convertible, wearing her favorite
            adventure hat and carrying her colorful tote.
          </p>
          <p className="mb-1 font-serif text-[13px] leading-snug text-charcoal/80 md:mb-2 md:text-base md:leading-relaxed">
            Inside are bubbles, sidewalk chalk, books, jump ropes, popsicles, and
            little surprises.
          </p>
          <p className="mb-1 font-serif text-[13px] leading-snug text-charcoal/80 md:mb-2 md:text-base md:leading-relaxed">
            But those aren&apos;t what children remember most.
          </p>
          <p className="mb-1 font-serif text-[13px] leading-snug text-charcoal/80 md:mb-2 md:text-base md:leading-relaxed">
            They remember the way Granny made an ordinary afternoon feel like the
            greatest adventure in the world.
          </p>
          <p className="mb-0.5 font-serif text-[13px] leading-snug text-charcoal/80 md:mb-1 md:text-base md:leading-relaxed">
            Because Granny doesn&apos;t just see children.
          </p>
          <p className="mb-2 font-serif text-sm font-semibold italic text-deep-burgundy md:mb-3 md:text-lg">
            She sees who they are becoming.
          </p>
          <div className="flex flex-wrap gap-1.5 md:gap-2">
            {[
              "Adventure Hat",
              "Little Black Convertible",
              "Colorful Tote",
              "Endless Encouragement",
            ].map((t) => (
              <span
                key={t}
                className="rounded-full bg-warm-beige/70 px-2 py-0.5 font-sans text-[10px] text-charcoal/60 md:px-3 md:py-1 md:text-xs"
              >
                ✦ {t}
              </span>
            ))}
          </div>
        </div>
      );

    case "heart-of-story":
      return (
        <div className="book-copy flex h-full flex-col justify-center">
          <div className="mb-2.5 space-y-0.5 text-center md:mb-4 md:space-y-1.5">
            <p className="font-serif text-[13px] leading-snug text-charcoal/70 md:text-base md:leading-relaxed">
              Not expensive toys.
            </p>
            <p className="font-serif text-[13px] leading-snug text-charcoal/70 md:text-base md:leading-relaxed">
              Not perfect plans.
            </p>
            <p className="font-serif text-[13px] leading-snug text-charcoal/70 md:text-base md:leading-relaxed">
              Just someone willing to say,
            </p>
            <p className="font-serif text-sm italic text-deep-burgundy md:text-lg">
              &ldquo;Let&apos;s see what today becomes.&rdquo;
            </p>
          </div>
          <div className="grid gap-1.5 md:gap-2.5">
            {[
              {
                title: "Curiosity",
                body: "Every question is the beginning of an adventure. Granny teaches children that wondering about the world is something to celebrate.",
              },
              {
                title: "Courage",
                body: "The bravest thing a child can do isn't being fearless. It's trying one more time.",
              },
              {
                title: "Wonder",
                body: "Magic doesn't always sparkle. Sometimes it looks like sidewalk chalk, bubbles floating in the afternoon sun, or laughter echoing down the driveway.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-lg border border-warm-beige/80 bg-warm-white/80 p-2 text-left shadow-sm md:rounded-xl md:p-3"
              >
                <h3 className="mb-0.5 font-serif text-sm text-deep-burgundy md:mb-1 md:text-base">
                  {card.title}
                </h3>
                <p className="font-sans text-[12px] leading-snug text-charcoal/65 md:text-sm md:leading-relaxed">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      );

    case "inspiration":
      return (
        <div className="book-copy flex h-full flex-col justify-center">
          <p className="mb-1.5 font-serif text-[13px] leading-snug text-charcoal/80 md:mb-2 md:text-base md:leading-relaxed">
            The character of Granny was lovingly inspired by{" "}
            <span className="font-semibold text-deep-burgundy">Edie</span>, a
            remarkable babysitter whose kindness, creativity, and joyful spirit left a
            lasting impression on countless children—including my own.
          </p>
          <p className="mb-1.5 font-serif text-[13px] leading-snug text-charcoal/80 md:mb-2 md:text-base md:leading-relaxed">
            She had a gift for transforming ordinary afternoons into unforgettable
            adventures.
          </p>
          <p className="mb-1.5 font-serif text-[13px] leading-snug text-charcoal/80 md:mb-2 md:text-base md:leading-relaxed">
            More importantly, she helped children believe in themselves.
          </p>
          <p className="mb-1.5 font-serif text-[13px] leading-snug text-charcoal/80 md:mb-2 md:text-base md:leading-relaxed">
            While this book is a work of fiction, its heart was inspired by someone who
            quietly reminded children that they were capable of wonderful things.
          </p>
          <p className="mt-2 border-t border-warm-beige pt-2 font-serif text-sm italic text-deep-burgundy md:mt-3 md:pt-3 md:text-base">
            Thank you, Edie.
          </p>
          <p className="font-serif text-[13px] italic text-charcoal/60 md:text-sm">
            Your adventures continue.
          </p>
        </div>
      );

    case "peek-adventure":
      return (
        <div className="book-copy flex h-full flex-col justify-center">
          <div className="grid gap-1.5 md:gap-2.5">
            {[
              {
                title: "A Familiar Sound",
                body: "A little black convertible rolls into the driveway. The children don't need to ask who's here. They already know. Adventure has arrived.",
              },
              {
                title: "What's Inside the Tote?",
                body: "Some days it's bubbles. Some days it's sidewalk chalk. Some days it's a stack of library books. The surprise is never what's inside. The surprise is what everyone creates together.",
              },
              {
                title: "The Perfect Ending",
                body: "No matter where the day takes them, every adventure ends the same way—with tired feet, happy hearts… and popsicles.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-lg border border-warm-beige/80 bg-warm-white/80 p-2 text-left shadow-sm md:rounded-xl md:p-3"
              >
                <h3 className="mb-0.5 font-serif text-sm text-deep-burgundy md:mb-1 md:text-base">
                  {card.title}
                </h3>
                <p className="font-sans text-[12px] leading-snug text-charcoal/65 md:text-sm md:leading-relaxed">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      );

    case "meet-author":
      return (
        <div className="book-copy flex h-full flex-col justify-center">
          <h3 className="mb-0.5 font-serif text-xl text-deep-burgundy md:mb-1 md:text-2xl">
            Haley Schumacher
          </h3>
          <p className="mb-2.5 font-sans text-xs text-terracotta md:mb-4 md:text-sm">
            Mother. Storyteller. Believer in childhood.
          </p>
          <p className="mb-1.5 font-serif text-[13px] leading-snug text-charcoal/80 md:mb-2 md:text-base md:leading-relaxed">
            Granny on the Go began as a simple dream—to capture the kind of childhood
            memories that stay with us forever.
          </p>
          <p className="mb-1.5 font-serif text-[13px] leading-snug text-charcoal/80 md:mb-2 md:text-base md:leading-relaxed">
            Inspired by the woman who brought so much joy to my own children, I wanted
            to create a story that reminds families that imagination doesn&apos;t have
            an age limit, and adventure doesn&apos;t require a destination.
          </p>
          <p className="font-serif text-[13px] leading-snug text-charcoal/80 md:text-base md:leading-relaxed">
            My hope is that every child who reads this book finishes it believing they
            are brave, curious, deeply loved…
          </p>
          <p className="mt-1.5 font-serif text-sm italic text-deep-burgundy md:mt-2 md:text-lg">
            …and ready for tomorrow&apos;s adventure.
          </p>
        </div>
      );

    case "coming-soon":
      return (
        <div className="book-copy book-form-page flex h-full flex-col justify-center">
          <ComingSoon bookMode />
        </div>
      );

    case "contact":
      return (
        <div className="book-copy book-form-page flex h-full flex-col justify-center">
          <Contact bookMode />
        </div>
      );

    case "closing":
      return (
        <div className="book-copy flex h-full flex-col items-center justify-center text-center">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#C17F59"
            strokeWidth="1"
            className="mb-2.5 md:mb-4 md:h-9 md:w-9"
            aria-hidden
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          <p className="mb-1.5 max-w-sm font-serif text-[13px] leading-snug text-charcoal/75 md:mb-3 md:text-base md:leading-relaxed">
            Every wonderful story eventually reaches its final page.
          </p>
          <p className="mb-1.5 max-w-sm font-serif text-[13px] leading-snug text-charcoal/75 md:mb-3 md:text-base md:leading-relaxed">
            But the best adventures never truly end.
          </p>
          <p className="mb-1.5 max-w-sm font-serif text-[13px] leading-snug text-charcoal/75 md:mb-3 md:text-base md:leading-relaxed">
            Tomorrow is another ordinary day…
          </p>
          <p className="mb-2.5 max-w-sm font-serif text-sm italic text-deep-burgundy md:mb-4 md:text-lg">
            …which means it&apos;s the perfect day for another extraordinary adventure.
          </p>
          <p className="mb-0.5 max-w-sm font-serif text-[13px] text-charcoal/60 md:mb-1 md:text-sm">
            Thank you for visiting Granny&apos;s world.
          </p>
          <p className="max-w-xs font-serif text-[13px] text-charcoal/50 md:text-sm">
            We hope you&apos;ll come back soon.
          </p>
        </div>
      );

    default:
      return null;
  }
}
