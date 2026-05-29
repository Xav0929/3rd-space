"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const YK = "'Yanone Kaffeesatz', sans-serif";
const DM = "'DM Sans', sans-serif";

const EVENTS = [
  {
    id: "tarot-thursday",
    day: "THU",
    fullDay: "Thursday",
    name: "TAROT",
    label: "TAROT THURSDAY",
    time: "7:00 – 10:00 PM",
    desc: "Pull a card. Sip something warm. Let the night tell you what you already know.",
    image: "/events/tarot-thursday.jpg",
    href: "/events/tarot-thursday",
    firstPanel: false,
  },
  {
    id: "film-friday",
    day: "FRI",
    fullDay: "Friday",
    name: "FILM",
    label: "FILM FRIDAY",
    time: "8:00 – 11:00 PM",
    desc: "Curated films. Dim lights. Great coffee. Something different every week.",
    image: "/events/film-friday.jpg",
    href: "/events/film-friday",
    firstPanel: false,
  },
  {
    id: "sober-saturday",
    day: "SAT",
    fullDay: "Saturday",
    name: "SOBER",
    label: "SOBER SATURDAY",
    time: "6:00 – 11:00 PM",
    desc: "No alcohol. No pressure. Just people being present — and really good coffee.",
    image: "/events/sober-saturday.jpg",
    href: "/events/sober-saturday",
    firstPanel: false,
  },
  {
    id: "sing-sunday",
    day: "SUN",
    fullDay: "Sunday",
    name: "SING",
    label: "SING SUNDAY",
    time: "7:00 – 11:00 PM",
    desc: "Open mic. Acoustic sets. End the week loud, off-key, and happy.",
    image: "/events/sing-sunday.jpg",
    href: "/events/sing-sunday",
    firstPanel: false,
  },
];

export default function EventsPage() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Yanone+Kaffeesatz:wght@300;400;700&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #000; overflow: hidden; }

        .panels-wrap {
          display: flex;
          height: 100vh;
          width: 100vw;
        }

        .panel {
          flex: 1;
          position: relative;
          cursor: pointer;
          overflow: hidden;
          border-right: 1px solid rgba(255,255,255,0.07);
          text-decoration: none;
          display: block;
          transition: flex 0.5s cubic-bezier(0.4,0,0.2,1);
        }
        .panel:last-child { border-right: none; }
        .panel:hover { flex: 1.55; }

        .panel-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: filter 0.5s ease, transform 0.7s ease;
          transform: scale(1.03);
        }

        /* default state per panel */
        .panel-img { filter: grayscale(1) brightness(0.5); }
        .panel.first-active .panel-img { filter: grayscale(0.5) brightness(0.65); }
        .panel:hover .panel-img { filter: grayscale(0) brightness(0.72); transform: scale(1.08); }

        /* dark gradient at bottom always */
        .panel-grad {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.88) 0%,
            rgba(0,0,0,0.3) 45%,
            rgba(0,0,0,0.05) 100%
          );
          pointer-events: none;
          transition: opacity 0.4s ease;
        }
        .panel:hover .panel-grad {
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.92) 0%,
            rgba(0,0,0,0.35) 50%,
            rgba(0,0,0,0.0) 100%
          );
        }

        /* day label — visible idle, fades on hover */
        .panel-day {
          position: absolute;
          bottom: 2rem;
          left: 1.5rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.6rem;
          letter-spacing: 0.3em;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          transition: opacity 0.25s ease;
        }
        .panel:hover .panel-day { opacity: 0; }

        /* bottom content — hidden idle, slides up on hover */
        .panel-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 2.5rem 1.8rem 2.2rem;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.35s ease 0.05s, transform 0.35s ease 0.05s;
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
          font-size: clamp(2.2rem, 3.8vw, 4.5rem);
          color: #fff;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          line-height: 0.92;
          margin-bottom: 0.5rem;
          display: block;
        }

        .panel-divider {
          width: 24px;
          height: 1px;
          background: rgba(255,255,255,0.35);
          margin: 0.75rem 0;
        }

        .panel-time {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(0.58rem, 0.8vw, 0.7rem);
          letter-spacing: 0.2em;
          color: rgba(255,255,255,0.45);
          text-transform: uppercase;
          margin-bottom: 0.55rem;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .panel-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(0.72rem, 0.95vw, 0.85rem);
          color: rgba(255,255,255,0.38);
          line-height: 1.75;
          max-width: 260px;
          margin-bottom: 1.1rem;
        }

        .panel-cta {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-family: 'Yanone Kaffeesatz', sans-serif;
          font-weight: 700;
          font-size: clamp(0.6rem, 0.85vw, 0.75rem);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          border-bottom: 1px solid rgba(255,255,255,0.2);
          padding-bottom: 2px;
          transition: color 0.2s, border-color 0.2s;
        }
        .panel:hover .panel-cta:hover {
          color: #fff;
          border-color: rgba(255,255,255,0.6);
        }

        .free-badge {
          display: inline-block;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.52rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 999px;
          padding: 2px 9px;
          margin-left: 8px;
          vertical-align: middle;
        }

        @media (max-width: 640px) {
          body { overflow-y: auto; }
          .panels-wrap { flex-direction: column; height: auto; }
          .panel { flex: none !important; height: 50vh; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.07); }
          .panel:last-child { border-bottom: none; }
          .panel-img { filter: grayscale(0) brightness(0.7) !important; }
          .panel-content { opacity: 1; transform: none; }
          .panel-day { opacity: 0; }
        }
      `}</style>

      <div
        className="panels-wrap"
        style={{
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.7s ease",
        }}
      >
        {EVENTS.map((event, i) => (
          <Link
            key={event.id}
            href={event.href}
            className={`panel${i === 0 ? " first-active" : ""}`}
            onMouseEnter={() => setHovered(event.id)}
            onMouseLeave={() => setHovered(null)}
          >
            <img src={event.image} alt={event.label} className="panel-img" />

            <div className="panel-grad" />

            {/* idle day label */}
            <span className="panel-day">{event.day}</span>

            {/* hover content */}
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
                  style={{ opacity: 0.5 }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                Every {event.fullDay} · {event.time}
                <span className="free-badge">Free</span>
              </div>

              <p className="panel-desc">{event.desc}</p>

              <span className="panel-cta">
                Learn more
                <svg
                  width="11"
                  height="11"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
