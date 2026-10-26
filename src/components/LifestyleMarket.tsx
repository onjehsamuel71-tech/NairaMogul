import { useState, useMemo } from "react";
import { LIFESTYLE_CATALOG, LIFESTYLE_CATEGORIES } from "@/lib/gameData";
import type { GameState, LifestyleCategory } from "@/types/game";

function formatNaira(n: number): string {
  if (n >= 1000000000) return `₦${(n / 1000000000).toFixed(2)}B`;
  if (n >= 1000000) return `₦${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `₦${(n / 1000).toFixed(1)}K`;
  return `₦${Math.round(n).toLocaleString()}`;
}

export function LifestyleMarket({
  game,
  onBuy,
}: {
  game: GameState;
  onBuy: (id: string) => void;
}) {
  const [filter, setFilter] = useState<LifestyleCategory | "all">("all");

  const items = useMemo(() => {
    return LIFESTYLE_CATALOG.filter((l) => filter === "all" || l.category === filter).sort(
      (a, b) => a.cost - b.cost
    );
  }, [filter]);

  const ownedCount = game.lifestyle.length;
  const totalFlexValue = game.lifestyle.reduce((s, id) => {
    const def = LIFESTYLE_CATALOG.find((x) => x.id === id);
    return s + (def ? def.cost : 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-amber-100">Flex Market</h2>
          <p className="mt-1 text-sm text-amber-300/70">
            Luxury assets boost Street Cred and slash your Sapa Meter. Flex responsibly.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="rounded-xl border border-amber-900/40 bg-amber-950/30 px-4 py-2">
            <p className="text-xs text-amber-400/70">Items Owned</p>
            <p className="font-serif text-xl font-bold text-amber-200">{ownedCount}</p>
          </div>
          <div className="rounded-xl border border-amber-900/40 bg-amber-950/30 px-4 py-2">
            <p className="text-xs text-amber-400/70">Flex Value</p>
            <p className="font-serif text-xl font-bold text-amber-200">{formatNaira(totalFlexValue)}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            filter === "all"
              ? "bg-amber-500 text-slate-950"
              : "border border-slate-700 text-slate-300 hover:border-amber-600"
          }`}
        >
          All Categories
        </button>
        {LIFESTYLE_CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              filter === c.id
                ? "bg-amber-500 text-slate-950"
                : "border border-slate-700 text-slate-300 hover:border-amber-600"
            }`}
          >
            {c.emoji} {c.name.split(" ")[0]}
          </button>
        ))}
      </div>

      {filter !== "all" && (
        <div className="rounded-xl border border-amber-900/40 bg-amber-950/20 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Category Perk</p>
          <p className="mt-1 text-sm text-amber-200/80">
            {LIFESTYLE_CATEGORIES.find((c) => c.id === filter)?.perk}
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((l) => {
          const owned = game.lifestyle.includes(l.id);
          const canAfford = game.cash >= l.cost;
          return (
            <div
              key={l.id}
              className={`flex flex-col rounded-2xl border p-5 shadow-lg transition ${
                owned
                  ? "border-amber-600/60 bg-gradient-to-br from-amber-950/50 to-slate-900"
                  : "border-slate-800 bg-slate-900/60 hover:border-amber-700/60"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-4xl">{l.emoji}</span>
                {owned && (
                  <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-300">
                    ✓ Owned
                  </span>
                )}
              </div>
              <h3 className="mt-3 font-bold text-slate-100">{l.name}</h3>
              <p className="text-xs capitalize text-amber-400/80">{l.category}</p>

              <div className="mt-3 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Street Cred</span>
                  <span className="font-semibold text-emerald-300">+{l.credBoost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sapa Reduction</span>
                  <span className="font-semibold text-sky-300">-{l.sapaReduction}%</span>
                </div>
              </div>

              <button
                onClick={() => onBuy(l.id)}
                disabled={owned || !canAfford}
                className={`mt-4 w-full rounded-xl py-2.5 text-sm font-bold transition ${
                  owned
                    ? "cursor-not-allowed bg-amber-900/40 text-amber-300/60"
                    : canAfford
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-900/40 hover:scale-[1.02] hover:from-amber-400 hover:to-amber-500 active:scale-95"
                    : "cursor-not-allowed bg-slate-800 text-slate-500"
                }`}
              >
                {owned ? "Already Owned" : `Buy · ${formatNaira(l.cost)}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}