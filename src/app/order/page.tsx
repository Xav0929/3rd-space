"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
}

type OrderType = "delivery" | "dine-in";
type Step = "mode-select" | "menu" | "checkout" | "payment" | "confirmed";

// ─── Header Nav ───────────────────────────────────────────────────────────────

function OrderHeader({
  step,
  cartCount,
  total,
  onCartClick,
  onBack,
}: {
  step: Step;
  cartCount: number;
  total: number;
  onCartClick: () => void;
  onBack: () => void;
}) {
  const showBack = step !== "mode-select" && step !== "confirmed";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 h-14 flex items-center justify-between px-4"
      style={{
        background: "var(--bg-deep)",
        borderBottom: "1px solid rgba(232,213,163,0.07)",
      }}
    >
      {/* Left: back button or spacer */}
      {showBack ? (
        <button
          onClick={onBack}
          className="flex items-center gap-2 transition-opacity hover:opacity-70"
          style={{ color: "var(--cream-faint)" }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          <span className="text-xs tracking-widest hidden sm:inline">BACK</span>
        </button>
      ) : (
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-70"
          style={{ color: "var(--cream-faint)" }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          <span className="text-xs tracking-widest hidden sm:inline">HOME</span>
        </Link>
      )}

      {/* Center: logo */}
      <Link href="/" className="flex items-center gap-2">
        <span
          className="font-hero text-lg tracking-widest"
          style={{ color: "var(--cream)" }}
        >
          3RD SPACE
        </span>
      </Link>

      {/* Right: cart button (only on menu/checkout steps) */}
      {(step === "menu" || step === "checkout") && cartCount > 0 ? (
        <button
          onClick={onCartClick}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all active:scale-95"
          style={{
            background: "var(--accent-gold)",
            color: "var(--bg-deep)",
          }}
        >
          <span className="font-hero text-sm tracking-wide">
            {cartCount} · ₱{total.toFixed(0)}
          </span>
        </button>
      ) : (
        <div className="w-16" />
      )}
    </header>
  );
}

// ─── Mode Selection Screen ─────────────────────────────────────────────────────

function ModeSelectScreen({ onSelect }: { onSelect: (mode: OrderType) => void }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: "var(--bg-deep)" }}
    >
      <div className="w-full max-w-md flex flex-col gap-8 animate-fade-in-up">
        {/* Header */}
        <div className="text-center">
          <p
            className="text-xs tracking-widest mb-2"
            style={{ color: "var(--cream-faint)" }}
          >
            HOW WOULD YOU LIKE TO ORDER?
          </p>
          <h1
            className="font-hero text-5xl tracking-widest"
            style={{ color: "var(--cream)" }}
          >
            ORDER
          </h1>
        </div>

        {/* Mode buttons */}
        <div className="flex flex-col gap-4">
          {/* Dine-in */}
          <button
            onClick={() => onSelect("dine-in")}
            className="group relative overflow-hidden rounded-2xl p-8 text-left transition-all hover:scale-105 active:scale-95"
            style={{
              background: "var(--bg-card)",
              border: "1px solid rgba(232,213,163,0.15)",
            }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(212,168,67,0.1), transparent)",
              }}
            />
            <div className="relative flex flex-col gap-3">
              <div className="text-4xl">🍽</div>
              <div>
                <p
                  className="font-hero text-2xl tracking-wide"
                  style={{ color: "var(--cream)" }}
                >
                  Dine-in
                </p>
                <p
                  className="text-sm mt-1"
                  style={{ color: "var(--cream-faint)" }}
                >
                  Order at our café, pay on-site via GCash
                </p>
              </div>
            </div>
          </button>

          {/* Delivery */}
          <button
            onClick={() => onSelect("delivery")}
            className="group relative overflow-hidden rounded-2xl p-8 text-left transition-all hover:scale-105 active:scale-95"
            style={{
              background: "var(--bg-card)",
              border: "1px solid rgba(232,213,163,0.15)",
            }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(212,168,67,0.1), transparent)",
              }}
            />
            <div className="relative flex flex-col gap-3">
              <div className="text-4xl">🛵</div>
              <div>
                <p
                  className="font-hero text-2xl tracking-wide"
                  style={{ color: "var(--cream)" }}
                >
                  Delivery
                </p>
                <p
                  className="text-sm mt-1"
                  style={{ color: "var(--cream-faint)" }}
                >
                  We'll deliver to your address, pay via GCash
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Back to home */}
        <Link
          href="/"
          className="text-center text-sm underline underline-offset-4 transition-opacity hover:opacity-70"
          style={{ color: "var(--cream-faint)" }}
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

// ─── Menu Screen ──────────────────────────────────────────────────────────────

function MenuScreen({
  menuItems,
  loading,
  cart,
  onAddToCart,
  onCheckout,
}: {
  menuItems: MenuItem[];
  loading: boolean;
  cart: CartItem[];
  onAddToCart: (item: MenuItem) => void;
  onCheckout: () => void;
}) {
  const [activeCategory, setActiveCategory] = useState<string>("");

  const categories = Array.from(new Set(menuItems.map((m) => m.category))).sort();

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  const filteredItems = menuItems.filter((m) => m.category === activeCategory);

  return (
    <div
      className="min-h-screen flex flex-col pt-14 pb-32"
      style={{ background: "var(--bg-deep)" }}
    >
      {/* Header */}
      <div className="px-4 pt-8 pb-6 max-w-screen-lg mx-auto w-full">
        <p
          className="text-xs tracking-widest mb-1"
          style={{ color: "var(--cream-faint)" }}
        >
          3RD SPACE
        </p>
        <h1
          className="font-hero text-5xl tracking-widest"
          style={{ color: "var(--cream)" }}
        >
          MENU
        </h1>
      </div>

      {/* Category tabs */}
      {!loading && categories.length > 0 && (
        <div
          className="sticky top-14 z-20 px-4 py-3"
          style={{
            background: "var(--bg-deep)",
            borderBottom: "1px solid rgba(232,213,163,0.06)",
          }}
        >
          <div className="max-w-screen-lg mx-auto flex gap-2 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="shrink-0 px-4 py-2 rounded-full text-xs tracking-widest font-medium transition-all"
                style={{
                  background:
                    activeCategory === cat
                      ? "var(--accent-gold)"
                      : "transparent",
                  color:
                    activeCategory === cat
                      ? "var(--bg-deep)"
                      : "var(--cream-faint)",
                  border:
                    activeCategory === cat
                      ? "none"
                      : "1px solid rgba(232,213,163,0.15)",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Menu grid */}
      <main className="flex-1 px-4 py-8 max-w-screen-lg mx-auto w-full">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p style={{ color: "var(--cream-faint)" }}>Loading menu...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p style={{ color: "var(--cream-faint)" }}>
              No items in this category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const cartItem = cart.find((c) => c._id === item._id);
              const quantity = cartItem?.quantity || 0;

              return (
                <div
                  key={item._id}
                  className="group rounded-2xl overflow-hidden border transition-all hover:border-opacity-100"
                  style={{
                    background: "var(--bg-card)",
                    borderColor: "rgba(232,213,163,0.12)",
                  }}
                >
                  {/* Image */}
                  <div
                    className="relative w-full aspect-square overflow-hidden bg-gradient-to-br"
                    style={{
                      background: item.image
                        ? `url(${item.image}) center/cover`
                        : "linear-gradient(135deg, rgba(30,48,32,0.5), rgba(28,43,28,0.5))",
                    }}
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    {!item.available && (
                      <div
                        className="absolute inset-0 flex items-center justify-center text-lg font-medium"
                        style={{
                          background: "rgba(15,26,15,0.8)",
                          color: "var(--cream-faint)",
                        }}
                      >
                        Sold Out
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col gap-3">
                    <div>
                      <p
                        className="font-hero text-lg tracking-wide"
                        style={{ color: "var(--cream)" }}
                      >
                        {item.name}
                      </p>
                      {item.description && (
                        <p
                          className="text-xs mt-1"
                          style={{ color: "var(--cream-faint)" }}
                        >
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "rgba(232,213,163,0.08)" }}>
                      <p
                        className="font-hero text-xl"
                        style={{ color: "var(--accent-gold)" }}
                      >
                        ₱{item.price.toFixed(0)}
                      </p>

                      {/* Add to cart / quantity controls */}
                      {quantity === 0 ? (
                        <button
                          onClick={() => onAddToCart(item)}
                          disabled={!item.available}
                          className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{
                            background: "var(--accent-gold)",
                            color: "var(--bg-deep)",
                          }}
                        >
                          Add
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              // Remove logic handled in parent
                            }}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all hover:opacity-70"
                            style={{
                              background: "var(--green-dark)",
                              color: "var(--cream-muted)",
                            }}
                          >
                            −
                          </button>
                          <span
                            className="text-xs w-4 text-center font-medium"
                            style={{ color: "var(--cream)" }}
                          >
                            {quantity}
                          </span>
                          <button
                            onClick={() => onAddToCart(item)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all hover:opacity-70"
                            style={{
                              background: "var(--green-dark)",
                              color: "var(--cream-muted)",
                            }}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating checkout button */}
      {cart.length > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 p-4"
          style={{
            background:
              "linear-gradient(to top, var(--bg-deep) 70%, transparent)",
          }}
        >
          <button
            onClick={onCheckout}
            className="w-full max-w-screen-lg mx-auto rounded-xl py-4 font-hero text-lg tracking-widest transition-all hover:opacity-90 active:scale-95"
            style={{
              background: "var(--accent-gold)",
              color: "var(--bg-deep)",
            }}
          >
            CHECKOUT
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Checkout Screen ──────────────────────────────────────────────────────────

function CheckoutScreen({
  cart,
  orderType,
  form,
  onFormChange,
  onPayment,
  submitting,
}: {
  cart: CartItem[];
  orderType: OrderType;
  form: {
    customerName: string;
    customerContact: string;
    deliveryAddress: string;
    tableNumber: string;
    notes: string;
  };
  onFormChange: (key: string, value: string) => void;
  onPayment: () => void;
  submitting: boolean;
}) {
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const isValid =
    orderType === "dine-in"
      ? form.tableNumber.trim() !== ""
      : form.customerName.trim() !== "" &&
        form.customerContact.trim() !== "" &&
        form.deliveryAddress.trim() !== "";

  return (
    <div
      className="min-h-screen flex flex-col pt-14 pb-12 px-4"
      style={{ background: "var(--bg-deep)" }}
    >
      <main className="flex-1 max-w-lg mx-auto w-full flex flex-col gap-8 pt-8">
        {/* Header */}
        <div>
          <h1
            className="font-hero text-4xl tracking-widest"
            style={{ color: "var(--cream)" }}
          >
            {orderType === "dine-in" ? "DINE-IN" : "DELIVERY"}
          </h1>
          <p className="text-sm mt-2" style={{ color: "var(--cream-faint)" }}>
            {orderType === "dine-in"
              ? "Tell us your table number"
              : "Enter your delivery details"}
          </p>
        </div>

        {/* Form fields */}
        <div className="flex flex-col gap-4">
          {orderType === "dine-in" ? (
            <div className="flex flex-col gap-2">
              <label
                className="text-xs tracking-widest"
                style={{ color: "var(--cream-faint)" }}
              >
                TABLE NUMBER
              </label>
              <input
                type="text"
                placeholder="e.g. Table 5"
                value={form.tableNumber}
                onChange={(e) => onFormChange("tableNumber", e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none border transition-all"
                style={{
                  background: "var(--bg-card)",
                  borderColor: "rgba(232,213,163,0.12)",
                  color: "var(--cream)",
                }}
              />
            </div>
          ) : (
            <>
              {[
                {
                  key: "customerName",
                  label: "FULL NAME",
                  placeholder: "Juan dela Cruz",
                },
                {
                  key: "customerContact",
                  label: "CONTACT NUMBER",
                  placeholder: "09XX XXX XXXX",
                },
                {
                  key: "deliveryAddress",
                  label: "DELIVERY ADDRESS",
                  placeholder: "Street, Barangay, City",
                },
              ].map(({ key, label, placeholder }) => (
                <div key={key} className="flex flex-col gap-2">
                  <label
                    className="text-xs tracking-widest"
                    style={{ color: "var(--cream-faint)" }}
                  >
                    {label}
                  </label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => onFormChange(key, e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none border transition-all"
                    style={{
                      background: "var(--bg-card)",
                      borderColor: "rgba(232,213,163,0.12)",
                      color: "var(--cream)",
                    }}
                  />
                </div>
              ))}
            </>
          )}

          {/* Special notes */}
          <div className="flex flex-col gap-2">
            <label
              className="text-xs tracking-widest"
              style={{ color: "var(--cream-faint)" }}
            >
              SPECIAL NOTES{" "}
              <span style={{ opacity: 0.5 }}>(optional)</span>
            </label>
            <textarea
              placeholder="Allergies, special requests..."
              value={form.notes}
              onChange={(e) => onFormChange("notes", e.target.value)}
              rows={3}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none border transition-all resize-none"
              style={{
                background: "var(--bg-card)",
                borderColor: "rgba(232,213,163,0.12)",
                color: "var(--cream)",
              }}
            />
          </div>
        </div>

        {/* Order summary */}
        <div
          className="rounded-2xl p-4 border"
          style={{
            background: "var(--bg-card)",
            borderColor: "rgba(232,213,163,0.08)",
          }}
        >
          <p
            className="text-xs tracking-widest mb-3"
            style={{ color: "var(--cream-faint)" }}
          >
            ORDER SUMMARY
          </p>
          <div className="flex flex-col gap-2">
            {cart.map((item) => (
              <div key={item._id} className="flex justify-between text-sm">
                <span style={{ color: "var(--cream-muted)" }}>
                  {item.name} × {item.quantity}
                </span>
                <span style={{ color: "var(--cream)" }}>
                  ₱{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div
              className="flex justify-between pt-2 border-t mt-1"
              style={{ borderColor: "rgba(232,213,163,0.08)" }}
            >
              <span
                className="font-hero tracking-wide"
                style={{ color: "var(--cream)" }}
              >
                TOTAL
              </span>
              <span
                className="font-hero text-xl"
                style={{ color: "var(--accent-gold)" }}
              >
                ₱{total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Proceed to payment button */}
        <button
          onClick={onPayment}
          disabled={!isValid || submitting}
          className="w-full rounded-xl py-4 font-hero text-lg tracking-widest transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: "var(--accent-gold)",
            color: "var(--bg-deep)",
          }}
        >
          {submitting ? "PROCESSING..." : "PROCEED TO PAYMENT"}
        </button>
      </main>
    </div>
  );
}

// ─── Payment Screen ───────────────────────────────────────────────────────────

function PaymentScreen({
  total,
  orderType,
  onReceiptUploaded,
  onSkip,
  uploading,
}: {
  total: number;
  orderType: OrderType;
  onReceiptUploaded: (url: string, key: string) => void;
  onSkip: () => void;
  uploading: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      onReceiptUploaded(data.url, data.key);
    } catch {
      alert("Upload failed. Try again.");
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 pt-20"
      style={{ background: "var(--bg-deep)" }}
    >
      <div className="w-full max-w-sm flex flex-col gap-6 animate-fade-in-up">
        {/* Header */}
        <div className="text-center">
          <p
            className="font-hero text-4xl tracking-widest mb-2"
            style={{ color: "var(--cream)" }}
          >
            PAYMENT
          </p>
          <p className="text-sm" style={{ color: "var(--cream-faint)" }}>
            {orderType === "dine-in"
              ? "Scan the QR code at the counter"
              : "Scan the QR code to pay"}
          </p>
        </div>

        {/* QR Code */}
        <div
          className="rounded-2xl overflow-hidden flex items-center justify-center"
          style={{ background: "var(--green-dark)", aspectRatio: "1/1" }}
        >
          <img
            src="/gcash-qr.png"
            alt="GCash QR Code"
            className="w-full h-full object-contain p-4"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              (e.target as HTMLImageElement).parentElement!.innerHTML =
                `<div style="display:flex;flex-direction:column;align-items:center;gap:8px;padding:24px;color:rgba(232,213,163,0.4);text-align:center"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3M17 17v3h3M14 21h3"/></svg><span style="font-size:12px;font-family:'DM Sans',sans-serif">Place /public/gcash-qr.png<br/>with the café's QR code</span></div>`;
            }}
          />
        </div>

        {/* Amount */}
        <div
          className="rounded-xl p-4 flex items-center justify-between"
          style={{ background: "var(--green-dark)" }}
        >
          <span className="text-sm" style={{ color: "var(--cream-faint)" }}>
            Amount to pay
          </span>
          <span
            className="font-hero text-2xl tracking-wide"
            style={{ color: "var(--accent-gold)" }}
          >
            ₱{total.toFixed(2)}
          </span>
        </div>

        {/* Upload receipt (delivery only) */}
        {orderType === "delivery" && (
          <div className="flex flex-col gap-3">
            <p className="text-sm" style={{ color: "var(--cream-muted)" }}>
              After paying, upload your GCash receipt screenshot to confirm.
            </p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-full rounded-xl py-3 text-sm font-medium tracking-wide transition-all border"
              style={{
                background: "transparent",
                borderColor: "rgba(232,213,163,0.2)",
                color: "var(--cream-muted)",
              }}
            >
              {uploading ? "Uploading..." : "📎 Upload Receipt Screenshot"}
            </button>
          </div>
        )}

        {/* Confirm / Skip button */}
        <button
          onClick={onSkip}
          className="w-full rounded-xl py-4 font-hero text-lg tracking-widest transition-all hover:opacity-90 active:scale-95"
          style={{
            background: "var(--accent-gold)",
            color: "var(--bg-deep)",
          }}
        >
          {orderType === "delivery" ? "CONFIRM ORDER" : "DONE"}
        </button>

        {orderType === "dine-in" && (
          <p className="text-xs text-center" style={{ color: "var(--cream-faint)" }}>
            Show your order confirmation to the staff
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Confirmation Screen ──────────────────────────────────────────────────────

function ConfirmationScreen({
  orderNumber,
  orderType,
  onNewOrder,
}: {
  orderNumber: string;
  orderType: OrderType;
  onNewOrder: () => void;
}) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: "var(--bg-deep)" }}
    >
      <div className="w-full max-w-sm flex flex-col items-center gap-6 text-center animate-fade-in-up">
        {/* Success icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
          style={{
            background: "var(--green-dark)",
            border: "1px solid rgba(212,168,67,0.3)",
          }}
        >
          ✓
        </div>

        {/* Message */}
        <div>
          <p
            className="font-hero text-4xl tracking-widest mb-2"
            style={{ color: "var(--cream)" }}
          >
            ORDER PLACED
          </p>
          <p className="text-sm" style={{ color: "var(--cream-faint)" }}>
            {orderType === "dine-in"
              ? "Show this number to your waiter"
              : "We'll prepare your order shortly"}
          </p>
        </div>

        {/* Order number */}
        <div
          className="w-full rounded-2xl p-6 border"
          style={{
            background: "var(--bg-card)",
            borderColor: "rgba(232,213,163,0.1)",
          }}
        >
          <p
            className="text-xs tracking-widest mb-2"
            style={{ color: "var(--cream-faint)" }}
          >
            ORDER NUMBER
          </p>
          <p
            className="font-hero text-3xl tracking-widest"
            style={{ color: "var(--accent-gold)" }}
          >
            {orderNumber}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={onNewOrder}
            className="w-full rounded-xl py-3 font-hero text-lg tracking-widest transition-all hover:opacity-90 active:scale-95"
            style={{
              background: "var(--accent-gold)",
              color: "var(--bg-deep)",
            }}
          >
            PLACE ANOTHER ORDER
          </button>
          <Link
            href="/"
            className="text-center text-sm underline underline-offset-4 transition-opacity hover:opacity-70"
            style={{ color: "var(--cream-faint)" }}
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OrderPage() {
  const [step, setStep] = useState<Step>("mode-select");
  const [orderType, setOrderType] = useState<OrderType>("dine-in");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderNumber: string;
    type: OrderType;
  } | null>(null);

  const [receiptUrl, setReceiptUrl] = useState("");
  const [receiptKey, setReceiptKey] = useState("");

  const [form, setForm] = useState({
    customerName: "",
    customerContact: "",
    deliveryAddress: "",
    tableNumber: "",
    notes: "",
  });

  // Fetch menu
  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch("/api/menu");
        const data = await res.json();
        setMenuItems(data);
      } catch (err) {
        console.error("Failed to fetch menu:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, []);

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  function handleAddToCart(item: MenuItem) {
    const existing = cart.find((c) => c._id === item._id);
    if (existing) {
      setCart(
        cart.map((c) =>
          c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  }

  function handleRemoveFromCart(id: string) {
    setCart(cart.filter((c) => c._id !== id));
  }

  function handleFormChange(key: string, value: string) {
    setForm({ ...form, [key]: value });
  }

  async function submitOrder() {
    setSubmitting(true);
    try {
      const payload: any = {
        type: orderType,
        items: cart.map((i) => ({
          menuItemId: i._id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        total,
        notes: form.notes || undefined,
      };

      if (orderType === "delivery") {
        payload.customerName = form.customerName;
        payload.customerContact = form.customerContact;
        payload.deliveryAddress = form.deliveryAddress;
        payload.receiptUrl = receiptUrl;
        payload.receiptKey = receiptKey;
      } else {
        payload.tableNumber = form.tableNumber;
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Order submission failed");

      const data = await res.json();
      setConfirmedOrder({
        orderNumber: data.orderNumber,
        type: orderType,
      });
      setStep("confirmed");
      setCart([]);
      setReceiptUrl("");
      setReceiptKey("");
    } catch (err: any) {
      alert(err.message || "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleModeSelect(mode: OrderType) {
    setOrderType(mode);
    setStep("menu");
  }

  function handleBackStep() {
    if (step === "payment") {
      setStep("checkout");
    } else if (step === "checkout") {
      setStep("menu");
    } else if (step === "menu") {
      setStep("mode-select");
    }
  }

  function handleNewOrder() {
    setStep("mode-select");
    setOrderType("dine-in");
    setCart([]);
    setReceiptUrl("");
    setReceiptKey("");
    setForm({
      customerName: "",
      customerContact: "",
      deliveryAddress: "",
      tableNumber: "",
      notes: "",
    });
    setConfirmedOrder(null);
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ background: "var(--bg-deep)" }}>
      <OrderHeader
        step={step}
        cartCount={cart.length}
        total={total}
        onCartClick={() => {}}
        onBack={handleBackStep}
      />

      {step === "mode-select" && (
        <ModeSelectScreen onSelect={handleModeSelect} />
      )}

      {step === "menu" && (
        <MenuScreen
          menuItems={menuItems}
          loading={loading}
          cart={cart}
          onAddToCart={handleAddToCart}
          onCheckout={() => setStep("checkout")}
        />
      )}

      {step === "checkout" && (
        <CheckoutScreen
          cart={cart}
          orderType={orderType}
          form={form}
          onFormChange={handleFormChange}
          onPayment={() => setStep("payment")}
          submitting={submitting}
        />
      )}

      {step === "payment" && (
        <PaymentScreen
          total={total}
          orderType={orderType}
          onReceiptUploaded={(url, key) => {
            setReceiptUrl(url);
            setReceiptKey(key);
            if (orderType === "dine-in") {
              submitOrder();
            }
          }}
          onSkip={() => {
            if (orderType === "delivery" && !receiptUrl) {
              alert("Please upload your receipt screenshot");
              return;
            }
            submitOrder();
          }}
          uploading={uploading}
        />
      )}

      {step === "confirmed" && confirmedOrder && (
        <ConfirmationScreen
          orderNumber={confirmedOrder.orderNumber}
          orderType={confirmedOrder.type}
          onNewOrder={handleNewOrder}
        />
      )}
    </div>
  );
}
