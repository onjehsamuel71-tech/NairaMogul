import { INDUSTRIES } from "@/lib/gameData";
import type { GameState, DistressedListing } from "@/types/game";

function formatNaira(n: number): string {
  if (n >= 1000000000) return `₦${(n / 1000000000).toFixed(2)}B`;
  if (n >= 1000000) return `₦${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `₦${(n / 1000).toFixed(1)}K`;
  return `₦${Math.round(n).toLocaleString()}`;
}

export function AuctionMarket({
  game,
  onBuy,
}: {
  game: GameState;
  onBuy: (listing: DistressedListing) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl font-bold text-emerald-100">🦅 Distressed Auctions</h2>
        <p className="mt-1 text-sm text-emerald-300/70">
          Buy struggling companies at a discount. Each acquisition grants a Level 2 asset in that industry.
        </p>
      </div>

      {game.auctions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-emerald-800/60 bg-slate-900/40 p-10 text-center">
          <p className="text-5xl">🦅</p>
          <p className="mt-3 font-serif text-lg text-emerald-200">No listings right now</p>
          <p className="mt-1 text-sm text-emerald-300/60">
            Distressed businesses appear here every few minutes. Keep building.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {game.auctions.map((l) => {
            const ind = INDUSTRIES[l.industry];
            const canAfford = game.cash >= l.askPrice;
            const expired = game.day > l.expiresDay;
            return (
              <div
                key={l.id}
                className={`flex flex-col rounded-2xl border p-5 shadow-lg transition ${
                  expired
                    ? "border-slate-800 bg-slate-900/30 opacity-50"
                    : "border-rose-900/50 bg-gradient-to-br from-rose-950/30 to-slate-900 hover:border-rose-700/60"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-4xl">{l.emoji}</span>
                  <span className="rounded-md bg-rose-500/20 px-2 py-0.5 text-xs font-bold text-rose-300">
                    -{l.discount}% OFF
                  </span>
                </div>
                <h3 className="mt-3 font-bold text-slate-100">{l.companyName}</h3>
                <p className="text-xs text-rose-300/80">
                  {ind.emoji} {ind.name} · {l.city}
                </p>

                <div className="mt-3 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Company Net Worth</span>
                    <span className="font-semibold text-slate-300">{formatNaira(l.netWorth)}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-800 pt-1">
                    <span className="text-slate-400">Asking Price</span>
                    <span className="font-bold text-amber-300">{formatNaira(l.askPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Expires</span>
                    <span className="font-semibold text-slate-400">Day {l.expiresDay}</span>
                  </div>
                </div>

                <button
                  onClick={() => onBuy(l)}
                  disabled={!canAfford || expired}
                  className={`mt-4 w-full rounded-xl py-2.5 text-sm font-bold transition ${
                    expired
                      ? "cursor-not-allowed bg-slate-800 text-slate-600"
                      : canAfford
                      ? "bg-gradient-to-r from-rose-500 to-rose-600 text-slate-950 shadow-md shadow-rose-900/40 hover:scale-[1.02] hover:from-rose-400 hover:to-rose-500 active:scale-95"
                      : "cursor-not-allowed bg-slate-800 text-slate-500"
                  }`}
                >
                  {expired ? "Expired" : `Acquire · ${formatNaira(l.askPrice)}`}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}