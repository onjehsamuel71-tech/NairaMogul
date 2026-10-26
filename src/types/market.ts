export type Industry = "transport" | "buka" | "pos";

export type IpoStatus = "private" | "listed" | "suspended";

export interface StockListing {
  id: string;
  ticker: string;
  companyName: string;
  industry: Industry;
  city: string;
  ownerId: string;
  ownerName: string;
  sharePrice: number;
  totalShares: number;
  sharesOffered: number;
  sharesSold: number;
  dividendYield: number;
  dailyRevenue: number;
  netWorth: number;
  status: IpoStatus;
  listedAt: number;
  priceHistory: number[];
}

export interface Holding {
  listingId: string;
  shares: number;
  avgCost: number;
}

export interface MarketState {
  listings: StockListing[];
  holdings: Holding[];
  cash: number;
  netWorth: number;
  companyName: string;
  industry: Industry;
  city: string;
  streetCred: number;
  sapaMeter: number;
  lastTick: number;
}

export interface TradeRecord {
  id: string;
  listingId: string;
  ticker: string;
  side: "buy" | "sell";
  shares: number;
  price: number;
  at: number;
}

export interface IpoDraft {
  companyName: string;
  industry: Industry;
  city: string;
  sharePrice: number;
  sharesOffered: number;
  dividendYield: number;
}