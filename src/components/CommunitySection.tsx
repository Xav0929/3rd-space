"use client";

import Link from "next/link";

const SITE_PADDING = "clamp(1.5rem, 5vw, 4rem)";

const stats = [
  { num: "500+", label: "Members" },
  { num: "8mths", label: "Running" },
  { num: "50+", label: "Events Held" },
];

export default function CommunitySection() {
  return (
    <section
      style={{
        width: "100%",
        backgroundColor: "#152015",
        position: "relative",
        overflow: "hidden",
        padding: "clamp(4rem, 8vw, 7rem) 0",
      }}
    >
      {/* Decorative background — right side */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "45%",
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {/* Steam lines */}
        <svg
          style={{
            position: "absolute",
            right: "clamp(2rem, 6vw, 5rem)",
            top: "50%",
            transform: "translateY(-50%)",
            opacity: 0.08,
            width: "clamp(120px, 18vw, 260px)",
            height: "clamp(120px, 18vw, 260px)",
          }}
          viewBox="0 0 200 200"
          fill="none"
        >
          <path
            d="M40 160 C40 120, 80 100, 80 60 C80 20, 40 0, 40 0"
            stroke="#e8d5a3"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M80 160 C80 120, 120 100, 120 60 C120 20, 80 0, 80 0"
            stroke="#e8d5a3"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M120 160 C120 120, 160 100, 160 60 C160 20, 120 0, 120 0"
            stroke="#e8d5a3"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        {/* Floating cards */}
        <div
          style={{
            position: "absolute",
            right: "clamp(3rem, 8vw, 6rem)",
            bottom: "clamp(2rem, 5vw, 4rem)",
            width: "clamp(60px, 7vw, 96px)",
            height: "clamp(80px, 9vw, 128px)",
            background: "rgba(232,213,163,0.04)",
            border: "1px solid rgba(232,213,163,0.08)",
            borderRadius: 4,
            transform: "rotate(6deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "clamp(6rem, 13vw, 10rem)",
            bottom: "clamp(3rem, 7vw, 6rem)",
            width: "clamp(50px, 6vw, 80px)",
            height: "clamp(70px, 8vw, 112px)",
            background: "rgba(212,168,67,0.04)",
            border: "1px solid rgba(212,168,67,0.08)",
            borderRadius: 4,
            transform: "rotate(-3deg)",
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: `0 ${SITE_PADDING}`,
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "clamp(2.5rem, 5vw, 4rem)",
        }}
      >
        {/* Two-col on desktop, stacked on mobile */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 420px), 1fr))",
            gap: "clamp(2.5rem, 6vw, 5rem)",
            alignItems: "center",
          }}
        >
          {/* Left col — large decorative text on desktop */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "clamp(200px, 30vw, 420px)",
              position: "relative",
            }}
          >
            <span
              style={{
                fontFamily: "'Yanone Kaffeesatz', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(6rem, 18vw, 22rem)",
                lineHeight: 1,
                color: "rgba(232,213,163,0.04)",
                userSelect: "none",
                letterSpacing: "-0.02em",
                position: "absolute",
                whiteSpace: "nowrap",
              }}
            >
              JOIN
            </span>
            {/* Community icon cluster */}
            <div
              style={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  width: "clamp(60px, 8vw, 100px)",
                  height: "clamp(60px, 8vw, 100px)",
                  borderRadius: "50%",
                  border: "1px solid rgba(232,213,163,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  style={{ width: "40%", height: "40%", color: "#d4a843" }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: "clamp(28px, 3.5vw, 44px)",
                      height: "clamp(28px, 3.5vw, 44px)",
                      borderRadius: "50%",
                      backgroundColor:
                        i === 1
                          ? "rgba(212,168,67,0.15)"
                          : "rgba(232,213,163,0.07)",
                      border: `1px solid ${i === 1 ? "rgba(212,168,67,0.3)" : "rgba(232,213,163,0.1)"}`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right col — text content */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                color: "rgba(232,213,163,0.4)",
                fontSize: "0.65rem",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                marginBottom: "0.875rem",
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
              Connect With Us
            </span>

            <h2
              style={{
                fontFamily: "'Yanone Kaffeesatz', sans-serif",
                fontWeight: 700,
                color: "#e8d5a3",
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                lineHeight: 0.95,
                letterSpacing: "0.02em",
                margin: "0 0 clamp(1rem, 2vw, 1.5rem)",
                textTransform: "uppercase",
              }}
            >
              3RD SPACE
              <br />
              <span style={{ fontStyle: "italic", color: "#d4a843" }}>
                COMMUNITY
              </span>
            </h2>

            <p
              style={{
                color: "rgba(232,213,163,0.55)",
                fontSize: "clamp(0.8rem, 1.2vw, 0.9rem)",
                lineHeight: 1.7,
                marginBottom: "0.75rem",
                maxWidth: 380,
              }}
            >
              More than a café — it&apos;s a place where creatives,
              entrepreneurs, and wanderers find their people.
            </p>
            <p
              style={{
                color: "rgba(232,213,163,0.35)",
                fontSize: "clamp(0.7rem, 1vw, 0.8rem)",
                lineHeight: 1.7,
                marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
                maxWidth: 380,
              }}
            >
              Join events, get early access to vouchers, and be part of
              something that feels like home.
            </p>

            <Link
              href="/community"
              style={{
                alignSelf: "flex-start",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.75rem",
                background: "#e8d5a3",
                color: "#0f1a0f",
                fontFamily: "'Yanone Kaffeesatz', sans-serif",
                fontSize: "clamp(0.8rem, 1.2vw, 1rem)",
                fontWeight: 700,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                padding:
                  "clamp(0.75rem, 1.2vw, 0.875rem) clamp(1.5rem, 3vw, 2rem)",
                textDecoration: "none",
                transition: "background 0.3s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#d4a843";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#e8d5a3";
              }}
            >
              JOIN NOW
              <svg
                style={{ width: "0.75rem", height: "0.75rem" }}
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
            </Link>

            {/* Stats */}
            <div
              style={{
                display: "flex",
                gap: "clamp(1.5rem, 4vw, 2.5rem)",
                marginTop: "clamp(2rem, 4vw, 3.5rem)",
                paddingTop: "clamp(1.5rem, 3vw, 2.5rem)",
                borderTop: "1px solid rgba(232,213,163,0.1)",
              }}
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <p
                    style={{
                      fontFamily: "'Yanone Kaffeesatz', sans-serif",
                      fontWeight: 700,
                      color: "#d4a843",
                      fontSize: "clamp(1.25rem, 2.5vw, 2rem)",
                      margin: 0,
                      lineHeight: 1,
                    }}
                  >
                    {s.num}
                  </p>
                  <p
                    style={{
                      color: "rgba(232,213,163,0.4)",
                      fontSize: "clamp(0.55rem, 0.9vw, 0.7rem)",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      marginTop: "0.35rem",
                      fontFamily: "'Yanone Kaffeesatz', sans-serif",
                    }}
                  >
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Yanone+Kaffeesatz:wght@400;700&display=swap');
      `}</style>
    </section>
  );
}
