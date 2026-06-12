import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet France and Mai, the curators behind 3RD SPACE, and discover the story of how this cozy café and community space came to life in Cabanatuan City.",
  openGraph: {
    title: "About — 3RD SPACE",
    description:
      "Meet France and Mai, the curators behind 3RD SPACE, and discover the story of how this cozy café and community space came to life in Cabanatuan City.",
    url: "https://3rd-space-peach.vercel.app/about",
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

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
