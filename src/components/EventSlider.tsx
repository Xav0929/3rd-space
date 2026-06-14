"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

const events = [
  {
    id: 1,
    tag: "COZY SPACE",
    title: "3RD SPACE LOUNGE",
    description: "Your home away from home. Chill, work, or just exist.",
    img: "/images/event-lounge.png",
    accent: "#d4a843",
    href: "/events/lounge",
  },
  {
    id: 2,
    tag: "MIND READ",
    title: "TAROT THURSDAY",
    description: "Weekly tarot sessions every Thursday. Book your reading.",
    img: "/images/event-tarot.png",
    accent: "#9b7fd4",
    href: "/events/tarot-thursday",
  },
  {
    id: 3,
    tag: "ARTS IN 3RD SPACE",
    title: "TATTOO ANNIVERSARY",
    description: "Local tattoo artists take over 3rd Space. Live art, all day.",
    img: "/images/event-tattoo.png",
    accent: "#e8d5a3",
    href: "/events/tattoo-anniversary",
  },
  {
    id: 4,
    tag: "BUSINESS SERIES",
    title: "COZY VENTURE",
    description: "Entrepreneurship talks in the most relaxed setting possible.",
    img: "/images/event-cozy-venture.png",
    accent: "#7fd49b",
    href: "/events/cozy-venture",
  },
  {
    id: 5,
    tag: "FOOD & DRINKS",
    title: "CAFÉ BITES",
    description:
      "Handcrafted drinks and bites made for your third space moment.",
    img: "/images/event-food.png",
    accent: "#d47f7f",
    href: "/events/food",
  },
];

const MAX_WIDTH = 1280;

export default function EventSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: true,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <>
      <style>{`
        /* ─── EventSlider ─────────────────────────────────────────── */

        .evs-section {
          width: 100%;
          background: #0f1a0f;
          padding-top: 0;
          overflow: hidden;
        }

        /* Header row */
        .evs-header-wrap {
          display: flex;
          justify-content: center;
        }
        .evs-header {
          width: 100%;
          max-width: ${MAX_WIDTH}px;
          padding-left: clamp(1.5rem, 5vw, 4rem);
          padding-right: clamp(1.5rem, 5vw, 4rem);
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: clamp(2.5rem, 5vw, 5rem);
          padding-bottom: clamp(1rem, 2.5vw, 2rem);
        }
        .evs-eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .evs-eyebrow-line {
          display: block;
          width: 32px;
          height: 1px;
          background: rgba(232,213,163,0.3);
          flex-shrink: 0;
        }
        .evs-eyebrow-text {
          font-family: var(--font-dm), 'DM Sans', sans-serif;
          font-size: 0.68rem;
          letter-spacing: 0.3em;
          color: rgba(232,213,163,0.5);
          text-transform: uppercase;
        }

        /* Embla viewport */
        .evs-viewport {
          overflow: hidden;
        }
        .evs-track {
          display: flex;
          gap: clamp(8px, 1vw, 12px);
          /* Left-align track with max-width container, respecting site padding */
          padding-left: max(
            calc((100vw - ${MAX_WIDTH}px) / 2 + clamp(1.5rem, 5vw, 4rem)),
            clamp(1.5rem, 5vw, 4rem)
          );
          padding-right: clamp(1.5rem, 5vw, 4rem);
        }

        /* Individual event card */
        .evs-card {
          position: relative;
          flex-shrink: 0;
          /* Desktop default: show ~4-5 cards */
          width: clamp(220px, 22vw, 300px);
          aspect-ratio: 3 / 4;
          overflow: hidden;
          display: block;
          text-decoration: none;
          cursor: pointer;
        }

        /* Card image layer */
        .evs-img {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          background-color: #1c2b1c;
          transition: transform 0.7s ease;
        }
        .evs-card:hover .evs-img {
          transform: scale(1.06);
        }

        /* Gradient overlay */
        .evs-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(10,18,10,0.95) 0%,
            rgba(10,18,10,0.35) 50%,
            transparent 100%
          );
        }

        /* Tag */
        .evs-tag-wrap {
          position: absolute;
          top: 16px;
          left: 16px;
          z-index: 10;
        }
        .evs-tag-text {
          font-family: var(--font-dm), 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.25em;
          font-weight: 700;
          text-transform: uppercase;
        }
        .evs-tag-line {
          height: 1px;
          margin-top: 4px;
          width: 32px;
          opacity: 0.5;
        }

        /* Card bottom content */
        .evs-card-body {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1.2rem 1rem 1.4rem;
          z-index: 10;
        }
        .evs-card-title {
          font-family: var(--font-yanone), 'Yanone Kaffeesatz', sans-serif;
          font-weight: 700;
          color: #e8d5a3;
          font-size: clamp(1rem, 1.8vw, 1.4rem);
          line-height: 1.0;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin: 0 0 8px;
        }
        .evs-card-desc {
          font-family: var(--font-dm), 'DM Sans', sans-serif;
          font-size: 0.72rem;
          color: rgba(232,213,163,0.6);
          line-height: 1.5;
          margin: 0;
          /* Hidden on desktop until hover */
          opacity: 0;
          transform: translateY(8px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .evs-card:hover .evs-card-desc {
          opacity: 1;
          transform: translateY(0);
        }

        /* Bottom accent bar */
        .evs-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0%;
          height: 2px;
          transition: width 0.5s ease;
        }
        .evs-card:hover .evs-bar {
          width: 100%;
        }

        /* ─── TOUCH DEVICES — always show desc & bar ────────────── */
        /* On touch/mobile, hover doesn't exist — reveal content statically */
        @media (hover: none) {
          .evs-card-desc {
            opacity: 1 !important;
            transform: translateY(0) !important;
          }
          .evs-bar {
            width: 100% !important;
          }
          /* Disable the image zoom on tap (it fires strangely on mobile) */
          .evs-card:hover .evs-img {
            transform: none;
          }
        }

        /* Controls */
        .evs-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding-top: clamp(1rem, 2vw, 1.8rem);
          padding-bottom: clamp(2rem, 5vw, 4rem);
        }
        .evs-controls-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        /* Prev/Next buttons — 44px min tap target */
        .evs-btn {
          width: 44px;
          height: 44px;
          border: 1px solid rgba(232,213,163,0.2);
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: rgba(232,213,163,0.5);
          flex-shrink: 0;
          transition: color 0.2s, border-color 0.2s;
          /* Remove default tap highlight on iOS */
          -webkit-tap-highlight-color: transparent;
        }
        .evs-btn:hover,
        .evs-btn:focus-visible {
          color: #e8d5a3;
          border-color: rgba(232,213,163,0.5);
          outline: none;
        }

        /* Dot indicators */
        .evs-dots {
          display: flex;
          gap: 6px;
          align-items: center;
        }
        .evs-dot {
          height: 6px;
          border-radius: 3px;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: width 0.3s ease, background 0.3s ease;
          /* Ensure enough tap height */
          min-width: 6px;
          /* Expand tap area without enlarging visual */
          position: relative;
        }
        .evs-dot::before {
          content: '';
          position: absolute;
          inset: -8px -4px;
        }

        .evs-drag-hint {
          font-family: var(--font-dm), 'DM Sans', sans-serif;
          font-size: 0.6rem;
          letter-spacing: 0.28em;
          color: rgba(232,213,163,0.2);
          margin: 0;
          text-transform: uppercase;
        }

        /* ─── MOBILE PORTRAIT (≤480px) ──────────────────────────── */
        /* Show ~1.5 cards — peek of next card entices swiping */
        @media (max-width: 480px) {
          .evs-card {
            width: clamp(200px, 62vw, 240px);
          }
          .evs-card-title {
            font-size: clamp(0.95rem, 4.5vw, 1.15rem);
          }
          .evs-card-body {
            padding: 1rem 0.875rem 1.2rem;
          }
        }

        /* ─── SMALL PHONES (≤380px) ─────────────────────────────── */
        @media (max-width: 380px) {
          .evs-card {
            width: clamp(180px, 68vw, 210px);
          }
          .evs-tag-text {
            font-size: 9px;
            letter-spacing: 0.18em;
          }
          .evs-card-title {
            font-size: 0.9rem;
            margin-bottom: 5px;
          }
          .evs-card-desc {
            font-size: 0.65rem;
          }
          .evs-header {
            padding-top: 2rem;
            padding-bottom: 0.75rem;
          }
        }

        /* ─── LANDSCAPE PHONES (≤812px wide, short viewport) ────── */
        @media (orientation: landscape) and (max-height: 600px) {
          .evs-card {
            /* Landscape phone: wider cards, height constrained by viewport */
            width: clamp(160px, 32vw, 220px);
            /* Override 3/4 aspect — too tall for landscape phone viewport */
            aspect-ratio: unset;
            height: clamp(180px, 60vh, 260px);
          }
          .evs-header {
            padding-top: 1.5rem;
            padding-bottom: 0.75rem;
          }
          .evs-controls {
            padding-top: 0.75rem;
            padding-bottom: 1.5rem;
          }
        }

        /* ─── SMALL TABLETS PORTRAIT (481px–768px) ──────────────── */
        @media (min-width: 481px) and (max-width: 768px) and (orientation: portrait) {
          .evs-card {
            /* Show ~2 cards + peek */
            width: clamp(220px, 42vw, 290px);
          }
        }

        /* ─── TABLETS PORTRAIT (769px–1024px) ───────────────────── */
        @media (min-width: 769px) and (max-width: 1024px) and (orientation: portrait) {
          .evs-card {
            /* Show ~3 cards */
            width: clamp(220px, 30vw, 280px);
          }
        }

        /* ─── TABLETS LANDSCAPE (641px–1366px landscape) ─────────── */
        /* iPads, Galaxy Tab, Xiaomi Pad in landscape — show 3-4 cards */
        @media (min-width: 641px) and (max-width: 1366px) and (orientation: landscape) {
          .evs-card {
            width: clamp(200px, 25vw, 280px);
          }
        }

        /* ─── NEST HUB / SMALL ANDROID LANDSCAPE (~1024×600) ─────── */
        @media (min-width: 900px) and (max-width: 1100px) and (max-height: 680px) {
          .evs-card {
            width: clamp(180px, 26vw, 240px);
            /* Keep it from being too tall at this short viewport */
            aspect-ratio: unset;
            height: clamp(200px, 52vh, 280px);
          }
        }
      `}</style>

      <section className="evs-section">
        {/* Header */}
        <div className="evs-header-wrap">
          <div className="evs-header">
            <div className="evs-eyebrow">
              <span className="evs-eyebrow-line" />
              <span className="evs-eyebrow-text">Events &amp; Happenings</span>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div ref={emblaRef} className="evs-viewport">
          <div className="evs-track">
            {events.map((event) => (
              <Link key={event.id} href={event.href} className="evs-card">
                {/* Image */}
                <div
                  className="evs-img"
                  style={{ backgroundImage: `url(${event.img})` }}
                />
                {/* Gradient */}
                <div className="evs-overlay" />

                {/* Tag */}
                <div className="evs-tag-wrap">
                  <span
                    className="evs-tag-text"
                    style={{ color: event.accent }}
                  >
                    {event.tag}
                  </span>
                  <div
                    className="evs-tag-line"
                    style={{ backgroundColor: event.accent }}
                  />
                </div>

                {/* Body */}
                <div className="evs-card-body">
                  <h3 className="evs-card-title">{event.title}</h3>
                  <p className="evs-card-desc">{event.description}</p>
                </div>

                {/* Accent bar */}
                <div
                  className="evs-bar"
                  style={{ backgroundColor: event.accent }}
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="evs-controls">
          <div className="evs-controls-row">
            <button
              onClick={scrollPrev}
              className="evs-btn"
              aria-label="Previous event"
            >
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
                  strokeWidth={1.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="evs-dots">
              {scrollSnaps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  className="evs-dot"
                  aria-label={`Go to event ${i + 1}`}
                  style={{
                    width: i === selectedIndex ? 24 : 6,
                    background:
                      i === selectedIndex ? "#d4a843" : "rgba(232,213,163,0.2)",
                  }}
                />
              ))}
            </div>

            <button
              onClick={scrollNext}
              className="evs-btn"
              aria-label="Next event"
            >
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
                  strokeWidth={1.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <p className="evs-drag-hint">DRAG TO EXPLORE ——</p>
        </div>
      </section>
    </>
  );
}
