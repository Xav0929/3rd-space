"use client";

import { useEffect, useState, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Edit2,
  LogOut,
  Clock,
  DollarSign,
  Package,
  X,
  UtensilsCrossed,
  BarChart3,
  QrCode,
  AlertCircle,
  RefreshCw,
  Zap,
  Users,
  UserPlus,
  Shield,
  Eye,
  EyeOff,
  ImageIcon,
} from "lucide-react";

const T = {
  bg: "#0a0f0a",
  bgCard: "rgba(255,255,255,0.035)",
  gold: "#d4a843",
  goldDim: "rgba(212,168,67,0.15)",
  goldGlow: "rgba(212,168,67,0.08)",
  cream: "#e8d5a3",
  muted: "rgba(232,213,163,0.5)",
  faint: "rgba(232,213,163,0.2)",
  border: "rgba(232,213,163,0.1)",
  borderH: "rgba(212,168,67,0.4)",
  green: "#22c55e",
  red: "#ef4444",
  blue: "#5b9bd5",
  purple: "#a855f7",
};

function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );
  useEffect(() => {
    const fn = () => setWidth(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return width;
}

type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";
type OrderItem = { name: string; price: number; quantity: number };
type Order = {
  _id: string;
  orderNumber: string;
  type: "delivery" | "dine-in";
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  customerName?: string;
  customerContact?: string;
  deliveryAddress?: string;
  receiptUrl?: string;
  tableNumber?: string;
  paymentStatus: "pending" | "confirmed";
  paymentMethod?: "cash" | "gcash" | "pending";
  notes?: string;
  createdAt: string;
  waiterName?: string;
};
type MenuItem = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
};
type Tab = "orders" | "menu" | "analytics" | "crew" | "accounts";
type Role = "admin" | "staff" | null;

type Account = {
  _id: string;
  username: string;
  displayName: string;
  role: "admin" | "staff";
  createdAt: string;
};

const STATUS_CFG: Record<
  OrderStatus,
  { label: string; color: string; next?: OrderStatus }
> = {
  pending: { label: "Pending", color: "#d4a843", next: "confirmed" },
  confirmed: { label: "Confirmed", color: "#5b9bd5", next: "preparing" },
  preparing: { label: "Preparing", color: "#a855f7", next: "ready" },
  ready: { label: "Ready", color: "#22c55e", next: "completed" },
  completed: { label: "Completed", color: "#6b7280" },
  cancelled: { label: "Cancelled", color: "#ef4444" },
};

function fmt(n: number) {
  return `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}
function ago(d: string) {
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ── IMAGE LIGHTBOX ───────────────────────────────────────────────────────────
function ImageLightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background: "rgba(0,0,0,0.92)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        backdropFilter: "blur(4px)",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          background: "rgba(255,255,255,0.1)",
          border: `1px solid ${T.border}`,
          borderRadius: "50%",
          width: 40,
          height: 40,
          color: T.cream,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
        }}
      >
        <X size={18} />
      </button>
      <img
        src={src}
        alt="Receipt"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "90vw",
          maxHeight: "88vh",
          objectFit: "contain",
          borderRadius: 12,
          boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
          border: `1px solid ${T.border}`,
        }}
      />
    </div>
  );
}

// ── CONFIRM MODAL ────────────────────────────────────────────────────────────
function ConfirmModal({
  message,
  onConfirm,
  onCancel,
  danger = true,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onCancel]);

  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 3000,
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 16px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#13180f",
          border: `1px solid ${danger ? "rgba(239,68,68,0.4)" : T.borderH}`,
          borderRadius: 18,
          padding: "36px 32px",
          maxWidth: 360,
          width: "100%",
          textAlign: "center",
          boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 16 }}>
          {danger ? "🗑️" : "⚠️"}
        </div>
        <p
          style={{
            color: T.cream,
            fontSize: 14,
            lineHeight: 1.7,
            marginBottom: 28,
          }}
        >
          {message}
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button
            onClick={onConfirm}
            style={{
              padding: "11px 28px",
              background: danger ? "rgba(239,68,68,0.12)" : T.goldDim,
              border: `1px solid ${danger ? "rgba(239,68,68,0.5)" : T.gold}`,
              borderRadius: 10,
              color: danger ? T.red : T.gold,
              fontFamily: "'Cinzel',serif",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: ".08em",
              cursor: "pointer",
            }}
          >
            {danger ? "DELETE" : "CONFIRM"}
          </button>
          <button
            onClick={onCancel}
            style={{
              padding: "11px 28px",
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${T.border}`,
              borderRadius: 10,
              color: T.muted,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function Badge({ status }: { status: OrderStatus }) {
  const { label, color } = STATUS_CFG[status];
  return (
    <span
      style={{
        background: color + "22",
        color,
        border: `1px solid ${color}44`,
        padding: "3px 10px",
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent?: string;
}) {
  const c = accent || T.gold;
  return (
    <div
      style={{
        background: T.bgCard,
        border: `1px solid ${T.border}`,
        borderRadius: 14,
        padding: "18px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "border-color .2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = T.borderH)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.border)}
    >
      <div>
        <p
          style={{
            color: T.muted,
            fontSize: 10,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            fontFamily: "'Cinzel',serif",
            marginBottom: 8,
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: 22,
            fontWeight: 700,
            color: c,
          }}
        >
          {value}
        </p>
      </div>
      <div style={{ color: c, opacity: 0.7 }}>{icon}</div>
    </div>
  );
}

// ── ORDER CARD ───────────────────────────────────────────────────────────────
function OrderCard({
  order,
  onStatusChange,
  onPaymentConfirm,
  onSetPaymentMethod,
  onDelete,
}: {
  order: Order;
  onStatusChange: (id: string, s: OrderStatus) => void;
  onPaymentConfirm: (id: string) => void;
  onSetPaymentMethod: (id: string, method: "cash" | "gcash") => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [receiptSrc, setReceiptSrc] = useState<string | null>(null);
  const nextStatus = STATUS_CFG[order.status].next;

  // Determine what to show for payment method
  const methodKnown = order.paymentMethod && order.paymentMethod !== "pending";
  const methodPending = order.paymentMethod === "pending";

  return (
    <>
      {receiptSrc && (
        <ImageLightbox src={receiptSrc} onClose={() => setReceiptSrc(null)} />
      )}
      <div
        style={{
          background: T.bgCard,
          border: `1px solid ${T.border}`,
          borderRadius: 14,
          overflow: "hidden",
          transition: "border-color .2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = T.borderH)}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = T.border)}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "14px 16px",
            cursor: "pointer",
            userSelect: "none",
          }}
          onClick={() => setOpen((v) => !v)}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              flexShrink: 0,
              background: order.type === "delivery" ? T.gold : T.green,
              boxShadow: `0 0 8px ${order.type === "delivery" ? T.gold : T.green}88`,
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: "'Cinzel',serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: T.cream,
                  letterSpacing: ".04em",
                }}
              >
                #{order.orderNumber}
              </span>
              <Badge status={order.status} />
              <span
                style={{
                  fontSize: 11,
                  color: T.muted,
                  background: "rgba(232,213,163,0.08)",
                  padding: "3px 8px",
                  borderRadius: 4,
                }}
              >
                {order.type === "delivery" ? "🚚 Delivery" : "🪑 Dine-in"}
              </span>
              {order.paymentStatus === "pending" && (
                <span
                  style={{
                    fontSize: 11,
                    color: "#f59e0b",
                    background: "rgba(245,158,11,0.1)",
                    border: "1px solid rgba(245,158,11,0.3)",
                    padding: "3px 8px",
                    borderRadius: 4,
                  }}
                >
                  ⏳ Unpaid
                </span>
              )}
              {order.waiterName && (
                <span
                  style={{
                    fontSize: 11,
                    color: T.blue,
                    background: "rgba(91,155,213,0.1)",
                    border: "1px solid rgba(91,155,213,0.25)",
                    padding: "3px 8px",
                    borderRadius: 4,
                    fontWeight: 600,
                  }}
                >
                  👤 {order.waiterName}
                </span>
              )}
            </div>
            <p style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>
              {order.type === "delivery"
                ? order.customerName
                : `Table ${order.tableNumber || "N/A"}`}
              {" · "}
              {ago(order.createdAt)}
            </p>
          </div>
          <span
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: 17,
              fontWeight: 700,
              color: T.gold,
              flexShrink: 0,
            }}
          >
            {fmt(order.total)}
          </span>
          <div style={{ color: T.muted }}>
            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>

        {open && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              borderTop: `1px solid ${T.border}`,
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 14,
              background: "rgba(0,0,0,0.2)",
            }}
          >
            {order.waiterName && (
              <div
                style={{
                  background: "rgba(91,155,213,0.08)",
                  border: "1px solid rgba(91,155,213,0.2)",
                  borderRadius: 8,
                  padding: "9px 14px",
                  fontSize: 12,
                  color: T.blue,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Shield size={13} />
                <span>
                  Order taken by{" "}
                  <strong style={{ color: T.cream }}>{order.waiterName}</strong>
                </span>
              </div>
            )}

            {/* ── PAYMENT SECTION ── */}
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${T.border}`,
                borderRadius: 10,
                padding: "12px 14px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <p
                style={{
                  color: T.muted,
                  fontSize: 10,
                  letterSpacing: ".1em",
                  fontFamily: "'Cinzel',serif",
                }}
              >
                PAYMENT
              </p>

              {/* Row 1: Payment status + method badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                {/* Payment status pill */}
                <span
                  style={{
                    fontSize: 12,
                    padding: "5px 12px",
                    borderRadius: 6,
                    fontWeight: 600,
                    color:
                      order.paymentStatus === "confirmed" ? T.green : "#f59e0b",
                    background:
                      order.paymentStatus === "confirmed"
                        ? "rgba(34,197,94,0.1)"
                        : "rgba(245,158,11,0.1)",
                    border: `1px solid ${
                      order.paymentStatus === "confirmed"
                        ? "rgba(34,197,94,0.3)"
                        : "rgba(245,158,11,0.3)"
                    }`,
                  }}
                >
                  {order.paymentStatus === "confirmed"
                    ? "✓ Paid"
                    : "⏳ Payment Pending"}
                </span>

                {/* Method badge — only show if method is known (cash or gcash) */}
                {methodKnown && (
                  <span
                    style={{
                      fontSize: 11,
                      padding: "5px 10px",
                      borderRadius: 6,
                      color: order.paymentMethod === "cash" ? T.green : T.gold,
                      background:
                        order.paymentMethod === "cash"
                          ? "rgba(34,197,94,0.08)"
                          : "rgba(212,168,67,0.1)",
                      border: `1px solid ${
                        order.paymentMethod === "cash"
                          ? "rgba(34,197,94,0.25)"
                          : "rgba(212,168,67,0.3)"
                      }`,
                      fontWeight: 600,
                    }}
                  >
                    {order.paymentMethod === "cash" ? "💵 Cash" : "📱 GCash"}
                  </span>
                )}

                {/* Decide later label */}
                {methodPending && (
                  <span
                    style={{
                      fontSize: 11,
                      padding: "5px 10px",
                      borderRadius: 6,
                      color: T.muted,
                      background: "rgba(232,213,163,0.05)",
                      border: `1px solid ${T.border}`,
                    }}
                  >
                    ❓ Method unknown
                  </span>
                )}

                {/* Receipt button */}
                {order.receiptUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setReceiptSrc(order.receiptUrl!);
                    }}
                    style={{
                      fontSize: 12,
                      color: T.blue,
                      background: "rgba(91,155,213,0.08)",
                      border: "1px solid rgba(91,155,213,0.2)",
                      borderRadius: 6,
                      padding: "5px 12px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <ImageIcon size={12} /> View Receipt
                  </button>
                )}
              </div>

              {/* Row 2: Actions — only show if not yet paid */}
              {order.paymentStatus !== "confirmed" && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {/* Step 1: If method is unknown, let staff pick it first */}
                  {methodPending && (
                    <div>
                      <p
                        style={{
                          color: T.muted,
                          fontSize: 11,
                          marginBottom: 6,
                        }}
                      >
                        Step 1 — Ask customer how they'll pay:
                      </p>
                      <div style={{ display: "flex", gap: 8 }}>
                        {(["cash", "gcash"] as const).map((m) => (
                          <button
                            key={m}
                            onClick={(e) => {
                              e.stopPropagation();
                              // Only sets the method — does NOT mark as paid
                              onSetPaymentMethod(order._id, m);
                            }}
                            style={{
                              flex: 1,
                              padding: "9px 12px",
                              borderRadius: 8,
                              cursor: "pointer",
                              background:
                                m === "cash"
                                  ? "rgba(34,197,94,0.08)"
                                  : "rgba(212,168,67,0.08)",
                              border: `1px solid ${
                                m === "cash"
                                  ? "rgba(34,197,94,0.3)"
                                  : "rgba(212,168,67,0.3)"
                              }`,
                              color: m === "cash" ? T.green : T.gold,
                              fontWeight: 700,
                              fontSize: 12,
                            }}
                          >
                            {m === "cash" ? "💵 Set Cash" : "📱 Set GCash"}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Once method is known (or was always known), confirm payment */}
                  {(methodKnown ||
                    (!methodPending && order.paymentMethod == null)) && (
                    <div>
                      {methodKnown && (
                        <p
                          style={{
                            color: T.muted,
                            fontSize: 11,
                            marginBottom: 6,
                          }}
                        >
                          Step 2 — Collect{" "}
                          {order.paymentMethod === "cash"
                            ? "cash"
                            : "GCash transfer"}{" "}
                          then confirm:
                        </p>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPaymentConfirm(order._id);
                        }}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          background: "rgba(34,197,94,0.12)",
                          border: "1px solid rgba(34,197,94,0.4)",
                          color: T.green,
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "'Cinzel',serif",
                          letterSpacing: ".06em",
                        }}
                      >
                        ✓ CONFIRM PAYMENT RECEIVED
                      </button>
                    </div>
                  )}

                  {/* Edge case: method not set at all (gcash/cash orders without receiptUrl) */}
                  {!methodKnown &&
                    !methodPending &&
                    order.paymentMethod == null && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPaymentConfirm(order._id);
                        }}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          background: "rgba(34,197,94,0.12)",
                          border: "1px solid rgba(34,197,94,0.4)",
                          color: T.green,
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "'Cinzel',serif",
                          letterSpacing: ".06em",
                        }}
                      >
                        ✓ CONFIRM PAYMENT RECEIVED
                      </button>
                    )}
                </div>
              )}
            </div>

            {/* ── STATUS ACTIONS ── */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {nextStatus && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(order._id, nextStatus);
                  }}
                  style={{
                    flex: 1,
                    minWidth: 130,
                    padding: "9px 12px",
                    background: STATUS_CFG[nextStatus].color + "18",
                    border: `1px solid ${STATUS_CFG[nextStatus].color}44`,
                    color: STATUS_CFG[nextStatus].color,
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  → {STATUS_CFG[nextStatus].label}
                </button>
              )}
              {order.status !== "cancelled" && order.status !== "completed" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(order._id, "cancelled");
                  }}
                  style={{
                    padding: "9px 12px",
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    color: T.red,
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              )}
              {(order.status === "completed" ||
                order.status === "cancelled") && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(order._id);
                  }}
                  style={{
                    padding: "9px 12px",
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${T.border}`,
                    color: T.muted,
                    borderRadius: 8,
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ── MENU ITEM FORM ───────────────────────────────────────────────────────────
function MenuItemForm({
  item,
  onSave,
  onCancel,
}: {
  item?: Partial<MenuItem>;
  onSave: (data: Partial<MenuItem>) => Promise<boolean>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<MenuItem>>(
    item || { available: true },
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const set = (k: keyof MenuItem, v: any) => setForm((p) => ({ ...p, [k]: v }));
  const valid = !!(form.name?.trim() && form.price && form.category?.trim());
  const w = useWindowWidth();
  const isMobile = w < 600;

  async function handleSave() {
    if (!valid) return;
    setErr("");
    setSaving(true);
    const ok = await onSave(form);
    setSaving(false);
    if (!ok) setErr("Failed to save — check your connection and try again.");
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${T.border}`,
    borderRadius: 8,
    padding: "9px 12px",
    color: T.cream,
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    color: T.muted,
    fontSize: 10,
    letterSpacing: ".1em",
    display: "block",
    marginBottom: 6,
  };

  return (
    <div
      style={{
        background: "rgba(0,0,0,0.4)",
        border: `1px solid ${T.borderH}`,
        borderRadius: 16,
        padding: 22,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3
          style={{
            fontFamily: "'Cinzel',serif",
            color: T.cream,
            fontSize: 14,
            letterSpacing: ".1em",
          }}
        >
          {item?._id ? "EDIT ITEM" : "ADD ITEM"}
        </h3>
        <button
          onClick={onCancel}
          style={{
            background: "none",
            border: "none",
            color: T.muted,
            cursor: "pointer",
          }}
        >
          <X size={16} />
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 12,
        }}
      >
        {[
          { k: "name", label: "Name *", placeholder: "Café Latte" },
          { k: "category", label: "Category *", placeholder: "Coffee" },
        ].map(({ k, label, placeholder }) => (
          <div key={k}>
            <label style={labelStyle}>{label.toUpperCase()}</label>
            <input
              value={(form as any)[k] || ""}
              placeholder={placeholder}
              onChange={(e) => set(k as keyof MenuItem, e.target.value)}
              style={inputStyle}
            />
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 12,
        }}
      >
        <div>
          <label style={labelStyle}>PRICE (₱) *</label>
          <input
            type="number"
            value={form.price || ""}
            placeholder="0"
            onChange={(e) => set("price", parseFloat(e.target.value) || 0)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>AVAILABLE</label>
          <button
            onClick={() => set("available", !form.available)}
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: 8,
              cursor: "pointer",
              background: form.available
                ? "rgba(34,197,94,0.1)"
                : "rgba(239,68,68,0.1)",
              border: `1px solid ${form.available ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
              color: form.available ? T.green : T.red,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {form.available ? "✓ Available" : "✗ Unavailable"}
          </button>
        </div>
      </div>

      <div>
        <label style={labelStyle}>DESCRIPTION</label>
        <textarea
          value={form.description || ""}
          rows={2}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Short description..."
          style={{ ...inputStyle, resize: "none", fontFamily: "inherit" }}
        />
      </div>

      <div>
        <label style={labelStyle}>IMAGE</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {form.image && (
            <div
              style={{
                position: "relative",
                width: "100%",
                height: 120,
                borderRadius: 8,
                overflow: "hidden",
                border: `1px solid ${T.border}`,
              }}
            >
              <img
                src={form.image}
                alt="Preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              <button
                onClick={() => set("image", "")}
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  background: "rgba(0,0,0,0.7)",
                  border: `1px solid ${T.border}`,
                  borderRadius: "50%",
                  width: 26,
                  height: 26,
                  color: T.cream,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={12} />
              </button>
            </div>
          )}
          <label
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "10px 14px",
              borderRadius: 8,
              border: `1px dashed ${uploading ? T.gold : T.borderH}`,
              cursor: uploading ? "wait" : "pointer",
              background: uploading
                ? "rgba(212,168,67,0.08)"
                : "rgba(212,168,67,0.04)",
              color: T.muted,
              fontSize: 12,
              transition: "all .15s",
            }}
          >
            <ImageIcon size={14} color={T.gold} />
            <span style={{ color: uploading ? T.gold : T.cream }}>
              {uploading
                ? "Uploading…"
                : form.image
                  ? "Replace image"
                  : "Upload image"}
            </span>
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              style={{ display: "none" }}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploading(true);
                const fd = new FormData();
                fd.append("file", file);
                try {
                  const res = await fetch("/api/upload", {
                    method: "POST",
                    body: fd,
                  });
                  if (res.ok) {
                    const data = await res.json();
                    set("image", data.url);
                  } else {
                    alert("Upload failed — check your R2 config.");
                  }
                } catch {
                  alert("Upload failed — network error.");
                } finally {
                  setUploading(false);
                }
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </div>

      {err && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "rgba(239,68,68,0.85)",
            fontSize: 12,
            background: "rgba(239,68,68,0.07)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 8,
            padding: "9px 12px",
          }}
        >
          <AlertCircle size={13} /> {err}
        </div>
      )}

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={handleSave}
          disabled={!valid || saving}
          style={{
            flex: 1,
            padding: "11px",
            background: valid ? T.gold : "rgba(212,168,67,0.25)",
            color: valid ? "#0a0f0a" : T.muted,
            border: "none",
            borderRadius: 10,
            fontFamily: "'Cinzel',serif",
            fontSize: 12,
            letterSpacing: ".1em",
            fontWeight: 700,
            cursor: valid && !saving ? "pointer" : "not-allowed",
          }}
        >
          {saving ? "SAVING…" : "SAVE ITEM"}
        </button>
        <button
          onClick={onCancel}
          style={{
            padding: "11px 18px",
            background: "rgba(255,255,255,0.05)",
            border: `1px solid ${T.border}`,
            borderRadius: 10,
            color: T.muted,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── MENU TAB ─────────────────────────────────────────────────────────────────
function MenuTab({
  items,
  onRefresh,
}: {
  items: MenuItem[];
  onRefresh: () => Promise<void>;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [localItems, setLocalItems] = useState<MenuItem[]>(items);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const categories = Array.from(new Set(localItems.map((i) => i.category)));

  async function saveItem(data: Partial<MenuItem>): Promise<boolean> {
    const isEdit = !!editItem;
    const url = isEdit ? `/api/menu/${editItem!._id}` : "/api/menu";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errBody = await res.text();
        console.error(
          `[MenuTab.saveItem] ${method} ${url} → ${res.status}`,
          errBody,
        );
        return false;
      }

      const saved: MenuItem = await res.json();

      if (isEdit) {
        setLocalItems((prev) =>
          prev.map((i) => (i._id === saved._id ? saved : i)),
        );
      } else {
        setLocalItems((prev) => [...prev, saved]);
      }

      setShowForm(false);
      setEditItem(null);
      onRefresh().catch(console.error);
      return true;
    } catch (err) {
      console.error("[MenuTab.saveItem] network error", err);
      return false;
    }
  }

  async function doDelete(id: string) {
    setBusyIds((s) => new Set(s).add(id));
    try {
      const res = await fetch(`/api/menu/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLocalItems((prev) => prev.filter((i) => i._id !== id));
        onRefresh().catch(console.error);
      } else {
        alert(`Delete failed (${res.status}).`);
      }
    } catch {
      alert("Delete failed — network error.");
    } finally {
      setBusyIds((s) => {
        const next = new Set(s);
        next.delete(id);
        return next;
      });
      setDeleteTarget(null);
    }
  }

  async function toggleAvail(item: MenuItem) {
    const newVal = !item.available;
    setLocalItems((prev) =>
      prev.map((i) => (i._id === item._id ? { ...i, available: newVal } : i)),
    );
    try {
      const res = await fetch(`/api/menu/${item._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: newVal }),
      });
      if (!res.ok) {
        setLocalItems((prev) =>
          prev.map((i) =>
            i._id === item._id ? { ...i, available: item.available } : i,
          ),
        );
      }
    } catch {
      setLocalItems((prev) =>
        prev.map((i) =>
          i._id === item._id ? { ...i, available: item.available } : i,
        ),
      );
    }
  }

  function startEdit(item: MenuItem) {
    setShowForm(false);
    setEditItem(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startAdd() {
    setEditItem(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const formKey = editItem ? `edit-${editItem._id}` : "add-new";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {deleteTarget && (
        <ConfirmModal
          message="Delete this menu item? This cannot be undone."
          onConfirm={() => doDelete(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <p style={{ color: T.muted, fontSize: 12 }}>
          {localItems.length} items · {categories.length} categories
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => onRefresh()}
            style={{
              padding: "8px 14px",
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${T.border}`,
              borderRadius: 8,
              color: T.muted,
              fontSize: 12,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <RefreshCw size={13} /> Refresh
          </button>
          <button
            onClick={startAdd}
            style={{
              padding: "8px 16px",
              background: T.gold,
              border: "none",
              borderRadius: 8,
              color: "#0a0f0a",
              fontFamily: "'Cinzel',serif",
              fontSize: 11,
              letterSpacing: ".1em",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Plus size={13} /> ADD ITEM
          </button>
        </div>
      </div>

      {(showForm || editItem) && (
        <MenuItemForm
          key={formKey}
          item={editItem || undefined}
          onSave={saveItem}
          onCancel={() => {
            setShowForm(false);
            setEditItem(null);
          }}
        />
      )}

      {categories.map((cat) => (
        <div key={cat}>
          <p
            style={{
              color: T.gold,
              fontSize: 11,
              letterSpacing: ".15em",
              textTransform: "uppercase",
              fontFamily: "'Cinzel',serif",
              marginBottom: 10,
            }}
          >
            ◆ {cat}
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
              gap: 10,
            }}
          >
            {localItems
              .filter((i) => i.category === cat)
              .map((item) => (
                <div
                  key={item._id}
                  style={{
                    background: T.bgCard,
                    border: `1px solid ${editItem?._id === item._id ? T.gold : T.border}`,
                    borderRadius: 12,
                    overflow: "hidden",
                    transition: "all .2s",
                    opacity: item.available ? 1 : 0.55,
                    position: "relative",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = T.borderH)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor =
                      editItem?._id === item._id ? T.gold : T.border)
                  }
                >
                  {item.image && (
                    <div
                      style={{
                        height: 80,
                        overflow: "hidden",
                        background: "rgba(212,168,67,0.05)",
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) =>
                          (e.currentTarget.style.display = "none")
                        }
                      />
                    </div>
                  )}
                  <div
                    style={{
                      padding: "11px 13px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            color: T.cream,
                            fontSize: 13,
                            fontWeight: 600,
                            marginBottom: 2,
                          }}
                        >
                          {item.name}
                        </p>
                        {item.description && (
                          <p
                            style={{
                              color: T.muted,
                              fontSize: 11,
                              lineHeight: 1.4,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {item.description}
                          </p>
                        )}
                      </div>
                      <span
                        style={{
                          fontFamily: "'Cinzel',serif",
                          fontSize: 15,
                          fontWeight: 700,
                          color: T.gold,
                          marginLeft: 8,
                          flexShrink: 0,
                        }}
                      >
                        {fmt(item.price)}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAvail(item);
                        }}
                        style={{
                          flex: 1,
                          padding: "7px 8px",
                          borderRadius: 6,
                          cursor: "pointer",
                          fontSize: 11,
                          background: item.available
                            ? "rgba(34,197,94,0.08)"
                            : "rgba(239,68,68,0.08)",
                          border: `1px solid ${item.available ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
                          color: item.available ? T.green : T.red,
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 4,
                        }}
                      >
                        {item.available ? "✓ On Menu" : "✗ Hidden"}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(item);
                        }}
                        style={{
                          padding: "7px 12px",
                          borderRadius: 6,
                          cursor: "pointer",
                          background:
                            editItem?._id === item._id
                              ? T.goldDim
                              : "rgba(212,168,67,0.06)",
                          border: `1px solid ${editItem?._id === item._id ? T.gold : "rgba(212,168,67,0.2)"}`,
                          color: T.gold,
                          fontSize: 11,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                      <button
                        disabled={busyIds.has(item._id)}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget(item._id);
                        }}
                        style={{
                          padding: "7px 12px",
                          borderRadius: 6,
                          cursor: busyIds.has(item._id) ? "wait" : "pointer",
                          background: "rgba(239,68,68,0.07)",
                          border: "1px solid rgba(239,68,68,0.2)",
                          color: T.red,
                          fontSize: 11,
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          opacity: busyIds.has(item._id) ? 0.5 : 1,
                        }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}

      {localItems.length === 0 && (
        <div
          style={{ textAlign: "center", padding: "60px 20px", color: T.faint }}
        >
          <UtensilsCrossed
            size={40}
            style={{ margin: "0 auto 12px", opacity: 0.3 }}
          />
          <p style={{ fontSize: 14 }}>
            No menu items yet — add your first one above
          </p>
        </div>
      )}
    </div>
  );
}

// ── ANALYTICS TAB ────────────────────────────────────────────────────────────
function AnalyticsTab({ orders }: { orders: Order[] }) {
  const w = useWindowWidth();
  const isMobile = w < 640;

  const completed = orders.filter((o) => o.status === "completed");
  const revenue = completed.reduce((s, o) => s + o.total, 0);
  const avgOrder = completed.length ? revenue / completed.length : 0;
  const deliveryCount = orders.filter((o) => o.type === "delivery").length;
  const dineInCount = orders.filter((o) => o.type === "dine-in").length;
  const byStatus = Object.entries(STATUS_CFG)
    .map(([k, v]) => ({
      status: k as OrderStatus,
      label: v.label,
      color: v.color,
      count: orders.filter((o) => o.status === k).length,
    }))
    .filter((x) => x.count > 0);
  const maxCount = Math.max(...byStatus.map((x) => x.count), 1);

  const crewMap: Record<string, number> = {};
  orders.forEach((o) => {
    if (o.waiterName) crewMap[o.waiterName] = (crewMap[o.waiterName] || 0) + 1;
  });
  const crewList = Object.entries(crewMap).sort((a, b) => b[1] - a[1]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))",
          gap: 12,
        }}
      >
        {[
          { label: "Total Revenue", value: fmt(revenue), color: T.gold },
          {
            label: "Completed",
            value: String(completed.length),
            color: T.green,
          },
          { label: "Avg Order", value: fmt(avgOrder), color: T.blue },
          { label: "Delivery", value: String(deliveryCount), color: T.purple },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: T.bgCard,
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              padding: "16px 18px",
            }}
          >
            <p
              style={{
                color: T.muted,
                fontSize: 10,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                marginBottom: 8,
                fontFamily: "'Cinzel',serif",
              }}
            >
              {s.label}
            </p>
            <p
              style={{
                fontFamily: "'Cinzel',serif",
                fontSize: 20,
                fontWeight: 700,
                color: s.color,
              }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 12,
        }}
      >
        <div
          style={{
            background: T.bgCard,
            border: `1px solid ${T.border}`,
            borderRadius: 14,
            padding: 20,
          }}
        >
          <p
            style={{
              color: T.gold,
              fontSize: 11,
              letterSpacing: ".15em",
              textTransform: "uppercase",
              fontFamily: "'Cinzel',serif",
              marginBottom: 16,
            }}
          >
            ◆ Orders by Status
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {byStatus.map(({ status, label, color, count }) => (
              <div key={status}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 5,
                  }}
                >
                  <span style={{ color: T.muted, fontSize: 12 }}>{label}</span>
                  <span
                    style={{ color: T.cream, fontSize: 12, fontWeight: 600 }}
                  >
                    {count}
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: 99,
                  }}
                >
                  <div
                    style={{
                      height: 6,
                      borderRadius: 99,
                      background: color,
                      width: `${(count / maxCount) * 100}%`,
                      transition: "width .5s",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            background: T.bgCard,
            border: `1px solid ${T.border}`,
            borderRadius: 14,
            padding: 20,
          }}
        >
          <p
            style={{
              color: T.gold,
              fontSize: 11,
              letterSpacing: ".15em",
              textTransform: "uppercase",
              fontFamily: "'Cinzel',serif",
              marginBottom: 16,
            }}
          >
            ◆ Crew Orders
          </p>
          {crewList.length === 0 ? (
            <p style={{ color: T.faint, fontSize: 12 }}>No crew orders yet</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {crewList.map(([name, count]) => (
                <div key={name}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 5,
                    }}
                  >
                    <span style={{ color: T.muted, fontSize: 12 }}>
                      👤 {name}
                    </span>
                    <span
                      style={{ color: T.cream, fontSize: 12, fontWeight: 600 }}
                    >
                      {count}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 6,
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: 99,
                    }}
                  >
                    <div
                      style={{
                        height: 6,
                        borderRadius: 99,
                        background: T.blue,
                        width: `${(count / (crewList[0][1] || 1)) * 100}%`,
                        transition: "width .5s",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          background: T.bgCard,
          border: `1px solid ${T.border}`,
          borderRadius: 14,
          padding: 20,
        }}
      >
        <p
          style={{
            color: T.gold,
            fontSize: 11,
            letterSpacing: ".15em",
            textTransform: "uppercase",
            fontFamily: "'Cinzel',serif",
            marginBottom: 16,
          }}
        >
          ◆ Order Type Split
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          {[
            {
              label: "Dine-In",
              count: dineInCount,
              color: T.green,
              emoji: "🪑",
            },
            {
              label: "Delivery",
              count: deliveryCount,
              color: T.gold,
              emoji: "🚚",
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${T.border}`,
                borderRadius: 10,
                padding: 14,
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: 24, marginBottom: 6 }}>{s.emoji}</p>
              <p
                style={{
                  fontFamily: "'Cinzel',serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: s.color,
                }}
              >
                {s.count}
              </p>
              <p style={{ color: T.muted, fontSize: 11, marginTop: 3 }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── GCASH PAYMENT SCREEN ─────────────────────────────────────────────────────
function GCashPaymentScreen({
  total,
  orderNumber,
  onDone,
}: {
  total: number;
  orderNumber: string;
  onDone: () => void;
}) {
  const GCASH_NUMBER = "09XX XXX XXXX";
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        background:
          "radial-gradient(ellipse at 50% 30%,rgba(212,168,67,0.12) 0%,transparent 60%), #0a0f0a",
      }}
    >
      <div
        style={{
          maxWidth: 400,
          width: "100%",
          textAlign: "center",
          position: "relative",
        }}
      >
        <button
          onClick={onDone}
          style={{
            position: "absolute",
            top: -10,
            right: 0,
            background: "rgba(255,255,255,0.08)",
            border: `1px solid ${T.border}`,
            borderRadius: 999,
            width: 36,
            height: 36,
            color: T.muted,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={16} />
        </button>
        <p
          style={{
            color: T.muted,
            fontSize: 11,
            letterSpacing: ".2em",
            fontFamily: "'Cinzel',serif",
            marginBottom: 8,
          }}
        >
          GCASH PAYMENT
        </p>
        <p
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: 13,
            color: T.cream,
            marginBottom: 24,
            letterSpacing: ".06em",
          }}
        >
          Order #{orderNumber}
        </p>
        <div
          style={{
            background: T.goldDim,
            border: `2px solid ${T.gold}`,
            borderRadius: 20,
            padding: "20px 32px",
            marginBottom: 28,
            display: "inline-block",
          }}
        >
          <p
            style={{
              color: T.muted,
              fontSize: 11,
              letterSpacing: ".15em",
              marginBottom: 4,
            }}
          >
            AMOUNT DUE
          </p>
          <p
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: "clamp(2rem,8vw,3.5rem)",
              fontWeight: 700,
              color: T.gold,
            }}
          >
            {fmt(total)}
          </p>
        </div>
        <div
          style={{
            background: "white",
            borderRadius: 20,
            padding: 16,
            width: 200,
            height: 200,
            margin: "0 auto 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 40px rgba(212,168,67,0.2)",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <QrCode size={100} color="#1a73e8" />
            <p
              style={{
                fontSize: 10,
                color: "#333",
                marginTop: 6,
                fontWeight: 600,
              }}
            >
              PLACE YOUR GCASH QR
            </p>
            <p style={{ fontSize: 9, color: "#888", marginTop: 2 }}>
              Replace with /gcash-qr.png
            </p>
          </div>
        </div>
        <div
          style={{
            background: T.bgCard,
            border: `1px solid ${T.border}`,
            borderRadius: 14,
            padding: "14px 20px",
            marginBottom: 24,
          }}
        >
          <p
            style={{
              color: T.muted,
              fontSize: 10,
              letterSpacing: ".1em",
              marginBottom: 4,
            }}
          >
            SEND TO
          </p>
          <p
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: 22,
              fontWeight: 700,
              color: T.cream,
              letterSpacing: ".04em",
            }}
          >
            {GCASH_NUMBER}
          </p>
          <p style={{ color: T.muted, fontSize: 11, marginTop: 2 }}>
            3rd Space Coffee
          </p>
        </div>
        <button
          onClick={onDone}
          style={{
            width: "100%",
            padding: "15px",
            background: T.green,
            border: "none",
            borderRadius: 14,
            color: "#0a0f0a",
            fontFamily: "'Cinzel',serif",
            fontSize: 13,
            letterSpacing: ".12em",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ✓ PAYMENT RECEIVED — CONFIRM ORDER
        </button>
      </div>
    </div>
  );
}

// ── ACCOUNTS TAB ─────────────────────────────────────────────────────────────
function AccountsTab() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    username: "",
    displayName: "",
    password: "",
    role: "staff" as "admin" | "staff",
  });
  const [saving, setSaving] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const w = useWindowWidth();
  const isMobile = w < 600;

  useEffect(() => {
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    setLoading(true);
    try {
      const res = await fetch("/api/accounts");
      if (res.ok) setAccounts(await res.json());
    } catch {}
    setLoading(false);
  }

  async function createAccount() {
    if (
      !form.username.trim() ||
      !form.displayName.trim() ||
      !form.password.trim()
    ) {
      setErr("All fields required.");
      return;
    }
    setSaving(true);
    setErr("");
    try {
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setErr(data.error || "Failed to create account.");
      } else {
        setForm({ username: "", displayName: "", password: "", role: "staff" });
        setShowForm(false);
        fetchAccounts();
      }
    } catch {
      setErr("Network error.");
    }
    setSaving(false);
  }

  async function doDelete() {
    if (!confirmDelete) return;
    try {
      const res = await fetch(`/api/accounts/${confirmDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok)
        setAccounts((p) => p.filter((a) => a._id !== confirmDelete.id));
    } catch {}
    setConfirmDelete(null);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${T.border}`,
    borderRadius: 8,
    padding: "9px 12px",
    color: T.cream,
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };
  const labelStyle: React.CSSProperties = {
    color: T.muted,
    fontSize: 10,
    letterSpacing: ".1em",
    display: "block",
    marginBottom: 6,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {confirmDelete && (
        <ConfirmModal
          message={`Delete account "${confirmDelete.name}"?\nThis cannot be undone.`}
          onConfirm={doDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <p style={{ color: T.muted, fontSize: 12 }}>
          {accounts.length} account{accounts.length !== 1 ? "s" : ""}
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={fetchAccounts}
            style={{
              padding: "8px 14px",
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${T.border}`,
              borderRadius: 8,
              color: T.muted,
              fontSize: 12,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <RefreshCw size={13} /> Refresh
          </button>
          <button
            onClick={() => setShowForm((v) => !v)}
            style={{
              padding: "8px 16px",
              background: T.gold,
              border: "none",
              borderRadius: 8,
              color: "#0a0f0a",
              fontFamily: "'Cinzel',serif",
              fontSize: 11,
              letterSpacing: ".1em",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <UserPlus size={13} /> NEW ACCOUNT
          </button>
        </div>
      </div>

      {showForm && (
        <div
          style={{
            background: "rgba(0,0,0,0.4)",
            border: `1px solid ${T.borderH}`,
            borderRadius: 16,
            padding: 22,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3
              style={{
                fontFamily: "'Cinzel',serif",
                color: T.cream,
                fontSize: 14,
                letterSpacing: ".1em",
              }}
            >
              CREATE ACCOUNT
            </h3>
            <button
              onClick={() => setShowForm(false)}
              style={{
                background: "none",
                border: "none",
                color: T.muted,
                cursor: "pointer",
              }}
            >
              <X size={16} />
            </button>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: 12,
            }}
          >
            <div>
              <label style={labelStyle}>USERNAME</label>
              <input
                value={form.username}
                onChange={(e) =>
                  setForm((p) => ({ ...p, username: e.target.value }))
                }
                placeholder="e.g. maria"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>DISPLAY NAME</label>
              <input
                value={form.displayName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, displayName: e.target.value }))
                }
                placeholder="e.g. Maria Santos"
                style={inputStyle}
              />
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: 12,
            }}
          >
            <div style={{ position: "relative" }}>
              <label style={labelStyle}>PASSWORD</label>
              <input
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={(e) =>
                  setForm((p) => ({ ...p, password: e.target.value }))
                }
                placeholder="Set password"
                style={{ ...inputStyle, paddingRight: 44 }}
              />
              <button
                onClick={() => setShowPw((v) => !v)}
                style={{
                  position: "absolute",
                  right: 10,
                  bottom: 10,
                  background: "none",
                  border: "none",
                  color: T.muted,
                  cursor: "pointer",
                  fontSize: 11,
                  fontFamily: "'Cinzel',serif",
                }}
              >
                {showPw ? "HIDE" : "SHOW"}
              </button>
            </div>
            <div>
              <label style={labelStyle}>ROLE</label>
              <div style={{ display: "flex", gap: 8 }}>
                {(["staff", "admin"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setForm((p) => ({ ...p, role: r }))}
                    style={{
                      flex: 1,
                      padding: "9px 8px",
                      borderRadius: 8,
                      cursor: "pointer",
                      background:
                        form.role === r
                          ? r === "admin"
                            ? T.goldDim
                            : "rgba(91,155,213,0.15)"
                          : "rgba(255,255,255,0.03)",
                      border: `1px solid ${form.role === r ? (r === "admin" ? T.gold : T.blue) : T.border}`,
                      color:
                        form.role === r
                          ? r === "admin"
                            ? T.gold
                            : T.blue
                          : T.muted,
                      fontSize: 11,
                      fontWeight: 700,
                      fontFamily: "'Cinzel',serif",
                      letterSpacing: ".06em",
                    }}
                  >
                    {r === "admin" ? "⚙ ADMIN" : "👤 CREW"}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {err && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "rgba(239,68,68,0.8)",
                fontSize: 12,
              }}
            >
              <AlertCircle size={13} /> {err}
            </div>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={createAccount}
              disabled={saving}
              style={{
                flex: 1,
                padding: "11px",
                background: T.gold,
                color: "#0a0f0a",
                border: "none",
                borderRadius: 10,
                fontFamily: "'Cinzel',serif",
                fontSize: 12,
                letterSpacing: ".1em",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {saving ? "CREATING…" : "CREATE ACCOUNT"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{
                padding: "11px 18px",
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${T.border}`,
                borderRadius: 10,
                color: T.muted,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: T.muted,
            fontSize: 12,
          }}
        >
          Loading…
        </div>
      ) : accounts.length === 0 ? (
        <div
          style={{ textAlign: "center", padding: "60px 20px", color: T.faint }}
        >
          <Users size={40} style={{ margin: "0 auto 12px", opacity: 0.3 }} />
          <p style={{ fontSize: 14 }}>
            No accounts yet — create your first one above
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {accounts.map((acc) => (
            <div
              key={acc._id}
              style={{
                background: T.bgCard,
                border: `1px solid ${T.border}`,
                borderRadius: 12,
                padding: "14px 16px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                transition: "border-color .2s",
                flexWrap: "wrap",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = T.borderH)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = T.border)
              }
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background:
                    acc.role === "admin" ? T.goldDim : "rgba(91,155,213,0.15)",
                  border: `1px solid ${acc.role === "admin" ? T.gold : T.blue}44`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {acc.role === "admin" ? (
                  <Shield size={16} color={T.gold} />
                ) : (
                  <Users size={16} color={T.blue} />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: T.cream, fontSize: 14, fontWeight: 600 }}>
                  {acc.displayName}
                </p>
                <p style={{ color: T.muted, fontSize: 12, marginTop: 2 }}>
                  @{acc.username}
                  <span
                    style={{
                      marginLeft: 8,
                      background:
                        acc.role === "admin"
                          ? T.goldDim
                          : "rgba(91,155,213,0.12)",
                      color: acc.role === "admin" ? T.gold : T.blue,
                      border: `1px solid ${acc.role === "admin" ? "rgba(212,168,67,0.3)" : "rgba(91,155,213,0.25)"}`,
                      padding: "1px 8px",
                      borderRadius: 4,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: ".06em",
                    }}
                  >
                    {acc.role.toUpperCase()}
                  </span>
                  {acc.createdAt && (
                    <span
                      style={{ marginLeft: 8, color: T.faint, fontSize: 11 }}
                    >
                      · {ago(acc.createdAt)}
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={() =>
                  setConfirmDelete({ id: acc._id, name: acc.displayName })
                }
                style={{
                  padding: "7px 10px",
                  background: "rgba(239,68,68,0.07)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 8,
                  color: T.red,
                  cursor: "pointer",
                }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── CREW TAB ─────────────────────────────────────────────────────────────────
function CrewTab({
  menuItems,
  onOrderPlaced,
  staffName,
}: {
  menuItems: MenuItem[];
  onOrderPlaced: () => void;
  staffName: string;
}) {
  const w = useWindowWidth();
  const isMobile = w < 768;

  const [tableNumber, setTableNumber] = useState("");
  const [cart, setCart] = useState<{ item: MenuItem; qty: number }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"gcash" | "cash">("gcash");
  const [showQR, setShowQR] = useState<{
    total: number;
    orderNumber: string;
    orderId: string;
  } | null>(null);
  const [activeCategory, setActiveCategory] = useState("");
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [receiptSrc, setReceiptSrc] = useState<string | null>(null);
  const [showCartMobile, setShowCartMobile] = useState(false);

  useEffect(() => {
    fetchMyOrders();
    const id = setInterval(fetchMyOrders, 15000);
    return () => clearInterval(id);
  }, [staffName]);

  async function fetchMyOrders() {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const all: Order[] = await res.json();
        setMyOrders(
          all.filter(
            (o) =>
              o.waiterName?.trim().toLowerCase() ===
              staffName.trim().toLowerCase(),
          ),
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOrders(false);
    }
  }

  async function crewUpdateStatus(id: string, status: OrderStatus) {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok)
      setMyOrders((p) => p.map((o) => (o._id === id ? { ...o, status } : o)));
  }

  async function crewConfirmPayment(id: string) {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus: "confirmed" }),
    });
    if (res.ok)
      setMyOrders((p) =>
        p.map((o) => (o._id === id ? { ...o, paymentStatus: "confirmed" } : o)),
      );
  }

  const availItems = menuItems.filter((i) => i.available);
  const categories = Array.from(new Set(availItems.map((i) => i.category)));
  const activeCat = activeCategory || categories[0] || "";
  const filtered = availItems.filter((i) => i.category === activeCat);
  const cartTotal = cart.reduce((s, c) => s + c.item.price * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  function addItem(item: MenuItem) {
    setCart((p) => {
      const ex = p.find((c) => c.item._id === item._id);
      if (ex)
        return p.map((c) =>
          c.item._id === item._id ? { ...c, qty: c.qty + 1 } : c,
        );
      return [...p, { item, qty: 1 }];
    });
  }
  function updateQty(id: string, qty: number) {
    if (qty <= 0) setCart((p) => p.filter((c) => c.item._id !== id));
    else setCart((p) => p.map((c) => (c.item._id === id ? { ...c, qty } : c)));
  }

  async function placeOrder() {
    if (!tableNumber.trim() || cart.length === 0) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "dine-in",
          tableNumber: tableNumber.trim(),
          items: cart.map((c) => ({
            menuItemId: c.item._id,
            name: c.item.name,
            price: c.item.price,
            quantity: c.qty,
          })),
          total: cartTotal,
          paymentMethod,
          paymentStatus: paymentMethod === "cash" ? "confirmed" : "pending",
          source: "crew",
          waiterName: staffName.trim(),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      if (paymentMethod === "cash") {
        setCart([]);
        setTableNumber("");
        onOrderPlaced();
        fetchMyOrders();
      } else {
        setShowQR({
          total: cartTotal,
          orderNumber: data.orderNumber,
          orderId: data._id,
        });
      }
    } catch {
      alert("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleQRDone() {
    if (showQR?.orderId) await crewConfirmPayment(showQR.orderId);
    setShowQR(null);
    setCart([]);
    setTableNumber("");
    onOrderPlaced();
    fetchMyOrders();
  }

  if (showQR)
    return (
      <GCashPaymentScreen
        total={showQR.total}
        orderNumber={showQR.orderNumber}
        onDone={handleQRDone}
      />
    );

  const OrderSummaryPanel = (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        style={{
          background: T.bgCard,
          border: `1px solid ${T.border}`,
          borderRadius: 14,
          padding: 16,
        }}
      >
        <label
          style={{
            color: T.muted,
            fontSize: 10,
            letterSpacing: ".1em",
            display: "block",
            marginBottom: 8,
            fontFamily: "'Cinzel',serif",
          }}
        >
          TABLE NUMBER
        </label>
        <input
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          placeholder="e.g. 5"
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            padding: "10px 12px",
            color: T.cream,
            fontSize: 14,
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "'Cinzel',serif",
            letterSpacing: ".04em",
          }}
        />
      </div>
      <div
        style={{
          background: T.bgCard,
          border: `1px solid ${T.border}`,
          borderRadius: 14,
          padding: 16,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <p
          style={{
            color: T.muted,
            fontSize: 10,
            letterSpacing: ".12em",
            fontFamily: "'Cinzel',serif",
            marginBottom: 4,
          }}
        >
          ORDER SUMMARY
        </p>
        {cart.length === 0 ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: T.faint,
              fontSize: 13,
              textAlign: "center",
              padding: 20,
            }}
          >
            <div>
              <UtensilsCrossed
                size={28}
                style={{ margin: "0 auto 8px", opacity: 0.3 }}
              />
              <p>Tap items to add them</p>
            </div>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                overflowY: "auto",
                maxHeight: isMobile ? 220 : 300,
              }}
            >
              {cart.map(({ item, qty }) => (
                <div
                  key={item._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 10px",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: 8,
                    border: `1px solid ${T.border}`,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        color: T.cream,
                        fontSize: 12,
                        fontWeight: 600,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.name}
                    </p>
                    <p
                      style={{
                        color: T.gold,
                        fontSize: 12,
                        fontFamily: "'Cinzel',serif",
                      }}
                    >
                      {fmt(item.price * qty)}
                    </p>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <button
                      onClick={() => updateQty(item._id, qty - 1)}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 999,
                        border: `1px solid ${T.border}`,
                        background: "none",
                        color: T.muted,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                      }}
                    >
                      −
                    </button>
                    <span
                      style={{
                        width: 22,
                        textAlign: "center",
                        color: T.cream,
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {qty}
                    </span>
                    <button
                      onClick={() => updateQty(item._id, qty + 1)}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 999,
                        background: T.gold,
                        border: "none",
                        color: "#0a0f0a",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                borderTop: `1px solid ${T.border}`,
                paddingTop: 12,
                marginTop: 4,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <span style={{ color: T.muted, fontSize: 12 }}>
                  Total ({cartCount} items)
                </span>
                <span
                  style={{
                    fontFamily: "'Cinzel',serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: T.gold,
                  }}
                >
                  {fmt(cartTotal)}
                </span>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                {(["cash", "gcash"] as const).map((m) => {
                  const a = paymentMethod === m;
                  return (
                    <button
                      key={m}
                      onClick={() => setPaymentMethod(m)}
                      style={{
                        flex: 1,
                        padding: "9px 8px",
                        borderRadius: 8,
                        cursor: "pointer",
                        background: a
                          ? m === "cash"
                            ? "rgba(34,197,94,0.15)"
                            : T.goldDim
                          : "rgba(255,255,255,0.03)",
                        border: `1px solid ${a ? (m === "cash" ? T.green : T.gold) : T.border}`,
                        color: a ? (m === "cash" ? T.green : T.gold) : T.muted,
                        fontSize: 11,
                        fontWeight: 700,
                        fontFamily: "'Cinzel',serif",
                        letterSpacing: ".06em",
                      }}
                    >
                      {m === "cash" ? "💵 CASH" : "📱 GCASH"}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={placeOrder}
                disabled={
                  !tableNumber.trim() || cart.length === 0 || submitting
                }
                style={{
                  width: "100%",
                  padding: "13px",
                  background:
                    tableNumber.trim() && cart.length > 0
                      ? T.gold
                      : "rgba(212,168,67,0.25)",
                  color:
                    tableNumber.trim() && cart.length > 0 ? "#0a0f0a" : T.muted,
                  border: "none",
                  borderRadius: 12,
                  fontFamily: "'Cinzel',serif",
                  fontSize: 12,
                  letterSpacing: ".12em",
                  fontWeight: 700,
                  cursor:
                    tableNumber.trim() && cart.length > 0
                      ? "pointer"
                      : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {submitting ? (
                  "PLACING…"
                ) : paymentMethod === "cash" ? (
                  "💵 PLACE CASH ORDER"
                ) : (
                  <>
                    <QrCode size={14} /> PLACE ORDER & SHOW QR
                  </>
                )}
              </button>
              {!tableNumber.trim() && (
                <p
                  style={{
                    color: "rgba(245,158,11,0.7)",
                    fontSize: 11,
                    textAlign: "center",
                    marginTop: 6,
                  }}
                >
                  Enter table number to proceed
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      {receiptSrc && (
        <ImageLightbox src={receiptSrc} onClose={() => setReceiptSrc(null)} />
      )}

      {isMobile && showCartMobile && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 500,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setShowCartMobile(false)}
        >
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "#0f1a0f",
              border: `1px solid ${T.border}`,
              borderRadius: "20px 20px 0 0",
              padding: "20px 16px 32px",
              maxHeight: "85vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: 40,
                height: 4,
                background: T.border,
                borderRadius: 999,
                margin: "0 auto 20px",
              }}
            />
            {OrderSummaryPanel}
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            display: isMobile ? "block" : "grid",
            gridTemplateColumns: "1fr 300px",
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                gap: 8,
                overflowX: "auto",
                paddingBottom: 10,
                marginBottom: 14,
                scrollbarWidth: "none",
              }}
            >
              {categories.map((cat) => {
                const a = activeCat === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      whiteSpace: "nowrap",
                      padding: "6px 16px",
                      borderRadius: 999,
                      cursor: "pointer",
                      border: `1px solid ${a ? T.gold : T.border}`,
                      background: a ? T.gold : "transparent",
                      color: a ? "#0a0f0a" : T.muted,
                      fontFamily: "'Cinzel',serif",
                      fontSize: 11,
                      letterSpacing: ".08em",
                      fontWeight: a ? 700 : 400,
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(auto-fill,minmax(${isMobile ? "140px" : "155px"},1fr))`,
                gap: 10,
              }}
            >
              {filtered.map((item) => {
                const inCart = cart.find((c) => c.item._id === item._id);
                return (
                  <div
                    key={item._id}
                    onClick={() => addItem(item)}
                    style={{
                      background: inCart ? T.goldDim : T.bgCard,
                      border: `1px solid ${inCart ? T.gold : T.border}`,
                      borderRadius: 12,
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "all .15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = T.borderH)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = inCart
                        ? T.gold
                        : T.border)
                    }
                  >
                    {item.image && (
                      <div style={{ height: 70, overflow: "hidden" }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          }
                        />
                      </div>
                    )}
                    <div style={{ padding: "10px 12px" }}>
                      <p
                        style={{
                          color: T.cream,
                          fontSize: 12,
                          fontWeight: 600,
                          marginBottom: 2,
                        }}
                      >
                        {item.name}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Cinzel',serif",
                            color: T.gold,
                            fontSize: 13,
                            fontWeight: 700,
                          }}
                        >
                          {fmt(item.price)}
                        </span>
                        {inCart && (
                          <span
                            style={{
                              background: T.gold,
                              color: "#0a0f0a",
                              borderRadius: 999,
                              width: 20,
                              height: 20,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 11,
                              fontWeight: 700,
                            }}
                          >
                            {inCart.qty}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {availItems.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  color: T.faint,
                }}
              >
                <p>No available items. Ask admin to add some.</p>
              </div>
            )}
          </div>

          {!isMobile && <div>{OrderSummaryPanel}</div>}
        </div>

        {isMobile && (
          <div style={{ position: "sticky", bottom: 16, zIndex: 100 }}>
            <button
              onClick={() => setShowCartMobile(true)}
              style={{
                width: "100%",
                padding: "14px 20px",
                background: cartCount > 0 ? T.gold : "rgba(212,168,67,0.3)",
                border: "none",
                borderRadius: 14,
                color: cartCount > 0 ? "#0a0f0a" : T.muted,
                fontFamily: "'Cinzel',serif",
                fontSize: 13,
                letterSpacing: ".1em",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                boxShadow:
                  cartCount > 0 ? "0 4px 20px rgba(212,168,67,0.4)" : "none",
                transition: "all .2s",
              }}
            >
              <UtensilsCrossed size={16} />
              {cartCount > 0
                ? `VIEW ORDER · ${fmt(cartTotal)} (${cartCount} items)`
                : "Cart is empty"}
            </button>
          </div>
        )}

        <div
          style={{
            background: T.bgCard,
            border: `1px solid ${T.border}`,
            borderRadius: 14,
            padding: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <p
              style={{
                color: T.gold,
                fontSize: 11,
                letterSpacing: ".15em",
                textTransform: "uppercase",
                fontFamily: "'Cinzel',serif",
              }}
            >
              ◆ My Orders ({staffName}) — {myOrders.length}
            </p>
            <button
              onClick={fetchMyOrders}
              style={{
                padding: "5px 12px",
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${T.border}`,
                borderRadius: 6,
                color: T.muted,
                fontSize: 11,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <RefreshCw size={11} /> Refresh
            </button>
          </div>

          {loadingOrders ? (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                color: T.muted,
                fontSize: 12,
              }}
            >
              Loading…
            </div>
          ) : myOrders.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "24px 20px",
                color: T.faint,
                fontSize: 13,
              }}
            >
              No orders yet — place your first one above
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {myOrders.map((o) => {
                const nextStatus = STATUS_CFG[o.status].next;
                return (
                  <div
                    key={o._id}
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: `1px solid ${T.border}`,
                      borderRadius: 10,
                      padding: "12px 14px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          flexWrap: "wrap",
                        }}
                      >
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            flexShrink: 0,
                            background: STATUS_CFG[o.status].color,
                            boxShadow: `0 0 6px ${STATUS_CFG[o.status].color}88`,
                          }}
                        />
                        <span
                          style={{
                            fontFamily: "'Cinzel',serif",
                            fontSize: 13,
                            color: T.cream,
                            fontWeight: 700,
                            letterSpacing: ".04em",
                          }}
                        >
                          #{o.orderNumber}
                        </span>
                        <span style={{ fontSize: 11, color: T.muted }}>
                          Table {o.tableNumber || "?"}
                        </span>
                        <Badge status={o.status} />
                        <span style={{ fontSize: 11, color: T.muted }}>
                          {ago(o.createdAt)}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Cinzel',serif",
                            color: T.gold,
                            fontSize: 14,
                            fontWeight: 700,
                          }}
                        >
                          {fmt(o.total)}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            color:
                              o.paymentStatus === "confirmed"
                                ? T.green
                                : "#f59e0b",
                            background:
                              o.paymentStatus === "confirmed"
                                ? "rgba(34,197,94,0.1)"
                                : "rgba(245,158,11,0.1)",
                            border: `1px solid ${o.paymentStatus === "confirmed" ? "rgba(34,197,94,0.3)" : "rgba(245,158,11,0.3)"}`,
                            padding: "2px 8px",
                            borderRadius: 4,
                            fontWeight: 600,
                          }}
                        >
                          {o.paymentStatus === "confirmed"
                            ? "✓ Paid"
                            : "⏳ Unpaid"}
                        </span>
                      </div>
                    </div>
                    <p style={{ color: T.muted, fontSize: 11 }}>
                      {o.items
                        .map((it) => `${it.quantity}× ${it.name}`)
                        .join(", ")}
                    </p>
                    {o.status !== "completed" && o.status !== "cancelled" && (
                      <div
                        style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
                      >
                        {nextStatus && (
                          <button
                            onClick={() => crewUpdateStatus(o._id, nextStatus)}
                            style={{
                              flex: 1,
                              minWidth: 110,
                              padding: "7px 12px",
                              background: STATUS_CFG[nextStatus].color + "18",
                              border: `1px solid ${STATUS_CFG[nextStatus].color}44`,
                              color: STATUS_CFG[nextStatus].color,
                              borderRadius: 8,
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            → {STATUS_CFG[nextStatus].label}
                          </button>
                        )}
                        {o.paymentStatus === "pending" && (
                          <button
                            onClick={() => crewConfirmPayment(o._id)}
                            style={{
                              padding: "7px 12px",
                              background: "rgba(34,197,94,0.1)",
                              border: "1px solid rgba(34,197,94,0.3)",
                              color: T.green,
                              borderRadius: 8,
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            Confirm Payment
                          </button>
                        )}
                        {o.receiptUrl && (
                          <button
                            onClick={() => setReceiptSrc(o.receiptUrl!)}
                            style={{
                              padding: "7px 12px",
                              background: "rgba(91,155,213,0.08)",
                              border: "1px solid rgba(91,155,213,0.2)",
                              color: T.blue,
                              borderRadius: 8,
                              fontSize: 11,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                            }}
                          >
                            <ImageIcon size={11} /> Receipt
                          </button>
                        )}
                        <button
                          onClick={() => crewUpdateStatus(o._id, "cancelled")}
                          style={{
                            padding: "7px 12px",
                            background: "rgba(239,68,68,0.08)",
                            border: "1px solid rgba(239,68,68,0.2)",
                            color: T.red,
                            borderRadius: 8,
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const w = useWindowWidth();
  const isMobile = w < 640;

  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>(null);
  const [staffName, setStaffName] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [activeConfirm, setActiveConfirm] = useState<{
    id: string;
    type: "order";
  } | null>(null);

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }

  const isAdmin = role === "admin";

  useEffect(() => {
    const savedRole = localStorage.getItem("3s_role") as Role;
    const savedName = localStorage.getItem("3s_name") || "";
    if (savedRole && savedName && !savedName.includes("@")) {
      setRole(savedRole);
      setStaffName(savedName);
      if (savedRole === "staff") setTab("crew");
      fetchData();
    } else {
      localStorage.removeItem("3s_role");
      localStorage.removeItem("3s_name");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!role) return;
    const id = setInterval(() => fetchData(true), 15000);
    return () => clearInterval(id);
  }, [role]);

  async function login() {
    if (!username.trim() || !password.trim()) {
      setLoginErr("Enter username and password.");
      return;
    }
    setLoginLoading(true);
    setLoginErr("");
    try {
      const res = await fetch("/api/accounts/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      if (!res.ok) {
        if (res.status === 404) {
          await legacyLogin();
          return;
        }
        setLoginErr("Invalid username or password.");
        return;
      }
      const data = await res.json();
      const r: Role = data.role;
      const name: string = data.displayName || username.trim();
      setRole(r);
      setStaffName(name);
      localStorage.setItem("3s_role", r!);
      localStorage.setItem("3s_name", name);
      if (r === "staff") setTab("crew");
      fetchData();
    } catch {
      await legacyLogin();
    } finally {
      setLoginLoading(false);
    }
  }

  async function legacyLogin() {
    const adminPw = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin";
    const staffPw = process.env.NEXT_PUBLIC_STAFF_PASSWORD || "staff";
    if (password === adminPw) {
      const name = username.trim() || "Admin";
      setRole("admin");
      setStaffName(name);
      localStorage.setItem("3s_role", "admin");
      localStorage.setItem("3s_name", name);
      fetchData();
    } else if (password === staffPw) {
      if (!username.trim()) {
        setLoginErr("Enter your name to continue.");
        return;
      }
      setRole("staff");
      setStaffName(username.trim());
      localStorage.setItem("3s_role", "staff");
      localStorage.setItem("3s_name", username.trim());
      setTab("crew");
      fetchData();
    } else {
      setLoginErr("Incorrect password.");
      setTimeout(() => setLoginErr(""), 2500);
    }
    setPassword("");
  }

  function logout() {
    setRole(null);
    setStaffName("");
    setUsername("");
    localStorage.removeItem("3s_role");
    localStorage.removeItem("3s_name");
    setOrders([]);
    setMenuItems([]);
  }

  async function fetchData(silent = false): Promise<void> {
    try {
      if (!silent) setLoading(true);
      const [oRes, mRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/menu"),
      ]);
      if (oRes.ok) setOrders(await oRes.json());
      if (mRes.ok) setMenuItems(await mRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      if (!silent) setLoading(false);
    }
  }

  async function updateStatus(id: string, status: OrderStatus) {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error(await res.text());
      setOrders((p) => p.map((o) => (o._id === id ? { ...o, status } : o)));
      showToast(`→ ${STATUS_CFG[status].label}`);
    } catch (e) {
      showToast("Failed to update order status", false);
      console.error(e);
    }
  }

  async function confirmPayment(id: string) {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: "confirmed" }),
      });
      if (!res.ok) throw new Error(await res.text());
      setOrders((p) =>
        p.map((o) => (o._id === id ? { ...o, paymentStatus: "confirmed" } : o)),
      );
      showToast("Payment confirmed ✓");
    } catch {
      showToast("Failed to confirm payment", false);
    }
  }

  // NEW: only updates the method, does NOT mark as paid
  async function setPaymentMethod(id: string, method: "cash" | "gcash") {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethod: method }),
      });
      if (!res.ok) throw new Error(await res.text());
      // Update local state — payment is still pending, only method is now known
      setOrders((p) =>
        p.map((o) => (o._id === id ? { ...o, paymentMethod: method } : o)),
      );
      showToast(`Payment method set to ${method}`);
    } catch {
      showToast("Failed to set payment method", false);
    }
  }

  function deleteOrder(id: string) {
    setActiveConfirm({ id, type: "order" });
  }

  if (!role) {
    return (
      <div
        style={{
          minHeight: "100svh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          background:
            "radial-gradient(ellipse at 50% 20%,rgba(212,168,67,0.1) 0%,transparent 60%), #0a0f0a",
        }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap'); *{box-sizing:border-box;margin:0;padding:0;}body{background:#0a0f0a;} input:focus{outline:none;border-color:${T.gold}!important;}`}</style>
        <div
          style={{
            width: "100%",
            maxWidth: 380,
            background: T.bgCard,
            border: `1px solid ${T.border}`,
            borderRadius: 24,
            padding: "40px 36px",
            display: "flex",
            flexDirection: "column",
            gap: 24,
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "'Cinzel',serif",
                fontSize: 28,
                fontWeight: 700,
                color: T.cream,
                letterSpacing: ".2em",
                marginBottom: 6,
              }}
            >
              3RD SPACE
            </div>
            <div
              style={{
                width: 40,
                height: 1,
                background: `linear-gradient(90deg,transparent,${T.gold},transparent)`,
                margin: "0 auto 8px",
              }}
            />
            <p style={{ color: T.muted, fontSize: 11, letterSpacing: ".15em" }}>
              STAFF & ADMIN PORTAL
            </p>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div>
              <label
                style={{
                  color: T.muted,
                  fontSize: 10,
                  letterSpacing: ".1em",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                USERNAME
              </label>
              <input
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setLoginErr("");
                }}
                onKeyDown={(e) => e.key === "Enter" && login()}
                placeholder="e.g. maria"
                autoComplete="username"
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${loginErr ? "rgba(239,68,68,0.5)" : T.border}`,
                  borderRadius: 12,
                  padding: "13px 16px",
                  color: T.cream,
                  fontSize: 14,
                  fontFamily: "inherit",
                  transition: "border-color .2s",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  color: T.muted,
                  fontSize: 10,
                  letterSpacing: ".1em",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                PASSWORD
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLoginErr("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && login()}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${loginErr ? "rgba(239,68,68,0.5)" : T.border}`,
                    borderRadius: 12,
                    padding: "13px 44px 13px 16px",
                    color: T.cream,
                    fontSize: 14,
                    fontFamily: "inherit",
                    transition: "border-color .2s",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  onClick={() => setShowPass((p) => !p)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(0,0,0,0.3)",
                    border: `1px solid ${T.border}`,
                    borderRadius: 6,
                    padding: "4px 6px",
                    color: T.cream,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            {loginErr && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: "rgba(239,68,68,0.8)",
                  fontSize: 12,
                }}
              >
                <AlertCircle size={13} /> {loginErr}
              </div>
            )}
            <button
              onClick={login}
              disabled={loginLoading}
              style={{
                width: "100%",
                padding: "13px",
                background: T.gold,
                border: "none",
                borderRadius: 12,
                color: "#0a0f0a",
                fontFamily: "'Cinzel',serif",
                fontSize: 13,
                letterSpacing: ".15em",
                fontWeight: 700,
                cursor: loginLoading ? "wait" : "pointer",
                opacity: loginLoading ? 0.8 : 1,
              }}
            >
              {loginLoading ? "LOGGING IN…" : "LOGIN"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeOrders = orders.filter(
    (o) => o.status !== "completed" && o.status !== "cancelled",
  );
  const doneOrders = orders.filter(
    (o) => o.status === "completed" || o.status === "cancelled",
  );
  const revenue = orders
    .filter((o) => o.status === "completed")
    .reduce((s, o) => s + o.total, 0);

  const ALL_TABS: {
    id: Tab;
    label: string;
    icon: React.ReactNode;
    adminOnly?: boolean;
  }[] = [
    {
      id: "orders",
      label: "Orders",
      icon: <Package size={15} />,
      adminOnly: true,
    },
    { id: "crew", label: "Crew", icon: <Zap size={15} /> },
    {
      id: "menu",
      label: "Menu",
      icon: <UtensilsCrossed size={15} />,
      adminOnly: true,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <BarChart3 size={15} />,
      adminOnly: true,
    },
    {
      id: "accounts",
      label: "Accounts",
      icon: <Users size={15} />,
      adminOnly: true,
    },
  ];
  const TABS = isAdmin ? ALL_TABS : ALL_TABS.filter((t) => !t.adminOnly);

  return (
    <div style={{ minHeight: "100svh", background: "#0a0f0a", color: T.cream }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}body{background:#0a0f0a;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-thumb{background:${T.border};border-radius:99px;}
        input,textarea{color:${T.cream}!important;}
        input::placeholder,textarea::placeholder{color:${T.faint}!important;}
        input:focus,textarea:focus{outline:none;border-color:${T.gold}!important;}
        input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0;}
        input[type=number]{-moz-appearance:textfield;}`}</style>

      <header
        style={{
          borderBottom: `1px solid ${T.border}`,
          padding: isMobile ? "0 14px" : "0 24px",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(10,15,10,0.9)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 200,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? 8 : 14,
          }}
        >
          <span
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: isMobile ? 14 : 16,
              fontWeight: 700,
              color: T.cream,
              letterSpacing: ".15em",
            }}
          >
            3RD SPACE
          </span>
          <div
            style={{
              background: isAdmin
                ? "rgba(212,168,67,0.12)"
                : "rgba(91,155,213,0.12)",
              border: `1px solid ${isAdmin ? "rgba(212,168,67,0.3)" : "rgba(91,155,213,0.3)"}`,
              borderRadius: 999,
              padding: "3px 10px",
              fontSize: 10,
              fontWeight: 700,
              color: isAdmin ? T.gold : T.blue,
              letterSpacing: ".08em",
              fontFamily: "'Cinzel',serif",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            {isAdmin ? (
              <>
                <Shield size={10} /> ADMIN
              </>
            ) : (
              <>👤 {isMobile ? staffName.split(" ")[0] : staffName}</>
            )}
          </div>
          {activeOrders.length > 0 && (
            <div
              style={{
                background: T.gold,
                color: "#0a0f0a",
                borderRadius: 999,
                padding: "2px 10px",
                fontSize: 11,
                fontWeight: 700,
                fontFamily: "'Cinzel',serif",
              }}
            >
              {activeOrders.length}
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {!isMobile && (
            <button
              onClick={() => fetchData()}
              style={{
                padding: "7px 14px",
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${T.border}`,
                borderRadius: 8,
                color: T.muted,
                fontSize: 12,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <RefreshCw size={13} /> Refresh
            </button>
          )}
          <button
            onClick={logout}
            style={{
              padding: "7px 12px",
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${T.border}`,
              borderRadius: 8,
              color: T.muted,
              fontSize: 12,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <LogOut size={13} />
            {!isMobile && " Logout"}
          </button>
        </div>
      </header>

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: isMobile ? "16px 12px" : "24px 20px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(auto-fill,minmax(${isMobile ? "140px" : "180px"},1fr))`,
            gap: isMobile ? 8 : 12,
            marginBottom: isMobile ? 16 : 24,
          }}
        >
          <StatCard
            label="Active Orders"
            value={String(activeOrders.length)}
            icon={<Package size={20} />}
          />
          <StatCard
            label="Total Orders"
            value={String(orders.length)}
            icon={<Clock size={20} />}
          />
          {isAdmin && (
            <StatCard
              label="Revenue"
              value={fmt(revenue)}
              icon={<DollarSign size={20} />}
            />
          )}
          {isAdmin && (
            <StatCard
              label="Menu Items"
              value={String(menuItems.length)}
              icon={<UtensilsCrossed size={20} />}
            />
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: isMobile ? 4 : 6,
            marginBottom: isMobile ? 16 : 22,
            borderBottom: `1px solid ${T.border}`,
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {TABS.map((t) => {
            const a = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: isMobile ? 5 : 7,
                  padding: isMobile ? "9px 12px" : "10px 18px",
                  borderRadius: "8px 8px 0 0",
                  cursor: "pointer",
                  background: a ? "rgba(212,168,67,0.1)" : "transparent",
                  borderTop: a
                    ? `1px solid ${T.borderH}`
                    : "1px solid transparent",
                  borderLeft: a
                    ? `1px solid ${T.borderH}`
                    : "1px solid transparent",
                  borderRight: a
                    ? `1px solid ${T.borderH}`
                    : "1px solid transparent",
                  borderBottom: "none",
                  color: a ? T.gold : T.muted,
                  fontFamily: "'Cinzel',serif",
                  fontSize: isMobile ? 10 : 11,
                  letterSpacing: ".1em",
                  fontWeight: a ? 700 : 400,
                  transition: "all .15s",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {t.icon} {t.label.toUpperCase()}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              color: T.muted,
            }}
          >
            <RefreshCw
              size={24}
              style={{ margin: "0 auto 12px", opacity: 0.5 }}
            />
            <p>Loading...</p>
          </div>
        ) : tab === "orders" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <p
                style={{
                  color: T.gold,
                  fontSize: 11,
                  letterSpacing: ".15em",
                  textTransform: "uppercase",
                  fontFamily: "'Cinzel',serif",
                  marginBottom: 12,
                }}
              >
                ◆ Active — {activeOrders.length}
              </p>
              {activeOrders.length === 0 ? (
                <div
                  style={{
                    background: T.bgCard,
                    border: `1px solid ${T.border}`,
                    borderRadius: 12,
                    padding: "32px 20px",
                    textAlign: "center",
                    color: T.faint,
                  }}
                >
                  <Package
                    size={28}
                    style={{ margin: "0 auto 8px", opacity: 0.3 }}
                  />
                  <p style={{ fontSize: 13 }}>No active orders right now</p>
                </div>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {activeOrders.map((o) => (
                    <OrderCard
                      key={o._id}
                      order={o}
                      onStatusChange={updateStatus}
                      onPaymentConfirm={confirmPayment}
                      onSetPaymentMethod={setPaymentMethod}
                      onDelete={deleteOrder}
                    />
                  ))}
                </div>
              )}
            </div>
            {doneOrders.length > 0 && (
              <div>
                <p
                  style={{
                    color: T.muted,
                    fontSize: 11,
                    letterSpacing: ".15em",
                    textTransform: "uppercase",
                    fontFamily: "'Cinzel',serif",
                    marginBottom: 12,
                    marginTop: 8,
                  }}
                >
                  ◆ Completed & Cancelled — {doneOrders.length}
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {doneOrders.map((o) => (
                    <OrderCard
                      key={o._id}
                      order={o}
                      onStatusChange={updateStatus}
                      onPaymentConfirm={confirmPayment}
                      onSetPaymentMethod={setPaymentMethod}
                      onDelete={deleteOrder}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : tab === "crew" ? (
          <CrewTab
            menuItems={menuItems}
            onOrderPlaced={fetchData}
            staffName={staffName}
          />
        ) : tab === "menu" ? (
          <MenuTab items={menuItems} onRefresh={() => fetchData(true)} />
        ) : tab === "analytics" ? (
          <AnalyticsTab orders={orders} />
        ) : (
          <AccountsTab />
        )}
      </div>

      {activeConfirm?.type === "order" && (
        <ConfirmModal
          message="Delete this order? This cannot be undone."
          onConfirm={async () => {
            const id = activeConfirm.id;
            setActiveConfirm(null);
            try {
              const res = await fetch(`/api/orders/${id}`, {
                method: "DELETE",
              });
              if (!res.ok) throw new Error();
              setOrders((p) => p.filter((o) => o._id !== id));
              showToast("Order deleted");
            } catch {
              showToast("Failed to delete order", false);
            }
          }}
          onCancel={() => setActiveConfirm(null)}
        />
      )}

      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 28,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            background: toast.ok
              ? "rgba(34,197,94,0.12)"
              : "rgba(239,68,68,0.12)",
            border: `1px solid ${toast.ok ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"}`,
            color: toast.ok ? T.green : T.red,
            borderRadius: 12,
            padding: "12px 28px",
            fontSize: 13,
            fontWeight: 600,
            backdropFilter: "blur(8px)",
            whiteSpace: "nowrap",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          }}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
