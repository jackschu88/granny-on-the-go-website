import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import StructuredData from "@/components/StructuredData";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Granny on the Go Adventures | A Grandma Picture Book by Haley Schumacher",
  description:
    "A full-color picture book for ages 3–8 by Haley Schumacher: Granny on the Go turns ordinary days into adventures and shows a child she is truly seen.",
  keywords: [
    "Granny on the Go Adventures",
    "children's book",
    "Haley Schumacher",
    "adventure",
    "kids book",
    "picture book",
    "Edie",
  ],
  authors: [{ name: "Haley Schumacher" }],
  creator: "Haley Schumacher",
  publisher: "Granny on the Go Adventures",
  metadataBase: new URL("https://www.grannyonthegoadventures.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Granny on the Go Adventures | A Grandma Picture Book by Haley Schumacher",
    description:
      "A full-color picture book for ages 3–8 by Haley Schumacher: Granny on the Go turns ordinary days into adventures and shows a child she is truly seen.",
    url: "https://grannyonthegoadventures.com",
    siteName: "Granny on the Go Adventures",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 1600,
        alt: "Granny on the Go Adventures book cover",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Granny on the Go Adventures | A Grandma Picture Book by Haley Schumacher",
    description:
      "A full-color picture book for ages 3–8 by Haley Schumacher: Granny on the Go turns ordinary days into adventures and shows a child she is truly seen.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${fraunces.variable} ${sourceSans.variable}`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <StructuredData />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
