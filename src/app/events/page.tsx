"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const YK = "'Yanone Kaffeesatz', sans-serif";
const DM = "'DM Sans', sans-serif";

const EVENTS = [
  {
    id: "tarot-thursday",
    day: "THU",
    name: "TAROT",
    label: "TAROT THURSDAY",
    image: "/gallery/g23.png",
    href: "/events/tarot-thursday",
  },
  {
    id: "film-friday",
    day: "FRI",
    name: "FILM",
    label: "FILM FRIDAY",
    image: "/gallery/g14.png",
    href: "/events/film-friday",
  },
  {
    id: "sober-saturday",
    day: "SAT",
    name: "SOBER",
    label: "SOBER SATURDAY",
    image: "/gallery/g1.png",
    href: "/events/sober-saturday",
  },
  {
    id: "sing-sunday",
    day: "SUN",
    name: "SING",
    label: "SING SUNDAY",
    image: "/gallery/g8.png",
    href: "/events/sing-sunday",
  },
];

export default function EventsPage() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Yanone+Kaffeesatz:wght@300;400;700&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #000; overflow: hidden; }

        .panel {
          flex: 1;
          position: relative;
          cursor: pointer;
          overflow: hidden;
          height: 100vh;
          border-right: 1px solid rgba(255,255,255,0.07);
          text-decoration: none;
          display: block;
        }
        .panel:last-child { border-right: none; }

        .panel-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(1) brightness(0.55);
          transition: filter 0.4s ease, transform 0.6s ease;
          transform: scale(1.02);
        }
        .panel:hover .panel-img {
          filter: grayscale(0) brightness(0.85);
          transform: scale(1.06);
        }

        .panel-label {
          position: absolute;
          bottom: clamp(1.5rem, 3vh, 2.5rem);
          left: clamp(1.2rem, 2vw, 2rem);
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .panel:hover .panel-label {
          opacity: 1;
          transform: translateY(0);
        }

        .panel-label-text {
          font-family: 'Yanone Kaffeesatz', sans-serif;
          font-weight: 700;
          font-size: clamp(1.4rem, 2.8vw, 3rem);
          color: #fff;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          line-height: 1;
          display: block;
        }

        .panel-day {
          position: absolute;
          bottom: clamp(1.5rem, 3vh, 2.5rem);
          left: clamp(1.2rem, 2vw, 2rem);
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(0.5rem, 0.75vw, 0.65rem);
          letter-spacing: 0.3em;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          opacity: 1;
          transition: opacity 0.2s ease;
        }
        .panel:hover .panel-day { opacity: 0; }

        @media (max-width: 600px) {
          body { overflow: auto; }
          .panels-wrap { flex-direction: column !important; height: auto !important; }
          .panel { height: 50vh; border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.07); }
          .panel:last-child { border-bottom: none; }
          .panel-label { opacity: 1; transform: none; }
          .panel-day { opacity: 0; }
          .panel-img { filter: grayscale(0) brightness(0.8); }
        }
      `}</style>

      <div
        className="panels-wrap"
        style={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      >
        {EVENTS.map((event) => (
          <Link key={event.id} href={event.href} className="panel">
            <img src={event.image} alt={event.label} className="panel-img" />

            <span className="panel-day">{event.day}</span>

            <div className="panel-label">
              <span className="panel-label-text">{event.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
