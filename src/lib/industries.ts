export type IndustrySlug =
  | "real-estate"
  | "hotels"
  | "resorts"
  | "restaurants"
  | "gyms";

export type Ratio = "16x9" | "4x5" | "3x2" | "1x1" | "9x16" | "5x1";

export type BentoDir = "left" | "right" | "top" | "bottom";

export type BentoTile = {
  src: string;
  ratio: Ratio;
  span: string;
  from: BentoDir;
  tag: string;
  caption?: string;
};

export type Industry = {
  slug: IndustrySlug;
  label: string;
  name: string;
  tagline: string;
  blurb: string;
  hook: string;
  cover: string;
  coverRatio: Ratio;
  accent: "gold" | "navy" | "cream";
  stat: { value: string; label: string };
  deliverables: { title: string; desc: string }[];
  shoots: string[];
  bento: BentoTile[];
};

const G = (slug: IndustrySlug, n: number | "cover") =>
  `/gen/ind-${slug}-${n === "cover" ? "cover" : `b${n}`}.webp`;

export const industries: Industry[] = [
  {
    slug: "real-estate",
    label: "Real Estate",
    name: "Real Estate",
    tagline: "Buyers say yes before the site visit.",
    blurb:
      "Cinematic property films, magazine-grade stills, and scrollable 3D tours that make flats sell faster.",
    hook: "Premium flats deserve premium media.",
    cover: G("real-estate", "cover"),
    coverRatio: "16x9",
    accent: "gold",
    stat: { value: "32 flats / 18 days", label: "Skyline Residences launch" },
    deliverables: [
      { title: "Launch Film", desc: "60–90s cut for Meta, YouTube, hoardings." },
      { title: "Architecture Stills", desc: "Print + listings + brochures, one set." },
      { title: "3D Scrollytelling Tour", desc: "Buyers walk the flat by scrolling." },
      { title: "Builder Website", desc: "Conversion-tuned, lead form, WhatsApp." },
    ],
    shoots: ["Exteriors", "Drone aerials", "Interior walkthroughs", "Amenity stills", "Twilight pulls"],
    bento: [
      { src: G("real-estate", 1), ratio: "16x9", span: "md:col-span-8 md:row-span-2", from: "right", tag: "Tower Reveal", caption: "Verde · Mansarovar" },
      { src: G("real-estate", 2), ratio: "4x5", span: "md:col-span-4 md:row-span-2", from: "top", tag: "Living Room", caption: "Soft north light" },
      { src: G("real-estate", 3), ratio: "1x1", span: "md:col-span-4", from: "left", tag: "Lobby Detail" },
      { src: G("real-estate", 4), ratio: "3x2", span: "md:col-span-4", from: "bottom", tag: "Master Bath" },
      { src: G("real-estate", 5), ratio: "9x16", span: "md:col-span-4 md:row-span-2", from: "right", tag: "Tour Strip", caption: "Scrollytelling" },
      { src: G("real-estate", 6), ratio: "16x9", span: "md:col-span-8", from: "left", tag: "Skyline Drone" },
    ],
  },
  {
    slug: "hotels",
    label: "Hotels",
    name: "Hotels",
    tagline: "Direct bookings, not commissions.",
    blurb:
      "Editorial photography, brand films, and websites that pull guests off OTAs and onto your domain.",
    hook: "Every frame books a suite.",
    cover: G("hotels", "cover"),
    coverRatio: "16x9",
    accent: "navy",
    stat: { value: "+120% direct bookings", label: "The Aurum Hotel" },
    deliverables: [
      { title: "Hotel Brand Film", desc: "60s flagship reel + cutdowns for socials." },
      { title: "Editorial Stills", desc: "Suites, lobby, F&B, spa — all formats." },
      { title: "Booking Website", desc: "Direct-bookings flow, IBE-ready." },
      { title: "Reel Pack", desc: "Vertical edits for Instagram + TikTok." },
    ],
    shoots: ["Lobby moods", "Suite hero shots", "F&B detail", "Spa + wellness", "Pool twilight"],
    bento: [
      { src: G("hotels", 1), ratio: "4x5", span: "md:col-span-4 md:row-span-2", from: "top", tag: "Suite 412", caption: "Window light" },
      { src: G("hotels", 2), ratio: "16x9", span: "md:col-span-8", from: "right", tag: "Lobby Wide" },
      { src: G("hotels", 3), ratio: "3x2", span: "md:col-span-4", from: "bottom", tag: "Bar Detail" },
      { src: G("hotels", 4), ratio: "3x2", span: "md:col-span-4", from: "left", tag: "Pool Twilight" },
      { src: G("hotels", 5), ratio: "5x1", span: "md:col-span-12", from: "right", tag: "Façade Pano" },
      { src: G("hotels", 6), ratio: "1x1", span: "md:col-span-4", from: "top", tag: "F&B Plate" },
      { src: G("hotels", 7), ratio: "9x16", span: "md:col-span-4 md:row-span-2", from: "right", tag: "Reel" },
      { src: G("hotels", 8), ratio: "4x5", span: "md:col-span-4", from: "bottom", tag: "Spa" },
      { src: G("hotels", 9), ratio: "4x5", span: "md:col-span-4", from: "left", tag: "Concierge" },
    ],
  },
  {
    slug: "resorts",
    label: "Resorts",
    name: "Resorts",
    tagline: "Sell the escape, not the room.",
    blurb:
      "Aerial reveals, golden-hour stills, and emotion-led films that turn browsers into bookings.",
    hook: "Make them feel the breeze.",
    cover: G("resorts", "cover"),
    coverRatio: "16x9",
    accent: "gold",
    stat: { value: "2× occupancy in season", label: "Solace Spa Resort" },
    deliverables: [
      { title: "Destination Film", desc: "Aerial-led, story-cut, 90s and 30s." },
      { title: "Lifestyle Stills", desc: "Couples, families, in-frame guests." },
      { title: "Aerial Pack", desc: "Drone reveals, top-downs, sunrise pulls." },
      { title: "Reel Library", desc: "12 verticals per season, ready to post." },
    ],
    shoots: ["Aerial reveals", "Villa interiors", "Pool + beach", "Dining moods", "Activity stills"],
    bento: [
      { src: G("resorts", 1), ratio: "16x9", span: "md:col-span-12", from: "right", tag: "Coastline Aerial" },
      { src: G("resorts", 2), ratio: "4x5", span: "md:col-span-3", from: "top", tag: "Villa 7" },
      { src: G("resorts", 3), ratio: "4x5", span: "md:col-span-3", from: "bottom", tag: "Cabana" },
      { src: G("resorts", 4), ratio: "3x2", span: "md:col-span-6", from: "left", tag: "Sunset Dinner" },
      { src: G("resorts", 5), ratio: "9x16", span: "md:col-span-4 md:row-span-2", from: "right", tag: "Trail Reel" },
      { src: G("resorts", 6), ratio: "3x2", span: "md:col-span-8", from: "top", tag: "Pool Top-Down" },
      { src: G("resorts", 7), ratio: "1x1", span: "md:col-span-4", from: "bottom", tag: "Hammock" },
      { src: G("resorts", 8), ratio: "1x1", span: "md:col-span-4", from: "left", tag: "Spa Stones" },
    ],
  },
  {
    slug: "restaurants",
    label: "Restaurants",
    name: "Restaurants",
    tagline: "Stop the scroll. Fill the table.",
    blurb:
      "Plate-perfect food stills, room-mood films, and reels engineered for reservation clicks.",
    hook: "Light. Steam. Crunch. Yes.",
    cover: G("restaurants", "cover"),
    coverRatio: "4x5",
    accent: "navy",
    stat: { value: "3× reservations post-launch", label: "Bistro Maharaj" },
    deliverables: [
      { title: "Menu Photography", desc: "Every dish — overhead, hero, hand-in." },
      { title: "Mood Film", desc: "30–60s room reel, chef close-ups, plating cuts." },
      { title: "Reel Pack", desc: "20 verticals — dishes, prep, room, guests." },
      { title: "Reservation Site", desc: "Menu, gallery, booking flow." },
    ],
    shoots: ["Overhead plate", "Chef hands", "Room mood", "Cocktail pour", "Guest table"],
    bento: [
      { src: G("restaurants", 1), ratio: "1x1", span: "md:col-span-3", from: "top", tag: "Plate 01" },
      { src: G("restaurants", 2), ratio: "1x1", span: "md:col-span-3", from: "bottom", tag: "Plate 02" },
      { src: G("restaurants", 3), ratio: "4x5", span: "md:col-span-3 md:row-span-2", from: "right", tag: "Chef" },
      { src: G("restaurants", 4), ratio: "4x5", span: "md:col-span-3 md:row-span-2", from: "left", tag: "Cocktail" },
      { src: G("restaurants", 5), ratio: "1x1", span: "md:col-span-3", from: "left", tag: "Plate 03" },
      { src: G("restaurants", 6), ratio: "1x1", span: "md:col-span-3", from: "right", tag: "Plate 04" },
      { src: G("restaurants", 7), ratio: "16x9", span: "md:col-span-9", from: "bottom", tag: "Room Mood" },
      { src: G("restaurants", 8), ratio: "9x16", span: "md:col-span-3 md:row-span-2", from: "right", tag: "Reel" },
      { src: G("restaurants", 9), ratio: "3x2", span: "md:col-span-9", from: "top", tag: "Pass" },
    ],
  },
  {
    slug: "gyms",
    label: "Gyms & Fitness",
    name: "Gyms & Fitness",
    tagline: "Energy on screen. Members through the door.",
    blurb:
      "High-contrast films, athlete portraits, and lead-funnel sites that convert sign-ups all year.",
    hook: "Make them feel the rep.",
    cover: G("gyms", "cover"),
    coverRatio: "3x2",
    accent: "gold",
    stat: { value: "+60% memberships in Q1", label: "Iron Den Gym" },
    deliverables: [
      { title: "Hype Film", desc: "60s anthem cut, slow-mo, sweat, grit." },
      { title: "Trainer Portraits", desc: "Editorial profiles, every coach." },
      { title: "Class Reels", desc: "Vertical cuts per class — HIIT, lift, yoga." },
      { title: "Member Site", desc: "Plans, trial form, class schedule, payments." },
    ],
    shoots: ["Heavy lift", "Cardio rows", "Trainer profile", "Studio class", "Member transformation"],
    bento: [
      { src: G("gyms", 1), ratio: "4x5", span: "md:col-span-4 md:row-span-2", from: "top", tag: "Lift Floor" },
      { src: G("gyms", 2), ratio: "16x9", span: "md:col-span-8", from: "right", tag: "Studio Wide" },
      { src: G("gyms", 3), ratio: "1x1", span: "md:col-span-4", from: "bottom", tag: "Kettlebell" },
      { src: G("gyms", 4), ratio: "3x2", span: "md:col-span-4", from: "left", tag: "Rower Line" },
      { src: G("gyms", 5), ratio: "9x16", span: "md:col-span-4 md:row-span-2", from: "right", tag: "Sprint Reel" },
      { src: G("gyms", 6), ratio: "4x5", span: "md:col-span-4", from: "bottom", tag: "Trainer Mark" },
      { src: G("gyms", 7), ratio: "16x9", span: "md:col-span-8", from: "left", tag: "Anthem Frame" },
      { src: G("gyms", 8), ratio: "5x1", span: "md:col-span-12", from: "top", tag: "Floor Pano" },
    ],
  },
];

export const industryBySlug = (slug: string) =>
  industries.find((i) => i.slug === slug);
