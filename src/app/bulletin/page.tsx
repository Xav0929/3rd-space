"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

const YK = "'Yanone Kaffeesatz', sans-serif";
const DM = "'DM Sans', sans-serif";
const BG = "#0b150b";
const BOARD = "#0f1a0f";
const GOLD = "#e8d5a3";
const GOLD_DIM = "rgba(232,213,163,0.55)";
const GOLD_FAINT = "rgba(232,213,163,0.08)";
const ACCENT = "#d4a843";
const ACCENT_DIM = "rgba(212,168,67,0.18)";
const BR = "rgba(232,213,163,0.1)";
const BR_MED = "rgba(232,213,163,0.18)";
const SITE_PADDING = "clamp(1.5rem, 5vw, 4rem)";
const MAX_WIDTH = 1280;

// ── Types ─────────────────────────────────────────────────────────────────────

type Tag = "PROMO" | "EVENT" | "UPDATE" | "PINNED";
type PinColor = "gold" | "red" | "teal";

interface Post {
  id: number;
  tag: Tag;
  pinned?: boolean;
  pinColor?: PinColor;
  date: string;
  title: string;
  body: string;
  image?: string;
  tilt?: number; // degrees, subtle card tilt
  size?: "sm" | "md" | "lg";
}

interface Partner {
  id: number;
  name: string;
  description: string;
  fbHref: string;
  emoji: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    tag: "PINNED",
    pinned: true,
    pinColor: "gold",
    date: "June 2025",
    title: "We're Now Open Until Midnight 🌙",
    body: "3rd Space is extending hours to 12am every day. Come wind down, work late, or just hang.",
    tilt: -1.2,
    size: "lg",
  },
  {
    id: 2,
    tag: "PROMO",
    pinColor: "red",
    date: "June 2025",
    title: "Buy 2 Get 1 Pastillas — Every Friday",
    body: "Every Friday, grab any two pastillas from our pastry shelf and the third one's on us. Valid until supplies last.",
    tilt: 0.8,
    size: "md",
  },
  {
    id: 3,
    tag: "EVENT",
    pinColor: "teal",
    date: "July 2025",
    title: "Open Mic Night",
    body: "Bring your guitar, your poems, your voice. We'll provide the crowd and the coffee. Signups open at 7pm. Last Saturday of the month.",
    tilt: -0.6,
    size: "md",
  },
  {
    id: 4,
    tag: "UPDATE",
    pinColor: "gold",
    date: "May 2025",
    title: "New Drinks on the Menu",
    body: "We've added Brown Sugar Oat Latte, Mango Matcha, and Ube Cold Brew. Come try 'em while they last.",
    tilt: 1.1,
    size: "sm",
  },
];

const partners: Partner[] = [
  {
    id: 1,
    name: "Chollibay",
    description:
      "Local homegrown eats & street bites. Check their page for daily specials and collab menus with 3rd Space.",
    fbHref: "https://facebook.com",
    emoji: "🍢",
  },
  {
    id: 2,
    name: "Pastillas ni Lola",
    description:
      "Handmade pastillas straight from the province. Sold exclusively at 3rd Space every weekend.",
    fbHref: "https://facebook.com",
    emoji: "🍬",
  },
  {
    id: 3,
    name: "Brain Fuel Co.",
    description:
      "Productivity tools, planners & merch for students and creatives. Look for their pop-up at our café.",
    fbHref: "https://facebook.com",
    emoji: "🧠",
  },
];

// ── Tag config ────────────────────────────────────────────────────────────────

const TAG_STYLES: Record<Tag, { bg: string; color: string; label: string }> = {
  PINNED: { bg: ACCENT, color: BG, label: "📌 PINNED" },
  PROMO: { bg: ACCENT_DIM, color: ACCENT, label: "✦ PROMO" },
  EVENT: { bg: "rgba(100,180,120,0.14)", color: "#7ecb93", label: "◉ EVENT" },
  UPDATE: { bg: GOLD_FAINT, color: GOLD_DIM, label: "↑ UPDATE" },
};

const PIN_COLORS: Record<PinColor, string> = {
  gold: "#d4a843",
  red: "#c0504d",
  teal: "#4caf8a",
};

// ── Admin password (simple client-side guard — swap for real auth later) ──────
const ADMIN_PASS = "3rdspace";

// ── Sub-components ────────────────────────────────────────────────────────────

function PinDot({ color = "gold" }: { color?: PinColor }) {
  const c = PIN_COLORS[color];
  return (
    <div
      style={{
        position: "absolute",
        top: -10,
        left: "50%",
        transform: "translateX(-50%)",
        width: 18,
        height: 18,
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 30%, #fff8, transparent 60%), ${c}`,
        boxShadow: `0 2px 6px rgba(0,0,0,0.55), 0 0 0 2px rgba(0,0,0,0.25)`,
        zIndex: 2,
        flexShrink: 0,
      }}
    />
  );
}

function PostCard({
  post,
  onDelete,
  isAdmin,
}: {
  post: Post;
  onDelete?: (id: number) => void;
  isAdmin: boolean;
}) {
  const tag = TAG_STYLES[post.tag];
  const tilt = post.tilt ?? 0;

  const fontSizeTitle =
    post.size === "lg"
      ? "clamp(1.25rem, 2.8vw, 1.9rem)"
      : post.size === "sm"
        ? "clamp(0.95rem, 1.8vw, 1.2rem)"
        : "clamp(1.05rem, 2.2vw, 1.5rem)";

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        background: post.pinned
          ? "linear-gradient(160deg, rgba(212,168,67,0.07) 0%, rgba(15,26,15,0.98) 60%)"
          : "rgba(15,26,15,0.97)",
        border: `1px solid ${post.pinned ? "rgba(212,168,67,0.28)" : BR}`,
        padding: "clamp(1.2rem, 2.5vw, 1.6rem)",
        paddingTop: "clamp(1.6rem, 3vw, 2rem)",
        transform: `rotate(${tilt}deg)`,
        transition:
          "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.2s",
        boxShadow: `0 4px 24px rgba(0,0,0,0.45), 0 1px 0 rgba(232,213,163,0.05) inset`,
        cursor: "default",
        breakInside: "avoid",
        marginBottom: "clamp(0.75rem, 2vw, 1.25rem)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "rotate(0deg) translateY(-3px)";
        el.style.boxShadow =
          "0 12px 40px rgba(0,0,0,0.6), 0 1px 0 rgba(232,213,163,0.08) inset";
        el.style.borderColor = post.pinned ? "rgba(212,168,67,0.5)" : BR_MED;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = `rotate(${tilt}deg)`;
        el.style.boxShadow =
          "0 4px 24px rgba(0,0,0,0.45), 0 1px 0 rgba(232,213,163,0.05) inset";
        el.style.borderColor = post.pinned ? "rgba(212,168,67,0.28)" : BR;
      }}
    >
      <PinDot color={post.pinColor ?? "gold"} />

      {post.image && (
        <div
          style={{
            margin: "0 -clamp(1.2rem, 2.5vw, 1.6rem) 0.75rem",
            marginTop: "-clamp(1.6rem, 3vw, 2rem)",
            overflow: "hidden",
            borderBottom: `1px solid ${BR}`,
          }}
        >
          <img
            src={post.image}
            alt={post.title}
            style={{
              width: "100%",
              display: "block",
              objectFit: "cover",
              maxHeight: 180,
            }}
          />
        </div>
      )}

      {/* Tag + date row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "0.6rem",
          gap: 8,
        }}
      >
        <span
          style={{
            fontFamily: YK,
            fontWeight: 700,
            fontSize: "clamp(0.58rem, 0.9vw, 0.68rem)",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            padding: "3px 10px",
            background: tag.bg,
            color: tag.color,
            whiteSpace: "nowrap",
          }}
        >
          {tag.label}
        </span>
        <span
          style={{
            fontFamily: DM,
            fontSize: "clamp(0.6rem, 0.9vw, 0.68rem)",
            color: "rgba(232,213,163,0.28)",
            letterSpacing: "0.06em",
          }}
        >
          {post.date}
        </span>
      </div>

      <h3
        style={{
          fontFamily: YK,
          fontWeight: 700,
          fontSize: fontSizeTitle,
          color: GOLD,
          letterSpacing: "0.03em",
          lineHeight: 1.15,
          margin: "0 0 0.55rem",
        }}
      >
        {post.title}
      </h3>

      <p
        style={{
          fontFamily: DM,
          fontSize: "clamp(0.78rem, 1.2vw, 0.875rem)",
          color: GOLD_DIM,
          lineHeight: 1.65,
          margin: 0,
          flex: 1,
        }}
      >
        {post.body}
      </p>

      {/* Admin delete */}
      {isAdmin && onDelete && (
        <button
          onClick={() => onDelete(post.id)}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "rgba(192,80,77,0.1)",
            border: "1px solid rgba(192,80,77,0.25)",
            color: "#c0504d",
            width: 26,
            height: 26,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 13,
            borderRadius: 2,
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.background =
              "rgba(192,80,77,0.22)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.background =
              "rgba(192,80,77,0.1)")
          }
          title="Delete post"
        >
          ✕
        </button>
      )}
    </div>
  );
}

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <div
      style={{
        border: `1px solid ${BR}`,
        padding: "clamp(1.1rem, 2.2vw, 1.5rem)",
        display: "flex",
        gap: "1rem",
        alignItems: "flex-start",
        background: "rgba(232,213,163,0.02)",
        transition: "border-color 0.2s, background 0.2s",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = BR_MED;
        el.style.background = "rgba(232,213,163,0.05)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = BR;
        el.style.background = "rgba(232,213,163,0.02)";
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          background: ACCENT_DIM,
          border: `1px solid rgba(212,168,67,0.2)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          flexShrink: 0,
        }}
      >
        {partner.emoji}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4
          style={{
            fontFamily: YK,
            fontWeight: 700,
            fontSize: "clamp(0.95rem, 1.8vw, 1.15rem)",
            color: GOLD,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            margin: "0 0 0.3rem",
          }}
        >
          {partner.name}
        </h4>
        <p
          style={{
            fontFamily: DM,
            fontSize: "clamp(0.75rem, 1.15vw, 0.84rem)",
            color: GOLD_DIM,
            lineHeight: 1.6,
            margin: "0 0 0.75rem",
          }}
        >
          {partner.description}
        </p>
        <a
          href={partner.fbHref}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            fontFamily: YK,
            fontWeight: 700,
            fontSize: "clamp(0.6rem, 0.95vw, 0.7rem)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: GOLD_DIM,
            textDecoration: "none",
            border: `1px solid ${BR}`,
            padding: "5px 12px",
            transition: "color 0.2s, border-color 0.2s",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = GOLD;
            el.style.borderColor = BR_MED;
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = GOLD_DIM;
            el.style.borderColor = BR;
          }}
        >
          <svg width="11" height="11" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Visit Page
        </a>
      </div>
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: "clamp(1.5rem, 3vw, 2rem)",
      }}
    >
      <p
        style={{
          fontFamily: YK,
          fontWeight: 700,
          fontSize: "clamp(0.62rem, 1.1vw, 0.76rem)",
          letterSpacing: "0.3em",
          color: GOLD_DIM,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          margin: 0,
        }}
      >
        {label}
      </p>
      <div
        style={{
          flex: 1,
          height: 1,
          background: `linear-gradient(90deg, ${BR_MED}, transparent)`,
        }}
      />
    </div>
  );
}

// ── Admin Modal ───────────────────────────────────────────────────────────────

function AdminModal({
  onPost,
  onClose,
}: {
  onPost: (post: Omit<Post, "id">) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState<Tag>("UPDATE");
  const [pinColor, setPinColor] = useState<PinColor>("gold");
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const [pinned, setPinned] = useState(false);
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleSubmit = () => {
    if (!title.trim() || !body.trim()) return;
    const tilt = Math.random() * 2.4 - 1.2;
    const now = new Date();
    const date = now.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
    onPost({
      tag,
      pinned,
      pinColor,
      date,
      title,
      body,
      image: image || undefined,
      tilt,
      size,
    });
    onClose();
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(232,213,163,0.04)",
    border: `1px solid ${BR_MED}`,
    color: GOLD,
    fontFamily: DM,
    fontSize: "0.875rem",
    padding: "0.65rem 0.9rem",
    outline: "none",
    boxSizing: "border-box",
    lineHeight: 1.5,
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: YK,
    fontWeight: 700,
    fontSize: "0.68rem",
    letterSpacing: "0.25em",
    textTransform: "uppercase" as const,
    color: GOLD_DIM,
    display: "block",
    marginBottom: "0.4rem",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: BOARD,
          border: `1px solid ${BR_MED}`,
          padding: "clamp(1.5rem, 4vw, 2.5rem)",
          width: "100%",
          maxWidth: 520,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h2
            style={{
              fontFamily: YK,
              fontWeight: 700,
              fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
              color: GOLD,
              margin: 0,
            }}
          >
            Post to The Board
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: GOLD_DIM,
              cursor: "pointer",
              fontSize: 18,
              padding: 4,
            }}
          >
            ✕
          </button>
        </div>

        {/* Tag */}
        <div style={{ marginBottom: "1rem" }}>
          <span style={labelStyle}>Category</span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(["PROMO", "EVENT", "UPDATE", "PINNED"] as Tag[]).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTag(t);
                  if (t === "PINNED") setPinned(true);
                  else setPinned(false);
                }}
                style={{
                  fontFamily: YK,
                  fontWeight: 700,
                  fontSize: "0.66rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  padding: "5px 14px",
                  border: `1px solid ${tag === t ? ACCENT : BR}`,
                  background: tag === t ? ACCENT_DIM : "transparent",
                  color: tag === t ? ACCENT : GOLD_DIM,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Pin color */}
        <div style={{ marginBottom: "1rem" }}>
          <span style={labelStyle}>Pin Color</span>
          <div style={{ display: "flex", gap: 10 }}>
            {(["gold", "red", "teal"] as PinColor[]).map((c) => (
              <button
                key={c}
                onClick={() => setPinColor(c)}
                title={c}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: PIN_COLORS[c],
                  border:
                    pinColor === c
                      ? `2px solid ${GOLD}`
                      : "2px solid transparent",
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Card size */}
        <div style={{ marginBottom: "1rem" }}>
          <span style={labelStyle}>Card Size</span>
          <div style={{ display: "flex", gap: 8 }}>
            {(["sm", "md", "lg"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                style={{
                  fontFamily: YK,
                  fontWeight: 700,
                  fontSize: "0.66rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  padding: "5px 14px",
                  border: `1px solid ${size === s ? ACCENT : BR}`,
                  background: size === s ? ACCENT_DIM : "transparent",
                  color: size === s ? ACCENT : GOLD_DIM,
                  cursor: "pointer",
                }}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle}>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Weekend Deals Are Back"
            style={inputStyle}
          />
        </div>

        {/* Body */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={labelStyle}>Message</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What's the announcement?"
            rows={4}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        {/* Image upload */}
        <div style={{ marginBottom: "1rem" }}>
          <span style={labelStyle}>Image (optional)</span>
          {image && (
            <div
              style={{
                position: "relative",
                marginBottom: "0.5rem",
                borderRadius: 4,
                overflow: "hidden",
                border: `1px solid ${BR_MED}`,
              }}
            >
              <img
                src={image}
                alt="preview"
                style={{
                  width: "100%",
                  maxHeight: 140,
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <button
                onClick={() => setImage("")}
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  background: "rgba(0,0,0,0.6)",
                  border: `1px solid ${BR_MED}`,
                  color: GOLD,
                  width: 26,
                  height: 26,
                  cursor: "pointer",
                  fontSize: 13,
                  borderRadius: 2,
                }}
              >
                ✕
              </button>
            </div>
          )}
          <label
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "9px 14px",
              border: `1px dashed ${uploading ? ACCENT : BR_MED}`,
              cursor: uploading ? "wait" : "pointer",
              background: uploading ? "rgba(212,168,67,0.05)" : "transparent",
              color: uploading ? ACCENT : GOLD_DIM,
              fontSize: "0.75rem",
            }}
          >
            {uploading
              ? "Uploading…"
              : image
                ? "Replace image"
                : "Upload image"}
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
                    setImage(data.url);
                  }
                } catch {}
                setUploading(false);
                e.target.value = "";
              }}
            />
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!title.trim() || !body.trim() || uploading}
          style={{
            width: "100%",
            fontFamily: YK,
            fontWeight: 700,
            fontSize: "clamp(0.8rem, 1.4vw, 0.95rem)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            background:
              title.trim() && body.trim() ? ACCENT : "rgba(212,168,67,0.15)",
            color: title.trim() && body.trim() ? BG : "rgba(212,168,67,0.3)",
            border: "none",
            padding: "0.85rem",
            cursor: title.trim() && body.trim() ? "pointer" : "not-allowed",
            transition: "all 0.2s",
          }}
        >
          Pin It to The Board
        </button>
      </div>
    </div>
  );
}

// ── Admin Login Modal ─────────────────────────────────────────────────────────

function LoginModal({
  onLogin,
  onClose,
}: {
  onLogin: () => void;
  onClose: () => void;
}) {
  const [pass, setPass] = useState("");
  const [err, setErr] = useState(false);

  const attempt = () => {
    if (pass === ADMIN_PASS) {
      onLogin();
      onClose();
    } else {
      setErr(true);
      setPass("");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: BOARD,
          border: `1px solid ${BR_MED}`,
          padding: "clamp(1.5rem, 4vw, 2.5rem)",
          width: "100%",
          maxWidth: 380,
          boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
        }}
      >
        <h2
          style={{
            fontFamily: YK,
            fontWeight: 700,
            fontSize: "1.6rem",
            color: GOLD,
            margin: "0 0 0.3rem",
          }}
        >
          Admin Access
        </h2>
        <p
          style={{
            fontFamily: DM,
            fontSize: "0.82rem",
            color: GOLD_DIM,
            margin: "0 0 1.5rem",
          }}
        >
          Enter the admin password to post and manage announcements.
        </p>
        <input
          type="password"
          value={pass}
          onChange={(e) => {
            setPass(e.target.value);
            setErr(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && attempt()}
          placeholder="Password"
          style={{
            width: "100%",
            background: "rgba(232,213,163,0.04)",
            border: `1px solid ${err ? "#c0504d" : BR_MED}`,
            color: GOLD,
            fontFamily: DM,
            fontSize: "0.875rem",
            padding: "0.65rem 0.9rem",
            outline: "none",
            boxSizing: "border-box",
            marginBottom: err ? "0.4rem" : "1.25rem",
          }}
        />
        {err && (
          <p
            style={{
              fontFamily: DM,
              fontSize: "0.75rem",
              color: "#c0504d",
              margin: "0 0 1rem",
            }}
          >
            Wrong password. Try again.
          </p>
        )}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              fontFamily: YK,
              fontWeight: 700,
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              background: "transparent",
              border: `1px solid ${BR}`,
              color: GOLD_DIM,
              padding: "0.75rem",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={attempt}
            style={{
              flex: 2,
              fontFamily: YK,
              fontWeight: 700,
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              background: ACCENT,
              border: "none",
              color: BG,
              padding: "0.75rem",
              cursor: "pointer",
            }}
          >
            Enter
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BulletinPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((data) => setPosts(data.map((p: any) => ({ ...p, id: p._id }))));
  }, []);

  const handleNewPost = async (postData: Omit<Post, "id">) => {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });
    const saved = await res.json();
    setPosts((prev) => [{ ...saved, id: saved._id }, ...prev]);
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  // Separate pinned from the rest for layout
  const pinned = posts.filter((p) => p.pinned);
  const rest = posts.filter((p) => !p.pinned);

  return (
    <main style={{ minHeight: "100svh", background: BG }}>
      {/* ── Board texture overlay ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(212,168,67,0.06) 0%, transparent 70%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='4' height='4' fill='%230f1a0f'/%3E%3Ccircle cx='1' cy='1' r='0.5' fill='rgba(232,213,163,0.04)'/%3E%3C/svg%3E")
          `,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ── Page Header ── */}
        <header
          style={{
            borderBottom: `1px solid ${BR}`,
            padding: `clamp(4rem, 8vw, 7rem) ${SITE_PADDING} clamp(2rem, 4vw, 3rem)`,
            maxWidth: MAX_WIDTH,
            margin: "0 auto",
            boxSizing: "border-box",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: YK,
              fontWeight: 700,
              fontSize: "clamp(0.62rem, 1vw, 0.72rem)",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: GOLD_DIM,
              textDecoration: "none",
              marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = GOLD)
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color = GOLD_DIM)
            }
          >
            <svg
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1.5rem",
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: DM,
                  fontSize: "clamp(0.58rem, 0.9vw, 0.7rem)",
                  letterSpacing: "0.35em",
                  color: "rgba(232,213,163,0.3)",
                  textTransform: "uppercase",
                  marginBottom: "0.65rem",
                }}
              >
                3rd Space
              </p>
              <h1
                style={{
                  fontFamily: YK,
                  fontWeight: 700,
                  fontSize: "clamp(2.6rem, 6.5vw, 6rem)",
                  lineHeight: 0.88,
                  letterSpacing: "0.01em",
                  color: GOLD,
                  textTransform: "uppercase",
                  margin: "0 0 clamp(0.75rem, 1.5vw, 1.1rem)",
                }}
              >
                The
                <br />
                <em style={{ color: ACCENT, fontStyle: "italic" }}>Board</em>
              </h1>
              <p
                style={{
                  fontFamily: DM,
                  fontSize: "clamp(0.82rem, 1.35vw, 0.97rem)",
                  color: GOLD_DIM,
                  lineHeight: 1.65,
                  maxWidth: 440,
                  margin: 0,
                }}
              >
                Announcements, promos, events — everything happening in and
                around 3rd Space.
              </p>
            </div>
          </div>
        </header>

        {/* ── Board Body ── */}
        <div
          style={{
            maxWidth: MAX_WIDTH,
            margin: "0 auto",
            padding: `clamp(2.5rem, 5vw, 4rem) ${SITE_PADDING}`,
            boxSizing: "border-box",
          }}
        >
          {/* Announcements */}
          <section style={{ marginBottom: "clamp(4rem, 8vw, 6rem)" }}>
            <SectionDivider label="Pinned &amp; Announcements" />

            {posts.length === 0 && (
              <p
                style={{
                  fontFamily: DM,
                  color: GOLD_DIM,
                  fontSize: "0.875rem",
                }}
              >
                No posts yet. Check back soon.
              </p>
            )}

            {/* Masonry-style CSS columns */}
            <div
              style={{
                columnCount: "auto",
                columnWidth: "clamp(260px, 30vw, 380px)",
                columnGap: "clamp(0.75rem, 2vw, 1.25rem)",
              }}
            >
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  isAdmin={false}
                  onDelete={undefined}
                />
              ))}
            </div>
          </section>

          {/* Partners */}
          {/* <section>
            <SectionDivider label="Our Partners" />
            <p
              style={{
                fontFamily: DM,
                fontSize: "clamp(0.78rem, 1.25vw, 0.88rem)",
                color: "rgba(232,213,163,0.32)",
                lineHeight: 1.65,
                maxWidth: 500,
                marginBottom: "clamp(1.5rem, 3vw, 2rem)",
              }}
            >
              3rd Space works alongside local businesses and communities. Visit
              their pages and show some love.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(min(100%, clamp(240px, 28vw, 360px)), 1fr))",
                gap: "clamp(0.75rem, 2vw, 1rem)",
              }}
            >
              {partners.map((p) => (
                <PartnerCard key={p.id} partner={p} />
              ))}
            </div>
          </section> */}
        </div>

        <Footer />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Yanone+Kaffeesatz:wght@400;700&family=DM+Sans:wght@400;500;700&display=swap');
        * { box-sizing: border-box; }
        ::placeholder { color: rgba(232,213,163,0.25) !important; }
        textarea, input { caret-color: #d4a843; }
        @media (max-width: 640px) {
          [data-masonry] { column-count: 1 !important; }
        }
      `}</style>
    </main>
  );
}
