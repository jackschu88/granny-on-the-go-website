/**
 * Gumroad pre-order products (The Veil Press).
 * Signed-copy slug: set NEXT_PUBLIC_GUMROAD_SIGNED_SLUG (or paste slug below).
 */

const GUMROAD_BASE = "https://theveilpress.gumroad.com/l";

export type PreorderProduct = {
  id: "standard" | "signed";
  /** Gumroad product slug (path after /l/) */
  slug: string;
  priceLabel: string;
  title: string;
  shortLabel: string;
  description: string;
};

/** Standard pre-order — live */
export const STANDARD_SLUG = "rsmfcb";

/**
 * Signed-copy slug — paste when ready, or set env NEXT_PUBLIC_GUMROAD_SIGNED_SLUG.
 * Leave empty until provided; button stays visible but disabled until set.
 */
export const SIGNED_SLUG =
  (typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_GUMROAD_SIGNED_SLUG?.trim()) ||
  "";

export function gumroadUrl(slug: string): string {
  return `${GUMROAD_BASE}/${slug}`;
}

export const PREORDER_PRODUCTS: Record<"standard" | "signed", PreorderProduct> =
  {
    standard: {
      id: "standard",
      slug: STANDARD_SLUG,
      priceLabel: "$15.99",
      title: "Preorder the Adventure",
      shortLabel: "Standard",
      description: "Book pre-order · Keepsake PDF",
    },
    signed: {
      id: "signed",
      slug: SIGNED_SLUG,
      priceLabel: "$20.99",
      title: "Signed Copy",
      shortLabel: "Signed",
      description: "Author-signed copy · Limited",
    },
  };

export const GUMROAD_PREORDER_URL = gumroadUrl(STANDARD_SLUG);
