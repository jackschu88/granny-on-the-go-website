import type { Metadata } from "next";
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
  title: "Granny on the Go | Official Website | Granny on the Go Adventures",
  description:
    "Step into the timeless story of Granny on the Go — where ordinary days become extraordinary adventures. The official home of Granny on the Go Adventures.",
  keywords: [
    "Granny on the Go",
    "children's book",
    "Haley Schumacher",
    "adventure",
    "kids book",
    "picture book",
    "Edie Denzel",
  ],
  authors: [{ name: "Haley Schumacher" }],
  creator: "Haley Schumacher",
  publisher: "Granny on the Go Adventures",
  metadataBase: new URL("https://grannyonthegoadventures.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Granny on the Go | Official Website",
    description:
      "Step into the timeless story of Granny on the Go — where ordinary days become extraordinary adventures.",
    url: "https://grannyonthegoadventures.com",
    siteName: "Granny on the Go Adventures",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 1600,
        alt: "Granny on the Go book cover",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Granny on the Go | Official Website",
    description:
      "Step into the timeless story of Granny on the Go — where ordinary days become extraordinary adventures.",
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
      </body>
    </html>
  );
}
