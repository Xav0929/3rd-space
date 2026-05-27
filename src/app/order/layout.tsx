// src/app/order/layout.tsx
// This layout overrides the root layout for the /order route,
// removing the site Navbar so the order page can have its own nav.

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
