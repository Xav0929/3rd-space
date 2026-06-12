import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Store",
  description:
    "Shop official 3RD SPACE merch and goods — bring a piece of your favorite cozy corner home with you.",
  openGraph: {
    title: "Store — 3RD SPACE",
    description:
      "Shop official 3RD SPACE merch and goods — bring a piece of your favorite cozy corner home with you.",
    url: "https://www.3rdspace.shop/store",
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

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
