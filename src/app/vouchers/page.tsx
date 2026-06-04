"use client";

import { useState } from "react";
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
    code: "3RD-DRINK10",
    description:
      "Valid on all drinks. Dine-in only. Present at counter before ordering.",
    validUntil: "Dec 31, 2025",
    color: "#1a4a2e",
  },
  {
    id: "food",
    src: "/vouchers/food-voucher.png",
    alt: "Food Voucher – 5% Off",
    title: "FOOD VOUCHER",
    discount: "5% OFF",
    code: "3RD-FOOD5",
    description:
      "Valid on all food items. Dine-in only. Cannot be combined with other vouchers.",
    validUntil: "Dec 31, 2025",
    color: "#1a4a2e",
  },
];

function VoucherCard({ voucher }: { voucher: (typeof VOUCHERS)[0] }) {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(voucher.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      {/* Actual voucher image */}
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
        }}
      >
        <img
          src={voucher.src}
          alt={voucher.alt}
          style={{ width: "100%", display: "block", objectFit: "contain" }}
        />
      </div>

      {/* Code row below the image */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
          background: "rgba(15,26,15,0.9)",
          border: "1px solid rgba(232,213,163,0.12)",
          padding: "0.85rem 1.1rem",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: DM,
              fontSize: 9,
              letterSpacing: "0.25em",
              color: "rgba(232,213,163,0.35)",
              textTransform: "uppercase",
              margin: "0 0 3px",
            }}
          >
            Voucher Code
          </p>
          <p
            style={{
              fontFamily: YK,
              fontWeight: 700,
              fontSize: 17,
              letterSpacing: "0.2em",
              color: "#e8d5a3",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            {voucher.code}
          </p>
          <p
            style={{
              fontFamily: DM,
              fontSize: 9,
              letterSpacing: "0.15em",
              color: "rgba(232,213,163,0.25)",
              textTransform: "uppercase",
              margin: "4px 0 0",
            }}
          >
            Valid until {voucher.validUntil}
          </p>
        </div>
        <button
          onClick={copy}
          style={{
            fontFamily: YK,
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            padding: "8px 18px",
            background: copied ? "#d4a843" : "transparent",
            color: copied ? "#0f1a0f" : "rgba(232,213,163,0.7)",
            border: `1px solid ${copied ? "#d4a843" : "rgba(232,213,163,0.25)"}`,
            cursor: "pointer",
            transition: "all 0.2s",
            flexShrink: 0,
          }}
        >
          {copied ? "✓ COPIED!" : "COPY CODE"}
        </button>
      </div>

      {/* Terms line */}
      <p
        style={{
          fontFamily: DM,
          fontSize: 11,
          color: "rgba(232,213,163,0.35)",
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
  const [activeTab, setActiveTab] = useState<"vouchers" | "earn">("vouchers");

  const completedCount = tasks.filter((t) => t.done).length;
  const totalCredits = tasks
    .filter((t) => t.done)
    .reduce((sum, t) => {
      const match = t.reward.match(/₱(\d+)/);
      return sum + (match ? parseInt(match[1]) : 0);
    }, 0);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  return (
    <>
      <style>{`
        .vouchers-page * { box-sizing: border-box; }
        .tab-btn { transition: all 0.2s; }
        @media (max-width: 640px) {
          .vouchers-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div
        className="vouchers-page"
        style={{ minHeight: "100vh", background: "#0a120a", color: "#e8d5a3" }}
      >
        {/* Subtle grid overlay */}
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
          {/* Back link */}
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

          {/* Page header */}
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
              Collect vouchers by completing tasks, following us on social
              media, or spending in-store. Show the code at the counter to
              redeem your discount.
            </p>
          </div>

          {/* Progress bar */}
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

          {/* Tab switcher */}
          <div
            style={{
              display: "flex",
              gap: 0,
              marginBottom: "2rem",
              borderBottom: "1px solid rgba(232,213,163,0.12)",
            }}
          >
            {(["vouchers", "earn"] as const).map((tab) => (
              <button
                key={tab}
                className="tab-btn"
                onClick={() => setActiveTab(tab)}
                style={{
                  fontFamily: YK,
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "0.75rem 1.75rem",
                  background: "none",
                  border: "none",
                  borderBottom:
                    activeTab === tab
                      ? "2px solid #d4a843"
                      : "2px solid transparent",
                  color:
                    activeTab === tab ? "#e8d5a3" : "rgba(232,213,163,0.35)",
                  cursor: "pointer",
                  marginBottom: -1,
                }}
              >
                {tab === "vouchers"
                  ? "🎟  Available Vouchers"
                  : "✅  Earn Credits"}
              </button>
            ))}
          </div>

          {/* VOUCHERS TAB */}
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
                  <VoucherCard key={v.id} voucher={v} />
                ))}
              </div>

              {/* How to redeem */}
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
                  How to Redeem
                </p>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}
                >
                  {[
                    ["1", "Copy the voucher code above"],
                    ["2", "Visit 3rd Space (Daily 9am – 12am)"],
                    ["3", "Show this page or the code to staff"],
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

          {/* EARN TAB */}
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
