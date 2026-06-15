"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EVENTS } from "@/lib/events";

export default function EventsPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Yanone+Kaffeesatz:wght@300;400;700&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .panels-wrap {
          display: flex;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
        }

        /* ── Each panel ── */
        .panel {
          flex: 1;
          position: relative;
          overflow: hidden;
          border-right: 1px solid rgba(255,255,255,0.06);
          cursor: pointer;
          /* Only flex and filter are animated — both GPU-composited */
          transition: flex 0.55s cubic-bezier(0.4,0,0.2,1);
        }
        .panel:last-child { border-right: none; }

        /* Sibling shrink on hover */
        .panels-wrap:has(.panel:hover) .panel { flex: 0.55; }
        .panel:hover { flex: 3; }

        /* ── Images ── */
        .panel-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          /* will-change lets the browser promote to its own layer */
          will-change: filter, transform;
          transition: filter 0.5s ease, transform 0.55s cubic-bezier(0.4,0,0.2,1);
        }

        /* Default: fully B&W */
        .panel-img {
          filter: grayscale(1) brightness(0.45);
        }
        /* First panel: 50% color at rest */
        .panel:first-child .panel-img {
          filter: grayscale(0.5) brightness(0.55);
        }
        /* Non-hovered panels go darker when something IS hovered */
        .panels-wrap:has(.panel:hover) .panel:not(:hover) .panel-img {
          filter: grayscale(1) brightness(0.28);
        }
        /* Hovered panel: full color */
        .panel:hover .panel-img {
          filter: grayscale(0) brightness(0.72);
          transform: scale(1.04);
        }

        /* ── Gradient overlay ── */
        .panel-grad {
          position: absolute; inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.88) 0%,
            rgba(0,0,0,0.15) 45%,
            transparent 100%
          );
          pointer-events: none;
        }

        /* ── Idle day label ── */
        .panel-day {
          position: absolute;
          bottom: 1.8rem; left: 50%;
          transform: translateX(-50%);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.52rem; letter-spacing: 0.32em;
          color: rgba(255,255,255,0.3); text-transform: uppercase;
          white-space: nowrap; pointer-events: none;
          transition: opacity 0.2s ease;
        }
        .panel:hover .panel-day { opacity: 0; }

        /* ── Hover content ── */
        .panel-content {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 2.5rem 1.8rem 2.2rem;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.28s ease 0.05s, transform 0.28s ease 0.05s;
          pointer-events: none;
        }
        .panel:hover .panel-content {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        .panel-event-name {
          font-family: 'Yanone Kaffeesatz', sans-serif;
          font-weight: 700;
          font-size: clamp(1.9rem, 3.2vw, 3.8rem);
          color: #fff; text-transform: uppercase;
          letter-spacing: -0.01em; line-height: 0.9;
          margin-bottom: 0.5rem; display: block;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        .panel-divider {
          width: 20px; height: 1px;
          background: rgba(255,255,255,0.28);
          margin: 0.7rem 0;
        }

        .panel-time {
          display: flex; align-items: center; gap: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(0.52rem, 0.7vw, 0.62rem);
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(255,255,255,0.38); margin-bottom: 0.5rem;
        }

        .panel-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(0.65rem, 0.85vw, 0.78rem);
          color: rgba(255,255,255,0.33); line-height: 1.78;
          max-width: 230px; margin-bottom: 1.1rem;
        }

        .free-badge {
          display: inline-block;
          font-family: 'DM Sans', sans-serif; font-size: 0.48rem;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(255,255,255,0.42);
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 999px; padding: 2px 8px; margin-left: 6px;
        }

        .details-btn {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'DM Sans', sans-serif; font-size: 0.56rem;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(255,255,255,0.48);
          background: transparent;
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 999px; padding: 5px 14px;
          cursor: pointer;
          transition: color 0.18s, border-color 0.18s, background 0.18s;
        }
        .details-btn:hover {
          color: #fff;
          border-color: rgba(255,255,255,0.42);
          background: rgba(255,255,255,0.06);
        }

        /* ── Mobile — vertical stack ── */
        @media (max-width: 640px) {
          .panels-wrap {
            flex-direction: column;
            height: auto;
            min-height: 100dvh;
            overflow-y: auto;
          }
          /* Kill all the hover flex tricks on mobile */
          .panels-wrap:has(.panel:hover) .panel { flex: none !important; }
          .panel {
            flex: none !important;
            height: 58vw;
            min-height: 220px;
            border-right: none;
            border-bottom: 1px solid rgba(255,255,255,0.06);
          }
          .panel:last-child { border-bottom: none; }
          /* All images full color on mobile */
          .panel-img,
          .panel:first-child .panel-img,
          .panels-wrap:has(.panel:hover) .panel:not(:hover) .panel-img {
            filter: grayscale(0) brightness(0.6) !important;
            transform: none !important;
          }
          /* Content always visible on mobile */
          .panel-content {
            opacity: 1 !important;
            transform: none !important;
            pointer-events: auto;
            padding: 1.5rem 1.2rem 1.5rem;
          }
          .panel-day { display: none; }
          .panel-event-name { font-size: clamp(1.6rem, 6vw, 2.4rem); white-space: normal; }
          .panel-desc { max-width: 100%; }
        }
      `}</style>

      <div
        className="panels-wrap"
        style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.6s ease" }}
      >
        {EVENTS.map((event) => (
          <div
            key={event.id}
            className="panel"
            onClick={() => router.push(`/events/${event.id}`)}
          >
            <img
              src={event.image}
              alt={event.label}
              className="panel-img"
              onError={(e) => {
                const el = e.currentTarget as HTMLImageElement;
                el.style.display = "none";
              }}
            />
            <div className="panel-grad" />

            <span className="panel-day">{event.day}</span>

            <div className="panel-content">
              <span className="panel-event-name">{event.label}</span>
              <div className="panel-divider" />
              <div className="panel-time">
                <svg
                  width="11"
                  height="11"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  style={{ opacity: 0.45 }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                Every {event.fullDay} · {event.time}
                <span className="free-badge">Free</span>
              </div>
              <p className="panel-desc">{event.desc}</p>
              <button className="details-btn">
                <svg
                  width="10"
                  height="10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5-5 5M6 12h12"
                  />
                </svg>
                Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
