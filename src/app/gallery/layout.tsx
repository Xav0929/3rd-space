import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "A visual look inside 3RD SPACE — our space, our drinks, and our community moments.",
  openGraph: {
    title: "Gallery — 3RD SPACE",
    description:
      "A visual look inside 3RD SPACE — our space, our drinks, and our community moments.",
    url: "https://3rd-space-peach.vercel.app/gallery",
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
