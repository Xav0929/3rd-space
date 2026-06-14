"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const YK = "var(--font-yanone), 'Yanone Kaffeesatz', sans-serif";
const DM = "var(--font-dm), 'DM Sans', sans-serif";

type FeaturedItem = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
};

const CATEGORY_EMOJI: Record<string, string> = {
  coffee: "☕",
  noncoffee: "🫖",
  matcha: "🍵",
  food: "🍞",
  specials: "✦",
};

const SESSION_KEY = "ts_featured_seen";

export default function FeaturedPopup() {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [featured, setFeatured] = useState<FeaturedItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;

    fetch("/api/menu?featured=true")
      .then((r) => r.json())
      .then((data) => {
        const items: FeaturedItem[] = Array.isArray(data)
          ? data.filter(
              (i: FeaturedItem & { featured?: boolean }) => i.featured,
            )
          : (data.items ?? []).filter(
              (i: FeaturedItem & { featured?: boolean }) => i.featured,
            );

        if (items.length === 0) return;
        setFeatured(items);

        setTimeout(() => {
          setVisible(true);
          sessionStorage.setItem(SESSION_KEY, "1");
        }, 1800);
      })
      .catch(() => {});
  }, []);

  const dismiss = () => {
    setExiting(true);
    setTimeout(() => setVisible(false), 420);
  };

  const next = () => setCurrentIdx((i) => (i + 1) % featured.length);
  const prev = () =>
    setCurrentIdx((i) => (i - 1 + featured.length) % featured.length);

  if (!visible || featured.length === 0) return null;

  const item = featured[currentIdx];

  return (
    <>
      <style>{`
        /* ─── FeaturedPopup ─────────────────────────────────────── */

        .fp-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9000;
          /* Bottom-left on desktop/tablet, bottom-center on phone */
          display: flex;
          align-items: flex-end;
          justify-content: flex-start;
          padding: clamp(1rem, 3vw, 2.5rem);
          pointer-events: none;
          /* iOS safe area */
          padding-bottom: max(clamp(1rem, 3vw, 2.5rem), env(safe-area-inset-bottom));
          padding-left: max(clamp(1rem, 3vw, 2.5rem), env(safe-area-inset-left));
        }

        .fp-card {
          pointer-events: all;
          width: clamp(260px, 30vw, 340px);
          background: rgba(10, 18, 10, 0.97);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 0.5px solid rgba(232,213,163,0.18);
          box-shadow: 0 24px 60px rgba(0,0,0,0.7);
          transition: transform 0.42s cubic-bezier(0.4,0,0.2,1),
                      opacity 0.42s ease;
          animation: fp-rise 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }

        /* Exiting state — toggled via class to avoid re-injecting the style block */
        .fp-card.exiting {
          transform: translateY(16px) !important;
          opacity: 0 !important;
        }

        @keyframes fp-rise {
          from { transform: translateY(24px); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }

        /* ── Header ── */
        .fp-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.7rem 0.9rem 0;
        }

        .fp-eyebrow {
          font-family: ${DM};
          font-size: 8.5px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(212,168,67,0.7);
          display: flex;
          align-items: center;
          gap: 5px;
          margin: 0;
        }

        .fp-live-dot {
          width: 5px;
          height: 5px;
          background: #d4a843;
          border-radius: 50%;
          flex-shrink: 0;
          animation: fp-blink 2s ease-in-out infinite;
        }

        @keyframes fp-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }

        /* Close button — 44px tap target via padding trick */
        .fp-close {
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(232,213,163,0.3);
          /* Visual icon is 14px but tap area is 44px */
          padding: 15px;
          margin: -15px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
          -webkit-tap-highlight-color: transparent;
          flex-shrink: 0;
        }
        .fp-close:hover,
        .fp-close:focus-visible { color: rgba(232,213,163,0.7); outline: none; }

        /* ── Body ── */
        .fp-body {
          padding: 0.75rem 0.9rem 0.9rem;
          display: flex;
          gap: 0.85rem;
          align-items: flex-start;
        }

        .fp-thumb {
          width: 60px;
          height: 60px;
          flex-shrink: 0;
          background: rgba(232,213,163,0.05);
          border: 0.5px solid rgba(232,213,163,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          overflow: hidden;
        }
        .fp-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .fp-meta { flex: 1; min-width: 0; }

        .fp-category {
          font-family: ${DM};
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(232,213,163,0.35);
          margin: 0 0 3px;
        }

        .fp-name {
          font-family: ${YK};
          font-weight: 700;
          font-size: 20px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #e8d5a3;
          line-height: 1;
          margin: 0 0 4px;
          /* Prevent overflow on narrow phones */
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .fp-desc {
          font-family: ${DM};
          font-size: 10.5px;
          color: rgba(232,213,163,0.38);
          line-height: 1.5;
          margin: 0 0 8px;
        }

        .fp-price {
          font-family: ${YK};
          font-weight: 700;
          font-size: 16px;
          color: #d4a843;
          margin: 0;
        }

        /* ── Footer ── */
        .fp-footer {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 0.9rem;
          border-top: 0.5px solid rgba(232,213,163,0.08);
        }

        .fp-nav {
          display: flex;
          gap: 4px;
          flex-shrink: 0;
        }

        /* Nav buttons — 44px tap target */
        .fp-nav-btn {
          width: 44px;
          height: 44px;
          background: rgba(232,213,163,0.06);
          border: 0.5px solid rgba(232,213,163,0.1);
          color: rgba(232,213,163,0.45);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, color 0.2s;
          -webkit-tap-highlight-color: transparent;
        }
        .fp-nav-btn:hover,
        .fp-nav-btn:focus-visible {
          background: rgba(232,213,163,0.1);
          color: #e8d5a3;
          outline: none;
        }

        .fp-dots {
          display: flex;
          gap: 4px;
          flex: 1;
          justify-content: center;
          align-items: center;
        }

        .fp-dot-pill {
          height: 3px;
          width: 14px;
          background: rgba(232,213,163,0.15);
          transition: background 0.2s, width 0.2s;
        }
        .fp-dot-pill.active {
          background: #d4a843;
          width: 20px;
        }

        .fp-cta {
          font-family: ${DM};
          font-weight: 500;
          font-size: 9.5px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          /* 44px tap target height */
          padding: 0 14px;
          height: 44px;
          display: inline-flex;
          align-items: center;
          background: #e8d5a3;
          color: #0f1a0f;
          text-decoration: none;
          flex-shrink: 0;
          transition: background 0.2s;
          -webkit-tap-highlight-color: transparent;
          white-space: nowrap;
        }
        .fp-cta:hover { background: #d4a843; }

        /* ─── MOBILE PORTRAIT (≤480px) ──────────────────────────── */
        /* Card stretches across bottom, centered */
        @media (max-width: 480px) {
          .fp-backdrop {
            justify-content: center;
            padding-left: clamp(0.75rem, 4vw, 1rem);
            padding-right: clamp(0.75rem, 4vw, 1rem);
            padding-bottom: max(1rem, env(safe-area-inset-bottom));
          }

          .fp-card {
            /* Full available width minus backdrop padding */
            width: 100%;
            max-width: 400px;
          }
        }

        /* ─── VERY SMALL PHONES (≤360px) ────────────────────────── */
        @media (max-width: 360px) {
          .fp-thumb {
            width: 48px;
            height: 48px;
            font-size: 20px;
          }

          .fp-name {
            font-size: 17px;
          }

          .fp-desc {
            font-size: 9.5px;
          }

          /* Hide description on very small phones to save space */
          .fp-desc {
            display: none;
          }

          .fp-top {
            padding: 0.6rem 0.75rem 0;
          }

          .fp-body {
            padding: 0.6rem 0.75rem 0.75rem;
          }

          .fp-footer {
            padding: 0.5rem 0.75rem;
          }

          .fp-cta {
            font-size: 8.5px;
            padding: 0 10px;
          }
        }

        /* ─── LANDSCAPE PHONES (short viewport) ─────────────────── */
        @media (orientation: landscape) and (max-height: 600px) {
          .fp-backdrop {
            /* Bottom-right on landscape phones — avoids navbar on left */
            justify-content: flex-end;
            padding: 0.75rem;
            padding-right: max(0.75rem, env(safe-area-inset-right));
            padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
          }

          .fp-card {
            /* Compact horizontal layout on landscape phone */
            width: clamp(260px, 48vw, 320px);
          }

          /* Tighten padding everywhere */
          .fp-top {
            padding: 0.5rem 0.75rem 0;
          }

          .fp-body {
            padding: 0.5rem 0.75rem 0.6rem;
            gap: 0.65rem;
          }

          .fp-thumb {
            width: 48px;
            height: 48px;
            font-size: 20px;
          }

          .fp-name {
            font-size: 17px;
          }

          /* Hide description on landscape phones — too short to fit */
          .fp-desc {
            display: none;
          }

          .fp-footer {
            padding: 0.4rem 0.75rem;
          }

          .fp-nav-btn {
            width: 36px;
            height: 36px;
          }

          .fp-cta {
            height: 36px;
          }
        }

        /* ─── TABLETS (641px+) ───────────────────────────────────── */
        /* Stays bottom-left, original sizing — already fine */
        @media (min-width: 641px) {
          .fp-card {
            width: clamp(280px, 28vw, 340px);
          }
        }
      `}</style>

      <div className="fp-backdrop">
        <div className={`fp-card${exiting ? " exiting" : ""}`}>
          {/* Header */}
          <div className="fp-top">
            <p className="fp-eyebrow">
              <span className="fp-live-dot" />
              Today&apos;s picks
            </p>
            <button
              className="fp-close"
              onClick={dismiss}
              aria-label="Close popup"
            >
              <svg
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="fp-body">
            <div className="fp-thumb">
              {item.image ? (
                <img src={item.image} alt={item.name} />
              ) : (
                <span>
                  {CATEGORY_EMOJI[item.category.toLowerCase()] ?? "✦"}
                </span>
              )}
            </div>
            <div className="fp-meta">
              <p className="fp-category">{item.category}</p>
              <p className="fp-name">{item.name}</p>
              <p className="fp-desc">{item.description}</p>
              <p className="fp-price">₱{item.price.toLocaleString()}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="fp-footer">
            {featured.length > 1 && (
              <div className="fp-nav">
                <button
                  className="fp-nav-btn"
                  onClick={prev}
                  aria-label="Previous item"
                >
                  <svg
                    width="12"
                    height="12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  className="fp-nav-btn"
                  onClick={next}
                  aria-label="Next item"
                >
                  <svg
                    width="12"
                    height="12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            {featured.length > 1 && (
              <div className="fp-dots">
                {featured.map((_, i) => (
                  <div
                    key={i}
                    className={`fp-dot-pill${i === currentIdx ? " active" : ""}`}
                  />
                ))}
              </div>
            )}

            <Link href="/menu" className="fp-cta" onClick={dismiss}>
              Full menu
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
