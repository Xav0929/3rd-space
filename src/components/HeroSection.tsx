"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const SITE_PADDING = "clamp(1.5rem, 5vw, 4rem)";
const MAX_WIDTH = 1280;

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [soundPromptVisible, setSoundPromptVisible] = useState(false);
  const [soundPromptDismissed, setSoundPromptDismissed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const YK = "var(--font-yanone), 'Yanone Kaffeesatz', sans-serif";
  const DM = "var(--font-dm), 'DM Sans', sans-serif";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = async () => {
      try {
        video.muted = false;
        await video.play();
        setMuted(false);
        setLoaded(true);
        setSoundPromptVisible(true);
      } catch {
        video.muted = true;
        setMuted(true);
        try {
          await video.play();
          setLoaded(true);
          setSoundPromptVisible(true);
        } catch {
          setLoaded(true);
        }
      }
    };

    tryPlay();

    const timer = setTimeout(() => {
      setSoundPromptVisible(false);
      setSoundPromptDismissed(true);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  const handleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = true;
    setMuted(true);
    setSoundPromptVisible(false);
    setSoundPromptDismissed(true);
  };

  const handleKeepSound = () => {
    setSoundPromptVisible(false);
    setSoundPromptDismissed(true);
  };

  const handleEnableSound = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = false;
    setMuted(false);
    setSoundPromptVisible(false);
    setSoundPromptDismissed(true);
  };

  const handleStayMuted = () => {
    setSoundPromptVisible(false);
    setSoundPromptDismissed(true);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  return (
    <>
      <style>{`
        .hero-bottom-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding-bottom: clamp(1.5rem, 3vw, 2.5rem);
        }
        @media (max-width: 640px) {
          .hero-bottom-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.25rem;
            padding-bottom: 5rem;
          }
          .hero-voucher {
            align-self: flex-start;
          }
        }
      `}</style>
      <section
        style={{
          position: "relative",
          width: "100%",
          height: "100svh",
          minHeight: 600,
          overflow: "hidden",
        }}
      >
        {/* Video */}
        <video
          ref={videoRef}
          src="/videos/hero.mp4"
          loop
          playsInline
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: loaded ? 1 : 0,
            transition: "opacity 1s ease",
            zIndex: 0,
          }}
        />

        {/* Overlays */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.48)",
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 45%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#152015",
            zIndex: -1,
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: MAX_WIDTH,
              paddingLeft: SITE_PADDING,
              paddingRight: SITE_PADDING,
              boxSizing: "border-box",
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* TOP ROW — sound prompt */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              {soundPromptVisible && (
                <div
                  style={{
                    marginTop: "clamp(60px, 7vw, 80px)",
                    width: 210,
                    background: "rgba(12,22,12,0.94)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(232,213,163,0.2)",
                    padding: "1rem 1.1rem",
                  }}
                >
                  {muted ? (
                    <>
                      <p
                        style={{
                          fontFamily: YK,
                          fontWeight: 700,
                          fontSize: 14,
                          letterSpacing: "0.08em",
                          color: "#e8d5a3",
                          margin: "0 0 4px",
                        }}
                      >
                        🔇 SOUND IS OFF
                      </p>
                      <p
                        style={{
                          fontFamily: DM,
                          fontSize: 11,
                          color: "rgba(232,213,163,0.5)",
                          lineHeight: 1.5,
                          margin: "0 0 12px",
                        }}
                      >
                        Want to hear the ambiance?
                      </p>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={handleEnableSound}
                          style={{
                            flex: 1,
                            fontFamily: YK,
                            fontWeight: 700,
                            fontSize: 12,
                            letterSpacing: "0.15em",
                            padding: "7px 0",
                            background: "#e8d5a3",
                            color: "#0f1a0f",
                            border: "none",
                            cursor: "pointer",
                            textTransform: "uppercase",
                          }}
                        >
                          TURN ON
                        </button>
                        <button
                          onClick={handleStayMuted}
                          style={{
                            flex: 1,
                            fontFamily: YK,
                            fontWeight: 700,
                            fontSize: 12,
                            letterSpacing: "0.15em",
                            padding: "7px 0",
                            background: "transparent",
                            color: "rgba(232,213,163,0.6)",
                            border: "1px solid rgba(232,213,163,0.25)",
                            cursor: "pointer",
                            textTransform: "uppercase",
                          }}
                        >
                          NO THANKS
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p
                        style={{
                          fontFamily: YK,
                          fontWeight: 700,
                          fontSize: 14,
                          letterSpacing: "0.08em",
                          color: "#e8d5a3",
                          margin: "0 0 4px",
                        }}
                      >
                        🔊 SOUND IS ON
                      </p>
                      <p
                        style={{
                          fontFamily: DM,
                          fontSize: 11,
                          color: "rgba(232,213,163,0.5)",
                          lineHeight: 1.5,
                          margin: "0 0 12px",
                        }}
                      >
                        Ambient audio is playing.
                        <br />
                        Keep it on?
                      </p>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={handleKeepSound}
                          style={{
                            flex: 1,
                            fontFamily: YK,
                            fontWeight: 700,
                            fontSize: 12,
                            letterSpacing: "0.15em",
                            padding: "7px 0",
                            background: "#e8d5a3",
                            color: "#0f1a0f",
                            border: "none",
                            cursor: "pointer",
                            textTransform: "uppercase",
                          }}
                        >
                          KEEP
                        </button>
                        <button
                          onClick={handleMute}
                          style={{
                            flex: 1,
                            fontFamily: YK,
                            fontWeight: 700,
                            fontSize: 12,
                            letterSpacing: "0.15em",
                            padding: "7px 0",
                            background: "transparent",
                            color: "rgba(232,213,163,0.6)",
                            border: "1px solid rgba(232,213,163,0.25)",
                            cursor: "pointer",
                            textTransform: "uppercase",
                          }}
                        >
                          MUTE
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* MIDDLE — headline */}
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    fontFamily: DM,
                    fontWeight: 400,
                    fontSize: "clamp(0.5rem, 0.85vw, 0.72rem)",
                    letterSpacing: "0.38em",
                    color: "rgba(232,213,163,0.45)",
                    textTransform: "uppercase",
                    marginBottom: "0.8rem",
                    opacity: loaded ? 1 : 0,
                    transition: "opacity 0.6s ease 0.2s",
                  }}
                >
                  Relax · Create · Breathe
                </p>
                <h1
                  style={{
                    fontFamily: YK,
                    fontWeight: 700,
                    fontSize: "clamp(2.8rem, 5.5vw, 5.8rem)",
                    lineHeight: 0.88,
                    letterSpacing: "0.01em",
                    color: "#e8d5a3",
                    textTransform: "uppercase",
                    textShadow: "0 2px 40px rgba(0,0,0,0.5)",
                    opacity: loaded ? 1 : 0,
                    transition: "opacity 0.8s ease 0.35s",
                    margin: 0,
                    textAlign: "right",
                  }}
                >
                  Your
                  <br />
                  Cozy
                  <br />
                  Corner
                  <br />
                  <em style={{ color: "#d4a843", fontStyle: "italic" }}>
                    Away
                  </em>
                  <br />
                  From Home
                </h1>
              </div>
            </div>

            {/* BOTTOM ROW */}
            <div className="hero-bottom-row">
              {/* Business Hours */}
              <div
                style={{
                  opacity: loaded ? 1 : 0,
                  transition: "opacity 0.8s ease 0.9s",
                }}
              >
                <p
                  style={{
                    fontFamily: YK,
                    fontWeight: 700,
                    fontSize: "clamp(0.85rem, 1.5vw, 1.3rem)",
                    color: "#e8d5a3",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    lineHeight: 1.3,
                    textShadow: "0 2px 20px rgba(0,0,0,0.9)",
                    margin: 0,
                  }}
                >
                  Business Open
                  <br />
                  <span style={{ color: "#d4a843" }}>
                    Daily from 9am – 12am
                  </span>
                </p>
              </div>

              {/* Voucher CTA */}
              <div
                className="hero-voucher"
                style={{
                  opacity: loaded ? 1 : 0,
                  transition: "opacity 0.8s ease 1.1s",
                }}
              >
                <Link
                  href="/vouchers"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    background: "rgba(10,20,10,0.82)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(232,213,163,0.2)",
                    padding: "0.65rem 0.9rem",
                    textDecoration: "none",
                    transition: "border-color 0.3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(212,168,67,0.7)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor =
                      "rgba(232,213,163,0.2)")
                  }
                >
                  <div
                    style={{
                      position: "relative",
                      width: 36,
                      height: 24,
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(135deg, #6b9bd2, #3a6ea8)",
                        borderRadius: 3,
                        transform: "rotate(-7deg)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(135deg, #d4a843, #9a7020)",
                        borderRadius: 3,
                        transform: "rotate(5deg)",
                      }}
                    />
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: DM,
                        fontSize: 9,
                        letterSpacing: "0.2em",
                        color: "rgba(232,213,163,0.55)",
                        textTransform: "uppercase",
                        margin: 0,
                      }}
                    >
                      Collect Right Here!
                    </p>
                    <p
                      style={{
                        fontFamily: YK,
                        fontWeight: 700,
                        fontSize: 13,
                        letterSpacing: "0.1em",
                        color: "#e8d5a3",
                        textTransform: "uppercase",
                        margin: 0,
                        lineHeight: 1.1,
                      }}
                    >
                      3RD SPACE VOUCHERS
                    </p>
                  </div>
                  <div
                    style={{
                      background: "#e8d5a3",
                      color: "#0f1a0f",
                      fontFamily: DM,
                      fontWeight: 800,
                      fontSize: 9,
                      letterSpacing: "0.18em",
                      padding: "6px 10px",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#d4a843")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#e8d5a3")
                    }
                  >
                    GET HERE
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* MUTE TOGGLE */}
        {soundPromptDismissed && (
          <button
            onClick={toggleMute}
            style={{
              position: "absolute",
              bottom: "clamp(1.5rem, 3vw, 2.5rem)",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 20,
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(232,213,163,0.3)",
              fontFamily: DM,
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#e8d5a3")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(232,213,163,0.3)")
            }
          >
            {muted ? (
              <svg
                width="14"
                height="14"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 101.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12A4.5 4.5 0 0014 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24z" />
              </svg>
            ) : (
              <svg
                width="14"
                height="14"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            )}
            {muted ? "UNMUTE" : "MUTE"}
          </button>
        )}
      </section>
    </>
  );
}
