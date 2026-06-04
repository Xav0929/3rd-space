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
    // Only show once per session
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

        // Slight delay so it doesn't pop immediately on page load
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

  const next = () => {
    setCurrentIdx((i) => (i + 1) % featured.length);
  };

  const prev = () => {
    setCurrentIdx((i) => (i - 1 + featured.length) % featured.length);
  };

  if (!visible || featured.length === 0) return null;

  const item = featured[currentIdx];

  return (
    <>
      <style>{`
        .fp-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9000;
          display: flex;
          align-items: flex-end;
          justify-content: flex-start;
          padding: clamp(1.5rem, 3vw, 2.5rem);
          pointer-events: none;
        }

        .fp-card {
          pointer-events: all;
          width: clamp(260px, 30vw, 340px);
          background: rgba(10, 18, 10, 0.96);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 0.5px solid rgba(232,213,163,0.18);
          box-shadow: 0 24px 60px rgba(0,0,0,0.7);
          transform: ${exiting ? "translateY(16px)" : "translateY(0)"};
          opacity: ${exiting ? "0" : "1"};
          transition: transform 0.42s cubic-bezier(0.4,0,0.2,1), opacity 0.42s ease;
          animation: fp-rise 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }

        @keyframes fp-rise {
          from { transform: translateY(24px); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }

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
        }

        .fp-dot {
          width: 5px;
          height: 5px;
          background: #d4a843;
          border-radius: 50%;
          animation: fp-blink 2s ease-in-out infinite;
        }

        @keyframes fp-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .fp-close {
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(232,213,163,0.3);
          padding: 2px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }

        .fp-close:hover { color: rgba(232,213,163,0.7); }

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

        .fp-category {
          font-family: ${DM};
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(232,213,163,0.35);
          margin-bottom: 3px;
        }

        .fp-name {
          font-family: ${YK};
          font-weight: 700;
          font-size: 20px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #e8d5a3;
          line-height: 1;
          margin-bottom: 4px;
        }

        .fp-desc {
          font-family: ${DM};
          font-size: 10.5px;
          color: rgba(232,213,163,0.38);
          line-height: 1.5;
          margin-bottom: 8px;
        }

        .fp-price {
          font-family: ${YK};
          font-weight: 700;
          font-size: 16px;
          color: #d4a843;
        }

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
        }

        .fp-nav-btn {
          width: 28px;
          height: 28px;
          background: rgba(232,213,163,0.06);
          border: 0.5px solid rgba(232,213,163,0.1);
          color: rgba(232,213,163,0.45);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, color 0.2s;
        }

        .fp-nav-btn:hover {
          background: rgba(232,213,163,0.1);
          color: #e8d5a3;
        }

        .fp-dots {
          display: flex;
          gap: 4px;
          flex: 1;
          justify-content: center;
          align-items: center;
        }

        .fp-dot-pill {
          width: 14px;
          height: 3px;
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
          padding: 7px 14px;
          background: #e8d5a3;
          color: #0f1a0f;
          text-decoration: none;
          flex-shrink: 0;
          transition: background 0.2s;
          display: inline-block;
        }

        .fp-cta:hover { background: #d4a843; }
      `}</style>

      <div className="fp-backdrop">
        <div className="fp-card">
          <div className="fp-top">
            <p className="fp-eyebrow">
              <span className="fp-dot" />
              Today's picks
            </p>
            <button className="fp-close" onClick={dismiss} aria-label="Close">
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
            <div>
              <p className="fp-category">{item.category}</p>
              <p className="fp-name">{item.name}</p>
              <p className="fp-desc">{item.description}</p>
              <p className="fp-price">₱{item.price.toLocaleString()}</p>
            </div>
          </div>

          <div className="fp-footer">
            {featured.length > 1 && (
              <div className="fp-nav">
                <button
                  className="fp-nav-btn"
                  onClick={prev}
                  aria-label="Previous"
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
                <button className="fp-nav-btn" onClick={next} aria-label="Next">
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
