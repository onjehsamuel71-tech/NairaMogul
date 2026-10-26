import { useState } from "react";
import type { GameState } from "@/types/game";

function formatNaira(n: number): string {
  if (n >= 1000000000) return `₦${(n / 1000000000).toFixed(2)}B`;
  if (n >= 1000000) return `₦${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `₦${(n / 1000).toFixed(1)}K`;
  return `₦${Math.round(n).toLocaleString()}`;
}

const LOAN_TIERS = [
  { amount: 500000, rate: 0.02, label: "Quick Cash" },
  { amount: 2000000, rate: 0.025, label: "Growth Loan" },
  { amount: 10000000, rate: 0.03, label: "Expansion Loan" },
  { amount: 50000000, rate: 0.035, label: "Mogul Loan" },
];

export function FinanceBank({
  game,
  onTakeLoan,
  onRepayLoan,
  onToggleAutoDebit,
  onBuyInsurance,
}: {
  game: GameState;
  onTakeLoan: (amount: number, rate: number) => void;
  onRepayLoan: (id: string) => void;
  onToggleAutoDebit: (id: string) => void;
  onBuyInsurance: () => void;
}) {
  const [selected, setSelected] = useState(0);
  const totalDebt = game.loans.reduce((s, l) => s + l.remaining, 0);
  const hasMansion = game.lifestyle.some(
    (id) => id.startsWith("banana") || id.startsWith("diplomatic") || id.startsWith("lekki")
  );
  const loanBlocked = game.sapaMeter > 70 && !hasMansion;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl font-bold text-emerald-100">Finance & Bank</h2>
        <p className="mt-1 text-sm text-emerald-300/70">
          Take micro-loans, manage debt, and protect your empire with insurance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-rose-900/50 bg-gradient-to-br from-rose-950/40 to-slate-900 p-5 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-400/70">Total Debt</p>
          <p className="mt-1 font-serif text-2xl font-bold text-rose-200">{formatNaira(totalDebt)}</p>
        </div>
        <div className="rounded-2xl border border-emerald-900/50 bg-gradient-to-br from-emerald-950/60 to-slate-900 p-5 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400/70">Available Cash</p>
          <p className="mt-1 font-serif text-2xl font-bold text-emerald-200">{formatNaira(game.cash)}</p>
        </div>
        <div className="rounded-2xl border border-sky-900/50 bg-gradient-to-br from-sky-950/40 to-slate-900 p-5 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-400/70">Insurance</p>
          <p className="mt-1 font-serif text-2xl font-bold text-sky-200">
            {game.insurance ? "Active ✓" : "None"}
          </p>
        </div>
      </div>

      {loanBlocked && (
        <div className="rounded-xl border border-rose-700/60 bg-rose-950/40 p-4">
          <p className="text-sm font-semibold text-rose-200">
            ⚠️ Loan applications blocked — Sapa Meter above 70%. Buy a luxury mansion to restore access.
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
          <h3 className="font-serif text-xl font-bold text-emerald-100">Take a Loan</h3>
          <div className="mt-4 space-y-2">
            {LOAN_TIERS.map((t, i) => (
              <button
                key={t.label}
                onClick={() => setSelected(i)}
                className={`w-full rounded-xl border p-3 text-left transition ${
                  selected === i
                    ? "border-emerald-500 bg-emerald-900/40"
                    : "border-slate-800 bg-slate-950/40 hover:border-emerald-700/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{t.label}</span>
                  <span className="font-serif font-bold text-emerald-300">{formatNaira(t.amount)}</span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  {(t.rate * 100).toFixed(1)}% daily interest · 10-day term
                </p>
              </button>
            ))}
          </div>
          <button
            onClick={() => onTakeLoan(LOAN_TIERS[selected].amount, LOAN_TIERS[selected].rate)}
            disabled={loanBlocked}
            className={`mt-4 w-full rounded-xl py-3 font-bold transition ${
              loanBlocked
                ? "cursor-not-allowed bg-slate-800 text-slate-500"
                : "bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 shadow-md shadow-emerald-900/40 hover:scale-[1.02] active:scale-95"
            }`}
          >
            Borrow {formatNaira(LOAN_TIERS[selected].amount)}
          </button>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
            <h3 className="font-serif text-xl font-bold text-emerald-100">Active Loans</h3>
            {game.loans.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">No active loans. Debt-free and proud. 🕊️</p>
            ) : (
              <div className="mt-4 space-y-3">
                {game.loans.map((l) => (
                  <div key={l.id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-200">{formatNaira(l.remaining)}</span>
                      <span className="text-xs text-slate-500">
                        {(l.rate * 100).toFixed(1)}%/day
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">Due Day {l.dueDay}</p>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => onRepayLoan(l.id)}
                        disabled={game.cash < l.remaining}
                        className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                          game.cash >= l.remaining
                            ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                            : "cursor-not-allowed bg-slate-800 text-slate-500"
                        }`}
                      >
                        Repay
                      </button>
                      <button
                        onClick={() => onToggleAutoDebit(l.id)}
                        className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
                          l.autoDebit
                            ? "bg-sky-500 text-slate-950"
                            : "border border-slate-700 text-slate-400 hover:border-sky-600"
                        }`}
                      >
                        {l.autoDebit ? "Auto-Debit ON" : "Auto-Debit OFF"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-sky-900/50 bg-gradient-to-br from-sky-950/40 to-slate-900 p-6 shadow-lg">
            <h3 className="font-serif text-xl font-bold text-sky-100">Emergency Insurance</h3>
            <p className="mt-2 text-sm text-sky-200/70">
              {game.insurance
                ? "Your empire is protected against fire, theft, and union strikes."
                : "Protect your assets against fire, theft, and union strikes for ₦250,000."}
            </p>
            {!game.insurance && (
              <button
                onClick={onBuyInsurance}
                disabled={game.cash < 250000}
                className={`mt-3 w-full rounded-xl py-2.5 text-sm font-bold transition ${
                  game.cash >= 250000
                    ? "bg-gradient-to-r from-sky-500 to-sky-600 text-slate-950 hover:scale-[1.02] active:scale-95"
                    : "cursor-not-allowed bg-slate-800 text-slate-500"
                }`}
              >
                Buy Insurance · ₦250,000
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}