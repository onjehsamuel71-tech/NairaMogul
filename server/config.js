let local = {};
try {
  // Local-only overrides. This file is git-ignored — never commit it.
  local = (await import("./config.local.js")).default ?? {};
} catch {
  // No local config present; fall back to process.env.
}

const SUPABASE_URL = process.env.SUPABASE_URL ?? local.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY ?? local.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_KEY. Set them as environment variables, " +
      "or create server/config.local.js (git-ignored) exporting { SUPABASE_URL, SUPABASE_KEY }."
  );
}

export const supabaseConfig = {
  url: SUPABASE_URL,
  key: SUPABASE_KEY,
};