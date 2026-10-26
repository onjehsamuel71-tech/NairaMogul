import type { GameState } from "@/types/game";
import { MOGUL_TITLES, INDUSTRIES } from "@/lib/gameData";

function formatNaira(n: number): string {
  if (n >= 1000000000) return `₦${(n / 1000000000).toFixed(2)}B`;
  if (n >= 1000000) return `₦${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `₦${(n / 1000).toFixed(1)}K`;
  return `₦${Math.round(n).toLocaleString()}`;
}

export function Header({ game, onShare }: { game: GameState; onShare: () => void }) {
  const title = MOGUL_TITLES[game.mogulTitle];
  const industry = INDUSTRIES[game.industry];
  const sapaTone =
    game.sapaMeter > 70 ? "text-rose-400" : game.sapaMeter > 40 ? "text-amber-400" : "text-emerald-400";

  return (
    <header className="border-b border-emerald-900/40 bg-gradient-to-r from-emerald-950 via-slate-950 to-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-2xl shadow-lg shadow-emerald-900/40">
              {title.emoji}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                {title.greeting} · Day {game.day}
              </p>
              <h1 className="font-serif text-xl font-bold text-emerald-100">{game.companyName}</h1>
              <p className="text-xs text-emerald-300/60">
                {industry.emoji} {industry.name} · {game.city}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-xl border border-emerald-900/50 bg-slate-900/70 px-4 py-2">
              <p className="text-xs text-emerald-400/70">Cash</p>
              <p className="font-serif text-lg font-bold text-emerald-200">{formatNaira(game.cash)}</p>
            </div>
            <div className="rounded-xl border border-emerald-900/50 bg-slate-900/70 px-4 py-2">
              <p className="text-xs text-emerald-400/70">Net Worth</p>
              <p className="font-serif text-lg font-bold text-amber-200">{formatNaira(game.netWorth)}</p>
            </div>
            <div className="rounded-xl border border-emerald-900/50 bg-slate-900/70 px-4 py-2">
              <p className="text-xs text-emerald-400/70">Street Cred</p>
              <p className="font-serif text-lg font-bold text-sky-200">{game.streetCred}</p>
            </div>
            <div className="rounded-xl border border-emerald-900/50 bg-slate-900/70 px-4 py-2">
              <p className="text-xs text-emerald-400/70">Sapa Meter</p>
              <p className={`font-serif text-lg font-bold ${sapaTone}`}>{game.sapaMeter}%</p>
            </div>
            <button
              onClick={onShare}
              className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-md shadow-amber-900/40 transition hover:scale-105 hover:from-amber-400 hover:to-amber-500 active:scale-95"
            >
              📤 Share
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}