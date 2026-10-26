export type Industry =
  | "transport"
  | "buka"
  | "pos"
  | "realestate"
  | "entertainment"
  | "agro"
  | "streetfood"
  | "retail"
  | "fashion"
  | "services"
  | "akara"
  | "music"
  | "gadgets"
  | "logistics"
  | "beauty"
  | "pharmacy"
  | "crypto"
  | "media"
  | "laundry"
  | "carwash"
  | "bakery"
  | "fitness"
  | "education"
  | "printing"
  | "water"
  | "solar"
  | "bar"
  | "hotel"
  | "travel"
  | "auto";

export type City = "Ibadan" | "Benin City" | "Enugu" | "Port Harcourt" | "Kano" | "Aba" | "Abuja" | "Lagos";

export type LifestyleCategory =
  | "garage"
  | "wardrobe"
  | "pets"
  | "aviation"
  | "bags"
  | "watches"
  | "mansion";

export type MogulTitle = "chief" | "chairwoman" | "mogul";

export interface AssetDef {
  id: string;
  name: string;
  industry: Industry;
  cost: number;
  baseRevenue: number;
  baseMaintenance: number;
  tier: number;
  emoji: string;
}

export interface OwnedAsset {
  assetId: string;
  level: number;
  autoManager: boolean;
  city: City;
}

export interface LifestyleDef {
  id: string;
  name: string;
  category: LifestyleCategory;
  cost: number;
  credBoost: number;
  sapaReduction: number;
  emoji: string;
  tier: number;
}

export interface Loan {
  id: string;
  principal: number;
  remaining: number;
  rate: number;
  dueDay: number;
  autoDebit: boolean;
}

export interface EventChoice {
  label: string;
  description: string;
  cashDelta?: number;
  credDelta?: number;
  sapaDelta?: number;
  revenueBoost?: number;
  gamble?: { winChance: number; winCash: number; loseCash: number };
}

export interface RandomEvent {
  id: string;
  title: string;
  description: string;
  emoji: string;
  choices: EventChoice[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlocked: boolean;
}

export interface LedgerEntry {
  day: number;
  revenue: number;
  expenses: number;
  net: number;
}

export interface DistressedListing {
  id: string;
  companyName: string;
  industry: Industry;
  city: City;
  netWorth: number;
  askPrice: number;
  discount: number;
  expiresDay: number;
  emoji: string;
}

export interface GameState {
  companyName: string;
  industry: Industry;
  city: City;
  cash: number;
  netWorth: number;
  streetCred: number;
  sapaMeter: number;
  level: number;
  assets: OwnedAsset[];
  lifestyle: string[];
  loans: Loan[];
  insurance: boolean;
  day: number;
  log: string[];
  branches: City[];
  generalManager: boolean;
  unlockedBadges: string[];
  ticker: string[];
  ledger: LedgerEntry[];
  bankrupt: boolean;
  auctions: DistressedListing[];
  acquisitions: number;
  email: string;
  mogulTitle: MogulTitle;
}