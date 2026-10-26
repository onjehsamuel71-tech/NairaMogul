import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Header } from "@/components/Header";
import { Ticker } from "@/components/Ticker";
import { Dashboard } from "@/components/Dashboard";
import { AssetMarket } from "@/components/AssetMarket";
import { LifestyleMarket } from "@/components/LifestyleMarket";
import { FinanceBank } from "@/components/FinanceBank";
import { Analytics } from "@/components/Analytics";
import { Leaderboard } from "@/components/Leaderboard";
import { BadgesTab } from "@/components/BadgesTab";
import { EventModal } from "@/components/EventModal";
import { Onboarding } from "@/components/Onboarding";
import { ShareCard } from "@/components/ShareCard";
import { AuctionMarket } from "@/components/AuctionMarket";
import type { GameState, Industry, City, RandomEvent, MogulTitle, DistressedListing } from "@/types/game";
import {
  INDUSTRIES,
  EVENTS,
  ASSET_CATALOG,
  LIFESTYLE_CATALOG,
  CITIES,
  BADGES,
  RIVAL_NAMES,
  TICKER_TEMPLATES,
  AUCTION_COMPANIES,
} from "@/lib/gameData";

const TICK_MS = 60000;
const EVENT_MS = 300000;
const AUCTION_MS = 180000;
const STORAGE_KEY = "naira_mogul_save_v4";

function createInitialState(
  companyName: string,
  industry: Industry,
  city: City,
  email: string,
  mogulTitle: MogulTitle
): GameState {
  return {
    companyName,
    industry,
    city,
    cash: 100000,
    netWorth: 100000,
    streetCred: 10,
    sapaMeter: 5,
    level: 1,
    assets: [],
    lifestyle: [],
    loans: [],
    insurance: false,
    day: 1,
    log: [`Day 1: ${companyName} founded in ${city}. ₦100,000 seed capital secured. Time to hustle!`],
    branches: [city],
    generalManager: false,
    unlockedBadges: [],
    ticker: [`📡 Welcome to Naira Mogul, ${companyName}! Your empire begins now.`],
    ledger: [],
    bankrupt: false,
    auctions: [],
    acquisitions: 0,
    email,
    mogulTitle,
  };
}

function loadSave(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameState;
    if (!parsed.ledger) parsed.ledger = [];
    if (!parsed.lifestyle) parsed.lifestyle = [];
    if (!parsed.auctions) parsed.auctions = [];
    if (parsed.acquisitions === undefined) parsed.acquisitions = 0;
    if (!parsed.email) parsed.email = "";
    if (!parsed.mogulTitle) parsed.mogulTitle = "chief";
    return parsed;
  } catch {
    return null;
  }
}

function generateAuction(day: number): DistressedListing {
  const company = AUCTION_COMPANIES[Math.floor(Math.random() * AUCTION_COMPANIES.length)];
  const city = CITIES[Math.floor(Math.random() * CITIES.length)].id;
  const baseValue = 500000 + Math.random() * 45000000;
  const discount = 30 + Math.floor(Math.random() * 21);
  const askPrice = Math.round(baseValue * (1 - discount / 100));
  return {
    id: crypto.randomUUID(),
    companyName: company.name,
    industry: company.industry,
    city,
    netWorth: Math.round(baseValue),
    askPrice,
    discount,
    expiresDay: day + 5,
    emoji: company.emoji,
  };
}

export default function App() {
  const [game, setGame] = useState<GameState | null>(null);
  const [tab, setTab] = useState<"hub" | "market" | "lifestyle" | "bank" | "analytics" | "board" | "badges" | "auction">("hub");
  const [activeEvent, setActiveEvent] = useState<RandomEvent | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; tone: "good" | "bad" | "info" } | null>(null);
  const [milestoneCard, setMilestoneCard] = useState<string | null>(null);
  const badgeCheckRef = useRef<Set<string>>(new Set());

  const notify = useCallback((msg: string, tone: "good" | "bad" | "info" = "info") => {
    setToast({ msg, tone });
    window.setTimeout(() => setToast(null), 2600);
  }, []);

  useEffect(() => {
    const saved = loadSave();
    if (saved) setGame(saved);
  }, []);

  useEffect(() => {
    if (game) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
      } catch {
        // ignore
      }
    }
  }, [game]);

  const handleStart = useCallback(
    (name: string, industry: Industry, city: City, email: string, title: MogulTitle) => {
      setGame(createInitialState(name, industry, city, email, title));
    },
    []
  );

  const handleReset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setGame(null);
    setTab("hub");
  }, []);

  useEffect(() => {
    if (!game) return;
    const id = window.setInterval(() => {
      setGame((prev) => {
        if (!prev || prev.bankrupt) return prev;
        const industry = INDUSTRIES[prev.industry];
        const gmBonus = prev.generalManager ? 1.1 : 0.85;
        const branchBonus = 1 + (prev.branches.length - 1) * 0.15;
        let revenue = 0;
        let expenses = 0;
        for (const a of prev.assets) {
          const def = ASSET_CATALOG.find((x) => x.id === a.assetId);
          if (!def) continue;
          revenue += def.baseRevenue * a.level * industry.revenueMult * gmBonus * branchBonus;
          expenses += def.baseMaintenance * a.level;
        }
        const loanInterest = prev.loans.reduce((s, l) => s + l.remaining * l.rate, 0);
        expenses += loanInterest;
        const net = revenue - expenses;
        let cash = prev.cash + net;

        let loans = prev.loans;
        for (const l of prev.loans) {
          if (l.autoDebit && cash >= l.remaining * 0.1) {
            const payment = Math.min(cash, l.remaining);
            cash -= payment;
            loans = loans.map((x) => (x.id === l.id ? { ...x, remaining: x.remaining - payment } : x));
          }
        }
        loans = loans.filter((l) => l.remaining > 0.01);

        const assetValue = prev.assets.reduce((s, a) => {
          const def = ASSET_CATALOG.find((x) => x.id === a.assetId);
          return s + (def ? def.cost * a.level * 0.7 : 0);
        }, 0);
        const lifestyleValue = prev.lifestyle.reduce((s, id) => {
          const def = LIFESTYLE_CATALOG.find((x) => x.id === id);
          return s + (def ? def.cost * 0.5 : 0);
        }, 0);
        const debt = loans.reduce((s, l) => s + l.remaining, 0);
        const netWorth = cash + assetValue + lifestyleValue - debt;
        const sapa = Math.max(0, Math.min(100, prev.sapaMeter + (net < 0 ? 3 : -1)));
        const cred = Math.max(0, Math.min(100, prev.streetCred + (net > 0 ? 1 : 0)));
        const level = netWorth > 200000000 ? 5 : netWorth > 50000000 ? 4 : netWorth > 10000000 ? 3 : netWorth > 1000000 ? 2 : 1;

        let ticker = prev.ticker;
        if (prev.assets.length > 0 && revenue > 0) {
          const randomAsset = prev.assets[Math.floor(Math.random() * prev.assets.length)];
          const def = ASSET_CATALOG.find((x) => x.id === randomAsset.assetId);
          if (def) {
            const amt = Math.round(def.baseRevenue * randomAsset.level * industry.revenueMult * gmBonus);
            const template = TICKER_TEMPLATES[Math.floor(Math.random() * TICKER_TEMPLATES.length)];
            const line = template.replace("{asset}", def.name).replace("{amt}", amt.toLocaleString());
            ticker = [line, ...prev.ticker].slice(0, 12);
          }
        }

        if (sapa >= 100 && cash < 0) {
          const rival = RIVAL_NAMES[Math.floor(Math.random() * RIVAL_NAMES.length)];
          const bankruptcyLine = `🚨 BREAKING: ${prev.companyName} just lost all assets and went completely bankrupt trying to buy fuel! ${rival} is laughing.`;
          return {
            ...prev,
            cash: 0,
            netWorth: 0,
            sapaMeter: 100,
            bankrupt: true,
            assets: [],
            lifestyle: [],
            loans: [],
            log: [`Day ${prev.day}: BANKRUPTCY! ${prev.companyName} collapsed.`, ...prev.log].slice(0, 40),
            ticker: [bankruptcyLine, ...prev.ticker].slice(0, 12),
          };
        }

        const ledgerEntry = { day: prev.day, revenue, expenses, net };
        const ledger = [...prev.ledger, ledgerEntry].slice(-30);
        const log = [`Day ${prev.day + 1}: Cashflow ${net >= 0 ? "+" : ""}₦${Math.round(net).toLocaleString()}`, ...prev.log].slice(0, 40);
        return { ...prev, cash, netWorth, sapaMeter: sapa, streetCred: cred, level, day: prev.day + 1, log, ticker, loans, ledger };
      });
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [game?.companyName]);

  useEffect(() => {
    if (!game || game.bankrupt) return;
    const id = window.setInterval(() => {
      const ev = EVENTS[Math.floor(Math.random() * EVENTS.length)];
      setActiveEvent(ev);
    }, EVENT_MS);
    return () => window.clearInterval(id);
  }, [game?.companyName, game?.bankrupt]);

  useEffect(() => {
    if (!game || game.bankrupt) return;
    const id = window.setInterval(() => {
      setGame((prev) => {
        if (!prev) return prev;
        const listing = generateAuction(prev.day);
        const auctions = [listing, ...prev.auctions].slice(0, 8);
        return { ...prev, auctions };
      });
    }, AUCTION_MS);
    return () => window.clearInterval(id);
  }, [game?.companyName, game?.bankrupt]);

  useEffect(() => {
    if (!game) return;
    const newlyUnlocked: string[] = [];
    const check = (id: string, cond: boolean) => {
      if (cond && !game.unlockedBadges.includes(id) && !badgeCheckRef.current.has(id)) {
        newlyUnlocked.push(id);
        badgeCheckRef.current.add(id);
      }
    };
    const countIndustry = (ind: string) =>
      game.assets.filter((a) => ASSET_CATALOG.find((d) => d.id === a.assetId)?.industry === ind).length;

    check("first_thousand", game.netWorth >= 1000);
    check("first_million", game.netWorth >= 1000000);
    check("ten_million", game.netWorth >= 10000000);
    check("fifty_million", game.netWorth >= 50000000);
    check("sapa_escape", game.sapaMeter < 10 && game.day > 5);
    check("transport_kingpin", countIndustry("transport") >= 5);
    check("amala_billionaire", countIndustry("buka") >= 5);
    check("pos_overlord", countIndustry("pos") >= 5);
    check("landlord", countIndustry("realestate") >= 3);
    check("hitmaker", countIndustry("entertainment") >= 3);
    check("agro_baron", countIndustry("agro") >= 3);
    check("snack_king", countIndustry("streetfood") >= 3);
    check("provision_boss", countIndustry("retail") >= 3);
    check("style_icon", countIndustry("fashion") >= 3);
    check("hustle_hub", countIndustry("services") >= 3);
    check("branch_builder", game.branches.length >= 2);
    check("national_reach", game.branches.length >= 4);
    check("debt_free", game.loans.length === 0 && game.day > 3);
    check("sapa_survivor", game.sapaMeter > 80);
    check("flexer", game.lifestyle.length >= 3);
    check("hypercar_owner", game.lifestyle.some((id) => ["chiron", "boattail", "huayra", "jesko"].includes(id)));
    check("jet_setter", game.lifestyle.some((id) => ["gulfstream", "global7500", "a380", "yacht"].includes(id)));
    check("time_lord", game.lifestyle.some((id) => ["patek", "rm"].includes(id)));
    check("bag_collector", game.lifestyle.includes("himalayan"));
    check("wild_king", game.lifestyle.some((id) => ["panther", "tiger"].includes(id)));
    check("hostile_takeover", game.acquisitions >= 1);
    check("vulture_capitalist", game.acquisitions >= 3);

    if (newlyUnlocked.length > 0) {
      const badge = BADGES.find((b) => b.id === newlyUnlocked[0]);
      if (badge) {
        notify(`🏆 Badge unlocked: ${badge.name}!`, "good");
        setMilestoneCard(badge.id);
      }
      setGame((prev) => (prev ? { ...prev, unlockedBadges: [...prev.unlockedBadges, ...newlyUnlocked] } : prev));
    }
  }, [game?.netWorth, game?.sapaMeter, game?.assets.length, game?.branches.length, game?.loans.length, game?.day, game?.lifestyle.length, game?.acquisitions, notify]);

  const resolveEvent = useCallback((choiceIndex: number) => {
    if (!activeEvent || !game) return;
    const choice = activeEvent.choices[choiceIndex];
    setGame((prev) => {
      if (!prev) return prev;
      let cash = prev.cash + (choice.cashDelta ?? 0);
      const cred = prev.streetCred + (choice.credDelta ?? 0);
      const sapa = prev.sapaMeter + (choice.sapaDelta ?? 0);
      if (choice.gamble) {
        const win = Math.random() < choice.gamble.winChance;
        cash += win ? choice.gamble.winCash : choice.gamble.loseCash;
        notify(win ? "Audit passed! No fine. 😅" : `Bribe exposed! -₦${Math.abs(choice.gamble.loseCash).toLocaleString()} fine! 😱`, win ? "good" : "bad");
      } else if ((choice.cashDelta ?? 0) < 0) {
        notify(`-₦${Math.abs(choice.cashDelta ?? 0).toLocaleString()} — wahala dey!`, "bad");
      } else if ((choice.cashDelta ?? 0) > 0) {
        notify(`+₦${(choice.cashDelta ?? 0).toLocaleString()} — money dey enter! 💰`, "good");
      }
      if (choice.revenueBoost && choice.revenueBoost > 0) cash += choice.revenueBoost;
      const log = [`Day ${prev.day}: ${activeEvent.title} → ${choice.label}`, ...prev.log].slice(0, 40);
      return { ...prev, cash, streetCred: Math.max(0, Math.min(100, cred)), sapaMeter: Math.max(0, Math.min(100, sapa)), log };
    });
    setActiveEvent(null);
  }, [activeEvent, game, notify]);

  const buyAsset = useCallback((assetId: string) => {
    setGame((prev) => {
      if (!prev) return prev;
      const def = ASSET_CATALOG.find((x) => x.id === assetId);
      if (!def) return prev;
      const existing = prev.assets.find((a) => a.assetId === assetId);
      const cost = existing ? Math.round(def.cost * 0.6) : def.cost;
      if (prev.cash < cost) {
        notify("Capital no reach! Go make more money. 😅", "bad");
        return prev;
      }
      const assets = existing
        ? prev.assets.map((a) => (a.assetId === assetId ? { ...a, level: a.level + 1 } : a))
        : [...prev.assets, { assetId, level: 1, autoManager: false, city: prev.city }];
      const log = [`Day ${prev.day}: Acquired ${def.name}${existing ? " (upgraded)" : ""} for ₦${cost.toLocaleString()}`, ...prev.log].slice(0, 40);
      notify(`${def.name} ${existing ? "upgraded" : "acquired"}! Business dey grow 🚀`, "good");
      return { ...prev, cash: prev.cash - cost, assets, log };
    });
  }, [notify]);

  const buyLifestyle = useCallback((id: string) => {
    setGame((prev) => {
      if (!prev || prev.lifestyle.includes(id)) return prev;
      const def = LIFESTYLE_CATALOG.find((x) => x.id === id);
      if (!def) return prev;
      if (prev.cash < def.cost) {
        notify("You no get money for this flex yet. 😅", "bad");
        return prev;
      }
      notify(`${def.name} acquired! You don blow 💎`, "good");
      return {
        ...prev,
        cash: prev.cash - def.cost,
        lifestyle: [...prev.lifestyle, id],
        streetCred: Math.min(100, prev.streetCred + def.credBoost),
        sapaMeter: Math.max(0, prev.sapaMeter - def.sapaReduction),
        log: [`Day ${prev.day}: Flexed with ${def.name} (-₦${def.cost.toLocaleString()})`, ...prev.log].slice(0, 40),
      };
    });
  }, [notify]);

  const buyAuction = useCallback((listing: DistressedListing) => {
    setGame((prev) => {
      if (!prev) return prev;
      if (prev.cash < listing.askPrice) {
        notify("Cash no reach for this acquisition. 😅", "bad");
        return prev;
      }
      const industryAssets = ASSET_CATALOG.filter((a) => a.industry === listing.industry);
      const target = industryAssets[Math.floor(Math.random() * industryAssets.length)];
      const existing = prev.assets.find((a) => a.assetId === target.id);
      const assets = existing
        ? prev.assets.map((a) => (a.assetId === target.id ? { ...a, level: a.level + 2 } : a))
        : [...prev.assets, { assetId: target.id, level: 2, autoManager: false, city: listing.city }];
      notify(`🦅 Acquired ${listing.companyName}! +${target.name} Lv.2`, "good");
      return {
        ...prev,
        cash: prev.cash - listing.askPrice,
        assets,
        acquisitions: prev.acquisitions + 1,
        auctions: prev.auctions.filter((a) => a.id !== listing.id),
        streetCred: Math.min(100, prev.streetCred + 4),
        log: [`Day ${prev.day}: Hostile buyout of ${listing.companyName} for ₦${listing.askPrice.toLocaleString()}`, ...prev.log].slice(0, 40),
      };
    });
  }, [notify]);

  const toggleManager = useCallback((assetId: string) => {
    setGame((prev) => {
      if (!prev) return prev;
      const assets = prev.assets.map((a) => (a.assetId === assetId ? { ...a, autoManager: !a.autoManager } : a));
      return { ...prev, assets };
    });
  }, []);

  const hireGM = useCallback(() => {
    setGame((prev) => {
      if (!prev || prev.generalManager) return prev;
      if (prev.cash < 3000000) {
        notify("Need ₦3,000,000 to hire a GM.", "bad");
        return prev;
      }
      notify("General Manager hired! Passive income 24/7. 👔", "good");
      return { ...prev, cash: prev.cash - 3000000, generalManager: true, log: [`Day ${prev.day}: Hired General Manager (-₦3,000,000)`, ...prev.log].slice(0, 40) };
    });
  }, [notify]);

  const openBranch = useCallback((city: City) => {
    setGame((prev) => {
      if (!prev || prev.branches.includes(city)) return prev;
      const cityDef = CITIES.find((c) => c.id === city);
      if (!cityDef) return prev;
      if (prev.netWorth < cityDef.netWorthRequired) {
        notify(`Need ₦${cityDef.netWorthRequired.toLocaleString()} net worth to unlock ${city}.`, "bad");
        return prev;
      }
      if (prev.cash < cityDef.unlockCost) {
        notify(`Need ₦${cityDef.unlockCost.toLocaleString()} cash to open ${city}.`, "bad");
        return prev;
      }
      notify(`Branch opened in ${city}! Empire expanding 🏙️`, "good");
      return {
        ...prev,
        cash: prev.cash - cityDef.unlockCost,
        branches: [...prev.branches, city],
        log: [`Day ${prev.day}: Opened branch in ${city} (-₦${cityDef.unlockCost.toLocaleString()})`, ...prev.log].slice(0, 40),
      };
    });
  }, [notify]);

  const takeLoan = useCallback((amount: number, rate: number) => {
    setGame((prev) => {
      if (!prev) return prev;
      const hasMansion = prev.lifestyle.some((id) => id.startsWith("banana") || id.startsWith("diplomatic") || id.startsWith("lekki"));
      if (prev.sapaMeter > 70 && !hasMansion) {
        notify("Loan rejected — Sapa Meter too high! 😭", "bad");
        return prev;
      }
      const loan = { id: crypto.randomUUID(), principal: amount, remaining: amount, rate, dueDay: prev.day + 10, autoDebit: false };
      const log = [`Day ${prev.day}: Took micro-loan of ₦${amount.toLocaleString()} @ ${(rate * 100).toFixed(1)}%/day`, ...prev.log].slice(0, 40);
      notify(`Loan approved: ₦${amount.toLocaleString()} — spend wisely!`, "good");
      return { ...prev, cash: prev.cash + amount, loans: [...prev.loans, loan], sapaMeter: Math.min(100, prev.sapaMeter + 8), log };
    });
  }, [notify]);

  const repayLoan = useCallback((id: string) => {
    setGame((prev) => {
      if (!prev) return prev;
      const loan = prev.loans.find((l) => l.id === id);
      if (!loan || prev.cash < loan.remaining) {
        notify("Cash no reach to repay. Hustle more!", "bad");
        return prev;
      }
      const log = [`Day ${prev.day}: Repaid loan of ₦${loan.remaining.toLocaleString()}`, ...prev.log].slice(0, 40);
      notify("Loan cleared! Debt free 🎉", "good");
      return { ...prev, cash: prev.cash - loan.remaining, loans: prev.loans.filter((l) => l.id !== id), sapaMeter: Math.max(0, prev.sapaMeter - 12), log };
    });
  }, [notify]);

  const toggleAutoDebit = useCallback((id: string) => {
    setGame((prev) => {
      if (!prev) return prev;
      const loans = prev.loans.map((l) => (l.id === id ? { ...l, autoDebit: !l.autoDebit } : l));
      return { ...prev, loans };
    });
  }, []);

  const buyInsurance = useCallback(() => {
    setGame((prev) => {
      if (!prev || prev.insurance) return prev;
      if (prev.cash < 250000) {
        notify("Need ₦250,000 for insurance.", "bad");
        return prev;
      }
      notify("Insurance active — you can sleep well now 😴", "good");
      return { ...prev, cash: prev.cash - 250000, insurance: true, log: [`Day ${prev.day}: Purchased emergency insurance (-₦250,000)`, ...prev.log].slice(0, 40) };
    });
  }, [notify]);

  const sabotageRival = useCallback((name: string) => {
    setGame((prev) => {
      if (!prev) return prev;
      if (prev.cash < 200000) {
        notify("Need ₦200,000 for a sabotage operation.", "bad");
        return prev;
      }
      const success = Math.random() < 0.6;
      if (success) {
        notify(`Sabotage on ${name} succeeded! +₦300,000 loot 💥`, "good");
        return {
          ...prev,
          cash: prev.cash + 300000,
          streetCred: Math.min(100, prev.streetCred + 5),
          log: [`Day ${prev.day}: Sabotaged ${name} — success! (+₦300,000)`, ...prev.log].slice(0, 40),
        };
      }
      notify(`Sabotage on ${name} failed! -₦200,000 and -5 cred. 😬`, "bad");
      return {
        ...prev,
        cash: prev.cash - 200000,
        streetCred: Math.max(0, prev.streetCred - 5),
        sapaMeter: Math.min(100, prev.sapaMeter + 5),
        log: [`Day ${prev.day}: Sabotage on ${name} failed (-₦200,000)`, ...prev.log].slice(0, 40),
      };
    });
  }, [notify]);

  const badge = useMemo(() => {
    if (!game) return "";
    if (game.industry === "transport" && game.netWorth > 5000000) return "Lagos Transport Kingpin";
    if (game.industry === "buka" && game.netWorth > 5000000) return "Amala Billionaire";
    if (game.industry === "pos" && game.netWorth > 5000000) return "POS Empire Overlord";
    if (game.industry === "realestate" && game.netWorth > 5000000) return "Landlord Supreme";
    if (game.industry === "entertainment" && game.netWorth > 5000000) return "Hit Maker";
    if (game.industry === "agro" && game.netWorth > 5000000) return "Agro Baron";
    if (game.industry === "streetfood" && game.netWorth > 5000000) return "Suya & Akara King";
    if (game.industry === "retail" && game.netWorth > 5000000) return "Provision Store Boss";
    if (game.industry === "fashion" && game.netWorth > 5000000) return "Aso-Ebi Stylist";
    if (game.industry === "services" && game.netWorth > 5000000) return "Hustle Hub Hustler";
    if (game.sapaMeter < 15 && game.netWorth > 1000000) return "Sapa Escape Artist";
    if (game.netWorth > 200000000) return "Continental Monopoly";
    return "Rising Street Hustler";
  }, [game]);

  if (!game) {
    return <Onboarding onStart={handleStart} />;
  }

  if (game.bankrupt) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-rose-950 via-slate-950 to-slate-900 p-6 text-center text-slate-100">
        <p className="text-6xl">💀</p>
        <h1 className="mt-4 font-serif text-4xl font-bold text-rose-200">SAPA DON CATCH YOU</h1>
        <p className="mt-2 max-w-md text-sm text-slate-300">
          {game.companyName} has gone completely bankrupt. The streets are laughing. But every mogul rises again.
        </p>
        <button
          onClick={handleReset}
          className="mt-6 rounded-xl bg-emerald-500 px-6 py-3 font-bold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:scale-105 hover:bg-emerald-400 active:scale-95"
        >
          Start a New Empire 🚀
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-slate-950 to-slate-900 text-slate-100">
      <style>{`
        @keyframes floatUp {
          0% { opacity: 0; transform: translateY(0); }
          20% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-24px); }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes slideIn {
          0% { opacity: 0; transform: translateX(-12px); }
          100% { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      <Header game={game} onShare={() => setShareOpen(true)} />
      <Ticker items={game.ticker} />
      <nav className="sticky top-0 z-30 border-b border-emerald-900/40 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2">
          {[
            { id: "hub", label: "Empire Hub" },
            { id: "market", label: "Asset Market" },
            { id: "lifestyle", label: "Flex Market" },
            { id: "auction", label: "🦅 Auctions" },
            { id: "bank", label: "Finance & Bank" },
            { id: "analytics", label: "Analytics" },
            { id: "board", label: "Leaderboard" },
            { id: "badges", label: "Badges" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition ${
                tab === t.id
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30"
                  : "text-emerald-200/70 hover:bg-emerald-900/40 hover:text-emerald-100"
              }`}
            >
              {t.label}
            </button>
          ))}
          <button
            onClick={handleReset}
            className="ml-auto whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold text-rose-300/70 transition hover:bg-rose-900/40 hover:text-rose-200"
          >
            Reset
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-6 pb-24">
        <div key={tab} className="animate-[slideIn_0.3s_ease-out]">
          {tab === "hub" && (
            <Dashboard game={game} onToggleManager={toggleManager} onHireGM={hireGM} onOpenBranch={openBranch} />
          )}
          {tab === "market" && <AssetMarket game={game} onBuy={buyAsset} />}
          {tab === "lifestyle" && <LifestyleMarket game={game} onBuy={buyLifestyle} />}
          {tab === "auction" && <AuctionMarket game={game} onBuy={buyAuction} />}
          {tab === "bank" && (
            <FinanceBank
              game={game}
              onTakeLoan={takeLoan}
              onRepayLoan={repayLoan}
              onToggleAutoDebit={toggleAutoDebit}
              onBuyInsurance={buyInsurance}
            />
          )}
          {tab === "analytics" && <Analytics game={game} />}
          {tab === "board" && <Leaderboard game={game} onSabotage={sabotageRival} />}
          {tab === "badges" && <BadgesTab game={game} />}
        </div>
      </main>

      {activeEvent && (
        <EventModal
          event={activeEvent}
          greeting={game.mogulTitle}
          onChoose={resolveEvent}
        />
      )}

      {shareOpen && (
        <ShareCard
          game={game}
          badge={badge}
          onClose={() => setShareOpen(false)}
        />
      )}

      {milestoneCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur">
          <div className="animate-[popIn_0.3s_ease-out] max-w-sm rounded-2xl border border-amber-500/50 bg-gradient-to-br from-amber-900/60 to-slate-900 p-6 text-center shadow-2xl">
            <p className="text-5xl">{BADGES.find((b) => b.id === milestoneCard)?.emoji}</p>
            <p className="mt-3 text-xs font-bold uppercase tracking-widest text-amber-400">Badge Unlocked</p>
            <h3 className="mt-1 font-serif text-2xl font-bold text-amber-100">
              {BADGES.find((b) => b.id === milestoneCard)?.name}
            </h3>
            <p className="mt-1 text-sm text-amber-200/80">
              {BADGES.find((b) => b.id === milestoneCard)?.description}
            </p>
            <button
              onClick={() => setMilestoneCard(null)}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-2.5 font-bold text-slate-950 shadow-lg shadow-amber-900/40 transition hover:scale-105 hover:from-amber-400 hover:to-amber-500 active:scale-95"
            >
              Continue Building 🚀
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-[popIn_0.2s_ease-out] rounded-xl border px-5 py-3 text-sm font-semibold shadow-2xl backdrop-blur ${
            toast.tone === "good"
              ? "border-emerald-500/50 bg-emerald-900/90 text-emerald-100"
              : toast.tone === "bad"
              ? "border-rose-500/50 bg-rose-900/90 text-rose-100"
              : "border-slate-600/50 bg-slate-800/90 text-slate-100"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}