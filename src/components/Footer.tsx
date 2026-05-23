"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const SITE_PADDING = "clamp(1.5rem, 5vw, 4rem)";
const FONT = "'Yanone Kaffeesatz', sans-serif";

const footerLinks = {
  "ABOUT US": [
    { label: "Gallery", href: "/gallery" },
    { label: "Team", href: "/about#team" },
    { label: "Communities", href: "/community" },
    { label: "Blog", href: "/blog" },
  ],
  PRODUCT: [
    { label: "Menu", href: "/menu" },
    { label: "Book Now", href: "/book" },
    { label: "Chili", href: "/menu#chili" },
  ],
};

const socials = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61582128047471&rdid=1MRsozeB4ayfXL2l&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1EJNrc5kuV%2F#",
    icon: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/3rdspace2025?igsh=MTc4OHRrNjFwbnE4cg%3D%3D",
    icon: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@3rdspacecafe?_r=1&_t=ZS-96bYCchVqgX",
    icon: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer
      style={{
        width: "100%",
        backgroundColor: "#0f1a0f",
        borderTop: "1px solid rgba(232,213,163,0.1)",
        paddingTop: "clamp(3rem, 6vw, 5rem)",
        paddingBottom: "clamp(1.5rem, 3vw, 2.5rem)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: `0 ${SITE_PADDING}`,
        }}
      >
        {/* Main grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
            gap: "clamp(2rem, 4vw, 3.5rem)",
            marginBottom: "clamp(2.5rem, 5vw, 4rem)",
          }}
        >
          {/* Brand + newsletter col */}
          <div>
            <div style={{ marginBottom: "1rem" }}>
              <Image
                src="/logo.png"
                alt="3RD SPACE"
                width={120}
                height={48}
                style={{ objectFit: "contain", objectPosition: "left" }}
              />
            </div>

            <p
              style={{
                color: "rgba(232,213,163,0.4)",
                fontSize: "clamp(0.65rem, 1vw, 0.75rem)",
                lineHeight: 1.6,
                marginBottom: "1rem",
                fontFamily: FONT,
                maxWidth: 180,
              }}
            >
              Sign up for the mailing list
            </p>

            <div
              style={{
                display: "flex",
                border: "1px solid rgba(232,213,163,0.2)",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(232,213,163,0.5)";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(232,213,163,0.2)";
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  flex: 1,
                  minWidth: 0,
                  background: "transparent",
                  color: "#e8d5a3",
                  fontSize: "clamp(0.65rem, 1vw, 0.75rem)",
                  fontFamily: FONT,
                  padding: "0.625rem 0.75rem",
                  outline: "none",
                  border: "none",
                }}
              />
              <button
                style={{
                  padding: "0.625rem 0.75rem",
                  borderLeft: "1px solid rgba(232,213,163,0.2)",
                  background: "transparent",
                  color: "rgba(232,213,163,0.5)",
                  cursor: "pointer",
                  transition: "color 0.2s, background 0.2s",
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#e8d5a3";
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(232,213,163,0.05)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    "rgba(232,213,163,0.5)";
                  (e.currentTarget as HTMLElement).style.background =
                    "transparent";
                }}
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
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Link cols */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4
                style={{
                  fontFamily: FONT,
                  fontWeight: 700,
                  color: "#e8d5a3",
                  fontSize: "clamp(0.7rem, 1.1vw, 0.8rem)",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  marginBottom: "clamp(1rem, 2vw, 1.5rem)",
                }}
              >
                {heading}
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      style={{
                        fontFamily: FONT,
                        color: "rgba(232,213,163,0.5)",
                        fontSize: "clamp(0.8rem, 1.2vw, 0.95rem)",
                        textDecoration: "none",
                        transition: "color 0.2s",
                        letterSpacing: "0.05em",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color =
                          "#e8d5a3";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color =
                          "rgba(232,213,163,0.5)";
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Community / socials col */}
          <div>
            <h4
              style={{
                fontFamily: FONT,
                fontWeight: 700,
                color: "#e8d5a3",
                fontSize: "clamp(0.7rem, 1.1vw, 0.8rem)",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                marginBottom: "clamp(1rem, 2vw, 1.5rem)",
              }}
            >
              COMMUNITY
            </h4>
            <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  style={{
                    color: "rgba(232,213,163,0.5)",
                    transition: "color 0.2s",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#e8d5a3";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color =
                      "rgba(232,213,163,0.5)";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(232,213,163,0.1)",
            paddingTop: "clamp(1.25rem, 2.5vw, 2rem)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
          }}
        >
          <p
            style={{
              fontFamily: FONT,
              color: "rgba(232,213,163,0.3)",
              fontSize: "clamp(0.65rem, 1vw, 0.75rem)",
              letterSpacing: "0.1em",
              margin: 0,
            }}
          >
            © 2026 3RDSPACE. All rights reserved.
          </p>
          <p
            style={{
              fontFamily: FONT,
              color: "rgba(232,213,163,0.2)",
              fontSize: "clamp(0.65rem, 1vw, 0.75rem)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Relax · Create · Breathe
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Yanone+Kaffeesatz:wght@400;700&display=swap');
        input::placeholder { color: rgba(232,213,163,0.25); }
      `}</style>
    </footer>
  );
}
