export type ProjectCategory = "film" | "photo" | "tour" | "website";

export type ProjectIndustry =
  | "real-estate"
  | "hotels"
  | "resorts"
  | "restaurants"
  | "gyms";

export type Ratio = "16x9" | "4x5" | "3x2" | "1x1" | "9x16";

export type Project = {
  slug: string;
  name: string;
  builder: string;
  location: string;
  industry: ProjectIndustry;
  industryLabel: string;
  category: ProjectCategory;
  categoryLabel: string;
  cover: string;
  ratio: Ratio;
  stat: string;
  summary: string;
  year: string;
  leftImg: string;
  rightImg: string;
  accent: string;
  accentInk: string;
};

type ProjectInput = Omit<
  Project,
  "year" | "leftImg" | "rightImg" | "accent" | "accentInk" | "cover"
> & {
  year?: string;
  leftImg?: string;
  rightImg?: string;
};

const ACCENT_BY_INDUSTRY: Record<ProjectIndustry, { bg: string; ink: string }> = {
  "real-estate": { bg: "#1A2D4D", ink: "#F5F1EA" },
  hotels: { bg: "#0F1626", ink: "#E8A33B" },
  resorts: { bg: "#E8A33B", ink: "#0F1626" },
  restaurants: { bg: "#C75B3E", ink: "#F5F1EA" },
  gyms: { bg: "#0A0A0A", ink: "#E8A33B" },
};

const inputs: ProjectInput[] = [
  {
    slug: "the-aurum-hotel",
    name: "The Aurum Hotel",
    builder: "Hospitality Group",
    location: "C-Scheme, Jaipur",
    industry: "hotels",
    industryLabel: "Hotels",
    category: "website",
    categoryLabel: "Brand Film + Website",
    ratio: "16x9",
    stat: "+120% direct bookings",
    summary: "Editorial-led hotel brand film, suite stills, and a direct-booking site that pulled traffic off OTAs.",
  },
  {
    slug: "solace-spa-resort",
    name: "Solace Spa Resort",
    builder: "Solace Hospitality",
    location: "Udaipur, Rajasthan",
    industry: "resorts",
    industryLabel: "Resorts",
    category: "film",
    categoryLabel: "Destination Film",
    ratio: "3x2",
    stat: "2× occupancy in season",
    summary: "Aerial-led 90-second destination film, lifestyle stills, and a 12-piece reel library for the season campaign.",
  },
  {
    slug: "bistro-maharaj",
    name: "Bistro Maharaj",
    builder: "Maharaj F&B",
    location: "MI Road, Jaipur",
    industry: "restaurants",
    industryLabel: "Restaurants",
    category: "photo",
    categoryLabel: "Menu Photography",
    ratio: "4x5",
    stat: "3× reservations post-launch",
    summary: "Plate-perfect menu photography, room-mood reel pack, and a reservation-tuned site relaunch.",
  },
  {
    slug: "iron-den-gym",
    name: "Iron Den Gym",
    builder: "Iron Den Fitness",
    location: "Malviya Nagar, Jaipur",
    industry: "gyms",
    industryLabel: "Gyms & Fitness",
    category: "film",
    categoryLabel: "Hype Film",
    ratio: "16x9",
    stat: "+60% memberships in Q1",
    summary: "High-contrast hype film, trainer portraits, and a class-schedule member site.",
  },
  {
    slug: "skyline-residences",
    name: "Skyline Residences",
    builder: "Verde Builders",
    location: "Mansarovar, Jaipur",
    industry: "real-estate",
    industryLabel: "Real Estate",
    category: "film",
    categoryLabel: "Property Film",
    ratio: "16x9",
    stat: "Sold 32 flats in 18 days",
    summary: "Cinematic 90-second film cut for launch campaign across Meta + YouTube.",
  },
  {
    slug: "atrium",
    name: "The Atrium",
    builder: "Aarya Group",
    location: "Vaishali Nagar, Jaipur",
    industry: "real-estate",
    industryLabel: "Real Estate",
    category: "tour",
    categoryLabel: "3D Scrollytelling",
    ratio: "3x2",
    stat: "1.2M views on Instagram reel",
    summary: "Full 3-bedroom flat as a scroll-driven walkthrough on the builder website.",
  },
  {
    slug: "casa-bellavista",
    name: "Casa Bellavista",
    builder: "Lakshya Realty",
    location: "Tonk Road, Jaipur",
    industry: "real-estate",
    industryLabel: "Real Estate",
    category: "website",
    categoryLabel: "Builder Website",
    ratio: "16x9",
    stat: "200 leads in 2 weeks",
    summary: "End-to-end builder portfolio site. Lead form, WhatsApp, project pages, SEO.",
  },
  {
    slug: "rajwada-heights",
    name: "Rajwada Heights",
    builder: "Heritage Estates",
    location: "Civil Lines, Jaipur",
    industry: "real-estate",
    industryLabel: "Real Estate",
    category: "photo",
    categoryLabel: "Photography",
    ratio: "4x5",
    stat: "Featured in 3 print magazines",
    summary: "Editorial stills shoot. Hoardings, brochure, social, listings — one set covered all.",
  },
  {
    slug: "lake-view-villas",
    name: "Lake View Villas",
    builder: "Sunrise Developers",
    location: "Mahindra Road, Jaipur",
    industry: "real-estate",
    industryLabel: "Real Estate",
    category: "film",
    categoryLabel: "Property Film",
    ratio: "1x1",
    stat: "Booking inquiries up 4×",
    summary: "Drone-led property film with aerial reveals over the lake-facing villa cluster.",
  },
  {
    slug: "the-pinnacle",
    name: "The Pinnacle",
    builder: "Apex Realty",
    location: "Sirsi Road, Jaipur",
    industry: "real-estate",
    industryLabel: "Real Estate",
    category: "tour",
    categoryLabel: "3D Scrollytelling",
    ratio: "9x16",
    stat: "82% buyers visited site after tour",
    summary: "Mobile-first vertical scrollytelling tour for the penthouse suite.",
  },
];

export const projects: Project[] = inputs.map((p) => {
  const ac = ACCENT_BY_INDUSTRY[p.industry];
  const cover = `/gen/proj-${p.slug}-cover.webp`;
  const alt = `/gen/proj-${p.slug}-alt.webp`;
  return {
    ...p,
    cover,
    year: p.year ?? "2025",
    leftImg: p.leftImg ?? cover,
    rightImg: p.rightImg ?? alt,
    accent: ac.bg,
    accentInk: ac.ink,
  };
});

export const categoryFilters: { value: ProjectCategory | "all"; label: string }[] = [
  { value: "all", label: "All Work" },
  { value: "film", label: "Films" },
  { value: "photo", label: "Photography" },
  { value: "tour", label: "3D Tours" },
  { value: "website", label: "Websites" },
];

export const industryFilters: { value: ProjectIndustry | "all"; label: string }[] = [
  { value: "all", label: "All Industries" },
  { value: "real-estate", label: "Real Estate" },
  { value: "hotels", label: "Hotels" },
  { value: "resorts", label: "Resorts" },
  { value: "restaurants", label: "Restaurants" },
  { value: "gyms", label: "Gyms" },
];
