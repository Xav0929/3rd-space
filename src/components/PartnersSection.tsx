"use client";

import { useEffect, useRef, useState } from "react";

const YK = "'Yanone Kaffeesatz', sans-serif";
const DM = "'DM Sans', sans-serif";

const partners = [
  {
    name: "The Ink Outbreak",
    tagline: "Tattoo Studio",
    description:
      "Bold ink, fearless artistry. Where every piece tells a story on skin.",
    href: "https://www.facebook.com/people/The-Ink-Outbreak/61563689398536/",
    logo: "/partners/ink-outbreak.png",
  },
  {
    name: "Touchdown Philippines",
    tagline: "Travel & Tours",
    description:
      "Island-hopping adventures curated across the Philippine archipelago.",
    href: "https://www.facebook.com/TheBanatuBackpackers",
    logo: "/partners/touchdown.png",
  },
  {
    name: "Johnny's Tarot",
    tagline: "Readings & Guidance",
    description:
      "Clarity through the cards. Spiritual insight for every seeker.",
    href: "https://www.facebook.com/johnnystarot",
    logo: "/partners/johnnys-tarot.png",
  },
];

export default function PartnersSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        width: "100%",
        backgroundColor: "#0f1a0f",
        borderTop: "1px solid rgba(232,213,163,0.1)",
        paddingTop: "clamp(4rem, 8vw, 6rem)",
        paddingBottom: "clamp(4rem, 8vw, 6rem)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 clamp(1.5rem, 5vw, 4rem)",
        }}
      >
        {/* Heading */}
        <div
          style={{
            marginBottom: "clamp(2.5rem, 5vw, 4rem)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <p
            style={{
              fontFamily: DM,
              fontWeight: 400,
              fontSize: "clamp(0.5rem, 0.85vw, 0.72rem)",
              letterSpacing: "0.38em",
              color: "rgba(232,213,163,0.45)",
              textTransform: "uppercase",
              margin: "0 0 0.6rem",
            }}
          >
            Our Network
          </p>
          <h2
            style={{
              fontFamily: YK,
              fontWeight: 700,
              fontSize: "clamp(2rem, 3.5vw, 3rem)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "#e8d5a3",
              margin: "0 0 1rem",
              lineHeight: 1,
            }}
          >
            Community{" "}
            <em style={{ color: "#d4a843", fontStyle: "italic" }}>Partners</em>
          </h2>
          <div
            style={{
              width: 48,
              height: 1,
              background:
                "linear-gradient(90deg, rgba(212,168,67,0.8), transparent)",
            }}
          />
        </div>

        {/* Cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "clamp(1rem, 2vw, 1.5rem)",
          }}
        >
          {partners.map((partner, i) => (
            <PartnerCard
              key={partner.name}
              partner={partner}
              index={i}
              visible={visible}
            />
          ))}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Yanone+Kaffeesatz:wght@400;700&family=DM+Sans:wght@400;700&display=swap');
      `}</style>
    </section>
  );
}

function PartnerCard({
  partner,
  index,
  visible,
}: {
  partner: (typeof partners)[0];
  index: number;
  visible: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={partner.href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "clamp(1.5rem, 3vw, 2rem)",
        border: hovered
          ? "1px solid rgba(232,213,163,0.35)"
          : "1px solid rgba(232,213,163,0.1)",
        background: hovered ? "rgba(232,213,163,0.03)" : "transparent",
        textDecoration: "none",
        transition:
          "border-color 0.3s ease, background 0.3s ease, transform 0.3s ease",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        opacity: visible ? 1 : 0,
        transitionDelay: `${index * 0.12 + 0.2}s`,
        transitionProperty: "opacity, transform, border-color, background",
        transitionDuration: "0.7s, 0.7s, 0.3s, 0.3s",
        transitionTimingFunction: "ease",
        cursor: "pointer",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "clamp(1.25rem, 2.5vw, 1.75rem)",
        }}
      >
        <div
          style={{
            width: "clamp(100px, 12vw, 140px)",
            height: "clamp(100px, 12vw, 140px)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(232,213,163,0.04)",
            border: hovered
              ? "1px solid rgba(232,213,163,0.3)"
              : "1px solid rgba(232,213,163,0.1)",
            overflow: "hidden",
            transition: "border-color 0.3s ease",
            flexShrink: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={partner.logo}
            alt={`${partner.name} logo`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s ease",
              transform: hovered ? "scale(1.08)" : "scale(1)",
            }}
            onError={(e) => {
              const el = e.currentTarget as HTMLImageElement;
              el.style.display = "none";
              const fallback = el.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = "flex";
            }}
          />
          {/* Fallback initials */}
          <div
            style={{
              display: "none",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <span
              style={{
                fontFamily: YK,
                fontWeight: 700,
                fontSize: "2.5rem",
                color: "#d4a843",
                letterSpacing: "0.1em",
              }}
            >
              {partner.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 3)}
            </span>
          </div>
        </div>
      </div>

      {/* Text */}
      <p
        style={{
          fontFamily: DM,
          fontWeight: 400,
          fontSize: "clamp(0.5rem, 0.8vw, 0.68rem)",
          letterSpacing: "0.3em",
          color: "#d4a843",
          textTransform: "uppercase",
          margin: "0 0 0.4rem",
          textAlign: "center",
        }}
      >
        {partner.tagline}
      </p>

      <h3
        style={{
          fontFamily: YK,
          fontWeight: 700,
          fontSize: "clamp(1.2rem, 2vw, 1.5rem)",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          color: "#e8d5a3",
          margin: "0 0 0.75rem",
          lineHeight: 1.1,
          textAlign: "center",
        }}
      >
        {partner.name}
      </h3>

      <p
        style={{
          fontFamily: DM,
          fontSize: "clamp(0.75rem, 1.1vw, 0.85rem)",
          color: "rgba(232,213,163,0.45)",
          lineHeight: 1.65,
          margin: "0 0 1.5rem",
          flex: 1,
          textAlign: "center",
        }}
      >
        {partner.description}
      </p>

      {/* CTA row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          color: hovered ? "#e8d5a3" : "rgba(232,213,163,0.35)",
          transition: "color 0.3s ease",
        }}
      >
        <span
          style={{
            fontFamily: YK,
            fontWeight: 700,
            fontSize: "clamp(0.65rem, 1vw, 0.75rem)",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
          }}
        >
          Visit Page
        </span>
        <svg
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{
            transition: "transform 0.3s ease",
            transform: hovered ? "translateX(4px)" : "translateX(0)",
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </a>
  );
}
