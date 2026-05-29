"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Package,
  Clock,
  ChefHat,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const GOLD = "#d4a843";
const GOLD_DIM = "rgba(212,168,67,0.12)";
const CREAM = "#e8d5a3";
const CREAM_MUTED = "rgba(232,213,163,0.55)";
const CREAM_FAINT = "rgba(232,213,163,0.22)";
const BG_DEEP = "#0f1a0f";
const BG_CARD = "rgba(255,255,255,0.04)";
const BORDER = "rgba(232,213,163,0.12)";

const STATUS_CONFIG: Record<
  string,
  {
    color: string;
    bg: string;
    icon: React.ReactNode;
    label: string;
    desc: string;
  }
> = {
  pending: {
    color: CREAM_MUTED,
    bg: "rgba(232,213,163,0.08)",
    icon: <Clock size={18} />,
    label: "PENDING",
    desc: "Your order has been received and is awaiting confirmation.",
  },
  confirmed: {
    color: GOLD,
    bg: GOLD_DIM,
    icon: <Package size={18} />,
    label: "CONFIRMED",
    desc: "Order confirmed! We're about to start preparing your food.",
  },
  preparing: {
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.1)",
    icon: <ChefHat size={18} />,
    label: "PREPARING",
    desc: "Our kitchen is working on your order right now.",
  },
  ready: {
    color: "#4ade80",
    bg: "rgba(74,222,128,0.1)",
    icon: <CheckCircle2 size={18} />,
    label: "READY",
    desc: "Your order is ready! On its way to you!",
  },
  completed: {
    color: "#4ade80",
    bg: "rgba(74,222,128,0.1)",
    icon: <CheckCircle2 size={18} />,
    label: "COMPLETED",
    desc: "Order completed. Thank you for ordering with us!",
  },
  cancelled: {
    color: "#f87171",
    bg: "rgba(248,113,113,0.1)",
    icon: <XCircle size={18} />,
    label: "CANCELLED",
    desc: "This order has been cancelled. Please contact us for help.",
  },
};

interface Order {
  orderNumber: string;
  type: string;
  status: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  createdAt: string;
}

const DINE_STEPS = ["pending", "confirmed", "preparing", "ready", "completed"];
const DELIVERY_STEPS = ["pending", "confirmed", "preparing", "completed"];

function StatusProgress({ status, type }: { status: string; type: string }) {
  const steps = type === "delivery" ? DELIVERY_STEPS : DINE_STEPS;
  const currentIdx = steps.indexOf(status);
  if (status === "cancelled") return null;
  return (
    <div style={{ padding: "4px 0" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {steps.map((step, i) => {
          const done = i <= currentIdx;
          const active = i === currentIdx;
          return (
            <div
              key={step}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                position: "relative",
              }}
            >
              {i > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: 13,
                    left: 0,
                    right: "50%",
                    height: 2,
                    background: done ? GOLD : CREAM_FAINT,
                    transition: "background 0.4s",
                  }}
                />
              )}
              {i < steps.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    top: 13,
                    left: "50%",
                    right: 0,
                    height: 2,
                    background: i < currentIdx ? GOLD : CREAM_FAINT,
                    transition: "background 0.4s",
                  }}
                />
              )}
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  width: 26,
                  height: 26,
                  borderRadius: 999,
                  border: `2px solid ${done ? GOLD : CREAM_FAINT}`,
                  background: done ? GOLD : BG_DEEP,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s",
                  boxShadow: active ? "0 0 14px rgba(212,168,67,0.5)" : "none",
                }}
              >
                {done && (
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      background: BG_DEEP,
                    }}
                  />
                )}
              </div>
              <span
                style={{
                  fontSize: 9,
                  letterSpacing: "0.06em",
                  color: done ? GOLD : CREAM_FAINT,
                  textAlign: "center",
                  fontFamily: "'Cinzel', serif",
                }}
              >
                {step.toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ETACircle({ status }: { status: string }) {
  const etaMap: Record<
    string,
    { min: number; max: number; label: string; color: string }
  > = {
    pending: {
      min: 45,
      max: 60,
      label: "Waiting for confirmation",
      color: CREAM_MUTED,
    },
    confirmed: {
      min: 40,
      max: 55,
      label: "Getting ready to prepare",
      color: GOLD,
    },
    preparing: {
      min: 20,
      max: 35,
      label: "Kitchen is working on it",
      color: "#60a5fa",
    },
    ready: {
      min: 5,
      max: 15,
      label: "On its way to you! 🛵",
      color: "#4ade80",
    },
  };

  const eta = etaMap[status];
  if (!eta) return null;

  const stepIdx = ["pending", "confirmed", "preparing", "ready"].indexOf(
    status,
  );
  const progress = ((stepIdx + 1) / 4) * 100;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      style={{
        padding: "28px 20px 24px",
        borderBottom: `1px solid ${BORDER}`,
        background: "rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div style={{ position: "relative", width: 148, height: 148 }}>
        <svg width="148" height="148" style={{ transform: "rotate(-90deg)" }}>
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle
            cx="74"
            cy="74"
            r={radius}
            fill="none"
            stroke={CREAM_FAINT}
            strokeWidth="9"
          />
          <circle
            cx="74"
            cy="74"
            r={radius}
            fill="none"
            stroke={eta.color}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            filter="url(#glow)"
            style={{
              transition:
                "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1), stroke 0.5s",
            }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <span
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 24,
              fontWeight: 700,
              color: eta.color,
              lineHeight: 1,
              transition: "color 0.5s",
            }}
          >
            {eta.min}–{eta.max}
          </span>
          <span
            style={{
              color: CREAM_MUTED,
              fontSize: 10,
              letterSpacing: "0.12em",
              fontFamily: "'Cinzel', serif",
            }}
          >
            MIN
          </span>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            color: eta.color,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.04em",
            marginBottom: 4,
            transition: "color 0.5s",
          }}
        >
          {eta.label}
        </p>
        <p style={{ color: CREAM_FAINT, fontSize: 11 }}>
          Estimated delivery time
        </p>
      </div>
    </div>
  );
}

// ── STRIP # PREFIX AND WHITESPACE BEFORE QUERYING ────────────────────────────
function normalizeOrderNumber(raw: string): string {
  return raw.trim().replace(/^#+/, "").trim();
}

function TrackContent() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("id") || "");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [copied, setCopied] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  async function handleTrack(e?: React.FormEvent, silent = false) {
    if (e) e.preventDefault();
    // ── FIX: strip leading # and whitespace before sending to API ──
    const trimmed = normalizeOrderNumber(orderNumber);
    if (!trimmed) return;
    if (!silent) {
      setLoading(true);
      setOrder(null); // clear previous result immediately
      setError("");
    }
    try {
      const res = await fetch(
        `/api/orders?orderNumber=${encodeURIComponent(trimmed)}`,
      );
      if (!res.ok) throw new Error("Order not found");
      const data = await res.json();
      if (!data || data.length === 0)
        throw new Error("No order found with that number");
      setOrder(data[0]);
      setLastUpdated(new Date());
    } catch (err: any) {
      if (!silent) {
        setError(err.message);
        setOrder(null); // clear on error too — don't leave old result visible
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }

  // Auto-poll every 10s, stop when order is done
  useEffect(() => {
    if (!order) return;
    const done = order.status === "completed" || order.status === "cancelled";
    if (done) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      handleTrack(undefined, true);
    }, 10000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [order?.status]);

  useEffect(() => {
    if (searchParams.get("id")) handleTrack();
  }, []);

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const statusCfg = order
    ? STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
    : null;

  return (
    <div
      style={{
        minHeight: "100svh",
        background: `radial-gradient(ellipse at 50% 10%, rgba(212,168,67,0.07) 0%, transparent 55%), ${BG_DEEP}`,
        paddingTop: 80,
        paddingBottom: 48,
        paddingLeft: 16,
        paddingRight: 16,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        {/* Title */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(2rem, 7vw, 3rem)",
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: CREAM,
              marginBottom: 10,
            }}
          >
            TRACK ORDER
          </div>
          <div
            style={{
              width: 40,
              height: 1,
              background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
              margin: "0 auto 12px",
            }}
          />
          <p
            style={{
              color: CREAM_MUTED,
              fontSize: 13,
              letterSpacing: "0.06em",
            }}
          >
            Enter your order number to check live status
          </p>
        </div>

        {/* Search bar */}
        <form
          onSubmit={handleTrack}
          style={{ display: "flex", flexDirection: "column", gap: 10 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: BG_CARD,
              border: `1.5px solid ${focused ? GOLD : BORDER}`,
              borderRadius: 14,
              padding: "4px 4px 4px 16px",
              gap: 8,
              transition: "border-color 0.2s",
            }}
          >
            <Search
              size={16}
              color={focused ? GOLD : CREAM_MUTED}
              style={{ flexShrink: 0 }}
            />
            <input
              type="text"
              placeholder="#3S-YYYYMMDD-XXXX or 3S-YYYYMMDD-XXXX"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: CREAM,
                fontSize: 14,
                letterSpacing: "0.05em",
                padding: "10px 0",
                fontFamily: "'Cinzel', serif",
                WebkitAppearance: "none",
              }}
            />
            <button
              type="submit"
              disabled={loading || !orderNumber.trim()}
              style={{
                background: orderNumber.trim() ? GOLD : "rgba(212,168,67,0.2)",
                color: orderNumber.trim() ? BG_DEEP : CREAM_MUTED,
                border: "none",
                borderRadius: 10,
                padding: "10px 20px",
                fontFamily: "'Cinzel', serif",
                fontSize: 12,
                letterSpacing: "0.12em",
                fontWeight: 700,
                cursor: orderNumber.trim() ? "pointer" : "not-allowed",
                transition: "all 0.18s",
                whiteSpace: "nowrap",
              }}
            >
              {loading ? "..." : "TRACK"}
            </button>
          </div>
          <p style={{ color: CREAM_FAINT, fontSize: 11, textAlign: "center" }}>
            You can include or omit the # — both work
          </p>
        </form>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "rgba(248,113,113,0.08)",
              border: "1px solid rgba(248,113,113,0.25)",
              borderRadius: 12,
              padding: "14px 16px",
              color: "#f87171",
              fontSize: 13,
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div
            style={{
              background: BG_CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: 20,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {[80, 60, 100, 50].map((w, i) => (
              <div
                key={i}
                style={{
                  height: 14,
                  width: `${w}%`,
                  background: CREAM_FAINT,
                  borderRadius: 999,
                  animation: "pulse 1.4s ease-in-out infinite",
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
            <style>{`@keyframes pulse { 0%,100%{opacity:0.5}50%{opacity:1} }`}</style>
          </div>
        )}

        {/* Order card */}
        {order && !loading && statusCfg && (
          <div
            style={{
              background: BG_CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: 20,
              overflow: "hidden",
              animation: "fadeUp 0.35s ease",
            }}
          >
            <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>

            {/* Status header */}
            <div
              style={{
                background: statusCfg.bg,
                borderBottom: `1px solid ${BORDER}`,
                padding: "18px 20px",
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
              }}
            >
              <div
                style={{ color: statusCfg.color, marginTop: 2, flexShrink: 0 }}
              >
                {statusCfg.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: 22,
                    fontWeight: 700,
                    color: statusCfg.color,
                    letterSpacing: "0.1em",
                    marginBottom: 4,
                  }}
                >
                  {statusCfg.label}
                </p>
                <p
                  style={{ color: CREAM_MUTED, fontSize: 12, lineHeight: 1.5 }}
                >
                  {statusCfg.desc}
                </p>
              </div>
              <div
                style={{
                  flexShrink: 0,
                  background:
                    order.type === "dine-in"
                      ? "rgba(212,168,67,0.15)"
                      : "rgba(96,165,250,0.12)",
                  border: `1px solid ${order.type === "dine-in" ? GOLD : "#60a5fa"}`,
                  borderRadius: 999,
                  padding: "4px 12px",
                  fontSize: 11,
                  color: order.type === "dine-in" ? GOLD : "#60a5fa",
                  fontFamily: "'Cinzel', serif",
                  letterSpacing: "0.08em",
                  whiteSpace: "nowrap",
                }}
              >
                {order.type === "dine-in" ? "🍽 DINE IN" : "🛵 DELIVERY"}
              </div>
            </div>

            {/* ETA ring — delivery only, active orders */}
            {order.type === "delivery" &&
              order.status !== "cancelled" &&
              order.status !== "completed" && (
                <ETACircle status={order.status} />
              )}

            {/* Completed delivery message */}
            {order.type === "delivery" && order.status === "completed" && (
              <div
                style={{
                  padding: "20px",
                  borderBottom: `1px solid ${BORDER}`,
                  background: "rgba(74,222,128,0.06)",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: 28, marginBottom: 8 }}>🎉</p>
                <p
                  style={{
                    color: "#4ade80",
                    fontFamily: "'Cinzel', serif",
                    fontSize: 13,
                    letterSpacing: "0.08em",
                  }}
                >
                  YOUR ORDER HAS BEEN DELIVERED!
                </p>
                <p style={{ color: CREAM_FAINT, fontSize: 12, marginTop: 4 }}>
                  Thank you for ordering with 3rd Space.
                </p>
              </div>
            )}

            {/* Progress steps */}
            {order.status !== "cancelled" && (
              <div
                style={{
                  padding: "20px 20px 16px",
                  borderBottom: `1px solid ${BORDER}`,
                }}
              >
                <StatusProgress status={order.status} type={order.type} />
              </div>
            )}

            {/* Order items */}
            <div style={{ padding: "18px 20px" }}>
              <p
                style={{
                  color: CREAM_MUTED,
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  marginBottom: 12,
                }}
              >
                ORDER ITEMS
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 12px",
                      background: "rgba(255,255,255,0.02)",
                      borderRadius: 8,
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        color: CREAM_MUTED,
                        fontSize: 13,
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      {item.name}{" "}
                      <span style={{ color: CREAM_FAINT, fontSize: 12 }}>
                        ×{item.quantity}
                      </span>
                    </span>
                    <span
                      style={{
                        color: CREAM,
                        fontSize: 13,
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      ₱{(item.price * item.quantity).toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 16,
                  paddingTop: 14,
                  borderTop: `1px solid ${BORDER}`,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Cinzel', serif",
                    color: CREAM,
                    fontSize: 13,
                    letterSpacing: "0.1em",
                  }}
                >
                  TOTAL
                </span>
                <span
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: 22,
                    fontWeight: 700,
                    color: GOLD,
                  }}
                >
                  ₱{order.total.toFixed(0)}
                </span>
              </div>

              {/* Live dot + copy link */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 16,
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <p
                  style={{
                    color: CREAM_FAINT,
                    fontSize: 11,
                    letterSpacing: "0.04em",
                  }}
                >
                  {lastUpdated ? (
                    <>
                      <span
                        style={{
                          display: "inline-block",
                          width: 7,
                          height: 7,
                          borderRadius: 999,
                          background:
                            order.status === "completed" ||
                            order.status === "cancelled"
                              ? CREAM_FAINT
                              : "#4ade80",
                          marginRight: 5,
                          verticalAlign: "middle",
                        }}
                      />
                      Updated{" "}
                      {lastUpdated.toLocaleTimeString("en-PH", {
                        timeStyle: "short",
                      })}
                    </>
                  ) : (
                    `Placed ${new Date(order.createdAt).toLocaleString(
                      "en-PH",
                      {
                        dateStyle: "medium",
                        timeStyle: "short",
                      },
                    )}`
                  )}
                </p>
                {order.type === "delivery" && (
                  <button
                    onClick={copyLink}
                    style={{
                      background: copied ? "rgba(74,222,128,0.1)" : BG_CARD,
                      border: `1px solid ${copied ? "#4ade80" : BORDER}`,
                      borderRadius: 8,
                      padding: "6px 14px",
                      color: copied ? "#4ade80" : CREAM_MUTED,
                      fontSize: 11,
                      fontFamily: "'Cinzel', serif",
                      letterSpacing: "0.08em",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {copied ? "✓ COPIED" : "📋 COPY LINK"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Back to order */}
        <div style={{ textAlign: "center" }}>
          <Link
            href="/order"
            style={{
              color: CREAM_MUTED,
              fontSize: 12,
              letterSpacing: "0.1em",
              textDecoration: "none",
              fontFamily: "'Cinzel', serif",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            ← PLACE AN ORDER
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <div style={{ background: BG_DEEP, minHeight: "100svh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: rgba(232,213,163,0.22); font-size: 13px; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(232,213,163,0.12); border-radius: 99px; }
        a:hover { color: #d4a843 !important; }
        input { font-size: 16px !important; -webkit-appearance: none; }
      `}</style>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 30,
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          background: `${BG_DEEP}f0`,
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <img
            src="/logo.png"
            alt="3rd Space"
            style={{ height: 34, objectFit: "contain" }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </Link>
        <Link
          href="/order"
          style={{
            color: CREAM_MUTED,
            fontSize: 11,
            letterSpacing: "0.12em",
            textDecoration: "none",
            fontFamily: "'Cinzel', serif",
            padding: "6px 14px",
            border: `1px solid ${BORDER}`,
            borderRadius: 999,
          }}
        >
          ORDER
        </Link>
      </header>
      <Suspense
        fallback={
          <div
            style={{
              paddingTop: 120,
              textAlign: "center",
              color: CREAM_MUTED,
              fontFamily: "'Cinzel', serif",
              fontSize: 13,
              letterSpacing: "0.1em",
            }}
          >
            LOADING...
          </div>
        }
      >
        <TrackContent />
      </Suspense>
    </div>
  );
}
