import type { Metadata } from "next";
import { Yanone_Kaffeesatz, DM_Sans } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";

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

export const metadata: Metadata = {
  title: "3RD SPACE — Your Cozy Corner Away From Home",
  description: "A cozy café and community space. Relax, create, breathe.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${yanone.variable} ${dmSans.variable}`}>
      <body>
        <NavbarWrapper />
        {children}
      </body>
    </html>
  );
}
