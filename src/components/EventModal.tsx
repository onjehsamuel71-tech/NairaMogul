import type { RandomEvent, MogulTitle } from "@/types/game";
import { MOGUL_TITLES } from "@/lib/gameData";

function formatNaira(n: number): string {
  return `₦${Math.abs(Math.round(n)).toLocaleString()}`;
}

export function EventModal({
  event,
  greeting,
  onChoose,
}: {
  event: RandomEvent;
  greeting: MogulTitle;
  onChoose: (index: number) => void;
}) {
  const title = MOGUL_TITLES[greeting];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur">
      <div className="w-full max-w-lg animate-[popIn_0.3s_ease-out] rounded-2xl border border-amber-700/60 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <span className="text-5xl">{event.emoji}</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
              {title.greeting}, breaking news
            </p>
            <h3 className="mt-1 font-serif text-2xl font-bold text-amber-100">{event.title}</h3>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-300">{event.description}</p>

        <div className="mt-5 space-y-3">
          {event.choices.map((c, i) => (
            <button
              key={i}
              onClick={() => onChoose(i)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/60 p-4 text-left transition hover:border-amber-500 hover:bg-amber-950/20 active:scale-[0.98]"
            >
              <p className="font-bold text-slate-100">{c.label}</p>
              <p className="mt-0.5 text-xs text-slate-400">{c.description}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {c.cashDelta !== undefined && (
                  <span className={`rounded-md px-2 py-0.5 font-semibold ${c.cashDelta >= 0 ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"}`}>
                    {c.cashDelta >= 0 ? "+" : "-"}{formatNaira(c.cashDelta)}
                  </span>
                )}
                {c.credDelta !== undefined && (
                  <span className={`rounded-md px-2 py-0.5 font-semibold ${c.credDelta >= 0 ? "bg-sky-500/20 text-sky-300" : "bg-rose-500/20 text-rose-300"}`}>
                    {c.credDelta >= 0 ? "+" : ""}{c.credDelta} Cred
                  </span>
                )}
                {c.revenueBoost !== undefined && c.revenueBoost > 0 && (
                  <span className="rounded-md bg-amber-500/20 px-2 py-0.5 font-semibold text-amber-300">
                    +{formatNaira(c.revenueBoost)} bonus
                  </span>
                )}
                {c.gamble && (
                  <span className="rounded-md bg-rose-500/20 px-2 py-0.5 font-semibold text-rose-300">
                    {Math.round(c.gamble.winChance * 100)}% win chance
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}