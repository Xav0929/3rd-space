"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const SITE_PADDING = "clamp(1.5rem, 5vw, 4rem)";
const MAX_WIDTH = 1280;
const YK = "var(--font-yanone), 'Yanone Kaffeesatz', sans-serif";
const DM = "var(--font-dm), 'DM Sans', sans-serif";

type Task = {
  id: string;
  icon: string;
  label: string;
  reward: string;
  platform?: string;
  link?: string;
  done: boolean;
};

const INITIAL_TASKS: Task[] = [
  {
    id: "t1",
    icon: "👍",
    label: "Follow us on Facebook",
    reward: "₱10 credit",
    platform: "Facebook",
    link: "https://www.facebook.com/TheBanatuBackpackers",
    done: false,
  },
  {
    id: "t2",
    icon: "🎵",
    label: "Follow us on TikTok",
    reward: "₱10 credit",
    platform: "TikTok",
    link: "https://www.tiktok.com",
    done: false,
  },
  {
    id: "t3",
    icon: "📸",
    label: "Follow us on Instagram",
    reward: "₱10 credit",
    platform: "Instagram",
    link: "https://www.instagram.com",
    done: false,
  },
  {
    id: "t4",
    icon: "🍵",
    label: "Buy any food or drink",
    reward: "₱30 credit",
    platform: "In-Store",
    done: false,
  },
  {
    id: "t5",
    icon: "📸",
    label: "Tag us in an Instagram story",
    reward: "₱20 credit",
    platform: "Instagram",
    link: "https://www.instagram.com",
    done: false,
  },
  {
    id: "t6",
    icon: "⭐",
    label: "Leave a Google Review",
    reward: "₱25 credit",
    platform: "Google",
    link: "https://www.google.com",
    done: false,
  },
];

const VOUCHERS = [
  {
    id: "drink",
    src: "/vouchers/drink-voucher.png",
    alt: "Drink Voucher – 10% Off",
    title: "DRINK VOUCHER",
    discount: "10% OFF",
    description:
      "Valid on all drinks. Dine-in only. Present at counter before ordering.",
    validUntil: "Dec 31, 2025",
  },
  {
    id: "food",
    src: "/vouchers/food-voucher.png",
    alt: "Food Voucher – 5% Off",
    title: "FOOD VOUCHER",
    discount: "5% OFF",
    description:
      "Valid on all food items. Dine-in only. Cannot be combined with other vouchers.",
    validUntil: "Dec 31, 2025",
  },
];

type ClaimState = {
  loading: boolean;
  result: { ok: boolean; msg: string; code?: string } | null;
  claimed: boolean;
};

function VoucherCard({
  voucher,
  remaining,
  total,
  onClaim,
}: {
  voucher: (typeof VOUCHERS)[0];
  remaining: number;
  total: number;
  onClaim: (
    type: string,
    name: string,
  ) => Promise<{ ok: boolean; msg: string; code?: string }>;
}) {
  const [name, setName] = useState("");
  const storageKey = `claimed_${voucher.id}_${new Date().toISOString().slice(0, 10)}`;
  const [state, setState] = useState<ClaimState>({
    loading: false,
    result: null,
    claimed: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const storedData = JSON.parse(stored);
      setState({
        loading: false,
        result: { ok: true, msg: storedData.msg, code: storedData.code },
        claimed: true,
      });
    }
  }, [storageKey]);
  const [hovered, setHovered] = useState(false);
  const soldOut = remaining <= 0;
  const pct = ((total - remaining) / total) * 100;

  async function handleClaim() {
    if (!name.trim() || state.loading || state.claimed || soldOut) return;
    setState((p) => ({ ...p, loading: true, result: null }));
    const result = await onClaim(voucher.id, name.trim());
    if (result.ok) {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ msg: result.msg, code: result.code }),
      );
    }
    setState({ loading: false, result, claimed: result.ok });
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        transition: "transform 0.3s",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
      }}
    >
      {/* Voucher image */}
      <div
        style={{
          position: "relative",
          width: "100%",
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: hovered
            ? "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,168,67,0.3)"
            : "0 8px 30px rgba(0,0,0,0.5)",
          transition: "box-shadow 0.3s",
          opacity: soldOut ? 0.5 : 1,
        }}
      >
        <img
          src={voucher.src}
          alt={voucher.alt}
          style={{ width: "100%", display: "block", objectFit: "contain" }}
        />
        {soldOut && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(10,18,10,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: YK,
                fontWeight: 700,
                fontSize: 22,
                letterSpacing: "0.2em",
                color: "rgba(232,213,163,0.5)",
                textTransform: "uppercase",
                border: "2px solid rgba(232,213,163,0.3)",
                padding: "6px 20px",
              }}
            >
              SOLD OUT
            </span>
          </div>
        )}
      </div>

      {/* Slots bar */}
      <div
        style={{
          background: "rgba(15,26,15,0.9)",
          border: "1px solid rgba(232,213,163,0.1)",
          padding: "0.85rem 1.1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
          }}
        >
          <p
            style={{
              fontFamily: DM,
              fontSize: 10,
              letterSpacing: "0.2em",
              color: "rgba(232,213,163,0.4)",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Daily Slots
          </p>
          <p
            style={{
              fontFamily: YK,
              fontSize: 14,
              fontWeight: 700,
              color: remaining > 0 ? "#d4a843" : "rgba(232,213,163,0.3)",
              margin: 0,
            }}
          >
            {remaining}/{total} left
          </p>
        </div>
        <div
          style={{
            height: 4,
            background: "rgba(232,213,163,0.08)",
            borderRadius: 2,
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: 2,
              width: `${pct}%`,
              background: pct >= 100 ? "rgba(239,68,68,0.6)" : "#d4a843",
              transition: "width 0.5s ease",
            }}
          />
        </div>
        <p
          style={{
            fontFamily: DM,
            fontSize: 10,
            color: "rgba(232,213,163,0.25)",
            margin: "0.4rem 0 0",
            letterSpacing: "0.1em",
          }}
        >
          Resets daily at midnight · Dine-in only
        </p>
      </div>

      {/* Claim form */}
      {!state.claimed ? (
        <div
          style={{
            border: "1px solid rgba(212,168,67,0.15)",
            padding: "1.25rem",
            background: "rgba(212,168,67,0.02)",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          <p
            style={{
              fontFamily: YK,
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#e8d5a3",
              margin: 0,
            }}
          >
            Claim {voucher.title}
          </p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleClaim()}
            placeholder="Enter your name"
            disabled={soldOut || state.loading}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(232,213,163,0.2)",
              color: "#e8d5a3",
              fontFamily: DM,
              fontSize: 14,
              padding: "0.7rem 1rem",
              outline: "none",
              width: "100%",
              boxSizing: "border-box" as const,
              opacity: soldOut ? 0.4 : 1,
            }}
          />
          <button
            onClick={handleClaim}
            disabled={soldOut || state.loading || !name.trim()}
            style={{
              fontFamily: YK,
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "0.75rem 1.5rem",
              background:
                soldOut || !name.trim() ? "rgba(212,168,67,0.15)" : "#d4a843",
              color:
                soldOut || !name.trim() ? "rgba(232,213,163,0.3)" : "#0f1a0f",
              border: "none",
              cursor: soldOut || !name.trim() ? "not-allowed" : "pointer",
              width: "100%",
              transition: "all 0.2s",
            }}
          >
            {state.loading
              ? "CLAIMING…"
              : soldOut
                ? "SOLD OUT TODAY"
                : "CLAIM VOUCHER"}
          </button>
          {state.result && !state.result.ok && (
            <div
              style={{
                padding: "0.65rem 0.9rem",
                background: "rgba(239,68,68,0.07)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: "#ef4444",
                fontFamily: DM,
                fontSize: 12,
                lineHeight: 1.5,
              }}
            >
              {state.result.msg}
            </div>
          )}
        </div>
      ) : (
        /* Success state */
        <div
          style={{
            border: "1px solid rgba(126,200,160,0.3)",
            padding: "1.5rem",
            background: "rgba(126,200,160,0.05)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: "0.5rem" }}>✓</div>
          <p
            style={{
              fontFamily: YK,
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: "0.08em",
              color: "#7ec8a0",
              margin: "0 0 0.5rem",
              textTransform: "uppercase",
            }}
          >
            Voucher Claimed!
          </p>
          <p
            style={{
              fontFamily: DM,
              fontSize: 13,
              color: "rgba(126,200,160,0.8)",
              lineHeight: 1.6,
              margin: "0 0 1rem",
            }}
          >
            {state.result?.msg}
          </p>
          <div
            style={{
              margin: "0 0 1rem",
              padding: "1rem",
              background: "rgba(212,168,67,0.06)",
              border: "1px solid rgba(212,168,67,0.3)",
            }}
          >
            <p
              style={{
                fontFamily: DM,
                fontSize: 10,
                color: "rgba(232,213,163,0.4)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                margin: "0 0 0.4rem",
              }}
            >
              Your Voucher Code
            </p>
            <p
              style={{
                fontFamily: YK,
                fontWeight: 700,
                fontSize: 28,
                letterSpacing: "0.15em",
                color: "#d4a843",
                margin: 0,
              }}
            >
              {state.result?.code}
            </p>
          </div>
          <div
            style={{
              padding: "0.75rem",
              background: "rgba(232,213,163,0.04)",
              border: "1px solid rgba(232,213,163,0.1)",
            }}
          >
            <p
              style={{
                fontFamily: DM,
                fontSize: 11,
                color: "rgba(232,213,163,0.4)",
                margin: 0,
                letterSpacing: "0.1em",
              }}
            >
              TELL STAFF THIS CODE WHEN ORDERING
            </p>
          </div>
        </div>
      )}

      {/* Terms */}
      <p
        style={{
          fontFamily: DM,
          fontSize: 11,
          color: "rgba(232,213,163,0.3)",
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {voucher.description}
      </p>
    </div>
  );
}

function TaskRow({
  task,
  onToggle,
}: {
  task: Task;
  onToggle: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "1rem 1.25rem",
        background: task.done
          ? "rgba(126,200,160,0.06)"
          : hovered
            ? "rgba(232,213,163,0.04)"
            : "transparent",
        border: `1px solid ${task.done ? "rgba(126,200,160,0.2)" : hovered ? "rgba(232,213,163,0.15)" : "rgba(232,213,163,0.07)"}`,
        transition: "all 0.25s",
        marginBottom: "0.5rem",
      }}
    >
      <span style={{ fontSize: 20, flexShrink: 0 }}>{task.icon}</span>
      <div style={{ flex: 1 }}>
        <p
          style={{
            fontFamily: YK,
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: "0.04em",
            color: task.done ? "rgba(232,213,163,0.35)" : "#e8d5a3",
            textTransform: "uppercase",
            margin: 0,
            textDecoration: task.done ? "line-through" : "none",
          }}
        >
          {task.label}
        </p>
        <p
          style={{
            fontFamily: DM,
            fontSize: 11,
            color: "rgba(232,213,163,0.4)",
            margin: "2px 0 0",
          }}
        >
          Earn {task.reward}
          {task.platform ? ` · ${task.platform}` : ""}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        {task.link && !task.done && (
          <a
            href={task.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: YK,
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "5px 12px",
              background: "transparent",
              color: "rgba(232,213,163,0.6)",
              border: "1px solid rgba(232,213,163,0.2)",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(232,213,163,0.1)";
              e.currentTarget.style.color = "#e8d5a3";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "rgba(232,213,163,0.6)";
            }}
          >
            GO →
          </a>
        )}
        <button
          onClick={() => onToggle(task.id)}
          style={{
            fontFamily: YK,
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            padding: "5px 14px",
            background: task.done ? "rgba(126,200,160,0.15)" : "#e8d5a3",
            color: task.done ? "#7ec8a0" : "#0f1a0f",
            border: `1px solid ${task.done ? "#7ec8a0" : "#e8d5a3"}`,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          {task.done ? "✓ DONE" : "MARK DONE"}
        </button>
      </div>
    </div>
  );
}

export default function VouchersPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activeTab] = useState<"vouchers" | "earn">("vouchers");
  const [reviewCopied, setReviewCopied] = useState(false);
  const [reviewConfirmed, setReviewConfirmed] = useState(false);

  useEffect(() => {
    try {
      const confirmed =
        localStorage.getItem(
          `review_confirmed_${new Date().toISOString().slice(0, 10)}`,
        ) === "1";
      setReviewConfirmed(confirmed);
    } catch {}
  }, []);

  function handleOpenReview() {
    setReviewCopied(true);
    window.open(
      "https://www.google.com/maps/place/3rd+Space./@15.461629,120.9492521,17z/data=!4m18!1m9!3m8!1s0x339729bcb0e7a4ef:0x7c6be590214baf56!2s3rd+Space.!8m2!3d15.461629!4d120.9492521!9m1!1b1!16s%2Fg%2F11ymd4bsqr!3m7!1s0x339729bcb0e7a4ef:0x7c6be590214baf56!8m2!3d15.461629!4d120.9492521!9m1!1b1!16s%2Fg%2F11ymd4bsqr?hl=en&entry=ttu&g_ep=EgoyMDI2MDYwMy4xIKXMDSoASAFQAw%3D%3D",
      "_blank",
    );
  }

  function handleConfirmReview() {
    try {
      localStorage.setItem(
        `review_confirmed_${new Date().toISOString().slice(0, 10)}`,
        "1",
      );
    } catch {}
    setReviewConfirmed(true);
  }
  const [remaining, setRemaining] = useState({ drink: 5, food: 5 });
  const [total] = useState({ drink: 5, food: 5 });

  useEffect(() => {
    fetch("/api/vouchers")
      .then((r) => r.json())
      .then((d) =>
        setRemaining({ drink: d.drinkRemaining, food: d.foodRemaining }),
      )
      .catch(() => {});
  }, []);

  async function handleClaim(
    type: string,
    name: string,
  ): Promise<{ ok: boolean; msg: string; code?: string }> {
    try {
      const res = await fetch("/api/vouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, customerName: name }),
      });
      const data = await res.json();
      if (res.ok) {
        setRemaining((p) => ({
          ...p,
          [type]: p[type as "drink" | "food"] - 1,
        }));
        return { ok: true, msg: data.message, code: data.code };
      }
      return { ok: false, msg: data.error };
    } catch {
      return { ok: false, msg: "Network error. Try again." };
    }
  }

  const completedCount = tasks.filter((t) => t.done).length;
  const totalCredits = tasks
    .filter((t) => t.done)
    .reduce((sum, t) => {
      const match = t.reward.match(/₱(\d+)/);
      return sum + (match ? parseInt(match[1]) : 0);
    }, 0);
  const toggleTask = (id: string) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );

  return (
    <>
      <style>{`
        .vouchers-page * { box-sizing: border-box; }
        .tab-btn { transition: all 0.2s; }
        @media (max-width: 640px) { .vouchers-grid { grid-template-columns: 1fr !important; } }
        input::placeholder { color: rgba(232,213,163,0.25) !important; }
        input:focus { border-color: rgba(212,168,67,0.5) !important; }
      `}</style>

      <div
        className="vouchers-page"
        style={{ minHeight: "100vh", background: "#0a120a", color: "#e8d5a3" }}
      >
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(232,213,163,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(232,213,163,0.025) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: MAX_WIDTH,
            margin: "0 auto",
            paddingLeft: SITE_PADDING,
            paddingRight: SITE_PADDING,
            paddingTop: "clamp(5rem, 10vw, 8rem)",
            paddingBottom: "4rem",
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: DM,
              fontSize: 10,
              letterSpacing: "0.25em",
              color: "rgba(232,213,163,0.35)",
              textTransform: "uppercase",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              marginBottom: "2.5rem",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "rgba(232,213,163,0.8)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(232,213,163,0.35)")
            }
          >
            ← Back to Home
          </Link>

          <div style={{ marginBottom: "3rem" }}>
            <p
              style={{
                fontFamily: DM,
                fontWeight: 400,
                fontSize: "clamp(0.5rem, 0.85vw, 0.72rem)",
                letterSpacing: "0.38em",
                color: "rgba(232,213,163,0.4)",
                textTransform: "uppercase",
                margin: "0 0 0.75rem",
              }}
            >
              Earn · Collect · Redeem
            </p>
            <h1
              style={{
                fontFamily: YK,
                fontWeight: 700,
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                lineHeight: 0.9,
                letterSpacing: "0.01em",
                color: "#e8d5a3",
                textTransform: "uppercase",
                margin: "0 0 1rem",
              }}
            >
              3rd Space
              <br />
              <em style={{ color: "#d4a843", fontStyle: "italic" }}>
                Vouchers
              </em>
            </h1>
            <p
              style={{
                fontFamily: DM,
                fontSize: "clamp(0.85rem, 1.5vw, 1rem)",
                color: "rgba(232,213,163,0.5)",
                maxWidth: 520,
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Claim your daily voucher below — 5 drink and 5 food vouchers
              available every day. Enter your name and claim before they run
              out. Dine-in only.
            </p>
          </div>

          {/* ── REVIEW GATE ── */}
          {!reviewConfirmed ? (
            <div
              style={{
                marginBottom: "2.5rem",
                border: "1px solid rgba(212,168,67,0.25)",
                background: "rgba(212,168,67,0.03)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "1.1rem 1.4rem",
                  borderBottom: "1px solid rgba(212,168,67,0.12)",
                  background: "rgba(212,168,67,0.06)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontSize: 20, flexShrink: 0, color: "#d4a843" }}>
                  ★
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: YK,
                      fontWeight: 700,
                      fontSize: 15,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#e8d5a3",
                      margin: 0,
                    }}
                  >
                    Leave a Google Review to Unlock Vouchers
                  </p>
                  <p
                    style={{
                      fontFamily: DM,
                      fontSize: 11,
                      color: "rgba(232,213,163,0.4)",
                      margin: "3px 0 0",
                      lineHeight: 1.5,
                    }}
                  >
                    Tap below · Leave a review on Google · Confirm to unlock
                  </p>
                </div>
                <span
                  style={{
                    fontFamily: YK,
                    fontWeight: 700,
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    padding: "3px 10px",
                    flexShrink: 0,
                    border: "1px solid rgba(212,168,67,0.3)",
                    color: "#d4a843",
                  }}
                >
                  REQUIRED
                </span>
              </div>

              <div style={{ padding: "1.4rem" }}>
                <p
                  style={{
                    fontFamily: DM,
                    fontSize: 13,
                    color: "rgba(232,213,163,0.5)",
                    lineHeight: 1.7,
                    margin: "0 0 1.25rem",
                  }}
                >
                  Tap below to open Google Reviews, leave us a 5-star review,
                  then come back and confirm. Staff will verify before you
                  redeem.
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.65rem",
                  }}
                >
                  <button
                    onClick={handleOpenReview}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.6rem",
                      fontFamily: YK,
                      fontWeight: 700,
                      fontSize: 13,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      padding: "0.95rem 1.5rem",
                      background: "#d4a843",
                      color: "#0f1a0f",
                      border: "none",
                      cursor: "pointer",
                      width: "100%",
                      transition: "all 0.2s",
                    }}
                  >
                    ★ LEAVE A GOOGLE REVIEW
                  </button>

                  {reviewCopied && (
                    <>
                      <p
                        style={{
                          fontFamily: DM,
                          fontSize: 11,
                          color: "rgba(232,213,163,0.4)",
                          margin: 0,
                          lineHeight: 1.6,
                          textAlign: "center",
                        }}
                      >
                        Posted your review? Tap below to unlock your vouchers.
                      </p>
                      <button
                        onClick={handleConfirmReview}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          fontFamily: YK,
                          fontWeight: 700,
                          fontSize: 13,
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          padding: "0.85rem 1.5rem",
                          background: "rgba(126,200,160,0.12)",
                          color: "#7ec8a0",
                          border: "1px solid rgba(126,200,160,0.3)",
                          cursor: "pointer",
                          width: "100%",
                          transition: "all 0.2s",
                        }}
                      >
                        ✓ I'VE POSTED MY REVIEW — UNLOCK VOUCHERS
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                marginBottom: "2.5rem",
                border: "1px solid rgba(126,200,160,0.25)",
                background: "rgba(126,200,160,0.04)",
                padding: "1.1rem 1.4rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: 22,
                  color: "#7ec8a0",
                  flexShrink: 0,
                  fontFamily: DM,
                }}
              >
                ✓
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: YK,
                    fontWeight: 700,
                    fontSize: 14,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#7ec8a0",
                    margin: 0,
                  }}
                >
                  Review Posted — Vouchers Unlocked
                </p>
                <p
                  style={{
                    fontFamily: DM,
                    fontSize: 11,
                    color: "rgba(126,200,160,0.55)",
                    margin: "3px 0 0",
                  }}
                >
                  Staff will verify your Google review before redeeming. Thank
                  you!
                </p>
              </div>
            </div>
          )}

          {completedCount > 0 && (
            <div
              style={{
                background: "rgba(232,213,163,0.06)",
                border: "1px solid rgba(232,213,163,0.1)",
                padding: "1rem 1.5rem",
                marginBottom: "2rem",
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: 200 }}>
                <p
                  style={{
                    fontFamily: YK,
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: "0.1em",
                    color: "#e8d5a3",
                    textTransform: "uppercase",
                    margin: "0 0 0.5rem",
                  }}
                >
                  Your Progress — {completedCount}/{tasks.length} Tasks Done
                </p>
                <div
                  style={{
                    height: 4,
                    background: "rgba(232,213,163,0.1)",
                    borderRadius: 2,
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${(completedCount / tasks.length) * 100}%`,
                      background: "#d4a843",
                      borderRadius: 2,
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: DM,
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    color: "rgba(232,213,163,0.4)",
                    textTransform: "uppercase",
                    margin: "0 0 2px",
                  }}
                >
                  Credits Earned
                </p>
                <p
                  style={{
                    fontFamily: YK,
                    fontWeight: 700,
                    fontSize: 26,
                    color: "#7ec8a0",
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  ₱{totalCredits}
                </p>
              </div>
            </div>
          )}

          {activeTab === "vouchers" && (
            <>
              <div
                className="vouchers-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                  gap: "2.5rem",
                  marginBottom: "3rem",
                }}
              >
                {VOUCHERS.map((v) => (
                  <div key={v.id} style={{ position: "relative" }}>
                    {!reviewConfirmed && (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          zIndex: 10,
                          background: "rgba(10,18,10,0.82)",
                          backdropFilter: "blur(4px)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          padding: "1rem",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 28,
                            color: "rgba(232,213,163,0.2)",
                          }}
                        >
                          ▣
                        </span>
                        <p
                          style={{
                            fontFamily: YK,
                            fontWeight: 700,
                            fontSize: 12,
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            color: "rgba(232,213,163,0.35)",
                            textAlign: "center",
                            margin: 0,
                          }}
                        >
                          POST A GOOGLE REVIEW TO UNLOCK
                        </p>
                      </div>
                    )}
                    <VoucherCard
                      voucher={v}
                      remaining={remaining[v.id as "drink" | "food"]}
                      total={total[v.id as "drink" | "food"]}
                      onClaim={handleClaim}
                    />
                  </div>
                ))}
              </div>

              <div
                style={{
                  border: "1px solid rgba(232,213,163,0.1)",
                  padding: "1.75rem",
                  background: "rgba(232,213,163,0.02)",
                }}
              >
                <p
                  style={{
                    fontFamily: YK,
                    fontWeight: 700,
                    fontSize: 16,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#e8d5a3",
                    margin: "0 0 1rem",
                  }}
                >
                  How It Works
                </p>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}
                >
                  {[
                    ["1", "Enter your name and claim a voucher above"],
                    ["2", "Visit 3rd Space and dine in (Daily 9am – 12am)"],
                    ["3", "Tell staff you have a voucher — they'll verify it"],
                    ["4", "Enjoy your discount!"],
                  ].map(([num, step]) => (
                    <div
                      key={num}
                      style={{
                        display: "flex",
                        gap: "0.75rem",
                        alignItems: "flex-start",
                        minWidth: 200,
                        flex: 1,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: YK,
                          fontWeight: 700,
                          fontSize: 20,
                          color: "#d4a843",
                          lineHeight: 1,
                          flexShrink: 0,
                        }}
                      >
                        {num}.
                      </span>
                      <p
                        style={{
                          fontFamily: DM,
                          fontSize: 13,
                          color: "rgba(232,213,163,0.55)",
                          lineHeight: 1.5,
                          margin: 0,
                        }}
                      >
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "earn" && (
            <div>
              <p
                style={{
                  fontFamily: DM,
                  fontSize: 12,
                  color: "rgba(232,213,163,0.4)",
                  letterSpacing: "0.04em",
                  lineHeight: 1.7,
                  marginBottom: "1.5rem",
                  maxWidth: 560,
                }}
              >
                Complete tasks below to earn credits toward your next voucher.
                Mark each task as done and show this screen to our staff for
                verification.
              </p>
              <div>
                {tasks.map((task) => (
                  <TaskRow key={task.id} task={task} onToggle={toggleTask} />
                ))}
              </div>
              <div
                style={{
                  marginTop: "1.5rem",
                  padding: "1rem 1.25rem",
                  background: "rgba(212,168,67,0.06)",
                  border: "1px solid rgba(212,168,67,0.2)",
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
                <p
                  style={{
                    fontFamily: DM,
                    fontSize: 12,
                    color: "rgba(232,213,163,0.5)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  Credits and completed tasks must be verified by a 3rd Space
                  staff member. Task completion does not automatically apply
                  discounts — show this screen at the counter.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
