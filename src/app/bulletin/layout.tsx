import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Board",
  description:
    "Announcements, community partners, and what's happening at 3RD SPACE.",
  openGraph: {
    title: "The Board — 3RD SPACE",
    description:
      "Announcements, community partners, and what's happening at 3RD SPACE.",
    url: "https://3rd-space-peach.vercel.app/bulletin",
  },
};

export default function BulletinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
