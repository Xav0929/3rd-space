"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const SITE_PADDING = "clamp(1.5rem, 5vw, 3rem)";
const YK = "var(--font-yanone), 'Yanone Kaffeesatz', sans-serif";
const DM = "var(--font-dm), 'DM Sans', sans-serif";

type MenuItem = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  featured?: boolean;
  isNew?: boolean;
  popular?: boolean;
  available?: boolean;
  image?: string;
};

const CATEGORY_EMOJI: Record<string, string> = {
  coffee: "☕",
  noncoffee: "🫖",
  matcha: "🍵",
  food: "🍞",
  specials: "✦",
};

const TICKER_ITEMS = [
  "Stay a Little Longer",
  "80% Arabica · 20% Robusta",
  "Roast: Medium Dark",
  "Fresh Brews Daily",
  "Dine In · Take Out · Delivery",
];

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [previewItem, setPreviewItem] = useState<MenuItem | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const previewTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : (data.items ?? []));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = [
    "all",
    ...Array.from(new Set(items.map((i) => i.category.toLowerCase()))),
  ];

  const filtered =
    activeCategory === "all"
      ? items
      : items.filter((i) => i.category.toLowerCase() === activeCategory);

  const grouped = filtered.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const key = item.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  function handleItemEnter(item: MenuItem) {
    if (!item.image) return;
    if (previewTimeout.current) clearTimeout(previewTimeout.current);
    setPreviewItem(item);
    setPreviewVisible(true);
  }

  function handleItemLeave() {
    previewTimeout.current = setTimeout(() => {
      setPreviewVisible(false);
    }, 180);
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .menu-root {
          background: #0c160c;
          min-height: 100vh;
          color: #e8d5a3;
        }

        /* ── HEADER ── */
        .menu-header {
          position: relative;
          padding: clamp(5rem, 10vw, 7rem) ${SITE_PADDING} 0;
          max-width: 1400px;
          margin: 0 auto;
          overflow: hidden;
        }

        .menu-header::before {
          content: 'MENU';
          position: absolute;
          top: -0.05em;
          left: -0.03em;
          font-family: ${YK};
          font-weight: 700;
          font-size: clamp(8rem, 20vw, 20rem);
          color: rgba(232,213,163,0.025);
          letter-spacing: -0.02em;
          text-transform: uppercase;
          line-height: 1;
          pointer-events: none;
          user-select: none;
        }

        .back-link {
          font-family: ${DM};
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(232,213,163,0.3);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: color 0.2s;
          margin-bottom: 2rem;
        }
        .back-link:hover { color: rgba(232,213,163,0.7); }
        .back-link:hover svg { transform: translateX(-3px); }
        .back-link svg { transition: transform 0.2s; }

        .menu-eyebrow {
          font-family: ${DM};
          font-size: clamp(0.5rem, 0.8vw, 0.65rem);
          letter-spacing: 0.42em;
          color: rgba(232,213,163,0.35);
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }

        .menu-title {
          font-family: ${YK};
          font-weight: 700;
          font-size: clamp(3.5rem, 7vw, 6.5rem);
          line-height: 0.9;
          letter-spacing: 0.01em;
          text-transform: uppercase;
          color: #e8d5a3;
          margin-bottom: 1.25rem;
        }

        .menu-title em { color: #d4a843; font-style: italic; }

        .menu-sub {
          font-family: ${DM};
          font-weight: 300;
          font-size: clamp(0.8rem, 1.2vw, 0.95rem);
          color: rgba(232,213,163,0.38);
          max-width: 340px;
          line-height: 1.7;
          margin-bottom: 2.5rem;
        }

        .h-rule {
          height: 0.5px;
          background: linear-gradient(to right, rgba(232,213,163,0.15), transparent);
        }

        /* ── TICKER ── */
        .ticker-wrap {
          overflow: hidden;
          background: rgba(212,168,67,0.05);
          border-top: 0.5px solid rgba(212,168,67,0.1);
          border-bottom: 0.5px solid rgba(212,168,67,0.1);
          padding: 0.55rem 0;
        }

        .ticker-track {
          display: flex;
          width: max-content;
          animation: ticker 26s linear infinite;
        }

        .ticker-track:hover { animation-play-state: paused; }

        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        .ticker-item {
          font-family: ${YK};
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(212,168,67,0.65);
          white-space: nowrap;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .ticker-item::after {
          content: '✦';
          font-size: 7px;
          color: rgba(212,168,67,0.3);
        }

        /* ── CATEGORY PILLS ── */
        .cat-bar {
          position: sticky;
          top: 0;
          z-index: 20;
          background: rgba(12,22,12,0.94);
          backdrop-filter: blur(16px);
          border-bottom: 0.5px solid rgba(232,213,163,0.07);
        }

        .cat-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 ${SITE_PADDING};
          display: flex;
          flex-wrap: wrap;
          overflow-x: auto;
          scrollbar-width: none;
          gap: 0;
        }

        .cat-inner::-webkit-scrollbar { display: none; }

        .cat-btn {
          font-family: ${DM};
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 0.9rem 1rem;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          color: rgba(232,213,163,0.3);
          cursor: pointer;
          white-space: nowrap;
          transition: color 0.2s, border-color 0.2s;
          flex-shrink: 0;
        }

        .cat-btn:hover { color: rgba(232,213,163,0.65); }
        .cat-btn.active { color: #d4a843; border-bottom-color: #d4a843; }

        /* ── MAIN TWO-PANEL ── */
        .main-layout {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 ${SITE_PADDING};
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 3rem;
          align-items: start;
        }

        /* ── MENU LIST PANEL ── */
        .menu-list {
          padding: 2.5rem 0 5rem;
          min-width: 0;
        }

        .menu-section { margin-bottom: 2.5rem; }

        .section-head {
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
          padding-bottom: 0.65rem;
          margin-bottom: 0;
          border-bottom: 0.5px solid rgba(232,213,163,0.06);
          position: relative;
        }

        .section-head::before {
          content: '';
          position: absolute;
          bottom: -0.5px;
          left: 0;
          width: 36px;
          height: 1px;
          background: #d4a843;
          opacity: 0.5;
        }

        .section-cat-name {
          font-family: ${YK};
          font-weight: 700;
          font-size: clamp(1.5rem, 2.5vw, 2rem);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #e8d5a3;
          line-height: 1;
        }

        .section-cat-count {
          font-family: ${DM};
          font-size: 10px;
          color: rgba(232,213,163,0.22);
          letter-spacing: 0.1em;
          margin-left: auto;
        }

        /* ── ITEM ROW ── */
        .item-row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 1rem;
          align-items: start;
          padding: 1rem 0;
          border-bottom: 0.5px solid rgba(232,213,163,0.05);
          cursor: default;
          transition: background 0.15s;
          position: relative;
        }

        .item-row.has-image {
          cursor: pointer;
        }

        .item-row.has-image:hover .item-row-name {
          color: #d4a843;
        }

        .item-row.has-image:hover .item-row-dot {
          background: #d4a843;
          opacity: 1;
        }

        .item-row-left {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          min-width: 0;
        }

        .item-row-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(232,213,163,0.2);
          flex-shrink: 0;
          margin-top: 0.55rem;
          transition: background 0.2s, opacity 0.2s;
        }

        .item-row-text { min-width: 0; }

        .item-row-top {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
          margin-bottom: 3px;
        }

        .item-row-name {
          font-family: ${YK};
          font-weight: 700;
          font-size: clamp(1.1rem, 1.8vw, 1.35rem);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #e8d5a3;
          line-height: 1.1;
          transition: color 0.2s;
        }

        .item-badge {
          font-family: ${DM};
          font-size: 8px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 2px 6px;
        }

        .badge-pop {
          background: rgba(212,168,67,0.1);
          color: rgba(212,168,67,0.8);
          border: 0.5px solid rgba(212,168,67,0.2);
        }

        .badge-new {
          background: rgba(120,200,120,0.08);
          color: rgba(120,200,120,0.8);
          border: 0.5px solid rgba(120,200,120,0.2);
        }

        .badge-pick {
          background: rgba(212,168,67,0.07);
          color: rgba(212,168,67,0.65);
          border: 0.5px solid rgba(212,168,67,0.15);
        }

        .item-row-desc {
          font-family: ${DM};
          font-size: 11.5px;
          color: rgba(232,213,163,0.32);
          line-height: 1.55;
        }

        .item-row-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
          flex-shrink: 0;
          padding-top: 2px;
        }

        .item-row-price {
          font-family: ${YK};
          font-weight: 700;
          font-size: 1.1rem;
          color: #d4a843;
          white-space: nowrap;
        }

        .item-row-sub {
          font-family: ${DM};
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(232,213,163,0.2);
        }

        .item-row-eye {
          font-size: 9px;
          color: rgba(232,213,163,0.18);
          letter-spacing: 0.05em;
          font-family: ${DM};
        }

        /* ── PREVIEW PANEL ── */
        .preview-panel {
          position: sticky;
          top: 80px;
          height: calc(100vh - 120px);
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .preview-box {
          flex: 1;
          position: relative;
          overflow: hidden;
          border: 0.5px solid rgba(232,213,163,0.07);
          background: rgba(232,213,163,0.02);
        }

        /* Bottom gradient fade */
        .preview-box::after {
          content: '';
          position: absolute;
          inset: 0;
          background:
            linear-gradient(to top, rgba(12,22,12,0.7) 0%, rgba(12,22,12,0.1) 45%, transparent 70%),
            linear-gradient(to bottom, rgba(12,22,12,0.25) 0%, transparent 30%);
          z-index: 2;
          pointer-events: none;
        }

        /* Grain texture overlay */
        .preview-box::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E");
          background-size: 180px 180px;
          opacity: 0.35;
          z-index: 3;
          pointer-events: none;
          mix-blend-mode: overlay;
        }

        .preview-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.35s ease, transform 0.5s ease;
        }

        .preview-img.visible {
          opacity: 1;
          transform: scale(1);
        }

        .preview-img.hidden {
          opacity: 0;
          transform: scale(1.04);
        }

        .preview-empty {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: opacity 0.3s;
        }

        .preview-empty.hidden { opacity: 0; }

        .preview-empty-icon {
          font-size: 2.5rem;
          opacity: 0.12;
        }

        .preview-empty-text {
          font-family: ${DM};
          font-size: 9px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(232,213,163,0.18);
        }

        .preview-meta {
          padding: 1.1rem 0 0;
          min-height: 80px;
          transition: opacity 0.25s;
        }

        .preview-meta.hidden { opacity: 0; }

        .preview-cat {
          font-family: ${DM};
          font-size: 9px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(212,168,67,0.5);
          margin-bottom: 5px;
        }

        .preview-name {
          font-family: ${YK};
          font-weight: 700;
          font-size: 1.6rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #e8d5a3;
          line-height: 1;
          margin-bottom: 6px;
        }

        .preview-desc {
          font-family: ${DM};
          font-size: 11.5px;
          color: rgba(232,213,163,0.35);
          line-height: 1.6;
          margin-bottom: 10px;
        }

        .preview-price {
          font-family: ${YK};
          font-weight: 700;
          font-size: 1.4rem;
          color: #d4a843;
        }

        /* ── LOADING ── */
        .loading-wrap {
          max-width: 1400px;
          margin: 0 auto;
          padding: 5rem ${SITE_PADDING};
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .loading-dot {
          width: 6px;
          height: 6px;
          background: #d4a843;
          border-radius: 50%;
          animation: pulse 1.2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1.2); }
        }

        .loading-text {
          font-family: ${DM};
          font-size: 11px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(232,213,163,0.28);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .main-layout {
            grid-template-columns: 1fr;
          }
          .preview-panel { display: none; }
        }
      `}</style>

      <div className="menu-root">
        {/* HEADER */}
        <div className="menu-header">
          <Link href="/" className="back-link">
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path d="M19 12H5M5 12l7-7M5 12l7 7" />
            </svg>
            Back to home
          </Link>
          <p className="menu-eyebrow">Third Space Café</p>
          <h1 className="menu-title">
            What We
            <br />
            <em>Serve</em>
          </h1>
          <p className="menu-sub">
            Everything on our menu is made with intention — slow, warm, and
            worth sitting down for.
          </p>
          <div className="h-rule" />
        </div>

        {/* TICKER */}
        <div className="ticker-wrap">
          <div className="ticker-track">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
              <span className="ticker-item" key={i}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* CATEGORY TABS */}
        <div className="cat-bar">
          <div className="cat-inner">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`cat-btn${activeCategory === cat ? " active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat === "all"
                  ? "All"
                  : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading-wrap">
            <div className="loading-dot" />
            <p className="loading-text">Preparing the menu…</p>
          </div>
        ) : (
          <div className="main-layout">
            {/* ── LEFT: MENU LIST ── */}
            <div className="menu-list">
              {Object.entries(grouped).map(([category, categoryItems]) => {
                const available = categoryItems.filter(
                  (i) => i.available !== false,
                );
                if (!available.length) return null;
                if (
                  category.toLowerCase() === "add-ons" ||
                  category.toLowerCase() === "add ons"
                )
                  return null;
                return (
                  <div className="menu-section" key={category}>
                    <div className="section-head">
                      <h2 className="section-cat-name">{category}</h2>
                      <span className="section-cat-count">
                        {available.length} items
                      </span>
                    </div>

                    {available.map((item) => (
                      <div
                        key={item._id}
                        className={`item-row${item.image ? " has-image" : ""}`}
                        onMouseEnter={() => handleItemEnter(item)}
                        onMouseLeave={handleItemLeave}
                      >
                        <div className="item-row-left">
                          <div className="item-row-dot" />
                          <div className="item-row-text">
                            <div className="item-row-top">
                              <span className="item-row-name">{item.name}</span>
                              {item.featured && (
                                <span className="item-badge badge-pick">
                                  Pick
                                </span>
                              )}
                              {item.popular && (
                                <span className="item-badge badge-pop">
                                  Popular
                                </span>
                              )}
                              {item.isNew && (
                                <span className="item-badge badge-new">
                                  New
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className="item-row-desc">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="item-row-right">
                          <span className="item-row-price">
                            ₱{item.price.toLocaleString()}
                          </span>
                          {item.subcategory && (
                            <span className="item-row-sub">
                              {item.subcategory}
                            </span>
                          )}
                          {item.image && (
                            <span className="item-row-eye">
                              hover to preview
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* ── RIGHT: PREVIEW PANEL ── */}
            <div className="preview-panel">
              <div className="preview-box">
                {/* Empty state */}
                <div
                  className={`preview-empty${previewVisible ? " hidden" : ""}`}
                >
                  <span className="preview-empty-icon">☕</span>
                  <span className="preview-empty-text">Hover an item</span>
                </div>

                {/* Image */}
                {previewItem?.image && (
                  <img
                    key={previewItem._id}
                    src={previewItem.image}
                    alt={previewItem.name}
                    className={`preview-img${previewVisible ? " visible" : " hidden"}`}
                  />
                )}
              </div>

              {/* Meta below image */}
              <div
                className={`preview-meta${previewVisible && previewItem ? "" : " hidden"}`}
              >
                {previewItem && (
                  <>
                    <p className="preview-cat">{previewItem.category}</p>
                    <p className="preview-name">{previewItem.name}</p>
                    {previewItem.description && (
                      <p className="preview-desc">{previewItem.description}</p>
                    )}
                    <p className="preview-price">
                      ₱{previewItem.price.toLocaleString()}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
