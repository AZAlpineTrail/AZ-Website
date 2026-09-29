import {
  ArrowRight,
  CalendarDays,
  Download,
  Fuel,
  Hotel,
  Map,
  Mountain,
  Newspaper,
  Route,
  ShieldCheck,
  Store,
  Trees,
} from "lucide-react";

export const navItems = [
  { label: "Trail", href: "/trail" },
  { label: "Rusty 1000", href: "/rustys-route-1000" },
  { label: "Resources", href: "/resources" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
];

export const oldSiteRoutes = [
  "/",
  "/the-trail",
  "/rustys-route-1000",
  "/about-us",
  "/frequently-asked-questions",
  "/contact-us",
  "/shop",
  "/cart",
  "/login",
];

export const trailFilters = [
  { label: "A Route", active: true },
  { label: "B Route", active: false },
  { label: "Towns", active: true },
  { label: "Fuel", active: true },
  { label: "Lodging", active: true },
];

export const downloads = [
  { label: "Complete Trail GPX", type: "GPX", version: "V5 / Mar 21, 2026", href: "/downloads/arizona-alpine-trail-gpx" },
  { label: "Segment Overlay KML", type: "KML", version: "V5 / Mar 21, 2026", href: "/downloads/azat-segments-v5-kml" },
];

export const towns = [
  {
    title: "Alpine",
    slug: "alpine",
    services: ["Trail Access", "Fuel", "Food", "Lodging"],
    description: "The high-country anchor for AZAT and Rusty 1000.",
  },
  {
    title: "Greer",
    slug: "greer",
    services: ["Lodging", "Food", "Scenic"],
    description: "A mountain stop with lodging inventory that should be booked early.",
  },
  {
    title: "Show Low",
    slug: "show-low",
    services: ["Fuel", "Repairs", "Groceries"],
    description: "A larger services hub for riders crossing the White Mountains.",
  },
  {
    title: "Pine",
    slug: "pine",
    services: ["Fuel", "Food", "Lodging"],
    description: "A community gateway that connects trail tourism to local businesses.",
  },
];

export const segments = [
  {
    title: "A Route",
    slug: "a-route",
    code: "A",
    status: "Preliminary",
    mileage: "700+ mi",
    description: "Primary loop planning route with town connectors and downloadable files.",
  },
  {
    title: "B Route",
    slug: "b-route",
    code: "B",
    status: "Preliminary",
    mileage: "TBD",
    description: "Alternate trail family for future official and seasonal segment detail.",
  },
];

export const itineraryDays = [
  ["01", "Alpine", "Greer", "~100", "Eagar", "Lazy Trout Lodge"],
  ["02", "Greer", "Show Low", "~85", "Show Low", "Days Inn"],
  ["03", "Show Low", "Heber/Overgaard", "~100", "Show Low, Heber", "Sawmill Inn"],
  ["04", "Heber/Overgaard", "Pine", "~110", "Pine", "The Strawberry Inn"],
  ["05", "Pine", "Punkin Center", "~80", "Punkin Center", "Local lodging"],
  ["06", "Punkin Center", "Young", "~75", "Young", "Book early"],
];

export type NewsBodyBlock =
  | { type: "p"; text: string }
  | { type: "quote"; text: string }
  | { type: "link"; text: string; url: string };

export type NewsPost = {
  title: string;
  slug: string;
  date: string;
  category: string;
  excerpt: string;
  heroImage?: string;
  heroImageAlt?: string;
  heroImageFit?: "cover" | "contain";
  body?: NewsBodyBlock[];
  source?: {
    label: string;
    url?: string;
    reporter?: string;
    photoCredit?: string;
  };
};

export function formatNewsDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export const news: NewsPost[] = [
  {
    title: "The 'Rusty 1000': Where Every Mile Tells a Story",
    slug: "rusty-1000-ambassador-ride",
    date: "2026-07-28",
    category: "In the Press",
    excerpt:
      "AZAT board member Rusty Childress spent 11 days and more than 1,000 miles circling the Arizona Alpine Trail solo on an ATV, documenting conditions and meeting the communities along the way.",
    heroImage: "/news/rusty-1000-alpine-sign.jpg",
    heroImageAlt:
      "Rusty Childress raises his arms beside his ATV at the \"Welcome to Alpine\" trailhead sign, marking the start of his 1,000-mile Arizona Alpine Trail ambassador ride.",
    body: [
      {
        type: "p",
        text: "What if one 700-mile trail could lead you from alpine forests to desert canyons, from roadside cafés to hidden overlooks, and from bands of wild horses to communities many travelers pass by without ever stopping?",
      },
      {
        type: "p",
        text: "That's what Arizona Alpine Trail board member and Alpine photographer Rusty Childress discovered during his 11-day solo ATV ambassador ride, a journey that stretched into more than 1,000 miles as he documented trail conditions, met residents, and showcased the communities connected by the trail.",
      },
      {
        type: "quote",
        text: "The 'Rusty 1000' name wasn't about setting a mileage record: it was about exploration.",
      },
      {
        type: "p",
        text: "Traveling counterclockwise from Alpine through Greer, Show Low, Heber, Strawberry, Tonto Basin and Young before looping back, Childress watched the landscape transform from 10,000-foot spruce and fir forests to cactus-covered desert, all in the same trip. Along the way he met with local business owners, shared the Arizona Alpine Trail Master Plan, and talked with Game and Fish, county sheriff's offices, and the U.S. Forest Service about responsible, managed recreation.",
      },
      {
        type: "quote",
        text: "The trail connects remarkable landscapes, but it also connects the small towns, businesses, history and people that make this region such a unique place to explore.",
      },
      {
        type: "p",
        text: "The ride is part of the same effort behind our ongoing \"Segment Spotlight\" series, which is unveiling all 28 segments of the trail one at a time on our Facebook page.",
      },
    ],
    source: {
      label: "White Mountain Independent",
      url: "https://www.wmicentral.com/news/the-rusty-1000-where-every-mile-tells-a-story/article_70368652-25d9-489f-8584-5d72159636a0.html",
      reporter: "Toni Gibbons",
      photoCredit: "Rusty Childress",
    },
  },
  {
    title: "AZ Game & Fish Outdoor Expo!",
    slug: "az-game-fish-outdoor-expo",
    date: "2025-03-28",
    category: "Community & Events",
    excerpt:
      "AZAT joins the Arizona Game and Fish Department's Outdoor Expo at Ben Avery Shooting Facility in Phoenix, the state's largest hands-on outdoor expo.",
    heroImage: "/news/az-game-fish-expo-2025.png",
    heroImageAlt: "A girl smiles while holding up a fish she caught at the Arizona Game and Fish Outdoor Expo family fishing tank.",
    body: [
      {
        type: "p",
        text: "Come visit us and learn more about the Arizona Alpine Trail at the expo! The largest hands-on outdoor expo in Arizona is at the Ben Avery Shooting Facility in Phoenix. The Arizona Game and Fish Department's Outdoor Expo features everything from wildlife exhibits to family fishing tanks to trying out firearms in a safe, controlled environment on the range.",
      },
      {
        type: "p",
        text: "The expo runs 9 a.m. to 3 p.m. on Saturday, March 29, 2025, and 9 a.m. to 3 p.m. on Sunday, March 30, 2025.",
      },
      {
        type: "link",
        text: "More information on the Outdoor Expo",
        url: "https://www.azgfd.com/event/outdoor-expo-2025/",
      },
    ],
  },
  {
    title: "Outdoors SW Magazine Article July 2023",
    slug: "outdoors-sw-magazine-article-july-2023",
    date: "2023-09-06",
    category: "In the Press",
    excerpt: "A short feature on Arizona Alpine Trail appears in the July 2023 issue of Outdoors SW Magazine.",
    heroImage: "/news/outdoors-sw-magazine-cover.png",
    heroImageAlt: "Cover of the July 2023 issue of Outdoors SW Magazine, featuring a great blue heron.",
    body: [{ type: "p", text: "A short article was published about us in Outdoors SW Magazine." }],
    source: {
      label: "Outdoors SW Magazine, \"Pardon Our Dust: Building the Arizona Alpine Trail,\" July 2023, page 22",
      reporter: "Jen Rinaldi",
    },
  },
  {
    title: "Alpine Open House Meeting",
    slug: "alpine-open-house-meeting",
    date: "2023-08-30",
    category: "Community & Events",
    excerpt: "AZAT thanks the Apache-Sitgreaves National Forest for hosting an Alpine community open house on the trail's early planning.",
    heroImage: "/news/alpine-open-house-2023.jpeg",
    heroImageAlt: "Community members seated in a meeting hall listening to a presentation during the Alpine open house discussion.",
    body: [
      {
        type: "p",
        text: "Arizona Alpine Trail, Inc. (AZAT) would like to thank the Apache-Sitgreaves National Forest (ASNF) for assembling an open house discussion with the Alpine community on Monday, August 28th, 2023.",
      },
      {
        type: "p",
        text: "Over 30 community members attended to ask questions, address concerns, and propose ideas about how Alpine will be connected to the Alpine Trail. Such feedback is very much appreciated and essential for success. As mentioned during the meeting, the formation of the trail is still in its initial phases. Funding for the creation of a Master Plan has been obtained and work on the plan has begun.",
      },
      {
        type: "p",
        text: "Many future community discussions will be scheduled as part of generating the Master Plan, which should take about a year to complete.",
      },
      {
        type: "p",
        text: "This website, although still being constructed, will be the best source for the latest news and information. If anyone has specific questions, feel free to visit our Contact Us page and submit them. Thank you.",
      },
    ],
  },
  {
    title: "Donation from Waste Management of Arizona",
    slug: "donation-from-waste-management-of-arizona",
    date: "2023-07-24",
    category: "Partner & Agency News",
    excerpt: "AZAT thanks Waste Management of Arizona for a generous donation supporting trail cleanup costs.",
    heroImage: "/news/waste-management-logo.jpg",
    heroImageAlt: "Waste Management of Arizona logo.",
    heroImageFit: "contain",
    body: [
      {
        type: "p",
        text: "AZAT would like to extend thanks to Waste Management of Arizona for their kind and generous donation to help AZAT offset waste disposal costs when gathering and cleaning up trash from the trail. AZAT fully endorses a “leave no trace” policy when out enjoying the trail. Regardless of who left it behind, we encourage riders to help pick up trash when they see it and help keep the trail pristine.",
      },
    ],
  },
  {
    title: "Kick-off Meeting with Logan-Simpson",
    slug: "kick-off-meeting-with-logan-simpson",
    date: "2023-07-17",
    category: "Trail Updates",
    excerpt: "AZAT officially begins work on the trail's Master Plan alongside engineering firm Logan-Simpson.",
    heroImage: "/news/logan-simpson-kickoff-2023.jpg",
    heroImageAlt: "AZAT President Jerry Smith presents to Logan-Simpson project partners in a conference room beside the Arizona Alpine Trail flag.",
    body: [
      {
        type: "p",
        text: "Today we officially began working on the AZAT Master Plan with our engineering firm Logan-Simpson. Up until now we have completed many tasks in preparation for this, but now we are officially working on items to create the master plan for the project.",
      },
    ],
  },
  {
    title: "A Word From Our President",
    slug: "a-word-from-our-president",
    date: "2023-06-23",
    category: "Trail Updates",
    excerpt:
      "AZAT's Master Plan grant has been approved and funded by Arizona State Parks and Trails, laying the groundwork for a 700–800 mile OHV loop trail.",
    heroImage: "/azat/brand/azat-logo.png",
    heroImageAlt: "Arizona Alpine Trail logo.",
    heroImageFit: "contain",
    body: [
      {
        type: "p",
        text: "The Arizona Alpine Trail, Inc an Arizona 501 (c)(3) non profit corporation was recently notified that our grant for the Master Plan has been approved and funded by Arizona State Parks and Trails effective June 23, 2023.",
      },
      {
        type: "p",
        text: "This grant will be the foundation for the creation of our multi-modal, but primarily off road motorized (OHV) 700-800 mile loop trail between Payson and Hannagan Meadow traversing Gila, Coconino, Navajo, Apache and Greenlee counties. The “trail” will be located on some State & County highways and roads but primarily on trails and forest Roads in the Tonto, Coconino and Apache-Sitgreaves forests, which includes 7 Ranger Districts; Tonto Basin, Payson, Mogollon, Black Mesa, Lakeside, Springerville, & Alpine.",
      },
      {
        type: "p",
        text: "New and additional economic benefits will accrue to those rural eastern Arizona counties, and cities, towns & communities that have connector trails to them. The Master Plan will feature and promote those cities, towns and communities. Additional promotional material will be created and special signage will direct the OHV traffic to businesses such as lodging, restaurants, gas, car washes, repair facilities, gift stores, groceries, etc. etc.",
      },
      {
        type: "p",
        text: "These counties, cities, towns and communities will benefit from the increased revenue from the tourism traffic generated by the users of the Arizona Alpine Trail.",
      },
      {
        type: "p",
        text: "The Master Plan will lay the groundwork for future trail development to improve the outdoor off highway experience of the White Mountains, as well as providing for consistent signage along the routes, maintenance of the trails, and in general all future improvements that requires grants to accomplish.",
      },
      {
        type: "p",
        text: "Arizona Alpine Trail, Inc thanks Arizona State Parks and Trails, for their continued advice and cooperation for this grant and all the counties, cities, towns and communities that have supported our grant application.",
      },
      { type: "p", text: "Jerry Smith, President Arizona Alpine Trail, Inc" },
    ],
  },
];

export const resourceCards = [
  {
    icon: ShieldCheck,
    title: "OHV Safety",
    text: "Clear guidance for equipment, preparation, trail etiquette, and responsible riding.",
  },
  {
    icon: Trees,
    title: "Stewardship",
    text: "Leave-no-trace education and cleanup support can become visible content, not a buried post.",
  },
  {
    icon: Store,
    title: "Economic Benefit",
    text: "Trail resources can help riders plan lodging, food, fuel, repairs, and local services along the route.",
  },
];

export const stats = [
  { label: "Planning loop", value: "700+ mi", icon: Route },
  { label: "Route 1000 rhythm", value: "11 days", icon: CalendarDays },
  { label: "CMS content types", value: "14+", icon: Newspaper },
  { label: "Trail files", value: "GPX/KML", icon: Download },
];

export const mapPins = [
  { label: "Alpine", top: "68%", left: "74%", icon: Mountain },
  { label: "Greer", top: "52%", left: "78%", icon: Hotel },
  { label: "Show Low", top: "38%", left: "56%", icon: Fuel },
  { label: "Pine", top: "31%", left: "24%", icon: Map },
  { label: "Young", top: "53%", left: "33%", icon: Trees },
];

export const heroImage =
  "https://azalpinetrail.org/wp-content/uploads/2026/06/732464060_1314291140918938_8655586887586886350_n.jpg";

export const scenicImage =
  "https://azalpinetrail.org/wp-content/uploads/2021/11/alpine_forest_aboutus-2500x1215.jpg";

export const arrowIcon = ArrowRight;
