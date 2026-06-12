import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet the team behind 3RD SPACE and learn the story of our cozy café and community space in Cabanatuan City.",
  openGraph: {
    title: "About — 3RD SPACE",
    description:
      "Meet the team behind 3RD SPACE and learn the story of our cozy café and community space in Cabanatuan City.",
    url: "https://3rd-space-peach.vercel.app/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
