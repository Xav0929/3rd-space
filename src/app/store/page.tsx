"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const YK = "var(--font-yanone), 'Yanone Kaffeesatz', sans-serif";
const DM = "var(--font-dm), 'DM Sans', sans-serif";
const SITE_PADDING = "clamp(1.5rem, 5vw, 4rem)";
const MAX_WIDTH = 1280;

type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  tag?: string;
  shopLink: string;
  images: string[];
};

type Business = {
  id: string;
  name: string;
  tagline: string;
  category: string;
  accentColor: string;
  shopLink: string;
  products: Product[];
};

const BUSINESSES: Business[] = [
  {
    id: "chilibog",
    name: "Chilibog",
    tagline:
      "Chili Garlic Sauce — bold, garlicky heat in a jar. All-natural, ready to eat, comes in Mild and Wild. Pick your poison.",
    category: "Food & Condiments · TikTok Shop",
    accentColor: "#e8612a",
    shopLink: "https://vt.tiktok.com/ZS9jfmAuVdJfN-GR8kg/",
    products: [
      {
        id: "chilibog-1",
        name: "Chili Garlic Sauce",
        description:
          "Made from fresh chili, garlic, and pure coconut oil — no mushrooms, no soy, no fillers. Two heat levels: Mild for the cautious, Wild for everyone else. Goes on rice, noodles, fried anything.",
        price: "₱95",
        tag: "Available: Mild & Wild",
        shopLink: "https://vt.tiktok.com/ZS9jfmAuVdJfN-GR8kg/",
        images: [
          "/store/chilibog-1.png",
          "/store/chilibog-2.png",
          "/store/chilibog-3.png",
        ],
      },
    ],
  },
  {
    id: "3rd-space",
    name: "3rd Space",
    tagline:
      "Pastillas handmade in-house. Soft, milky, melt-in-your-mouth — the kind your lola would approve of.",
    category: "Sweets & Snacks · TikTok Shop",
    accentColor: "#7ec8a0",
    shopLink: "https://vt.tiktok.com/ZS9jfmfmY9kYf-GJxRx/",
    products: [
      {
        id: "pastillas-1",
        name: "House Pastillas",
        description:
          "Made fresh, the slow way. Soft milk candy rolled to order — no artificial flavoring, no shortcuts. Comes in a pack that disappears faster than you'd think.",
        price: "₱20",
        tag: "House Favorite",
        shopLink: "https://vt.tiktok.com/ZS9jfmfmY9kYf-GJxRx/",
        images: [
          "/store/pastillas-1.png",
          "/store/pastillas-2.png",
          "/store/pastillas-3.png",
        ],
      },
    ],
  },
];

/* ─── HORIZONTAL PRODUCT CARD (for single-product businesses) ─── */
function HeroProductCard({
  product,
  accent,
  bizName,
  bizCategory,
  bizTagline,
}: {
  product: Product;
  accent: string;
  bizName: string;
  bizCategory: string;
  bizTagline: string;
}) {
  const [activeImg, setActiveImg] = useState(0);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="hero-card-grid"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        border: `1px solid ${hovered ? "rgba(232,213,163,0.18)" : "rgba(232,213,163,0.08)"}`,
        background: hovered
          ? "rgba(232,213,163,0.025)"
          : "rgba(232,213,163,0.01)",
        transition: "border-color 0.3s, background 0.3s",
        position: "relative",
        overflow: "hidden",
        minHeight: 480,
      }}
    >
      {/* Accent line top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(to right, ${accent}, transparent)`,
          opacity: hovered ? 1 : 0.4,
          transition: "opacity 0.3s",
        }}
      />

      {/* LEFT — image */}
      <div
        className="hero-card-img"
        style={{
          position: "relative",
          overflow: "hidden",
          background: "rgba(0,0,0,0.3)",
        }}
      >
        <Image
          src={product.images[activeImg]}
          alt={product.name}
          fill
          unoptimized
          style={{
            objectFit: "cover",
            transform: hovered ? "scale(1.04)" : "scale(1)",
            transition: "transform 0.55s cubic-bezier(0.4,0,0.2,1)",
          }}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Gradient overlay on image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, transparent 60%, rgba(10,18,10,0.6) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Thumbnails bottom-left of image */}
        {product.images.length > 1 && (
          <div
            style={{
              position: "absolute",
              bottom: "1rem",
              left: "1rem",
              display: "flex",
              gap: "0.4rem",
            }}
          >
            {product.images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                aria-label={`View image ${i + 1}`}
                style={{
                  width: 48,
                  height: 38,
                  position: "relative",
                  padding: 0,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  overflow: "hidden",
                  flexShrink: 0,
                  outline:
                    i === activeImg
                      ? `2px solid ${accent}`
                      : "1px solid rgba(255,255,255,0.2)",
                  outlineOffset: 0,
                  transition: "outline-color 0.15s",
                }}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  unoptimized
                  style={{ objectFit: "cover" }}
                  sizes="60px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT — info */}
      <div
        style={{
          padding: "2.5rem 2.5rem 2.5rem 2.5rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Top: business identity */}
        <div>
          <p
            style={{
              fontFamily: DM,
              fontSize: "0.52rem",
              letterSpacing: "0.32em",
              color: accent,
              textTransform: "uppercase",
              margin: "0 0 0.5rem",
              opacity: 0.75,
            }}
          >
            {bizCategory}
          </p>
          <h2
            style={{
              fontFamily: YK,
              fontWeight: 700,
              fontSize: "clamp(2.4rem, 4vw, 4rem)",
              letterSpacing: "0.01em",
              textTransform: "uppercase",
              color: "#e8d5a3",
              lineHeight: 0.9,
              margin: "0 0 0.75rem",
            }}
          >
            {bizName}
          </h2>
          <div
            style={{
              width: 32,
              height: 2,
              background: accent,
              marginBottom: "0.85rem",
            }}
          />
          <p
            style={{
              fontFamily: DM,
              fontSize: "0.8rem",
              color: "rgba(232,213,163,0.38)",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {bizTagline}
          </p>
        </div>

        {/* Middle: product details */}
        <div style={{ margin: "2rem 0" }}>
          <div
            style={{
              height: 1,
              background: "rgba(232,213,163,0.07)",
              marginBottom: "1.5rem",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "1rem",
              marginBottom: "0.6rem",
            }}
          >
            <div>
              {product.tag && (
                <span
                  style={{
                    display: "inline-block",
                    fontFamily: DM,
                    fontSize: "0.55rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    padding: "2px 9px",
                    borderRadius: 999,
                    color: accent,
                    border: `1px solid ${accent}45`,
                    background: `${accent}12`,
                    marginBottom: "0.5rem",
                  }}
                >
                  {product.tag}
                </span>
              )}
              <p
                style={{
                  fontFamily: YK,
                  fontWeight: 700,
                  fontSize: "1.4rem",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "#e8d5a3",
                  margin: 0,
                }}
              >
                {product.name}
              </p>
            </div>
            <span
              style={{
                fontFamily: YK,
                fontWeight: 700,
                fontSize: "1.8rem",
                color: "#e8d5a3",
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              {product.price}
            </span>
          </div>
          <p
            style={{
              fontFamily: DM,
              fontSize: "0.82rem",
              color: "rgba(232,213,163,0.38)",
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            {product.description}
          </p>
        </div>

        {/* Bottom: CTAs */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}
        >
          <a
            href={product.shopLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              fontFamily: YK,
              fontWeight: 700,
              fontSize: "0.85rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              textDecoration: "none",
              padding: "0.9rem 1rem",
              background: accent,
              color: "#0f1a0f",
              border: `1px solid ${accent}`,
              transition: "opacity 0.2s",
              minHeight: 48,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
            </svg>
            Buy on TikTok Shop
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── GRID PRODUCT CARD (for multi-product businesses) ─── */
function GridProductCard({
  product,
  accent,
}: {
  product: Product;
  accent: string;
}) {
  const [activeImg, setActiveImg] = useState(0);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        background: hovered
          ? "rgba(232,213,163,0.04)"
          : "rgba(232,213,163,0.02)",
        border: `1px solid ${hovered ? "rgba(232,213,163,0.16)" : "rgba(232,213,163,0.08)"}`,
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.25s, background 0.25s",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: hovered ? "100%" : "0%",
          height: 2,
          background: accent,
          transition: "width 0.4s ease",
        }}
      />
      <div
        style={{
          width: "100%",
          aspectRatio: "4/3",
          position: "relative",
          overflow: "hidden",
          background: "rgba(232,213,163,0.04)",
        }}
      >
        <Image
          src={product.images[activeImg]}
          alt={product.name}
          fill
          unoptimized
          style={{
            objectFit: "cover",
            transform: hovered ? "scale(1.04)" : "scale(1)",
            transition: "transform 0.45s ease",
          }}
          sizes="(max-width: 640px) 100vw, 400px"
        />
      </div>
      {product.images.length > 1 && (
        <div
          style={{
            display: "flex",
            gap: "0.35rem",
            padding: "0.75rem 1.25rem 0",
          }}
        >
          {product.images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              aria-label={`View image ${i + 1}`}
              style={{
                width: 44,
                height: 36,
                position: "relative",
                padding: 0,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                overflow: "hidden",
                flexShrink: 0,
                outline:
                  i === activeImg
                    ? `2px solid ${accent}`
                    : "1px solid rgba(232,213,163,0.12)",
                outlineOffset: 0,
              }}
            >
              <Image
                src={src}
                alt=""
                fill
                unoptimized
                style={{ objectFit: "cover" }}
                sizes="60px"
              />
            </button>
          ))}
        </div>
      )}
      <div
        style={{
          padding: "1.1rem 1.25rem",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "0.5rem",
            marginBottom: "0.85rem",
          }}
        >
          {product.tag ? (
            <span
              style={{
                fontFamily: DM,
                fontSize: "0.58rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                padding: "2px 9px",
                borderRadius: 999,
                color: accent,
                border: `1px solid ${accent}45`,
                background: `${accent}10`,
                flexShrink: 0,
              }}
            >
              {product.tag}
            </span>
          ) : (
            <span />
          )}
          <span
            style={{
              fontFamily: YK,
              fontWeight: 700,
              fontSize: "1.35rem",
              color: "#e8d5a3",
              lineHeight: 1,
            }}
          >
            {product.price}
          </span>
        </div>
        <p
          style={{
            fontFamily: YK,
            fontWeight: 700,
            fontSize: "1.05rem",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "#e8d5a3",
            margin: "0 0 0.4rem",
          }}
        >
          {product.name}
        </p>
        <p
          style={{
            fontFamily: DM,
            fontSize: "0.78rem",
            color: "rgba(232,213,163,0.4)",
            lineHeight: 1.7,
            margin: 0,
            flex: 1,
          }}
        >
          {product.description}
        </p>
      </div>
      <div style={{ padding: "0 1.25rem 1.25rem" }}>
        <a
          href={product.shopLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            fontFamily: YK,
            fontWeight: 700,
            fontSize: "0.78rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            textDecoration: "none",
            padding: "0.85rem 1rem",
            background: `${accent}15`,
            color: accent,
            border: `1px solid ${accent}45`,
            transition: "all 0.2s",
            minHeight: 44,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = accent;
            e.currentTarget.style.color = "#0f1a0f";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = `${accent}15`;
            e.currentTarget.style.color = accent;
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
          </svg>
          Buy on TikTok Shop
        </a>
      </div>
    </div>
  );
}

/* ─── BUSINESS SECTION ─── */
function BusinessSection({ biz }: { biz: Business }) {
  const isSingle = biz.products.length === 1;

  return (
    <section
      id={biz.id}
      style={{
        marginBottom: "5rem",
        paddingBottom: "5rem",
        borderBottom: "1px solid rgba(232,213,163,0.07)",
      }}
    >
      {isSingle ? (
        // Full-width horizontal card — image left, all info right
        <HeroProductCard
          product={biz.products[0]}
          accent={biz.accentColor}
          bizName={biz.name}
          bizCategory={biz.category}
          bizTagline={biz.tagline}
        />
      ) : (
        // Header + grid for multiple products
        <>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "2rem",
              paddingBottom: "1.25rem",
              borderBottom: "1px solid rgba(232,213,163,0.08)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: -1,
                left: 0,
                width: 40,
                height: 2,
                background: biz.accentColor,
              }}
            />
            <div>
              <p
                style={{
                  fontFamily: DM,
                  fontSize: "0.55rem",
                  letterSpacing: "0.32em",
                  color: biz.accentColor,
                  textTransform: "uppercase",
                  margin: "0 0 0.4rem",
                  opacity: 0.75,
                }}
              >
                {biz.category}
              </p>
              <h2
                style={{
                  fontFamily: YK,
                  fontWeight: 700,
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  textTransform: "uppercase",
                  color: "#e8d5a3",
                  lineHeight: 0.95,
                  margin: "0 0 0.5rem",
                }}
              >
                {biz.name}
              </h2>
              <p
                style={{
                  fontFamily: DM,
                  fontSize: "0.82rem",
                  color: "rgba(232,213,163,0.4)",
                  margin: 0,
                  lineHeight: 1.6,
                  maxWidth: 480,
                }}
              >
                {biz.tagline}
              </p>
            </div>
            <a
              href={biz.shopLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: DM,
                fontWeight: 500,
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: "rgba(232,213,163,0.35)",
                border: "1px solid rgba(232,213,163,0.12)",
                padding: "8px 16px",
                transition: "all 0.2s",
                minHeight: 40,
                display: "flex",
                alignItems: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#e8d5a3";
                e.currentTarget.style.borderColor = "rgba(232,213,163,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(232,213,163,0.35)";
                e.currentTarget.style.borderColor = "rgba(232,213,163,0.12)";
              }}
            >
              View Shop →
            </a>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1rem",
            }}
          >
            {biz.products.map((p) => (
              <GridProductCard
                key={p.id}
                product={p}
                accent={biz.accentColor}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

/* ─── PAGE ─── */
export default function StorePage() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        .store-root { min-height: 100vh; background: #0a120a; color: #e8d5a3; }
        .store-grid-bg {
          position: fixed; inset: 0;
          background-image: linear-gradient(rgba(232,213,163,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(232,213,163,0.022) 1px, transparent 1px);
          background-size: 60px 60px; pointer-events: none; z-index: 0;
        }
        .store-inner {
          position: relative; z-index: 1; width: 100%;
          max-width: ${MAX_WIDTH}px; margin: 0 auto;
          padding: clamp(5rem, 10vw, 8rem) ${SITE_PADDING} 5rem;
        }
        .biz-pills { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 3.5rem; }
        .biz-pill {
          font-family: 'Yanone Kaffeesatz', sans-serif; font-weight: 700;
          font-size: 0.78rem; letter-spacing: 0.15em; text-transform: uppercase;
          text-decoration: none; padding: 8px 16px; border: 1px solid;
          transition: all 0.2s; min-height: 40px; display: flex; align-items: center;
        }

        /* Hero card responsive */
        .hero-card-grid { display: grid; grid-template-columns: 1fr 1fr; min-height: 480px; }

        @media (max-width: 768px) {
          .hero-card-grid { grid-template-columns: 1fr !important; }
          .hero-card-img { min-height: 280px; }
        }

        @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
      `}</style>

      <Navbar />

      <div className="store-root">
        <div className="store-grid-bg" />
        <div className="store-inner">
          <Link
            href="/"
            style={{
              fontFamily: DM,
              fontSize: "0.6rem",
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
            ← Home
          </Link>

          <div style={{ marginBottom: "3.5rem" }}>
            <p
              style={{
                fontFamily: DM,
                fontSize: "clamp(0.5rem, 0.85vw, 0.65rem)",
                letterSpacing: "0.38em",
                color: "rgba(232,213,163,0.35)",
                textTransform: "uppercase",
                margin: "0 0 0.75rem",
              }}
            >
              Browse · Buy · Support
            </p>
            <h1
              style={{
                fontFamily: YK,
                fontWeight: 700,
                fontSize: "clamp(3rem, 8vw, 6rem)",
                lineHeight: 0.88,
                color: "#e8d5a3",
                textTransform: "uppercase",
                margin: "0 0 1.25rem",
              }}
            >
              Our{" "}
              <em style={{ color: "#d4a843", fontStyle: "italic" }}>Shops</em>
            </h1>
            <p
              style={{
                fontFamily: DM,
                fontSize: "clamp(0.8rem, 1.4vw, 0.92rem)",
                color: "rgba(232,213,163,0.45)",
                maxWidth: 480,
                lineHeight: 1.75,
                margin: 0,
              }}
            >
              Products from our family of businesses — all on TikTok Shop. Tap
              any item to go straight to the listing.
            </p>
          </div>

          <div className="biz-pills">
            {BUSINESSES.map((biz) => (
              <a
                key={biz.id}
                href={`#${biz.id}`}
                className="biz-pill"
                style={{
                  color: biz.accentColor,
                  borderColor: `${biz.accentColor}40`,
                  background: `${biz.accentColor}0c`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${biz.accentColor}22`;
                  e.currentTarget.style.borderColor = `${biz.accentColor}70`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `${biz.accentColor}0c`;
                  e.currentTarget.style.borderColor = `${biz.accentColor}40`;
                }}
              >
                {biz.name}
              </a>
            ))}
          </div>

          <div
            style={{
              height: 1,
              background:
                "linear-gradient(to right, rgba(232,213,163,0.12), transparent)",
              marginBottom: "4rem",
            }}
          />

          {BUSINESSES.map((biz) => (
            <BusinessSection key={biz.id} biz={biz} />
          ))}

          <div
            style={{
              borderTop: "1px solid rgba(232,213,163,0.07)",
              paddingTop: "2rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(232,213,163,0.3)"
              strokeWidth={1.5}
              style={{ flexShrink: 0, marginTop: 2 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p
              style={{
                fontFamily: DM,
                fontSize: "0.72rem",
                color: "rgba(232,213,163,0.25)",
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              All purchases go through TikTok Shop. For questions, message us on
              Facebook, Instagram, or TikTok.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
