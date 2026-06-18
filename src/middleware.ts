import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

const ADMIN_ROUTES = ["/api/accounts", "/api/debug", "/api/seed"];
const STAFF_ROUTES = [
  "/api/upload",
  "/api/posts",
  "/api/daily-close",
  "/api/vouchers/verify",
];
const PROTECTED_WRITES = ["/api/menu", "/api/orders"];
const WRITE_METHODS = ["POST", "PATCH", "PUT", "DELETE"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const method = req.method;

  // ── PUBLIC EXCEPTIONS ──────────────────────────────────────────
  if (pathname === "/api/accounts/login") return NextResponse.next();
  if (pathname === "/api/auth/logout") return NextResponse.next();
  if (pathname === "/api/shop-status" && method === "GET")
    return NextResponse.next();
  if (pathname === "/api/menu" && method === "GET") return NextResponse.next();
  if (pathname === "/api/orders" && method === "GET")
    return NextResponse.next();
  if (pathname === "/api/orders" && method === "POST")
    return NextResponse.next(); // customer orders
  if (pathname.match(/\/api\/orders\/[^/]+\/location/))
    return NextResponse.next();
  if (pathname.match(/\/api\/orders\/[^/]+$/) && method === "GET")
    return NextResponse.next();
  if (pathname.startsWith("/api/vouchers") && method === "GET")
    return NextResponse.next();
  if (pathname.startsWith("/api/posts") && method === "GET")
    return NextResponse.next();
  if (pathname.startsWith("/api/bulletin") && method === "GET")
    return NextResponse.next();
  if (pathname.startsWith("/api/orders/stream")) return NextResponse.next();

  // ── GET SESSION ────────────────────────────────────────────────
  const token = req.cookies.get("3s_session")?.value;
  const session = token ? await verifySession(token) : null;

  // ── ADMIN-ONLY ─────────────────────────────────────────────────
  if (ADMIN_ROUTES.some((p) => pathname.startsWith(p))) {
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.next();
  }

  // ── shop-status POST (open/close) — admin only ─────────────────
  if (pathname === "/api/shop-status" && method === "POST") {
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.next();
  }

  // ── STAFF ROUTES ───────────────────────────────────────────────
  if (STAFF_ROUTES.some((p) => pathname.startsWith(p))) {
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.next();
  }

  // ── WRITE PROTECTION ───────────────────────────────────────────
  if (
    PROTECTED_WRITES.some((p) => pathname.startsWith(p)) &&
    WRITE_METHODS.includes(method)
  ) {
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
