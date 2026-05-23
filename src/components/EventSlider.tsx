"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

const events = [
  {
    id: 1,
    tag: "COZY SPACE",
    title: "3RD SPACE LOUNGE",
    description: "Your home away from home. Chill, work, or just exist.",
    img: "/images/event-lounge.png",
    accent: "#d4a843",
    href: "/events/lounge",
  },
  {
    id: 2,
    tag: "MIND READ",
    title: "TAROT THURSDAY",
    description: "Weekly tarot sessions every Thursday. Book your reading.",
    img: "/images/event-tarot.png",
    accent: "#9b7fd4",
    href: "/events/tarot-thursday",
  },
  {
    id: 3,
    tag: "ARTS IN 3RD SPACE",
    title: "TATTOO ANNIVERSARY",
    description: "Local tattoo artists take over 3rd Space. Live art, all day.",
    img: "/images/event-tattoo.png",
    accent: "#e8d5a3",
    href: "/events/tattoo-anniversary",
  },
  {
    id: 4,
    tag: "BUSINESS SERIES",
    title: "COZY VENTURE",
    description: "Entrepreneurship talks in the most relaxed setting possible.",
    img: "/images/event-cozy-venture.png",
    accent: "#7fd49b",
    href: "/events/cozy-venture",
  },
  {
    id: 5,
    tag: "FOOD & DRINKS",
    title: "CAFÉ BITES",
    description:
      "Handcrafted drinks and bites made for your third space moment.",
    img: "/images/event-food.png",
    accent: "#d47f7f",
    href: "/events/food",
  },
];

const SITE_PADDING = "clamp(1.5rem, 5vw, 4rem)";
const MAX_WIDTH = 1280;

export default function EventSlider() {
  // No Autoplay plugin — manual only
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: true,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi],
  );

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const YK = "var(--font-yanone), 'Yanone Kaffeesatz', sans-serif";
  const DM = "var(--font-dm), 'DM Sans', sans-serif";

  return (
    <section
      style={{
        width: "100%",
        background: "#0f1a0f",
        paddingTop: 0,
        overflow: "hidden",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: "100%",
            maxWidth: MAX_WIDTH,
            paddingLeft: SITE_PADDING,
            paddingRight: SITE_PADDING,
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "clamp(3rem, 6vw, 5rem)",
            paddingBottom: "clamp(1.5rem, 3vw, 2rem)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                display: "block",
                width: 32,
                height: 1,
                background: "rgba(232,213,163,0.3)",
              }}
            />
            <span
              style={{
                fontFamily: DM,
                fontSize: "0.68rem",
                letterSpacing: "0.3em",
                color: "rgba(232,213,163,0.5)",
                textTransform: "uppercase",
              }}
            >
              Events &amp; Happenings
            </span>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div ref={emblaRef} style={{ overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            gap: 12,
            paddingLeft: `max(calc((100vw - ${MAX_WIDTH}px) / 2 + clamp(1.5rem, 5vw, 4rem)), clamp(1.5rem, 5vw, 4rem))`,
            paddingRight: "clamp(1.5rem, 5vw, 4rem)",
          }}
        >
          {events.map((event) => (
            <Link
              key={event.id}
              href={event.href}
              style={{
                position: "relative",
                flexShrink: 0,
                width: "clamp(220px, 22vw, 300px)",
                aspectRatio: "3/4",
                overflow: "hidden",
                display: "block",
                textDecoration: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector(
                  ".event-img",
                ) as HTMLElement;
                if (img) img.style.transform = "scale(1.06)";
                const desc = e.currentTarget.querySelector(
                  ".event-desc",
                ) as HTMLElement;
                if (desc) {
                  desc.style.opacity = "1";
                  desc.style.transform = "translateY(0)";
                }
                const bar = e.currentTarget.querySelector(
                  ".event-bar",
                ) as HTMLElement;
                if (bar) bar.style.width = "100%";
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector(
                  ".event-img",
                ) as HTMLElement;
                if (img) img.style.transform = "scale(1)";
                const desc = e.currentTarget.querySelector(
                  ".event-desc",
                ) as HTMLElement;
                if (desc) {
                  desc.style.opacity = "0";
                  desc.style.transform = "translateY(8px)";
                }
                const bar = e.currentTarget.querySelector(
                  ".event-bar",
                ) as HTMLElement;
                if (bar) bar.style.width = "0%";
              }}
            >
              <div
                className="event-img"
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  backgroundImage: `url(${event.img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundColor: "#1c2b1c",
                  transition: "transform 0.7s ease",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  background:
                    "linear-gradient(to top, rgba(10,18,10,0.95) 0%, rgba(10,18,10,0.35) 50%, transparent 100%)",
                }}
              />
              <div
                style={{ position: "absolute", top: 16, left: 16, zIndex: 10 }}
              >
                <span
                  style={{
                    fontFamily: DM,
                    fontSize: 10,
                    letterSpacing: "0.25em",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: event.accent,
                  }}
                >
                  {event.tag}
                </span>
                <div
                  style={{
                    height: 1,
                    marginTop: 4,
                    width: 32,
                    backgroundColor: event.accent,
                    opacity: 0.5,
                  }}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "1.2rem 1rem 1.4rem",
                  zIndex: 10,
                }}
              >
                <h3
                  style={{
                    fontFamily: YK,
                    fontWeight: 700,
                    color: "#e8d5a3",
                    fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)",
                    lineHeight: 1.0,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    margin: "0 0 8px",
                  }}
                >
                  {event.title}
                </h3>
                <p
                  className="event-desc"
                  style={{
                    fontFamily: DM,
                    fontSize: "0.72rem",
                    color: "rgba(232,213,163,0.6)",
                    lineHeight: 1.5,
                    margin: 0,
                    opacity: 0,
                    transform: "translateY(8px)",
                    transition: "opacity 0.3s ease, transform 0.3s ease",
                  }}
                >
                  {event.description}
                </p>
              </div>
              <div
                className="event-bar"
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "0%",
                  height: 2,
                  backgroundColor: event.accent,
                  transition: "width 0.5s ease",
                }}
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          paddingTop: "clamp(1.2rem, 2vw, 1.8rem)",
          paddingBottom: "clamp(2.5rem, 5vw, 4rem)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={scrollPrev}
            style={{
              width: 36,
              height: 36,
              border: "1px solid rgba(232,213,163,0.2)",
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "rgba(232,213,163,0.5)",
              flexShrink: 0,
              transition: "color 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#e8d5a3";
              e.currentTarget.style.borderColor = "rgba(232,213,163,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(232,213,163,0.5)";
              e.currentTarget.style.borderColor = "rgba(232,213,163,0.2)";
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
                strokeWidth={1.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                style={{
                  width: i === selectedIndex ? 24 : 6,
                  height: 6,
                  borderRadius: 3,
                  background:
                    i === selectedIndex ? "#d4a843" : "rgba(232,213,163,0.2)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "width 0.3s ease, background 0.3s ease",
                }}
              />
            ))}
          </div>

          <button
            onClick={scrollNext}
            style={{
              width: 36,
              height: 36,
              border: "1px solid rgba(232,213,163,0.2)",
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "rgba(232,213,163,0.5)",
              flexShrink: 0,
              transition: "color 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#e8d5a3";
              e.currentTarget.style.borderColor = "rgba(232,213,163,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(232,213,163,0.5)";
              e.currentTarget.style.borderColor = "rgba(232,213,163,0.2)";
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
                strokeWidth={1.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <p
          style={{
            fontFamily: DM,
            fontSize: "0.6rem",
            letterSpacing: "0.28em",
            color: "rgba(232,213,163,0.2)",
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          DRAG TO EXPLORE ——
        </p>
      </div>
    </section>
  );
}
