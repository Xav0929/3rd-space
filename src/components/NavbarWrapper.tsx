"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const hideOn = ["/order", "/admin", "/track"];
  const shouldHide = hideOn.some((p) => pathname.startsWith(p));
  if (shouldHide) return null;
  return <Navbar />;
}
