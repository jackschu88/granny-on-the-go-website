"use client";

import { useState } from "react";
import PreOrderMiataButton from "@/components/PreOrderMiataButton";
import { PREORDER_PRODUCTS } from "@/lib/gumroad";

const amazonUrl = process.env.NEXT_PUBLIC_AMAZON_URL ?? "";

type Props = {
  bookMode?: boolean;
};

/**
 * Pre-order sales page — Miata button primary, optional email notify secondary.
 */
export default function ComingSoon({ bookMode = false }: Props) {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setMessage("");

    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, honeypot }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      setStatus("success");
      setEmail("");
      setMessage(data.message || "You're on the list!");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Failed to sign up");
    }
  };

  return (
    <div className={bookMode ? "mx-auto w-full max-w-md text-center" : "story-section"}>
      {!bookMode && (
        <div
          className="absolute inset-0 bg-gradient-to-b from-cream via-warm-beige/20 to-cream"
          aria-hidden
        />
      )}

      <div className={bookMode ? "" : "relative z-10 mx-auto max-w-2xl text-center"}>
        {!bookMode && (
          <>
            <h2 className="section-title">Pre-Order</h2>
            <div className="mx-auto mb-8 h-0.5 w-20 bg-soft-gold" />
          </>
        )}

        <p className="mb-2 font-serif text-xl text-charcoal/80 md:text-2xl">
          Pre-order Granny on the Go
        </p>
        <p className="mx-auto mb-4 max-w-md font-serif text-sm leading-relaxed text-charcoal/65 md:text-base">
          The first adventure is almost here. Reserve your copy and be among the first
          families to welcome Granny into your home.
        </p>

        {/* Two separate products — each link goes to only its Gumroad slug */}
        <div className="mb-5 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-5">
          <div className="flex flex-col items-center rounded-2xl border border-warm-beige/80 bg-warm-white/50 p-3">
            <p className="mb-1 font-sans text-[10px] uppercase tracking-[0.2em] text-charcoal/40">
              Standard edition
            </p>
            <p className="mb-2 font-serif text-lg font-semibold text-deep-burgundy">
              {PREORDER_PRODUCTS.standard.priceLabel}
            </p>
            <PreOrderMiataButton product={PREORDER_PRODUCTS.standard} />
            <p className="mt-2 max-w-[12rem] text-center font-sans text-[11px] text-charcoal/45">
              {PREORDER_PRODUCTS.standard.description}
            </p>
          </div>
          <div className="flex flex-col items-center rounded-2xl border border-terracotta/25 bg-warm-white/50 p-3">
            <p className="mb-1 font-sans text-[10px] uppercase tracking-[0.2em] text-charcoal/40">
              Signed edition
            </p>
            <p className="mb-2 font-serif text-lg font-semibold text-deep-burgundy">
              {PREORDER_PRODUCTS.signed.priceLabel}
            </p>
            <PreOrderMiataButton product={PREORDER_PRODUCTS.signed} />
            <p className="mt-2 max-w-[12rem] text-center font-sans text-[11px] text-charcoal/45">
              {PREORDER_PRODUCTS.signed.description}
            </p>
          </div>
        </div>
        <p className="mb-5 text-center font-sans text-[11px] text-charcoal/40">
          Each button opens only that product on Gumroad — they are sold separately.
        </p>

        {amazonUrl && (
          <p className="mb-5">
            <a
              href={amazonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm text-terracotta underline-offset-2 hover:underline"
            >
              Also available on Amazon
            </a>
          </p>
        )}

        {/* Secondary: notify list */}
        <p className="mb-2 font-sans text-xs uppercase tracking-[0.2em] text-charcoal/40">
          Or get updates by email
        </p>
        <div className="rounded-2xl border border-warm-beige/80 bg-warm-white/70 p-4 shadow-sm">
          {status === "success" ? (
            <div role="status">
              <p className="font-serif text-base text-deep-burgundy">{message}</p>
              <button
                type="button"
                className="btn-secondary mt-3 text-sm"
                onClick={() => {
                  setStatus("idle");
                  setMessage("");
                }}
              >
                Add another email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
              <div className="absolute opacity-0 pointer-events-none" aria-hidden="true">
                <label htmlFor="notify-honeypot">Leave empty</label>
                <input
                  id="notify-honeypot"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>
              <label htmlFor="notify-email" className="sr-only">
                Email address
              </label>
              <input
                id="notify-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 rounded-full border border-warm-beige bg-cream px-4 py-2.5 font-sans text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-terracotta"
                required
                disabled={status === "sending"}
              />
              <button
                type="submit"
                className="btn-secondary justify-center whitespace-nowrap text-sm disabled:opacity-50"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Saving…" : "Notify Me"}
              </button>
            </form>
          )}
          {status === "error" && (
            <p className="mt-2 font-sans text-sm text-adventure" role="alert">
              {message}
            </p>
          )}
          {status !== "success" && (
            <p className="mt-3 font-sans text-xs text-charcoal/40">
              No spam. Just exciting adventures.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
