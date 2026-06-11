"use client";

import { useState, useEffect } from "react";

type Event = {
  id: string;
  day: string;
  fullDay: string;
  name: string;
  label: string;
  time: string;
  desc: string;
  image: string;
  firstPanel: boolean;
  venue?: string;
  host?: string;
  note?: string;
};

const EVENTS: Event[] = [
  {
    id: "tarot-thursday",
    day: "THU",
    fullDay: "Thursday",
    name: "TAROT",
    label: "TAROT THURSDAY",
    time: "7:00 – 10:00 PM",
    desc: "Pull a card. Sip something warm. Let the night tell you what you already know.",
    image: "/images/events/tarot-thursday.png",
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
    image: "/images/events/film-friday.png",
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
    image: "/images/events/sober-saturday.png",
    firstPanel: false,
  },
  {
    id: "sing-sunday",
    day: "SUN",
    fullDay: "Sunday",
    name: "SING",
    label: "SLOW SUNDAY",
    time: "7:00 – 11:00 PM",
    desc: "Open mic. Acoustic sets. End the week loud, off-key, and happy.",
    image: "/images/events/slow-sunday.png",
    firstPanel: false,
  },
];

export default function EventsPage() {
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
          overflow: hidden;
          border-right: 1px solid rgba(255,255,255,0.07);
          display: block;
          transition: flex 0.5s cubic-bezier(0.4,0,0.2,1);
        }
        .panel:last-child { border-right: none; }

        .panel-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: filter 0.5s ease;
        }

        .panel-img { filter: grayscale(1) brightness(0.5); }
        .panel.first-active .panel-img { filter: grayscale(0.5) brightness(0.65); }
        .panel:hover .panel-img { filter: grayscale(0) brightness(0.72); }

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

        .panel-details {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          margin-bottom: 1.1rem;
        }

        .panel-detail-row {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(0.62rem, 0.8vw, 0.72rem);
          color: rgba(255,255,255,0.32);
          line-height: 1.5;
        }

        .panel-detail-row svg {
          flex-shrink: 0;
          margin-top: 1px;
          opacity: 0.4;
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

        .panel-glare {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          overflow: hidden;
        }
        .panel-glare::after {
          content: '';
          position: absolute;
          top: -20%;
          left: -60%;
          width: 40%;
          height: 140%;
          background: linear-gradient(
            105deg,
            transparent 20%,
            rgba(255,255,255,0.045) 40%,
            rgba(255,255,255,0.09) 50%,
            rgba(255,255,255,0.045) 60%,
            transparent 80%
          );
          transform: skewX(-10deg);
          animation: glare-sweep 4s ease-in-out infinite;
        }
        .panel:nth-child(2) .panel-glare::after { animation-delay: 1s; }
        .panel:nth-child(3) .panel-glare::after { animation-delay: 2s; }
        .panel:nth-child(4) .panel-glare::after { animation-delay: 3s; }

        @keyframes glare-sweep {
          0%   { left: -60%; opacity: 0; }
          10%  { opacity: 1; }
          60%  { left: 120%; opacity: 1; }
          61%  { opacity: 0; }
          100% { left: 120%; opacity: 0; }
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
          position: "relative",
        }}
      >
        {EVENTS.map((event, i) => (
          <div
            key={event.id}
            className={`panel${i === 0 ? " first-active" : ""}`}
          >
            <img src={event.image} alt={event.label} className="panel-img" />

            <div className="panel-grad" />
            <div className="panel-glare" />

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

              <div className="panel-details">
                {event.venue && (
                  <div className="panel-detail-row">
                    <svg
                      width="11"
                      height="11"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {event.venue}
                  </div>
                )}
                {event.host && (
                  <div className="panel-detail-row">
                    <svg
                      width="11"
                      height="11"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    {event.host}
                  </div>
                )}
                {event.note && (
                  <div className="panel-detail-row">
                    <svg
                      width="11"
                      height="11"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {event.note}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
