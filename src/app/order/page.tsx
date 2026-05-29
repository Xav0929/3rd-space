"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ChevronLeft,
  Upload,
  Check,
  X,
  Smartphone,
  Banknote,
  MapPin,
  Clock,
  ArrowRight,
  Receipt,
  Search,
  Navigation,
  Edit3,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

const G = "#d4a843";
const GD = "rgba(212,168,67,0.13)";
const C = "#e8d5a3";
const CM = "rgba(232,213,163,0.5)";
const CF = "rgba(232,213,163,0.2)";
const BG = "#0e190e";
const CARD = "rgba(255,255,255,0.04)";
const BR = "rgba(232,213,163,0.11)";
const BRH = "rgba(212,168,67,0.45)";
const ERR = "rgba(248,113,113,0.8)";

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
interface Order {
  orderNumber: string;
  type: "dine-in" | "delivery";
}
type OrderType = "dine-in" | "delivery";
type PayMethod = "cash" | "gcash" | "pay-later";
type Step = "mode-select" | "menu" | "checkout" | "payment" | "confirmed";

function normalizePHPhone(raw: string): string {
  let d = raw.replace(/\D/g, "");
  if (d.length === 10 && d.startsWith("9")) d = "0" + d;
  if (d.startsWith("63") && d.length === 12) d = "0" + d.slice(2);
  return d.slice(0, 11);
}
function isValidPHPhone(v: string) {
  const n = normalizePHPhone(v);
  return /^09\d{9}$/.test(n);
}
function formatPHPhoneDisplay(stored: string): string {
  const d = normalizePHPhone(stored);
  const without0 = d.startsWith("0") ? d.slice(1) : d;
  if (without0.length <= 3) return without0;
  if (without0.length <= 6)
    return `${without0.slice(0, 3)} ${without0.slice(3)}`;
  return `${without0.slice(0, 3)} ${without0.slice(3, 6)} ${without0.slice(6)}`;
}

/* ─── TOP NAV ─────────────────────────────────────────────────────────────── */
function TopNav({
  cartCount,
  cartTotal,
  onCartOpen,
}: {
  cartCount: number;
  cartTotal: number;
  onCartOpen: () => void;
}) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: `${BG}ee`,
        backdropFilter: "blur(14px)",
        borderBottom: `1px solid ${BR}`,
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
      }}
    >
      <img
        src="/logo.png"
        alt="3rd Space"
        style={{ height: 34, width: "auto", objectFit: "contain" }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
      <button
        onClick={onCartOpen}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: cartCount > 0 ? G : CARD,
          border: `1px solid ${cartCount > 0 ? G : BR}`,
          borderRadius: 999,
          padding: "7px 14px",
          cursor: "pointer",
          transition: "all .2s",
          color: cartCount > 0 ? BG : C,
        }}
      >
        <ShoppingCart size={15} />
        {cartCount > 0 ? (
          <>
            <span style={{ fontSize: 13, fontWeight: 700 }}>{cartCount}</span>
            <span style={{ fontSize: 13, fontWeight: 700 }}>
              · ₱{cartTotal.toFixed(0)}
            </span>
          </>
        ) : (
          <span
            style={{
              fontSize: 12,
              letterSpacing: ".06em",
              fontFamily: "'Cinzel',serif",
            }}
          >
            CART
          </span>
        )}
      </button>
    </header>
  );
}

function PlainHeader({ label }: { label: string }) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: `${BG}ee`,
        backdropFilter: "blur(14px)",
        borderBottom: `1px solid ${BR}`,
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
      }}
    >
      <img
        src="/logo.png"
        alt="3rd Space"
        style={{ height: 34, objectFit: "contain" }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
      <span
        style={{
          fontFamily: "'Cinzel',serif",
          fontSize: 12,
          letterSpacing: ".18em",
          color: CM,
        }}
      >
        {label}
      </span>
    </header>
  );
}

function SubBar({
  onClick,
  label = "Back",
}: {
  onClick: () => void;
  label?: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 16px 6px",
      }}
    >
      <button
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          color: hov ? G : CM,
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 11,
          letterSpacing: ".1em",
          fontFamily: "'Cinzel',serif",
          padding: 0,
          transition: "color .18s",
        }}
      >
        <ChevronLeft size={13} />
        {label.toUpperCase()}
      </button>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        color: CM,
        fontSize: 10,
        letterSpacing: ".14em",
        marginBottom: 10,
        fontFamily: "'Cinzel',serif",
      }}
    >
      {children as string}
    </p>
  );
}

/* ─── MODE SELECT ─────────────────────────────────────────────────────────── */
function ModeCard({ emoji, title, sub, onClick }: any) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? GD : CARD,
        border: `1.5px solid ${hov ? G : BR}`,
        borderRadius: 20,
        padding: "38px 20px",
        cursor: "pointer",
        textAlign: "center",
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov ? "0 12px 40px rgba(212,168,67,.12)" : "none",
        transition: "all .22s ease",
        outline: "none",
      }}
    >
      <div style={{ fontSize: 46, marginBottom: 14, lineHeight: 1 }}>
        {emoji}
      </div>
      <div
        style={{
          fontFamily: "'Cinzel',serif",
          fontSize: 19,
          fontWeight: 700,
          letterSpacing: ".15em",
          color: hov ? G : C,
          marginBottom: 8,
          transition: "color .22s",
        }}
      >
        {title}
      </div>
      <div style={{ color: CM, fontSize: 12 }}>{sub}</div>
    </button>
  );
}

function ModeSelectScreen({ onSelect }: { onSelect: (m: OrderType) => void }) {
  return (
    <div
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        background: `radial-gradient(ellipse at 55% 20%, rgba(212,168,67,.08) 0%, transparent 60%), ${BG}`,
      }}
    >
      <img
        src="/logo.png"
        alt="3rd Space"
        style={{ height: 104, objectFit: "contain", marginBottom: 24 }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
      <div
        style={{
          width: 50,
          height: 1,
          background: `linear-gradient(90deg,transparent,${G},transparent)`,
          margin: "0 auto 14px",
        }}
      />
      <p
        style={{
          color: CM,
          fontSize: 13,
          letterSpacing: ".1em",
          marginBottom: 28,
          fontFamily: "'Cinzel',serif",
        }}
      >
        HOW WOULD YOU LIKE TO ORDER?
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 14,
          width: "100%",
          maxWidth: 520,
          marginBottom: 28,
        }}
      >
        {[
          {
            mode: "dine-in" as OrderType,
            emoji: "🪑",
            title: "DINE IN",
            sub: "Order at your table — pay cash or GCash",
          },
          {
            mode: "delivery" as OrderType,
            emoji: "🛵",
            title: "DELIVERY",
            sub: "Delivered to your door — GCash only",
          },
        ].map(({ mode, emoji, title, sub }) => (
          <ModeCard
            key={mode}
            emoji={emoji}
            title={title}
            sub={sub}
            onClick={() => onSelect(mode)}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: "100%",
          maxWidth: 520,
        }}
      >
        <div style={{ flex: 1, height: 1, background: BR }} />
        <a
          href="/track"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            padding: "9px 20px",
            borderRadius: 999,
            border: `1px solid ${BR}`,
            background: CARD,
            color: CM,
            fontFamily: "'Cinzel',serif",
            fontSize: 11,
            letterSpacing: ".12em",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          📡 TRACK AN EXISTING ORDER
        </a>
        <div style={{ flex: 1, height: 1, background: BR }} />
      </div>
    </div>
  );
}

/* ─── SMALL HELPERS ───────────────────────────────────────────────────────── */
function Btn32({ children, onClick, gold }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 28,
        height: 28,
        borderRadius: 999,
        border: "none",
        background: gold ? G : "transparent",
        color: gold ? BG : C,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </button>
  );
}

/* ─── MENU CARD ───────────────────────────────────────────────────────────── */
function MenuCard({
  item,
  cartItem,
  onAdd,
  onUpdate,
}: {
  item: MenuItem;
  cartItem?: CartItem;
  onAdd: () => void;
  onUpdate: (q: number) => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: CARD,
        border: `1px solid ${hov ? BRH : BR}`,
        borderRadius: 16,
        overflow: "hidden",
        transition: "all .22s ease",
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: hov ? "0 8px 32px rgba(0,0,0,.35)" : "none",
      }}
    >
      <div
        style={{
          height: 150,
          background: "rgba(212,168,67,.07)",
          overflow: "hidden",
        }}
      >
        <img
          src={item.image}
          alt={item.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform .4s",
            transform: hov ? "scale(1.05)" : "scale(1)",
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
      <div style={{ padding: "13px 15px 15px" }}>
        <p
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: ".04em",
            color: C,
            marginBottom: 4,
          }}
        >
          {item.name}
        </p>
        <p
          style={{
            color: CM,
            fontSize: 11,
            lineHeight: 1.5,
            marginBottom: 13,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.description}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: 17,
              fontWeight: 700,
              color: G,
            }}
          >
            ₱{item.price}
          </span>
          {cartItem ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: "rgba(212,168,67,.12)",
                border: `1px solid ${G}`,
                borderRadius: 999,
                padding: "2px 4px",
              }}
            >
              <Btn32 onClick={() => onUpdate(cartItem.quantity - 1)}>
                <Minus size={12} />
              </Btn32>
              <span
                style={{
                  width: 22,
                  textAlign: "center",
                  color: C,
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                {cartItem.quantity}
              </span>
              <Btn32 gold onClick={() => onUpdate(cartItem.quantity + 1)}>
                <Plus size={12} />
              </Btn32>
            </div>
          ) : (
            <button
              onClick={onAdd}
              style={{
                width: 34,
                height: 34,
                borderRadius: 999,
                border: "none",
                background: G,
                color: BG,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Plus size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── CART DRAWER ─────────────────────────────────────────────────────────── */
function CartDrawer({
  cart,
  open,
  onClose,
  onUpdate,
  onRemove,
  onCheckout,
  cartTotal,
}: any) {
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.55)",
          backdropFilter: "blur(4px)",
          zIndex: 50,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity .25s",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(100vw,400px)",
          background: "#111e11",
          borderLeft: `1px solid ${BR}`,
          zIndex: 51,
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform .3s cubic-bezier(.4,0,.2,1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "18px 18px 14px",
            borderBottom: `1px solid ${BR}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ShoppingCart size={18} color={G} />
            <span
              style={{
                fontFamily: "'Cinzel',serif",
                fontSize: 16,
                letterSpacing: ".15em",
                color: C,
              }}
            >
              YOUR CART
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: CARD,
              border: `1px solid ${BR}`,
              borderRadius: 999,
              width: 30,
              height: 30,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: CM,
            }}
          >
            <X size={14} />
          </button>
        </div>
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: 60, color: CF }}>
              <ShoppingCart
                size={34}
                style={{ margin: "0 auto 12px", opacity: 0.4 }}
              />
              <p style={{ fontSize: 13 }}>Empty cart</p>
            </div>
          ) : (
            cart.map((item: CartItem) => (
              <div
                key={item._id}
                style={{
                  background: CARD,
                  border: `1px solid ${BR}`,
                  borderRadius: 12,
                  padding: 13,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      color: C,
                      fontSize: 13,
                      fontWeight: 600,
                      marginBottom: 2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.name}
                  </p>
                  <p
                    style={{
                      color: G,
                      fontSize: 13,
                      fontFamily: "'Cinzel',serif",
                    }}
                  >
                    ₱{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Btn32 onClick={() => onUpdate(item._id, item.quantity - 1)}>
                    <Minus size={11} />
                  </Btn32>
                  <span
                    style={{
                      width: 20,
                      textAlign: "center",
                      color: C,
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {item.quantity}
                  </span>
                  <Btn32
                    gold
                    onClick={() => onUpdate(item._id, item.quantity + 1)}
                  >
                    <Plus size={11} />
                  </Btn32>
                  <button
                    onClick={() => onRemove(item._id)}
                    style={{
                      marginLeft: 4,
                      width: 26,
                      height: 26,
                      borderRadius: 999,
                      border: "none",
                      background: "rgba(248,113,113,.1)",
                      color: "#f87171",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div style={{ padding: 16, borderTop: `1px solid ${BR}` }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <span style={{ color: CM, fontSize: 13 }}>Total</span>
              <span
                style={{
                  fontFamily: "'Cinzel',serif",
                  fontSize: 20,
                  color: G,
                  fontWeight: 700,
                }}
              >
                ₱{cartTotal.toFixed(2)}
              </span>
            </div>
            <button
              onClick={onCheckout}
              style={{
                width: "100%",
                background: G,
                color: BG,
                border: "none",
                borderRadius: 12,
                padding: "14px",
                fontFamily: "'Cinzel',serif",
                fontSize: 13,
                letterSpacing: ".15em",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        )}
      </div>
    </>
  );
}

/* ─── MENU SCREEN ─────────────────────────────────────────────────────────── */
function MenuScreen({
  menuItems,
  cart,
  onAddToCart,
  onUpdateCart,
  onRemoveFromCart,
  onCheckout,
  onBack,
}: any) {
  const categories = Array.from(
    new Set(menuItems.map((i: MenuItem) => i.category)),
  );
  const [active, setActive] = useState(categories[0] || "");
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    setIsDesktop(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const searchResults =
    search.trim() !== ""
      ? menuItems.filter(
          (i: MenuItem) =>
            i.name.toLowerCase().includes(search.toLowerCase()) ||
            i.description.toLowerCase().includes(search.toLowerCase()),
        )
      : null;
  const filtered = menuItems.filter((i: MenuItem) => i.category === active);
  const displayItems = searchResults ?? filtered;
  const total = cart.reduce(
    (s: number, i: CartItem) => s + i.price * i.quantity,
    0,
  );
  const count = cart.reduce((s: number, i: CartItem) => s + i.quantity, 0);

  return (
    <div
      style={{
        height: "100svh",
        background: BG,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <TopNav
        cartCount={count}
        cartTotal={total}
        onCartOpen={() => setCartOpen(true)}
      />
      <SubBar onClick={onBack} label="Change Mode" />

      {/* Search */}
      <div style={{ padding: "4px 16px 10px", flexShrink: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: CARD,
            border: `1px solid ${searchFocused ? G : BR}`,
            borderRadius: 10,
            padding: "8px 12px",
            transition: "border-color .18s",
          }}
        >
          <Search
            size={14}
            color={searchFocused ? G : CM}
            style={{ flexShrink: 0 }}
          />
          <input
            type="text"
            placeholder="Search menu…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: C,
              fontSize: 13,
              fontFamily: "inherit",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: CM,
                display: "flex",
                alignItems: "center",
              }}
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Body: sidebar + grid */}
      <div
        style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}
      >
        {/* Desktop sidebar */}
        {isDesktop && !searchResults && (
          <aside
            style={{
              width: 160,
              flexShrink: 0,
              borderRight: `1px solid ${BR}`,
              overflowY: "auto",
              padding: "14px 10px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
              scrollbarWidth: "none",
            }}
          >
            <p
              style={{
                color: CF,
                fontSize: 9,
                letterSpacing: ".16em",
                fontFamily: "'Cinzel',serif",
                padding: "0 8px 10px",
              }}
            >
              CATEGORIES
            </p>
            {(categories as string[]).map((cat) => {
              const a = active === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  style={{
                    textAlign: "left",
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: `1px solid ${a ? G : "transparent"}`,
                    background: a ? GD : "transparent",
                    color: a ? G : CM,
                    fontFamily: "'Cinzel',serif",
                    fontSize: 11,
                    letterSpacing: ".08em",
                    cursor: "pointer",
                    transition: "all .18s",
                    fontWeight: a ? 700 : 400,
                    lineHeight: 1.4,
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </aside>
        )}

        {/* Mobile tabs + grid wrapper */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          {!isDesktop && !searchResults && (
            <div
              style={{
                display: "flex",
                gap: 8,
                overflowX: "auto",
                padding: "0 16px 10px",
                borderBottom: `1px solid ${BR}`,
                scrollbarWidth: "none",
                flexShrink: 0,
              }}
            >
              {(categories as string[]).map((cat) => {
                const a = active === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActive(cat)}
                    style={{
                      whiteSpace: "nowrap",
                      padding: "7px 18px",
                      borderRadius: 999,
                      border: `1px solid ${a ? G : BR}`,
                      background: a ? G : "transparent",
                      color: a ? BG : CM,
                      fontFamily: "'Cinzel',serif",
                      fontSize: 11,
                      letterSpacing: ".1em",
                      cursor: "pointer",
                      transition: "all .18s",
                      fontWeight: a ? 700 : 400,
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}

          {/* Scrollable grid */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: isDesktop ? "18px 20px 100px" : "14px 16px 100px",
            }}
          >
            {searchResults && (
              <p style={{ color: CM, fontSize: 12, marginBottom: 14 }}>
                {searchResults.length} result
                {searchResults.length !== 1 ? "s" : ""} for "{search}"
              </p>
            )}
            {displayItems.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 300,
                  color: CF,
                  gap: 8,
                }}
              >
                <div style={{ fontSize: 40 }}>🍃</div>
                <p style={{ fontSize: 14 }}>
                  {search ? "No items match your search" : "Nothing here yet"}
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill,minmax(min(100%,260px),1fr))",
                  gap: 14,
                }}
              >
                {displayItems.map((item: MenuItem) => {
                  const ci = cart.find((c: CartItem) => c._id === item._id);
                  return (
                    <MenuCard
                      key={item._id}
                      item={item}
                      cartItem={ci}
                      onAdd={() => onAddToCart(item)}
                      onUpdate={(qty: number) => onUpdateCart(item._id, qty)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky checkout bar */}
      {count > 0 && (
        <div
          style={{
            flexShrink: 0,
            padding: "12px 16px",
            background: `${BG}f2`,
            backdropFilter: "blur(16px)",
            borderTop: `1px solid ${BR}`,
          }}
        >
          <button
            onClick={onCheckout}
            style={{
              width: "100%",
              background: G,
              color: BG,
              border: "none",
              borderRadius: 14,
              padding: "15px",
              fontFamily: "'Cinzel',serif",
              fontSize: 14,
              letterSpacing: ".15em",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                background: "rgba(0,0,0,.15)",
                borderRadius: 999,
                padding: "2px 10px",
                fontSize: 12,
              }}
            >
              {count} item{count !== 1 ? "s" : ""}
            </span>
            <span>CHECKOUT</span>
            <span>₱{total.toFixed(2)}</span>
          </button>
        </div>
      )}

      <CartDrawer
        cart={cart}
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onUpdate={onUpdateCart}
        onRemove={onRemoveFromCart}
        onCheckout={() => {
          setCartOpen(false);
          onCheckout();
        }}
        cartTotal={total}
      />
    </div>
  );
}

/* ─── INPUT FIELD ─────────────────────────────────────────────────────────── */
function InputField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  inputMode,
}: any) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        style={{
          display: "block",
          color: CM,
          fontSize: 10,
          letterSpacing: ".1em",
          marginBottom: 6,
          fontFamily: "'Cinzel',serif",
        }}
      >
        {label.toUpperCase()}
      </label>
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{
          width: "100%",
          background: "rgba(255,255,255,.03)",
          border: `1px solid ${focused ? G : BR}`,
          borderRadius: 8,
          padding: "11px 12px",
          color: C,
          fontSize: 16,
          outline: "none",
          transition: "border-color .18s",
          fontFamily: "inherit",
          boxSizing: "border-box",
          WebkitAppearance: "none" as any,
        }}
      />
    </div>
  );
}

/* ─── DELIVERY ADDRESS PICKER ─────────────────────────────────────────────── */
function DeliveryAddressPicker({
  value,
  onChange,
}: {
  value: any;
  onChange: (v: any) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<any>(null);
  const mapObjRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);
  const [locating, setLocating] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [locError, setLocError] = useState("");
  const [showFields, setShowFields] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const searchTimer = useRef<any>(null);
  const geocodeDebounce = useRef<any>(null);

  const DEFAULT_LAT = 15.4817;
  const DEFAULT_LNG = 120.966;

  const reverseGeocode = useCallback(
    async (lat: number, lng: number) => {
      setGeocoding(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        );
        const data = await res.json();
        const addr = data.address || {};
        onChange({
          ...(value || {}),
          lat,
          lng,
          street: addr.road || addr.pedestrian || "",
          barangay:
            addr.suburb ||
            addr.village ||
            addr.neighbourhood ||
            addr.quarter ||
            "",
          city: addr.city || addr.town || addr.municipality || "",
          province: addr.state || "",
          fullAddress: data.display_name || "",
        });
        setShowFields(true);
      } catch {
        /* silent */
      }
      setGeocoding(false);
    },
    [onChange, value],
  );

  const initMap = useCallback(
    (lat?: number, lng?: number) => {
      if (!mapRef.current || !leafletRef.current) return;
      if (mapObjRef.current) return;
      const L = leafletRef.current;
      const startLat = lat ?? (value?.lat || DEFAULT_LAT);
      const startLng = lng ?? (value?.lng || DEFAULT_LNG);

      const map = L.map(mapRef.current, {
        center: [startLat, startLng],
        zoom: 17,
        zoomControl: true,
        attributionControl: false,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      map.on("moveend", () => {
        const c = map.getCenter();
        clearTimeout(geocodeDebounce.current);
        geocodeDebounce.current = setTimeout(
          () => reverseGeocode(c.lat, c.lng),
          600,
        );
      });
      mapObjRef.current = map;
      setMapReady(true);
      if (!value?.lat) reverseGeocode(startLat, startLng);
    },
    [value, reverseGeocode],
  );

  useEffect(() => {
    if ((window as any).L) {
      leafletRef.current = (window as any).L;
      initMap();
      return;
    }
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(css);
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
      leafletRef.current = (window as any).L;
      initMap();
    };
    document.head.appendChild(script);
    return () => {
      if (mapObjRef.current) {
        mapObjRef.current.remove();
        mapObjRef.current = null;
      }
    };
  }, []);

  const locateMe = useCallback(() => {
    if (!navigator.geolocation) {
      setLocError("Geolocation not supported.");
      return;
    }
    setLocating(true);
    setLocError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setLocating(false);
        if (mapObjRef.current)
          mapObjRef.current.flyTo([lat, lng], 18, { duration: 1.2 });
        else if (leafletRef.current) initMap(lat, lng);
      },
      (err) => {
        setLocating(false);
        if (err.code === 1)
          setLocError("Location denied. Drag the map to your address.");
        else setLocError("Could not get GPS. Drag the map to your address.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, [initMap]);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&countrycodes=ph`,
      );
      setSearchResults(await res.json());
    } catch {
      setSearchResults([]);
    }
    setSearching(false);
  }, []);

  const handleSearchChange = (v: string) => {
    setSearchQuery(v);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => doSearch(v), 500);
  };

  const pickSearchResult = (r: any) => {
    const lat = parseFloat(r.lat),
      lng = parseFloat(r.lon);
    setSearchQuery(r.display_name.split(",").slice(0, 2).join(","));
    setSearchResults([]);
    if (mapObjRef.current)
      mapObjRef.current.flyTo([lat, lng], 17, { duration: 1 });
    else if (leafletRef.current) initMap(lat, lng);
  };

  const sf = (field: string, val: string) =>
    onChange({ ...(value || {}), [field]: val });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Search */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,.04)",
            border: `1px solid ${searchFocused ? G : BR}`,
            borderRadius: 10,
            padding: "9px 12px",
            transition: "border-color .18s",
          }}
        >
          <Search
            size={14}
            color={searchFocused ? G : CM}
            style={{ flexShrink: 0 }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            placeholder="Search for your address or landmark…"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: C,
              fontSize: 14,
              fontFamily: "inherit",
            }}
          />
          {searching && (
            <div
              style={{
                width: 13,
                height: 13,
                border: `2px solid ${G}`,
                borderTopColor: "transparent",
                borderRadius: 999,
                animation: "spin .7s linear infinite",
                flexShrink: 0,
              }}
            />
          )}
          {searchQuery && !searching && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSearchResults([]);
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: CM,
                display: "flex",
                padding: 0,
              }}
            >
              <X size={13} />
            </button>
          )}
        </div>
        {searchResults.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              right: 0,
              background: "#1a2a1a",
              border: `1px solid ${BR}`,
              borderRadius: 10,
              overflow: "hidden",
              zIndex: 999,
              boxShadow: "0 8px 32px rgba(0,0,0,.5)",
            }}
          >
            {searchResults.map((r, i) => (
              <button
                key={i}
                onClick={() => pickSearchResult(r)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 14px",
                  background: "none",
                  border: "none",
                  borderBottom:
                    i < searchResults.length - 1 ? `1px solid ${BR}` : "none",
                  cursor: "pointer",
                  color: CM,
                  fontSize: 12,
                  lineHeight: 1.4,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                }}
              >
                <MapPin
                  size={12}
                  color={G}
                  style={{ flexShrink: 0, marginTop: 2 }}
                />
                <span
                  style={{
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {r.display_name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* GPS button */}
      <button
        onClick={locateMe}
        disabled={locating}
        style={{
          width: "100%",
          padding: "11px 16px",
          background: locating ? "rgba(212,168,67,.1)" : GD,
          border: `1.5px solid ${G}`,
          borderRadius: 10,
          color: G,
          cursor: locating ? "wait" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          fontFamily: "'Cinzel',serif",
          fontSize: 12,
          letterSpacing: ".08em",
          fontWeight: 700,
          transition: "all .2s",
        }}
      >
        <Navigation
          size={14}
          style={{ animation: locating ? "spin 1s linear infinite" : "none" }}
        />
        {locating ? "GETTING LOCATION…" : "USE MY CURRENT LOCATION"}
      </button>

      {locError && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            background: "rgba(248,113,113,.08)",
            border: "1px solid rgba(248,113,113,.2)",
            borderRadius: 10,
            padding: "9px 12px",
          }}
        >
          <AlertCircle
            size={13}
            color={ERR}
            style={{ flexShrink: 0, marginTop: 1 }}
          />
          <span style={{ color: ERR, fontSize: 12, lineHeight: 1.5 }}>
            {locError}
          </span>
        </div>
      )}

      {/* Map — pin fixed center, map drags */}
      <div
        style={{
          position: "relative",
          borderRadius: 14,
          overflow: "hidden",
          border: `1px solid ${BR}`,
          height: 220,
        }}
      >
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
        {/* Fixed center pin */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -100%)",
            zIndex: 999,
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              background: G,
              borderRadius: "50% 50% 50% 0",
              transform: "rotate(-45deg)",
              boxShadow: "0 4px 16px rgba(212,168,67,.5)",
              border: "3px solid white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                transform: "rotate(45deg)",
                width: 8,
                height: 8,
                background: "white",
                borderRadius: 999,
              }}
            />
          </div>
          <div
            style={{
              width: 8,
              height: 8,
              background: "rgba(212,168,67,.4)",
              borderRadius: 999,
              marginTop: 2,
            }}
          />
        </div>
        {/* Geocoding overlay */}
        {geocoding && (
          <div
            style={{
              position: "absolute",
              bottom: 8,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(14,25,14,.85)",
              backdropFilter: "blur(6px)",
              borderRadius: 999,
              padding: "5px 14px",
              display: "flex",
              alignItems: "center",
              gap: 7,
              zIndex: 998,
            }}
          >
            <div
              style={{
                width: 11,
                height: 11,
                border: `2px solid ${G}`,
                borderTopColor: "transparent",
                borderRadius: 999,
                animation: "spin .7s linear infinite",
              }}
            />
            <span style={{ color: CM, fontSize: 11 }}>Finding address…</span>
          </div>
        )}
        {/* Drag hint */}
        {mapReady && !geocoding && (
          <div
            style={{
              position: "absolute",
              top: 8,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(14,25,14,.82)",
              backdropFilter: "blur(6px)",
              borderRadius: 999,
              padding: "4px 12px",
              zIndex: 998,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: CM, fontSize: 10, letterSpacing: ".05em" }}>
              Drag map · pin stays centered
            </span>
          </div>
        )}
      </div>

      {/* Address preview */}
      {value?.fullAddress && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            background: "rgba(212,168,67,.07)",
            border: `1px solid ${BR}`,
            borderRadius: 10,
            padding: "9px 12px",
          }}
        >
          <MapPin size={13} color={G} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ color: CM, fontSize: 12, lineHeight: 1.4, flex: 1 }}>
            {value.fullAddress}
          </span>
        </div>
      )}

      {/* Editable fields */}
      {showFields && (
        <>
          <p
            style={{
              color: CM,
              fontSize: 10,
              letterSpacing: ".12em",
              fontFamily: "'Cinzel',serif",
              marginTop: 4,
            }}
          >
            CONFIRM / EDIT YOUR ADDRESS
          </p>
          <InputField
            label="House No. / Unit / Floor *"
            placeholder="e.g. Unit 3B, 123"
            value={value?.houseNo || ""}
            onChange={(v: string) => sf("houseNo", v)}
          />
          <InputField
            label="Street *"
            placeholder="e.g. Felipe Vergara Hi-Way"
            value={value?.street || ""}
            onChange={(v: string) => sf("street", v)}
          />
          <InputField
            label="Barangay *"
            placeholder="e.g. Brgy. Aduas Norte"
            value={value?.barangay || ""}
            onChange={(v: string) => sf("barangay", v)}
          />
          <InputField
            label="City / Municipality *"
            placeholder="e.g. Cabanatuan City"
            value={value?.city || ""}
            onChange={(v: string) => sf("city", v)}
          />
          <InputField
            label="Landmark / Note to rider (optional)"
            placeholder="e.g. Near Jollibee, green gate"
            value={value?.landmark || ""}
            onChange={(v: string) => sf("landmark", v)}
          />
        </>
      )}
      {!showFields && (
        <button
          onClick={() => setShowFields(true)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: CM,
            fontSize: 12,
            textDecoration: "underline",
            textUnderlineOffset: 3,
          }}
        >
          Enter address manually instead
        </button>
      )}
    </div>
  );
}

/* ─── CHECKOUT SCREEN ─────────────────────────────────────────────────────── */
function CheckoutScreen({
  cart,
  orderType,
  form,
  onFormChange,
  onNext,
  onBack,
}: {
  cart: CartItem[];
  orderType: OrderType;
  form: any;
  onFormChange: (f: string, v: any) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const [phoneTouched, setPhoneTouched] = useState(false);

  const handlePhone = (raw: string) => {
    const digits = normalizePHPhone(raw);
    onFormChange("customerContact", digits);
  };

  const storedPhone = form.customerContact || "";
  const phoneDisplay = formatPHPhoneDisplay(storedPhone);
  const phoneValid = isValidPHPhone(storedPhone);
  const phoneError = phoneTouched && storedPhone.length > 0 && !phoneValid;

  const addrComplete =
    orderType === "delivery"
      ? (form.deliveryAddress?.houseNo || "").trim() &&
        (form.deliveryAddress?.street || "").trim() &&
        (form.deliveryAddress?.barangay || "").trim() &&
        (form.deliveryAddress?.city || "").trim()
      : true;

  const valid =
    orderType === "dine-in"
      ? (form.tableNumber || "").trim()
      : (form.customerName || "").trim() && phoneValid && addrComplete;

  return (
    <div
      style={{
        height: "100svh",
        background: BG,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <PlainHeader label={orderType === "dine-in" ? "DINE IN" : "DELIVERY"} />
      <SubBar onClick={onBack} label="Back to Menu" />
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 32px" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          {/* Compact order summary */}
          <SectionTitle>Order Summary</SectionTitle>
          <div
            style={{
              background: CARD,
              border: `1px solid ${BR}`,
              borderRadius: 14,
              padding: "14px 16px",
              marginBottom: 16,
            }}
          >
            {cart.map((item) => (
              <div
                key={item._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                  gap: 12,
                }}
              >
                <span
                  style={{
                    color: CM,
                    fontSize: 13,
                    flex: 1,
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.name}{" "}
                  <span style={{ color: CF, fontSize: 12 }}>
                    ×{item.quantity}
                  </span>
                </span>
                <span
                  style={{
                    color: C,
                    fontSize: 13,
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  ₱{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div style={{ height: 1, background: BR, margin: "10px 0" }} />
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
                  color: C,
                  fontSize: 12,
                  letterSpacing: ".08em",
                }}
              >
                TOTAL
              </span>
              <span
                style={{
                  fontFamily: "'Cinzel',serif",
                  color: G,
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                ₱{total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Fields */}
          <SectionTitle>
            {orderType === "dine-in" ? "Table Details" : "Delivery Info"}
          </SectionTitle>
          <div
            style={{
              background: CARD,
              border: `1px solid ${BR}`,
              borderRadius: 14,
              padding: "14px 16px",
              marginBottom: 16,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {orderType === "dine-in" && (
              <>
                <InputField
                  label="Table Number *"
                  placeholder="e.g. Table 5"
                  value={form.tableNumber || ""}
                  onChange={(v: string) => onFormChange("tableNumber", v)}
                />
                <InputField
                  label="Your Name (optional)"
                  placeholder="Juan dela Cruz"
                  value={form.customerName || ""}
                  onChange={(v: string) => onFormChange("customerName", v)}
                />
              </>
            )}
            {orderType === "delivery" && (
              <>
                <InputField
                  label="Full Name *"
                  placeholder="Juan dela Cruz"
                  value={form.customerName || ""}
                  onChange={(v: string) => onFormChange("customerName", v)}
                />
                {/* Phone */}
                <div>
                  <label
                    style={{
                      display: "block",
                      color: CM,
                      fontSize: 10,
                      letterSpacing: ".1em",
                      marginBottom: 6,
                      fontFamily: "'Cinzel',serif",
                    }}
                  >
                    PHONE NUMBER *
                  </label>
                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        left: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        pointerEvents: "none",
                        zIndex: 1,
                      }}
                    >
                      <span style={{ fontSize: 14 }}>🇵🇭</span>
                      <span style={{ color: CM, fontSize: 13 }}>+63</span>
                      <div style={{ width: 1, height: 14, background: BR }} />
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={phoneDisplay}
                      onChange={(e) => handlePhone(e.target.value)}
                      onBlur={() => setPhoneTouched(true)}
                      placeholder="9XX XXX XXXX"
                      style={{
                        width: "100%",
                        background: "rgba(255,255,255,.03)",
                        border: `1px solid ${phoneError ? "rgba(248,113,113,.6)" : phoneValid && phoneTouched ? G : BR}`,
                        borderRadius: 8,
                        padding: "11px 12px 11px 92px",
                        color: C,
                        fontSize: 16,
                        outline: "none",
                        fontFamily: "inherit",
                        boxSizing: "border-box",
                        WebkitAppearance: "none" as any,
                        transition: "border-color .18s",
                      }}
                    />
                    {phoneValid && (
                      <div
                        style={{
                          position: "absolute",
                          right: 12,
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      >
                        <Check size={14} color="#4ade80" />
                      </div>
                    )}
                  </div>
                  {phoneError && (
                    <p style={{ color: ERR, fontSize: 11, marginTop: 5 }}>
                      Enter a valid PH mobile number (e.g. 9561234567 or
                      09561234567)
                    </p>
                  )}
                  {!phoneError && !phoneValid && storedPhone.length > 0 && (
                    <p style={{ color: CM, fontSize: 11, marginTop: 5 }}>
                      Enter 10 digits starting with 9, or 11 digits starting
                      with 09
                    </p>
                  )}
                </div>
                {/* Delivery address */}
                <div>
                  <label
                    style={{
                      display: "block",
                      color: CM,
                      fontSize: 10,
                      letterSpacing: ".1em",
                      marginBottom: 8,
                      fontFamily: "'Cinzel',serif",
                    }}
                  >
                    DELIVERY ADDRESS *
                  </label>
                  <DeliveryAddressPicker
                    value={form.deliveryAddress || {}}
                    onChange={(v) => onFormChange("deliveryAddress", v)}
                  />
                </div>
              </>
            )}
            <InputField
              label="Special Requests (optional)"
              placeholder="Allergies, preferences, extra instructions…"
              value={form.notes || ""}
              onChange={(v: string) => onFormChange("notes", v)}
            />
          </div>

          <button
            onClick={onNext}
            disabled={!valid}
            style={{
              width: "100%",
              background: valid ? G : "rgba(212,168,67,.25)",
              color: valid ? BG : CM,
              border: "none",
              borderRadius: 14,
              padding: "17px 16px",
              fontFamily: "'Cinzel',serif",
              fontSize: 14,
              letterSpacing: ".12em",
              fontWeight: 700,
              cursor: valid ? "pointer" : "not-allowed",
              transition: "all .2s",
              WebkitAppearance: "none" as any,
            }}
          >
            {valid ? "CHOOSE PAYMENT →" : "FILL IN REQUIRED FIELDS"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── PAYMENT SCREEN ──────────────────────────────────────────────────────── */
function PaymentScreen({
  cart,
  orderType,
  paymentMethod,
  onPayMethodChange,
  onReceiptUploaded,
  onConfirm,
  submitting,
  onBack,
  form,
}: {
  cart: CartItem[];
  orderType: OrderType;
  paymentMethod: PayMethod;
  onPayMethodChange: (m: PayMethod) => void;
  onReceiptUploaded: (url: string, key: string) => void;
  onConfirm: () => void;
  submitting: boolean;
  onBack: () => void;
  form: any;
}) {
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const effectiveMethod: PayMethod =
    orderType === "delivery" ? "gcash" : paymentMethod;

  // ⚠️ Replace with your actual GCash number
  const GCASH_NUMBER = "09XX XXX XXXX";
  const GCASH_DIGITS = GCASH_NUMBER.replace(/\s/g, "");
  const gcashDeepLink = `gcash://send?amount=${total.toFixed(2)}&to=${GCASH_DIGITS}`;

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const d = await res.json();
        onReceiptUploaded(d.url, d.key);
        setUploaded(true);
      }
    } catch {
      /* silent */
    } finally {
      setUploading(false);
    }
  };

  const copyNumber = () => {
    navigator.clipboard.writeText(GCASH_DIGITS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Cash and Pay Later skip the screenshot requirement
  const canConfirm =
    effectiveMethod === "cash" ||
    effectiveMethod === "pay-later" ||
    (effectiveMethod === "gcash" && orderType === "dine-in")
      ? true
      : uploaded;

  return (
    <div
      style={{
        height: "100svh",
        background: BG,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <PlainHeader label="PAYMENT" />
      <SubBar onClick={onBack} label="Back to Details" />
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 32px" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          {/* Amount */}
          <div
            style={{
              background: GD,
              border: `2px solid ${G}`,
              borderRadius: 16,
              padding: "16px 20px",
              marginBottom: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <span style={{ color: CM, fontSize: 12, letterSpacing: ".1em" }}>
              AMOUNT DUE
            </span>
            <span
              style={{
                fontFamily: "'Cinzel',serif",
                fontSize: 28,
                fontWeight: 700,
                color: G,
              }}
            >
              ₱{total.toFixed(2)}
            </span>
          </div>

          {/* ── DINE-IN: 3-option payment selector ── */}
          {orderType === "dine-in" && (
            <>
              <SectionTitle>How will you pay?</SectionTitle>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 10,
                  marginBottom: 18,
                }}
              >
                {[
                  {
                    id: "cash" as PayMethod,
                    icon: <Banknote size={20} />,
                    label: "CASH",
                    sub: "Pay at cashier",
                  },
                  {
                    id: "gcash" as PayMethod,
                    icon: <Smartphone size={20} />,
                    label: "GCASH",
                    sub: "Pay via app",
                  },
                  {
                    id: "pay-later" as PayMethod,
                    icon: <HelpCircle size={20} />,
                    label: "DECIDE LATER",
                    sub: "Tell staff when done",
                  },
                ].map((m) => {
                  const a = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => onPayMethodChange(m.id)}
                      style={{
                        padding: "14px 8px",
                        borderRadius: 14,
                        border: `1.5px solid ${a ? G : BR}`,
                        background: a ? GD : CARD,
                        cursor: "pointer",
                        textAlign: "center",
                        transition: "all .18s",
                      }}
                    >
                      <div style={{ color: a ? G : CM, marginBottom: 6 }}>
                        {m.icon}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Cinzel',serif",
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: ".08em",
                          color: a ? G : C,
                          marginBottom: 3,
                          lineHeight: 1.3,
                        }}
                      >
                        {m.label}
                      </div>
                      <div style={{ fontSize: 10, color: CM, lineHeight: 1.3 }}>
                        {m.sub}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Delivery GCash notice */}
          {orderType === "delivery" && (
            <div
              style={{
                background: "rgba(167,139,250,.07)",
                border: "1px solid rgba(167,139,250,.2)",
                borderRadius: 12,
                padding: "10px 14px",
                marginBottom: 16,
                fontSize: 12,
                color: "rgba(200,190,230,.8)",
                lineHeight: 1.6,
              }}
            >
              🛵{" "}
              <strong style={{ color: "#c4b5fd" }}>
                Delivery requires GCash payment.
              </strong>{" "}
              No cash-on-delivery.
            </div>
          )}

          {/* ── CASH ── */}
          {effectiveMethod === "cash" && (
            <>
              <SectionTitle>Your Receipt</SectionTitle>
              <div
                style={{
                  background: CARD,
                  border: `1px solid ${BR}`,
                  borderRadius: 14,
                  overflow: "hidden",
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    background: "rgba(212,168,67,.08)",
                    borderBottom: `1px solid ${BR}`,
                    padding: "12px 16px",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Cinzel',serif",
                      fontSize: 11,
                      letterSpacing: ".2em",
                      color: CM,
                    }}
                  >
                    3RD SPACE COFFEE
                  </p>
                  <p style={{ color: CF, fontSize: 10, marginTop: 3 }}>
                    Submit order → show receipt at cashier to pay
                  </p>
                </div>
                <div style={{ padding: "14px 16px" }}>
                  {form.tableNumber && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <span style={{ color: CM, fontSize: 12 }}>Table</span>
                      <span style={{ color: C, fontSize: 12, fontWeight: 600 }}>
                        {form.tableNumber}
                      </span>
                    </div>
                  )}
                  {form.customerName && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <span style={{ color: CM, fontSize: 12 }}>Name</span>
                      <span style={{ color: C, fontSize: 12, fontWeight: 600 }}>
                        {form.customerName}
                      </span>
                    </div>
                  )}
                  <div
                    style={{ height: 1, background: BR, margin: "10px 0" }}
                  />
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 7,
                        gap: 10,
                      }}
                    >
                      <span
                        style={{
                          color: CM,
                          fontSize: 13,
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        {item.name} ×{item.quantity}
                      </span>
                      <span style={{ color: C, fontSize: 13, flexShrink: 0 }}>
                        ₱{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div
                    style={{ height: 1, background: BR, margin: "10px 0" }}
                  />
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
                        color: C,
                        fontSize: 12,
                        letterSpacing: ".08em",
                      }}
                    >
                      TOTAL
                    </span>
                    <span
                      style={{
                        fontFamily: "'Cinzel',serif",
                        color: G,
                        fontSize: 20,
                        fontWeight: 700,
                      }}
                    >
                      ₱{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onConfirm}
                disabled={submitting}
                style={{
                  width: "100%",
                  background: G,
                  color: BG,
                  border: "none",
                  borderRadius: 14,
                  padding: "17px 16px",
                  fontFamily: "'Cinzel',serif",
                  fontSize: 14,
                  letterSpacing: ".12em",
                  fontWeight: 700,
                  cursor: "pointer",
                  opacity: submitting ? 0.6 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <Receipt size={16} />
                {submitting ? "PLACING ORDER…" : "SUBMIT ORDER → GET RECEIPT"}
              </button>
            </>
          )}

          {/* ── PAY LATER ── */}
          {effectiveMethod === "pay-later" && (
            <>
              <SectionTitle>Pay Later</SectionTitle>
              <div
                style={{
                  background: CARD,
                  border: `1px solid ${BR}`,
                  borderRadius: 14,
                  padding: "18px 16px",
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 999,
                      background: GD,
                      border: `1.5px solid ${G}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <HelpCircle size={18} color={G} />
                  </div>
                  <div>
                    <p
                      style={{
                        color: C,
                        fontSize: 13,
                        fontWeight: 600,
                        marginBottom: 4,
                      }}
                    >
                      No problem — decide when you're done eating.
                    </p>
                    <p style={{ color: CM, fontSize: 12, lineHeight: 1.6 }}>
                      Your order will be placed now. When you're ready to pay,
                      just let the staff know whether you'll pay cash or GCash.
                    </p>
                  </div>
                </div>

                {/* Mini receipt */}
                <div
                  style={{
                    background: "rgba(212,168,67,.05)",
                    border: `1px solid ${BR}`,
                    borderRadius: 10,
                    padding: "12px 14px",
                  }}
                >
                  {form.tableNumber && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 6,
                      }}
                    >
                      <span style={{ color: CM, fontSize: 12 }}>Table</span>
                      <span style={{ color: C, fontSize: 12, fontWeight: 600 }}>
                        {form.tableNumber}
                      </span>
                    </div>
                  )}
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 5,
                        gap: 10,
                      }}
                    >
                      <span style={{ color: CM, fontSize: 12, flex: 1 }}>
                        {item.name} ×{item.quantity}
                      </span>
                      <span style={{ color: C, fontSize: 12, flexShrink: 0 }}>
                        ₱{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div style={{ height: 1, background: BR, margin: "8px 0" }} />
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
                        color: C,
                        fontSize: 11,
                        letterSpacing: ".08em",
                      }}
                    >
                      TOTAL
                    </span>
                    <span
                      style={{
                        fontFamily: "'Cinzel',serif",
                        color: G,
                        fontSize: 18,
                        fontWeight: 700,
                      }}
                    >
                      ₱{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={onConfirm}
                disabled={submitting}
                style={{
                  width: "100%",
                  background: G,
                  color: BG,
                  border: "none",
                  borderRadius: 14,
                  padding: "17px 16px",
                  fontFamily: "'Cinzel',serif",
                  fontSize: 14,
                  letterSpacing: ".12em",
                  fontWeight: 700,
                  cursor: "pointer",
                  opacity: submitting ? 0.6 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <Receipt size={16} />
                {submitting ? "PLACING ORDER…" : "PLACE ORDER → PAY LATER"}
              </button>
            </>
          )}

          {/* ── GCASH ── */}
          {effectiveMethod === "gcash" && (
            <>
              <SectionTitle>GCash Payment</SectionTitle>
              {/* Steps */}
              <div
                style={{
                  background: CARD,
                  border: `1px solid ${BR}`,
                  borderRadius: 14,
                  padding: "14px 16px",
                  marginBottom: 16,
                }}
              >
                {[
                  {
                    n: 1,
                    text: 'Tap "Open GCash App" below — it pre-fills the amount and number for you',
                  },
                  { n: 2, text: "Confirm the payment inside GCash" },
                  { n: 3, text: "Screenshot your GCash success screen" },
                  { n: 4, text: "Come back here and upload the screenshot" },
                ].map((s) => (
                  <div
                    key={s.n}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 999,
                        background: G,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      <span
                        style={{ color: BG, fontSize: 10, fontWeight: 700 }}
                      >
                        {s.n}
                      </span>
                    </div>
                    <span style={{ color: CM, fontSize: 12, lineHeight: 1.5 }}>
                      {s.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Open GCash */}
              <div
                style={{
                  background: CARD,
                  border: `1px solid ${BR}`,
                  borderRadius: 16,
                  padding: "18px 16px",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 14,
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <p
                      style={{
                        color: CM,
                        fontSize: 10,
                        letterSpacing: ".1em",
                        marginBottom: 4,
                      }}
                    >
                      SEND TO
                    </p>
                    <p
                      style={{
                        color: C,
                        fontFamily: "'Cinzel',serif",
                        fontSize: 13,
                        letterSpacing: ".06em",
                        marginBottom: 2,
                      }}
                    >
                      3RD SPACE COFFEE
                    </p>
                    <p
                      style={{
                        fontFamily: "'Cinzel',serif",
                        fontSize: 20,
                        fontWeight: 700,
                        color: G,
                        letterSpacing: ".04em",
                      }}
                    >
                      {GCASH_NUMBER}
                    </p>
                  </div>
                  <button
                    onClick={copyNumber}
                    style={{
                      flexShrink: 0,
                      padding: "8px 14px",
                      background: copied
                        ? "rgba(74,222,128,.15)"
                        : "rgba(212,168,67,.1)",
                      border: `1px solid ${copied ? "#4ade80" : G}`,
                      borderRadius: 10,
                      color: copied ? "#4ade80" : G,
                      fontSize: 11,
                      letterSpacing: ".08em",
                      fontFamily: "'Cinzel',serif",
                      cursor: "pointer",
                      transition: "all .2s",
                    }}
                  >
                    {copied ? "✓ COPIED" : "COPY NO."}
                  </button>
                </div>
                <div
                  style={{
                    background: "rgba(212,168,67,.07)",
                    borderRadius: 10,
                    padding: "10px 14px",
                    marginBottom: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: CM, fontSize: 12 }}>
                    Amount to send
                  </span>
                  <span
                    style={{
                      fontFamily: "'Cinzel',serif",
                      fontSize: 22,
                      fontWeight: 700,
                      color: G,
                    }}
                  >
                    ₱{total.toFixed(2)}
                  </span>
                </div>
                <a
                  href={gcashDeepLink}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    width: "100%",
                    padding: "15px",
                    background: "#0066cc",
                    color: "white",
                    border: "none",
                    borderRadius: 12,
                    fontFamily: "'Cinzel',serif",
                    fontSize: 14,
                    letterSpacing: ".12em",
                    fontWeight: 700,
                    textDecoration: "none",
                    cursor: "pointer",
                    boxShadow: "0 4px 20px rgba(0,102,204,.35)",
                    boxSizing: "border-box",
                  }}
                >
                  <Smartphone size={17} />
                  OPEN GCASH APP
                </a>
                <p
                  style={{
                    color: CF,
                    fontSize: 11,
                    textAlign: "center",
                    marginTop: 8,
                    lineHeight: 1.5,
                  }}
                >
                  If GCash doesn't open automatically, open it manually and send
                  to the number above.
                </p>
              </div>

              {/* Screenshot upload — DELIVERY ONLY */}
              {orderType === "delivery" && (
                <div
                  style={{
                    background: CARD,
                    border: `1px solid ${uploaded ? "rgba(74,222,128,.35)" : BR}`,
                    borderRadius: 16,
                    padding: 18,
                    marginBottom: 18,
                    transition: "border-color .3s",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <p
                      style={{
                        color: CM,
                        fontSize: 11,
                        letterSpacing: ".1em",
                        fontFamily: "'Cinzel',serif",
                      }}
                    >
                      SCREENSHOT UPLOAD <span style={{ color: ERR }}>*</span>
                    </p>
                    {uploaded && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          color: "#4ade80",
                          fontSize: 11,
                        }}
                      >
                        <Check size={12} /> Uploaded
                      </div>
                    )}
                  </div>
                  <p
                    style={{
                      color: CF,
                      fontSize: 12,
                      marginBottom: 14,
                      lineHeight: 1.5,
                    }}
                  >
                    After paying in GCash, screenshot the{" "}
                    <strong style={{ color: CM }}>
                      success/confirmation screen
                    </strong>{" "}
                    and upload it here. Required to verify your payment.
                  </p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    style={{ display: "none" }}
                  />
                  {preview ? (
                    <div>
                      <div style={{ position: "relative" }}>
                        <img
                          src={preview}
                          alt="Receipt"
                          style={{
                            width: "100%",
                            maxHeight: 200,
                            objectFit: "cover",
                            borderRadius: 10,
                            border: `1px solid ${uploaded ? G : BR}`,
                          }}
                        />
                        {uploaded && (
                          <div
                            style={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              background: G,
                              borderRadius: 999,
                              width: 26,
                              height: 26,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Check size={13} color={BG} />
                          </div>
                        )}
                        {uploading && (
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              background: "rgba(14,25,14,.6)",
                              borderRadius: 10,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: G,
                              fontSize: 12,
                              fontFamily: "'Cinzel',serif",
                              letterSpacing: ".1em",
                            }}
                          >
                            UPLOADING…
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => fileRef.current?.click()}
                        style={{
                          marginTop: 8,
                          width: "100%",
                          padding: "8px",
                          background: "transparent",
                          border: `1px dashed ${BR}`,
                          borderRadius: 8,
                          color: CM,
                          fontSize: 11,
                          cursor: "pointer",
                        }}
                      >
                        <Edit3
                          size={11}
                          style={{ marginRight: 5, verticalAlign: "middle" }}
                        />
                        Change Screenshot
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                      style={{
                        width: "100%",
                        padding: "22px 16px",
                        background: "rgba(212,168,67,.05)",
                        border: `2px dashed ${G}`,
                        borderRadius: 12,
                        color: G,
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 8,
                        boxSizing: "border-box",
                      }}
                    >
                      <Upload size={22} />
                      <span
                        style={{
                          fontFamily: "'Cinzel',serif",
                          fontSize: 11,
                          letterSpacing: ".1em",
                        }}
                      >
                        {uploading
                          ? "UPLOADING…"
                          : "TAP TO UPLOAD GCASH SCREENSHOT"}
                      </span>
                      <span style={{ color: CM, fontSize: 11 }}>
                        JPG, PNG accepted
                      </span>
                    </button>
                  )}
                </div>
              )}

              <button
                onClick={onConfirm}
                disabled={submitting || !canConfirm}
                style={{
                  width: "100%",
                  background: canConfirm ? G : "rgba(212,168,67,.25)",
                  color: canConfirm ? BG : CM,
                  border: "none",
                  borderRadius: 14,
                  padding: "17px 16px",
                  fontFamily: "'Cinzel',serif",
                  fontSize: 14,
                  letterSpacing: ".12em",
                  fontWeight: 700,
                  cursor: canConfirm ? "pointer" : "not-allowed",
                  transition: "all .2s",
                }}
              >
                {submitting
                  ? "PLACING ORDER…"
                  : !canConfirm
                    ? "UPLOAD GCASH SCREENSHOT TO CONTINUE"
                    : "CONFIRM & PLACE ORDER"}
              </button>
              {orderType === "delivery" && (
                <p
                  style={{
                    color: CF,
                    fontSize: 11,
                    textAlign: "center",
                    marginTop: 10,
                    lineHeight: 1.6,
                  }}
                >
                  We verify your payment before dispatching your delivery.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── CONFIRMATION ────────────────────────────────────────────────────────── */
function ConfirmationScreen({
  orderNumber,
  orderType,
  paymentMethod,
  form,
  onNewOrder,
}: {
  orderNumber: string;
  orderType: OrderType;
  paymentMethod: PayMethod;
  form: any;
  onNewOrder: () => void;
}) {
  const isCash = paymentMethod === "cash" && orderType === "dine-in";
  const isPayLater = paymentMethod === "pay-later";
  const isDelivery = orderType === "delivery";

  const addrLine = (addr: any) => {
    if (!addr) return "";
    return [addr.houseNo, addr.street, addr.barangay, addr.city, addr.landmark]
      .filter(Boolean)
      .join(", ");
  };

  const headline = isPayLater
    ? "ORDER PLACED!"
    : isCash
      ? "ORDER PLACED!"
      : "ORDER CONFIRMED!";

  const icon =
    isCash || isPayLater ? (
      <Receipt size={34} color={BG} strokeWidth={2} />
    ) : (
      <Check size={34} color={BG} strokeWidth={3} />
    );

  const message = () => {
    if (isPayLater) {
      return (
        <p style={{ color: CM, fontSize: 13, lineHeight: 1.7 }}>
          Your order is in! Just let the staff know when you're ready to pay —
          cash or GCash, your call.
          {form.tableNumber && (
            <>
              {" "}
              Sit tight at{" "}
              <strong style={{ color: C }}>{form.tableNumber}</strong> and we'll
              bring it over.
            </>
          )}
        </p>
      );
    }
    if (isCash) {
      return (
        <p style={{ color: CM, fontSize: 13, lineHeight: 1.7 }}>
          Show Order <strong style={{ color: C }}>#{orderNumber}</strong> to the
          cashier and pay ₱{(form as any)._total}.
          {form.tableNumber &&
            ` Sit back at ${form.tableNumber} — we'll bring it to you.`}
        </p>
      );
    }
    if (isDelivery) {
      return (
        <p style={{ color: CM, fontSize: 13, lineHeight: 1.7 }}>
          Verifying your GCash payment. Delivery to{" "}
          <strong style={{ color: C }}>{addrLine(form.deliveryAddress)}</strong>
          . We'll call{" "}
          <strong style={{ color: C }}>
            +63 {formatPHPhoneDisplay(form.customerContact)}
          </strong>
          .
        </p>
      );
    }
    // dine-in GCash
    return (
      <p style={{ color: CM, fontSize: 13, lineHeight: 1.7 }}>
        GCash payment received — verifying now.
        {form.tableNumber && (
          <>
            {" "}
            We'll bring your order to{" "}
            <strong style={{ color: C }}>{form.tableNumber}</strong>.
          </>
        )}
      </p>
    );
  };

  return (
    <div
      style={{
        minHeight: "100svh",
        background: `radial-gradient(ellipse at 50% 25%, rgba(212,168,67,.1) 0%, transparent 60%), ${BG}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 76,
          height: 76,
          borderRadius: 999,
          background: G,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          boxShadow: "0 0 48px rgba(212,168,67,.4)",
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontFamily: "'Cinzel',serif",
          fontSize: "clamp(1.5rem,5vw,2.4rem)",
          fontWeight: 700,
          letterSpacing: ".15em",
          color: C,
          marginBottom: 8,
        }}
      >
        {headline}
      </div>
      <div
        style={{
          width: 44,
          height: 1,
          background: `linear-gradient(90deg,transparent,${G},transparent)`,
          margin: "0 auto 24px",
        }}
      />
      <div
        style={{
          background: CARD,
          border: `2px solid ${G}`,
          borderRadius: 18,
          padding: "22px 36px",
          marginBottom: 22,
          minWidth: "min(100%,300px)",
        }}
      >
        <p
          style={{
            color: CM,
            fontSize: 11,
            letterSpacing: ".15em",
            marginBottom: 10,
          }}
        >
          ORDER NUMBER
        </p>
        <p
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: "clamp(1.4rem,6vw,2.4rem)",
            fontWeight: 700,
            color: G,
            letterSpacing: ".05em",
            wordBreak: "break-all",
          }}
        >
          #{orderNumber}
        </p>
      </div>
      <div
        style={{
          background: CARD,
          border: `1px solid ${BR}`,
          borderRadius: 14,
          padding: "16px 18px",
          marginBottom: 26,
          maxWidth: 380,
          width: "100%",
          textAlign: "left",
        }}
      >
        {message()}
      </div>

      {/* Buttons — Track Order only for delivery */}
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          justifyContent: "center",
          width: "100%",
          maxWidth: 380,
        }}
      >
        {isDelivery && (
          <a
            href={`/track?id=${orderNumber}`}
            style={{
              flex: 1,
              minWidth: 140,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "14px 20px",
              background: "transparent",
              color: G,
              border: `1.5px solid ${G}`,
              borderRadius: 12,
              fontFamily: "'Cinzel',serif",
              fontSize: 13,
              letterSpacing: ".1em",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            <Clock size={14} />
            TRACK ORDER
          </a>
        )}
        <button
          onClick={onNewOrder}
          style={{
            flex: 1,
            minWidth: 140,
            background: G,
            color: BG,
            border: "none",
            borderRadius: 12,
            padding: "14px 20px",
            fontFamily: "'Cinzel',serif",
            fontSize: 13,
            letterSpacing: ".1em",
            fontWeight: 700,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          NEW ORDER <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

/* ─── ROOT ────────────────────────────────────────────────────────────────── */
export default function OrderPage() {
  const [step, setStep] = useState<Step>("mode-select");
  const [orderType, setOrderType] = useState<OrderType>("dine-in");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PayMethod>("pay-later");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [receiptKey, setReceiptKey] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<Order | null>(null);
  const [form, setForm] = useState<any>({
    customerName: "",
    customerContact: "",
    deliveryAddress: {},
    tableNumber: "",
    notes: "",
  });

  useEffect(() => {
    fetchMenu();
  }, []);
  async function fetchMenu() {
    try {
      const r = await fetch("/api/menu");
      setMenuItems(await r.json());
    } catch (e) {
      console.error(e);
    }
  }
  function addToCart(item: MenuItem) {
    setCart((p) => {
      const ex = p.find((c) => c._id === item._id);
      if (ex)
        return p.map((c) =>
          c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c,
        );
      return [...p, { ...item, quantity: 1 }];
    });
  }
  function updateCart(id: string, qty: number) {
    if (qty <= 0) setCart((p) => p.filter((c) => c._id !== id));
    else
      setCart((p) =>
        p.map((c) => (c._id === id ? { ...c, quantity: qty } : c)),
      );
  }
  function changeForm(f: string, v: any) {
    setForm((p: any) => ({ ...p, [f]: v }));
  }

  async function submitOrder() {
    try {
      setSubmitting(true);
      const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
      const eff: PayMethod = orderType === "delivery" ? "gcash" : paymentMethod;
      const addr = form.deliveryAddress || {};
      const addrStr = [
        addr.houseNo,
        addr.street,
        addr.barangay,
        addr.city,
        addr.landmark,
      ]
        .filter(Boolean)
        .join(", ");
      const payload: any = {
        type: orderType,
        items: cart.map((i) => ({
          id: i._id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        total,
        notes: form.notes || undefined,
        paymentMethod: eff === "pay-later" ? "pending" : eff,
      };
      if (orderType === "delivery") {
        Object.assign(payload, {
          customerName: form.customerName,
          customerContact: form.customerContact,
          deliveryAddress: addrStr,
          deliveryAddressDetails: form.deliveryAddress,
          receiptUrl,
          receiptKey,
        });
      } else {
        payload.tableNumber = form.tableNumber;
        if (form.customerName) payload.customerName = form.customerName;
        if (eff === "gcash") {
          payload.receiptUrl = receiptUrl;
          payload.receiptKey = receiptKey;
        }
      }
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Order failed");
      const data = await res.json();
      setForm((p: any) => ({ ...p, _total: total.toFixed(2) }));
      setConfirmed({ orderNumber: data.orderNumber, type: orderType });
      setStep("confirmed");
      setCart([]);
      setReceiptUrl("");
      setReceiptKey("");
    } catch (e: any) {
      alert(e.message || "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function back() {
    const map: Record<Step, Step> = {
      payment: "checkout",
      checkout: "menu",
      menu: "mode-select",
      "mode-select": "mode-select",
      confirmed: "mode-select",
    };
    setStep(map[step]);
  }
  function reset() {
    setStep("mode-select");
    setOrderType("dine-in");
    setCart([]);
    setReceiptUrl("");
    setReceiptKey("");
    // Default back to pay-later for dine-in convenience
    setPaymentMethod("pay-later");
    setForm({
      customerName: "",
      customerContact: "",
      deliveryAddress: {},
      tableNumber: "",
      notes: "",
    });
    setConfirmed(null);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; overflow: hidden; background: ${BG}; }
        input::placeholder, textarea::placeholder { color: ${CF}; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${BR}; border-radius: 99px; }
        input[type="text"], input[type="tel"], textarea { -webkit-appearance: none; font-size: 16px !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      {step === "mode-select" && (
        <ModeSelectScreen
          onSelect={(m) => {
            setOrderType(m);
            // Delivery always starts on gcash; dine-in defaults to pay-later
            setPaymentMethod(m === "delivery" ? "gcash" : "pay-later");
            setStep("menu");
          }}
        />
      )}
      {step === "menu" && (
        <MenuScreen
          menuItems={menuItems}
          cart={cart}
          onAddToCart={addToCart}
          onUpdateCart={updateCart}
          onRemoveFromCart={(id: string) => updateCart(id, 0)}
          onCheckout={() => setStep("checkout")}
          onBack={back}
        />
      )}
      {step === "checkout" && (
        <CheckoutScreen
          cart={cart}
          orderType={orderType}
          form={form}
          onFormChange={changeForm}
          onNext={() => setStep("payment")}
          onBack={back}
        />
      )}
      {step === "payment" && (
        <PaymentScreen
          cart={cart}
          orderType={orderType}
          paymentMethod={paymentMethod}
          onPayMethodChange={setPaymentMethod}
          onReceiptUploaded={(url, key) => {
            setReceiptUrl(url);
            setReceiptKey(key);
          }}
          onConfirm={submitOrder}
          submitting={submitting}
          onBack={back}
          form={form}
        />
      )}
      {step === "confirmed" && confirmed && (
        <ConfirmationScreen
          orderNumber={confirmed.orderNumber}
          orderType={confirmed.type}
          paymentMethod={orderType === "delivery" ? "gcash" : paymentMethod}
          form={form}
          onNewOrder={reset}
        />
      )}
    </>
  );
}
