import { useState, useMemo } from "react";
import { ASSET_CATALOG, INDUSTRIES } from "@/lib/gameData";
import type { GameState, Industry } from "@/types/game";

function formatNaira(n: number): string {
  if (n >= 1000000000) return `₦${(n / 1000000000).toFixed(2)}B`;
  if (n >= 1000000) return `₦${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `₦${(n / 1000).toFixed(1)}K`;
  return `₦${Math.round(n).toLocaleString()}`;
}

export function AssetMarket({
  game,
  onBuy,
}: {
  game: GameState;
  onBuy: (assetId: string) => void;
}) {
  const [filter, setFilter] = useState<Industry | "all">("all");
  const [sort, setSort] = useState<"cost" | "revenue" | "roi">("cost");

  const industries = useMemo(() => {
    const set = new Set<Industry>();
    ASSET_CATALOG.forEach((a) => set.add(a.industry));
    return Array.from(set);
  }, []);

  const assets = useMemo(() => {
    let list = ASSET_CATALOG.filter((a) => filter === "all" || a.industry === filter);
    list = [...list].sort((a, b) => {
      if (sort === "cost") return a.cost - b.cost;
      if (sort === "revenue") return b.baseRevenue - a.baseRevenue;
      const roiA = (a.baseRevenue - a.baseMaintenance) / a.cost;
      const roiB = (b.baseRevenue - b.baseMaintenance) / b.cost;
      return roiB - roiA;
    });
    return list;
  }, [filter, sort]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl font-bold text-emerald-100">Asset Market</h2>
        <p className="mt-1 text-sm text-emerald-300/70">
          Buy new businesses or upgrade existing ones. Owned assets upgrade at 60% of base cost.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            filter === "all"
              ? "bg-emerald-500 text-slate-950"
              : "border border-slate-700 text-slate-300 hover:border-emerald-600"
          }`}
        >
          All Industries
        </button>
        {industries.map((ind) => (
          <button
            key={ind}
            onClick={() => setFilter(ind)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              filter === ind
                ? "bg-emerald-500 text-slate-950"
                : "border border-slate-700 text-slate-300 hover:border-emerald-600"
            }`}
          >
            {INDUSTRIES[ind].emoji} {INDUSTRIES[ind].name.split(" ")[0]}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-500">Sort by:</span>
        {(["cost", "revenue", "roi"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSort(s)}
            className={`rounded-md px-2 py-1 font-semibold capitalize transition ${
              sort === s ? "bg-amber-500/20 text-amber-300" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {s === "roi" ? "ROI" : s}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((a) => {
          const owned = game.assets.find((x) => x.assetId === a.id);
          const cost = owned ? Math.round(a.cost * 0.6) : a.cost;
          const canAfford = game.cash >= cost;
          const ind = INDUSTRIES[a.industry];
          const netPerDay = (a.baseRevenue - a.baseMaintenance) * (owned ? owned.level : 1) * ind.revenueMult;
          return (
            <div
              key={a.id}
              className={`flex flex-col rounded-2xl border p-5 shadow-lg transition ${
                owned
                  ? "border-emerald-600/60 bg-gradient-to-br from-emerald-950/60 to-slate-900"
                  : "border-slate-800 bg-slate-900/60 hover:border-emerald-700/60"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-4xl">{a.emoji}</span>
                <div className="flex flex-col items-end gap-1">
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs font-bold text-slate-300">
                    Tier {a.tier}
                  </span>
                  {owned && (
                    <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-300">
                      Lv.{owned.level}
                    </span>
                  )}
                </div>
              </div>
              <h3 className="mt-3 font-bold text-slate-100">{a.name}</h3>
              <p className="text-xs text-emerald-400/80">{ind.name}</p>

              <div className="mt-3 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Revenue/day</span>
                  <span className="font-semibold text-emerald-300">{formatNaira(a.baseRevenue * (owned ? owned.level : 1))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Maintenance</span>
                  <span className="font-semibold text-rose-300">{formatNaira(a.baseMaintenance * (owned ? owned.level : 1))}</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-1">
                  <span className="text-slate-400">Net/day</span>
                  <span className="font-bold text-amber-300">{formatNaira(netPerDay)}</span>
                </div>
              </div>

              <button
                onClick={() => onBuy(a.id)}
                disabled={!canAfford}
                className={`mt-4 w-full rounded-xl py-2.5 text-sm font-bold transition ${
                  canAfford
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 shadow-md shadow-emerald-900/40 hover:scale-[1.02] hover:from-emerald-400 hover:to-emerald-500 active:scale-95"
                    : "cursor-not-allowed bg-slate-800 text-slate-500"
                }`}
              >
                {owned ? `Upgrade · ${formatNaira(cost)}` : `Buy · ${formatNaira(cost)}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}