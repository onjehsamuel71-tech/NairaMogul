import type { AssetDef, Industry, City, RandomEvent, Badge, LifestyleDef, LifestyleCategory, MogulTitle } from "@/types/game";

export const MOGUL_TITLES: Record<MogulTitle, { label: string; short: string; emoji: string; greeting: string }> = {
  chief: { label: "Chief / CEO", short: "Chief", emoji: "👑", greeting: "Chief" },
  chairwoman: { label: "Chairwoman / CEO", short: "Chairwoman", emoji: "👸", greeting: "Chairwoman" },
  mogul: { label: "Mogul", short: "Mogul", emoji: "💎", greeting: "Mogul" },
};

export const INDUSTRIES: Record<Industry, { name: string; tagline: string; bonus: string; revenueMult: number; emoji: string }> = {
  transport: { name: "Transport Empire", tagline: "Danfo, Keke & Interstate Logistics", bonus: "+15% speed on fleet returns", revenueMult: 1.15, emoji: "🚐" },
  buka: { name: "Buka & Street Food Chain", tagline: "Amala, Suya & Express Kitchens", bonus: "+15% profit margins during events", revenueMult: 1.15, emoji: "🍲" },
  pos: { name: "POS & Financial Network", tagline: "Agent Banking & Cash Float Hubs", bonus: "+15% passive daily interest", revenueMult: 1.15, emoji: "💳" },
  realestate: { name: "Real Estate & Property", tagline: "Kiosks, Malls & Short-Let Apartments", bonus: "+15% rental yield stability", revenueMult: 1.15, emoji: "🏢" },
  entertainment: { name: "Entertainment & Events", tagline: "Studios, Labels & Event Centers", bonus: "+15% festive season spikes", revenueMult: 1.15, emoji: "🎵" },
  agro: { name: "Agro-Tech & Commodities", tagline: "Farms, Plantations & Grain Logistics", bonus: "+15% long-term passive yield", revenueMult: 1.15, emoji: "🚜" },
  streetfood: { name: "Street Food & Local Snacks", tagline: "Suya, Masa & Cold Room Depots", bonus: "+15% morning & evening rush spikes", revenueMult: 1.15, emoji: "🍢" },
  retail: { name: "Retail & Neighborhood Trade", tagline: "Provision Stores, LPG & Supermarkets", bonus: "+15% steady low-risk daily returns", revenueMult: 1.15, emoji: "🏪" },
  fashion: { name: "Fashion, Tailoring & Beauty", tagline: "Aso-Ebi, Salons & Wig Boutiques", bonus: "+15% weekend party cash spikes", revenueMult: 1.15, emoji: "✂️" },
  services: { name: "Education, Tech & Services", tagline: "Cybercafés, Tutorials & Dispatch", bonus: "+15% subscription & repeat income", revenueMult: 1.15, emoji: "💻" },
  akara: { name: "Akara & Morning Snacks", tagline: "Akara, Pap, Moi Moi & Kuli Kuli", bonus: "+20% early-morning rush income", revenueMult: 1.2, emoji: "🥣" },
  music: { name: "Music & Afrobeats Empire", tagline: "Studios, Labels & Streaming Royalties", bonus: "+20% viral hit revenue spikes", revenueMult: 1.2, emoji: "🎧" },
  gadgets: { name: "Computer Village & Gadgets", tagline: "Phones, Laptops & Accessories", bonus: "+20% high-margin tech resale", revenueMult: 1.2, emoji: "📱" },
  logistics: { name: "Logistics & Courier Network", tagline: "Dispatch Riders, Warehouses & Freight", bonus: "+20% interstate delivery income", revenueMult: 1.2, emoji: "📦" },
  beauty: { name: "Beauty, Spa & Cosmetics", tagline: "Salons, Spas & Skincare Lines", bonus: "+20% weekend & festive bookings", revenueMult: 1.2, emoji: "💅" },
  pharmacy: { name: "Pharmacy & Health Stores", tagline: "Chemists, Diagnostics & Wellness", bonus: "+20% steady essential demand", revenueMult: 1.2, emoji: "💊" },
  crypto: { name: "Crypto & Digital Assets", tagline: "Exchanges, Wallets & Trading Desks", bonus: "+20% volatile high-yield swings", revenueMult: 1.2, emoji: "🪙" },
  media: { name: "Media, Blog & Content", tagline: "Blogs, Podcasts & YouTube Channels", bonus: "+20% ad & sponsorship income", revenueMult: 1.2, emoji: "📺" },
  laundry: { name: "Laundry & Dry Cleaning", tagline: "Wash, Iron & Express Pickup", bonus: "+20% recurring subscription income", revenueMult: 1.2, emoji: "🧺" },
  carwash: { name: "Car Wash & Auto Detailing", tagline: "Wash Bays, Detailing & Tinting", bonus: "+20% weekend car wash surge", revenueMult: 1.2, emoji: "🚿" },
  bakery: { name: "Bakery & Confectionery", tagline: "Bread, Cakes & Pastries", bonus: "+20% festive cake order spikes", revenueMult: 1.2, emoji: "🍞" },
  fitness: { name: "Fitness & Gym Empire", tagline: "Gyms, Yoga & Personal Training", bonus: "+20% membership retention income", revenueMult: 1.2, emoji: "🏋️" },
  education: { name: "Schools & EdTech", tagline: "Private Schools, CBT & Online Courses", bonus: "+20% termly fee income", revenueMult: 1.2, emoji: "🎓" },
  printing: { name: "Printing & Branding", tagline: "Banners, T-Shirts & Signage", bonus: "+20% campaign season spikes", revenueMult: 1.2, emoji: "🖨️" },
  water: { name: "Water & Beverage Factory", tagline: "Sachet Water, Bottling & Distribution", bonus: "+20% dry season demand spikes", revenueMult: 1.2, emoji: "💧" },
  solar: { name: "Solar & Renewable Energy", tagline: "Panels, Inverters & Installation", bonus: "+20% blackout-driven demand", revenueMult: 1.2, emoji: "☀️" },
  bar: { name: "Bar, Lounge & Nightlife", tagline: "Beer Parlours, Lounges & Clubs", bonus: "+20% weekend nightlife spikes", revenueMult: 1.2, emoji: "🍻" },
  hotel: { name: "Hotels & Hospitality", tagline: "Hotels, Short-Lets & Guest Houses", bonus: "+20% occupancy rate income", revenueMult: 1.2, emoji: "🏨" },
  travel: { name: "Travel & Tourism Agency", tagline: "Visa, Ticketing & Tour Packages", bonus: "+20% peak-season travel income", revenueMult: 1.2, emoji: "✈️" },
  auto: { name: "Auto Repair & Spare Parts", tagline: "Mechanics, Spares & Panel Beating", bonus: "+20% steady repair demand", revenueMult: 1.2, emoji: "🔧" },
};

export interface CityDef {
  id: City;
  areas: string[];
  emoji: string;
  tier: 1 | 2 | 3 | 4;
  netWorthRequired: number;
  unlockCost: number;
}

export const CITIES: CityDef[] = [
  { id: "Ibadan", areas: ["Bodija", "Dugbe", "Ring Road"], emoji: "🏘️", tier: 1, netWorthRequired: 100000, unlockCost: 0 },
  { id: "Benin City", areas: ["Ring Road", "Ugbowo", "Sapele Road"], emoji: "🏘️", tier: 1, netWorthRequired: 100000, unlockCost: 0 },
  { id: "Enugu", areas: ["Independence Layout", "GRA", "New Haven"], emoji: "🏘️", tier: 1, netWorthRequired: 100000, unlockCost: 0 },
  { id: "Port Harcourt", areas: ["GRA", "Garrison", "Trans-Amadi"], emoji: "🛢️", tier: 2, netWorthRequired: 10000000, unlockCost: 3000000 },
  { id: "Kano", areas: ["Sabon Gari", "Fagge", "Nassarawa"], emoji: "🐪", tier: 2, netWorthRequired: 10000000, unlockCost: 3000000 },
  { id: "Aba", areas: ["Ariaria", "Ogbor Hill", "Factory Road"], emoji: "🏭", tier: 2, netWorthRequired: 10000000, unlockCost: 3000000 },
  { id: "Abuja", areas: ["Wuse 2", "Maitama", "Garki"], emoji: "🏛️", tier: 3, netWorthRequired: 50000000, unlockCost: 15000000 },
  { id: "Lagos", areas: ["Victoria Island", "Ikoyi", "Lekki"], emoji: "🌆", tier: 4, netWorthRequired: 200000000, unlockCost: 50000000 },
];

export const TIER_LABELS: Record<number, string> = {
  1: "Starting Hub",
  2: "Regional Powerhouse",
  3: "National Capital",
  4: "Economic Megacity",
};

export const ASSET_CATALOG: AssetDef[] = [
  // Transport
  { id: "keke", name: "Keke Napep", industry: "transport", cost: 500000, baseRevenue: 45000, baseMaintenance: 12000, tier: 1, emoji: "🛺" },
  { id: "danfo", name: "Rusty Danfo", industry: "transport", cost: 2000000, baseRevenue: 180000, baseMaintenance: 55000, tier: 2, emoji: "🚌" },
  { id: "coaster", name: "Modern Coaster Bus", industry: "transport", cost: 15000000, baseRevenue: 1200000, baseMaintenance: 380000, tier: 3, emoji: "🚍" },
  { id: "interstate", name: "Interstate Luxury Bus", industry: "transport", cost: 60000000, baseRevenue: 5200000, baseMaintenance: 1600000, tier: 4, emoji: "🚎" },
  { id: "truck", name: "Delivery Logistics Truck", industry: "transport", cost: 150000000, baseRevenue: 14000000, baseMaintenance: 4200000, tier: 5, emoji: "🚚" },
  // Buka
  { id: "suya", name: "Street Suya Kiosk", industry: "buka", cost: 300000, baseRevenue: 32000, baseMaintenance: 9000, tier: 1, emoji: "🍢" },
  { id: "amala", name: "Roadside Amala Buka", industry: "buka", cost: 1500000, baseRevenue: 150000, baseMaintenance: 48000, tier: 2, emoji: "🍛" },
  { id: "fastfood", name: "Express Fast-Food Joint", industry: "buka", cost: 10000000, baseRevenue: 950000, baseMaintenance: 310000, tier: 3, emoji: "🍔" },
  { id: "finedine", name: "Fine Dining Restaurant", industry: "buka", cost: 45000000, baseRevenue: 4200000, baseMaintenance: 1400000, tier: 4, emoji: "🍽️" },
  { id: "catering", name: "Catering Franchise", industry: "buka", cost: 200000000, baseRevenue: 18500000, baseMaintenance: 5800000, tier: 5, emoji: "🥘" },
  // POS
  { id: "kioskpos", name: "Single Kiosk POS", industry: "pos", cost: 150000, baseRevenue: 18000, baseMaintenance: 5000, tier: 1, emoji: "🏪" },
  { id: "container", name: "Container Hub", industry: "pos", cost: 800000, baseRevenue: 95000, baseMaintenance: 28000, tier: 2, emoji: "📦" },
  { id: "multiterm", name: "Market Multi-Terminal", industry: "pos", cost: 5000000, baseRevenue: 520000, baseMaintenance: 165000, tier: 3, emoji: "🖥️" },
  { id: "district", name: "District Financial Center", industry: "pos", cost: 30000000, baseRevenue: 3100000, baseMaintenance: 980000, tier: 4, emoji: "🏦" },
  // Real Estate
  { id: "cornershop", name: "Corner Shop / Kiosk Hub", industry: "realestate", cost: 400000, baseRevenue: 28000, baseMaintenance: 0, tier: 1, emoji: "🏬" },
  { id: "complex", name: "Shopping Complex Unit", industry: "realestate", cost: 4000000, baseRevenue: 320000, baseMaintenance: 45000, tier: 2, emoji: "🏢" },
  { id: "shortlet", name: "Short-Let Luxury Apartment", industry: "realestate", cost: 25000000, baseRevenue: 2400000, baseMaintenance: 620000, tier: 3, emoji: "🏙️" },
  { id: "estate", name: "Gated Estate Development", industry: "realestate", cost: 120000000, baseRevenue: 11000000, baseMaintenance: 2400000, tier: 4, emoji: "🏘️" },
  // Entertainment
  { id: "studio", name: "Local Sound Studio", industry: "entertainment", cost: 600000, baseRevenue: 55000, baseMaintenance: 18000, tier: 1, emoji: "🎙️" },
  { id: "label", name: "Record Label & Talent Agency", industry: "entertainment", cost: 8000000, baseRevenue: 780000, baseMaintenance: 260000, tier: 2, emoji: "🎶" },
  { id: "nightclub", name: "Event Center / V.I. Nightclub", industry: "entertainment", cost: 35000000, baseRevenue: 3600000, baseMaintenance: 1400000, tier: 3, emoji: "🪩" },
  { id: "stadium", name: "Concert Arena & Stadium", industry: "entertainment", cost: 180000000, baseRevenue: 17000000, baseMaintenance: 5200000, tier: 4, emoji: "🎤" },
  // Agro
  { id: "poultry", name: "Poultry & Livestock Farm", industry: "agro", cost: 700000, baseRevenue: 62000, baseMaintenance: 22000, tier: 1, emoji: "🐓" },
  { id: "plantation", name: "Cocoa & Oil Palm Plantation", industry: "agro", cost: 12000000, baseRevenue: 1050000, baseMaintenance: 180000, tier: 2, emoji: "🌴" },
  { id: "grain", name: "Interstate Grain Logistics", industry: "agro", cost: 40000000, baseRevenue: 4100000, baseMaintenance: 1250000, tier: 3, emoji: "🌾" },
  { id: "agrohub", name: "National Agro Processing Hub", industry: "agro", cost: 200000000, baseRevenue: 19000000, baseMaintenance: 5600000, tier: 4, emoji: "🏗️" },
  // Street Food
  { id: "akara_spot", name: "Akara & Pap Spot", industry: "streetfood", cost: 200000, baseRevenue: 22000, baseMaintenance: 6000, tier: 1, emoji: "🥣" },
  { id: "suya_masa", name: "Roadside Suya & Masa Joint", industry: "streetfood", cost: 900000, baseRevenue: 110000, baseMaintenance: 34000, tier: 2, emoji: "🍖" },
  { id: "coldroom", name: "Frozen Food & Cold Room Depot", industry: "streetfood", cost: 6000000, baseRevenue: 620000, baseMaintenance: 210000, tier: 3, emoji: "🧊" },
  { id: "foodhub", name: "Regional Snack Distribution Hub", industry: "streetfood", cost: 35000000, baseRevenue: 3400000, baseMaintenance: 980000, tier: 4, emoji: "🚛" },
  // Retail
  { id: "provision", name: "Corner Shop / Provision Store", industry: "retail", cost: 350000, baseRevenue: 26000, baseMaintenance: 7000, tier: 1, emoji: "🛒" },
  { id: "lpg", name: "Gas Refill & LPG Plant", industry: "retail", cost: 5000000, baseRevenue: 480000, baseMaintenance: 180000, tier: 2, emoji: "🔥" },
  { id: "supermarket", name: "Neighborhood Supermarket", industry: "retail", cost: 18000000, baseRevenue: 1750000, baseMaintenance: 560000, tier: 3, emoji: "🏪" },
  { id: "megastore", name: "National Retail Megastore", industry: "retail", cost: 90000000, baseRevenue: 8500000, baseMaintenance: 2400000, tier: 4, emoji: "🏬" },
  // Fashion
  { id: "tailor", name: "Local Tailoring & Make-Ready Shop", industry: "fashion", cost: 250000, baseRevenue: 24000, baseMaintenance: 6500, tier: 1, emoji: "🧵" },
  { id: "salon", name: "Barbershop & Unisex Salon", industry: "fashion", cost: 1200000, baseRevenue: 105000, baseMaintenance: 32000, tier: 2, emoji: "💈" },
  { id: "wig", name: "Wig & Hair Extension Boutique", industry: "fashion", cost: 9000000, baseRevenue: 880000, baseMaintenance: 260000, tier: 3, emoji: "💇" },
  { id: "fashionhouse", name: "Luxury Fashion House & Aso-Ebi Empire", industry: "fashion", cost: 55000000, baseRevenue: 5300000, baseMaintenance: 1500000, tier: 4, emoji: "👗" },
  // Services
  { id: "cyber", name: "NIMC / CBT Registration & Cybercafé", industry: "services", cost: 400000, baseRevenue: 38000, baseMaintenance: 11000, tier: 1, emoji: "🖨️" },
  { id: "tutorial", name: "Tutorial Center / After-School Coaching", industry: "services", cost: 2000000, baseRevenue: 175000, baseMaintenance: 42000, tier: 2, emoji: "📚" },
  { id: "dispatch", name: "Dispatch & Bike Delivery Service", industry: "services", cost: 7000000, baseRevenue: 680000, baseMaintenance: 220000, tier: 3, emoji: "🏍️" },
  { id: "techpark", name: "National Tech & Training Campus", industry: "services", cost: 45000000, baseRevenue: 4300000, baseMaintenance: 1300000, tier: 4, emoji: "🎓" },
  // Akara & Morning Snacks
  { id: "akara_stand", name: "Mama's Akara Stand", industry: "akara", cost: 150000, baseRevenue: 18000, baseMaintenance: 4500, tier: 1, emoji: "🥣" },
  { id: "akara_kiosk", name: "Akara & Pap Kiosk", industry: "akara", cost: 600000, baseRevenue: 72000, baseMaintenance: 20000, tier: 2, emoji: "🍲" },
  { id: "moimoi_factory", name: "Moi Moi & Kuli Kuli Factory", industry: "akara", cost: 3500000, baseRevenue: 380000, baseMaintenance: 120000, tier: 3, emoji: "🏭" },
  { id: "akara_chain", name: "Morning Snacks Chain", industry: "akara", cost: 18000000, baseRevenue: 1750000, baseMaintenance: 520000, tier: 4, emoji: "🌅" },
  { id: "akara_empire", name: "National Breakfast Empire", industry: "akara", cost: 85000000, baseRevenue: 8200000, baseMaintenance: 2300000, tier: 5, emoji: "👑" },
  // Music & Afrobeats
  { id: "bedroom_studio", name: "Bedroom Home Studio", industry: "music", cost: 400000, baseRevenue: 40000, baseMaintenance: 12000, tier: 1, emoji: "🎹" },
  { id: "pro_studio", name: "Professional Recording Studio", industry: "music", cost: 5000000, baseRevenue: 520000, baseMaintenance: 180000, tier: 2, emoji: "🎚️" },
  { id: "indie_label", name: "Independent Afrobeats Label", industry: "music", cost: 25000000, baseRevenue: 2600000, baseMaintenance: 850000, tier: 3, emoji: "🎤" },
  { id: "major_label", name: "Major Music Label & Publishing", industry: "music", cost: 120000000, baseRevenue: 12500000, baseMaintenance: 3800000, tier: 4, emoji: "💿" },
  { id: "global_empire", name: "Global Afrobeats Empire", industry: "music", cost: 500000000, baseRevenue: 52000000, baseMaintenance: 14000000, tier: 5, emoji: "🌍" },
  // Computer Village & Gadgets
  { id: "phone_repair", name: "Phone Repair Kiosk", industry: "gadgets", cost: 300000, baseRevenue: 32000, baseMaintenance: 9000, tier: 1, emoji: "🔧" },
  { id: "gadget_shop", name: "Gadget & Accessories Shop", industry: "gadgets", cost: 2500000, baseRevenue: 240000, baseMaintenance: 75000, tier: 2, emoji: "📱" },
  { id: "laptop_store", name: "Laptop & Computer Store", industry: "gadgets", cost: 12000000, baseRevenue: 1150000, baseMaintenance: 380000, tier: 3, emoji: "💻" },
  { id: "tech_mall", name: "Tech Mall & Distribution Hub", industry: "gadgets", cost: 65000000, baseRevenue: 6200000, baseMaintenance: 1900000, tier: 4, emoji: "🏬" },
  { id: "tech_import", name: "National Tech Import Empire", industry: "gadgets", cost: 250000000, baseRevenue: 24000000, baseMaintenance: 7200000, tier: 5, emoji: "🚢" },
  // Logistics
  { id: "bike_courier", name: "Bike Courier Service", industry: "logistics", cost: 350000, baseRevenue: 38000, baseMaintenance: 11000, tier: 1, emoji: "🏍️" },
  { id: "van_delivery", name: "Van Delivery Fleet", industry: "logistics", cost: 3000000, baseRevenue: 290000, baseMaintenance: 95000, tier: 2, emoji: "🚐" },
  { id: "warehouse", name: "Regional Warehouse", industry: "logistics", cost: 18000000, baseRevenue: 1750000, baseMaintenance: 580000, tier: 3, emoji: "🏭" },
  { id: "freight_hub", name: "National Freight Hub", industry: "logistics", cost: 90000000, baseRevenue: 8800000, baseMaintenance: 2600000, tier: 4, emoji: "🚛" },
  { id: "global_logistics", name: "Continental Logistics Network", industry: "logistics", cost: 400000000, baseRevenue: 39000000, baseMaintenance: 11000000, tier: 5, emoji: "🌐" },
  // Beauty
  { id: "nail_bar", name: "Nail Bar & Beauty Corner", industry: "beauty", cost: 400000, baseRevenue: 42000, baseMaintenance: 13000, tier: 1, emoji: "💅" },
  { id: "spa", name: "Day Spa & Wellness Center", industry: "beauty", cost: 4500000, baseRevenue: 460000, baseMaintenance: 160000, tier: 2, emoji: "🧖" },
  { id: "cosmetics_line", name: "Cosmetics & Skincare Line", industry: "beauty", cost: 22000000, baseRevenue: 2200000, baseMaintenance: 720000, tier: 3, emoji: "💄" },
  { id: "beauty_empire", name: "National Beauty Empire", industry: "beauty", cost: 110000000, baseRevenue: 10800000, baseMaintenance: 3200000, tier: 4, emoji: "👑" },
  // Pharmacy
  { id: "chemist", name: "Neighborhood Chemist", industry: "pharmacy", cost: 500000, baseRevenue: 52000, baseMaintenance: 16000, tier: 1, emoji: "💊" },
  { id: "pharmacy_store", name: "Full Pharmacy & Wellness Store", industry: "pharmacy", cost: 5000000, baseRevenue: 510000, baseMaintenance: 180000, tier: 2, emoji: "🏥" },
  { id: "diagnostics", name: "Diagnostics & Lab Center", industry: "pharmacy", cost: 25000000, baseRevenue: 2500000, baseMaintenance: 820000, tier: 3, emoji: "🔬" },
  { id: "hospital", name: "Private Specialist Hospital", industry: "pharmacy", cost: 150000000, baseRevenue: 14800000, baseMaintenance: 4600000, tier: 4, emoji: "🏨" },
  // Crypto
  { id: "crypto_wallet", name: "Crypto Wallet App", industry: "crypto", cost: 800000, baseRevenue: 85000, baseMaintenance: 28000, tier: 1, emoji: "👛" },
  { id: "trading_desk", name: "P2P Trading Desk", industry: "crypto", cost: 6000000, baseRevenue: 640000, baseMaintenance: 220000, tier: 2, emoji: "📊" },
  { id: "exchange", name: "Licensed Crypto Exchange", industry: "crypto", cost: 40000000, baseRevenue: 4200000, baseMaintenance: 1400000, tier: 3, emoji: "🏦" },
  { id: "defi_protocol", name: "DeFi Protocol & Staking Pool", industry: "crypto", cost: 180000000, baseRevenue: 19000000, baseMaintenance: 5800000, tier: 4, emoji: "⛓️" },
  // Media
  { id: "blog", name: "Niche Blog & Newsletter", industry: "media", cost: 200000, baseRevenue: 22000, baseMaintenance: 6000, tier: 1, emoji: "📝" },
  { id: "podcast", name: "Popular Podcast Network", industry: "media", cost: 2500000, baseRevenue: 260000, baseMaintenance: 82000, tier: 2, emoji: "🎙️" },
  { id: "youtube_channel", name: "YouTube Channel & Content Studio", industry: "media", cost: 12000000, baseRevenue: 1250000, baseMaintenance: 400000, tier: 3, emoji: "📺" },
  { id: "media_house", name: "National Media House", industry: "media", cost: 80000000, baseRevenue: 8200000, baseMaintenance: 2400000, tier: 4, emoji: "📡" },
  // Laundry
  { id: "laundry_shop", name: "Neighborhood Laundry Shop", industry: "laundry", cost: 350000, baseRevenue: 36000, baseMaintenance: 11000, tier: 1, emoji: "🧺" },
  { id: "dry_cleaner", name: "Dry Cleaning & Express Pickup", industry: "laundry", cost: 3000000, baseRevenue: 310000, baseMaintenance: 105000, tier: 2, emoji: "👔" },
  { id: "laundry_chain", name: "City-Wide Laundry Chain", industry: "laundry", cost: 18000000, baseRevenue: 1850000, baseMaintenance: 600000, tier: 3, emoji: "🏢" },
  { id: "laundry_empire", name: "National Laundry Franchise", industry: "laundry", cost: 90000000, baseRevenue: 9200000, baseMaintenance: 2800000, tier: 4, emoji: "👑" },
  // Car Wash
  { id: "wash_bay", name: "Single Car Wash Bay", industry: "carwash", cost: 400000, baseRevenue: 42000, baseMaintenance: 13000, tier: 1, emoji: "🚿" },
  { id: "detailing_center", name: "Auto Detailing Center", industry: "carwash", cost: 4000000, baseRevenue: 420000, baseMaintenance: 145000, tier: 2, emoji: "✨" },
  { id: "tint_shop", name: "Tinting & Customization Shop", industry: "carwash", cost: 15000000, baseRevenue: 1550000, baseMaintenance: 520000, tier: 3, emoji: "🎨" },
  { id: "auto_spa", name: "Luxury Auto Spa & Club", industry: "carwash", cost: 70000000, baseRevenue: 7200000, baseMaintenance: 2200000, tier: 4, emoji: "🏎️" },
  // Bakery
  { id: "bread_stand", name: "Bread Stand & Pastries", industry: "bakery", cost: 300000, baseRevenue: 32000, baseMaintenance: 9500, tier: 1, emoji: "🍞" },
  { id: "bakery_shop", name: "Neighborhood Bakery", industry: "bakery", cost: 2500000, baseRevenue: 260000, baseMaintenance: 85000, tier: 2, emoji: "🥐" },
  { id: "cake_studio", name: "Cake & Confectionery Studio", industry: "bakery", cost: 10000000, baseRevenue: 1050000, baseMaintenance: 350000, tier: 3, emoji: "🎂" },
  { id: "bakery_chain", name: "National Bakery Chain", industry: "bakery", cost: 60000000, baseRevenue: 6200000, baseMaintenance: 1900000, tier: 4, emoji: "🥖" },
  // Fitness
  { id: "home_gym", name: "Home Gym & Personal Training", industry: "fitness", cost: 500000, baseRevenue: 52000, baseMaintenance: 16000, tier: 1, emoji: "🏋️" },
  { id: "local_gym", name: "Local Neighborhood Gym", industry: "fitness", cost: 5000000, baseRevenue: 520000, baseMaintenance: 180000, tier: 2, emoji: "💪" },
  { id: "fitness_studio", name: "Premium Fitness Studio", industry: "fitness", cost: 25000000, baseRevenue: 2600000, baseMaintenance: 850000, tier: 3, emoji: "🧘" },
  { id: "fitness_chain", name: "National Fitness Chain", industry: "fitness", cost: 120000000, baseRevenue: 12500000, baseMaintenance: 3800000, tier: 4, emoji: "🏆" },
  // Education
  { id: "home_lessons", name: "Home Lessons & Tutoring", industry: "education", cost: 250000, baseRevenue: 26000, baseMaintenance: 7000, tier: 1, emoji: "📖" },
  { id: "private_school", name: "Private Nursery & Primary School", industry: "education", cost: 8000000, baseRevenue: 820000, baseMaintenance: 280000, tier: 2, emoji: "🏫" },
  { id: "secondary_school", name: "Secondary School & Boarding", industry: "education", cost: 40000000, baseRevenue: 4200000, baseMaintenance: 1400000, tier: 3, emoji: "🎒" },
  { id: "edtech_platform", name: "EdTech Platform & Online Courses", industry: "education", cost: 150000000, baseRevenue: 15500000, baseMaintenance: 4600000, tier: 4, emoji: "💻" },
  // Printing
  { id: "print_shop", name: "Small Print & Photocopy Shop", industry: "printing", cost: 350000, baseRevenue: 36000, baseMaintenance: 11000, tier: 1, emoji: "🖨️" },
  { id: "banner_shop", name: "Banner & Signage Shop", industry: "printing", cost: 2500000, baseRevenue: 260000, baseMaintenance: 85000, tier: 2, emoji: "🎨" },
  { id: "tshirt_printing", name: "T-Shirt & Merch Printing", industry: "printing", cost: 8000000, baseRevenue: 820000, baseMaintenance: 280000, tier: 3, emoji: "👕" },
  { id: "print_empire", name: "National Printing & Branding Empire", industry: "printing", cost: 50000000, baseRevenue: 5200000, baseMaintenance: 1600000, tier: 4, emoji: "🏭" },
  // Water
  { id: "sachet_water", name: "Sachet Water Factory", industry: "water", cost: 600000, baseRevenue: 62000, baseMaintenance: 20000, tier: 1, emoji: "💧" },
  { id: "bottling_plant", name: "Bottling Plant", industry: "water", cost: 8000000, baseRevenue: 820000, baseMaintenance: 280000, tier: 2, emoji: "🍶" },
  { id: "beverage_factory", name: "Beverage & Juice Factory", industry: "water", cost: 35000000, baseRevenue: 3600000, baseMaintenance: 1200000, tier: 3, emoji: "🥤" },
  { id: "water_empire", name: "National Water & Beverage Empire", industry: "water", cost: 180000000, baseRevenue: 18500000, baseMaintenance: 5600000, tier: 4, emoji: "🌊" },
  // Solar
  { id: "solar_install", name: "Solar Panel Installation Crew", industry: "solar", cost: 700000, baseRevenue: 72000, baseMaintenance: 22000, tier: 1, emoji: "☀️" },
  { id: "inverter_shop", name: "Inverter & Battery Shop", industry: "solar", cost: 4000000, baseRevenue: 420000, baseMaintenance: 145000, tier: 2, emoji: "🔋" },
  { id: "solar_farm", name: "Mini Solar Farm", industry: "solar", cost: 30000000, baseRevenue: 3100000, baseMaintenance: 1050000, tier: 3, emoji: "⚡" },
  { id: "renewable_empire", name: "National Renewable Energy Empire", industry: "solar", cost: 200000000, baseRevenue: 20500000, baseMaintenance: 6200000, tier: 4, emoji: "🌞" },
  // Bar
  { id: "beer_parlour", name: "Local Beer Parlour", industry: "bar", cost: 400000, baseRevenue: 42000, baseMaintenance: 13000, tier: 1, emoji: "🍺" },
  { id: "lounge", name: "Upscale Lounge & Bar", industry: "bar", cost: 8000000, baseRevenue: 820000, baseMaintenance: 280000, tier: 2, emoji: "🍸" },
  { id: "nightclub_vi", name: "V.I. Nightclub & VIP Club", industry: "bar", cost: 40000000, baseRevenue: 4200000, baseMaintenance: 1400000, tier: 3, emoji: "🪩" },
  { id: "nightlife_empire", name: "National Nightlife Empire", industry: "bar", cost: 180000000, baseRevenue: 18500000, baseMaintenance: 5600000, tier: 4, emoji: "🎉" },
  // Hotel
  { id: "guest_house", name: "Small Guest House", industry: "hotel", cost: 2000000, baseRevenue: 200000, baseMaintenance: 68000, tier: 1, emoji: "🏠" },
  { id: "boutique_hotel", name: "Boutique Hotel", industry: "hotel", cost: 25000000, baseRevenue: 2600000, baseMaintenance: 850000, tier: 2, emoji: "🏨" },
  { id: "luxury_hotel", name: "5-Star Luxury Hotel", industry: "hotel", cost: 150000000, baseRevenue: 15500000, baseMaintenance: 4800000, tier: 3, emoji: "🌟" },
  { id: "hotel_chain", name: "International Hotel Chain", industry: "hotel", cost: 600000000, baseRevenue: 62000000, baseMaintenance: 18000000, tier: 4, emoji: "🏰" },
  // Travel
  { id: "visa_agent", name: "Visa & Passport Agent", industry: "travel", cost: 500000, baseRevenue: 52000, baseMaintenance: 16000, tier: 1, emoji: "🛂" },
  { id: "ticketing_agency", name: "Flight Ticketing Agency", industry: "travel", cost: 5000000, baseRevenue: 520000, baseMaintenance: 180000, tier: 2, emoji: "🎫" },
  { id: "tour_company", name: "Tour & Holiday Package Company", industry: "travel", cost: 20000000, baseRevenue: 2100000, baseMaintenance: 700000, tier: 3, emoji: "🏖️" },
  { id: "travel_empire", name: "National Travel & Tourism Empire", industry: "travel", cost: 100000000, baseRevenue: 10500000, baseMaintenance: 3200000, tier: 4, emoji: "🌍" },
  // Auto
  { id: "mechanic_shop", name: "Roadside Mechanic Workshop", industry: "auto", cost: 400000, baseRevenue: 42000, baseMaintenance: 13000, tier: 1, emoji: "🔧" },
  { id: "spare_parts", name: "Spare Parts Shop", industry: "auto", cost: 3000000, baseRevenue: 310000, baseMaintenance: 105000, tier: 2, emoji: "⚙️" },
  { id: "panel_beating", name: "Panel Beating & Spraying Center", industry: "auto", cost: 12000000, baseRevenue: 1250000, baseMaintenance: 420000, tier: 3, emoji: "🎨" },
  { id: "auto_empire", name: "National Auto Repair Empire", industry: "auto", cost: 70000000, baseRevenue: 7200000, baseMaintenance: 2200000, tier: 4, emoji: "🚗" },
];

export const LIFESTYLE_CATALOG: LifestyleDef[] = [
  { id: "maybach", name: "Mercedes-Maybach S-Class", category: "garage", cost: 12000000, credBoost: 9, sapaReduction: 4, emoji: "🚘", tier: 1 },
  { id: "rangerover", name: "Range Rover Autobiography", category: "garage", cost: 18000000, credBoost: 10, sapaReduction: 5, emoji: "🚙", tier: 1 },
  { id: "escalade", name: "Cadillac Escalade", category: "garage", cost: 22000000, credBoost: 11, sapaReduction: 5, emoji: "🚐", tier: 1 },
  { id: "urus", name: "Lamborghini Urus", category: "garage", cost: 65000000, credBoost: 16, sapaReduction: 7, emoji: "🏎️", tier: 2 },
  { id: "sf90", name: "Ferrari SF90 Stradale", category: "garage", cost: 95000000, credBoost: 18, sapaReduction: 8, emoji: "🏁", tier: 2 },
  { id: "gt3rs", name: "Porsche 911 GT3 RS", category: "garage", cost: 110000000, credBoost: 19, sapaReduction: 8, emoji: "🏎️", tier: 2 },
  { id: "chiron", name: "Bugatti Chiron Pur Sport", category: "garage", cost: 450000000, credBoost: 30, sapaReduction: 14, emoji: "💨", tier: 3 },
  { id: "boattail", name: "Rolls-Royce Boat Tail", category: "garage", cost: 700000000, credBoost: 34, sapaReduction: 16, emoji: "🛥️", tier: 3 },
  { id: "huayra", name: "Pagani Huayra", category: "garage", cost: 520000000, credBoost: 32, sapaReduction: 15, emoji: "🔥", tier: 3 },
  { id: "jesko", name: "Koenigsegg Jesko", category: "garage", cost: 600000000, credBoost: 33, sapaReduction: 15, emoji: "⚡", tier: 3 },
  { id: "agbada", name: "Custom Gold-Thread Agbada & Royal Cap", category: "wardrobe", cost: 1500000, credBoost: 6, sapaReduction: 2, emoji: "🧥", tier: 1 },
  { id: "cuban", name: "Diamond-Encrusted Cuban Link Chain", category: "wardrobe", cost: 8000000, credBoost: 11, sapaReduction: 4, emoji: "📿", tier: 1 },
  { id: "savile", name: "Bespoke Savile Row Suit", category: "wardrobe", cost: 4500000, credBoost: 8, sapaReduction: 3, emoji: "🤵", tier: 1 },
  { id: "italian", name: "Italian Designer Suit Collection", category: "wardrobe", cost: 6500000, credBoost: 9, sapaReduction: 4, emoji: "👔", tier: 1 },
  { id: "birkin25", name: "Hermès Birkin 25 (Togo Leather)", category: "bags", cost: 45000000, credBoost: 15, sapaReduction: 7, emoji: "👜", tier: 1 },
  { id: "himalayan", name: "Hermès Himalayan Crocodile Birkin", category: "bags", cost: 320000000, credBoost: 28, sapaReduction: 13, emoji: "👛", tier: 2 },
  { id: "trunk", name: "Limited-Edition Trunk Luggage Set", category: "bags", cost: 12000000, credBoost: 10, sapaReduction: 5, emoji: "🧳", tier: 1 },
  { id: "patek", name: "Patek Philippe Grandmaster Chime", category: "watches", cost: 480000000, credBoost: 30, sapaReduction: 14, emoji: "⌚", tier: 3 },
  { id: "rm", name: "Richard Mille Tourbillon", category: "watches", cost: 220000000, credBoost: 24, sapaReduction: 11, emoji: "⌚", tier: 2 },
  { id: "ap", name: "Audemars Piguet Royal Oak", category: "watches", cost: 85000000, credBoost: 17, sapaReduction: 8, emoji: "⌚", tier: 2 },
  { id: "mastiff", name: "Pedigree Tibetan Mastiff", category: "pets", cost: 3500000, credBoost: 8, sapaReduction: 5, emoji: "🐕", tier: 1 },
  { id: "caucasian", name: "Caucasian Shepherd Guard Dog", category: "pets", cost: 5500000, credBoost: 9, sapaReduction: 6, emoji: "🐕‍🦺", tier: 1 },
  { id: "doberman", name: "Imported Trained Doberman Pinscher", category: "pets", cost: 7500000, credBoost: 10, sapaReduction: 6, emoji: "🐕", tier: 1 },
  { id: "panther", name: "Exotic Black Panther", category: "pets", cost: 85000000, credBoost: 22, sapaReduction: 10, emoji: "🐆", tier: 2 },
  { id: "tiger", name: "Tiger Cub Companion", category: "pets", cost: 120000000, credBoost: 25, sapaReduction: 11, emoji: "🐯", tier: 2 },
  { id: "gulfstream", name: "Gulfstream G650ER Private Jet", category: "aviation", cost: 380000000, credBoost: 30, sapaReduction: 15, emoji: "✈️", tier: 1 },
  { id: "global7500", name: "Bombardier Global 7500", category: "aviation", cost: 450000000, credBoost: 32, sapaReduction: 16, emoji: "🛩️", tier: 1 },
  { id: "a380", name: "Custom Boeing Business Jet (A380)", category: "aviation", cost: 900000000, credBoost: 40, sapaReduction: 20, emoji: "🛫", tier: 2 },
  { id: "yacht", name: "150ft Luxury Superyacht", category: "aviation", cost: 550000000, credBoost: 35, sapaReduction: 18, emoji: "🛥️", tier: 2 },
  { id: "island", name: "Private Caribbean Island", category: "aviation", cost: 1500000000, credBoost: 50, sapaReduction: 25, emoji: "🏝️", tier: 3 },
  { id: "banana", name: "Banana Island Waterfront Estate", category: "mansion", cost: 280000000, credBoost: 28, sapaReduction: 12, emoji: "🏝️", tier: 1 },
  { id: "diplomatic", name: "Abuja Diplomatic Mansion", category: "mansion", cost: 380000000, credBoost: 30, sapaReduction: 13, emoji: "🏛️", tier: 1 },
  { id: "lekki", name: "Lekki Oceanfront Mega-Mansion", category: "mansion", cost: 500000000, credBoost: 34, sapaReduction: 15, emoji: "🏰", tier: 2 },
];

export const LIFESTYLE_CATEGORIES: { id: LifestyleCategory; name: string; emoji: string; perk: string }[] = [
  { id: "garage", name: "Luxury Garage & Hypercars", emoji: "🏎️", perk: "Massive Street Cred boosts; unlocks VIP banking terms & loan limits" },
  { id: "wardrobe", name: "Haute Couture & High Fashion", emoji: "👗", perk: "Unlocks high-society networking events and corporate deal invites" },
  { id: "bags", name: "Ultra-Luxury Handbags & Collectibles", emoji: "👜", perk: "Major Street Cred boost; unlocks exclusive VIP social circles" },
  { id: "watches", name: "High-End Horology (Master Timepieces)", emoji: "⌚", perk: "Signals extreme wealth on the leaderboard; elite tier flex" },
  { id: "pets", name: "Exotic Pets & Elite Companions", emoji: "🐆", perk: "Boosts local prestige and reduces risk of minor street disruptions" },
  { id: "aviation", name: "Aviation, Superyachts & Megastructures", emoji: "🛩️", perk: "Drastically slashes Sapa Meter risk; immune to specific economic crashes" },
  { id: "mansion", name: "Luxury Mansions & Estates", emoji: "🏰", perk: "Reduces maximum risk of bank loans getting rejected" },
];

export const EVENTS: RandomEvent[] = [
  { id: "fuel", title: "Fuel Scarcity Crisis", emoji: "⛽", description: "Fuel queues stretch for kilometres. Your fleet is grounded without action.", choices: [
    { label: "Pay 2x fuel cost", description: "Keep operating — lose ₦50,000 cash.", cashDelta: -50000 },
    { label: "Park vehicles for the day", description: "Lose 20% revenue today.", cashDelta: -30000, sapaDelta: 2 },
  ]},
  { id: "blackout", title: "Grid Power Outage", emoji: "🔌", description: "NEPA has struck again. Your operations are in darkness.", choices: [
    { label: "Buy diesel generator", description: "100% output maintained.", cashDelta: -150000 },
    { label: "Work in the dark", description: "Sales drop 40%.", cashDelta: -80000, sapaDelta: 3 },
  ]},
  { id: "union", title: "Union Dues Hike", emoji: "🤝", description: "The association demands higher dues — or else.", choices: [
    { label: "Pay increased dues", description: "+5 Credibility.", cashDelta: -30000, credDelta: 5 },
    { label: "Refuse to pay", description: "Protests cut efficiency 10%.", credDelta: -8, sapaDelta: 4 },
  ]},
  { id: "viral", title: "Viral Social Media Review", emoji: "📱", description: "A TikToker just blew up your business online!", choices: [
    { label: "Capitalize with a discount", description: "+50% revenue, -₦20k promo budget.", cashDelta: -20000, revenueBoost: 120000, credDelta: 6 },
  ]},
  { id: "rent", title: "Landlord Rent Increase", emoji: "🏠", description: "Your landlord wants a bigger slice of your success.", choices: [
    { label: "Pay the new rent", description: "Stay put, lose ₦200,000.", cashDelta: -200000 },
    { label: "Relocate business", description: "-₦100k move, 20% sales loss.", cashDelta: -100000, sapaDelta: 3 },
  ]},
  { id: "audit", title: "Government Regulatory Audit", emoji: "📋", description: "Tax officials are at your door with clipboards.", choices: [
    { label: "Hire tax consultant", description: "Full compliance, -₦80,000.", cashDelta: -80000, credDelta: 4 },
    { label: "Try to bribe official", description: "30% chance of ₦500k fine.", cashDelta: -30000, gamble: { winChance: 0.7, winCash: 0, loseCash: -500000 } },
  ]},
  { id: "chef", title: "Head Chef Headhunted", emoji: "👨‍🍳", description: "A rival is poaching your best chef with a fat offer.", choices: [
    { label: "Raise salary by 25%", description: "Keep output, higher expenses.", cashDelta: -60000, credDelta: 3 },
    { label: "Let the chef leave", description: "Food quality drops 30%.", cashDelta: -40000, sapaDelta: 2 },
  ]},
  { id: "posshort", title: "POS Cash Shortage", emoji: "💵", description: "Your terminals are running dry on cash float.", choices: [
    { label: "Rush cash from bank", description: "+₦10k transport cost.", cashDelta: -10000 },
    { label: "Turn away customers", description: "Lose ₦40,000 in missed fees.", cashDelta: -40000, credDelta: -3 },
  ]},
  { id: "flood", title: "Rainstorm Flash Flood", emoji: "🌧️", description: "Heavy rain has flooded your premises.", choices: [
    { label: "Pay emergency repair team", description: "Fix it fast, -₦60,000.", cashDelta: -60000 },
    { label: "Wait it out", description: "No operations for 15 minutes.", cashDelta: -35000, sapaDelta: 2 },
  ]},
  { id: "fx", title: "FX / Inflation Surge", emoji: "📈", description: "The naira is wobbling. Prices are shifting fast.", choices: [
    { label: "Increase prices by 15%", description: "Keep margin, risk losing customers.", cashDelta: 80000, credDelta: -4 },
    { label: "Keep prices the same", description: "Absorb the margin loss.", cashDelta: -50000, credDelta: 3 },
  ]},
];

export const BADGES: Badge[] = [
  { id: "first_thousand", name: "First K", description: "Earn your first ₦1,000 profit", emoji: "🌱", unlocked: false },
  { id: "first_million", name: "First Million", description: "Reach ₦1,000,000 net worth", emoji: "💰", unlocked: false },
  { id: "ten_million", name: "Ten Million Club", description: "Reach ₦10,000,000 net worth", emoji: "🏆", unlocked: false },
  { id: "fifty_million", name: "Half Century", description: "Reach ₦50,000,000 net worth", emoji: "🎖️", unlocked: false },
  { id: "sapa_escape", name: "Escaped Sapa", description: "Get Sapa Meter below 10%", emoji: "🏃", unlocked: false },
  { id: "transport_kingpin", name: "Transport Kingpin", description: "Own 5+ transport assets", emoji: "🚐", unlocked: false },
  { id: "amala_billionaire", name: "Amala Billionaire", description: "Own 5+ buka assets", emoji: "🍲", unlocked: false },
  { id: "pos_overlord", name: "POS Overlord", description: "Own 5+ POS assets", emoji: "💳", unlocked: false },
  { id: "landlord", name: "Landlord Supreme", description: "Own 3+ real estate assets", emoji: "🏢", unlocked: false },
  { id: "hitmaker", name: "Hit Maker", description: "Own 3+ entertainment assets", emoji: "🎵", unlocked: false },
  { id: "agro_baron", name: "Agro Baron", description: "Own 3+ agro assets", emoji: "🚜", unlocked: false },
  { id: "snack_king", name: "Snack King", description: "Own 3+ street food assets", emoji: "🍢", unlocked: false },
  { id: "provision_boss", name: "Provision Boss", description: "Own 3+ retail assets", emoji: "🛒", unlocked: false },
  { id: "style_icon", name: "Style Icon", description: "Own 3+ fashion assets", emoji: "✂️", unlocked: false },
  { id: "hustle_hub", name: "Hustle Hub", description: "Own 3+ service assets", emoji: "💻", unlocked: false },
  { id: "akara_queen", name: "Akara Queen", description: "Own 3+ akara assets", emoji: "🥣", unlocked: false },
  { id: "afrobeats_star", name: "Afrobeats Star", description: "Own 3+ music assets", emoji: "🎧", unlocked: false },
  { id: "village_king", name: "Computer Village King", description: "Own 3+ gadget assets", emoji: "📱", unlocked: false },
  { id: "logistics_mogul", name: "Logistics Mogul", description: "Own 3+ logistics assets", emoji: "📦", unlocked: false },
  { id: "beauty_baron", name: "Beauty Baron", description: "Own 3+ beauty assets", emoji: "💅", unlocked: false },
  { id: "pharma_tycoon", name: "Pharma Tycoon", description: "Own 3+ pharmacy assets", emoji: "💊", unlocked: false },
  { id: "crypto_whale", name: "Crypto Whale", description: "Own 3+ crypto assets", emoji: "🪙", unlocked: false },
  { id: "media_mogul", name: "Media Mogul", description: "Own 3+ media assets", emoji: "📺", unlocked: false },
  { id: "laundry_lord", name: "Laundry Lord", description: "Own 3+ laundry assets", emoji: "🧺", unlocked: false },
  { id: "wash_wizard", name: "Wash Wizard", description: "Own 3+ car wash assets", emoji: "🚿", unlocked: false },
  { id: "bread_winner", name: "Bread Winner", description: "Own 3+ bakery assets", emoji: "🍞", unlocked: false },
  { id: "gym_rat", name: "Gym Rat", description: "Own 3+ fitness assets", emoji: "🏋️", unlocked: false },
  { id: "school_owner", name: "School Owner", description: "Own 3+ education assets", emoji: "🎓", unlocked: false },
  { id: "print_master", name: "Print Master", description: "Own 3+ printing assets", emoji: "🖨️", unlocked: false },
  { id: "water_king", name: "Water King", description: "Own 3+ water assets", emoji: "💧", unlocked: false },
  { id: "solar_sultan", name: "Solar Sultan", description: "Own 3+ solar assets", emoji: "☀️", unlocked: false },
  { id: "bar_boss", name: "Bar Boss", description: "Own 3+ bar assets", emoji: "🍻", unlocked: false },
  { id: "hotel_heir", name: "Hotel Heir", description: "Own 3+ hotel assets", emoji: "🏨", unlocked: false },
  { id: "travel_tycoon", name: "Travel Tycoon", description: "Own 3+ travel assets", emoji: "✈️", unlocked: false },
  { id: "auto_ace", name: "Auto Ace", description: "Own 3+ auto assets", emoji: "🔧", unlocked: false },
  { id: "branch_builder", name: "Branch Builder", description: "Open a branch in another city", emoji: "🏙️", unlocked: false },
  { id: "national_reach", name: "National Reach", description: "Operate in 4+ cities", emoji: "🇳🇬", unlocked: false },
  { id: "debt_free", name: "Debt Free", description: "Clear all loans at least once", emoji: "🕊️", unlocked: false },
  { id: "sapa_survivor", name: "Sapa Survivor", description: "Survive with Sapa Meter above 80%", emoji: "😅", unlocked: false },
  { id: "flexer", name: "Certified Flexer", description: "Own 3+ lifestyle assets", emoji: "💎", unlocked: false },
  { id: "hypercar_owner", name: "Hypercar Owner", description: "Own any Tier 3 hypercar", emoji: "🏎️", unlocked: false },
  { id: "jet_setter", name: "Jet Setter", description: "Own a private jet or superyacht", emoji: "✈️", unlocked: false },
  { id: "time_lord", name: "Time Lord", description: "Own a Patek Philippe or Richard Mille", emoji: "⌚", unlocked: false },
  { id: "bag_collector", name: "Bag Collector", description: "Own the Hermès Himalayan Birkin", emoji: "👛", unlocked: false },
  { id: "wild_king", name: "Wild King", description: "Own an exotic panther or tiger", emoji: "🐆", unlocked: false },
  { id: "hostile_takeover", name: "Hostile Takeover", description: "Complete your first acquisition", emoji: "🤝", unlocked: false },
  { id: "vulture_capitalist", name: "Vulture Capitalist", description: "Buy 3+ distressed businesses", emoji: "🦅", unlocked: false },
];

export const RIVAL_NAMES = [
  "Chief Adebayo Holdings",
  "Mama Nkechi Foods Ltd",
  "SwiftPay Agent Network",
  "Eko Express Logistics",
  "Wuse Suya Empire",
  "Trans-Amadi Cash Hub",
  "Kano Trade Union Co.",
  "Balogun Market Cartel",
  "VI Luxury Wheels",
  "Garki Financial Trust",
];

export const TICKER_TEMPLATES = [
  "📈 {asset} just completed a route and earned ₦{amt}",
  "💰 {asset} profit is up ₦{amt} today",
  "🚀 {asset} is on fire — ₦{amt} earned",
  "🤑 {asset} dey chop life — ₦{amt} in the bag",
  "📊 {asset} performance: +₦{amt}",
];

export const AUCTION_COMPANIES = [
  { name: "Adeola Transport Co.", industry: "transport" as Industry, emoji: "🚐" },
  { name: "Mama Chi Buka Ltd", industry: "buka" as Industry, emoji: "🍲" },
  { name: "QuickCash POS Hub", industry: "pos" as Industry, emoji: "💳" },
  { name: "Surulere Property Group", industry: "realestate" as Industry, emoji: "🏢" },
  { name: "SoundCity Records", industry: "entertainment" as Industry, emoji: "🎵" },
  { name: "GreenField Farms Ltd", industry: "agro" as Industry, emoji: "🚜" },
  { name: "Akara Republic", industry: "akara" as Industry, emoji: "🥣" },
  { name: "Corner Mart Nigeria", industry: "retail" as Industry, emoji: "🏪" },
  { name: "Aso-Ebi Couture", industry: "fashion" as Industry, emoji: "✂️" },
  { name: "CyberHub Services Ltd", industry: "services" as Industry, emoji: "💻" },
  { name: "Naija Beats Label", industry: "music" as Industry, emoji: "🎧" },
  { name: "Ikeja Gadget World", industry: "gadgets" as Industry, emoji: "📱" },
  { name: "SwiftCourier Logistics", industry: "logistics" as Industry, emoji: "📦" },
  { name: "Glow Beauty Spa", industry: "beauty" as Industry, emoji: "💅" },
  { name: "HealthPlus Chemists", industry: "pharmacy" as Industry, emoji: "💊" },
  { name: "NaijaCoin Exchange", industry: "crypto" as Industry, emoji: "🪙" },
  { name: "Pulse Media House", industry: "media" as Industry, emoji: "📺" },
  { name: "FreshFold Laundry", industry: "laundry" as Industry, emoji: "🧺" },
  { name: "Shine Auto Spa", industry: "carwash" as Industry, emoji: "🚿" },
  { name: "Golden Crust Bakery", industry: "bakery" as Industry, emoji: "🍞" },
  { name: "IronBody Fitness", industry: "fitness" as Industry, emoji: "🏋️" },
  { name: "BrightMinds Academy", industry: "education" as Industry, emoji: "🎓" },
  { name: "PrintPro Nigeria", industry: "printing" as Industry, emoji: "🖨️" },
  { name: "AquaPure Water", industry: "water" as Industry, emoji: "💧" },
  { name: "SunPower Solar", industry: "solar" as Industry, emoji: "☀️" },
  { name: "Vibe Lounge & Bar", industry: "bar" as Industry, emoji: "🍻" },
  { name: "Grand Palace Hotel", industry: "hotel" as Industry, emoji: "🏨" },
  { name: "Wanderlust Travels", industry: "travel" as Industry, emoji: "✈️" },
  { name: "AutoFix Garage", industry: "auto" as Industry, emoji: "🔧" },
];