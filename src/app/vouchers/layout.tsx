import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vouchers",
  description: "Claim your 3RD SPACE food and drink vouchers.",
  openGraph: {
    title: "Vouchers — 3RD SPACE",
    description: "Claim your 3RD SPACE food and drink vouchers.",
    url: "https://3rd-space-peach.vercel.app/vouchers",
  },
};

export default function VouchersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
