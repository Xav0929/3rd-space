export type Event = {
  id: string;
  day: string;
  fullDay: string;
  name: string;
  label: string;
  time: string;
  desc: string;
  longDesc: string;
  image: string;
  venue: string;
  host?: string;
  note?: string;
  whatToExpect: string[];
  gallery?: string[];
};

export const EVENTS: Event[] = [
  {
    id: "tarot-thursday",
    day: "THU",
    fullDay: "Thursday",
    name: "TAROT",
    label: "TAROT THURSDAY",
    time: "6:00 PM onwards",
    desc: "Pull a card. Sip something warm. Let the night tell you what you already know.",
    longDesc:
      "Every Thursday night, 3rd Space becomes a quieter version of itself. A resident reader sets up in the corner, cards face down. You order something warm, you sit, and maybe you ask a question you've been avoiding. No mysticism required — just curiosity and good coffee.",
    image: "/images/events/tarot-thursday.png",
    venue: "Main floor, 3rd Space",
    host: "Resident reader on rotation",
    note: "Walk-ins welcome — no booking needed",
    whatToExpect: [
      "One-on-one tarot readings at your table",
      "Curated ambient playlist for the night",
      "Full menu available all evening",
      "Free entry — just show up",
    ],
    gallery: [
      "/images/events/gallery/tarot-1.png",
      "/images/events/gallery/tarot-2.png",
      "/images/events/gallery/tarot-3.png",
      "/images/events/gallery/tarot-4.png",
      "/images/events/gallery/tarot-5.png",
    ],
  },
  {
    id: "film-friday",
    day: "FRI",
    fullDay: "Friday",
    name: "FILM",
    label: "FREE MIC & FILM FRIDAY",
    time: "6:00 PM onwards",
    desc: "Curated films. Dim lights. Great coffee. Something different every week.",
    longDesc:
      "Film Friday is not a movie theater — it's a conversation starter. We screen something short, strange, or overlooked every week. The kind of film that makes you want to talk to the person next to you afterward. Films announced every Thursday on Instagram.",
    image: "/images/events/film-friday.png",
    venue: "Screening room, 3rd Space",
    host: "Film selections by the team",
    note: "Film announced Thursdays on IG",
    whatToExpect: [
      "Weekly curated short or feature film",
      "Dimmed lighting from 8 PM",
      "Post-screening discussion (optional)",
      "Full drinks menu open throughout",
    ],
    gallery: [
      "/images/events/gallery/film-1.png",
      "/images/events/gallery/film-2.png",
      "/images/events/gallery/film-3.png",
      "/images/events/gallery/film-4.png",
      "/images/events/gallery/film-5.png",
    ],
  },
  {
    id: "sober-saturday",
    day: "SAT",
    fullDay: "Saturday",
    name: "SOBER",
    label: "SOBER SATURDAY",
    time: "6:00 PM onwards",
    desc: "No alcohol. No pressure. Just people being present — and really good coffee.",
    longDesc:
      "One Saturday a month, we go fully alcohol-free. The full venue runs on mocktails, specialty coffee, and people who actually want to be there. No explanations needed for why you're not drinking — nobody's asking.",
    image: "/images/events/sober-saturday.png",
    venue: "Full venue, 3rd Space",
    note: "All drinks mocktail-only for the night",
    whatToExpect: [
      "Full mocktail and specialty coffee menu",
      "Alcohol-free all evening, no exceptions",
      "Board games and open seating",
      "Usually our most relaxed night of the week",
    ],
    gallery: [
      "/images/events/gallery/sober-1.png",
      "/images/events/gallery/sober-2.png",
      "/images/events/gallery/sober-3.png",
      "/images/events/gallery/sober-4.png",
      "/images/events/gallery/sober-5.png",
    ],
  },
  {
    id: "sing-sunday",
    day: "SUN",
    fullDay: "Sunday",
    name: "SING",
    label: "SLOW SUNDAY",
    time: "7:00 – 11:00 PM",
    desc: "Open mic. Acoustic sets. End the week loud, off-key, and happy.",
    longDesc:
      "Slow Sunday is an open mic with no auditions, no judges, and no theme. You sign up at the door, you get a slot, you play or sing or read or whatever. The crowd is kind. The coffee is strong. You'll want to come back.",
    image: "/images/events/slow-sunday.png",
    venue: "Stage area, 3rd Space",
    host: "Open signup at the door",
    note: "Slots fill fast — come early",
    whatToExpect: [
      "Open mic signup from 6:30 PM",
      "Acoustic sets, poetry, spoken word — anything goes",
      "5-minute slots, extendable if space allows",
      "Supportive crowd, guaranteed",
    ],
    gallery: [],
  },
];

export function getEvent(id: string): Event | undefined {
  return EVENTS.find((e) => e.id === id);
}
