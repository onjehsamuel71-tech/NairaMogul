-- NAIRA MOGUL: Supabase / PostgreSQL schema
-- Run in the Supabase SQL editor.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  email text not null unique,
  gender text not null check (gender in ('male', 'female', 'other')),
  referral_code text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- players
-- ---------------------------------------------------------------------------
create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  company_name text not null,
  industry text not null,
  starting_city text not null default 'Ibadan',
  cash_balance bigint not null default 100000,
  net_worth bigint not null default 100000,
  street_cred int not null default 10,
  sapa_meter int not null default 0 check (sapa_meter between 0 and 100),
  level int not null default 1,
  branches jsonb not null default '[]'::jsonb,
  general_manager boolean not null default false,
  insurance boolean not null default false,
  day_count int not null default 1,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists players_user_id_idx on players(user_id);
create index if not exists players_net_worth_idx on players(net_worth desc);

-- ---------------------------------------------------------------------------
-- assets
-- ---------------------------------------------------------------------------
create table if not exists assets (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id) on delete cascade,
  asset_id text not null,
  asset_type text not null,
  level int not null default 1,
  daily_revenue bigint not null default 0,
  maintenance_cost bigint not null default 0,
  auto_manager_active boolean not null default false,
  city text not null default 'Ibadan',
  created_at timestamptz not null default now(),
  unique (player_id, asset_id)
);

create index if not exists assets_player_id_idx on assets(player_id);

-- ---------------------------------------------------------------------------
-- loans
-- ---------------------------------------------------------------------------
create table if not exists loans (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id) on delete cascade,
  principal_amount bigint not null,
  interest_rate numeric(5, 4) not null default 0.02,
  remaining_balance bigint not null,
  due_day int not null,
  auto_debit boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists loans_player_id_idx on loans(player_id);

-- ---------------------------------------------------------------------------
-- daily_ticks
-- ---------------------------------------------------------------------------
create table if not exists daily_ticks (
  id bigserial primary key,
  player_id uuid not null references players(id) on delete cascade,
  day int not null,
  revenue bigint not null default 0,
  expenses bigint not null default 0,
  net bigint not null default 0,
  cash_after bigint not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists daily_ticks_player_idx on daily_ticks(player_id, day desc);

-- ---------------------------------------------------------------------------
-- leaderboard
-- ---------------------------------------------------------------------------
create table if not exists leaderboard (
  player_id uuid primary key references players(id) on delete cascade,
  score bigint not null default 0,
  city text not null,
  industry text not null,
  last_updated timestamptz not null default now()
);

create index if not exists leaderboard_score_idx on leaderboard(score desc);
create index if not exists leaderboard_city_idx on leaderboard(city);
create index if not exists leaderboard_industry_idx on leaderboard(industry);

-- ---------------------------------------------------------------------------
-- Row Level Security (service role bypasses; enable for anon safety)
-- ---------------------------------------------------------------------------
alter table users enable row level security;
alter table players enable row level security;
alter table assets enable row level security;
alter table loans enable row level security;
alter table daily_ticks enable row level security;
alter table leaderboard enable row level security;

create policy if not exists "leaderboard public read"
  on leaderboard for select using (true);