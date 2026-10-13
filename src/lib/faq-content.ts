export type FaqLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type FaqItem = {
  id?: string;
  q: string;
  a: string;
  sections?: { title: string; body: string }[];
  link?: FaqLink;
};

export type FaqCategory = {
  id: string;
  label: string;
  title: string;
  items: FaqItem[];
};

export const beforeEveryRide: string[] = [
  "Download the current AZAT route file and note its version date.",
  "Check closures, fire restrictions, weather, road conditions, and land-manager alerts.",
  "Confirm registration, decal, insurance, equipment, and permit requirements for your vehicle and route.",
  "Verify fuel, lodging, parking, and operating hours directly with providers.",
  "Carry offline navigation, water, food, first aid, tools, recovery gear, and backup communications.",
  "Leave a trip plan with a responsible person and define a check-in time.",
];

export const faqCategories: FaqCategory[] = [
  {
    id: "vehicles",
    label: "Vehicles & Access",
    title: "Vehicles, Licenses & Legal Access",
    items: [
      {
        id: "ohv-decal",
        q: "Do I need an Arizona OHV decal?",
        a: "Yes, in most cases. An OHV designed by its manufacturer primarily for travel over unimproved terrain and weighing 2,500 pounds or less must display a valid Arizona OHV decal to operate on Arizona public and State Trust lands. The decal is valid for one year from its purchase date.",
        sections: [
          {
            title: "Arizona residents",
            body: "Purchase the decal through Arizona MVD or an authorized third-party MVD provider. At least one registered owner must first complete the free \"OHV Decal: Safe & Ethical Riding in Arizona\" course. Place the decal in the upper-left corner of the vehicle's Arizona license plate.",
          },
          {
            title: "Non-Arizona residents",
            body: "Purchase an Arizona nonresident OHV decal through an Arizona Game and Fish Department portal account. At least one registered owner must complete the same free course. Arizona does not accept OHV decals issued by another state. Place the decal on the left rear quarter panel of an OHV with three or more wheels, or on the left fork leg of a two-wheeled vehicle.",
          },
          {
            title: "Road-use reminder",
            body: "A nonresident decal permits operation on non-maintained roads and trails, including incidental crossings of maintained roads. It does not make the vehicle street legal. To operate on pavement or maintained dirt roads, the vehicle must meet Arizona's street-legal registration, insurance, licensing, and equipment requirements. Short-term visitors may not qualify for Arizona street-legal registration and should plan to trailer their OHV to an eligible trailhead.",
          },
        ],
        link: {
          label: "Check official decal requirements",
          href: "https://www.azgfd.com/off-highway-vehicle/ohv-register-and-renew-your-license/ohv-decals/",
          external: true,
        },
      },
      {
        q: "What licenses and permits are required for Arizona residents?",
        a: "Arizona does not issue a separate \"OHV license.\" Operators must carry a valid driver's license wherever state motor-vehicle laws apply, including maintained roads. The vehicle must also have the registration, current OHV decal, liability insurance, and equipment required for where it will be operated. One registered owner must complete the free \"OHV Decal: Safe & Ethical Riding in Arizona\" course to purchase an OHV decal. Confirm current requirements with Arizona Game and Fish and MVD before riding.",
      },
      {
        q: "What licenses and permits are required for non-Arizona residents?",
        a: "The older AZGFD bulletin said a nonresident owner could be exempt when the vehicle displayed a current home-state OHV decal or registration and remained in Arizona for no more than 30 consecutive days. That exemption is no longer current: Arizona Game and Fish says Arizona stopped accepting out-of-state OHV decals in 2019.\n\nVisitors whose OHV is designed primarily for unimproved terrain and weighs 2,500 pounds or less must purchase an Arizona nonresident OHV decal. As of January 1, 2025, at least one registered owner must create a free AZGFD portal account and complete the free \"OHV Decal: Safe & Ethical Riding in Arizona\" course. The nonresident decal permits operation on non-maintained roads and trails, with incidental crossings of maintained roads; it does not make the vehicle street legal. Short-term visitors generally cannot obtain Arizona street-legal registration unless they meet Arizona domicile, garaging, and insurance requirements. Confirm the current rules before bringing a vehicle to Arizona.",
        link: {
          label: "Check current nonresident requirements",
          href: "https://www.azgfd.com/off-highway-vehicle/ohv-register-and-renew-your-license/ohv-decals/",
          external: true,
        },
      },
      {
        q: "What types of vehicles are appropriate?",
        a: "The network is intended primarily for OHVs capable of current route conditions: width, wheelbase, clearance, tires, range, and driver experience all matter. AZAT can't promise every segment is passable by every ATV, UTV, motorcycle, Jeep, or pickup.",
      },
      {
        q: "What about 50-inch gates, can my Jeep or full-size vehicle get through?",
        a: "Gate width and vehicle restrictions vary by location and can change. Follow posted restrictions and current land-manager maps rather than assuming any vehicle fits every gate.",
      },
      {
        q: "What should I do when I encounter a gate?",
        a: "Leave gates as you find them unless a posted sign instructs you to close the gate. If a sign says \"Close the Gate,\" close and secure it after passing through. Never force, damage, bypass, or alter a locked or closed gate; turn around if access is not clearly permitted.",
      },
      {
        q: "Are motorcycles okay?",
        a: "Motorcycle suitability depends on the route, road status, rider skill, range, and legal access. Riders are responsible for confirming their vehicle class is allowed on each road they use.",
      },
      {
        q: "What vehicle equipment is required?",
        a: "Requirements depend on vehicle type, registration, location, and whether travel occurs on a road or trail. Consult the current Arizona MVD OHV guide and Arizona law for lights, brakes, horn, mirror, muffler, spark arrestor, plate display, seating, helmets, and other equipment. Carrying emergency equipment doesn't substitute for legally required equipment.",
      },
      {
        q: "What rules apply on National Forest roads?",
        a: "Motor vehicle use is governed by the applicable National Forest Motor Vehicle Use Map, posted signs, closures, and forest orders. Use only roads and trails open to your vehicle class and season of use.",
      },
      {
        q: "What rules apply on Arizona State Trust land?",
        a: "An OHV decal may authorize travel across State Trust land on existing roads and trails, but it does not authorize stopping, staging, parking, camping, or other recreation. Those activities require the appropriate Recreational Permit. Trust land is not the same as public land, and access is not guaranteed.",
      },
      {
        q: "Can I enter tribal or private land?",
        a: "Only with lawful authorization. Don't assume an AZAT line grants access to tribal or private property. Remain on the verified route, obey signs and gates, and obtain any required tribal permit or landowner permission before entering.",
      },
      {
        q: "Can I ride in a designated Wilderness area?",
        a: "Motorized and mechanized travel is generally prohibited in designated federal Wilderness. If the route appears to enter a prohibited area, turn around and report the conflict.",
      },
    ],
  },
  {
    id: "maps",
    label: "Maps & Navigation",
    title: "Maps, Downloads & Navigation",
    items: [
      {
        q: "Where do I get the current route?",
        a: "Use the official Downloads page immediately before your trip. Route files are updated, so avoid relying on old copies from friends, social media, or third-party sites.",
        link: { label: "Downloads", href: "/resources" },
      },
      {
        q: "Is the website map enough for navigation?",
        a: "No. The website map and printed overview map are planning aids only. Remote travel requires an offline-capable navigation device or app, the current route file, and a second navigation method. Cell service is unreliable in many parts of Eastern Arizona, so don't depend on a live web map or one phone.",
      },
      {
        q: "How do I import a GPX file?",
        a: "Install and test a GPX-compatible app or device before the trip. Download the current AZAT GPX file, import it according to your app or device instructions, confirm the track appears correctly, and save an offline copy.",
      },
      {
        q: "Do the GPX downloads include waypoints and points of interest?",
        a: "Yes, the official download package includes waypoints alongside the route tracks. Confirm your app is set to import both, since some apps only load one by default.",
      },
      {
        q: "Can I use a route file obtained from another website or friend?",
        a: "Treat third-party files as uncontrolled copies. Compare the version and date with the official AZAT download. Old files may contain obsolete routes, private-property conflicts, closures, or missing reroutes.",
      },
      {
        q: "What do segment names and codes mean?",
        a: "AZAT divides the developing network into named or coded segments between route junctions and communities. Each segment page identifies its endpoints, approximate distance, route status, surface, governing land managers, vehicle considerations, known services, and last verification date.",
      },
      {
        q: "Is a printed map available for sale?",
        a: "Check the Shop page for current print-map availability.",
        link: { label: "Shop", href: "/shop" },
      },
      {
        q: "What's the best app to use for navigation?",
        a: "AZAT doesn't endorse one single app. Any GPX-compatible offline navigation app or GPS device works as long as riders import the current official route file and download maps for offline use before losing service.",
      },
      {
        q: "Why isn't the AZAT on OnX?",
        a: "Third-party navigation platforms control their own data and update schedules. Use the official AZAT files as the source of truth. If you also use OnX, Trails Offroad, Google Maps, or another tool, compare it against the current AZAT download and field conditions.",
      },
      {
        q: "Are there road numbers or turn-by-turn directions?",
        a: "Some portions of the route use roads with Forest Service, county, or local road numbers, but riders shouldn't expect turn-by-turn signage everywhere.",
      },
      {
        q: "What if the route conflicts with a sign, gate, or closure?",
        a: "Always follow the sign, gate, closure, or lawful official direction over the digital line. Turn around safely, never bypass a closure, and report the conflict to AZAT through TrailWatch after reaching a safe location.",
      },
    ],
  },
  {
    id: "planning",
    label: "Planning Your Trip",
    title: "Planning Your Trip",
    items: [
      {
        q: "Where can I start?",
        a: "Begin in any community where you've confirmed lawful staging, parking, fuel, lodging, and access to the current route. Don't leave trucks or trailers on private property, at a business, or on State Trust land without permission or the required permit.",
      },
      {
        q: "What is Rusty 1000?",
        a: "AZAT's featured 11-day, hotel-based itinerary beginning and ending in Alpine. It uses the AZAT as a backbone while leaving room for fuel, food, photography, town stops, scenic overlooks, and side exploration beyond the core network mileage. Verify its route file, lodging, fuel, conditions, and seasonal access before departure.",
        link: { label: "Rusty 1000", href: "/rustys-route-1000" },
      },
      {
        q: "Can I ride the entire network as one trip?",
        a: "It can support multi-day travel, but there's no promise every preliminary segment will be simultaneously open or appropriate. Build the trip from current segments and conditions.",
      },
      {
        q: "How many days should I allow?",
        a: "There's no universal answer. Daily progress depends on route status, surface, weather, group size, vehicle type, fuel stops, photography, side trips, and mechanical delays. Build conservative days with at least one contingency option rather than planning only by mileage.",
      },
      {
        q: "How can I find a group to ride with?",
        a: "Check the AZAT Facebook group/page for other riders planning trips, and local OHV clubs in towns along the route. AZAT doesn't currently match individual riders into groups directly.",
      },
      {
        q: "How difficult is the AZAT?",
        a: "Difficulty varies by segment and can change rapidly after storms, snowmelt, traffic, erosion, maintenance, or wildfire. AZAT hasn't yet adopted a field-verified difficulty rating system, so don't infer difficulty from mileage or road classification alone.",
      },
      {
        q: "What is the best season, and when does the seasonal closure start?",
        a: "No single season is best everywhere. Higher country may have snow, ice, mud, or seasonal closures; lower areas can be dangerously hot; summer monsoons can bring lightning, flooding, and impassable roads. Closures and reopenings are set by each land manager based on conditions, so check current alerts before assuming a section is open.",
      },
      {
        q: "Can I camp along the route?",
        a: "Camping rules depend on the land manager and location. Some areas allow dispersed camping, others require developed sites or permits, and State Trust land has separate permit conditions. Never camp on private land, block a road, or assume a pullout is a legal campsite. Check current fire restrictions before your trip, since camping and campfires may be banned in specific areas during dry periods.",
      },
    ],
  },
  {
    id: "safety",
    label: "Safety & Prep",
    title: "Safety & Emergency Preparedness",
    items: [
      {
        q: "Should I ride alone?",
        a: "Remote solo travel is not recommended. Travel with another capable vehicle when possible. If riding alone, increase margins: carry satellite communication, leave a detailed trip plan, set check-in times, and be prepared to remain with the vehicle overnight.",
      },
      {
        q: "What should I carry?",
        a: "Equipment should match the route, season, people, and vehicle. At minimum, plan for delayed travel and an overnight emergency: water and food beyond the planned duration, a first-aid kit and required medications, offline navigation and backup communication, a repair kit and vehicle-specific spares, recovery equipment for the terrain, and a fire extinguisher, flashlight, and basic shelter.",
      },
      {
        q: "What should I do before departure?",
        a: "Inspect and service the vehicle; verify tire condition, fluids, brakes, lights, battery, belts, and fuel range. Test navigation and communication devices. Check every rider's protective equipment and review the route, regrouping plan, and emergency procedure.",
      },
      {
        q: "Can I rely on cellular service or trail repeaters?",
        a: "No. Coverage varies by carrier, terrain, and weather, and there's no guaranteed repeater coverage across the route. Carry an offline map and consider a satellite messenger or phone, and keep the device accessible rather than buried in the vehicle.",
      },
      {
        q: "How do I check current fire, weather, and road conditions?",
        a: "Check AZAT updates plus alerts from Tonto, Coconino, and Apache-Sitgreaves National Forests; Arizona State Land Department notices; AZ511 for state highways; local weather; and current fire restrictions. Recheck during multi-day trips.",
      },
      {
        q: "What should I do at a flooded crossing, snowdrift, washout, or other unsafe obstacle?",
        a: "Stop in a safe location, assess without entering the hazard, and turn around when safe passage is uncertain. Do not drive around barriers or create a new route.",
      },
      {
        q: "What should I do in an emergency?",
        a: "Call 911 when service is available, or use an emergency satellite function. Provide coordinates, number of people, injuries, vehicle description, route or segment, nearest known road or landmark, and remaining supplies. Stay with the vehicle unless remaining there creates greater danger.",
      },
    ],
  },
  {
    id: "services",
    label: "Fuel & Lodging",
    title: "Fuel, Lodging, Parking & Businesses",
    items: [
      {
        q: "Where can I get gas, food, lodging, or repairs?",
        a: "Verify fuel, food, lodging, and repair services directly with providers before you ride. Hours, seasonal operations, and availability can change quickly.",
      },
      {
        q: "What's the distance between gas stations and hotels along the route?",
        a: "Distances vary widely by segment and location. Plan fuel range conservatively between towns rather than assuming a fixed interval, and reserve scarce lodging first.",
      },
      {
        q: "Where can I park a truck and trailer?",
        a: "Use a designated staging area, or get explicit permission from a property owner, lodging provider, campground, or land manager. Confirm duration, security expectations, fees, and whether overnight parking is allowed.",
      },
      {
        q: "Are guided rides available?",
        a: "Check current AZAT resources and verify details directly with local businesses, clubs, and public agencies along the route.",
      },
      {
        q: "Are business listings and discounts guaranteed to be current?",
        a: "No. Businesses, hours, fuel availability, lodging policies, and any discounts can change without notice, so confirm directly with each business. AZAT shows a last-verified date where possible.",
      },
      {
        q: "How can a business be included, or how can I advertise with AZAT?",
        a: "Use the official AZAT contact channel to share accurate listing information, corrections, or sponsorship interest. AZAT publishes neutral listing criteria and clearly distinguishes paid sponsors from general visitor-service listings.",
      },
      {
        q: "Is AZAT merchandise (SWAG) available?",
        a: "Check the Shop page for current merchandise availability.",
        link: { label: "Shop", href: "/shop" },
      },
    ],
  },
  {
    id: "about",
    label: "Understanding AZAT",
    title: "Understanding the AZAT",
    items: [
      {
        q: "What is the Arizona Alpine Trail (AZAT)?",
        a: "A 704.5-mile loop of connected routes across Arizona's Rim Country and White Mountains, running roughly from Payson to Hannagan Meadow. It is designed primarily for responsible OHV travel while connecting towns and supporting rural tourism, using a mixture of forest roads, county roads, local streets, highways, and other existing routes. Important: the AZAT is a route network, not one continuously constructed trail. Individual roads and segments remain under the authority of their respective land managers and road agencies.",
      },
      {
        q: "Is the AZAT complete and officially designated?",
        a: "No single statement applies to every mile. AZAT publishes a developing alignment, but some portions remain preliminary or require additional coordination. A route shown by AZAT may use an existing legal road while the larger branded network is still under development. Riders must verify current access and obey posted closures, signs, gates, and agency orders.",
      },
      {
        q: "How long is the AZAT trail?",
        a: "The current official loop is 704.5 miles. It has 30 numbered trail legs but 28 unique segment files because Porter Mountain is used as segments 09 and 22, and Little Colorado River is used as segments 11 and 19. Future reroutes may change the total.",
      },
      {
        q: "What towns and communities are connected by the AZAT?",
        a: "Payson, Jake's Corner/Tonto Basin/Punkin Center, Young, Forest Lakes, Heber-Overgaard, Clay Springs, Linden, Snowflake, Taylor, Show Low, Pinetop-Lakeside, Greer, Springerville, Eagar, Nutrioso, Alpine, and Hannagan Meadow.",
      },
      {
        q: "Why are towns and communities part of the project?",
        a: "They give riders access to fuel, meals, lodging, repairs, supplies, and local information, while responsible visitor spending creates economic value for the rural communities the route connects.",
      },
      {
        q: "What trails or roads does the AZAT follow?",
        a: "A combination of US Forest roads and trails, county roads, and in-town roads and highways.",
      },
      {
        q: "Does my vehicle need to be street legal?",
        a: "Some portions use publicly maintained roads, paved and unpaved, which require street-legal registration. Verify your vehicle, registration, plate, insurance, and equipment with Arizona MVD and AZGFD before departure.",
      },
      {
        q: "Are there different trails between the towns?",
        a: "Yes. Since the AZAT is a contiguous loop, most towns are connected by more than one trail.",
      },
      {
        q: "Who manages the AZAT?",
        a: "Arizona Alpine Trail, Inc. is an Arizona nonprofit 501(c)(3) organization that develops, documents, maintains, and promotes the network in cooperation with communities, counties, agencies, land managers, volunteers, and other partners. AZAT does not replace the legal authority of those agencies or landowners.",
      },
      {
        q: "Who can use the AZAT?",
        a: "The trail is designed to be used primarily by off-highway vehicles (OHV). However, the trail can be used by hikers, bikers, and horses too.",
      },
      {
        q: "How do I register, and does it cost anything?",
        a: "Registration is free. A registered account lets you log in to download current maps and GPX/KML/shapefile route tracks, see off-branching trails to points of interest, and check trail status before you ride.",
      },
    ],
  },
  {
    id: "trailwatch",
    label: "TrailWatch",
    title: "TrailWatch & Responsible Riding",
    items: [
      {
        q: "What is TrailWatch?",
        a: "AZAT's non-confrontational process for sharing timely route-condition and stewardship observations with AZAT, land managers, and community partners, so small problems get caught before they threaten safety, resources, or continued access.",
      },
      {
        q: "What should I report?",
        a: "Erosion, washouts, downed trees, blocked routes, damaged or missing signs, trash, unsafe physical conditions, apparent route-file conflicts, vandalism, and conditions that may require agency review.",
      },
      {
        q: "What makes a report useful?",
        a: "From a safe location, provide the date and time, GPS coordinates, AZAT segment if known, direction of travel, a concise description, and photos showing the condition and surrounding context. State whether the route is passable and by what general vehicle type, without encouraging others to attempt a hazard.",
      },
      {
        q: "Should I confront another rider or investigate myself?",
        a: "No. TrailWatch is observe, record, and report. Don't confront people, enter unsafe areas, trespass, move official barriers, photograph private information unnecessarily, or delay an emergency call.",
      },
      {
        q: "How do I report a problem?",
        a: "Report trail conditions, signage problems, route conflicts, damage, or maintenance concerns to AZAT through TrailWatch when you are safely able to do so. Include photos, GPS coordinates or an OnX/Google/Apple Maps location, the trail segment or Forest Road number if known, the date and time observed, and a brief description.\n\nFor OHV habitat damage, vandalism, illegal dumping, or resource violations, call the Arizona Game and Fish Department OHV reporting line at 1-800-VANDALS. Rusty flagged this as the key 24/7 number for most OHV habitat vandalism issues.\n\nTrailWatch is not an emergency service. For medical emergencies, active wildfires, crimes in progress, serious accidents, or immediate threats to life, call 911 first.",
      },
      {
        q: "What does responsible travel mean on the AZAT?",
        a: "Stay on routes open to your vehicle, travel at a safe and considerate speed, reduce dust and noise near homes and other users, and pack out waste. Leave gates as you find them unless a posted sign instructs you to close the gate; if it does, close and secure it after passing through. Avoid wet or sensitive routes, respect wildlife and livestock, and support local communities without disrupting them.",
      },
      {
        q: "Is TrailWatch an emergency service?",
        a: "No. It does not dispatch law enforcement, fire, medical, search-and-rescue, or recovery resources. Call 911 or use your emergency satellite function for emergencies.",
      },
    ],
  },
  {
    id: "help",
    label: "Help & Contact",
    title: "How to Help & Contact AZAT",
    items: [
      {
        q: "How can I help AZAT?",
        a: "Use the network responsibly, submit useful TrailWatch observations, volunteer for approved projects, support participating communities, share corrections, and join or donate when those programs are available.",
      },
      {
        q: "How do I contact AZAT?",
        a: "Reach the team through the contact page, or by email. Don't use general AZAT contact channels for emergencies.",
        link: { label: "Contact AZAT", href: "/contact" },
      },
    ],
  },
];

export const officialResources: FaqLink[] = [
  { label: "Arizona Game and Fish: OHV decals", href: "https://www.azgfd.com/off-highway-vehicle/ohv-register-and-renew-your-license/ohv-decals/", external: true },
  { label: "Arizona Game and Fish: OHV education", href: "https://www.azgfd.com/education/off-highway-vehicle-education/", external: true },
  { label: "Arizona DOT: OHV information", href: "https://azdot.gov/mvd/services/vehicle-services/vehicle-registration/ohv-and-boating-registration", external: true },
  { label: "Arizona State Land Dept: recreational permits & OHV FAQ", href: "https://land.az.gov/faqs", external: true },
  { label: "Arizona State Land Dept: permit terms", href: "https://land.az.gov/recreational-permits-terms-and-conditions", external: true },
  { label: "US Forest Service: Motor Vehicle Use Maps", href: "https://www.fs.usda.gov/visit/maps", external: true },
  { label: "Tonto National Forest: alerts", href: "https://www.fs.usda.gov/r03/tonto/alerts", external: true },
  { label: "Coconino National Forest: alerts", href: "https://www.fs.usda.gov/r03/coconino/alerts", external: true },
  { label: "Apache-Sitgreaves National Forests: alerts", href: "https://www.fs.usda.gov/r03/asnf/alerts", external: true },
  { label: "Arizona 511: highway conditions & closures", href: "https://az511.gov/", external: true },
];

export const emergencyProcedure: string =
  faqCategories.find((category) => category.id === "safety")?.items.find((item) => item.q === "What should I do in an emergency?")?.a ?? "";

export const legalDisclaimer: string =
  "The operator is responsible for confirming legal requirements. AZAT can't determine every rider's registration, residency, insurance, or permit obligations. This FAQ is educational, not legal advice; agency rules, statutes, and law-enforcement direction control.";
