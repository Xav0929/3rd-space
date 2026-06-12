import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Browse 3RD SPACE's full menu of coffee, drinks, and bites — order ahead for pickup or delivery in Cabanatuan City.",
  openGraph: {
    title: "Menu — 3RD SPACE",
    description:
      "Browse 3RD SPACE's full menu of coffee, drinks, and bites — order ahead for pickup or delivery in Cabanatuan City.",
    url: "https://3rd-space-peach.vercel.app/menu",
  },
};

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
