import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { notifySchema } from "@/lib/contact";
import { escapeHtml } from "@/lib/escape-html";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const fromAddress =
  process.env.RESEND_FROM_EMAIL ??
  "Granny on the Go <contact@grannyonthegoadventures.com>";

const toAddress =
  process.env.CONTACT_TO_EMAIL ?? "GrannyOnTheGoBooks@gmail.com";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = notifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please enter a valid email address",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, honeypot } = parsed.data;

    if (honeypot) {
      return NextResponse.json({ error: "Bot detected" }, { status: 400 });
    }

    const safeEmail = escapeHtml(email);

    if (!resend) {
      console.log("Notify signup (no Resend key configured):", { email });
      return NextResponse.json(
        { success: true, message: "You're on the list (demo mode)" },
        { status: 200 }
      );
    }

    await resend.emails.send({
      from: fromAddress,
      to: toAddress,
      replyTo: email,
      subject: "[Granny on the Go] New adventure notify signup",
      html: `
        <h2>Coming Soon — Notify Me</h2>
        <p>Someone wants to know when the first adventure arrives.</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
      `,
    });

    return NextResponse.json(
      { success: true, message: "You're on the list! We'll be in touch." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
