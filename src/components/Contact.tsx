"use client";

import { useState } from "react";

type Props = {
  bookMode?: boolean;
};

export default function Contact({ bookMode = false }: Props) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    honeypot: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setFormState({ name: "", email: "", subject: "", message: "", honeypot: "" });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Failed to send message");
    }
  };

  const form = (
    <>
      {status === "success" ? (
        <div className="rounded-2xl border border-warm-beige/80 bg-warm-white/80 p-6 text-center" role="status">
          <h3 className="font-serif text-xl text-deep-burgundy mb-2">Message Sent!</h3>
          <p className="font-sans text-sm text-charcoal/60">
            Thank you for reaching out. We&apos;ll get back to you soon.
          </p>
          <button type="button" onClick={() => setStatus("idle")} className="btn-primary mt-4">
            Send Another Message
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 rounded-2xl border border-warm-beige/80 bg-warm-white/80 p-5 shadow-sm"
        >
          <div className="absolute opacity-0 pointer-events-none" aria-hidden="true">
            <label htmlFor="honeypot">Leave this empty</label>
            <input
              id="honeypot"
              name="honeypot"
              type="text"
              value={formState.honeypot}
              onChange={(e) => setFormState({ ...formState, honeypot: e.target.value })}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1 block font-sans text-xs text-charcoal/70">
                Name *
              </label>
              <input
                id="name"
                type="text"
                required
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                className="w-full rounded-xl border border-warm-beige bg-cream px-3 py-2.5 font-sans text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-terracotta"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block font-sans text-xs text-charcoal/70">
                Email *
              </label>
              <input
                id="email"
                type="email"
                required
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                className="w-full rounded-xl border border-warm-beige bg-cream px-3 py-2.5 font-sans text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-terracotta"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="mb-1 block font-sans text-xs text-charcoal/70">
              Subject *
            </label>
            <input
              id="subject"
              type="text"
              required
              value={formState.subject}
              onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
              className="w-full rounded-xl border border-warm-beige bg-cream px-3 py-2.5 font-sans text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-terracotta"
              placeholder="What's this about?"
            />
          </div>

          <div>
            <label htmlFor="message" className="mb-1 block font-sans text-xs text-charcoal/70">
              Message *
            </label>
            <textarea
              id="message"
              required
              rows={bookMode ? 3 : 5}
              value={formState.message}
              onChange={(e) => setFormState({ ...formState, message: e.target.value })}
              className="w-full resize-y rounded-xl border border-warm-beige bg-cream px-3 py-2.5 font-sans text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-terracotta"
              placeholder="Your message..."
            />
          </div>

          {status === "error" && (
            <div className="rounded-lg bg-adventure/10 p-2 font-sans text-sm text-adventure" role="alert">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="btn-primary w-full justify-center disabled:opacity-50"
          >
            {status === "sending" ? "Sending..." : "Send Message"}
          </button>

          <p className="text-center font-sans text-xs text-charcoal/40">
            Or email{" "}
            <a
              href="mailto:GrannyOnTheGoBooks@gmail.com"
              className="text-terracotta hover:text-deep-burgundy"
            >
              GrannyOnTheGoBooks@gmail.com
            </a>
          </p>
        </form>
      )}
    </>
  );

  const intro = (
    <div className={bookMode ? "mb-4 text-center" : "mb-8 text-center"}>
      {!bookMode && (
        <>
          <h2 className="section-title">Let&apos;s Begin an Adventure Together</h2>
          <div className="mx-auto mb-4 h-0.5 w-20 bg-soft-gold" />
        </>
      )}
      {bookMode && (
        <h3 className="mb-2 font-serif text-xl text-deep-burgundy">
          Let&apos;s Begin an Adventure Together
        </h3>
      )}
      <p className="mx-auto max-w-md font-serif text-sm leading-relaxed text-charcoal/70 md:text-base">
        Whether you&apos;d like to say hello, ask a question, explore future
        collaborations, or simply share your favorite adventure, we&apos;d love to
        hear from you.
      </p>
      <p className="mt-2 font-serif text-sm italic text-charcoal/55">
        Every message is read with care.
      </p>
    </div>
  );

  if (bookMode) {
    return (
      <div className="mx-auto w-full max-w-lg">
        {intro}
        {form}
      </div>
    );
  }

  return (
    <section id="contact" className="story-section">
      <div className="absolute inset-0 watercolor-bg" aria-hidden />
      <div className="relative z-10 mx-auto w-full max-w-2xl">
        {intro}
        {form}
      </div>
    </section>
  );
}
