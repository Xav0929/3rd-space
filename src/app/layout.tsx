import type { Metadata } from "next";
import { Yanone_Kaffeesatz, DM_Sans, Cinzel } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import FeaturedPopup from "@/components/FeaturedPopup";

const yanone = Yanone_Kaffeesatz({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-yanone",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "800"],
  variable: "--font-dm",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.3rdspace.shop"),
  title: {
    default: "3RD SPACE — Your Cozy Corner Away From Home",
    template: "%s — 3RD SPACE",
  },
  description: "A cozy café and community space. Relax, create, breathe.",
  openGraph: {
    title: "3RD SPACE — Your Cozy Corner Away From Home",
    description: "A cozy café and community space. Relax, create, breathe.",
    url: "https://www.3rdspace.shop",
    siteName: "3RD SPACE",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "3RD SPACE",
      },
    ],
    locale: "en_PH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "3RD SPACE — Your Cozy Corner Away From Home",
    description:
      "3RD SPACE is a cozy café and community hub in Cabanatuan City — a place to relax, create, and breathe. Order ahead, browse our menu, and join the community.",
    images: ["/og-default.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${yanone.variable} ${dmSans.variable} ${cinzel.variable}`}
    >
      <body>
        <NavbarWrapper />
        {children}
        <FeaturedPopup />
      </body>
    </html>
  );
}
