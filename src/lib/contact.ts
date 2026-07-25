import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters")
    .max(200, "Subject is too long"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message is too long"),
  honeypot: z.string().max(0, "Bot detected").optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const notifySchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  honeypot: z.string().max(0, "Bot detected").optional(),
});

export type NotifyFormData = z.infer<typeof notifySchema>;

/** Commerce links — see also src/lib/gumroad.ts */
export const commerceConfig = {
  amazonUrl: process.env.NEXT_PUBLIC_AMAZON_URL ?? "",
  gumroadUrl:
    process.env.NEXT_PUBLIC_GUMROAD_URL ||
    "https://theveilpress.gumroad.com/l/rsmfcb",
  gumroadSignedSlug: process.env.NEXT_PUBLIC_GUMROAD_SIGNED_SLUG ?? "",
} as const;
