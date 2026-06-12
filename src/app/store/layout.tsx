import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Store",
  description: "Shop 3RD SPACE merch and goods.",
  openGraph: {
    title: "Store — 3RD SPACE",
    description: "Shop 3RD SPACE merch and goods.",
    url: "https://3rd-space-peach.vercel.app/store",
  },
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
