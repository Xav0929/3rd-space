"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const SITE_PADDING = "clamp(1.5rem, 5vw, 4rem)";
const MAX_WIDTH = 1280;
const YK = "'Yanone Kaffeesatz', sans-serif";
const DM = "'DM Sans', sans-serif";

// Fade-in on scroll hook
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function FadeBlock({
  children,
  delay = 0,
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.9s ease ${delay}ms, transform 0.9s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Team data — edit names/roles/quotes here ──
const TEAM = [
  {
    initials: "FF",
    name: "France Falram",
    role: "Founder & Owner",
    tag: "The Visionary",
    quote:
      "I didn't want to open a café. I wanted to open a feeling — and put a roof over it.",
    image: "/profile-france.png",
  },
  {
    initials: "MA",
    name: "Maria Andres",
    role: "Co-Owner & Operations",
    tag: "The Backbone",
    quote:
      "Every detail you don't notice — that's me. The comfort here doesn't happen by accident.",
    image: null,
  },
  {
    initials: "RG",
    name: "Rico Garcia",
    role: "Partner & Creative Director",
    tag: "The Aesthetic",
    quote:
      "The space itself is the product. I obsess over every corner so you don't have to think about it — you just feel it.",
    image: null,
  },
];

export default function AboutPage() {
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Yanone+Kaffeesatz:wght@300;400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0f1a0f; }
        ::selection { background: #d4a843; color: #0f1a0f; }

        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-25%) } }

        .team-card { transition: border-color 0.3s, background 0.3s; }
        .team-card:hover { border-color: rgba(212,168,67,0.3) !important; background: rgba(212,168,67,0.03) !important; }
        .team-card:hover .team-initials { color: rgba(212,168,67,0.25) !important; }

        .social-link { transition: color 0.2s, border-color 0.2s; }
        .social-link:hover { color: #d4a843 !important; border-color: rgba(212,168,67,0.4) !important; }
      `}</style>

      <main
        style={{
          background: "#0f1a0f",
          color: "#e8d5a3",
          minHeight: "100vh",
          paddingTop: "clamp(60px, 7vw, 80px)",
        }}
      >
        {/* ── HERO ── */}
        <section
          style={{
            position: "relative",
            minHeight: "90vh",
            display: "flex",
            alignItems: "flex-end",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontFamily: YK,
              fontWeight: 700,
              fontSize: "clamp(18rem, 40vw, 40rem)",
              color: "rgba(232,213,163,0.03)",
              lineHeight: 1,
              userSelect: "none",
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            3RD
          </div>

          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              width: 1,
              height: "100%",
              background:
                "linear-gradient(to bottom, transparent, rgba(232,213,163,0.08) 30%, rgba(232,213,163,0.08) 70%, transparent)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              maxWidth: MAX_WIDTH,
              width: "100%",
              margin: "0 auto",
              paddingLeft: SITE_PADDING,
              paddingRight: SITE_PADDING,
              paddingBottom: "clamp(3rem, 6vw, 5rem)",
              paddingTop: "clamp(4rem, 8vw, 7rem)",
            }}
          >
            <div
              style={{
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? "none" : "translateY(20px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
              }}
            >
              <span
                style={{
                  fontFamily: DM,
                  fontSize: "clamp(0.55rem, 0.8vw, 0.7rem)",
                  letterSpacing: "0.4em",
                  color: "rgba(232,213,163,0.35)",
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
                }}
              >
                <span
                  style={{
                    width: 32,
                    height: 1,
                    background: "rgba(232,213,163,0.25)",
                    display: "inline-block",
                  }}
                />
                Our Story
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "clamp(2rem, 5vw, 6rem)",
                alignItems: "flex-end",
              }}
            >
              <div>
                <h1
                  style={{
                    fontFamily: YK,
                    fontWeight: 700,
                    fontSize: "clamp(3.5rem, 8vw, 9rem)",
                    lineHeight: 0.85,
                    letterSpacing: "-0.01em",
                    textTransform: "uppercase",
                    color: "#e8d5a3",
                    opacity: heroLoaded ? 1 : 0,
                    transform: heroLoaded ? "none" : "translateY(40px)",
                    transition:
                      "opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s",
                  }}
                >
                  We Don't
                  <br />
                  Sell{" "}
                  <em style={{ color: "#d4a843", fontStyle: "italic" }}>
                    Coffee.
                  </em>
                  <br />
                  We Sell
                  <br />
                  <em
                    style={{
                      color: "rgba(232,213,163,0.3)",
                      fontStyle: "normal",
                    }}
                  >
                    Feeling.
                  </em>
                </h1>
              </div>
              <div
                style={{
                  opacity: heroLoaded ? 1 : 0,
                  transform: heroLoaded ? "none" : "translateY(30px)",
                  transition:
                    "opacity 0.9s ease 0.5s, transform 0.9s ease 0.5s",
                  paddingBottom: "0.5rem",
                }}
              >
                <p
                  style={{
                    fontFamily: DM,
                    fontSize: "clamp(0.85rem, 1.2vw, 1rem)",
                    lineHeight: 1.8,
                    color: "rgba(232,213,163,0.55)",
                    maxWidth: 420,
                  }}
                >
                  3rd Space was built on one quiet conviction — that people
                  deserve a place where they can just{" "}
                  <span style={{ color: "#e8d5a3" }}>exist</span>. Not perform,
                  not rush, not justify their presence with every sip. Just be.
                </p>
                <div
                  style={{
                    marginTop: "clamp(1.5rem, 3vw, 2.5rem)",
                    width: 48,
                    height: 1,
                    background: "#d4a843",
                  }}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 120,
              background: "linear-gradient(to top, #0f1a0f, transparent)",
              pointerEvents: "none",
            }}
          />
        </section>

        {/* ── MANIFESTO STRIP ── */}
        <section
          style={{
            borderTop: "1px solid rgba(232,213,163,0.08)",
            borderBottom: "1px solid rgba(232,213,163,0.08)",
            padding: "clamp(1.2rem, 2vw, 1.8rem) 0",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "clamp(2rem, 4vw, 4rem)",
              whiteSpace: "nowrap",
              animation: "marquee 18s linear infinite",
            }}
          >
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <span
                  key={i}
                  style={{
                    display: "flex",
                    gap: "clamp(2rem, 4vw, 4rem)",
                    flexShrink: 0,
                  }}
                >
                  {[
                    "Relax",
                    "·",
                    "Create",
                    "·",
                    "Breathe",
                    "·",
                    "Belong",
                    "·",
                    "Linger",
                    "·",
                    "Return",
                    "·",
                  ].map((w, j) => (
                    <span
                      key={j}
                      style={{
                        fontFamily: YK,
                        fontWeight: w === "·" ? 300 : 700,
                        fontSize: "clamp(0.75rem, 1.2vw, 1rem)",
                        letterSpacing: "0.35em",
                        textTransform: "uppercase",
                        color:
                          w === "·"
                            ? "rgba(212,168,67,0.4)"
                            : "rgba(232,213,163,0.3)",
                      }}
                    >
                      {w}
                    </span>
                  ))}
                </span>
              ))}
          </div>
        </section>

        {/* ── TEAM ── */}
        <section
          style={{
            paddingTop: "clamp(4rem, 8vw, 7rem)",
            paddingBottom: "clamp(4rem, 8vw, 7rem)",
          }}
        >
          <div
            style={{
              maxWidth: MAX_WIDTH,
              margin: "0 auto",
              paddingLeft: SITE_PADDING,
              paddingRight: SITE_PADDING,
            }}
          >
            <FadeBlock>
              <p
                style={{
                  fontFamily: DM,
                  fontSize: "clamp(0.55rem, 0.75vw, 0.65rem)",
                  letterSpacing: "0.45em",
                  color: "rgba(212,168,67,0.6)",
                  textTransform: "uppercase",
                  marginBottom: "clamp(2.5rem, 4vw, 3.5rem)",
                  textAlign: "center",
                }}
              >
                The People Behind It
              </p>
            </FadeBlock>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "clamp(2.5rem, 6vw, 7rem)",
                flexWrap: "wrap",
              }}
            >
              {TEAM.map((person, i) => (
                <FadeBlock key={person.name} delay={i * 120}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      maxWidth: 200,
                    }}
                  >
                    {/* Circle avatar */}
                    <div
                      style={{
                        width: "clamp(80px, 10vw, 120px)",
                        height: "clamp(80px, 10vw, 120px)",
                        borderRadius: "50%",
                        border: "1px solid rgba(212,168,67,0.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "clamp(1rem, 1.8vw, 1.4rem)",
                        position: "relative",
                        overflow: "hidden",
                        background:
                          "radial-gradient(circle at 35% 35%, rgba(212,168,67,0.18), rgba(15,26,15,0.9))",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: -5,
                          borderRadius: "50%",
                          border: "1px solid rgba(212,168,67,0.08)",
                        }}
                      />
                      {person.image ? (
                        <img
                          src={person.image}
                          alt={person.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "50%",
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            fontFamily: YK,
                            fontWeight: 700,
                            fontSize: "clamp(1.4rem, 2.5vw, 2.2rem)",
                            color: "#d4a843",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {person.initials}
                        </span>
                      )}
                    </div>

                    {/* Tag */}
                    <span
                      style={{
                        fontFamily: DM,
                        fontSize: "clamp(0.45rem, 0.6vw, 0.55rem)",
                        letterSpacing: "0.35em",
                        color: "rgba(212,168,67,0.6)",
                        textTransform: "uppercase",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {person.tag}
                    </span>

                    {/* Name */}
                    <h3
                      style={{
                        fontFamily: YK,
                        fontWeight: 700,
                        fontSize: "clamp(1.1rem, 1.8vw, 1.6rem)",
                        textTransform: "uppercase",
                        color: "#e8d5a3",
                        lineHeight: 1.1,
                        marginBottom: "0.35rem",
                      }}
                    >
                      {person.name}
                    </h3>

                    {/* Role */}
                    <p
                      style={{
                        fontFamily: DM,
                        fontSize: "clamp(0.6rem, 0.8vw, 0.7rem)",
                        letterSpacing: "0.15em",
                        color: "rgba(232,213,163,0.3)",
                        textTransform: "uppercase",
                        marginBottom: "clamp(0.8rem, 1.2vw, 1rem)",
                      }}
                    >
                      {person.role}
                    </p>

                    {/* Divider dot */}
                    <div
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: "rgba(212,168,67,0.3)",
                        marginBottom: "clamp(0.8rem, 1.2vw, 1rem)",
                      }}
                    />

                    {/* Quote */}
                    <p
                      style={{
                        fontFamily: YK,
                        fontWeight: 300,
                        fontSize: "clamp(0.85rem, 1.2vw, 1.05rem)",
                        lineHeight: 1.6,
                        color: "rgba(232,213,163,0.35)",
                        fontStyle: "italic",
                      }}
                    >
                      "{person.quote}"
                    </p>
                  </div>
                </FadeBlock>
              ))}
            </div>
          </div>
        </section>

        {/* Thin divider */}
        <div
          style={{
            maxWidth: MAX_WIDTH,
            margin: "0 auto",
            paddingLeft: SITE_PADDING,
            paddingRight: SITE_PADDING,
          }}
        >
          <div
            style={{
              height: 1,
              background:
                "linear-gradient(to right, transparent, rgba(232,213,163,0.08) 20%, rgba(232,213,163,0.08) 80%, transparent)",
            }}
          />
        </div>

        {/* ── ORIGIN STORY ── */}
        <section
          style={{
            maxWidth: MAX_WIDTH,
            margin: "0 auto",
            paddingLeft: SITE_PADDING,
            paddingRight: SITE_PADDING,
            paddingTop: "clamp(5rem, 10vw, 9rem)",
            paddingBottom: "clamp(5rem, 10vw, 9rem)",
          }}
        >
          <FadeBlock>
            <p
              style={{
                fontFamily: DM,
                fontSize: "clamp(0.55rem, 0.75vw, 0.65rem)",
                letterSpacing: "0.45em",
                color: "rgba(212,168,67,0.6)",
                textTransform: "uppercase",
                marginBottom: "clamp(3rem, 6vw, 5rem)",
              }}
            >
              Chapter 01 — The Idea
            </p>
          </FadeBlock>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
              gap: "clamp(3rem, 6vw, 8rem)",
              alignItems: "start",
            }}
          >
            <FadeBlock delay={100}>
              <h2
                style={{
                  fontFamily: YK,
                  fontWeight: 700,
                  fontSize: "clamp(2.5rem, 4.5vw, 5rem)",
                  lineHeight: 0.9,
                  letterSpacing: "0.01em",
                  textTransform: "uppercase",
                  color: "#e8d5a3",
                  marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
                }}
              >
                A Place
                <br />
                <em style={{ color: "#d4a843" }}>Everyone</em>
                <br />
                Deserves
              </h2>
              <blockquote
                style={{
                  borderLeft: "2px solid #d4a843",
                  paddingLeft: "clamp(1rem, 2vw, 1.5rem)",
                  marginTop: "clamp(2rem, 4vw, 3rem)",
                }}
              >
                <p
                  style={{
                    fontFamily: YK,
                    fontWeight: 300,
                    fontSize: "clamp(1.1rem, 1.8vw, 1.6rem)",
                    lineHeight: 1.5,
                    color: "rgba(232,213,163,0.6)",
                    fontStyle: "italic",
                  }}
                >
                  "The food and drinks — they're the bonus. What I really wanted
                  to give people was a reason to stay."
                </p>
                <cite
                  style={{
                    display: "block",
                    marginTop: "1rem",
                    fontFamily: DM,
                    fontSize: "clamp(0.6rem, 0.85vw, 0.72rem)",
                    letterSpacing: "0.25em",
                    color: "rgba(212,168,67,0.7)",
                    textTransform: "uppercase",
                    fontStyle: "normal",
                  }}
                >
                  — The Founder
                </cite>
              </blockquote>
            </FadeBlock>

            <FadeBlock delay={200}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "clamp(1.5rem, 2.5vw, 2rem)",
                }}
              >
                <p
                  style={{
                    fontFamily: DM,
                    fontSize: "clamp(0.85rem, 1.15vw, 1rem)",
                    lineHeight: 1.9,
                    color: "rgba(232,213,163,0.5)",
                  }}
                >
                  It started the way most honest things do — with a feeling.
                  There were already enough cafés. Enough places that served
                  good espresso and moved you along. What was missing was
                  somewhere you could{" "}
                  <span style={{ color: "#e8d5a3" }}>actually land</span>.
                </p>
                <p
                  style={{
                    fontFamily: DM,
                    fontSize: "clamp(0.85rem, 1.15vw, 1rem)",
                    lineHeight: 1.9,
                    color: "rgba(232,213,163,0.5)",
                  }}
                >
                  The founder had watched it happen too many times — people
                  rushing, people eating standing up, people apologizing for
                  sitting too long. He wanted to build the opposite of that. A
                  place where time moved differently. Where the chair was yours
                  for as long as you needed it.
                </p>
                <p
                  style={{
                    fontFamily: DM,
                    fontSize: "clamp(0.85rem, 1.15vw, 1rem)",
                    lineHeight: 1.9,
                    color: "rgba(232,213,163,0.5)",
                  }}
                >
                  The name came easy.{" "}
                  <span style={{ color: "#e8d5a3" }}>3rd Space</span> — not
                  home, not work. The space in between where you go to remember
                  who you are outside of both.
                </p>
              </div>
            </FadeBlock>
          </div>
        </section>

        {/* ── WHAT WE'RE SELLING ── */}
        <section
          style={{
            background: "#0d160d",
            borderTop: "1px solid rgba(232,213,163,0.06)",
            borderBottom: "1px solid rgba(232,213,163,0.06)",
            paddingTop: "clamp(5rem, 10vw, 9rem)",
            paddingBottom: "clamp(5rem, 10vw, 9rem)",
          }}
        >
          <div
            style={{
              maxWidth: MAX_WIDTH,
              margin: "0 auto",
              paddingLeft: SITE_PADDING,
              paddingRight: SITE_PADDING,
            }}
          >
            <FadeBlock>
              <p
                style={{
                  fontFamily: DM,
                  fontSize: "clamp(0.55rem, 0.75vw, 0.65rem)",
                  letterSpacing: "0.45em",
                  color: "rgba(212,168,67,0.6)",
                  textTransform: "uppercase",
                  marginBottom: "clamp(3rem, 6vw, 5rem)",
                }}
              >
                Chapter 02 — What We're Really Selling
              </p>
            </FadeBlock>

            <FadeBlock delay={100}>
              <h2
                style={{
                  fontFamily: YK,
                  fontWeight: 700,
                  fontSize: "clamp(3rem, 6.5vw, 7.5rem)",
                  lineHeight: 0.88,
                  letterSpacing: "-0.01em",
                  textTransform: "uppercase",
                  color: "#e8d5a3",
                  marginBottom: "clamp(3rem, 6vw, 5rem)",
                  maxWidth: 900,
                }}
              >
                The Ambience
                <br />
                <em style={{ color: "#d4a843" }}>Is the</em> Product.
              </h2>
            </FadeBlock>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
                gap: "clamp(1.5rem, 3vw, 2.5rem)",
                marginTop: "clamp(1rem, 2vw, 2rem)",
              }}
            >
              {[
                {
                  number: "01",
                  title: "The Feeling of Arrival",
                  body: "The moment you walk in and your shoulders drop. The smell, the light, the sound — all engineered to tell your nervous system: you're safe here. You can slow down.",
                },
                {
                  number: "02",
                  title: "The Permission to Stay",
                  body: "No timers. No rush. No side-eye from the staff. Your table is yours. The coffee and food are your reason to be here — but you are always welcome longer than both.",
                },
                {
                  number: "03",
                  title: "The People Around You",
                  body: "Creatives, students, workers, wanderers. Everyone minding their own business, but everyone choosing to be here. There is quiet power in sharing a room with people who also chose stillness.",
                },
              ].map((pillar, i) => (
                <FadeBlock key={pillar.number} delay={i * 120}>
                  <div
                    className="team-card"
                    style={{
                      padding: "clamp(1.5rem, 2.5vw, 2rem)",
                      border: "1px solid rgba(232,213,163,0.08)",
                      height: "100%",
                      position: "relative",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: YK,
                        fontWeight: 700,
                        fontSize: "clamp(3rem, 5vw, 5rem)",
                        color: "rgba(212,168,67,0.1)",
                        lineHeight: 1,
                        display: "block",
                        marginBottom: "1rem",
                      }}
                    >
                      {pillar.number}
                    </span>
                    <h3
                      style={{
                        fontFamily: YK,
                        fontWeight: 700,
                        fontSize: "clamp(1.1rem, 1.6vw, 1.5rem)",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        color: "#e8d5a3",
                        marginBottom: "1rem",
                        lineHeight: 1.2,
                      }}
                    >
                      {pillar.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: DM,
                        fontSize: "clamp(0.8rem, 1.05vw, 0.9rem)",
                        lineHeight: 1.8,
                        color: "rgba(232,213,163,0.45)",
                      }}
                    >
                      {pillar.body}
                    </p>
                  </div>
                </FadeBlock>
              ))}
            </div>
          </div>
        </section>

        {/* ── BIG STATEMENT ── */}
        <section
          style={{
            paddingTop: "clamp(6rem, 12vw, 11rem)",
            paddingBottom: "clamp(6rem, 12vw, 11rem)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontFamily: YK,
              fontWeight: 700,
              fontSize: "clamp(10rem, 25vw, 28rem)",
              color: "rgba(232,213,163,0.02)",
              lineHeight: 1,
              userSelect: "none",
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            SPACE
          </div>

          <div
            style={{
              maxWidth: MAX_WIDTH,
              margin: "0 auto",
              paddingLeft: SITE_PADDING,
              paddingRight: SITE_PADDING,
              textAlign: "center",
            }}
          >
            <FadeBlock>
              <p
                style={{
                  fontFamily: DM,
                  fontSize: "clamp(0.6rem, 0.9vw, 0.75rem)",
                  letterSpacing: "0.45em",
                  color: "rgba(212,168,67,0.5)",
                  textTransform: "uppercase",
                  marginBottom: "clamp(2rem, 4vw, 3rem)",
                }}
              >
                What We Know For Sure
              </p>
            </FadeBlock>
            <FadeBlock delay={100}>
              <p
                style={{
                  fontFamily: YK,
                  fontWeight: 700,
                  fontSize: "clamp(1.8rem, 3.5vw, 4rem)",
                  lineHeight: 1.15,
                  color: "#e8d5a3",
                  maxWidth: 780,
                  margin: "0 auto",
                  letterSpacing: "0.01em",
                }}
              >
                "Happy people don't need a reason to be happy here. They just
                need a <em style={{ color: "#d4a843" }}>place</em> that lets
                them be."
              </p>
            </FadeBlock>
          </div>
        </section>

        {/* ── STATS + JOIN ── */}
        <section
          style={{
            background: "#0d160d",
            borderTop: "1px solid rgba(232,213,163,0.06)",
            paddingTop: "clamp(4rem, 8vw, 7rem)",
            paddingBottom: "clamp(4rem, 8vw, 7rem)",
          }}
        >
          <div
            style={{
              maxWidth: MAX_WIDTH,
              margin: "0 auto",
              paddingLeft: SITE_PADDING,
              paddingRight: SITE_PADDING,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
                gap: "clamp(3rem, 5vw, 5rem)",
                alignItems: "center",
              }}
            >
              <FadeBlock>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "clamp(2rem, 3vw, 2.5rem)",
                  }}
                >
                  {[
                    { num: "500+", label: "Members in our community" },
                    { num: "3 yrs", label: "Of building this feeling" },
                    {
                      num: "50+",
                      label: "Events that brought people together",
                    },
                    { num: "9am–12am", label: "Every single day, we're here" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "clamp(1rem, 2vw, 1.5rem)",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: YK,
                          fontWeight: 700,
                          fontSize: "clamp(2rem, 3.5vw, 3.5rem)",
                          color: "#d4a843",
                          lineHeight: 1,
                          flexShrink: 0,
                          minWidth: "clamp(5rem, 9vw, 9rem)",
                        }}
                      >
                        {s.num}
                      </span>
                      <span
                        style={{
                          fontFamily: DM,
                          fontSize: "clamp(0.75rem, 1vw, 0.85rem)",
                          color: "rgba(232,213,163,0.4)",
                          letterSpacing: "0.05em",
                          lineHeight: 1.4,
                        }}
                      >
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </FadeBlock>

              <FadeBlock delay={150}>
                <div>
                  <h3
                    style={{
                      fontFamily: YK,
                      fontWeight: 700,
                      fontSize: "clamp(2rem, 3.5vw, 4rem)",
                      lineHeight: 0.9,
                      textTransform: "uppercase",
                      color: "#e8d5a3",
                      marginBottom: "clamp(1rem, 2vw, 1.5rem)",
                    }}
                  >
                    Come Find
                    <br />
                    <em style={{ color: "#d4a843" }}>Your Corner.</em>
                  </h3>
                  <p
                    style={{
                      fontFamily: DM,
                      fontSize: "clamp(0.8rem, 1.05vw, 0.9rem)",
                      lineHeight: 1.8,
                      color: "rgba(232,213,163,0.45)",
                      marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
                      maxWidth: 340,
                    }}
                  >
                    Whether you stay for 30 minutes or 4 hours, whether you
                    order once or six times — you're welcome here. That's not a
                    slogan. That's the whole point.
                  </p>
                  <div
                    style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
                  >
                    <Link
                      href="/community"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        background: "#e8d5a3",
                        color: "#0f1a0f",
                        fontFamily: YK,
                        fontWeight: 700,
                        fontSize: "clamp(0.75rem, 1.1vw, 0.9rem)",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        textDecoration: "none",
                        padding:
                          "clamp(0.7rem, 1.2vw, 1rem) clamp(1.2rem, 2vw, 1.8rem)",
                        transition: "background 0.25s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#d4a843")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "#e8d5a3")
                      }
                    >
                      JOIN THE COMMUNITY
                      <svg
                        width="12"
                        height="12"
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
                    <Link
                      href="/book"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        border: "1px solid rgba(232,213,163,0.25)",
                        color: "rgba(232,213,163,0.7)",
                        fontFamily: YK,
                        fontWeight: 700,
                        fontSize: "clamp(0.75rem, 1.1vw, 0.9rem)",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        textDecoration: "none",
                        padding:
                          "clamp(0.7rem, 1.2vw, 1rem) clamp(1.2rem, 2vw, 1.8rem)",
                        transition: "border-color 0.25s, color 0.25s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(232,213,163,0.6)";
                        e.currentTarget.style.color = "#e8d5a3";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(232,213,163,0.25)";
                        e.currentTarget.style.color = "rgba(232,213,163,0.7)";
                      }}
                    >
                      BOOK A TABLE
                    </Link>
                  </div>
                </div>
              </FadeBlock>
            </div>
          </div>
        </section>

        {/* ── ACHIEVEMENTS + SOCIALS ── */}
        <section
          style={{
            background: "#0d160d",
            borderTop: "1px solid rgba(232,213,163,0.06)",
            paddingTop: "clamp(4rem, 8vw, 6rem)",
            paddingBottom: "clamp(4rem, 8vw, 6rem)",
          }}
        >
          <div
            style={{
              maxWidth: MAX_WIDTH,
              margin: "0 auto",
              paddingLeft: SITE_PADDING,
              paddingRight: SITE_PADDING,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
                gap: "clamp(3rem, 6vw, 6rem)",
                alignItems: "start",
              }}
            >
              {/* Achievements */}
              <FadeBlock>
                <p
                  style={{
                    fontFamily: DM,
                    fontSize: "clamp(0.55rem, 0.75vw, 0.65rem)",
                    letterSpacing: "0.45em",
                    color: "rgba(212,168,67,0.6)",
                    textTransform: "uppercase",
                    marginBottom: "clamp(2rem, 3vw, 2.5rem)",
                  }}
                >
                  Milestones
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: "0" }}
                >
                  {[
                    { year: "2022", label: "Opened our doors in Marikina" },
                    { year: "2023", label: "First 100 community members" },
                    { year: "2023", label: "Best New Café — Local Picks PH" },
                    { year: "2024", label: "50th community event hosted" },
                    { year: "2025", label: "Featured in Nolisoli & Pepper.ph" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "clamp(1rem, 2vw, 1.5rem)",
                        padding: "clamp(0.9rem, 1.5vw, 1.1rem) 0",
                        borderBottom: "1px solid rgba(232,213,163,0.05)",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: YK,
                          fontWeight: 700,
                          fontSize: "clamp(0.7rem, 1vw, 0.85rem)",
                          color: "rgba(212,168,67,0.5)",
                          letterSpacing: "0.15em",
                          flexShrink: 0,
                          minWidth: "3.2rem",
                        }}
                      >
                        {item.year}
                      </span>
                      <span
                        style={{
                          fontFamily: DM,
                          fontSize: "clamp(0.8rem, 1.05vw, 0.9rem)",
                          color: "rgba(232,213,163,0.5)",
                          lineHeight: 1.4,
                        }}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </FadeBlock>

              {/* Socials */}
              <FadeBlock delay={150}>
                <p
                  style={{
                    fontFamily: DM,
                    fontSize: "clamp(0.55rem, 0.75vw, 0.65rem)",
                    letterSpacing: "0.45em",
                    color: "rgba(212,168,67,0.6)",
                    textTransform: "uppercase",
                    marginBottom: "clamp(2rem, 3vw, 2.5rem)",
                  }}
                >
                  Find Us
                </p>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "clamp(0.8rem, 1.5vw, 1rem)",
                  }}
                >
                  {[
                    {
                      platform: "Instagram",
                      handle: "@3rdspace2025",
                      href: "https://www.instagram.com/3rdspace2025",
                      icon: (
                        <svg
                          width="18"
                          height="18"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                        >
                          <rect x="2" y="2" width="20" height="20" rx="5" />
                          <circle cx="12" cy="12" r="4" />
                          <circle
                            cx="17.5"
                            cy="6.5"
                            r="1"
                            fill="currentColor"
                            stroke="none"
                          />
                        </svg>
                      ),
                    },
                    {
                      platform: "Facebook",
                      handle: "3rd Space Café",
                      href: "https://www.facebook.com/profile.php?id=61582128047471",
                      icon: (
                        <svg
                          width="18"
                          height="18"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ),
                    },
                    {
                      platform: "TikTok",
                      handle: "@3rdspacecafe",
                      href: "https://www.tiktok.com/@3rdspacecafe",
                      icon: (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                        </svg>
                      ),
                    },
                  ].map((s) => (
                    <a
                      key={s.platform}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "clamp(1rem, 1.5vw, 1.2rem)",
                        padding:
                          "clamp(0.9rem, 1.5vw, 1.1rem) clamp(1rem, 1.5vw, 1.2rem)",
                        border: "1px solid rgba(232,213,163,0.08)",
                        textDecoration: "none",
                        color: "rgba(232,213,163,0.5)",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <span style={{ flexShrink: 0, opacity: 0.6 }}>
                        {s.icon}
                      </span>
                      <div>
                        <div
                          style={{
                            fontFamily: YK,
                            fontWeight: 700,
                            fontSize: "clamp(1rem, 1.4vw, 1.2rem)",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            color: "rgba(232,213,163,0.7)",
                            lineHeight: 1,
                            marginBottom: "0.2rem",
                          }}
                        >
                          {s.platform}
                        </div>
                        <div
                          style={{
                            fontFamily: DM,
                            fontSize: "clamp(0.65rem, 0.9vw, 0.75rem)",
                            letterSpacing: "0.1em",
                            color: "rgba(232,213,163,0.3)",
                          }}
                        >
                          {s.handle}
                        </div>
                      </div>
                      <svg
                        width="12"
                        height="12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{
                          marginLeft: "auto",
                          opacity: 0.3,
                          flexShrink: 0,
                        }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 17L17 7M7 7h10v10"
                        />
                      </svg>
                    </a>
                  ))}
                </div>

                {/* Little note below */}
                <p
                  style={{
                    fontFamily: DM,
                    fontSize: "clamp(0.65rem, 0.85vw, 0.72rem)",
                    color: "rgba(232,213,163,0.2)",
                    marginTop: "clamp(1.5rem, 2vw, 2rem)",
                    lineHeight: 1.6,
                    letterSpacing: "0.03em",
                  }}
                >
                  Tag us in your visits. We love seeing you here almost as much
                  as you love being here.
                </p>
              </FadeBlock>
            </div>
          </div>
        </section>

        {/* ── BOTTOM NAV ── */}
        <section
          style={{
            borderTop: "1px solid rgba(232,213,163,0.06)",
            paddingTop: "clamp(3rem, 5vw, 4rem)",
            paddingBottom: "clamp(3rem, 5vw, 4rem)",
          }}
        >
          <div
            style={{
              maxWidth: MAX_WIDTH,
              margin: "0 auto",
              paddingLeft: SITE_PADDING,
              paddingRight: SITE_PADDING,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1.5rem",
            }}
          >
            <span
              style={{
                fontFamily: DM,
                fontSize: "clamp(0.6rem, 0.85vw, 0.72rem)",
                letterSpacing: "0.3em",
                color: "rgba(232,213,163,0.25)",
                textTransform: "uppercase",
              }}
            >
              3rd Space · Est. 2022
            </span>
            <div
              style={{
                display: "flex",
                gap: "clamp(1.5rem, 3vw, 2.5rem)",
                flexWrap: "wrap",
              }}
            >
              {[
                { label: "Menu", href: "/menu" },
                { label: "Events", href: "/events" },
                { label: "Gallery", href: "/gallery" },
                { label: "Community", href: "/community" },
              ].map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  style={{
                    fontFamily: DM,
                    fontSize: "clamp(0.6rem, 0.85vw, 0.72rem)",
                    letterSpacing: "0.25em",
                    color: "rgba(232,213,163,0.35)",
                    textDecoration: "none",
                    textTransform: "uppercase",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#e8d5a3")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(232,213,163,0.35)")
                  }
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
