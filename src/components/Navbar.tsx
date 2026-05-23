"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { label: "ABOUT", href: "/about" },
  { label: "MENU", href: "/menu" },
  { label: "EVENTS", href: "/events" },
  { label: "GALLERY", href: "/gallery" },
];

const socialsLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61582128047471&rdid=1MRsozeB4ayfXL2l&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1EJNrc5kuV%2F#",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/3rdspace2025?igsh=MTc4OHRrNjFwbnE4cg%3D%3D",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162S8.597 18.163 12 18.163s6.162-2.759 6.162-6.162S15.403 5.838 12 5.838zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@3rdspacecafe?_r=1&_t=ZS-96bYCchVqgX",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
];

export const SITE_PADDING = "clamp(1.5rem, 5vw, 4rem)";
export const MAX_WIDTH = 1280;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [socialsOpen, setSocialsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const YK = "var(--font-yanone), 'Yanone Kaffeesatz', sans-serif";
  const DM = "var(--font-dm), 'DM Sans', sans-serif";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openSocials = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setSocialsOpen(true);
  };
  const closeSocials = () => {
    closeTimer.current = setTimeout(() => setSocialsOpen(false), 120);
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: "background 0.5s, border-color 0.5s",
          background: scrolled ? "rgba(15,26,15,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(232,213,163,0.1)"
            : "1px solid transparent",
        }}
      >
        <div
          style={{
            maxWidth: MAX_WIDTH,
            margin: "0 auto",
            paddingLeft: SITE_PADDING,
            paddingRight: SITE_PADDING,
            height: "clamp(60px, 7vw, 80px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <Image
              src="/logo.png"
              alt="3RD SPACE"
              width={52}
              height={52}
              style={{
                objectFit: "contain",
                width: "clamp(120px, 4vw, 52px)",
                height: "clamp(120px, 4vw, 52px)",
              }}
            />
          </Link>

          {/* Desktop Nav */}
          <div
            className="hidden md:flex"
            style={{ alignItems: "center", gap: "0.1rem" }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                style={{
                  fontFamily: DM,
                  fontWeight: 500,
                  fontSize: "clamp(0.6rem, 0.75vw, 0.72rem)",
                  letterSpacing: "0.2em",
                  color: "rgba(232,213,163,0.7)",
                  textDecoration: "none",
                  padding: "0.4rem 0.75rem",
                  borderRadius: 999,
                  transition: "background 0.2s, color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(232,213,163,0.11)";
                  e.currentTarget.style.color = "#e8d5a3";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(232,213,163,0.7)";
                }}
              >
                {link.label}
              </Link>
            ))}

            {/* Socials dropdown */}
            <div
              style={{ position: "relative" }}
              onMouseEnter={openSocials}
              onMouseLeave={closeSocials}
            >
              <button
                style={{
                  fontFamily: DM,
                  fontWeight: 500,
                  fontSize: "clamp(0.6rem, 0.75vw, 0.72rem)",
                  letterSpacing: "0.2em",
                  color: socialsOpen ? "#e8d5a3" : "rgba(232,213,163,0.7)",
                  background: socialsOpen
                    ? "rgba(232,213,163,0.11)"
                    : "transparent",
                  border: "none",
                  padding: "0.4rem 0.75rem",
                  borderRadius: 999,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  transition: "background 0.2s, color 0.2s",
                }}
              >
                SOCIALS
                <svg
                  style={{
                    width: 10,
                    height: 10,
                    transition: "transform 0.2s",
                    transform: socialsOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {socialsOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    height: 12,
                  }}
                />
              )}

              {socialsOpen && (
                <div
                  onMouseEnter={openSocials}
                  onMouseLeave={closeSocials}
                  style={{
                    position: "absolute",
                    top: "calc(100% + 10px)",
                    right: 0,
                    width: 165,
                    background: "rgba(18,30,18,0.97)",
                    backdropFilter: "blur(14px)",
                    border: "1px solid rgba(232,213,163,0.12)",
                    borderRadius: 10,
                    padding: "6px 0",
                    zIndex: 100,
                  }}
                >
                  {socialsLinks.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "9px 14px",
                        margin: "0 4px",
                        borderRadius: 6,
                        fontFamily: DM,
                        fontSize: "0.72rem",
                        letterSpacing: "0.15em",
                        color: "rgba(232,213,163,0.65)",
                        textDecoration: "none",
                        transition: "background 0.15s, color 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(232,213,163,0.08)";
                        e.currentTarget.style.color = "#e8d5a3";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "rgba(232,213,163,0.65)";
                      }}
                    >
                      {s.icon}
                      {s.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop ORDER NOW button */}
            <button
              onClick={() => setComingSoonOpen(true)}
              style={{
                marginLeft: "0.5rem",
                padding: "0.46rem 1.1rem",
                background: "#e8d5a3",
                color: "#0f1a0f",
                fontFamily: DM,
                fontWeight: 800,
                fontSize: "clamp(0.6rem, 0.75vw, 0.72rem)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                border: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#d4a843")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#e8d5a3")
              }
            >
              ORDER NOW
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex md:hidden"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
              flexDirection: "column",
              gap: 5,
            }}
          >
            <span
              style={{
                display: "block",
                width: 22,
                height: 1.5,
                background: "#e8d5a3",
                borderRadius: 1,
                transition: "transform 0.3s",
                transform: mobileOpen
                  ? "rotate(45deg) translateY(6.5px)"
                  : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: 22,
                height: 1.5,
                background: "#e8d5a3",
                borderRadius: 1,
                transition: "opacity 0.3s",
                opacity: mobileOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: "block",
                width: 22,
                height: 1.5,
                background: "#e8d5a3",
                borderRadius: 1,
                transition: "transform 0.3s",
                transform: mobileOpen
                  ? "rotate(-45deg) translateY(-6.5px)"
                  : "none",
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          background: "rgba(10,18,10,0.98)",
          backdropFilter: "blur(20px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "2rem",
          transition: "opacity 0.4s",
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
        }}
      >
        {navLinks.map((link, i) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            style={{
              fontFamily: YK,
              fontWeight: 700,
              fontSize: "clamp(2rem, 8vw, 3rem)",
              color: "#e8d5a3",
              textDecoration: "none",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              transition: `color 0.2s, opacity 0.3s ${i * 60}ms, transform 0.3s ${i * 60}ms`,
              opacity: mobileOpen ? 1 : 0,
              transform: mobileOpen ? "translateY(0)" : "translateY(16px)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#d4a843")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#e8d5a3")}
          >
            {link.label}
          </Link>
        ))}
        <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.5rem" }}>
          {socialsLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: DM,
                fontSize: "0.75rem",
                color: "rgba(232,213,163,0.5)",
                textDecoration: "none",
                letterSpacing: "0.18em",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#e8d5a3")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(232,213,163,0.5)")
              }
            >
              {s.icon}
              {s.label}
            </a>
          ))}
        </div>

        {/* Mobile ORDER NOW button */}
        <button
          onClick={() => {
            setComingSoonOpen(true);
            setMobileOpen(false);
          }}
          style={{
            marginTop: "0.5rem",
            padding: "0.75rem 2.5rem",
            background: "#e8d5a3",
            color: "#0f1a0f",
            fontFamily: DM,
            fontWeight: 800,
            fontSize: "0.8rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            border: "none",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#d4a843")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#e8d5a3")}
        >
          ORDER NOW
        </button>
      </div>

      {/* Coming Soon modal */}
      {comingSoonOpen && (
        <div
          onClick={() => setComingSoonOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(8,14,8,0.85)",
            backdropFilter: "blur(18px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              textAlign: "center",
              padding: "3rem 2.5rem",
              maxWidth: 420,
              border: "1px solid rgba(232,213,163,0.15)",
              background: "rgba(15,26,15,0.6)",
            }}
          >
            <p
              style={{
                fontFamily: YK,
                fontSize: "clamp(2.8rem, 8vw, 4rem)",
                fontWeight: 700,
                color: "#e8d5a3",
                letterSpacing: "0.12em",
                margin: "0 0 0.5rem",
              }}
            >
              COMING SOON
            </p>
            <p
              style={{
                fontFamily: DM,
                fontSize: "0.78rem",
                color: "rgba(232,213,163,0.5)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                margin: "0 0 2rem",
              }}
            >
              Something good is brewing. Stay tuned.
            </p>
            <button
              onClick={() => setComingSoonOpen(false)}
              style={{
                fontFamily: DM,
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                color: "rgba(232,213,163,0.4)",
                background: "none",
                border: "none",
                cursor: "pointer",
                textTransform: "uppercase",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#e8d5a3")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(232,213,163,0.4)")
              }
            >
              ✕ DISMISS
            </button>
          </div>
        </div>
      )}
    </>
  );
}
