"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar"; // adjust path if needed

const YK = "var(--font-yanone), 'Yanone Kaffeesatz', sans-serif";
const DM = "var(--font-dm), 'DM Sans', sans-serif";
const SITE_PADDING = "clamp(1.5rem, 5vw, 4rem)";
const MAX_WIDTH = 1280;

/* ─── DATA ─── */

type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  tag?: string;
  shopLink: string;
};

type Business = {
  id: string;
  name: string;
  tagline: string;
  category: string;
  accentColor: string;
  products: Product[];
};

const BUSINESSES: Business[] = [
  {
    id: "business-a",
    name: "Business Name A",
    tagline: "Short tagline about what this business sells or does.",
    category: "Category · TikTok Shop",
    accentColor: "#d4a843",
    products: [
      {
        id: "a1",
        name: "Product Name One",
        description: "Short product description. What it is, what it does.",
        price: "₱XXX",
        tag: "Best Seller",
        shopLink: "https://www.tiktok.com/shop",
      },
      {
        id: "a2",
        name: "Product Name Two",
        description: "Short product description. What it is, what it does.",
        price: "₱XXX",
        shopLink: "https://www.tiktok.com/shop",
      },
      {
        id: "a3",
        name: "Product Name Three",
        description: "Short product description. What it is, what it does.",
        price: "₱XXX",
        tag: "New",
        shopLink: "https://www.tiktok.com/shop",
      },
    ],
  },
  {
    id: "business-b",
    name: "Business Name B",
    tagline: "Short tagline about what this business sells or does.",
    category: "Category · TikTok Shop",
    accentColor: "#7ec8a0",
    products: [
      {
        id: "b1",
        name: "Product Name One",
        description: "Short product description. What it is, what it does.",
        price: "₱XXX",
        tag: "Top Pick",
        shopLink: "https://www.tiktok.com/shop",
      },
      {
        id: "b2",
        name: "Product Name Two",
        description: "Short product description. What it is, what it does.",
        price: "₱XXX",
        shopLink: "https://www.tiktok.com/shop",
      },
      {
        id: "b3",
        name: "Product Name Three",
        description: "Short product description. What it is, what it does.",
        price: "₱XXX",
        shopLink: "https://www.tiktok.com/shop",
      },
    ],
  },
  {
    id: "business-c",
    name: "Business Name C",
    tagline: "Short tagline about what this business sells or does.",
    category: "Category · TikTok Shop",
    accentColor: "#b89fd4",
    products: [
      {
        id: "c1",
        name: "Product Name One",
        description: "Short product description. What it is, what it does.",
        price: "₱XXX",
        shopLink: "https://www.tiktok.com/shop",
      },
      {
        id: "c2",
        name: "Product Name Two",
        description: "Short product description. What it is, what it does.",
        price: "₱XXX",
        tag: "Limited",
        shopLink: "https://www.tiktok.com/shop",
      },
      {
        id: "c3",
        name: "Product Name Three",
        description: "Short product description. What it is, what it does.",
        price: "₱XXX",
        shopLink: "https://www.tiktok.com/shop",
      },
    ],
  },
];

/* ─── PRODUCT CARD ─── */

function ProductCard({
  product,
  accent,
}: {
  product: Product;
  accent: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        background: hovered ? "rgba(232,213,163,0.03)" : "transparent",
        border: `1px solid ${hovered ? "rgba(232,213,163,0.14)" : "rgba(232,213,163,0.07)"}`,
        padding: "1.5rem",
        transition: "all 0.25s",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle accent line on hover */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: hovered ? "100%" : "0%",
          height: 1,
          background: accent,
          transition: "width 0.4s ease",
          opacity: 0.5,
        }}
      />

      {/* Top row: tag + price */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "0.9rem",
          gap: "0.5rem",
        }}
      >
        {product.tag ? (
          <span
            style={{
              fontFamily: DM,
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: accent,
              border: `1px solid ${accent}40`,
              padding: "2px 8px",
              background: `${accent}0d`,
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
            fontSize: 20,
            color: "#e8d5a3",
            letterSpacing: "0.02em",
            lineHeight: 1,
          }}
        >
          {product.price}
        </span>
      </div>

      {/* Placeholder image area */}
      <div
        style={{
          width: "100%",
          aspectRatio: "4/3",
          background: "rgba(232,213,163,0.03)",
          border: "1px dashed rgba(232,213,163,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.1rem",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: DM,
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(232,213,163,0.18)",
          }}
        >
          Product Image
        </span>
      </div>

      {/* Name + description */}
      <div style={{ flex: 1, marginBottom: "1.25rem" }}>
        <p
          style={{
            fontFamily: YK,
            fontWeight: 700,
            fontSize: 18,
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
            fontSize: 13,
            color: "rgba(232,213,163,0.45)",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {product.description}
        </p>
      </div>

      {/* BUY NOW */}
      <a
        href={product.shopLink}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          fontFamily: YK,
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          textDecoration: "none",
          padding: "0.8rem 1rem",
          background: btnHovered ? accent : `${accent}18`,
          color: btnHovered ? "#0f1a0f" : accent,
          border: `1px solid ${accent}50`,
          transition: "all 0.2s",
        }}
      >
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ flexShrink: 0 }}
        >
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
        BUY ON TIKTOK SHOP
      </a>
    </div>
  );
}

/* ─── BUSINESS SECTION ─── */

function BusinessSection({ biz }: { biz: Business }) {
  return (
    <section style={{ marginBottom: "5rem" }}>
      {/* Business header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "2rem",
          paddingBottom: "1.25rem",
          borderBottom: `1px solid rgba(232,213,163,0.08)`,
          position: "relative",
        }}
      >
        {/* Accent underline */}
        <div
          style={{
            position: "absolute",
            bottom: -1,
            left: 0,
            width: 48,
            height: 1,
            background: biz.accentColor,
          }}
        />

        <div>
          <p
            style={{
              fontFamily: DM,
              fontSize: 10,
              letterSpacing: "0.3em",
              color: biz.accentColor,
              textTransform: "uppercase",
              margin: "0 0 0.4rem",
              opacity: 0.7,
            }}
          >
            {biz.category}
          </p>
          <h2
            style={{
              fontFamily: YK,
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 3rem)",
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              color: "#e8d5a3",
              lineHeight: 0.95,
              margin: 0,
            }}
          >
            {biz.name}
          </h2>
          <p
            style={{
              fontFamily: DM,
              fontSize: 13,
              color: "rgba(232,213,163,0.4)",
              margin: "0.5rem 0 0",
              lineHeight: 1.5,
            }}
          >
            {biz.tagline}
          </p>
        </div>

        <a
          href="https://www.tiktok.com/shop"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: YK,
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            textDecoration: "none",
            color: "rgba(232,213,163,0.35)",
            border: "1px solid rgba(232,213,163,0.12)",
            padding: "6px 14px",
            transition: "all 0.2s",
            whiteSpace: "nowrap",
            flexShrink: 0,
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

      {/* Products grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {biz.products.map((p) => (
          <ProductCard key={p.id} product={p} accent={biz.accentColor} />
        ))}
      </div>
    </section>
  );
}

/* ─── PAGE ─── */

export default function StorePage() {
  return (
    <>
      <style>{`
        .store-page * { box-sizing: border-box; }
        @media (max-width: 640px) {
          .store-products-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Navbar />

      <div
        className="store-page"
        style={{ minHeight: "100vh", background: "#0a120a", color: "#e8d5a3" }}
      >
        {/* Grid background */}
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
            paddingBottom: "5rem",
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

          {/* Hero header */}
          <div style={{ marginBottom: "4rem" }}>
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
              Browse · Buy · Support
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
              Our
              <br />
              <em style={{ color: "#d4a843", fontStyle: "italic" }}>Shops</em>
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
              Products from our family of businesses — all available on TikTok
              Shop. Tap any item to go directly to the listing.
            </p>
          </div>

          {/* Business index pills */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginBottom: "4rem",
            }}
          >
            {BUSINESSES.map((biz) => (
              <a
                key={biz.id}
                href={`#${biz.id}`}
                style={{
                  fontFamily: YK,
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  padding: "6px 16px",
                  border: `1px solid ${biz.accentColor}35`,
                  color: biz.accentColor,
                  background: `${biz.accentColor}0a`,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${biz.accentColor}20`;
                  e.currentTarget.style.borderColor = `${biz.accentColor}70`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `${biz.accentColor}0a`;
                  e.currentTarget.style.borderColor = `${biz.accentColor}35`;
                }}
              >
                {biz.name}
              </a>
            ))}
          </div>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background:
                "linear-gradient(to right, rgba(232,213,163,0.12), transparent)",
              marginBottom: "4rem",
            }}
          />

          {/* Business sections */}
          {BUSINESSES.map((biz) => (
            <div key={biz.id} id={biz.id}>
              <BusinessSection biz={biz} />
            </div>
          ))}

          {/* Footer note */}
          <div
            style={{
              borderTop: "1px solid rgba(232,213,163,0.07)",
              paddingTop: "2rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <span style={{ fontSize: 14, opacity: 0.4 }}>🛍</span>
            <p
              style={{
                fontFamily: DM,
                fontSize: 11,
                color: "rgba(232,213,163,0.28)",
                lineHeight: 1.6,
                margin: 0,
                letterSpacing: "0.05em",
              }}
            >
              All purchases are processed through TikTok Shop. For inquiries,
              message us on any of our social pages.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
