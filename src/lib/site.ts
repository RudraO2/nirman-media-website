// The canonical origin, and the ONLY place it is written down.
//
// This used to be copy-pasted as a local `const BASE` in 13 page files plus
// layout.tsx, robots.ts and sitemap.ts — which is how every one of them drifted
// onto `https://nirman.media`, a domain that is NOT REGISTERED and does not
// resolve. Canonical tags, the schema.org @id graph, the sitemap and robots all
// pointed there, which would have told Google the real version of every page
// lives at a dead host. The registered domain is nirmanmedia.com.
//
// Everything that needs an absolute URL imports SITE_URL or absUrl() from here.
// Never reintroduce a local BASE constant.
export const SITE_URL = "https://nirmanmedia.com";

/** Absolute URL for a site-root-relative path. `absUrl("/work")`. */
export function absUrl(path = "/"): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export const site = {
  name: "Nirman Media",
  shortName: "Nirman",
  tagline: "Films. Photos. 3D Tours. Websites.",
  city: "Jaipur",
  whatsapp: "+919999999999",
  phone: "+91 99999 99999",
  phoneRaw: "+919999999999",
  email: "hello@nirman.media",
  instagram: "https://instagram.com/nirman.media",
  address: "Studio · C-Scheme, Jaipur, Rajasthan",
  hours: "Mon–Sat · 10am to 8pm",
  whatsappLink:
    "https://wa.me/919999999999?text=Hi%20Nirman%20Media%2C%20I%27d%20like%20a%20quote%20for%20my%20project.",
};

// Founder/author identity — used for Person schema (author attribution in
// search + AI answers) and sameAs profile links. Swap placeholder URLs for
// real Medium/LinkedIn profiles once they exist.
export const founder = {
  name: "Nirvan",
  jobTitle: "Founder",
  worksFor: site.name,
  sameAs: [
    "https://medium.com/@nirman-media",
    "https://www.linkedin.com/company/nirman-media",
  ],
};

// Products built by the studio, hosted on their own subdomains. These are the
// ONLY structural link between nirmanmedia.com and the CRM — before this the
// two properties were entirely disconnected: the CRM site says "built by Nirman
// Media" in prose but linked nowhere, and this site never mentioned the CRM at
// all. Google had no way to see them as one entity, and a builder landing on
// either one could not reach the other.
export const products = [
  {
    name: "Nirman CRM",
    href: "https://crm.nirmanmedia.com",
    blurb: "Lead, follow-up and inventory software for real-estate builders.",
  },
];

export const nav = [
  { label: "Work", href: "/work" },
  { label: "Industries", href: "/industries" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Tools", href: "/tools" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export const services = [
  {
    slug: "films",
    title: "Brand Films",
    short: "60-second films that book the customer before the visit.",
    desc: "Camera, light, story. Built for people who decide in 6 seconds — buyers, guests, diners, members.",
    startsAt: "₹85,000",
    delivery: "7 days",
  },
  {
    slug: "photography",
    title: "Photography",
    short: "Magazine-grade stills of your space. Every frame intentional.",
    desc: "Composed for hoardings, brochures, listings, menus, OTAs, social. One look and they're sold.",
    startsAt: "₹45,000",
    delivery: "5 days",
  },
  {
    slug: "tours",
    title: "3D Scrolly Tours",
    short: "Your space, walkable by scrolling. Lives on your website.",
    desc: "Flats, suites, restaurants, gym floors — visitors experience the room from a phone. Higher engagement, faster decisions.",
    startsAt: "₹65,000",
    delivery: "10 days",
  },
  {
    slug: "websites",
    title: "Brand Websites",
    short: "Fast, premium sites tuned for calls and bookings.",
    desc: "Your space deserves a stage. We design and ship sites that move people to call, click, book.",
    startsAt: "₹1,20,000",
    delivery: "14 days",
  },
];

export const trustStats = [
  { value: "50+", label: "Brands shot" },
  { value: "7 day", label: "Avg. delivery" },
  { value: "4.9★", label: "Google rating" },
  { value: "100%", label: "Jaipur-built" },
];
