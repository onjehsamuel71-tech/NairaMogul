import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CITY_LABEL,
  INDUSTRY_LABEL,
  formatNaira,
  makeTicker,
} from "@/lib/marketEngine";
import type { Industry, MarketState, StockListing } from "@/types/market";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, Building2, TrendingUp } from "lucide-react";

interface Props {
  state: MarketState;
  onBuy: (listingId: string, shares: number) => string | null;
  onSell: (listingId: string, shares: number) => string | null;
  onList: (draft: {
    companyName: string;
    industry: Industry;
    city: string;
    sharePrice: number;
    sharesOffered: number;
    dividendYield: number;
  }) => string | null;
}

function Sparkline({ points }: { points: number[] }) {
  const path = useMemo(() => {
    if (points.length < 2) return "";
    const min = Math.min(...points);
    const max = Math.max(...points);
    const span = max - min || 1;
    return points
      .map((p, i) => {
        const x = (i / (points.length - 1)) * 100;
        const y = 30 - ((p - min) / span) * 28;
        return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");
  }, [points]);

  const up = points.length > 1 && points[points.length - 1] >= points[0];
  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="h-8 w-24">
      <path
        d={path}
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        className={up ? "stroke-emerald-500" : "stroke-rose-500"}
      />
    </svg>
  );
}

function ListingRow({
  listing,
  holding,
  onBuy,
  onSell,
}: {
  listing: StockListing;
  holding: number;
  onBuy: (id: string, n: number) => string | null;
  onSell: (id: string, n: number) => string | null;
}) {
  const [qty, setQty] = useState("100");
  const [msg, setMsg] = useState<string | null>(null);

  const prev = listing.priceHistory[listing.priceHistory.length - 2] ?? listing.sharePrice;
  const change = ((listing.sharePrice - prev) / prev) * 100;
  const up = change >= 0;
  const available = listing.sharesOffered - listing.sharesSold;
  const isOwn = listing.ownerId === "player";

  const handle = (fn: (id: string, n: number) => string | null) => {
    const n = Number(qty);
    const err = fn(listing.id, Number.isFinite(n) ? Math.floor(n) : 0);
    setMsg(err);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-sm font-bold text-emerald-700 ring-1 ring-emerald-100">
            {listing.ticker}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-slate-900">{listing.companyName}</p>
              {isOwn && (
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Your IPO</Badge>
              )}
            </div>
            <p className="text-xs text-slate-500">
              {INDUSTRY_LABEL[listing.industry]} · {CITY_LABEL[listing.city] ?? listing.city} ·{" "}
              {listing.ownerName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Sparkline points={listing.priceHistory} />
          <div className="text-right">
            <p className="font-mono text-lg font-bold text-slate-900">
              {formatNaira(listing.sharePrice)}
            </p>
            <p
              className={cn(
                "flex items-center justify-end gap-0.5 text-xs font-semibold",
                up ? "text-emerald-600" : "text-rose-600",
              )}
            >
              {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {change.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
        <div>
          <p className="text-slate-500">Available</p>
          <p className="font-semibold text-slate-800">{available.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-slate-500">Div. Yield</p>
          <p className="font-semibold text-slate-800">{listing.dividendYield.toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-slate-500">Daily Rev.</p>
          <p className="font-semibold text-slate-800">{formatNaira(listing.dailyRevenue, true)}</p>
        </div>
        <div>
          <p className="text-slate-500">You Hold</p>
          <p className="font-semibold text-slate-800">{holding.toLocaleString()}</p>
        </div>
      </div>

      <Separator className="my-3" />

      <div className="flex flex-wrap items-end gap-2">
        <div className="w-28">
          <Label className="text-xs text-slate-500">Shares</Label>
          <Input
            value={qty}
            inputMode="numeric"
            onChange={(e) => setQty(e.target.value.replace(/[^0-9]/g, ""))}
            className="h-9"
          />
        </div>
        <Button
          size="sm"
          className="bg-emerald-600 text-white hover:bg-emerald-700"
          disabled={available <= 0}
          onClick={() => handle(onBuy)}
        >
          Buy
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-rose-200 text-rose-700 hover:bg-rose-50"
          disabled={holding <= 0}
          onClick={() => handle(onSell)}
        >
          Sell
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-slate-500"
          onClick={() => setQty(String(Math.max(1, Math.floor(available / 2))))}
        >
          Half avail.
        </Button>
        {msg && <span className="text-xs font-medium text-rose-600">{msg}</span>}
      </div>
    </div>
  );
}

export function MarketPanel({ state, onBuy, onSell, onList }: Props) {
  const [companyName, setCompanyName] = useState(state.companyName);
  const [industry, setIndustry] = useState<Industry>(state.industry);
  const [city, setCity] = useState(state.city);
  const [sharePrice, setSharePrice] = useState("250");
  const [sharesOffered, setSharesOffered] = useState("100000");
  const [dividendYield, setDividendYield] = useState("4.5");
  const [ipoMsg, setIpoMsg] = useState<string | null>(null);

  const holdingMap = useMemo(() => {
    const m = new Map<string, number>();
    for (const h of state.holdings) m.set(h.listingId, h.shares);
    return m;
  }, [state.holdings]);

  const owned = state.listings.filter((l) => l.ownerId === "player");
  const tradable = state.listings.filter((l) => l.status === "listed");

  const submitIpo = () => {
    const err = onList({
      companyName,
      industry,
      city,
      sharePrice: Number(sharePrice) || 0,
      sharesOffered: Number(sharesOffered) || 0,
      dividendYield: Number(dividendYield) || 0,
    });
    setIpoMsg(err);
    if (!err) setIpoMsg("IPO filed. Your shares are now trading on the exchange.");
  };

  const previewTicker = makeTicker(companyName || "My Company");
  const raise = (Number(sharePrice) || 0) * (Number(sharesOffered) || 0);

  return (
    <Tabs defaultValue="exchange" className="w-full">
      <TabsList className="bg-slate-100">
        <TabsTrigger value="exchange">Exchange</TabsTrigger>
        <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
        <TabsTrigger value="ipo">List My Business</TabsTrigger>
      </TabsList>

      <TabsContent value="exchange" className="mt-4 space-y-3">
        {tradable.map((l) => (
          <ListingRow
            key={l.id}
            listing={l}
            holding={holdingMap.get(l.id) ?? 0}
            onBuy={onBuy}
            onSell={onSell}
          />
        ))}
      </TabsContent>

      <TabsContent value="portfolio" className="mt-4">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-emerald-600" /> Holdings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {state.holdings.length === 0 && (
              <p className="py-8 text-center text-sm text-slate-500">
                No positions yet. Buy shares on the Exchange tab to start earning dividends.
              </p>
            )}
            {state.holdings.map((h) => {
              const l = state.listings.find((x) => x.id === h.listingId);
              if (!l) return null;
              const value = l.sharePrice * h.shares;
              const pnl = value - h.avgCost * h.shares;
              const pnlPct = h.avgCost > 0 ? (pnl / (h.avgCost * h.shares)) * 100 : 0;
              return (
                <div
                  key={h.listingId}
                  className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{l.ticker}</p>
                    <p className="text-xs text-slate-500">
                      {h.shares.toLocaleString()} shares @ avg {formatNaira(h.avgCost)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-semibold text-slate-900">{formatNaira(value)}</p>
                    <p
                      className={cn(
                        "text-xs font-semibold",
                        pnl >= 0 ? "text-emerald-600" : "text-rose-600",
                      )}
                    >
                      {pnl >= 0 ? "+" : ""}
                      {formatNaira(pnl)} ({pnlPct.toFixed(1)}%)
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="ipo" className="mt-4">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4 text-amber-600" /> Take Your Business Public
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Company Name</Label>
                <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Ticker Preview</Label>
                <Input value={previewTicker} readOnly className="bg-slate-50 font-mono" />
              </div>
              <div className="space-y-2">
                <Label>Industry</Label>
                <Select value={industry} onValueChange={(v) => setIndustry(v as Industry)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transport">Transport Empire</SelectItem>
                    <SelectItem value="buka">Buka & Food Chain</SelectItem>
                    <SelectItem value="pos">POS & Agent Banking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Headquarters</Label>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lagos">Lagos</SelectItem>
                    <SelectItem value="abuja">Abuja</SelectItem>
                    <SelectItem value="ph">Port Harcourt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Share Price (₦)</Label>
                <Input
                  value={sharePrice}
                  inputMode="numeric"
                  onChange={(e) => setSharePrice(e.target.value.replace(/[^0-9]/g, ""))}
                />
              </div>
              <div className="space-y-2">
                <Label>Shares Offered</Label>
                <Input
                  value={sharesOffered}
                  inputMode="numeric"
                  onChange={(e) => setSharesOffered(e.target.value.replace(/[^0-9]/g, ""))}
                />
              </div>
              <div className="space-y-2">
                <Label>Dividend Yield (%)</Label>
                <Input
                  value={dividendYield}
                  inputMode="decimal"
                  onChange={(e) => setDividendYield(e.target.value.replace(/[^0-9.]/g, ""))}
                />
              </div>
              <div className="space-y-2">
                <Label>Capital Raise</Label>
                <Input value={formatNaira(raise)} readOnly className="bg-slate-50 font-mono" />
              </div>
            </div>

            <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-900 ring-1 ring-amber-100">
              IPO requirements: 25 Street Cred and Sapa Meter below 60%. Listing grants +8 Street
              Cred and unlocks dividend income for your shareholders.
            </div>

            <div className="flex items-center gap-3">
              <Button
                className="bg-amber-600 text-white hover:bg-amber-700"
                onClick={submitIpo}
              >
                File IPO
              </Button>
              {ipoMsg && (
                <span
                  className={cn(
                    "text-xs font-medium",
                    ipoMsg.startsWith("IPO filed") ? "text-emerald-600" : "text-rose-600",
                  )}
                >
                  {ipoMsg}
                </span>
              )}
            </div>

            {owned.length > 0 && (
              <div className="space-y-2 pt-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Your Listed Companies
                </p>
                {owned.map((l) => (
                  <div
                    key={l.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-2 text-sm"
                  >
                    <span className="font-mono font-semibold text-slate-800">{l.ticker}</span>
                    <span className="text-slate-600">{l.companyName}</span>
                    <span className="font-mono text-slate-800">{formatNaira(l.sharePrice)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}