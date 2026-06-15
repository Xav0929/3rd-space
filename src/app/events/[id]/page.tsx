"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  MapPin,
  User,
  Info,
  CheckCircle2,
} from "lucide-react";
import { getEvent } from "@/lib/events";

// Must match Navbar exactly
const SITE_PADDING = "clamp(1.5rem, 5vw, 4rem)";
const MAX_WIDTH = 1280;

export default function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const event = getEvent(id);
  const router = useRouter();

  if (!event) notFound();

  const gallery: string[] = event.gallery ?? [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Yanone+Kaffeesatz:wght@300;400;700&family=DM+Sans:wght@300;400;500&display=swap');

        .event-page {
          min-height: 100vh;
          background: #0a0a0a;
          color: #fff;
        }

        /* ── Hero ── */
        .event-hero {
          position: relative;
          height: 58vh;
          min-height: 320px;
          overflow: hidden;
          background: #111;
        }
        .event-hero img {
          width: 100%; height: 100%;
          object-fit: cover;
          filter: brightness(0.48);
        }
        .event-hero-grad {
          position: absolute; inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.05) 0%,
            rgba(0,0,0,0) 20%,
            rgba(0,0,0,0.7) 75%,
            rgba(0,0,0,1) 100%
          );
        }
        /* Hero content uses the same horizontal padding as navbar */
        .event-hero-content {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          max-width: ${MAX_WIDTH}px;
          margin: 0 auto;
          padding: 2rem ${SITE_PADDING} 2.5rem;
        }

        .back-btn {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'DM Sans', sans-serif; font-size: 0.55rem;
          letter-spacing: 0.25em; text-transform: uppercase;
          color: rgba(255,255,255,0.3); background: none; border: none;
          cursor: pointer; padding: 0; margin-bottom: 1rem;
          transition: color 0.2s;
        }
        .back-btn:hover { color: rgba(255,255,255,0.65); }

        .hero-day {
          font-family: 'DM Sans', sans-serif; font-size: 0.55rem;
          letter-spacing: 0.3em; text-transform: uppercase;
          color: rgba(255,255,255,0.3); margin-bottom: 0.35rem;
        }
        .hero-title {
          font-family: 'Yanone Kaffeesatz', sans-serif; font-weight: 700;
          font-size: clamp(2.8rem, 7vw, 5.5rem);
          color: #fff; text-transform: uppercase;
          line-height: 0.9; letter-spacing: -0.01em;
        }

        /* ── Body — same max-width + padding as navbar ── */
        .event-body {
          max-width: ${MAX_WIDTH}px;
          margin: 0 auto;
          padding: 3rem ${SITE_PADDING} 6rem;
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 0;
        }

        /* ── Left column ── */
        .event-left {
          padding-right: 3rem;
          border-right: 1px solid rgba(255,255,255,0.07);
        }

        .meta-stack { display: flex; flex-direction: column; gap: 0.55rem; margin-bottom: 2rem; }
        .meta-row {
          display: flex; align-items: center; gap: 8px;
          font-family: 'DM Sans', sans-serif; font-size: 0.72rem;
          color: rgba(255,255,255,0.35); letter-spacing: 0.05em;
        }
        .meta-row svg { opacity: 0.35; flex-shrink: 0; }
        .free-pill {
          font-family: 'DM Sans', sans-serif; font-size: 0.48rem;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 999px; padding: 2px 9px; margin-left: 6px;
        }

        .section-divider {
          width: 100%; height: 1px;
          background: rgba(255,255,255,0.06); margin: 1.8rem 0;
        }

        .long-desc {
          font-family: 'DM Sans', sans-serif; font-size: 0.88rem;
          color: rgba(255,255,255,0.4); line-height: 1.9; margin-bottom: 2rem;
        }
        .section-label {
          font-family: 'DM Sans', sans-serif; font-size: 0.52rem;
          letter-spacing: 0.28em; text-transform: uppercase;
          color: rgba(255,255,255,0.2); margin-bottom: 1rem;
        }
        .expect-list {
          list-style: none; padding: 0;
          display: flex; flex-direction: column; gap: 0.75rem;
          margin-bottom: 2.2rem;
        }
        .expect-item {
          display: flex; align-items: flex-start; gap: 10px;
          font-family: 'DM Sans', sans-serif; font-size: 0.8rem;
          color: rgba(255,255,255,0.35); line-height: 1.5;
        }
        .expect-item svg { flex-shrink: 0; margin-top: 2px; opacity: 0.22; }

        .walkin-note {
          display: flex; align-items: center; gap: 10px;
          font-family: 'DM Sans', sans-serif; font-size: 0.72rem;
          color: rgba(255,255,255,0.22); letter-spacing: 0.04em;
          border-top: 1px solid rgba(255,255,255,0.06);
          padding-top: 1.5rem;
        }
        .walkin-note svg { opacity: 0.22; flex-shrink: 0; }

        /* ── Right column — gallery ── */
        .event-right { padding-left: 2.5rem; }
        .gallery-label {
          font-family: 'DM Sans', sans-serif; font-size: 0.52rem;
          letter-spacing: 0.28em; text-transform: uppercase;
          color: rgba(255,255,255,0.2); margin-bottom: 1rem;
        }
        .gallery-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5px;
        }
        .gallery-item {
          position: relative; overflow: hidden;
          border-radius: 3px; background: #161616;
          aspect-ratio: 4/3;
        }
        .gallery-item:first-child {
          grid-column: 1 / -1;
          aspect-ratio: 16/9;
        }
        .gallery-item img {
          width: 100%; height: 100%; object-fit: cover;
          filter: brightness(0.65);
          transition: filter 0.35s ease, transform 0.45s ease;
          will-change: transform;
        }
        .gallery-item:hover img {
          filter: brightness(0.88);
          transform: scale(1.04);
        }
        .gallery-placeholder {
          aspect-ratio: 4/3;
          background: rgba(255,255,255,0.025);
          border: 1px dashed rgba(255,255,255,0.07);
          border-radius: 3px;
        }
        .gallery-placeholder:first-child {
          grid-column: 1 / -1;
          aspect-ratio: 16/9;
        }
        .gallery-coming-soon {
          grid-column: 1 / -1;
          font-family: 'DM Sans', sans-serif; font-size: 0.52rem;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(255,255,255,0.1);
          padding: 1.5rem 0; text-align: center;
        }

        /* ── Responsive ── */
        @media (max-width: 860px) {
          .event-body {
            grid-template-columns: 1fr;
            padding-bottom: 4rem;
          }
          .event-left {
            padding-right: 0;
            border-right: none;
            border-bottom: 1px solid rgba(255,255,255,0.07);
            padding-bottom: 2.5rem;
            margin-bottom: 2.5rem;
          }
          .event-right { padding-left: 0; }
        }

        @media (max-width: 480px) {
          .event-hero { height: 50vh; min-height: 280px; }
          .hero-title { font-size: 2.4rem; }
          .long-desc { font-size: 0.82rem; }
        }
      `}</style>

      <div className="event-page">
        {/* Hero */}
        <div className="event-hero">
          <img
            src={event.image}
            alt={event.label}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="event-hero-grad" />
          <div className="event-hero-content">
            <button className="back-btn" onClick={() => router.push("/events")}>
              <ArrowLeft size={11} />
              All events
            </button>
            <p className="hero-day">Every {event.fullDay}</p>
            <h1 className="hero-title">{event.label}</h1>
          </div>
        </div>

        {/* Body */}
        <div className="event-body">
          {/* LEFT */}
          <div className="event-left">
            <div className="meta-stack">
              <div className="meta-row">
                <Clock size={12} />
                Every {event.fullDay} · {event.time}
                <span className="free-pill">Free entry</span>
              </div>
              <div className="meta-row">
                <MapPin size={12} />
                {event.venue}
              </div>
              {event.host && (
                <div className="meta-row">
                  <User size={12} />
                  {event.host}
                </div>
              )}
              {event.note && (
                <div className="meta-row">
                  <Info size={12} />
                  {event.note}
                </div>
              )}
            </div>

            <div className="section-divider" />
            <p className="long-desc">{event.longDesc}</p>

            <p className="section-label">What to expect</p>
            <ul className="expect-list">
              {event.whatToExpect.map((item, i) => (
                <li key={i} className="expect-item">
                  <CheckCircle2 size={13} />
                  {item}
                </li>
              ))}
            </ul>

            <div className="walkin-note">
              <svg
                width="13"
                height="13"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Walk-ins always welcome — no booking, no sign-up, just show up.
            </div>
          </div>

          {/* RIGHT — gallery */}
          <div className="event-right">
            <p className="gallery-label">From past nights</p>
            {gallery.length > 0 ? (
              <div className="gallery-grid">
                {gallery.slice(0, 5).map((src, i) => (
                  <div key={i} className="gallery-item">
                    <img src={src} alt={`${event.label} ${i + 1}`} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="gallery-grid">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="gallery-placeholder" />
                ))}
                <p className="gallery-coming-soon">photos coming soon</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
