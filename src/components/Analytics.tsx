import { ASSET_CATALOG, INDUSTRIES } from "@/lib/gameData";
import type { GameState } from "@/types/game";

function formatNaira(n: number): string {
  if (n >= 1000000000) return `₦${(n / 1000000000).toFixed(2)}B`;
  if (n >= 1000000) return `₦${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `₦${(n / 1000).toFixed(1)}K`;
  return `₦${Math.round(n).toLocaleString()}`;
}

export function Analytics({ game }: { game: GameState }) {
  const industry = INDUSTRIES[game.industry];
  const gmBonus = game.generalManager ? 1.1 : 0.85;
  const branchBonus = 1 + (game.branches.length - 1) * 0.15;

  const byIndustry: Record<string, number> = {};
  for (const a of game.assets) {
    const def = ASSET_CATALOG.find((x) => x.id === a.assetId);
    if (!def) continue;
    const rev = def.baseRevenue * a.level * industry.revenueMult * gmBonus * branchBonus;
    byIndustry[def.industry] = (byIndustry[def.industry] || 0) + rev;
  }

  const maxRev = Math.max(1, ...Object.values(byIndustry));
  const recent = game.ledger.slice(-14);
  const maxNet = Math.max(1, ...recent.map((r) => Math.abs(r.net)));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl font-bold text-emerald-100">Analytics</h2>
        <p className="mt-1 text-sm text-emerald-300/70">
          Track your empire's performance across industries and time.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
          <h3 className="font-serif text-xl font-bold text-emerald-100">Revenue by Industry</h3>
          {Object.keys(byIndustry).length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">No assets yet — buy your first business.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {Object.entries(byIndustry)
                .sort((a, b) => b[1] - a[1])
                .map(([ind, rev]) => (
                  <div key={ind}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">
                        {INDUSTRIES[ind as keyof typeof INDUSTRIES].emoji}{" "}
                        {INDUSTRIES[ind as keyof typeof INDUSTRIES].name}
                      </span>
                      <span className="font-semibold text-emerald-300">{formatNaira(rev)}/day</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                        style={{ width: `${(rev / maxRev) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
          <h3 className="font-serif text-xl font-bold text-emerald-100">Daily Net Cashflow</h3>
          {recent.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">No ledger history yet.</p>
          ) : (
            <div className="mt-4 flex h-40 items-end gap-1">
              {recent.map((r, i) => {
                const height = (Math.abs(r.net) / maxNet) * 100;
                return (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t ${r.net >= 0 ? "bg-emerald-500" : "bg-rose-500"}`}
                      style={{ height: `${Math.max(4, height)}%` }}
                      title={`Day ${r.day}: ${formatNaira(r.net)}`}
                    />
                    <span className="text-xs text-slate-600">{r.day}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
        <h3 className="font-serif text-xl font-bold text-emerald-100">Empire Summary</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Total Assets" value={String(game.assets.length)} />
          <Metric label="Cities" value={String(game.branches.length)} />
          <Metric label="Lifestyle Items" value={String(game.lifestyle.length)} />
          <Metric label="Acquisitions" value={String(game.acquisitions)} />
          <Metric label="Street Cred" value={`${game.streetCred}/100`} />
          <Metric label="Sapa Meter" value={`${game.sapaMeter}%`} />
          <Metric label="Days Played" value={String(game.day)} />
          <Metric label="Badges" value={`${game.unlockedBadges.length}`} />
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-serif text-lg font-bold text-emerald-200">{value}</p>
    </div>
  );
}