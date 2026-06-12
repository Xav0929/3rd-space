import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "A visual look inside 3RD SPACE — photos of our space, our drinks, our events, and the community moments that make this place feel like home.",
  openGraph: {
    title: "Gallery — 3RD SPACE",
    description:
      "A visual look inside 3RD SPACE — photos of our space, our drinks, our events, and the community moments that make this place feel like home.",
    url: "https://www.3rdspace.shop/gallery",
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

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
