"use client";

import { useState, useEffect, useCallback } from "react";
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
const GREEN = "#4caf8a";
const RED = "#c0504d";
const SITE_PADDING = "clamp(1.5rem, 5vw, 4rem)";
const MAX_WIDTH = 1100;

// ── Types ─────────────────────────────────────────────────────────────────────

interface ColStat {
  name: string;
  count: number;
  sizeKB: number;
  avgDocKB: number;
}

interface AgeBucket {
  days: number;
  count: number;
}

interface StorageData {
  mongo: { storageMB: number; limitMB: number; collections: ColStat[] };
  r2: { files: number; sizeMB: number; limitMB: number };
  ageBuckets: AgeBucket[];
  ts: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtMB(mb: number) {
  return mb >= 1024 ? `${(mb / 1024).toFixed(2)} GB` : `${mb} MB`;
}

function pct(used: number, total: number) {
  return Math.min(100, Math.round((used / total) * 100));
}

function getBarColor(p: number) {
  if (p < 50) return GREEN;
  if (p < 80) return ACCENT;
  return RED;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionDivider({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        marginBottom: "clamp(1.25rem, 2.5vw, 1.75rem)",
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

function UsageBar({ used, total }: { used: number; total: number }) {
  const p = pct(used, total);
  const color = getBarColor(p);
  return (
    <div style={{ marginTop: 10 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span style={{ fontFamily: DM, fontSize: "0.75rem", color: GOLD_DIM }}>
          {fmtMB(used)} used
        </span>
        <span
          style={{
            fontFamily: DM,
            fontSize: "0.75rem",
            color: "rgba(232,213,163,0.3)",
          }}
        >
          {fmtMB(total)} limit
        </span>
      </div>
      <div
        style={{
          height: 6,
          background: "rgba(232,213,163,0.07)",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${p}%`,
            background: color,
            borderRadius: 3,
            transition: "width 0.8s ease",
          }}
        />
      </div>
      <p
        style={{
          fontFamily: YK,
          fontWeight: 700,
          fontSize: "0.68rem",
          letterSpacing: "0.2em",
          color,
          marginTop: 6,
          textTransform: "uppercase",
        }}
      >
        {p}% used
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div
      className="stat-card"
      style={{
        background: BOARD,
        border: `1px solid ${BR}`,
        padding: "clamp(1rem, 2.2vw, 1.4rem)",
      }}
    >
      <p
        style={{
          fontFamily: YK,
          fontWeight: 700,
          fontSize: "0.68rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: GOLD_DIM,
          margin: "0 0 0.5rem",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: YK,
          fontWeight: 700,
          fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
          color: GOLD,
          margin: 0,
          lineHeight: 1,
        }}
      >
        {value}
      </p>
      {sub && (
        <p
          style={{
            fontFamily: DM,
            fontSize: "0.75rem",
            color: "rgba(232,213,163,0.3)",
            margin: "0.4rem 0 0",
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

function CollectionRow({ col }: { col: ColStat }) {
  const colNameMap: Record<string, string> = {
    orders: "Orders",
    menu: "Menu Items",
    vouchers: "Vouchers",
    posts: "Board Posts",
    accounts: "Staff Accounts",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 0",
        borderBottom: `1px solid ${BR}`,
      }}
    >
      <div style={{ flex: "0 0 120px" }}>
        <p
          style={{
            fontFamily: YK,
            fontWeight: 700,
            fontSize: "0.8rem",
            letterSpacing: "0.1em",
            color: GOLD,
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          {colNameMap[col.name] ?? col.name}
        </p>
      </div>
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8,
          textAlign: "right",
        }}
      >
        <p
          style={{
            fontFamily: DM,
            fontSize: "0.82rem",
            color: GOLD_DIM,
            margin: 0,
          }}
        >
          {col.count.toLocaleString()} docs
        </p>
        <p
          style={{
            fontFamily: DM,
            fontSize: "0.82rem",
            color: GOLD_DIM,
            margin: 0,
          }}
        >
          {col.sizeKB} KB
        </p>
        <p
          style={{
            fontFamily: DM,
            fontSize: "0.75rem",
            color: "rgba(232,213,163,0.3)",
            margin: 0,
          }}
        >
          ~{col.avgDocKB} KB/doc
        </p>
      </div>
    </div>
  );
}

// ── Login Modal ───────────────────────────────────────────────────────────────

function LoginModal({
  onLogin,
  onClose,
}: {
  onLogin: (key: string) => void;
  onClose: () => void;
}) {
  const [pass, setPass] = useState("");
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);

  const attempt = async () => {
    if (!pass.trim()) return;
    setLoading(true);
    const res = await fetch(
      `/api/admin/storage?key=${encodeURIComponent(pass)}`,
    );
    setLoading(false);
    if (res.ok) {
      onLogin(pass);
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
        background: "rgba(0,0,0,0.78)",
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
          Usage Access
        </h2>
        <p
          style={{
            fontFamily: DM,
            fontSize: "0.82rem",
            color: GOLD_DIM,
            margin: "0 0 1.5rem",
          }}
        >
          Enter the secret key to view storage data.
        </p>
        <input
          type="password"
          value={pass}
          autoFocus
          onChange={(e) => {
            setPass(e.target.value);
            setErr(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && attempt()}
          placeholder="Secret key"
          style={{
            width: "100%",
            background: "rgba(232,213,163,0.04)",
            border: `1px solid ${err ? RED : BR_MED}`,
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
              color: RED,
              margin: "0 0 1rem",
            }}
          >
            Wrong key. Try again.
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
            disabled={loading}
            style={{
              flex: 2,
              fontFamily: YK,
              fontWeight: 700,
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              background: loading ? ACCENT_DIM : ACCENT,
              border: "none",
              color: BG,
              padding: "0.75rem",
              cursor: loading ? "wait" : "pointer",
            }}
          >
            {loading ? "Checking…" : "Enter"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Cleanup Modal ─────────────────────────────────────────────────────────────

function CleanupModal({
  ageBuckets,
  secretKey,
  onClose,
  onDone,
}: {
  ageBuckets: AgeBucket[];
  secretKey: string;
  onClose: () => void;
  onDone: () => void;
}) {
  const [days, setDays] = useState(30);
  const [confirmed, setConfirmed] = useState(false);
  const [status, setStatus] = useState<"idle" | "preview" | "running" | "done">(
    "idle",
  );
  const [previewCount, setPreviewCount] = useState<number | null>(null);
  const [result, setResult] = useState<{
    deleted: number;
    r2FilesDeleted: number;
  } | null>(null);

  const bucket = ageBuckets.find((b) => b.days === days);

  const handlePreview = async () => {
    setStatus("preview");
    const res = await fetch(
      `/api/admin/cleanup?key=${encodeURIComponent(secretKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days, dryRun: true }),
      },
    );
    const data = await res.json();
    setPreviewCount(data.count ?? 0);
  };

  const handleRun = async () => {
    setStatus("running");
    const res = await fetch(
      `/api/admin/cleanup?key=${encodeURIComponent(secretKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days, dryRun: false }),
      },
    );
    const data = await res.json();
    setResult(data);
    setStatus("done");
  };

  const dayOptions = [7, 14, 30, 60, 90];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.78)",
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
          maxWidth: 480,
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
              fontSize: "1.6rem",
              color: GOLD,
              margin: 0,
            }}
          >
            Clean Up Orders
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

        {status === "done" && result ? (
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <p
              style={{
                fontFamily: YK,
                fontWeight: 700,
                fontSize: "3rem",
                color: GREEN,
                margin: "0 0 0.5rem",
                lineHeight: 1,
              }}
            >
              {result.deleted}
            </p>
            <p
              style={{
                fontFamily: DM,
                fontSize: "0.9rem",
                color: GOLD_DIM,
                margin: "0 0 0.5rem",
              }}
            >
              orders deleted
            </p>
            {result.r2FilesDeleted > 0 && (
              <p
                style={{
                  fontFamily: DM,
                  fontSize: "0.78rem",
                  color: "rgba(232,213,163,0.35)",
                  margin: "0 0 1.5rem",
                }}
              >
                + {result.r2FilesDeleted} receipt file
                {result.r2FilesDeleted !== 1 ? "s" : ""} removed from R2
              </p>
            )}
            <button
              onClick={() => {
                onDone();
                onClose();
              }}
              style={{
                fontFamily: YK,
                fontWeight: 700,
                fontSize: "0.75rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                background: ACCENT,
                border: "none",
                color: BG,
                padding: "0.75rem 2rem",
                cursor: "pointer",
              }}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <p
              style={{
                fontFamily: DM,
                fontSize: "0.84rem",
                color: GOLD_DIM,
                margin: "0 0 1.25rem",
                lineHeight: 1.6,
              }}
            >
              Permanently deletes{" "}
              <strong style={{ color: GOLD }}>completed</strong> and{" "}
              <strong style={{ color: GOLD }}>cancelled</strong> orders older
              than the selected age, along with their GCash receipt files on R2.
            </p>

            {/* Age selector */}
            <div style={{ marginBottom: "1.25rem" }}>
              <p
                style={{
                  fontFamily: YK,
                  fontWeight: 700,
                  fontSize: "0.68rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: GOLD_DIM,
                  margin: "0 0 0.6rem",
                }}
              >
                Delete orders older than
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {dayOptions.map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setDays(d);
                      setConfirmed(false);
                      setPreviewCount(null);
                      setStatus("idle");
                    }}
                    style={{
                      fontFamily: YK,
                      fontWeight: 700,
                      fontSize: "0.72rem",
                      letterSpacing: "0.15em",
                      padding: "6px 14px",
                      border: `1px solid ${days === d ? ACCENT : BR}`,
                      background: days === d ? ACCENT_DIM : "transparent",
                      color: days === d ? ACCENT : GOLD_DIM,
                      cursor: "pointer",
                    }}
                  >
                    {d}d
                  </button>
                ))}
              </div>
            </div>

            {/* Estimate */}
            {bucket && (
              <div
                style={{
                  background: GOLD_FAINT,
                  border: `1px solid ${BR}`,
                  padding: "0.9rem 1rem",
                  marginBottom: "1.25rem",
                }}
              >
                <p
                  style={{
                    fontFamily: DM,
                    fontSize: "0.82rem",
                    color: GOLD_DIM,
                    margin: 0,
                  }}
                >
                  Roughly{" "}
                  <strong style={{ color: GOLD }}>
                    {bucket.count.toLocaleString()} orders
                  </strong>{" "}
                  are older than {days} days based on last fetch.{" "}
                  <span style={{ opacity: 0.5 }}>
                    (Completed/cancelled only — active orders are never
                    touched.)
                  </span>
                </p>
              </div>
            )}

            {/* Preview result */}
            {previewCount !== null && status === "preview" && (
              <div
                style={{
                  background: "rgba(192,80,77,0.08)",
                  border: `1px solid rgba(192,80,77,0.2)`,
                  padding: "0.9rem 1rem",
                  marginBottom: "1.25rem",
                }}
              >
                <p
                  style={{
                    fontFamily: DM,
                    fontSize: "0.82rem",
                    color: "#e87a77",
                    margin: 0,
                  }}
                >
                  Exact count:{" "}
                  <strong>{previewCount.toLocaleString()} orders</strong> will
                  be deleted. This cannot be undone.
                </p>
              </div>
            )}

            {/* Confirm checkbox */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
                marginBottom: "1.25rem",
              }}
            >
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                style={{
                  width: 16,
                  height: 16,
                  accentColor: ACCENT,
                  cursor: "pointer",
                }}
              />
              <span
                style={{ fontFamily: DM, fontSize: "0.8rem", color: GOLD_DIM }}
              >
                I understand this is permanent and cannot be undone.
              </span>
            </label>

            <div style={{ display: "flex", gap: 10 }}>
              {status !== "preview" && (
                <button
                  onClick={handlePreview}
                  disabled={!confirmed}
                  style={{
                    flex: 1,
                    fontFamily: YK,
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    background: "transparent",
                    border: `1px solid ${confirmed ? BR_MED : BR}`,
                    color: confirmed ? GOLD_DIM : "rgba(232,213,163,0.2)",
                    padding: "0.75rem",
                    cursor: confirmed ? "pointer" : "not-allowed",
                  }}
                >
                  Preview Count
                </button>
              )}
              <button
                onClick={handleRun}
                disabled={!confirmed || status === "running"}
                style={{
                  flex: 2,
                  fontFamily: YK,
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  background: confirmed ? RED : "rgba(192,80,77,0.15)",
                  border: "none",
                  color: confirmed ? "#fff" : "rgba(192,80,77,0.35)",
                  padding: "0.75rem",
                  cursor:
                    confirmed && status !== "running"
                      ? "pointer"
                      : "not-allowed",
                }}
              >
                {status === "running" ? "Deleting…" : "Delete Now"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function UsagePage() {
  const [secretKey, setSecretKey] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [data, setData] = useState<StorageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCleanup, setShowCleanup] = useState(false);

  const fetchData = useCallback(async (key: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/storage?key=${encodeURIComponent(key)}`,
      );
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Re-use saved key from sessionStorage if present
    const saved = sessionStorage.getItem("usage_key");
    if (saved) {
      setSecretKey(saved);
      fetchData(saved);
    } else setShowLogin(true);
  }, [fetchData]);

  const handleLogin = (key: string) => {
    setSecretKey(key);
    sessionStorage.setItem("usage_key", key);
    fetchData(key);
  };

  const totalDocs =
    data?.mongo.collections.reduce((s, c) => s + c.count, 0) ?? 0;

  return (
    <main style={{ minHeight: "100svh", background: BG }}>
      {/* Background texture */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage: `radial-gradient(ellipse 80% 50% at 50% -10%, rgba(212,168,67,0.05) 0%, transparent 70%)`,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ── Header ── */}
        <header
          style={{
            borderBottom: `1px solid ${BR}`,
            padding: `clamp(3.5rem, 7vw, 6rem) ${SITE_PADDING} clamp(1.75rem, 3.5vw, 2.5rem)`,
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
              fontSize: "clamp(2.6rem, 6.5vw, 5.5rem)",
              lineHeight: 0.88,
              letterSpacing: "0.01em",
              color: GOLD,
              textTransform: "uppercase",
              margin: "0 0 clamp(0.75rem, 1.5vw, 1.1rem)",
            }}
          >
            App
            <br />
            <em style={{ color: ACCENT, fontStyle: "italic" }}>Usage</em>
          </h1>
          <p
            style={{
              fontFamily: DM,
              fontSize: "clamp(0.82rem, 1.35vw, 0.97rem)",
              color: GOLD_DIM,
              lineHeight: 1.65,
              maxWidth: 400,
              margin: 0,
            }}
          >
            Storage, database health, and cleanup tools for 3rd Space.
          </p>
        </header>

        {/* ── Body ── */}
        <div
          style={{
            maxWidth: MAX_WIDTH,
            margin: "0 auto",
            padding: `clamp(2.5rem, 5vw, 4rem) ${SITE_PADDING}`,
            boxSizing: "border-box",
          }}
        >
          {!data && !loading && (
            <div style={{ textAlign: "center", padding: "4rem 0" }}>
              <p
                style={{
                  fontFamily: DM,
                  fontSize: "0.9rem",
                  color: GOLD_DIM,
                  marginBottom: "1.5rem",
                }}
              >
                Enter your secret key to view usage data.
              </p>
              <button
                onClick={() => setShowLogin(true)}
                style={{
                  fontFamily: YK,
                  fontWeight: 700,
                  fontSize: "0.76rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  background: ACCENT,
                  border: "none",
                  color: BG,
                  padding: "0.85rem 2.5rem",
                  cursor: "pointer",
                }}
              >
                Unlock Dashboard
              </button>
            </div>
          )}

          {loading && (
            <div style={{ textAlign: "center", padding: "4rem 0" }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  border: `2px solid ${ACCENT_DIM}`,
                  borderTopColor: ACCENT,
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  margin: "0 auto 1rem",
                }}
              />
              <p
                style={{ fontFamily: DM, fontSize: "0.84rem", color: GOLD_DIM }}
              >
                Fetching data…
              </p>
            </div>
          )}

          {data && (
            <>
              {/* ── Overview stats ── */}
              <section style={{ marginBottom: "clamp(3rem, 6vw, 4.5rem)" }}>
                <SectionDivider label="Overview" />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(160px, 1fr))",
                    gap: 12,
                  }}
                >
                  <StatCard
                    label="Total Docs"
                    value={totalDocs.toLocaleString()}
                    sub="across all collections"
                  />
                  <StatCard
                    label="Mongo Used"
                    value={fmtMB(data.mongo.storageMB)}
                    sub={`of ${fmtMB(data.mongo.limitMB)} free tier`}
                  />
                  <StatCard
                    label="R2 Files"
                    value={data.r2.files.toLocaleString()}
                    sub="receipt uploads"
                  />
                  <StatCard
                    label="R2 Storage"
                    value={fmtMB(data.r2.sizeMB)}
                    sub={`of ${fmtMB(data.r2.limitMB)} free tier`}
                  />
                </div>
              </section>

              {/* ── MongoDB ── */}
              <section style={{ marginBottom: "clamp(3rem, 6vw, 4.5rem)" }}>
                <SectionDivider label="MongoDB Atlas" />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "clamp(1rem, 3vw, 2rem)",
                  }}
                >
                  <div
                    style={{
                      background: BOARD,
                      border: `1px solid ${BR}`,
                      padding: "clamp(1rem, 2.5vw, 1.5rem)",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: YK,
                        fontWeight: 700,
                        fontSize: "0.68rem",
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: GOLD_DIM,
                        margin: "0 0 0.25rem",
                      }}
                    >
                      Storage
                    </p>
                    <p
                      style={{
                        fontFamily: YK,
                        fontWeight: 700,
                        fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                        color: GOLD,
                        margin: 0,
                        lineHeight: 1,
                      }}
                    >
                      {fmtMB(data.mongo.storageMB)}
                    </p>
                    <UsageBar
                      used={data.mongo.storageMB}
                      total={data.mongo.limitMB}
                    />
                  </div>
                  <div
                    style={{
                      background: BOARD,
                      border: `1px solid ${BR}`,
                      padding: "clamp(1rem, 2.5vw, 1.5rem)",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: YK,
                        fontWeight: 700,
                        fontSize: "0.68rem",
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: GOLD_DIM,
                        margin: "0 0 0.25rem",
                      }}
                    >
                      R2 Storage
                    </p>
                    <p
                      style={{
                        fontFamily: YK,
                        fontWeight: 700,
                        fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                        color: GOLD,
                        margin: 0,
                        lineHeight: 1,
                      }}
                    >
                      {fmtMB(data.r2.sizeMB)}
                    </p>
                    <UsageBar used={data.r2.sizeMB} total={data.r2.limitMB} />
                  </div>
                </div>

                <div
                  style={{
                    background: BOARD,
                    border: `1px solid ${BR}`,
                    padding: "clamp(1rem, 2.5vw, 1.5rem)",
                    marginTop: 12,
                  }}
                >
                  <p
                    style={{
                      fontFamily: YK,
                      fontWeight: 700,
                      fontSize: "0.68rem",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      color: GOLD_DIM,
                      margin: "0 0 0.25rem",
                    }}
                  >
                    Collections
                  </p>
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: "6px 0 8px",
                      borderBottom: `1px solid ${BR_MED}`,
                      marginBottom: 2,
                    }}
                  >
                    <div style={{ flex: "0 0 120px" }}>
                      <span
                        style={{
                          fontFamily: YK,
                          fontWeight: 700,
                          fontSize: "0.62rem",
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          color: "rgba(232,213,163,0.3)",
                        }}
                      >
                        Collection
                      </span>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 8,
                        textAlign: "right",
                      }}
                    >
                      {["Documents", "Size", "Avg/Doc"].map((h) => (
                        <span
                          key={h}
                          style={{
                            fontFamily: YK,
                            fontWeight: 700,
                            fontSize: "0.62rem",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            color: "rgba(232,213,163,0.3)",
                          }}
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                  {data.mongo.collections.map((c) => (
                    <CollectionRow key={c.name} col={c} />
                  ))}
                </div>
              </section>

              {/* ── Order age ── */}
              <section style={{ marginBottom: "clamp(3rem, 6vw, 4.5rem)" }}>
                <SectionDivider label="Order Age Breakdown" />
                <div
                  style={{
                    background: BOARD,
                    border: `1px solid ${BR}`,
                    padding: "clamp(1rem, 2.5vw, 1.5rem)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: DM,
                      fontSize: "0.82rem",
                      color: GOLD_DIM,
                      margin: "0 0 1rem",
                      lineHeight: 1.6,
                    }}
                  >
                    How many completed/cancelled orders exist past each age
                    threshold. These are candidates for cleanup.
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(120px, 1fr))",
                      gap: 10,
                    }}
                  >
                    {data.ageBuckets.map(({ days, count }) => (
                      <div
                        key={days}
                        style={{
                          background: GOLD_FAINT,
                          border: `1px solid ${BR}`,
                          padding: "0.9rem",
                          textAlign: "center",
                        }}
                      >
                        <p
                          style={{
                            fontFamily: YK,
                            fontWeight: 700,
                            fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                            color: count > 0 ? ACCENT : "rgba(232,213,163,0.2)",
                            margin: "0 0 0.25rem",
                            lineHeight: 1,
                          }}
                        >
                          {count.toLocaleString()}
                        </p>
                        <p
                          style={{
                            fontFamily: DM,
                            fontSize: "0.7rem",
                            color: "rgba(232,213,163,0.4)",
                            margin: 0,
                          }}
                        >
                          older than {days}d
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* ── Cleanup ── */}
              <section style={{ marginBottom: "clamp(3rem, 6vw, 4.5rem)" }}>
                <SectionDivider label="Cleanup" />
                <div
                  style={{
                    background: BOARD,
                    border: `1px solid rgba(192,80,77,0.2)`,
                    padding: "clamp(1rem, 2.5vw, 1.5rem)",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "1.25rem",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 240 }}>
                    <p
                      style={{
                        fontFamily: YK,
                        fontWeight: 700,
                        fontSize: "0.76rem",
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: "#e87a77",
                        margin: "0 0 0.5rem",
                      }}
                    >
                      ◆ Purge Old Orders
                    </p>
                    <p
                      style={{
                        fontFamily: DM,
                        fontSize: "0.82rem",
                        color: GOLD_DIM,
                        margin: 0,
                        lineHeight: 1.65,
                      }}
                    >
                      Permanently delete completed and cancelled orders past a
                      chosen age, and remove their GCash receipt files from R2.
                      Pending and active orders are never affected.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCleanup(true)}
                    style={{
                      fontFamily: YK,
                      fontWeight: 700,
                      fontSize: "0.72rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      background: "rgba(192,80,77,0.12)",
                      border: `1px solid rgba(192,80,77,0.35)`,
                      color: "#e87a77",
                      padding: "0.75rem 1.5rem",
                      cursor: "pointer",
                      flexShrink: 0,
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(192,80,77,0.22)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(192,80,77,0.12)";
                    }}
                  >
                    Open Cleanup Tool
                  </button>
                </div>
              </section>

              {/* Last refreshed */}
              <p
                style={{
                  fontFamily: DM,
                  fontSize: "0.72rem",
                  color: "rgba(232,213,163,0.25)",
                  textAlign: "center",
                  marginTop: "clamp(1rem, 3vw, 2rem)",
                }}
              >
                Data fetched {new Date(data.ts).toLocaleTimeString()} ·{" "}
                <button
                  onClick={() => fetchData(secretKey)}
                  style={{
                    background: "none",
                    border: "none",
                    color: GOLD_DIM,
                    cursor: "pointer",
                    fontFamily: DM,
                    fontSize: "0.72rem",
                    textDecoration: "underline",
                    padding: 0,
                  }}
                >
                  Refresh
                </button>
              </p>
            </>
          )}
        </div>

        <Footer />
      </div>

      {/* Modals */}
      {showLogin && (
        <LoginModal onLogin={handleLogin} onClose={() => setShowLogin(false)} />
      )}
      {showCleanup && data && (
        <CleanupModal
          ageBuckets={data.ageBuckets}
          secretKey={secretKey}
          onClose={() => setShowCleanup(false)}
          onDone={() => fetchData(secretKey)}
        />
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Yanone+Kaffeesatz:wght@400;700&family=DM+Sans:wght@400;500;700&display=swap');
        * { box-sizing: border-box; }
        ::placeholder { color: rgba(232,213,163,0.25) !important; }
        input { caret-color: #d4a843; }
        .stat-card { transition: border-color .2s; }
        .stat-card:hover { border-color: ${BR_MED} !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 560px) {
          [data-grid-cols] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
