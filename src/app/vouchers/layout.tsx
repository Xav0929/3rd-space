import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vouchers",
  description:
    "Claim your 3RD SPACE food and drink vouchers — leave a review, unlock rewards, and enjoy a little something extra on your next visit.",
  openGraph: {
    title: "Vouchers — 3RD SPACE",
    description:
      "Claim your 3RD SPACE food and drink vouchers — leave a review, unlock rewards, and enjoy a little something extra on your next visit.",
    url: "https://3rd-space-peach.vercel.app/vouchers",
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

export default function VouchersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
