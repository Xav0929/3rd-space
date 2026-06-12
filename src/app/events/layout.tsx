import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Upcoming events and happenings at 3RD SPACE — tarot nights, business talks, art takeovers, and more.",
  openGraph: {
    title: "Events — 3RD SPACE",
    description:
      "Upcoming events and happenings at 3RD SPACE — tarot nights, business talks, art takeovers, and more.",
    url: "https://3rd-space-peach.vercel.app/events",
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
