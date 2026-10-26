import { useState } from "react";
import { ASSET_CATALOG, INDUSTRIES, CITIES, TIER_LABELS } from "@/lib/gameData";
import type { GameState, City } from "@/types/game";

function formatNaira(n: number): string {
  if (n >= 1000000000) return `₦${(n / 1000000000).toFixed(2)}B`;
  if (n >= 1000000) return `₦${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `₦${(n / 1000).toFixed(1)}K`;
  return `₦${Math.round(n).toLocaleString()}`;
}

export function Dashboard({
  game,
  onToggleManager,
  onHireGM,
  onOpenBranch,
}: {
  game: GameState;
  onToggleManager: (assetId: string) => void;
  onHireGM: () => void;
  onOpenBranch: (city: City) => void;
}) {
  const [showBranches, setShowBranches] = useState(false);
  const industry = INDUSTRIES[game.industry];
  const gmBonus = game.generalManager ? 1.1 : 0.85;
  const branchBonus = 1 + (game.branches.length - 1) * 0.15;

  let totalRevenue = 0;
  let totalExpenses = 0;
  for (const a of game.assets) {
    const def = ASSET_CATALOG.find((x) => x.id === a.assetId);
    if (!def) continue;
    totalRevenue += def.baseRevenue * a.level * industry.revenueMult * gmBonus * branchBonus;
    totalExpenses += def.baseMaintenance * a.level;
  }
  const net = totalRevenue - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Daily Revenue" value={formatNaira(totalRevenue)} tone="emerald" />
        <StatCard label="Daily Expenses" value={formatNaira(totalExpenses)} tone="rose" />
        <StatCard label="Net Cashflow" value={`${net >= 0 ? "+" : ""}${formatNaira(net)}`} tone={net >= 0 ? "amber" : "rose"} />
        <StatCard label="Business Level" value={`Tier ${game.level}`} tone="sky" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-emerald-100">Your Empire</h2>
            <span className="text-xs text-emerald-300/60">{game.assets.length} assets</span>
          </div>

          {game.assets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-emerald-800/60 bg-slate-900/40 p-10 text-center">
              <p className="text-5xl">🏗️</p>
              <p className="mt-3 font-serif text-lg text-emerald-200">No assets yet</p>
              <p className="mt-1 text-sm text-emerald-300/60">
                Head to the Asset Market and buy your first business to start earning.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {game.assets.map((a) => {
                const def = ASSET_CATALOG.find((x) => x.id === a.assetId);
                if (!def) return null;
                const rev = def.baseRevenue * a.level * industry.revenueMult * gmBonus * branchBonus;
                const exp = def.baseMaintenance * a.level;
                return (
                  <div
                    key={a.assetId}
                    className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-md transition hover:border-emerald-700/60"
                  >
                    <span className="text-3xl">{def.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-bold text-slate-100">{def.name}</p>
                        <span className="shrink-0 rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-300">
                          Lv.{a.level}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {a.city} · Net {formatNaira(rev - exp)}/day
                      </p>
                    </div>
                    <button
                      onClick={() => onToggleManager(a.assetId)}
                      className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                        a.autoManager
                          ? "bg-emerald-500 text-slate-950"
                          : "border border-slate-700 text-slate-400 hover:border-emerald-600"
                      }`}
                    >
                      {a.autoManager ? "🤖 Auto" : "Manual"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-900/50 bg-gradient-to-br from-emerald-950/60 to-slate-900 p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">General Manager</p>
            <p className="mt-2 text-sm text-emerald-200/80">
              {game.generalManager
                ? "Active — your empire runs 24/7 with a +10% efficiency boost."
                : "Hire a GM for ₦3,000,000 to automate operations and boost efficiency."}
            </p>
            {!game.generalManager && (
              <button
                onClick={onHireGM}
                disabled={game.cash < 3000000}
                className={`mt-3 w-full rounded-xl py-2.5 text-sm font-bold transition ${
                  game.cash >= 3000000
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 hover:scale-[1.02] active:scale-95"
                    : "cursor-not-allowed bg-slate-800 text-slate-500"
                }`}
              >
                Hire GM · ₦3,000,000
              </button>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Branches</p>
              <button
                onClick={() => setShowBranches(!showBranches)}
                className="text-xs font-semibold text-amber-300 hover:text-amber-200"
              >
                {showBranches ? "Hide" : "Expand"}
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-300">
              Operating in {game.branches.length} {game.branches.length === 1 ? "city" : "cities"}
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {game.branches.map((b) => (
                <span key={b} className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-300">
                  {b}
                </span>
              ))}
            </div>
            {showBranches && (
              <div className="mt-4 space-y-2">
                {CITIES.filter((c) => !game.branches.includes(c.id)).map((c) => {
                  const canOpen = game.netWorth >= c.netWorthRequired && game.cash >= c.unlockCost;
                  return (
                    <button
                      key={c.id}
                      onClick={() => onOpenBranch(c.id)}
                      disabled={!canOpen}
                      className={`w-full rounded-xl border p-3 text-left transition ${
                        canOpen
                          ? "border-emerald-700/60 bg-emerald-950/30 hover:border-emerald-500"
                          : "border-slate-800 bg-slate-950/40 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">
                          {c.emoji} {c.id}
                        </span>
                        <span className="text-xs text-amber-300">{formatNaira(c.unlockCost)}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {TIER_LABELS[c.tier]} · Requires {formatNaira(c.netWorthRequired)} net worth
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-widest text-sky-400">Recent Activity</p>
            <div className="mt-3 max-h-64 space-y-2 overflow-y-auto">
              {game.log.slice(0, 10).map((entry, i) => (
                <p key={i} className="text-xs text-slate-400">
                  {entry}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "emerald" | "rose" | "amber" | "sky";
}) {
  const tones = {
    emerald: "border-emerald-900/50 from-emerald-950/60 text-emerald-200",
    rose: "border-rose-900/50 from-rose-950/40 text-rose-200",
    amber: "border-amber-900/50 from-amber-950/40 text-amber-200",
    sky: "border-sky-900/50 from-sky-950/40 text-sky-200",
  };
  return (
    <div className={`rounded-2xl border bg-gradient-to-br to-slate-900 p-4 shadow-lg ${tones[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-wider opacity-70">{label}</p>
      <p className="mt-1 font-serif text-2xl font-bold">{value}</p>
    </div>
  );
}