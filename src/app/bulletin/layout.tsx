import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Board",
  description:
    "Stay in the loop with announcements, community partners, and everything happening at 3RD SPACE — your one-stop board for what's new.",
  openGraph: {
    title: "The Board — 3RD SPACE",
    description:
      "Stay in the loop with announcements, community partners, and everything happening at 3RD SPACE — your one-stop board for what's new.",
    url: "https://3rd-space-peach.vercel.app/bulletin",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "3RD SPACE",
      },
    ],
  },
};

export default function BulletinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
