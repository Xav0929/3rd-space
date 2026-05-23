"use client";

import Link from "next/link";

const row1 = [
  "/images/gallery-1.png",
  "/images/gallery-2.png",
  "/images/gallery-3.png",
  "/images/gallery-4.png",
  "/images/gallery-5.png",
  "/images/gallery-6.png",
];

const row2 = [
  "/images/gallery-7.png",
  "/images/gallery-8.png",
  "/images/gallery-9.png",
  "/images/gallery-10.png",
  "/images/gallery-11.png",
  "/images/gallery-12.png",
];

const r1 = [...row1, ...row1];
const r2 = [...row2, ...row2];

export default function GallerySection() {
  return (
    <section
      style={{
        width: "100%",
        backgroundColor: "#0f1a0f",
        overflow: "hidden",
        paddingBottom: "clamp(3rem, 6vw, 5rem)",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Yanone+Kaffeesatz:wght@400;700&display=swap');

        @keyframes scrollLeft {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scrollRight {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        .gallery-tile {
          width: clamp(160px, 40vw, 22vw);
          height: clamp(110px, 27vw, 14.666vw);
          flex-shrink: 0;
          background-color: #1c2b1c;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          border-radius: clamp(6px, 1.2vw, 1.2vw);
        }
        .gallery-tile img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .gallery-tile:hover img { transform: scale(1.07); }
        .gallery-tile .hov {
          position: absolute;
          inset: 0;
          background: rgba(15,26,15,0.25);
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        .gallery-tile:hover .hov { opacity: 0; }

        .gallery-row-track {
          display: flex;
          width: max-content;
        }
        .gallery-row-track.left  { animation: scrollLeft 32s linear infinite; }
        .gallery-row-track.right { animation: scrollRight 32s linear infinite; }

        @media (max-width: 640px) {
          .gallery-row-track { gap: 8px !important; }
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding:
            "clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem) clamp(1.5rem, 3vw, 2.5rem)",
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            color: "rgba(232,213,163,0.4)",
            fontSize: "0.65rem",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            marginBottom: "0.75rem",
            fontFamily: "'Yanone Kaffeesatz', sans-serif",
          }}
        >
          <span
            style={{
              width: 32,
              height: 1,
              background: "rgba(232,213,163,0.3)",
              display: "inline-block",
            }}
          />
          Visual Stories
        </span>
        <h2
          style={{
            fontFamily: "'Yanone Kaffeesatz', sans-serif",
            fontWeight: 700,
            color: "#e8d5a3",
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            lineHeight: 0.95,
            letterSpacing: "0.02em",
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          3RD SPACE{" "}
          <span style={{ fontStyle: "italic", color: "#d4a843" }}>GALLERY</span>
        </h2>
      </div>

      {/* Row 1 — scrolls LEFT */}
      <div
        style={{ overflow: "hidden", marginBottom: "clamp(6px, 0.75vw, 12px)" }}
      >
        <div
          className="gallery-row-track left"
          style={{ gap: "clamp(6px, 0.75vw, 12px)" }}
        >
          {r1.map((src, i) => (
            <div key={i} className="gallery-tile">
              <img
                src={src}
                alt=""
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="hov" />
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls RIGHT */}
      <div style={{ overflow: "hidden" }}>
        <div
          className="gallery-row-track right"
          style={{ gap: "clamp(6px, 0.75vw, 12px)" }}
        >
          {r2.map((src, i) => (
            <div key={i} className="gallery-tile">
              <img
                src={src}
                alt=""
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="hov" />
            </div>
          ))}
        </div>
      </div>

      {/* VIEW ALL */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "clamp(2rem, 4vw, 3rem)",
        }}
      >
        <Link
          href="/gallery"
          style={{
            border: "1px solid rgba(232,213,163,0.4)",
            color: "#e8d5a3",
            fontFamily: "'Yanone Kaffeesatz', sans-serif",
            fontSize: "1rem",
            fontWeight: 700,
            letterSpacing: "0.25em",
            padding: "0.875rem 2.5rem",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.75rem",
            transition: "background 0.3s, color 0.3s",
            textTransform: "uppercase",
            borderRadius: "clamp(6px, 1.2vw, 1.2vw)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#e8d5a3";
            (e.currentTarget as HTMLElement).style.color = "#0f1a0f";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "#e8d5a3";
          }}
        >
          VIEW ALL
          <svg
            width="10"
            height="10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
