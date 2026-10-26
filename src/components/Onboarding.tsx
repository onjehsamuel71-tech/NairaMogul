import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Industry, City, MogulTitle } from "@/types/game";
import { INDUSTRIES, CITIES, MOGUL_TITLES } from "@/lib/gameData";

const STARTING_INDUSTRIES: Industry[] = ["transport", "buka", "pos", "akara", "music", "gadgets"];
const STARTING_CITIES: City[] = ["Ibadan", "Benin City", "Enugu"];

export function Onboarding({
  onStart,
}: {
  onStart: (name: string, industry: Industry, city: City, email: string, title: MogulTitle) => void;
}) {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState<MogulTitle>("chief");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState<Industry>("transport");
  const [city, setCity] = useState<City>("Ibadan");

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const nameValid = companyName.trim().length >= 3;

  const steps = ["Account & Profile", "Company Name", "Industry", "Headquarters"];

  const canNext =
    (step === 0 && emailValid) ||
    (step === 1 && nameValid) ||
    step === 2 ||
    step === 3;

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onStart(companyName.trim(), industry, city, email.trim(), title);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-8">
        <header className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-400">Empire Builder</p>
          <h1 className="mt-2 font-serif text-4xl font-bold text-emerald-100 sm:text-5xl">
            NAIRA <span className="text-amber-400">MOGUL</span>
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-emerald-300/70">
            Build a business empire from ₦100,000. Outsmart rivals. Escape Sapa.
          </p>
        </header>

        <div className="mt-8 flex items-center justify-center gap-2">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                  i <= step
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-900/40"
                    : "border border-slate-700 text-slate-500"
                }`}
              >
                {i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`h-0.5 w-6 sm:w-12 ${i < step ? "bg-emerald-500" : "bg-slate-800"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex-1">
          <div className="mx-auto max-w-2xl rounded-2xl border border-emerald-900/50 bg-slate-900/70 p-6 shadow-2xl shadow-emerald-950/40 backdrop-blur sm:p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Step {step + 1} of 4
            </p>
            <h2 className="mt-1 font-serif text-2xl font-bold text-emerald-100">{steps[step]}</h2>

            {step === 0 && (
              <div className="mt-6 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-emerald-200">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="mogul@nairamogul.ng"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-slate-700 bg-slate-950/60 text-slate-100 placeholder:text-slate-600 focus-visible:border-emerald-500"
                  />
                  <p className="text-xs text-slate-500">
                    Used to save & restore your empire across devices.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-emerald-200">Mogul Title</Label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {(Object.keys(MOGUL_TITLES) as MogulTitle[]).map((key) => {
                      const t = MOGUL_TITLES[key];
                      const active = title === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setTitle(key)}
                          className={`rounded-xl border p-4 text-left transition ${
                            active
                              ? "border-emerald-500 bg-emerald-900/40 shadow-md shadow-emerald-900/30"
                              : "border-slate-800 bg-slate-950/50 hover:border-emerald-700/60"
                          }`}
                        >
                          <p className="text-2xl">{t.emoji}</p>
                          <p className={`mt-1 text-sm font-bold ${active ? "text-emerald-200" : "text-slate-300"}`}>
                            {t.label}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500">
                            Events will greet you as "{t.greeting}"
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-emerald-200">
                    Company Name
                  </Label>
                  <Input
                    id="company"
                    placeholder="e.g. Eko Express Logistics"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    maxLength={40}
                    className="border-slate-700 bg-slate-950/60 text-slate-100 placeholder:text-slate-600 focus-visible:border-emerald-500"
                  />
                  <p className="text-xs text-slate-500">
                    Minimum 3 characters. This name appears on leaderboards and share cards.
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/30 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Preview</p>
                  <p className="mt-1 font-serif text-lg text-emerald-100">
                    {MOGUL_TITLES[title].greeting} {companyName.trim() || "Your Company"}
                  </p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {STARTING_INDUSTRIES.map((key) => {
                  const ind = INDUSTRIES[key];
                  const active = industry === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setIndustry(key)}
                      className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
                        active
                          ? "border-emerald-500 bg-emerald-900/40 shadow-md shadow-emerald-900/30"
                          : "border-slate-800 bg-slate-950/50 hover:border-emerald-700/60"
                      }`}
                    >
                      <span className="text-3xl">{ind.emoji}</span>
                      <div className="flex-1">
                        <p className={`text-sm font-bold ${active ? "text-emerald-200" : "text-slate-200"}`}>
                          {ind.name}
                        </p>
                        <p className="text-xs text-slate-400">{ind.tagline}</p>
                        <p className="mt-1 text-xs font-semibold text-amber-400">Bonus: {ind.bonus}</p>
                      </div>
                    </button>
                  );
                })}
                <p className="sm:col-span-2 text-center text-xs text-slate-500">
                  + {Object.keys(INDUSTRIES).length - STARTING_INDUSTRIES.length} more industries unlock in the Asset Market as you grow.
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="mt-6 space-y-3">
                {STARTING_CITIES.map((key) => {
                  const c = CITIES.find((x) => x.id === key);
                  if (!c) return null;
                  const active = city === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setCity(key)}
                      className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition ${
                        active
                          ? "border-emerald-500 bg-emerald-900/40 shadow-md shadow-emerald-900/30"
                          : "border-slate-800 bg-slate-950/50 hover:border-emerald-700/60"
                      }`}
                    >
                      <span className="text-3xl">{c.emoji}</span>
                      <div className="flex-1">
                        <p className={`font-bold ${active ? "text-emerald-200" : "text-slate-200"}`}>{c.id}</p>
                        <p className="text-xs text-slate-400">{c.areas.join(" · ")}</p>
                      </div>
                    </button>
                  );
                })}
                <div className="rounded-xl border border-amber-900/40 bg-amber-950/20 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Starting Capital</p>
                  <p className="mt-1 font-serif text-2xl font-bold text-amber-200">₦100,000</p>
                  <p className="mt-1 text-xs text-amber-300/70">
                    Spend wisely — every naira counts in the first week.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-8 flex gap-3">
              {step > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800"
                >
                  Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!canNext}
                className={`flex-1 ${
                  canNext
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 shadow-lg shadow-emerald-900/40 hover:scale-[1.02] hover:from-emerald-400 hover:to-emerald-500 active:scale-95"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                {step === 3 ? "🚀 Launch Empire" : "Continue"}
              </Button>
            </div>
          </div>
        </div>

        <footer className="mt-6 text-center text-xs text-slate-600">
          Guest play — your empire saves automatically to this browser.
        </footer>
      </div>
    </div>
  );
}