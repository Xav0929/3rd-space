"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar"; // adjust to your actual Navbar import

export default function ConditionalNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/track") || pathname.startsWith("/order"))
    return null;
  return <Navbar />;
}
