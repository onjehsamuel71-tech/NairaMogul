import type {
  Holding,
  Industry,
  IpoDraft,
  MarketState,
  StockListing,
  TradeRecord,
} from "@/types/market";

export const INDUSTRY_LABEL: Record<Industry, string> = {
  transport: "Transport Empire",
  buka: "Buka & Food Chain",
  pos: "POS & Agent Banking",
};

export const CITY_LABEL: Record<string, string> = {
  lagos: "Lagos",
  abuja: "Abuja",
  ph: "Port Harcourt",
};

export const TICK_MS = 60_000;

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

export function makeTicker(name: string): string {
  const clean = name.replace(/[^a-zA-Z ]/g, " ").trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 0) return "MOGUL";
  if (words.length === 1) return words[0].slice(0, 4).toUpperCase();
  return words
    .slice(0, 3)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 4);
}

export function formatNaira(value: number, compact = false): string {
  if (compact) {
    const abs = Math.abs(value);
    if (abs >= 1_000_000_000) return `₦${(value / 1_000_000_000).toFixed(2)}B`;
    if (abs >= 1_000_000) return `₦${(value / 1_000_000).toFixed(2)}M`;
    if (abs >= 1_000) return `₦${(value / 1_000).toFixed(1)}K`;
  }
  return `₦${Math.round(value).toLocaleString("en-NG")}`;
}

export function seedListings(): StockListing[] {
  const now = Date.now();
  const base: Array<Omit<StockListing, "id" | "listedAt" | "priceHistory">> = [
    {
      ticker: "DANF",
      companyName: "Danfo Nation Transit",
      industry: "transport",
      city: "lagos",
      ownerId: "npc_danf",
      ownerName: "Alhaji Bakare",
      sharePrice: 420,
      totalShares: 500_000,
      sharesOffered: 200_000,
      sharesSold: 168_400,
      dividendYield: 4.2,
      dailyRevenue: 3_850_000,
      netWorth: 210_000_000,
      status: "listed",
    },
    {
      ticker: "AMAL",
      companyName: "Amala Republic Holdings",
      industry: "buka",
      city: "abuja",
      ownerId: "npc_amal",
      ownerName: "Mama Nkechi",
      sharePrice: 265,
      totalShares: 800_000,
      sharesOffered: 320_000,
      sharesSold: 291_500,
      dividendYield: 5.6,
      dailyRevenue: 2_140_000,
      netWorth: 168_000_000,
      status: "listed",
    },
    {
      ticker: "AGNT",
      companyName: "Agent Bank Network Plc",
      industry: "pos",
      city: "ph",
      ownerId: "npc_agnt",
      ownerName: "Chief Okon",
      sharePrice: 780,
      totalShares: 400_000,
      sharesOffered: 150_000,
      sharesSold: 150_000,
      dividendYield: 3.1,
      dailyRevenue: 5_600_000,
      netWorth: 340_000_000,
      status: "listed",
    },
    {
      ticker: "KEKE",
      companyName: "Keke Riders Cooperative",
      industry: "transport",
      city: "lagos",
      ownerId: "npc_keke",
      ownerName: "Segun Adeyemi",
      sharePrice: 96,
      totalShares: 1_200_000,
      sharesOffered: 600_000,
      sharesSold: 402_000,
      dividendYield: 6.8,
      dailyRevenue: 1_180_000,
      netWorth: 74_000_000,
      status: "listed",
    },
    {
      ticker: "SUYA",
      companyName: "Suya Street Ventures",
      industry: "buka",
      city: "lagos",
      ownerId: "npc_suya",
      ownerName: "Ibrahim Mai Suya",
      sharePrice: 148,
      totalShares: 900_000,
      sharesOffered: 400_000,
      sharesSold: 355_000,
      dividendYield: 7.4,
      dailyRevenue: 1_640_000,
      netWorth: 96_000_000,
      status: "listed",
    },
  ];

  return base.map((b, i) => {
    const history: number[] = [];
    let p = b.sharePrice * 0.88;
    for (let k = 0; k < 24; k++) {
      p = p * (1 + (Math.random() - 0.46) * 0.035);
      history.push(Math.max(1, Math.round(p)));
    }
    history.push(b.sharePrice);
    return {
      ...b,
      id: `seed_${i}`,
      listedAt: now - (i + 1) * 86_400_000,
      priceHistory: history,
    };
  });
}

export function initialMarketState(): MarketState {
  return {
    listings: seedListings(),
    holdings: [],
    cash: 100_000,
    netWorth: 100_000,
    companyName: "My Company",
    industry: "transport",
    city: "lagos",
    streetCred: 12,
    sapaMeter: 8,
    lastTick: Date.now(),
  };
}

export function portfolioValue(state: MarketState): number {
  return state.holdings.reduce((sum, h) => {
    const listing = state.listings.find((l) => l.id === h.listingId);
    if (!listing) return sum;
    return sum + listing.sharePrice * h.shares;
  }, 0);
}

export function totalNetWorth(state: MarketState): number {
  return state.cash + portfolioValue(state);
}

export function driftPrice(listing: StockListing): number {
  const sentiment = (Math.random() - 0.48) * 0.045;
  const demand = listing.sharesSold / Math.max(1, listing.sharesOffered);
  const pressure = (demand - 0.7) * 0.02;
  const next = listing.sharePrice * (1 + sentiment + pressure);
  return Math.max(1, Math.round(next * 100) / 100);
}

export function tickMarket(state: MarketState): MarketState {
  const listings = state.listings.map((l) => {
    if (l.status !== "listed") return l;
    const price = driftPrice(l);
    const history = [...l.priceHistory, price].slice(-40);
    return { ...l, sharePrice: price, priceHistory: history };
  });
  return { ...state, listings, lastTick: Date.now() };
}

export function buyShares(
  state: MarketState,
  listingId: string,
  shares: number,
): { state: MarketState; trade?: TradeRecord; error?: string } {
  const listing = state.listings.find((l) => l.id === listingId);
  if (!listing) return { state, error: "Listing not found." };
  if (listing.status !== "listed") return { state, error: "This stock is not trading." };
  if (shares <= 0) return { state, error: "Enter a share quantity." };

  const available = listing.sharesOffered - listing.sharesSold;
  if (shares > available) return { state, error: `Only ${available.toLocaleString()} shares available.` };

  const cost = shares * listing.sharePrice;
  if (cost > state.cash) return { state, error: "Insufficient cash for this order." };

  const existing = state.holdings.find((h) => h.listingId === listingId);
  let holdings: Holding[];
  if (existing) {
    const totalShares = existing.shares + shares;
    const avgCost = (existing.avgCost * existing.shares + cost) / totalShares;
    holdings = state.holdings.map((h) =>
      h.listingId === listingId ? { ...h, shares: totalShares, avgCost } : h,
    );
  } else {
    holdings = [...state.holdings, { listingId, shares, avgCost: listing.sharePrice }];
  }

  const listings = state.listings.map((l) =>
    l.id === listingId ? { ...l, sharesSold: l.sharesSold + shares } : l,
  );

  const next: MarketState = {
    ...state,
    cash: state.cash - cost,
    holdings,
    listings,
  };

  return {
    state: { ...next, netWorth: totalNetWorth(next) },
    trade: {
      id: uid("trd"),
      listingId,
      ticker: listing.ticker,
      side: "buy",
      shares,
      price: listing.sharePrice,
      at: Date.now(),
    },
  };
}

export function sellShares(
  state: MarketState,
  listingId: string,
  shares: number,
): { state: MarketState; trade?: TradeRecord; error?: string } {
  const listing = state.listings.find((l) => l.id === listingId);
  const holding = state.holdings.find((h) => h.listingId === listingId);
  if (!listing || !holding) return { state, error: "You do not own this stock." };
  if (shares <= 0) return { state, error: "Enter a share quantity." };
  if (shares > holding.shares) return { state, error: `You only hold ${holding.shares.toLocaleString()} shares.` };

  const proceeds = shares * listing.sharePrice;
  const remaining = holding.shares - shares;
  const holdings =
    remaining === 0
      ? state.holdings.filter((h) => h.listingId !== listingId)
      : state.holdings.map((h) => (h.listingId === listingId ? { ...h, shares: remaining } : h));

  const listings = state.listings.map((l) =>
    l.id === listingId ? { ...l, sharesSold: Math.max(0, l.sharesSold - shares) } : l,
  );

  const next: MarketState = {
    ...state,
    cash: state.cash + proceeds,
    holdings,
    listings,
  };

  return {
    state: { ...next, netWorth: totalNetWorth(next) },
    trade: {
      id: uid("trd"),
      listingId,
      ticker: listing.ticker,
      side: "sell",
      shares,
      price: listing.sharePrice,
      at: Date.now(),
    },
  };
}

export function listCompany(
  state: MarketState,
  draft: IpoDraft,
): { state: MarketState; listing?: StockListing; error?: string } {
  if (!draft.companyName.trim()) return { state, error: "Company name is required." };
  if (draft.sharePrice <= 0) return { state, error: "Share price must be above zero." };
  if (draft.sharesOffered < 1000) return { state, error: "Offer at least 1,000 shares to the public." };
  if (state.streetCred < 25) {
    return { state, error: "You need 25 Street Cred to file an IPO. Build reputation first." };
  }
  if (state.sapaMeter > 60) {
    return { state, error: "Sapa Meter too high. Regulators will reject a distressed listing." };
  }

  const ticker = makeTicker(draft.companyName);
  const totalShares = draft.sharesOffered * 4;
  const listing: StockListing = {
    id: uid("lst"),
    ticker,
    companyName: draft.companyName.trim(),
    industry: draft.industry,
    city: draft.city,
    ownerId: "player",
    ownerName: "You",
    sharePrice: draft.sharePrice,
    totalShares,
    sharesOffered: draft.sharesOffered,
    sharesSold: 0,
    dividendYield: draft.dividendYield,
    dailyRevenue: Math.round(draft.sharePrice * draft.sharesOffered * 0.012),
    netWorth: Math.round(draft.sharePrice * totalShares),
    status: "listed",
    listedAt: Date.now(),
    priceHistory: [draft.sharePrice],
  };

  const next: MarketState = {
    ...state,
    listings: [listing, ...state.listings],
    streetCred: state.streetCred + 8,
  };

  return { state: { ...next, netWorth: totalNetWorth(next) }, listing };
}

export function applyDividends(state: MarketState): { state: MarketState; paid: number } {
  let paid = 0;
  for (const h of state.holdings) {
    const listing = state.listings.find((l) => l.id === h.listingId);
    if (!listing || listing.status !== "listed") continue;
    paid += (h.shares * listing.sharePrice * listing.dividendYield) / 100 / 365;
  }
  if (paid <= 0) return { state, paid: 0 };
  const next = { ...state, cash: state.cash + paid };
  return { state: { ...next, netWorth: totalNetWorth(next) }, paid };
}