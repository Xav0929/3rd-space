"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const YK = "'Yanone Kaffeesatz', sans-serif";
const DM = "'DM Sans', sans-serif";
const SITE_PADDING = "clamp(1.5rem, 5vw, 4rem)";
const MAX_WIDTH = 1440;

const GALLERY_ITEMS = [
  { id: 1, src: "/gallery/g1.png" },
  { id: 2, src: "/gallery/g2.png" },
  { id: 3, src: "/gallery/g3.png" },
  { id: 4, src: "/gallery/g4.png" },
  { id: 5, src: "/gallery/g5.png" },
  { id: 6, src: "/gallery/g6.png" },
  { id: 7, src: "/gallery/g7.png" },
  { id: 8, src: "/gallery/g8.png" },
  { id: 9, src: "/gallery/g9.png" },
  { id: 10, src: "/gallery/g10.png" },
  { id: 11, src: "/gallery/g11.png" },
  { id: 12, src: "/gallery/g12.png" },
  { id: 13, src: "/gallery/g13.png" },
  { id: 14, src: "/gallery/g14.png" },
  { id: 15, src: "/gallery/g15.png" },
  { id: 16, src: "/gallery/g16.png" },
  { id: 17, src: "/gallery/g17.png" },
  { id: 18, src: "/gallery/g18.png" },
  { id: 19, src: "/gallery/g19.png" },
  { id: 20, src: "/gallery/g20.png" },
  { id: 21, src: "/gallery/g21.png" },
  { id: 22, src: "/gallery/g22.png" },
  { id: 23, src: "/gallery/g23.png" },
  { id: 24, src: "/gallery/g24.png" },
  { id: 25, src: "/gallery/g25.png" },
  { id: 26, src: "/gallery/g26.png" },
  { id: 27, src: "/gallery/g27.png" },
  { id: 28, src: "/gallery/g28.png" },
  { id: 29, src: "/gallery/g29.png" },
];

const BENTO_PREVIEW = [
  { id: 1, col: "1 / 3", row: "1 / 3" },
  { id: 2, col: "3 / 4", row: "1 / 2" },
  { id: 3, col: "4 / 5", row: "1 / 3" },
  { id: 4, col: "3 / 4", row: "2 / 3" },
  { id: 5, col: "1 / 2", row: "3 / 4" },
  { id: 6, col: "2 / 4", row: "3 / 4" },
  { id: 7, col: "4 / 5", row: "3 / 4" },
];

const BG = [
  "#18261a",
  "#1c2a1c",
  "#162216",
  "#1a2418",
  "#1e281e",
  "#14201a",
  "#1c261c",
  "#182018",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.04 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function FadeBlock({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
        height: "100%",
      }}
    >
      {children}
    </div>
  );
}

function Tile({
  src,
  onClick,
  style,
}: {
  src: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  const [hov, setHov] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const idx = parseInt(src.replace(/\D/g, "")) || 0;
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        background: BG[idx % BG.length],
        borderRadius: 8,
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      <img
        src={src}
        alt=""
        onLoad={() => setLoaded(true)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.5s ease, transform 0.5s ease",
          transform: hov ? "scale(1.05)" : "scale(1)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(170deg, transparent 50%, rgba(8,16,10,0.45))",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

function Lightbox({
  items,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  items: typeof GALLERY_ITEMS;
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const item = items[index];
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, onPrev, onNext]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(6,12,8,0.97)",
        backdropFilter: "blur(14px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(1rem,4vw,3rem)",
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        style={{
          position: "absolute",
          left: "clamp(0.5rem,2vw,2rem)",
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(232,213,163,0.08)",
          border: "1px solid rgba(232,213,163,0.15)",
          color: "#e8d5a3",
          width: 44,
          height: 44,
          borderRadius: "50%",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="16"
          height="16"
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
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          maxWidth: "min(88vw,1050px)",
          maxHeight: "84vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.8rem",
        }}
      >
        <img
          src={item.src}
          alt=""
          style={{
            maxWidth: "100%",
            maxHeight: "76vh",
            objectFit: "contain",
            borderRadius: 4,
          }}
        />
        <span
          style={{
            fontFamily: DM,
            fontSize: "0.55rem",
            letterSpacing: "0.3em",
            color: "rgba(212,168,67,0.45)",
            textTransform: "uppercase",
          }}
        >
          3rd Space · {index + 1} / {items.length}
        </span>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: -12,
            right: -12,
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "rgba(232,213,163,0.1)",
            border: "1px solid rgba(232,213,163,0.2)",
            color: "#e8d5a3",
            cursor: "pointer",
            fontSize: "0.8rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✕
        </button>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        style={{
          position: "absolute",
          right: "clamp(0.5rem,2vw,2rem)",
          top: "50%",
          transform: "translateY(-50%)",
          background: "rgba(232,213,163,0.08)",
          border: "1px solid rgba(232,213,163,0.15)",
          color: "#e8d5a3",
          width: 44,
          height: 44,
          borderRadius: "50%",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="16"
          height="16"
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
      </button>
    </div>
  );
}

// ── Shuffle icon SVG ──
function ShuffleIcon() {
  return (
    <svg
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"
      />
    </svg>
  );
}

export default function GalleryPage() {
  const [explored, setExplored] = useState(false);
  const [items, setItems] = useState(GALLERY_ITEMS);
  const [shuffled, setShuffled] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [heroIn, setHeroIn] = useState(false);
  const [fading, setFading] = useState(false);
  const [gridKey, setGridKey] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setHeroIn(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleShuffle = useCallback(() => {
    setItems(shuffle(GALLERY_ITEMS));
    setShuffled(true);
    setGridKey((k) => k + 1);
    // brief flash to show it reshuffled
    setTimeout(() => setShuffled(false), 600);
  }, []);

  const handleAll = useCallback(() => {
    setItems(GALLERY_ITEMS);
    setShuffled(false);
    setGridKey((k) => k + 1);
  }, []);

  const lightboxItem = lightbox !== null ? items[lightbox] : null;
  const closeLightbox = () => setLightbox(null);
  const prevLightbox = () =>
    setLightbox((i) =>
      i !== null ? (i - 1 + items.length) % items.length : null,
    );
  const nextLightbox = () =>
    setLightbox((i) => (i !== null ? (i + 1) % items.length : null));

  const goExplore = () => {
    setFading(true);
    setTimeout(() => {
      setExplored(true);
      setFading(false);
      window.scrollTo({ top: 0 });
    }, 380);
  };
  const goBack = () => {
    setFading(true);
    setTimeout(() => {
      setExplored(false);
      setFading(false);
      window.scrollTo({ top: 0 });
    }, 380);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Yanone+Kaffeesatz:wght@300;400;700&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #0b1510; }
        ::selection { background: #d4a843; color: #0b1510; }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes pop { 0%{transform:scale(1)} 50%{transform:scale(1.18)} 100%{transform:scale(1)} }

        .g-landing {
          height: calc(100vh - clamp(56px,6vw,78px));
          display: flex;
          overflow: hidden;
        }
        .g-left {
          flex: 0 0 clamp(240px,33vw,450px);
          display: flex; flex-direction: column; justify-content: center;
          padding: clamp(1.5rem,3vw,3rem) clamp(1.5rem,2.5vw,3rem) clamp(1.5rem,3vw,3rem) clamp(1.5rem,5vw,4rem);
          border-right: 1px solid rgba(232,213,163,0.05);
          position: relative; overflow: hidden;
        }
        .g-right {
          flex: 1; padding: 6px; overflow: hidden;
        }
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          grid-template-rows: repeat(3,1fr);
          gap: 5px; height: 100%;
        }

        /* ── GRID: 3 cols, uniform rows ── */
        .photo-grid {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          grid-auto-rows: clamp(180px,19vw,270px);
          gap: 8px;
        }

        .explore-btn {
          display: inline-flex; align-items: center; gap: 10px;
          background: #e8d5a3; color: #0b1510;
          font-family: 'Yanone Kaffeesatz',sans-serif;
          font-weight: 700; font-size: clamp(0.7rem,1vw,0.88rem);
          letter-spacing: 0.22em; text-transform: uppercase;
          border: none; cursor: pointer;
          padding: clamp(0.7rem,1.1vw,0.95rem) clamp(1.3rem,2.3vw,2rem);
          transition: background 0.22s, transform 0.18s;
        }
        .explore-btn:hover { background: #d4a843; transform: translateX(3px); }

        .back-btn {
          background: none; border: none; cursor: pointer;
          color: rgba(232,213,163,0.3); font-family: 'DM Sans',sans-serif;
          font-size: clamp(0.52rem,0.75vw,0.63rem);
          letter-spacing: 0.28em; text-transform: uppercase;
          display: flex; align-items: center; gap: 6px;
          padding: 0; transition: color 0.2s;
        }
        .back-btn:hover { color: #e8d5a3; }

        /* ── VIEW CONTROLS (All + Shuffle) ── */
        .view-controls {
          display: flex; align-items: center; gap: 6px;
        }
        .vc-btn {
          background: none;
          border: 1px solid rgba(232,213,163,0.1);
          color: rgba(232,213,163,0.35);
          font-family: 'DM Sans',sans-serif;
          font-size: clamp(0.5rem,0.7vw,0.6rem);
          letter-spacing: 0.28em; text-transform: uppercase;
          cursor: pointer; padding: 0.35rem 0.85rem;
          border-radius: 999px;
          display: flex; align-items: center; gap: 7px;
          transition: color 0.2s, border-color 0.2s, background 0.2s;
        }
        .vc-btn:hover { color: #e8d5a3; border-color: rgba(232,213,163,0.28); }
        .vc-btn.active { color: #0b1510; background: #d4a843; border-color: #d4a843; }
        .vc-btn.shuffle-active { animation: pop 0.3s ease; }

        @media (max-width: 900px) {
          .g-landing { flex-direction: column; height: auto; min-height: calc(100vh - 60px); }
          .g-left { flex: none; border-right: none; border-bottom: 1px solid rgba(232,213,163,0.05); }
          .g-right { min-height: 45vw; }
          .photo-grid { grid-template-columns: repeat(2,1fr); grid-auto-rows: clamp(150px,22vw,220px); }
        }
        @media (max-width: 560px) {
          .bento-grid { grid-template-columns: repeat(2,1fr); }
          .bento-grid > * { grid-column: span 1 !important; grid-row: span 1 !important; }
          .photo-grid { grid-template-columns: repeat(2,1fr); grid-auto-rows: 160px; }
        }
      `}</style>

      <main
        style={{
          background: "#0b1510",
          color: "#e8d5a3",
          minHeight: "100vh",
          paddingTop: "clamp(56px,6vw,78px)",
          opacity: fading ? 0 : 1,
          transition: "opacity 0.36s ease",
        }}
      >
        {/* ══ LANDING ══ */}
        {!explored && (
          <>
            <div className="g-landing">
              <div className="g-left">
                {/* ghost G */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "-5%",
                    left: "-10%",
                    fontFamily: YK,
                    fontWeight: 700,
                    fontSize: "clamp(12rem,20vw,26rem)",
                    color: "rgba(232,213,163,0.016)",
                    lineHeight: 1,
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                >
                  G
                </div>

                <div
                  style={{
                    opacity: heroIn ? 1 : 0,
                    transform: heroIn ? "none" : "translateY(14px)",
                    transition:
                      "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
                    marginBottom: "clamp(0.7rem,1.3vw,1.2rem)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: DM,
                      fontSize: "clamp(0.48rem,0.7vw,0.6rem)",
                      letterSpacing: "0.45em",
                      color: "rgba(212,168,67,0.55)",
                      textTransform: "uppercase",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        width: 24,
                        height: 1,
                        background: "rgba(212,168,67,0.3)",
                        display: "inline-block",
                      }}
                    />
                    Gallery
                  </span>
                </div>

                <div
                  style={{
                    opacity: heroIn ? 1 : 0,
                    transform: heroIn ? "none" : "translateY(26px)",
                    transition:
                      "opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s",
                    marginBottom: "clamp(0.9rem,1.8vw,1.6rem)",
                  }}
                >
                  <h1
                    style={{
                      fontFamily: YK,
                      fontWeight: 700,
                      fontSize: "clamp(2.5rem,5vw,6.5rem)",
                      lineHeight: 0.88,
                      textTransform: "uppercase",
                      color: "#e8d5a3",
                    }}
                  >
                    Every
                    <br />
                    Moment
                    <br />
                    <em style={{ color: "#d4a843", fontStyle: "italic" }}>
                      Captured.
                    </em>
                  </h1>
                </div>

                <div
                  style={{
                    opacity: heroIn ? 1 : 0,
                    transform: heroIn ? "none" : "translateY(18px)",
                    transition:
                      "opacity 0.9s ease 0.35s, transform 0.9s ease 0.35s",
                  }}
                >
                  <p
                    style={{
                      fontFamily: DM,
                      fontSize: "clamp(0.72rem,0.9vw,0.84rem)",
                      lineHeight: 1.85,
                      color: "rgba(232,213,163,0.4)",
                      maxWidth: 320,
                      marginBottom: "clamp(0.4rem,0.8vw,0.75rem)",
                    }}
                  >
                    This isn't a portfolio. It's a record of the people who
                    chose to be here — the conversations, the late nights, the
                    quiet mornings.
                  </p>
                  <p
                    style={{
                      fontFamily: DM,
                      fontSize: "clamp(0.72rem,0.9vw,0.84rem)",
                      lineHeight: 1.85,
                      color: "rgba(232,213,163,0.4)",
                      maxWidth: 320,
                      marginBottom: "clamp(1.4rem,2.2vw,2.2rem)",
                    }}
                  >
                    You didn't need to perform. You just had to show up.{" "}
                    <span style={{ color: "rgba(232,213,163,0.65)" }}>
                      And you did.
                    </span>
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1.2rem",
                    }}
                  >
                    <button onClick={goExplore} className="explore-btn">
                      EXPLORE
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
                          strokeWidth={2.5}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                    <span
                      style={{
                        fontFamily: DM,
                        fontSize: "clamp(0.5rem,0.68vw,0.58rem)",
                        letterSpacing: "0.22em",
                        color: "rgba(232,213,163,0.2)",
                        textTransform: "uppercase",
                      }}
                    >
                      29 photos
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT BENTO */}
              <div
                className="g-right"
                style={{
                  opacity: heroIn ? 1 : 0,
                  transition: "opacity 1.1s ease 0.3s",
                }}
              >
                <div className="bento-grid">
                  {BENTO_PREVIEW.map((b) => {
                    const item = GALLERY_ITEMS.find((i) => i.id === b.id)!;
                    return (
                      <Tile
                        key={b.id}
                        src={item.src}
                        style={{ gridColumn: b.col, gridRow: b.row }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* MARQUEE */}
            <div
              style={{
                borderTop: "1px solid rgba(232,213,163,0.06)",
                padding: "clamp(0.75rem,1.3vw,1.1rem) 0",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "2.5rem",
                  whiteSpace: "nowrap",
                  animation: "marquee 24s linear infinite",
                }}
              >
                {Array(8)
                  .fill(null)
                  .map((_, i) => (
                    <span
                      key={i}
                      style={{ display: "flex", gap: "2.5rem", flexShrink: 0 }}
                    >
                      {[
                        "Moments",
                        "·",
                        "People",
                        "·",
                        "Coffee",
                        "·",
                        "Community",
                        "·",
                        "Vibes",
                        "·",
                        "Events",
                        "·",
                      ].map((w, j) => (
                        <span
                          key={j}
                          style={{
                            fontFamily: YK,
                            fontWeight: w === "·" ? 300 : 700,
                            fontSize: "clamp(0.58rem,0.82vw,0.72rem)",
                            letterSpacing: "0.35em",
                            textTransform: "uppercase",
                            color:
                              w === "·"
                                ? "rgba(212,168,67,0.25)"
                                : "rgba(232,213,163,0.15)",
                          }}
                        >
                          {w}
                        </span>
                      ))}
                    </span>
                  ))}
              </div>
            </div>
          </>
        )}

        {/* ══ EXPLORE ══ */}
        {explored && (
          <>
            {/* STICKY BAR */}
            <div
              style={{
                position: "sticky",
                top: "clamp(56px,6vw,78px)",
                zIndex: 50,
                background: "rgba(11,21,16,0.92)",
                backdropFilter: "blur(16px)",
                borderBottom: "1px solid rgba(232,213,163,0.06)",
              }}
            >
              <div
                style={{
                  maxWidth: MAX_WIDTH,
                  margin: "0 auto",
                  paddingLeft: SITE_PADDING,
                  paddingRight: SITE_PADDING,
                  paddingTop: "0.85rem",
                  paddingBottom: "0.85rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "0.8rem",
                }}
              >
                {/* left */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <button className="back-btn" onClick={goBack}>
                    <svg
                      width="11"
                      height="11"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Back
                  </button>
                  <div
                    style={{
                      width: 1,
                      height: 14,
                      background: "rgba(232,213,163,0.1)",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: YK,
                      fontWeight: 700,
                      fontSize: "clamp(1rem,1.5vw,1.35rem)",
                      textTransform: "uppercase",
                      color: "#e8d5a3",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Gallery
                  </span>
                  <span
                    style={{
                      fontFamily: DM,
                      fontSize: "0.57rem",
                      letterSpacing: "0.22em",
                      color: "rgba(212,168,67,0.45)",
                      textTransform: "uppercase",
                    }}
                  >
                    {items.length} shots
                  </span>
                </div>

                {/* right — All + Shuffle */}
                <div className="view-controls">
                  <button
                    className={`vc-btn${!shuffled ? " active" : ""}`}
                    onClick={handleAll}
                  >
                    All
                  </button>
                  <button
                    className={`vc-btn${shuffled ? " shuffle-active" : ""}`}
                    onClick={handleShuffle}
                    title="Shuffle"
                  >
                    <ShuffleIcon />
                    Shuffle
                  </button>
                </div>
              </div>
            </div>

            {/* PHOTO GRID */}
            <div
              style={{
                maxWidth: MAX_WIDTH,
                margin: "0 auto",
                paddingLeft: SITE_PADDING,
                paddingRight: SITE_PADDING,
                paddingTop: "clamp(1.5rem,2vw,2rem)",
                paddingBottom: "clamp(4rem,7vw,6rem)",
              }}
            >
              <div className="photo-grid" key={gridKey}>
                {items.map((item, idx) => (
                  <FadeBlock
                    key={`${item.id}-${gridKey}`}
                    delay={Math.min(idx * 25, 200)}
                  >
                    <Tile src={item.src} onClick={() => setLightbox(idx)} />
                  </FadeBlock>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      {lightbox !== null && lightboxItem && (
        <Lightbox
          items={items}
          index={lightbox}
          onClose={closeLightbox}
          onPrev={prevLightbox}
          onNext={nextLightbox}
        />
      )}
    </>
  );
}
