import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Browse 3RD SPACE's full menu of coffee, drinks, and bites — order ahead for pickup or delivery in Cabanatuan City.",
  openGraph: {
    title: "Menu — 3RD SPACE",
    description:
      "Browse 3RD SPACE's full menu of coffee, drinks, and bites — order ahead for pickup or delivery in Cabanatuan City.",
    url: "https://www.3rdspace.shop/menu",
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

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
