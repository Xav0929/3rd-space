"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const SITE_PADDING = "clamp(1.5rem, 5vw, 4rem)";
const MAX_WIDTH = 1280;
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

const CATEGORY_LABELS: Record<string, string> = {
  all: "All",
  coffee: "Coffee",
  noncoffee: "Non-Coffee",
  matcha: "Matcha",
  food: "Food",
  specials: "Specials",
};

const CATEGORY_EMOJI: Record<string, string> = {
  coffee: "☕",
  noncoffee: "🫖",
  matcha: "🍵",
  food: "🍞",
  specials: "✦",
};

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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

  const featured = items.filter((i) => i.featured && i.available !== false);

  const grouped = filtered.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const key = item.category;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Yanone+Kaffeesatz:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');

        .menu-page {
          background: #0c160c;
          min-height: 100vh;
          color: #e8d5a3;
        }

        /* ── HEADER ── */
        .menu-header {
          position: relative;
          padding: clamp(5rem, 10vw, 8rem) ${SITE_PADDING} 0;
          max-width: ${MAX_WIDTH}px;
          margin: 0 auto;
          overflow: hidden;
        }

        .menu-header::before {
          content: 'MENU';
          position: absolute;
          top: -0.1em;
          left: -0.05em;
          font-family: ${YK};
          font-weight: 700;
          font-size: clamp(8rem, 18vw, 18rem);
          color: rgba(232,213,163,0.03);
          letter-spacing: -0.02em;
          text-transform: uppercase;
          line-height: 1;
          pointer-events: none;
          user-select: none;
        }

        .menu-eyebrow {
          font-family: ${DM};
          font-size: clamp(0.5rem, 0.8vw, 0.65rem);
          letter-spacing: 0.42em;
          color: rgba(232,213,163,0.35);
          text-transform: uppercase;
          margin-bottom: 1rem;
        }

        .menu-title {
          font-family: ${YK};
          font-weight: 700;
          font-size: clamp(3.5rem, 7vw, 7rem);
          line-height: 0.9;
          letter-spacing: 0.01em;
          text-transform: uppercase;
          color: #e8d5a3;
          margin: 0 0 1.5rem;
        }

        .menu-title em {
          color: #d4a843;
          font-style: italic;
        }

        .menu-sub {
          font-family: ${DM};
          font-weight: 300;
          font-size: clamp(0.8rem, 1.2vw, 1rem);
          color: rgba(232,213,163,0.4);
          max-width: 360px;
          line-height: 1.7;
          margin-bottom: 2.5rem;
        }

        /* ── DIVIDER LINE ── */
        .divider {
          width: 100%;
          height: 0.5px;
          background: linear-gradient(to right, rgba(232,213,163,0.15), rgba(232,213,163,0.05) 70%, transparent);
        }

        /* ── CATEGORY TABS ── */
        .cats-wrapper {
          position: sticky;
          top: 0;
          z-index: 10;
          background: rgba(12,22,12,0.92);
          backdrop-filter: blur(16px);
          border-bottom: 0.5px solid rgba(232,213,163,0.08);
        }

        .cats {
          max-width: ${MAX_WIDTH}px;
          margin: 0 auto;
          padding: 0 ${SITE_PADDING};
          display: flex;
          gap: 0;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .cats::-webkit-scrollbar { display: none; }

        .cat-btn {
          font-family: ${DM};
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 1.1rem 1.4rem;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          color: rgba(232,213,163,0.35);
          cursor: pointer;
          white-space: nowrap;
          transition: color 0.25s, border-color 0.25s;
        }

        .cat-btn:hover { color: rgba(232,213,163,0.7); }
        .cat-btn.active {
          color: #d4a843;
          border-bottom-color: #d4a843;
        }

        /* ── FEATURED STRIP ── */
        .featured-section {
          max-width: ${MAX_WIDTH}px;
          margin: 0 auto;
          padding: 2.5rem ${SITE_PADDING} 0;
        }

        .section-eyebrow {
          font-family: ${DM};
          font-size: 9px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(212,168,67,0.6);
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .section-eyebrow::after {
          content: '';
          flex: 1;
          height: 0.5px;
          background: rgba(212,168,67,0.15);
        }

        .featured-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1px;
          background: rgba(232,213,163,0.06);
          margin-bottom: 3rem;
        }

        .featured-card {
          background: #0c160c;
          padding: 1.5rem;
          display: flex;
          gap: 1.25rem;
          align-items: flex-start;
          cursor: pointer;
          transition: background 0.25s;
          text-decoration: none;
          color: inherit;
        }

        .featured-card:hover { background: rgba(232,213,163,0.03); }

        .featured-thumb {
          width: 72px;
          height: 72px;
          flex-shrink: 0;
          background: rgba(232,213,163,0.05);
          border: 0.5px solid rgba(232,213,163,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
        }

        .featured-label {
          font-family: ${DM};
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(212,168,67,0.6);
          margin-bottom: 4px;
        }

        .featured-name {
          font-family: ${YK};
          font-weight: 700;
          font-size: 20px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #e8d5a3;
          line-height: 1;
          margin-bottom: 6px;
        }

        .featured-desc {
          font-family: ${DM};
          font-size: 11.5px;
          color: rgba(232,213,163,0.38);
          line-height: 1.55;
          margin-bottom: 10px;
        }

        .featured-price {
          font-family: ${YK};
          font-size: 17px;
          font-weight: 700;
          color: #d4a843;
        }

        /* ── MENU SECTIONS ── */
        .menu-sections {
          max-width: ${MAX_WIDTH}px;
          margin: 0 auto;
          padding: 0 ${SITE_PADDING} 5rem;
        }

        .menu-section {
          margin-bottom: 3rem;
        }

        .section-title-row {
          display: flex;
          align-items: baseline;
          gap: 1rem;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 0.5px solid rgba(232,213,163,0.07);
        }

        .section-title {
          font-family: ${YK};
          font-weight: 700;
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #e8d5a3;
          line-height: 1;
        }

        .section-count {
          font-family: ${DM};
          font-size: 11px;
          color: rgba(232,213,163,0.25);
          letter-spacing: 0.1em;
        }

        /* ── ITEM GRID ── */
        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1px;
          background: rgba(232,213,163,0.06);
        }

        .item-card {
          background: #0c160c;
          padding: 1.25rem;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          flex-direction: column;
        }

        .item-card:hover { background: rgba(232,213,163,0.03); }

        .item-thumb {
          width: 100%;
          aspect-ratio: 16/10;
          background: rgba(232,213,163,0.04);
          border: 0.5px solid rgba(232,213,163,0.07);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          margin-bottom: 1rem;
          position: relative;
          overflow: hidden;
        }

        .item-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          inset: 0;
        }

        .item-badges {
          display: flex;
          gap: 5px;
          margin-bottom: 6px;
          flex-wrap: wrap;
        }

        .badge {
          font-family: ${DM};
          font-size: 8.5px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 3px 7px;
        }

        .badge-popular {
          background: rgba(212,168,67,0.1);
          color: rgba(212,168,67,0.85);
          border: 0.5px solid rgba(212,168,67,0.2);
        }

        .badge-new {
          background: rgba(120,200,120,0.08);
          color: rgba(120,200,120,0.85);
          border: 0.5px solid rgba(120,200,120,0.2);
        }

        .badge-featured {
          background: rgba(212,168,67,0.08);
          color: rgba(212,168,67,0.7);
          border: 0.5px solid rgba(212,168,67,0.15);
        }

        .item-name {
          font-family: ${YK};
          font-weight: 700;
          font-size: 19px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #e8d5a3;
          line-height: 1.1;
          margin-bottom: 5px;
          flex: 1;
        }

        .item-desc {
          font-family: ${DM};
          font-size: 11px;
          color: rgba(232,213,163,0.35);
          line-height: 1.55;
          margin-bottom: 0.85rem;
        }

        .item-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
        }

        .item-price {
          font-family: ${YK};
          font-weight: 700;
          font-size: 17px;
          color: #d4a843;
        }

        .item-subcategory {
          font-family: ${DM};
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(232,213,163,0.22);
        }

        /* ── LOADING ── */
        .loading-state {
          max-width: ${MAX_WIDTH}px;
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
          50% { opacity: 1; transform: scale(1.2); }
        }

        .loading-text {
          font-family: ${DM};
          font-size: 11px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(232,213,163,0.3);
        }

        /* ── NAV BACK ── */
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

        .back-link svg { transition: transform 0.2s; }
        .back-link:hover svg { transform: translateX(-3px); }

        @media (max-width: 640px) {
          .items-grid { grid-template-columns: 1fr 1fr; }
          .featured-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="menu-page">
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

          <div className="divider" />
        </div>

        {/* CATEGORY TABS */}
        <div className="cats-wrapper">
          <div className="cats">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`cat-btn${activeCategory === cat ? " active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {CATEGORY_LABELS[cat] ??
                  cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-dot" />
            <p className="loading-text">Preparing the menu…</p>
          </div>
        ) : (
          <>
            {/* FEATURED TODAY — only show when "All" is selected */}
            {activeCategory === "all" && featured.length > 0 && (
              <div className="featured-section">
                <p className="section-eyebrow">Featured today</p>
                <div className="featured-grid">
                  {featured.map((item) => (
                    <div className="featured-card" key={item._id}>
                      <div className="featured-thumb">
                        {item.image ? (
                          <img src={item.image} alt={item.name} />
                        ) : (
                          <span>
                            {CATEGORY_EMOJI[item.category.toLowerCase()] ?? "✦"}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="featured-label">{item.category}</p>
                        <p className="featured-name">{item.name}</p>
                        <p className="featured-desc">{item.description}</p>
                        <p className="featured-price">
                          ₱{item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MENU SECTIONS */}
            <div className="menu-sections">
              {Object.entries(grouped).map(([category, categoryItems]) => (
                <div className="menu-section" key={category}>
                  <div className="section-title-row">
                    <h2 className="section-title">{category}</h2>
                    <span className="section-count">
                      {categoryItems.length} items
                    </span>
                  </div>

                  <div className="items-grid">
                    {categoryItems
                      .filter((i) => i.available !== false)
                      .map((item) => (
                        <div
                          className="item-card"
                          key={item._id}
                          onMouseEnter={() => setHoveredId(item._id)}
                          onMouseLeave={() => setHoveredId(null)}
                        >
                          <div className="item-thumb">
                            {item.image ? (
                              <img src={item.image} alt={item.name} />
                            ) : (
                              <span>
                                {CATEGORY_EMOJI[item.category.toLowerCase()] ??
                                  "✦"}
                              </span>
                            )}
                          </div>

                          <div className="item-badges">
                            {item.featured && (
                              <span className="badge badge-featured">
                                Today's pick
                              </span>
                            )}
                            {item.popular && (
                              <span className="badge badge-popular">
                                Popular
                              </span>
                            )}
                            {item.isNew && (
                              <span className="badge badge-new">New</span>
                            )}
                          </div>

                          <p className="item-name">{item.name}</p>
                          <p className="item-desc">{item.description}</p>

                          <div className="item-footer">
                            <span className="item-price">
                              ₱{item.price.toLocaleString()}
                            </span>
                            {item.subcategory && (
                              <span className="item-subcategory">
                                {item.subcategory}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
