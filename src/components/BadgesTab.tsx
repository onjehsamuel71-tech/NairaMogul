import { BADGES } from "@/lib/gameData";
import type { GameState } from "@/types/game";

export function BadgesTab({ game }: { game: GameState }) {
  const unlockedCount = game.unlockedBadges.length;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-emerald-100">Achievement Badges</h2>
          <p className="mt-1 text-sm text-emerald-300/70">
            Unlock badges as you build your empire. Each one tells your story.
          </p>
        </div>
        <div className="rounded-xl border border-amber-900/50 bg-amber-950/30 px-5 py-3">
          <p className="text-xs text-amber-400/70">Unlocked</p>
          <p className="font-serif text-2xl font-bold text-amber-200">
            {unlockedCount}/{BADGES.length}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BADGES.map((b) => {
          const unlocked = game.unlockedBadges.includes(b.id);
          return (
            <div
              key={b.id}
              className={`flex items-start gap-4 rounded-2xl border p-5 shadow-lg transition ${
                unlocked
                  ? "border-amber-600/60 bg-gradient-to-br from-amber-950/40 to-slate-900"
                  : "border-slate-800 bg-slate-900/40 opacity-60"
              }`}
            >
              <span className={`text-4xl ${unlocked ? "" : "grayscale"}`}>{b.emoji}</span>
              <div className="flex-1">
                <p className={`font-bold ${unlocked ? "text-amber-200" : "text-slate-400"}`}>{b.name}</p>
                <p className="mt-0.5 text-xs text-slate-500">{b.description}</p>
                {unlocked && (
                  <span className="mt-2 inline-block rounded-md bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-300">
                    ✓ Unlocked
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}