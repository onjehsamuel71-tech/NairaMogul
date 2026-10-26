import { useMemo } from "react";
import { RIVAL_NAMES, INDUSTRIES } from "@/lib/gameData";
import type { GameState, Industry } from "@/types/game";

function formatNaira(n: number): string {
  if (n >= 1000000000) return `₦${(n / 1000000000).toFixed(2)}B`;
  if (n >= 1000000) return `₦${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `₦${(n / 1000).toFixed(1)}K`;
  return `₦${Math.round(n).toLocaleString()}`;
}

interface Rival {
  name: string;
  netWorth: number;
  city: string;
  industry: Industry;
  isPlayer?: boolean;
}

export function Leaderboard({
  game,
  onSabotage,
}: {
  game: GameState;
  onSabotage: (name: string) => void;
}) {
  const rivals = useMemo<Rival[]>(() => {
    const seed = game.day;
    return RIVAL_NAMES.map((name, i) => {
      const base = 500000 + ((seed * (i + 3) * 7919) % 400000000);
      const industries: Industry[] = ["transport", "buka", "pos", "gadgets", "music", "akara", "crypto", "logistics"];
      return {
        name,
        netWorth: base,
        city: ["Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan"][i % 5],
        industry: industries[i % industries.length],
      };
    });
  }, [game.day]);

  const all: Rival[] = useMemo(() => {
    const player: Rival = {
      name: `${game.companyName} (You)`,
      netWorth: game.netWorth,
      city: game.city,
      industry: game.industry,
      isPlayer: true,
    };
    return [...rivals, player].sort((a, b) => b.netWorth - a.netWorth);
  }, [rivals, game]);

  const playerRank = all.findIndex((r) => r.isPlayer) + 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-emerald-100">Leaderboard</h2>
          <p className="mt-1 text-sm text-emerald-300/70">
            Top CEOs nationwide. Sabotage rivals to climb the ranks — at your own risk.
          </p>
        </div>
        <div className="rounded-xl border border-amber-900/50 bg-amber-950/30 px-5 py-3">
          <p className="text-xs text-amber-400/70">Your Rank</p>
          <p className="font-serif text-2xl font-bold text-amber-200">#{playerRank}</p>
        </div>
      </div>

      <div className="space-y-2">
        {all.map((r, i) => {
          const ind = INDUSTRIES[r.industry];
          return (
            <div
              key={r.name}
              className={`flex items-center gap-4 rounded-2xl border p-4 shadow-md transition ${
                r.isPlayer
                  ? "border-emerald-500 bg-gradient-to-r from-emerald-950/60 to-slate-900"
                  : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-serif text-lg font-bold ${
                  i === 0
                    ? "bg-amber-500 text-slate-950"
                    : i === 1
                    ? "bg-slate-400 text-slate-950"
                    : i === 2
                    ? "bg-amber-700 text-slate-950"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`truncate font-bold ${r.isPlayer ? "text-emerald-200" : "text-slate-200"}`}>
                  {r.name}
                </p>
                <p className="text-xs text-slate-500">
                  {ind.emoji} {ind.name} · {r.city}
                </p>
              </div>
              <div className="text-right">
                <p className="font-serif font-bold text-amber-200">{formatNaira(r.netWorth)}</p>
              </div>
              {!r.isPlayer && (
                <button
                  onClick={() => onSabotage(r.name)}
                  disabled={game.cash < 200000}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    game.cash >= 200000
                      ? "border border-rose-700/60 text-rose-300 hover:bg-rose-900/40"
                      : "cursor-not-allowed border border-slate-800 text-slate-600"
                  }`}
                >
                  💥 Sabotage
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}