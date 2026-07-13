export type BlogSection = {
  h2: string;
  body: string[];
  list?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  cover: string;
  coverAlt: string;
  readMinutes: number;
  keywords: string[];
  intro: string[];
  sections: BlogSection[];
  faq: { q: string; a: string }[];
  relatedIndustry?: string; // /industries/<slug>
  lang?: "en" | "hi"; // default en
  pairSlug?: string; // slug of the same article in the other language (hreflang pair)
};

export const posts: BlogPost[] = [
  {
    slug: "real-estate-videography-jaipur",
    title: "Real Estate Videography in Jaipur: Pricing, Process & What Actually Sells Flats",
    description:
      "What real estate videography costs in Jaipur in 2026, how a property shoot works, and why builders using cinematic films and 3D tours sell inventory faster.",
    date: "2026-06-18",
    cover: "/gen/ind-real-estate-cover.webp",
    coverAlt: "Cinematic exterior shot of a residential tower in Jaipur at dusk",
    readMinutes: 6,
    keywords: [
      "real estate videography Jaipur",
      "property video shoot cost India",
      "real estate video production",
      "drone shoot real estate Jaipur",
    ],
    intro: [
      "A buyer decides whether your project is worth a site visit in under ten seconds of watching a video. That is the entire game. Not the brochure, not the hoarding — the first ten seconds of a film on Instagram or your landing page.",
      "We have shot property films across Jaipur since 2021 — from 1 BHK inventory in Mansarovar to luxury towers on Tonk Road. This is the honest guide we wish builders had before their first shoot.",
    ],
    sections: [
      {
        h2: "What does real estate videography cost in Jaipur?",
        body: [
          "A professional property film in Jaipur typically runs between ₹50,000 and ₹1,50,000 depending on scale. At Nirman Media, brand films start at ₹85,000 and ship in 7 days — camera, drone, lighting, edit, grade and cuts for every aspect ratio included.",
          "Cheaper options exist. A ₹15,000 shoot gets you a walkthrough on a gimbal with music on top. It also looks like every other ₹15,000 walkthrough a buyer has scrolled past this week. The premium is not for the camera — it is for planning every frame before anyone presses record.",
        ],
      },
      {
        h2: "What a property shoot actually looks like",
        body: [
          "A serious shoot is scheduled around light, not around convenience. Exteriors happen at golden hour, interiors mid-morning when rooms are brightest, drone passes at dusk when the city glows and your tower's lights are on.",
          "Expect 1–2 days on site for a full project film. Before that, a 30-minute brief call locks the shot list: which flats, which amenities, which angle of the entrance, which lifestyle moments need actors or staging.",
        ],
        list: [
          "Day 0 — brief call, shot list, schedule around sunlight",
          "Day 1–2 — on-site: camera, drone, lighting, staged lifestyle shots",
          "Day 3–6 — edit, colour grade, sound design, revisions",
          "Day 7 — delivery: master film + reels + all aspect ratios",
        ],
      },
      {
        h2: "Film, photos, or 3D tour — what moves inventory?",
        body: [
          "All three do different jobs. The film stops the scroll and builds desire. Photos carry your listings, hoardings and brochures. A 3D scrollytelling tour lets a buyer walk the flat from their phone before they ever call your sales office — which means the people who do call are already half-sold.",
          "When Skyline Residences in Mansarovar combined a property film with a 3D tour, 32 flats sold in 18 days. The tour did the filtering; the sales team only spoke to warm buyers.",
        ],
      },
      {
        h2: "Mistakes we see builders make",
        body: [
          "Shooting before the site is ready, so half the film hides scaffolding. Using a wide-angle lens so aggressively that a 2 BHK looks like a stadium — buyers notice at the site visit, and trust dies there. Skipping the drone because 'buyers see the tower anyway'. And the most expensive one: treating video as a one-time cost instead of an asset that runs across Instagram, YouTube, WhatsApp and your website for the entire sales cycle.",
        ],
      },
    ],
    faq: [
      {
        q: "How much does a real estate video shoot cost in Jaipur?",
        a: "Professional property films in Jaipur range from ₹50,000 to ₹1,50,000. Nirman Media's brand films start at ₹85,000 including drone, lighting, edit, grade and social cuts, delivered in 7 days.",
      },
      {
        q: "How long does a property film take to deliver?",
        a: "A standard project ships in 7 days: 1–2 days of shooting and 4–5 days of editing, colour grading and revisions.",
      },
      {
        q: "Do I need drone footage for a real estate video?",
        a: "For any project taller than four floors or with location advantages (main road, park, skyline views), yes. Aerial context is often the single most persuasive shot for a serious buyer.",
      },
      {
        q: "What is a 3D scrollytelling tour?",
        a: "A web-based walkthrough where the buyer moves through the property by scrolling on their phone or laptop — no app, no appointment. It lives on your website and pre-qualifies buyers before the site visit.",
      },
    ],
    relatedIndustry: "real-estate",
  },
  {
    slug: "hotel-photography-that-fills-rooms",
    title: "Hotel Photography That Fills Rooms: The OTA & Direct-Booking Guide",
    description:
      "How hotel photography drives OTA ranking and direct bookings — what to shoot, what it costs in India, and why The Aurum Hotel saw +120% direct bookings after a reshoot.",
    date: "2026-06-02",
    cover: "/gen/ind-hotels-cover.webp",
    coverAlt: "Warmly lit heritage hotel lobby in Jaipur with a bellboy crossing marble floors",
    readMinutes: 5,
    keywords: [
      "hotel photography India",
      "OTA photos booking.com ranking",
      "hotel photographer Jaipur",
      "increase direct hotel bookings",
    ],
    intro: [
      "Travellers do not read your hotel description. They open the photos, form a feeling in four seconds, and either check dates or close the tab. Every OTA knows this — listing algorithms reward properties whose photos make people stop and click.",
      "After we reshot The Aurum Hotel in Jaipur, direct bookings rose 120%. Nothing else about the hotel changed. Here is what that shoot did differently.",
    ],
    sections: [
      {
        h2: "The shot list OTAs actually reward",
        body: [
          "Booking platforms rank listings partly on engagement — how long travellers linger on your gallery. A converting gallery is a story, not an inventory: arrival, lobby, the room as it feels at check-in, the bathroom (always the bathroom), food close enough to smell, and one twilight exterior that makes the property feel like an event.",
        ],
        list: [
          "Twilight exterior — the money shot for the listing thumbnail",
          "Lobby with human presence, shot at guest eye-level",
          "Every room category, corrected verticals, warm mixed light",
          "Bathrooms — clean geometry, no flash reflections in mirrors",
          "F&B — two hero dishes minimum, natural window light",
          "Pool, spa, gym at their best hour of light",
        ],
      },
      {
        h2: "Why phone photos cost you more than a photographer",
        body: [
          "A room night not sold tonight is gone forever — hotel inventory is the most perishable product there is. If mediocre photos knock even 2% off your occupancy, a ₹45,000 shoot pays for itself inside a season. Magazine-grade stills at Nirman Media start at ₹45,000 with 5-day delivery, shot for OTAs, your website, print and social from the same session.",
        ],
      },
      {
        h2: "Video and 3D tours: the direct-booking layer",
        body: [
          "OTAs take 15–25% commission. The way out is a website worth booking on — and what makes a hotel website convert is motion: a film that sells the stay, and increasingly a 3D scrollytelling tour that lets a guest walk the suite by scrolling. Guests who tour a room book with more confidence and cancel less.",
        ],
      },
    ],
    faq: [
      {
        q: "How much does hotel photography cost in India?",
        a: "Professional hotel shoots in India typically range from ₹30,000 to ₹2,00,000 depending on property size. Nirman Media's photography starts at ₹45,000 with delivery in 5 days.",
      },
      {
        q: "How many photos does a hotel listing need?",
        a: "OTAs recommend 20–40 images. What matters more is order: your first eight photos decide whether a traveller keeps scrolling. Lead with the twilight exterior, best room, and bathroom.",
      },
      {
        q: "Do hotel videos increase bookings?",
        a: "Yes — hotels using video on their own site see measurably higher direct conversion. After a full reshoot and film, The Aurum Hotel in Jaipur saw direct bookings rise 120%.",
      },
    ],
    relatedIndustry: "hotels",
  },
  {
    slug: "3d-scrollytelling-tours-explained",
    title: "3D Scrollytelling Tours: Why Buyers Decide Before They Ever Visit",
    description:
      "What a 3D scrollytelling tour is, how it differs from Matterport-style virtual tours, what it costs, and why scroll-driven walkthroughs convert property and hotel buyers.",
    date: "2026-05-12",
    cover: "/gen/proj-atrium-cover.webp",
    coverAlt: "Sunlit modern apartment interior rendered as an interactive 3D walkthrough",
    readMinutes: 5,
    keywords: [
      "3D virtual tour real estate India",
      "scrollytelling website",
      "interactive property walkthrough",
      "virtual tour cost India",
    ],
    intro: [
      "The most expensive words in property sales are 'come visit and see for yourself'. Every buyer who needs a site visit to understand your space is friction; every buyer who arrives already convinced is velocity.",
      "A 3D scrollytelling tour turns your website into the site visit. The visitor scrolls, and the camera walks them through the flat, the suite, the restaurant floor — cinematically, on any phone, with nothing to install.",
    ],
    sections: [
      {
        h2: "Scrollytelling vs. click-around virtual tours",
        body: [
          "Matterport-style tours hand the buyer a joystick: they click arrows, spin dizzy circles, get lost near the kitchen, and leave. A scrollytelling tour is directed — you choose the path, the pacing, the light, what they notice first. It is the difference between handing someone your keys and giving them a guided walk with your best salesperson.",
          "Because it is scroll-driven, it works where your buyers actually are: on a phone, one thumb, in a queue. No app, no VR headset, no learning curve.",
        ],
      },
      {
        h2: "What it does to a sales funnel",
        body: [
          "The tour sits on your website and pre-sells around the clock. Buyers self-qualify: those who walk the space and book a visit arrive warm, ask sharper questions, and negotiate less on emotion. When Skyline Residences added a scroll tour to their property film, 32 flats sold in 18 days — the sales team spent their time closing, not convincing.",
        ],
      },
      {
        h2: "Cost and timeline",
        body: [
          "At Nirman Media, 3D scrolly tours start at ₹65,000 and deliver in about 10 days: we shoot or model the space, build the camera path, and ship a web experience that lives on your domain. It works for flats, hotel suites, restaurants, and gym floors — any space where the feeling of being there is the product.",
        ],
      },
    ],
    faq: [
      {
        q: "What is a 3D scrollytelling tour?",
        a: "An interactive web experience where scrolling moves the visitor through a space along a directed cinematic path. It runs in the browser on any device — no app or headset required.",
      },
      {
        q: "How is it different from a Matterport virtual tour?",
        a: "Matterport tours are self-navigated and easy to get lost in. Scrollytelling tours are directed — the camera path, pacing and highlights are designed, so every visitor gets the best version of the walkthrough.",
      },
      {
        q: "How much does a 3D tour cost in India?",
        a: "Nirman Media's 3D scrolly tours start at ₹65,000 with roughly 10-day delivery, including shooting, the camera path, and integration on your website.",
      },
    ],
    relatedIndustry: "real-estate",
  },
  {
    slug: "restaurant-photography-jaipur-guide",
    title: "Restaurant Photography in Jaipur: Menus, Ambience & Reels That Book Tables",
    description:
      "A working guide to restaurant photography and reels in Jaipur — what to shoot, what it costs, and how Bistro Maharaj tripled reservations after a menu shoot.",
    date: "2026-07-01",
    cover: "/gen/ind-restaurants-cover.webp",
    coverAlt: "Moody fine-dining interior in Jaipur with candlelit tables and brass lamps",
    readMinutes: 5,
    keywords: [
      "restaurant photography Jaipur",
      "food photography cost India",
      "restaurant reels Instagram",
      "menu photography",
    ],
    intro: [
      "Nobody chooses a restaurant from a text menu anymore. They choose from a reel a friend sent, a photo on the map listing, a grid they scrolled for six seconds. Your food is competing on screens hours before it competes on taste.",
      "When Bistro Maharaj rebuilt their menu photography and reels with us, reservations tripled after launch. The food didn't change. The pictures did.",
    ],
    sections: [
      {
        h2: "The three shoots every restaurant needs",
        body: [
          "One session, three jobs. Menu photography: every hero dish under controlled light, consistent angles, colours graded so the paneer looks like it tastes. Ambience: the room at blue hour when lamps glow and the space feels like an occasion. Reels: short vertical cuts — steam rising, cheese pulling, the pour — engineered for the first half-second of a scroll.",
        ],
        list: [
          "Menu stills — consistent, appetising, OTA and Zomato-ready",
          "Ambience — the room at its best hour, guests in soft focus",
          "Reels — vertical, motion-first, cut for the scroll",
        ],
      },
      {
        h2: "What it costs and why it pays back",
        body: [
          "Professional restaurant photography in Jaipur starts around ₹45,000 at Nirman Media, delivered in 5 days across every format you publish — menus, delivery apps, Google listing, Instagram, print. One extra table a night pays for the shoot inside two months; most restaurants see far more than that.",
        ],
      },
      {
        h2: "Common mistakes that keep tables empty",
        body: [
          "Shooting food under warm tungsten light so everything trends orange. Photographing dishes from directly above when the dish's drama is in its height. Posting kitchen-phone photos between professional ones, which resets the perceived quality of the whole grid. And ignoring the Google Maps listing — often the highest-intent surface a restaurant has, and usually the worst-photographed.",
        ],
      },
    ],
    faq: [
      {
        q: "How much does restaurant photography cost in Jaipur?",
        a: "Professional restaurant shoots in Jaipur start around ₹45,000 at Nirman Media, including menu stills, ambience photography and social cuts, delivered in 5 days.",
      },
      {
        q: "Do restaurant reels actually bring customers?",
        a: "Yes — short vertical video is currently the highest-reach format for restaurants on Instagram. Bistro Maharaj in Jaipur saw 3× reservations after launching menu photography plus reels.",
      },
      {
        q: "How often should a restaurant reshoot its menu?",
        a: "Whenever the menu changes seasonally, and at minimum once a year — lighting styles and platform formats age faster than the dishes do.",
      },
    ],
    relatedIndustry: "restaurants",
  },
  {
    slug: "best-localities-to-buy-flat-in-jaipur",
    title: "Top 10 Localities to Buy a Flat in Jaipur (2026 Buyer's Guide)",
    description:
      "Where to buy a flat in Jaipur in 2026 — Mansarovar, Jagatpura, Vaishali Nagar, Ajmer Road, Tonk Road and more, compared by connectivity, supply, and who each locality suits best.",
    date: "2026-07-08",
    cover: "/gen/ind-real-estate-b1.webp",
    coverAlt: "Aerial view of residential towers along a wide Jaipur road at sunset",
    readMinutes: 8,
    keywords: [
      "flats in Jaipur",
      "best locality to buy flat in Jaipur",
      "property in Jaipur",
      "where to buy flat in Jaipur 2026",
      "Jaipur real estate localities",
    ],
    lang: "en",
    pairSlug: "jaipur-me-flat-kharidne-ke-best-ilake",
    intro: [
      "Jaipur's property map has three speeds: mature localities where daily life is already solved, growth corridors where today's price buys tomorrow's infrastructure, and budget belts where volume keeps rates sane. Picking between them matters more than picking between two towers on the same road.",
      "We shoot property films across these localities every month, which means we walk more sites, sample flats and sales offices than almost anyone who isn't a broker. This guide is what we'd tell a friend — locality by locality, with who each one actually suits. We deliberately don't quote per-sq-ft rates: they shift quarterly, so verify current prices on the ground.",
    ],
    sections: [
      {
        h2: "The established picks",
        body: [
          "Mansarovar — Jaipur's largest planned residential hub and the safest 'boring' choice. Metro connectivity, schools, hospitals and markets are all solved problems. Resale demand is dependable because half the city would happily live here. Suits families and first-time buyers who want zero surprises.",
          "Vaishali Nagar — the established address of west Jaipur. Wide roads, strong retail, premium mid-rise supply and a market that has stayed liquid for two decades. Suits upgraders who want lifestyle without moving to the luxury core.",
          "Malviya Nagar — south Jaipur's institutional belt: offices, colleges, hospitals within minutes. Older but extremely well-located stock plus selective new projects. Suits working professionals and buyers who prize commute over carpet area.",
          "C-Scheme — the luxury core. Low supply, heritage-adjacent, and the closest thing Jaipur has to a blue-chip address. Suits buyers for whom the address is the product.",
        ],
      },
      {
        h2: "The growth corridors",
        body: [
          "Jagatpura — the education and IT corridor of the south-east. Universities and institutes anchor rental demand, and new supply is plentiful, which keeps entry prices reasonable for a locality with this trajectory. Suits first-time buyers and investors betting on rental yield.",
          "Tonk Road — the spine that connects the city to the airport. Premium and upper-mid projects cluster here because connectivity sells itself. Suits buyers who want a newer flat with strong long-term positioning.",
          "Ajmer Road — the affordability corridor of the west, powered by expressway and Ring Road access. Large townships and budget-friendly projects dominate. Suits budget buyers who accept a longer city commute in exchange for more home per rupee.",
          "Vidhyadhar Nagar — planned JDA sectors in the north with wide internal roads and an established, self-contained feel. Suits families who want planned-colony order without Mansarovar's density.",
        ],
      },
      {
        h2: "The value belts",
        body: [
          "Jhotwara / Kalwar Road — north-west volume market. Highest number of budget projects in the city; infrastructure is catching up rather than ahead. Suits pure budget buyers — inspect the specific road and drainage situation before booking.",
          "Sitapura — the industrial and institutional south near the airport, with affordable supply feeding people who work there. Suits end-users employed in the belt and yield-focused investors.",
        ],
      },
      {
        h2: "How to actually choose between them",
        body: [
          "Rank your three non-negotiables before visiting anything: commute ceiling, school/hospital distance, and possession timeline. A locality that fails a non-negotiable is out, however good the launch offer.",
          "Then judge the specific project, not the pin code: RERA registration on rera.rajasthan.gov.in, the builder's last two delivered projects, and a site visit at evening (light, water pressure, who actually lives there). And treat sample-flat photography with suspicion — wide lenses make a 2 BHK feel like a lawn. It's literally our industry; we know exactly how that trick works.",
        ],
        list: [
          "Check RERA registration before paying a booking amount",
          "Visit the builder's previous delivered project, not just the sample flat",
          "Visit at 7pm — light, parking, water and neighbours tell the truth",
          "Verify current per-sq-ft rates locally; they move every quarter",
        ],
      },
    ],
    faq: [
      {
        q: "Which is the best area to buy a flat in Jaipur?",
        a: "For families wanting settled infrastructure: Mansarovar or Vaishali Nagar. For growth and rental yield: Jagatpura or Tonk Road. For budget buyers: Ajmer Road or Kalwar Road. The right answer depends on commute, budget and timeline — no single locality wins all three.",
      },
      {
        q: "Is Jagatpura a good investment in 2026?",
        a: "Jagatpura's fundamentals — universities, IT presence, steady new supply and south-east connectivity — support long-term demand and rental yield. As with any corridor bet, project selection and builder track record matter more than the locality average.",
      },
      {
        q: "What should I check before buying a flat in Jaipur?",
        a: "RERA registration on rera.rajasthan.gov.in, the builder's delivery history, actual site progress versus promised timeline, evening site visit, and current locality rates from multiple sources — not just the sales office.",
      },
      {
        q: "Is it better to buy or rent in Jaipur?",
        a: "If you'll stay 5+ years and EMI stays within a third of income, buying in a mature locality generally wins in Jaipur because entry prices remain reasonable versus metros. For shorter horizons, rent and invest the difference.",
      },
    ],
    relatedIndustry: "real-estate",
  },
  {
    slug: "jaipur-me-flat-kharidne-ke-best-ilake",
    title: "जयपुर में फ्लैट खरीदने के लिए 10 बेहतरीन इलाके (2026 गाइड)",
    description:
      "जयपुर में फ्लैट कहाँ खरीदें? मानसरोवर, जगतपुरा, वैशाली नगर, अजमेर रोड, टोंक रोड — हर इलाके की कनेक्टिविटी, सप्लाई और किसके लिए सही है, आसान हिंदी में।",
    date: "2026-07-08",
    cover: "/gen/ind-real-estate-b1.webp",
    coverAlt: "सूर्यास्त के समय जयपुर की चौड़ी सड़क के किनारे आवासीय टावरों का हवाई दृश्य",
    readMinutes: 7,
    keywords: [
      "जयपुर में फ्लैट",
      "जयपुर में फ्लैट कहां खरीदें",
      "जयपुर प्रॉपर्टी",
      "जयपुर में सबसे अच्छा इलाका",
    ],
    lang: "hi",
    pairSlug: "best-localities-to-buy-flat-in-jaipur",
    intro: [
      "जयपुर के प्रॉपर्टी बाज़ार की तीन रफ़्तारें हैं — बसे-बसाए इलाके जहाँ रोज़मर्रा की हर सुविधा पहले से मौजूद है, ग्रोथ कॉरिडोर जहाँ आज की कीमत में कल का इंफ्रास्ट्रक्चर मिलता है, और बजट बेल्ट जहाँ ज़्यादा सप्लाई की वजह से रेट काबू में रहते हैं। सही टावर चुनने से ज़्यादा ज़रूरी है सही इलाका चुनना।",
      "हम हर महीने इन्हीं इलाकों में प्रॉपर्टी फिल्में शूट करते हैं, इसलिए साइट्स और सैंपल फ्लैट हमने ब्रोकर से भी ज़्यादा देखे हैं। यह गाइड वही है जो हम किसी दोस्त को बताते। हमने जानबूझकर प्रति वर्ग फुट रेट नहीं लिखे — रेट हर तिमाही बदलते हैं, मौजूदा भाव लोकल स्तर पर ज़रूर जाँचें।",
    ],
    sections: [
      {
        h2: "बसे-बसाए इलाके",
        body: [
          "मानसरोवर — जयपुर का सबसे बड़ा प्लान्ड रेज़िडेंशियल हब और सबसे सुरक्षित विकल्प। मेट्रो, स्कूल, अस्पताल, बाज़ार — सब कुछ पहले से मौजूद। रीसेल डिमांड हमेशा बनी रहती है। परिवारों और पहली बार खरीदने वालों के लिए सही।",
          "वैशाली नगर — पश्चिम जयपुर का जाना-माना पता। चौड़ी सड़कें, अच्छा बाज़ार, प्रीमियम प्रोजेक्ट और दो दशकों से चलता हुआ भरोसेमंद मार्केट। अपग्रेड करने वालों के लिए सही।",
          "मालवीय नगर — दक्षिण जयपुर की इंस्टीट्यूशनल बेल्ट: ऑफिस, कॉलेज, अस्पताल कुछ ही मिनट में। लोकेशन के हिसाब से बेहतरीन। नौकरीपेशा लोगों के लिए सही।",
          "सी-स्कीम — जयपुर का लग्ज़री कोर। सप्लाई कम, प्रतिष्ठा सबसे ऊँची। जिनके लिए पता ही असली प्रोडक्ट है, उनके लिए।",
        ],
      },
      {
        h2: "ग्रोथ कॉरिडोर",
        body: [
          "जगतपुरा — दक्षिण-पूर्व का एजुकेशन और IT कॉरिडोर। यूनिवर्सिटियों की वजह से किराये की माँग मज़बूत है और नई सप्लाई भरपूर, इसलिए एंट्री प्राइस अभी भी वाजिब है। पहली बार खरीदने वालों और रेंटल यील्ड चाहने वाले निवेशकों के लिए सही।",
          "टोंक रोड — शहर को एयरपोर्ट से जोड़ने वाली मुख्य लाइन। प्रीमियम प्रोजेक्ट यहीं केंद्रित हैं क्योंकि कनेक्टिविटी अपने आप बिकती है। लंबी अवधि के लिहाज़ से मज़बूत।",
          "अजमेर रोड — पश्चिम का किफ़ायती कॉरिडोर, एक्सप्रेसवे और रिंग रोड की पहुँच के साथ। बड़ी टाउनशिप और बजट प्रोजेक्ट यहाँ सबसे ज़्यादा हैं। कम बजट में ज़्यादा घर चाहने वालों के लिए।",
          "विद्याधर नगर — उत्तर के प्लान्ड JDA सेक्टर, चौड़ी अंदरूनी सड़कें और व्यवस्थित माहौल। प्लान्ड कॉलोनी पसंद करने वाले परिवारों के लिए।",
        ],
      },
      {
        h2: "वैल्यू बेल्ट",
        body: [
          "झोटवाड़ा / कालवाड़ रोड — उत्तर-पश्चिम का वॉल्यूम मार्केट। शहर में सबसे ज़्यादा बजट प्रोजेक्ट यहीं हैं; इंफ्रास्ट्रक्चर अभी विकसित हो रहा है। बुकिंग से पहले उस खास सड़क और ड्रेनेज की स्थिति ज़रूर देखें।",
          "सीतापुरा — एयरपोर्ट के पास की इंडस्ट्रियल-इंस्टीट्यूशनल बेल्ट, किफ़ायती सप्लाई के साथ। वहीं काम करने वालों और यील्ड चाहने वाले निवेशकों के लिए सही।",
        ],
      },
      {
        h2: "इनमें से चुनें कैसे?",
        body: [
          "कोई भी साइट देखने से पहले अपनी तीन शर्तें तय करें: ऑफिस से अधिकतम दूरी, स्कूल/अस्पताल की दूरी, और पज़ेशन की समय-सीमा। जो इलाका कोई एक शर्त फेल करे, वह बाहर — ऑफर चाहे जितना अच्छा हो।",
          "फिर इलाके की जगह प्रोजेक्ट को परखें: rera.rajasthan.gov.in पर RERA रजिस्ट्रेशन, बिल्डर के पिछले दो डिलीवर हुए प्रोजेक्ट, और शाम के समय साइट विज़िट। सैंपल फ्लैट की फोटोग्राफी पर आँख बंद करके भरोसा न करें — वाइड लेंस 2 BHK को मैदान जैसा दिखा देता है। यह हमारा ही पेशा है, हम जानते हैं यह ट्रिक कैसे काम करती है।",
        ],
        list: [
          "बुकिंग अमाउंट देने से पहले RERA रजिस्ट्रेशन जाँचें",
          "सिर्फ सैंपल फ्लैट नहीं, बिल्डर का पिछला डिलीवर हुआ प्रोजेक्ट देखें",
          "शाम 7 बजे विज़िट करें — रोशनी, पानी, पार्किंग सच बता देते हैं",
          "मौजूदा रेट कई सोर्स से पता करें, सिर्फ सेल्स ऑफिस से नहीं",
        ],
      },
    ],
    faq: [
      {
        q: "जयपुर में फ्लैट खरीदने के लिए सबसे अच्छा इलाका कौन सा है?",
        a: "परिवार के लिए: मानसरोवर या वैशाली नगर। ग्रोथ और किराये की कमाई के लिए: जगतपुरा या टोंक रोड। कम बजट के लिए: अजमेर रोड या कालवाड़ रोड। सही जवाब आपके बजट, कम्यूट और समय-सीमा पर निर्भर करता है।",
      },
      {
        q: "क्या 2026 में जगतपुरा में निवेश करना सही है?",
        a: "यूनिवर्सिटी, IT और लगातार नई सप्लाई की वजह से जगतपुरा की माँग और रेंटल यील्ड मज़बूत है। पर इलाके से ज़्यादा ज़रूरी है सही प्रोजेक्ट और भरोसेमंद बिल्डर चुनना।",
      },
      {
        q: "जयपुर में फ्लैट खरीदने से पहले क्या-क्या जाँचें?",
        a: "rera.rajasthan.gov.in पर RERA रजिस्ट्रेशन, बिल्डर की डिलीवरी हिस्ट्री, साइट की असली प्रगति, शाम की साइट विज़िट, और कई सोर्स से मौजूदा रेट।",
      },
    ],
    relatedIndustry: "real-estate",
  },
  {
    slug: "how-to-buy-flat-in-jaipur-step-by-step",
    title: "How to Buy a Flat in Jaipur: Step-by-Step Guide (RERA, Loan, Registry)",
    description:
      "The complete process of buying a flat in Jaipur — budgeting, home loan pre-approval, RERA verification, site visits, negotiation, agreement, stamp duty and registry, explained step by step.",
    date: "2026-07-05",
    cover: "/gen/ind-real-estate-b3.webp",
    coverAlt: "Young couple reviewing apartment plans at a builder's office in Jaipur",
    readMinutes: 8,
    keywords: [
      "how to buy flat in Jaipur",
      "flat buying process India",
      "RERA Rajasthan check",
      "stamp duty Rajasthan flat registry",
      "home loan for flat Jaipur",
    ],
    lang: "en",
    pairSlug: "jaipur-me-flat-kaise-kharide",
    intro: [
      "Buying a flat is a sequence, and the order protects you: money first, paperwork second, emotions last. Most bad purchases in Jaipur happen because that order gets reversed — a beautiful sample flat first, the RERA check never.",
      "Here is the full sequence we've watched hundreds of buyers walk through at the project sites we film, from first budget to getting the keys.",
    ],
    sections: [
      {
        h2: "Step 1–2: Budget, then pre-approval",
        body: [
          "Fix your all-in budget before seeing anything. The sticker price is roughly 85% of what you'll pay — stamp duty and registration, GST on under-construction property, maintenance deposits, parking and interiors sit on top. Keep the EMI within a third of monthly income.",
          "Get a home-loan pre-approval before shortlisting. It fixes your real budget, exposes credit-report surprises early, and turns you into a serious buyer at the negotiation table. Banks also do their own legal diligence on projects they approve — a project no major bank will fund is telling you something.",
        ],
      },
      {
        h2: "Step 3–4: Shortlist localities, verify RERA",
        body: [
          "Shortlist two or three localities against your commute, schools and timeline — our locality guide covers who each Jaipur area suits. Then, for every project on the list, verify RERA registration on rera.rajasthan.gov.in before a single site visit. The RERA page shows approved plans, declared possession date, and complaint history — five minutes that filters out the projects worth zero of your weekends.",
        ],
      },
      {
        h2: "Step 5–6: Site visits and negotiation",
        body: [
          "Visit the site, not just the sales office. Then visit the builder's last delivered project and talk to residents — delivery history predicts your possession date better than any brochure. Do one visit at evening: water pressure, parking chaos and streetlight reality all show up after 7pm.",
          "Treat the sample flat as advertising, shot and staged to sell (we make this advertising for a living — the wide lens is doing more work than the architect). Negotiate on total cost, not per-sq-ft: ask for waived floor-rise charges, free parking, or clubbed registration support rather than a token rate cut.",
        ],
        list: [
          "Verify carpet area vs super built-up in writing",
          "Ask for the payment schedule linked to construction stages, not dates",
          "Check what 'possession' includes — lift, power backup, occupancy certificate",
          "Get every verbal promise added to the booking form",
        ],
      },
      {
        h2: "Step 7–8: Agreement, stamp duty and registry",
        body: [
          "Have a property lawyer read the builder-buyer agreement before signing — clauses on delay penalty, exit terms and area changes are where builders hide risk. Pay the booking amount by bank transfer only, against a receipt naming the exact flat.",
          "Registry makes you the legal owner. Stamp duty and registration charges in Rajasthan are calculated on the DLC rate or transaction value, with a lower slab for property registered in a woman's name — rates are revised periodically, so confirm current figures on the Rajasthan registration department portal or with your bank before budgeting. After possession, complete the handover checklist: occupancy certificate, all NOCs, maintenance handover and the flat's physical snag list.",
        ],
      },
    ],
    faq: [
      {
        q: "What documents should I check before buying a flat in Jaipur?",
        a: "RERA registration, approved building plan, land title and conversion documents, commencement certificate, builder-buyer agreement draft, and — near possession — the occupancy certificate. A bank's legal approval of the project is a useful independent check.",
      },
      {
        q: "How much stamp duty is charged on flats in Rajasthan?",
        a: "Stamp duty in Rajasthan is charged on the DLC rate or transaction value, with a concessional slab for registration in a woman's name. Rates and surcharges are revised periodically — verify current figures on the Rajasthan registration portal before finalising your budget.",
      },
      {
        q: "Is it safe to buy an under-construction flat in Jaipur?",
        a: "Yes, if the project is RERA-registered, the builder has delivered on time before, a major bank has approved the project, and your payment schedule is construction-linked. Under-construction pricing is lower, but the diligence burden is higher.",
      },
      {
        q: "How long does the flat registry process take in Jaipur?",
        a: "With documents ready, registration itself is typically completed within a day at the sub-registrar office; the preparation — stamp duty payment, document drafting, appointment — usually takes one to two weeks.",
      },
    ],
    relatedIndustry: "real-estate",
  },
  {
    slug: "jaipur-me-flat-kaise-kharide",
    title: "जयपुर में फ्लैट कैसे खरीदें: पूरी प्रक्रिया (RERA, लोन, रजिस्ट्री)",
    description:
      "जयपुर में फ्लैट खरीदने की पूरी प्रक्रिया — बजट, होम लोन प्री-अप्रूवल, RERA जाँच, साइट विज़िट, मोलभाव, एग्रीमेंट, स्टाम्प ड्यूटी और रजिस्ट्री — स्टेप बाय स्टेप आसान हिंदी में।",
    date: "2026-07-05",
    cover: "/gen/ind-real-estate-b3.webp",
    coverAlt: "जयपुर में बिल्डर के दफ़्तर में फ्लैट का नक्शा देखता हुआ युवा दंपति",
    readMinutes: 7,
    keywords: [
      "जयपुर में फ्लैट कैसे खरीदें",
      "फ्लैट खरीदने की प्रक्रिया",
      "RERA राजस्थान",
      "फ्लैट रजिस्ट्री स्टाम्प ड्यूटी राजस्थान",
    ],
    lang: "hi",
    pairSlug: "how-to-buy-flat-in-jaipur-step-by-step",
    intro: [
      "फ्लैट खरीदना एक क्रम है, और यही क्रम आपकी सुरक्षा है: पहले पैसा, फिर कागज़, भावनाएँ सबसे आख़िर में। जयपुर में ज़्यादातर गलत सौदे इसलिए होते हैं क्योंकि यह क्रम उल्टा हो जाता है — पहले खूबसूरत सैंपल फ्लैट, और RERA जाँच कभी नहीं।",
      "यह वही पूरा क्रम है जो हमने अपने शूट वाले प्रोजेक्ट्स पर सैकड़ों खरीदारों को अपनाते देखा है — पहले बजट से लेकर चाबी मिलने तक।",
    ],
    sections: [
      {
        h2: "स्टेप 1–2: बजट, फिर लोन प्री-अप्रूवल",
        body: [
          "कुछ भी देखने से पहले अपना कुल बजट तय करें। ब्रोशर की कीमत असल खर्च का लगभग 85% ही होती है — ऊपर से स्टाम्प ड्यूटी, रजिस्ट्रेशन, अंडर-कंस्ट्रक्शन पर GST, मेंटेनेंस डिपॉज़िट, पार्किंग और इंटीरियर जुड़ते हैं। EMI मासिक आय के एक-तिहाई से ज़्यादा न रखें।",
          "शॉर्टलिस्ट बनाने से पहले होम लोन का प्री-अप्रूवल लें। इससे असली बजट तय होता है, क्रेडिट रिपोर्ट की दिक्कतें पहले पता चल जाती हैं, और मोलभाव में आपकी बात का वज़न बढ़ता है। जिस प्रोजेक्ट को कोई बड़ा बैंक फंड न करे, वह अपने आप में एक चेतावनी है।",
        ],
      },
      {
        h2: "स्टेप 3–4: इलाके चुनें, RERA जाँचें",
        body: [
          "अपने कम्यूट, स्कूल और समय-सीमा के हिसाब से दो-तीन इलाके चुनें — कौन सा इलाका किसके लिए सही है, इस पर हमारी लोकैलिटी गाइड पढ़ें। फिर हर प्रोजेक्ट का RERA रजिस्ट्रेशन rera.rajasthan.gov.in पर जाँचें — साइट विज़िट से पहले। RERA पेज पर अप्रूव्ड प्लान, घोषित पज़ेशन डेट और शिकायतों का इतिहास दिखता है। पाँच मिनट की यह जाँच बेकार प्रोजेक्ट पहले ही छाँट देती है।",
        ],
      },
      {
        h2: "स्टेप 5–6: साइट विज़िट और मोलभाव",
        body: [
          "सिर्फ सेल्स ऑफिस नहीं, साइट देखें। फिर बिल्डर का पिछला डिलीवर हुआ प्रोजेक्ट देखें और वहाँ के निवासियों से बात करें — डिलीवरी का इतिहास किसी भी ब्रोशर से बेहतर बताता है कि पज़ेशन कब मिलेगा। एक विज़िट शाम को ज़रूर करें: पानी का प्रेशर, पार्किंग और स्ट्रीटलाइट की असलियत 7 बजे के बाद ही दिखती है।",
          "सैंपल फ्लैट को विज्ञापन समझें — वह बेचने के लिए सजाया और शूट किया गया है (यह विज्ञापन बनाना हमारा ही काम है — वहाँ आर्किटेक्ट से ज़्यादा मेहनत वाइड लेंस कर रहा होता है)। मोलभाव प्रति वर्ग फुट पर नहीं, कुल कीमत पर करें: रेट में मामूली छूट की जगह फ्लोर-राइज़ माफ़ी, फ्री पार्किंग या रजिस्ट्रेशन में मदद माँगें।",
        ],
        list: [
          "कारपेट एरिया और सुपर बिल्ट-अप लिखित में जाँचें",
          "पेमेंट शेड्यूल तारीख़ों से नहीं, कंस्ट्रक्शन स्टेज से जुड़वाएँ",
          "'पज़ेशन' में क्या-क्या शामिल है — लिफ्ट, पावर बैकअप, OC — पूछें",
          "हर मौखिक वादा बुकिंग फॉर्म में लिखवाएँ",
        ],
      },
      {
        h2: "स्टेप 7–8: एग्रीमेंट, स्टाम्प ड्यूटी और रजिस्ट्री",
        body: [
          "बिल्डर-बायर एग्रीमेंट साइन करने से पहले किसी प्रॉपर्टी वकील से पढ़वाएँ — देरी पर पेनल्टी, एग्ज़िट की शर्तें और एरिया बदलाव वाले क्लॉज़ में ही जोखिम छिपा होता है। बुकिंग अमाउंट सिर्फ बैंक ट्रांसफर से दें और रसीद पर फ्लैट नंबर लिखवाएँ।",
          "रजिस्ट्री से ही आप कानूनी मालिक बनते हैं। राजस्थान में स्टाम्प ड्यूटी DLC रेट या सौदे की कीमत पर लगती है, और महिला के नाम रजिस्ट्री पर छूट मिलती है — दरें समय-समय पर बदलती हैं, इसलिए बजट बनाने से पहले राजस्थान रजिस्ट्रेशन विभाग के पोर्टल या अपने बैंक से मौजूदा दरें ज़रूर पक्की करें। पज़ेशन पर हैंडओवर चेकलिस्ट पूरी करें: ऑक्यूपेंसी सर्टिफिकेट, सभी NOC और फ्लैट की स्नैग लिस्ट।",
        ],
      },
    ],
    faq: [
      {
        q: "जयपुर में फ्लैट खरीदने से पहले कौन से दस्तावेज़ जाँचें?",
        a: "RERA रजिस्ट्रेशन, अप्रूव्ड बिल्डिंग प्लान, ज़मीन का टाइटल, कमेंसमेंट सर्टिफिकेट, बिल्डर-बायर एग्रीमेंट का ड्राफ्ट, और पज़ेशन के समय ऑक्यूपेंसी सर्टिफिकेट। किसी बड़े बैंक की प्रोजेक्ट अप्रूवल भी एक अच्छी स्वतंत्र जाँच है।",
      },
      {
        q: "राजस्थान में फ्लैट पर स्टाम्प ड्यूटी कितनी लगती है?",
        a: "स्टाम्प ड्यूटी DLC रेट या सौदे की कीमत पर लगती है और महिला के नाम रजिस्ट्री पर रियायती दर मिलती है। दरें बदलती रहती हैं — मौजूदा दरें राजस्थान रजिस्ट्रेशन पोर्टल या बैंक से पक्की करें।",
      },
      {
        q: "क्या अंडर-कंस्ट्रक्शन फ्लैट खरीदना सुरक्षित है?",
        a: "हाँ — अगर प्रोजेक्ट RERA-रजिस्टर्ड है, बिल्डर पहले समय पर डिलीवर कर चुका है, बड़े बैंक ने प्रोजेक्ट अप्रूव किया है, और पेमेंट कंस्ट्रक्शन स्टेज से जुड़ा है। कीमत कम मिलती है, पर जाँच की ज़िम्मेदारी ज़्यादा होती है।",
      },
    ],
    relatedIndustry: "real-estate",
  },
];

export const postBySlug = (slug: string) =>
  posts.find((p) => p.slug === slug);
