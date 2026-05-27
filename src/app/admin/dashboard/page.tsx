"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

type OrderItem = {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
};

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
  notes?: string;
  createdAt: string;
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

type Tab = "orders" | "menu" | "analytics";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_NEXT: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: "confirmed",
  confirmed: "preparing",
  preparing: "ready",
  ready: "completed",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "#d4a843",
  confirmed: "#5b9bd5",
  preparing: "#a855f7",
  ready: "#22c55e",
  completed: "#6b7280",
  cancelled: "#ef4444",
};

function fmt(n: number) {
  return `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      style={{
        background: STATUS_COLORS[status] + "22",
        color: STATUS_COLORS[status],
        border: `1px solid ${STATUS_COLORS[status]}44`,
        padding: "2px 10px",
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function OrderCard({
  order,
  onStatusChange,
  onPaymentConfirm,
  onDelete,
}: {
  order: Order;
  onStatusChange: (id: string, status: OrderStatus) => void;
  onPaymentConfirm: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const next = STATUS_NEXT[order.status];

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid #2a3d2a",
        borderRadius: 12,
        overflow: "hidden",
        transition: "border-color 0.2s",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 16px",
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Type indicator */}
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: order.type === "delivery" ? "#d4a843" : "#22c55e",
            flexShrink: 0,
            boxShadow:
              order.type === "delivery"
                ? "0 0 6px #d4a84388"
                : "0 0 6px #22c55e88",
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
                fontFamily: "var(--font-yanone), sans-serif",
                fontSize: 15,
                fontWeight: 700,
                color: "var(--cream)",
                letterSpacing: "0.04em",
              }}
            >
              {order.orderNumber}
            </span>
            <StatusBadge status={order.status} />
            <span
              style={{
                fontSize: 11,
                color: "var(--cream-faint)",
                background: "#ffffff0a",
                padding: "2px 8px",
                borderRadius: 99,
                textTransform: "capitalize",
              }}
            >
              {order.type}
            </span>
            {order.type === "dine-in" && order.tableNumber && (
              <span
                style={{
                  fontSize: 11,
                  color: "var(--cream-muted)",
                  background: "#ffffff0a",
                  padding: "2px 8px",
                  borderRadius: 99,
                }}
              >
                Table {order.tableNumber}
              </span>
            )}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--cream-faint)",
              marginTop: 2,
            }}
          >
            {order.type === "delivery"
              ? order.customerName
              : "Walk-in customer"}{" "}
            · {timeAgo(order.createdAt)}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-yanone), sans-serif",
              fontSize: 17,
              fontWeight: 700,
              color: "var(--accent-gold)",
            }}
          >
            {fmt(order.total)}
          </span>
          <span style={{ color: "var(--cream-faint)", fontSize: 13 }}>
            {expanded ? "▲" : "▼"}
          </span>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div
          style={{
            borderTop: "1px solid #2a3d2a",
            padding: "14px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {/* Items */}
          <div>
            <div
              style={{
                fontSize: 11,
                color: "var(--cream-faint)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 8,
              }}
            >
              Items
            </div>
            {order.items.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 13,
                  color: "var(--cream-muted)",
                  padding: "3px 0",
                  borderBottom:
                    i < order.items.length - 1 ? "1px solid #1e2e1e" : "none",
                }}
              >
                <span>
                  {item.quantity}× {item.name}
                </span>
                <span>{fmt(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          {/* Delivery info */}
          {order.type === "delivery" && (
            <div
              style={{
                background: "#ffffff06",
                borderRadius: 8,
                padding: "10px 12px",
                fontSize: 13,
                color: "var(--cream-muted)",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div>
                <span style={{ color: "var(--cream-faint)" }}>Contact: </span>
                {order.customerContact}
              </div>
              <div>
                <span style={{ color: "var(--cream-faint)" }}>Address: </span>
                {order.deliveryAddress}
              </div>
            </div>
          )}

          {/* Notes */}
          {order.notes && (
            <div
              style={{
                background: "#d4a84308",
                border: "1px solid #d4a84322",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 13,
                color: "var(--cream-muted)",
                fontStyle: "italic",
              }}
            >
              "{order.notes}"
            </div>
          )}

          {/* Payment */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: 12,
                color:
                  order.paymentStatus === "confirmed" ? "#22c55e" : "#d4a843",
                background:
                  order.paymentStatus === "confirmed"
                    ? "#22c55e18"
                    : "#d4a84318",
                border: `1px solid ${
                  order.paymentStatus === "confirmed"
                    ? "#22c55e44"
                    : "#d4a84344"
                }`,
                borderRadius: 99,
                padding: "3px 10px",
              }}
            >
              Payment:{" "}
              {order.paymentStatus === "confirmed" ? "✓ Confirmed" : "Pending"}
            </span>

            {order.receiptUrl && (
              <a
                href={order.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 12,
                  color: "#5b9bd5",
                  textDecoration: "underline",
                }}
              >
                View Receipt ↗
              </a>
            )}

            {order.paymentStatus === "pending" && (
              <button
                onClick={() => onPaymentConfirm(order._id)}
                style={{
                  fontSize: 12,
                  background: "#22c55e18",
                  border: "1px solid #22c55e44",
                  color: "#22c55e",
                  borderRadius: 6,
                  padding: "4px 12px",
                  cursor: "pointer",
                }}
              >
                Confirm Payment
              </button>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {next && (
              <button
                onClick={() => onStatusChange(order._id, next)}
                style={{
                  flex: 1,
                  minWidth: 120,
                  padding: "8px 14px",
                  background: STATUS_COLORS[next] + "18",
                  border: `1px solid ${STATUS_COLORS[next]}44`,
                  color: STATUS_COLORS[next],
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                → Mark as {STATUS_LABELS[next]}
              </button>
            )}
            {order.status !== "cancelled" && order.status !== "completed" && (
              <button
                onClick={() => onStatusChange(order._id, "cancelled")}
                style={{
                  padding: "8px 14px",
                  background: "#ef444418",
                  border: "1px solid #ef444444",
                  color: "#ef4444",
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            )}
            {(order.status === "completed" || order.status === "cancelled") && (
              <button
                onClick={() => onDelete(order._id)}
                style={{
                  padding: "8px 14px",
                  background: "#ffffff08",
                  border: "1px solid #ffffff18",
                  color: "var(--cream-faint)",
                  borderRadius: 8,
                  fontSize: 13,
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
  );
}

// ─── Menu Item Form Modal ──────────────────────────────────────────────────────

function MenuItemModal({
  item,
  onClose,
  onSave,
}: {
  item?: MenuItem;
  onClose: () => void;
  onSave: (data: Partial<MenuItem>) => void;
}) {
  const [form, setForm] = useState({
    name: item?.name || "",
    description: item?.description || "",
    price: item?.price?.toString() || "",
    category: item?.category || "",
    image: item?.image || "",
    available: item?.available ?? true,
  });

  const set = (k: string, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  function handleSave() {
    if (!form.name || !form.price || !form.category) return;
    onSave({
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      category: form.category,
      image: form.image,
      available: form.available,
    });
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#ffffff0a",
    border: "1px solid #2a3d2a",
    borderRadius: 8,
    padding: "9px 12px",
    color: "var(--cream)",
    fontSize: 14,
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    color: "var(--cream-faint)",
    marginBottom: 4,
    display: "block",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000000bb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid #2a3d2a",
          borderRadius: 16,
          padding: 24,
          width: "100%",
          maxWidth: 460,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          style={{
            fontFamily: "var(--font-yanone), sans-serif",
            fontSize: 22,
            fontWeight: 700,
            color: "var(--cream)",
            letterSpacing: "0.05em",
          }}
        >
          {item ? "Edit Item" : "New Menu Item"}
        </h3>

        <div>
          <label style={labelStyle}>Name *</label>
          <input
            style={inputStyle}
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. Matcha Latte"
          />
        </div>
        <div>
          <label style={labelStyle}>Description</label>
          <input
            style={inputStyle}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Short description"
          />
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <div>
            <label style={labelStyle}>Price (₱) *</label>
            <input
              style={inputStyle}
              type="number"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div>
            <label style={labelStyle}>Category *</label>
            <input
              style={inputStyle}
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              placeholder="e.g. Coffee"
            />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Image URL</label>
          <input
            style={inputStyle}
            value={form.image}
            onChange={(e) => set("image", e.target.value)}
            placeholder="https://..."
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <label style={{ ...labelStyle, marginBottom: 0 }}>Available</label>
          <div
            onClick={() => set("available", !form.available)}
            style={{
              width: 40,
              height: 22,
              background: form.available ? "#22c55e" : "#2a3d2a",
              borderRadius: 99,
              cursor: "pointer",
              position: "relative",
              transition: "background 0.2s",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 3,
                left: form.available ? 21 : 3,
                width: 16,
                height: 16,
                background: "#fff",
                borderRadius: "50%",
                transition: "left 0.2s",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
            marginTop: 4,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "9px 18px",
              background: "transparent",
              border: "1px solid #2a3d2a",
              color: "var(--cream-faint)",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: "9px 20px",
              background: "var(--accent-gold)",
              border: "none",
              color: "#0f1a0f",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {item ? "Save Changes" : "Add Item"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("orders");

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Menu state
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuModal, setMenuModal] = useState<{
    open: boolean;
    item?: MenuItem;
  }>({ open: false });

  // Analytics state
  const [analytics, setAnalytics] = useState<{
    totalRevenue: number;
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    byDay: { date: string; revenue: number; count: number }[];
  } | null>(null);

  // Clear orders modal
  const [clearModal, setClearModal] = useState(false);
  const [clearDays, setClearDays] = useState("30");

  // ── Fetch orders ──
  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (typeFilter !== "all") params.set("type", typeFilter);
      const res = await fetch(`/api/orders?${params}`);
      if (res.status === 401) {
        router.push("/admin");
        return;
      }
      const data = await res.json();
      setOrders(data);
    } catch {
      /* silent */
    }
    setOrdersLoading(false);
  }, [statusFilter, typeFilter, router]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      if (tab === "orders") fetchOrders();
    }, 30000);
    return () => clearInterval(interval);
  }, [tab, fetchOrders]);

  // ── Fetch menu ──
  const fetchMenu = useCallback(async () => {
    setMenuLoading(true);
    try {
      const res = await fetch("/api/menu");
      const data = await res.json();
      setMenuItems(data);
    } catch {
      /* silent */
    }
    setMenuLoading(false);
  }, []);

  useEffect(() => {
    if (tab === "menu") fetchMenu();
  }, [tab, fetchMenu]);

  // ── Compute analytics from orders ──
  useEffect(() => {
    if (tab === "analytics" && orders.length === 0) fetchOrders();
  }, [tab]);

  useEffect(() => {
    if (orders.length === 0 && tab !== "analytics") return;

    const completed = orders.filter((o) => o.status === "completed");
    const totalRevenue = completed.reduce((s, o) => s + o.total, 0);
    const pending = orders.filter(
      (o) =>
        o.status === "pending" ||
        o.status === "confirmed" ||
        o.status === "preparing",
    ).length;

    // group by day (last 7 days)
    const dayMap: Record<string, { revenue: number; count: number }> = {};
    completed.forEach((o) => {
      const d = new Date(o.createdAt).toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
      });
      if (!dayMap[d]) dayMap[d] = { revenue: 0, count: 0 };
      dayMap[d].revenue += o.total;
      dayMap[d].count += 1;
    });

    setAnalytics({
      totalRevenue,
      totalOrders: orders.length,
      pendingOrders: pending,
      completedOrders: completed.length,
      byDay: Object.entries(dayMap)
        .map(([date, v]) => ({ date, ...v }))
        .slice(-7),
    });
  }, [orders]);

  // ── Order actions ──
  async function handleStatusChange(id: string, status: OrderStatus) {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
  }

  async function handlePaymentConfirm(id: string) {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus: "confirmed" }),
    });
    setOrders((prev) =>
      prev.map((o) =>
        o._id === id ? { ...o, paymentStatus: "confirmed" } : o,
      ),
    );
  }

  async function handleDeleteOrder(id: string) {
    if (!confirm("Delete this order?")) return;
    await fetch(`/api/orders/${id}`, { method: "DELETE" });
    setOrders((prev) => prev.filter((o) => o._id !== id));
  }

  async function handleClearOrders() {
    await fetch(`/api/orders/clear?days=${clearDays}`, { method: "DELETE" });
    setClearModal(false);
    fetchOrders();
  }

  // ── Menu actions ──
  async function handleSaveMenuItem(data: Partial<MenuItem>) {
    if (menuModal.item) {
      await fetch(`/api/menu/${menuModal.item._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    setMenuModal({ open: false });
    fetchMenu();
  }

  async function handleToggleAvailable(item: MenuItem) {
    await fetch(`/api/menu/${item._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: !item.available }),
    });
    setMenuItems((prev) =>
      prev.map((m) =>
        m._id === item._id ? { ...m, available: !m.available } : m,
      ),
    );
  }

  async function handleDeleteMenuItem(id: string) {
    if (!confirm("Delete this menu item?")) return;
    await fetch(`/api/menu/${id}`, { method: "DELETE" });
    setMenuItems((prev) => prev.filter((m) => m._id !== id));
  }

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin");
  }

  // ── Filtered orders ──
  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (typeFilter !== "all" && o.type !== typeFilter) return false;
    return true;
  });

  // ── Group menu by category ──
  const menuByCategory = menuItems.reduce<Record<string, MenuItem[]>>(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {},
  );

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-deep)",
        color: "var(--cream)",
        fontFamily: "var(--font-dm), sans-serif",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          borderBottom: "1px solid #1e2e1e",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          height: 56,
          position: "sticky",
          top: 0,
          background: "var(--bg-deep)",
          zIndex: 100,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-yanone), sans-serif",
            fontSize: 22,
            fontWeight: 700,
            color: "var(--cream)",
            letterSpacing: "0.08em",
            flex: 1,
          }}
        >
          3RD SPACE{" "}
          <span
            style={{
              color: "var(--cream-faint)",
              fontSize: 13,
              fontWeight: 400,
            }}
          >
            ADMIN
          </span>
        </span>

        {/* Nav tabs */}
        {(["orders", "menu", "analytics"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              background: tab === t ? "#2a3d2a" : "transparent",
              border: tab === t ? "1px solid #3a4d3a" : "1px solid transparent",
              color: tab === t ? "var(--cream)" : "var(--cream-faint)",
              fontSize: 13,
              fontWeight: tab === t ? 600 : 400,
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {t}
          </button>
        ))}

        <button
          onClick={handleLogout}
          style={{
            padding: "6px 12px",
            background: "transparent",
            border: "1px solid #2a3d2a",
            color: "var(--cream-faint)",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Logout
        </button>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
        {/* ── ORDERS TAB ── */}
        {tab === "orders" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Filters */}
            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", gap: 6 }}>
                {[
                  "all",
                  "pending",
                  "confirmed",
                  "preparing",
                  "ready",
                  "completed",
                  "cancelled",
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    style={{
                      padding: "5px 10px",
                      borderRadius: 6,
                      background:
                        statusFilter === s ? "#2a3d2a" : "transparent",
                      border:
                        statusFilter === s
                          ? "1px solid #3a4d3a"
                          : "1px solid #1e2e1e",
                      color:
                        statusFilter === s
                          ? "var(--cream)"
                          : "var(--cream-faint)",
                      fontSize: 12,
                      cursor: "pointer",
                      textTransform: "capitalize",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
                {["all", "delivery", "dine-in"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    style={{
                      padding: "5px 10px",
                      borderRadius: 6,
                      background: typeFilter === t ? "#2a3d2a" : "transparent",
                      border:
                        typeFilter === t
                          ? "1px solid #3a4d3a"
                          : "1px solid #1e2e1e",
                      color:
                        typeFilter === t
                          ? "var(--cream)"
                          : "var(--cream-faint)",
                      fontSize: 12,
                      cursor: "pointer",
                      textTransform: "capitalize",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setClearModal(true)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 6,
                  background: "transparent",
                  border: "1px solid #ef444433",
                  color: "#ef4444",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Clear Old Orders
              </button>
            </div>

            {/* Order count */}
            <div style={{ fontSize: 13, color: "var(--cream-faint)" }}>
              {filteredOrders.length} order
              {filteredOrders.length !== 1 ? "s" : ""}
              {statusFilter !== "all" || typeFilter !== "all"
                ? " (filtered)"
                : ""}
            </div>

            {/* Order list */}
            {ordersLoading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: 40,
                  color: "var(--cream-faint)",
                }}
              >
                Loading orders...
              </div>
            ) : filteredOrders.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: 60,
                  color: "var(--cream-faint)",
                  border: "1px dashed #2a3d2a",
                  borderRadius: 12,
                }}
              >
                No orders found
              </div>
            ) : (
              filteredOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onStatusChange={handleStatusChange}
                  onPaymentConfirm={handlePaymentConfirm}
                  onDelete={handleDeleteOrder}
                />
              ))
            )}
          </div>
        )}

        {/* ── MENU TAB ── */}
        {tab === "menu" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-yanone), sans-serif",
                  fontSize: 24,
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                }}
              >
                Menu Items
              </h2>
              <button
                onClick={() => setMenuModal({ open: true })}
                style={{
                  padding: "9px 18px",
                  background: "var(--accent-gold)",
                  border: "none",
                  color: "#0f1a0f",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                + Add Item
              </button>
            </div>

            {menuLoading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: 40,
                  color: "var(--cream-faint)",
                }}
              >
                Loading menu...
              </div>
            ) : Object.keys(menuByCategory).length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: 60,
                  color: "var(--cream-faint)",
                  border: "1px dashed #2a3d2a",
                  borderRadius: 12,
                }}
              >
                No menu items yet. Add your first item.
              </div>
            ) : (
              Object.entries(menuByCategory).map(([category, items]) => (
                <div key={category}>
                  <h3
                    style={{
                      fontSize: 12,
                      color: "var(--cream-faint)",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: 10,
                    }}
                  >
                    {category}
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(260px, 1fr))",
                      gap: 10,
                    }}
                  >
                    {items.map((item) => (
                      <div
                        key={item._id}
                        style={{
                          background: "var(--bg-card)",
                          border: `1px solid ${item.available ? "#2a3d2a" : "#3a2a2a"}`,
                          borderRadius: 10,
                          padding: "12px 14px",
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                          opacity: item.available ? 1 : 0.6,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontWeight: 600,
                                fontSize: 14,
                                color: "var(--cream)",
                              }}
                            >
                              {item.name}
                            </div>
                            {item.description && (
                              <div
                                style={{
                                  fontSize: 12,
                                  color: "var(--cream-faint)",
                                  marginTop: 2,
                                }}
                              >
                                {item.description}
                              </div>
                            )}
                          </div>
                          <span
                            style={{
                              fontFamily: "var(--font-yanone), sans-serif",
                              fontSize: 16,
                              fontWeight: 700,
                              color: "var(--accent-gold)",
                              whiteSpace: "nowrap",
                              marginLeft: 8,
                            }}
                          >
                            {fmt(item.price)}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: 6,
                            alignItems: "center",
                          }}
                        >
                          <div
                            onClick={() => handleToggleAvailable(item)}
                            style={{
                              width: 34,
                              height: 18,
                              background: item.available
                                ? "#22c55e"
                                : "#2a3d2a",
                              borderRadius: 99,
                              cursor: "pointer",
                              position: "relative",
                              transition: "background 0.2s",
                              flexShrink: 0,
                            }}
                          >
                            <div
                              style={{
                                position: "absolute",
                                top: 2,
                                left: item.available ? 17 : 2,
                                width: 14,
                                height: 14,
                                background: "#fff",
                                borderRadius: "50%",
                                transition: "left 0.2s",
                              }}
                            />
                          </div>
                          <span
                            style={{
                              fontSize: 11,
                              color: item.available
                                ? "#22c55e"
                                : "var(--cream-faint)",
                            }}
                          >
                            {item.available ? "Available" : "Unavailable"}
                          </span>
                          <div style={{ flex: 1 }} />
                          <button
                            onClick={() => setMenuModal({ open: true, item })}
                            style={{
                              fontSize: 12,
                              background: "transparent",
                              border: "1px solid #2a3d2a",
                              color: "var(--cream-faint)",
                              borderRadius: 6,
                              padding: "3px 10px",
                              cursor: "pointer",
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteMenuItem(item._id)}
                            style={{
                              fontSize: 12,
                              background: "transparent",
                              border: "1px solid #ef444433",
                              color: "#ef4444",
                              borderRadius: 6,
                              padding: "3px 10px",
                              cursor: "pointer",
                            }}
                          >
                            Del
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── ANALYTICS TAB ── */}
        {tab === "analytics" && analytics && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <h2
              style={{
                fontFamily: "var(--font-yanone), sans-serif",
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: "0.05em",
              }}
            >
              Sales Overview
            </h2>

            {/* Stat cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 12,
              }}
            >
              {[
                {
                  label: "Total Revenue",
                  value: fmt(analytics.totalRevenue),
                  color: "var(--accent-gold)",
                },
                {
                  label: "Total Orders",
                  value: analytics.totalOrders,
                  color: "var(--cream)",
                },
                {
                  label: "Active Orders",
                  value: analytics.pendingOrders,
                  color: "#d4a843",
                },
                {
                  label: "Completed",
                  value: analytics.completedOrders,
                  color: "#22c55e",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid #2a3d2a",
                    borderRadius: 12,
                    padding: "16px 18px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--cream-faint)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginBottom: 6,
                    }}
                  >
                    {stat.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-yanone), sans-serif",
                      fontSize: 28,
                      fontWeight: 700,
                      color: stat.color,
                    }}
                  >
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Revenue by day */}
            {analytics.byDay.length > 0 && (
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid #2a3d2a",
                  borderRadius: 12,
                  padding: "18px 20px",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--cream-faint)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: 16,
                  }}
                >
                  Revenue by Day (Completed Orders)
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {analytics.byDay.map((day) => {
                    const maxRev = Math.max(
                      ...analytics.byDay.map((d) => d.revenue),
                    );
                    const pct = maxRev > 0 ? (day.revenue / maxRev) * 100 : 0;
                    return (
                      <div
                        key={day.date}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <div
                          style={{
                            width: 72,
                            fontSize: 12,
                            color: "var(--cream-muted)",
                            flexShrink: 0,
                          }}
                        >
                          {day.date}
                        </div>
                        <div
                          style={{
                            flex: 1,
                            height: 20,
                            background: "#ffffff08",
                            borderRadius: 4,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${pct}%`,
                              height: "100%",
                              background:
                                "linear-gradient(90deg, var(--accent-gold), #e8b85a)",
                              borderRadius: 4,
                              transition: "width 0.6s ease",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            width: 100,
                            textAlign: "right",
                            fontSize: 13,
                            color: "var(--accent-gold)",
                            fontFamily: "var(--font-yanone), sans-serif",
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {fmt(day.revenue)}
                        </div>
                        <div
                          style={{
                            width: 40,
                            textAlign: "right",
                            fontSize: 12,
                            color: "var(--cream-faint)",
                            flexShrink: 0,
                          }}
                        >
                          {day.count}×
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {analytics.byDay.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: 60,
                  color: "var(--cream-faint)",
                  border: "1px dashed #2a3d2a",
                  borderRadius: 12,
                }}
              >
                No completed orders yet — analytics will appear here once orders
                are marked as completed.
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Menu item modal ── */}
      {menuModal.open && (
        <MenuItemModal
          item={menuModal.item}
          onClose={() => setMenuModal({ open: false })}
          onSave={handleSaveMenuItem}
        />
      )}

      {/* ── Clear orders modal ── */}
      {clearModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#000000bb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 16,
          }}
          onClick={() => setClearModal(false)}
        >
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid #3a2a2a",
              borderRadius: 16,
              padding: 24,
              width: "100%",
              maxWidth: 380,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontFamily: "var(--font-yanone), sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: "#ef4444",
                marginBottom: 12,
              }}
            >
              Clear Old Orders
            </h3>
            <p
              style={{
                fontSize: 13,
                color: "var(--cream-faint)",
                marginBottom: 16,
              }}
            >
              Permanently delete all{" "}
              <strong style={{ color: "var(--cream-muted)" }}>completed</strong>{" "}
              and{" "}
              <strong style={{ color: "var(--cream-muted)" }}>cancelled</strong>{" "}
              orders older than:
            </p>
            <select
              value={clearDays}
              onChange={(e) => setClearDays(e.target.value)}
              style={{
                width: "100%",
                background: "#ffffff0a",
                border: "1px solid #2a3d2a",
                borderRadius: 8,
                padding: "9px 12px",
                color: "var(--cream)",
                fontSize: 14,
                marginBottom: 16,
              }}
            >
              <option value="7">7 days</option>
              <option value="14">14 days</option>
              <option value="30">30 days</option>
              <option value="60">60 days</option>
              <option value="90">90 days</option>
            </select>
            <p style={{ fontSize: 12, color: "#ef444488", marginBottom: 18 }}>
              This also deletes receipt screenshots from R2. Cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setClearModal(false)}
                style={{
                  flex: 1,
                  padding: "9px",
                  background: "transparent",
                  border: "1px solid #2a3d2a",
                  color: "var(--cream-faint)",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleClearOrders}
                style={{
                  flex: 1,
                  padding: "9px",
                  background: "#ef444418",
                  border: "1px solid #ef444444",
                  color: "#ef4444",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                Clear Orders
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
