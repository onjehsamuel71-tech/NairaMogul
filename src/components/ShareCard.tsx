import { useState } from "react";
import type { GameState } from "@/types/game";
import { MOGUL_TITLES, INDUSTRIES } from "@/lib/gameData";

function formatNaira(n: number): string {
  if (n >= 1000000000) return `₦${(n / 1000000000).toFixed(2)}B`;
  if (n >= 1000000) return `₦${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `₦${(n / 1000).toFixed(1)}K`;
  return `₦${Math.round(n).toLocaleString()}`;
}

export function ShareCard({
  game,
  badge,
  onClose,
}: {
  game: GameState;
  badge: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const title = MOGUL_TITLES[game.mogulTitle];
  const industry = INDUSTRIES[game.industry];

  const shareText = `I just built a ${formatNaira(game.netWorth)} ${industry.name} empire in Naira Mogul! Can you beat my net worth? 🏆 Rank: ${badge}`;

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Naira Mogul", text: shareText, url });
        return;
      } catch {
        // fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(`${shareText} ${url}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${window.location.href}`)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.href)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur">
      <div className="w-full max-w-md animate-[popIn_0.3s_ease-out]">
        <div className="rounded-2xl border border-amber-600/60 bg-gradient-to-br from-emerald-950 via-slate-900 to-amber-950 p-6 shadow-2xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">
              Mogul CEO Certificate
            </p>
            <div className="mt-4 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-amber-500/60 bg-gradient-to-br from-amber-500/20 to-emerald-500/20 text-4xl">
                {title.emoji}
              </div>
            </div>
            <p className="mt-3 text-xs uppercase tracking-widest text-emerald-400">
              {title.greeting}
            </p>
            <h3 className="mt-1 font-serif text-2xl font-bold text-amber-100">{game.companyName}</h3>
            <p className="mt-1 text-xs text-emerald-300/70">
              {industry.emoji} {industry.name} · {game.city}
            </p>

            <div className="mt-5 rounded-xl border border-amber-700/40 bg-slate-950/60 p-4">
              <p className="text-xs text-amber-400/70">Net Worth</p>
              <p className="font-serif text-3xl font-bold text-amber-200">{formatNaira(game.netWorth)}</p>
              <p className="mt-2 inline-block rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1 text-xs font-bold text-slate-950">
                🏆 {badge}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-slate-950/50 p-2">
                <p className="text-xs text-slate-500">Level</p>
                <p className="font-serif font-bold text-emerald-300">Tier {game.level}</p>
              </div>
              <div className="rounded-lg bg-slate-950/50 p-2">
                <p className="text-xs text-slate-500">Cred</p>
                <p className="font-serif font-bold text-sky-300">{game.streetCred}</p>
              </div>
              <div className="rounded-lg bg-slate-950/50 p-2">
                <p className="text-xs text-slate-500">Day</p>
                <p className="font-serif font-bold text-amber-300">{game.day}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-3 text-center text-sm font-bold text-slate-950 shadow-md transition hover:scale-[1.02] active:scale-95"
          >
            💬 WhatsApp
          </a>
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 py-3 text-center text-sm font-bold text-slate-950 shadow-md transition hover:scale-[1.02] active:scale-95"
          >
            🐦 X
          </a>
          <button
            onClick={handleShare}
            className="flex-1 rounded-xl border border-amber-600/60 bg-slate-900/60 py-3 text-sm font-bold text-amber-200 transition hover:bg-amber-950/40 active:scale-95"
          >
            {copied ? "✓ Copied" : "📋 Copy"}
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-900/60 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
        >
          Close
        </button>
      </div>
    </div>
  );
}