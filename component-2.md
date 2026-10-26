# NAIRA MOGUL — Backend API

Node.js + Express + Supabase backend for **NAIRA MOGUL: Empire Builder**.

## Setup

1. Create a Supabase project and run `schema.sql` in the SQL editor.
2. Install dependencies:
   ```bash
   cd server && npm install
   ```
3. Create your local env file:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and paste **your own** project URL and key:
   ```
   SUPABASE_URL=https://unugbupfdigwjdfnewhq.supabase.co
   SUPABASE_KEY=<paste-your-key-here>
   PORT=4000
   ```
4. Load the env vars and start the server:
   ```bash
   export $(grep -v '^#' .env | xargs) && npm start
   ```

## Why credentials are not committed

- `.env` is git-ignored so keys never land in source control.
- The publishable/anon key is safe to ship to browsers, but the **service-role key must never** be exposed client-side — it bypasses Row Level Security.
- Rotate keys in the Supabase dashboard if they are ever leaked.

## Endpoints

| Method | Path | Body / Query | Purpose |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | `{ username, email, gender, company_name, industry, starting_city, referral_code? }` | Create user + player, seed leaderboard |
| POST | `/api/auth/login` | `{ email }` | Fetch user + player by email |
| GET | `/api/game/state` | `?playerId=` | Full game state: player, assets, loans, daily totals |
| POST | `/api/game/buy-asset` | `{ playerId, assetId, city? }` | Buy new asset or upgrade owned one |
| POST | `/api/game/upgrade-asset` | `{ playerId, assetId }` | Level up an owned asset |
| POST | `/api/game/resolve-event` | `{ playerId, cashDelta, credDelta, sapaDelta }` | Apply random-event outcome |
| POST | `/api/game/tick` | `{ playerId }` | Manually run one daily financial tick |
| POST | `/api/game/heartbeat` | `{ playerId }` | Register player for background ticks |
| GET | `/api/leaderboard` | `?city=&industry=&limit=` | Ranked leaderboard with filters |

## Daily Tick

Every 60 seconds the server runs a financial tick for each player that has sent a heartbeat:

- Adds `daily_revenue` and subtracts `daily_expenses`.
- Accrues loan interest; auto-debits loans when enabled and cash allows.
- Raises `sapa_meter` on negative net cashflow or overdue loans; lowers it on profit.
- Recomputes `net_worth` and `level`, then upserts the `leaderboard` row.
- Records the tick in `daily_ticks` for analytics.

## Notes

- `net_worth = cash_balance + Σ(asset.cost × level × 0.7)`.
- `level` tiers: 1 (< ₦2M), 2 (≥ ₦2M), 3 (≥ ₦20M), 4 (≥ ₦100M), 5 (≥ ₦500M).
- The service-role key bypasses RLS; never expose it to the browser.