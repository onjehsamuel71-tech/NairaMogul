import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "./config.js";

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(supabaseConfig.url, supabaseConfig.key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const TICK_MS = 60_000;
const STARTING_CASH = 100_000;
const MAX_SAPA = 100;

const INDUSTRY_MULT = {
  transport: 1.15,
  buka: 1.15,
  pos: 1.15,
  akara: 1.2,
  music: 1.2,
  gadgets: 1.2,
  logistics: 1.2,
};

const ASSET_CATALOG = {
  keke: { name: "Keke Napep", industry: "transport", cost: 500000, revenue: 45000, maintenance: 12000, tier: 1 },
  danfo: { name: "Rusty Danfo", industry: "transport", cost: 2000000, revenue: 180000, maintenance: 55000, tier: 2 },
  coaster: { name: "Modern Coaster Bus", industry: "transport", cost: 15000000, revenue: 1200000, maintenance: 380000, tier: 3 },
  interstate: { name: "Interstate Luxury Bus", industry: "transport", cost: 60000000, revenue: 5200000, maintenance: 1600000, tier: 4 },
  truck: { name: "Delivery Logistics Truck", industry: "transport", cost: 150000000, revenue: 14000000, maintenance: 4200000, tier: 5 },
  suya: { name: "Street Suya Kiosk", industry: "buka", cost: 300000, revenue: 32000, maintenance: 9000, tier: 1 },
  amala: { name: "Roadside Amala Buka", industry: "buka", cost: 1500000, revenue: 150000, maintenance: 48000, tier: 2 },
  fastfood: { name: "Express Fast-Food Joint", industry: "buka", cost: 10000000, revenue: 950000, maintenance: 310000, tier: 3 },
  finedine: { name: "Fine Dining Restaurant", industry: "buka", cost: 45000000, revenue: 4200000, maintenance: 1400000, tier: 4 },
  catering: { name: "Catering Franchise", industry: "buka", cost: 200000000, revenue: 18500000, maintenance: 5800000, tier: 5 },
  kioskpos: { name: "Single Kiosk POS", industry: "pos", cost: 150000, revenue: 18000, maintenance: 5000, tier: 1 },
  container: { name: "Container Hub", industry: "pos", cost: 800000, revenue: 95000, maintenance: 28000, tier: 2 },
  multiterm: { name: "Market Multi-Terminal", industry: "pos", cost: 5000000, revenue: 520000, maintenance: 165000, tier: 3 },
  district: { name: "District Financial Center", industry: "pos", cost: 30000000, revenue: 3100000, maintenance: 980000, tier: 4 },
  akara_stand: { name: "Mama's Akara Stand", industry: "akara", cost: 150000, revenue: 18000, maintenance: 4500, tier: 1 },
  akara_kiosk: { name: "Akara & Pap Kiosk", industry: "akara", cost: 600000, revenue: 72000, maintenance: 20000, tier: 2 },
  moimoi_factory: { name: "Moi Moi & Kuli Kuli Factory", industry: "akara", cost: 3500000, revenue: 380000, maintenance: 120000, tier: 3 },
  akara_chain: { name: "Morning Snacks Chain", industry: "akara", cost: 18000000, revenue: 1750000, maintenance: 520000, tier: 4 },
  akara_empire: { name: "National Breakfast Empire", industry: "akara", cost: 85000000, revenue: 8200000, maintenance: 2300000, tier: 5 },
  bedroom_studio: { name: "Bedroom Home Studio", industry: "music", cost: 400000, revenue: 40000, maintenance: 12000, tier: 1 },
  pro_studio: { name: "Professional Recording Studio", industry: "music", cost: 5000000, revenue: 520000, maintenance: 180000, tier: 2 },
  indie_label: { name: "Independent Afrobeats Label", industry: "music", cost: 25000000, revenue: 2600000, maintenance: 850000, tier: 3 },
  major_label: { name: "Major Music Label & Publishing", industry: "music", cost: 120000000, revenue: 12500000, maintenance: 3800000, tier: 4 },
  global_empire: { name: "Global Afrobeats Empire", industry: "music", cost: 500000000, revenue: 52000000, maintenance: 14000000, tier: 5 },
  phone_repair: { name: "Phone Repair Kiosk", industry: "gadgets", cost: 300000, revenue: 32000, maintenance: 9000, tier: 1 },
  gadget_shop: { name: "Gadget & Accessories Shop", industry: "gadgets", cost: 2500000, revenue: 240000, maintenance: 75000, tier: 2 },
  laptop_store: { name: "Laptop & Computer Store", industry: "gadgets", cost: 12000000, revenue: 1150000, maintenance: 380000, tier: 3 },
  tech_mall: { name: "Tech Mall & Distribution Hub", industry: "gadgets", cost: 65000000, revenue: 6200000, maintenance: 1900000, tier: 4 },
  tech_import: { name: "National Tech Import Empire", industry: "gadgets", cost: 250000000, revenue: 24000000, maintenance: 7200000, tier: 5 },
};

function levelFromNetWorth(netWorth) {
  if (netWorth >= 500_000_000) return 5;
  if (netWorth >= 100_000_000) return 4;
  if (netWorth >= 20_000_000) return 3;
  if (netWorth >= 2_000_000) return 2;
  return 1;
}

function computeNetWorth(player, assets) {
  const assetValue = assets.reduce((sum, a) => {
    const def = ASSET_CATALOG[a.asset_id];
    if (!def) return sum;
    return sum + def.cost * a.level * 0.7;
  }, 0);
  return Math.round(player.cash_balance + assetValue);
}

function computeDailyTotals(player, assets) {
  const mult = INDUSTRY_MULT[player.industry] ?? 1.15;
  const gmBonus = player.general_manager ? 1.1 : 0.85;
  const branchBonus = 1 + Math.max(0, (player.branches?.length ?? 1) - 1) * 0.15;

  let revenue = 0;
  let expenses = 0;
  for (const a of assets) {
    const def = ASSET_CATALOG[a.asset_id];
    if (!def) continue;
    revenue += def.revenue * a.level * mult * gmBonus * branchBonus;
    expenses += def.maintenance * a.level;
  }
  return { revenue: Math.round(revenue), expenses: Math.round(expenses) };
}

async function fetchPlayerBundle(playerId) {
  const { data: player, error: pErr } = await supabase
    .from("players")
    .select("*")
    .eq("id", playerId)
    .single();
  if (pErr) throw pErr;

  const { data: assets, error: aErr } = await supabase
    .from("assets")
    .select("*")
    .eq("player_id", playerId);
  if (aErr) throw aErr;

  const { data: loans, error: lErr } = await supabase
    .from("loans")
    .select("*")
    .eq("player_id", playerId)
    .gt("remaining_balance", 0);
  if (lErr) throw lErr;

  return { player, assets: assets ?? [], loans: loans ?? [] };
}

async function persistPlayerSnapshot(playerId, patch) {
  const { player, assets } = await fetchPlayerBundle(playerId);
  const merged = { ...player, ...patch };
  const netWorth = computeNetWorth(merged, assets);
  const level = levelFromNetWorth(netWorth);

  const { data, error } = await supabase
    .from("players")
    .update({ ...patch, net_worth: netWorth, level, updated_at: new Date().toISOString() })
    .eq("id", playerId)
    .select("*")
    .single();
  if (error) throw error;

  await supabase.from("leaderboard").upsert(
    {
      player_id: playerId,
      score: netWorth,
      city: data.starting_city,
      industry: data.industry,
      last_updated: new Date().toISOString(),
    },
    { onConflict: "player_id" }
  );

  return data;
}

app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, gender, company_name, industry, starting_city, referral_code } = req.body ?? {};

    if (!username || !email || !gender) {
      return res.status(400).json({ error: "username, email and gender are required" });
    }
    if (!["male", "female", "other"].includes(gender)) {
      return res.status(400).json({ error: "gender must be male, female or other" });
    }
    if (!INDUSTRY_MULT[industry]) {
      return res.status(400).json({ error: "invalid industry" });
    }

    const { data: user, error: userErr } = await supabase
      .from("users")
      .insert({ username, email, gender, referral_code: referral_code ?? null })
      .select("*")
      .single();
    if (userErr) return res.status(409).json({ error: userErr.message });

    const { data: player, error: playerErr } = await supabase
      .from("players")
      .insert({
        user_id: user.id,
        company_name: company_name ?? `${username} Enterprises`,
        industry,
        starting_city: starting_city ?? "Ibadan",
        cash_balance: STARTING_CASH,
        net_worth: STARTING_CASH,
        street_cred: 10,
        sapa_meter: 0,
        level: 1,
        branches: [starting_city ?? "Ibadan"],
      })
      .select("*")
      .single();
    if (playerErr) return res.status(500).json({ error: playerErr.message });

    await supabase.from("leaderboard").insert({
      player_id: player.id,
      score: STARTING_CASH,
      city: player.starting_city,
      industry: player.industry,
      last_updated: new Date().toISOString(),
    });

    return res.status(201).json({ user, player });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email } = req.body ?? {};
    if (!email) return res.status(400).json({ error: "email is required" });

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();
    if (error || !user) return res.status(404).json({ error: "user not found" });

    const { data: player } = await supabase
      .from("players")
      .select("*")
      .eq("user_id", user.id)
      .single();

    return res.json({ user, player });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get("/api/game/state", async (req, res) => {
  try {
    const { playerId } = req.query;
    if (!playerId) return res.status(400).json({ error: "playerId is required" });

    const { player, assets, loans } = await fetchPlayerBundle(playerId);
    const totals = computeDailyTotals(player, assets);

    return res.json({
      player,
      assets,
      loans,
      daily_revenue: totals.revenue,
      daily_expenses: totals.expenses,
      net_worth: computeNetWorth(player, assets),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/api/game/buy-asset", async (req, res) => {
  try {
    const { playerId, assetId, city } = req.body ?? {};
    const def = ASSET_CATALOG[assetId];
    if (!def) return res.status(400).json({ error: "unknown asset" });

    const { player, assets } = await fetchPlayerBundle(playerId);
    const existing = assets.find((a) => a.asset_id === assetId);
    const cost = existing ? Math.round(def.cost * 0.6) : def.cost;

    if (player.cash_balance < cost) {
      return res.status(400).json({ error: "insufficient cash", required: cost });
    }

    if (existing) {
      const { error } = await supabase
        .from("assets")
        .update({ level: existing.level + 1 })
        .eq("id", existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("assets").insert({
        player_id: playerId,
        asset_id: assetId,
        asset_type: def.industry,
        level: 1,
        daily_revenue: def.revenue,
        maintenance_cost: def.maintenance,
        auto_manager_active: false,
        city: city ?? player.starting_city,
      });
      if (error) throw error;
    }

    const updated = await persistPlayerSnapshot(playerId, {
      cash_balance: player.cash_balance - cost,
    });

    return res.json({ player: updated, spent: cost });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/api/game/upgrade-asset", async (req, res) => {
  try {
    const { playerId, assetId } = req.body ?? {};
    const def = ASSET_CATALOG[assetId];
    if (!def) return res.status(400).json({ error: "unknown asset" });

    const { player, assets } = await fetchPlayerBundle(playerId);
    const existing = assets.find((a) => a.asset_id === assetId);
    if (!existing) return res.status(404).json({ error: "asset not owned" });

    const cost = Math.round(def.cost * 0.6 * existing.level);
    if (player.cash_balance < cost) {
      return res.status(400).json({ error: "insufficient cash", required: cost });
    }

    const { error } = await supabase
      .from("assets")
      .update({
        level: existing.level + 1,
        daily_revenue: def.revenue * (existing.level + 1),
        maintenance_cost: def.maintenance * (existing.level + 1),
      })
      .eq("id", existing.id);
    if (error) throw error;

    const updated = await persistPlayerSnapshot(playerId, {
      cash_balance: player.cash_balance - cost,
    });

    return res.json({ player: updated, spent: cost });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/api/game/resolve-event", async (req, res) => {
  try {
    const { playerId, cashDelta = 0, credDelta = 0, sapaDelta = 0 } = req.body ?? {};
    const { player } = await fetchPlayerBundle(playerId);

    const updated = await persistPlayerSnapshot(playerId, {
      cash_balance: Math.max(0, player.cash_balance + cashDelta),
      street_cred: Math.max(0, Math.min(100, player.street_cred + credDelta)),
      sapa_meter: Math.max(0, Math.min(MAX_SAPA, player.sapa_meter + sapaDelta)),
    });

    return res.json({ player: updated });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

async function runDailyTick(playerId) {
  const { player, assets, loans } = await fetchPlayerBundle(playerId);
  const { revenue, expenses } = computeDailyTotals(player, assets);

  let cash = player.cash_balance + revenue - expenses;
  let sapa = player.sapa_meter;

  for (const loan of loans) {
    const interest = Math.round(loan.remaining_balance * loan.interest_rate);
    const due = loan.remaining_balance + interest;
    if (loan.auto_debit && cash >= due) {
      cash -= due;
      await supabase.from("loans").update({ remaining_balance: 0 }).eq("id", loan.id);
    } else {
      await supabase.from("loans").update({ remaining_balance: due }).eq("id", loan.id);
      if (player.day_count >= loan.due_day) sapa = Math.min(MAX_SAPA, sapa + 5);
    }
  }

  const net = revenue - expenses;
  if (net < 0) sapa = Math.min(MAX_SAPA, sapa + 2);
  else sapa = Math.max(0, sapa - 1);

  const updated = await persistPlayerSnapshot(playerId, {
    cash_balance: Math.max(0, cash),
    sapa_meter: sapa,
    day_count: player.day_count + 1,
  });

  await supabase.from("daily_ticks").insert({
    player_id: playerId,
    day: player.day_count + 1,
    revenue,
    expenses,
    net,
    cash_after: updated.cash_balance,
  });

  return { revenue, expenses, net, player: updated };
}

app.post("/api/game/tick", async (req, res) => {
  try {
    const { playerId } = req.body ?? {};
    if (!playerId) return res.status(400).json({ error: "playerId is required" });
    const result = await runDailyTick(playerId);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get("/api/leaderboard", async (req, res) => {
  try {
    const { city, industry, limit = 50 } = req.query;
    let query = supabase
      .from("leaderboard")
      .select("player_id, score, city, industry, last_updated, players(company_name)")
      .order("score", { ascending: false })
      .limit(Number(limit));

    if (city) query = query.eq("city", city);
    if (industry) query = query.eq("industry", industry);

    const { data, error } = await query;
    if (error) throw error;

    return res.json({
      entries: (data ?? []).map((row, i) => ({
        rank: i + 1,
        player_id: row.player_id,
        company_name: row.players?.company_name ?? "Unknown",
        score: row.score,
        city: row.city,
        industry: row.industry,
        last_updated: row.last_updated,
      })),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

const activePlayers = new Set();

setInterval(async () => {
  for (const playerId of activePlayers) {
    try {
      await runDailyTick(playerId);
    } catch (err) {
      console.error(`[tick] player ${playerId} failed:`, err.message);
    }
  }
}, TICK_MS);

app.post("/api/game/heartbeat", (req, res) => {
  const { playerId } = req.body ?? {};
  if (playerId) activePlayers.add(playerId);
  res.json({ ok: true, active: activePlayers.size });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`[naira-mogul] API listening on :${PORT}`);
});