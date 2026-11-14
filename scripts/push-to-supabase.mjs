#!/usr/bin/env node
/**
 * Move local data to Supabase.
 *
 *   npm run supabase:push
 *
 * Reads SUPABASE_URL + SUPABASE_SECRET_KEY from .env.local, then:
 *   1. Checks the `wishes` table exists (run supabase/setup.sql first if not)
 *   2. Copies data/wishes.json → wishes table (skips wishes already there)
 *   3. Creates the public storage bucket if missing
 *   4. Uploads images & music:
 *        public/gallery/*        → gallery/
 *        public/images/cover.*   → cover/
 *        public/music/*          → music/
 *        public/khqr/*           → khqr/
 *      Existing files with the same name are overwritten.
 */
import { promises as fs } from "fs";
import path from "path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

// --- load .env.local (no dependency needed) ---
try {
  const env = await fs.readFile(path.join(root, ".env.local"), "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {}

const URL_ = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "");
const KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const BUCKET = process.env.SUPABASE_BUCKET || "invitation";
if (!URL_ || !KEY) {
  console.error("✗ Missing SUPABASE_URL / SUPABASE_SECRET_KEY. Add them to .env.local (see README).");
  process.exit(1);
}

const auth = { apikey: KEY, ...(KEY.startsWith("eyJ") ? { Authorization: `Bearer ${KEY}` } : {}) };
async function api(p, init = {}) {
  const res = await fetch(`${URL_}${p}`, { ...init, headers: { ...auth, ...(init.headers || {}) } });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  return { ok: res.ok, status: res.status, data };
}

// 1) table check
const t = await api("/rest/v1/wishes?select=id&limit=1");
if (!t.ok) {
  console.error(`✗ Table "wishes" not reachable (${t.status}: ${t.data?.message || t.data}).`);
  console.error("  Run supabase/setup.sql in Supabase → SQL Editor first.");
  process.exit(1);
}
console.log("✓ wishes table OK");

// 2) wishes.json → table
let local = [];
try { local = JSON.parse(await fs.readFile(path.join(root, "data", "wishes.json"), "utf8")); } catch {}
if (local.length) {
  const existing = await api("/rest/v1/wishes?select=name,message,created_at&limit=10000");
  const seen = new Set((existing.data || []).map((r) => `${r.name}|${r.message}`));
  const rows = local
    .filter((w) => w.name && w.message && !seen.has(`${w.name}|${w.message}`))
    .map((w) => ({
      name: String(w.name).slice(0, 100),
      message: String(w.message).slice(0, 500),
      attending: ["yes", "no", "maybe"].includes(w.attending) ? w.attending : "",
      created_at: w.createdAt || new Date().toISOString(),
    }));
  if (rows.length) {
    const r = await api("/rest/v1/wishes", {
      method: "POST",
      headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(rows),
    });
    if (!r.ok) { console.error("✗ Wish import failed:", r.data); process.exit(1); }
  }
  console.log(`✓ wishes: ${rows.length} imported, ${local.length - rows.length} already present`);
} else {
  console.log("• data/wishes.json is empty — nothing to import");
}

// 3) bucket
const b = await api(`/storage/v1/bucket/${BUCKET}`);
if (!b.ok) {
  const c = await api("/storage/v1/bucket", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true }),
  });
  if (!c.ok) { console.error("✗ Could not create bucket:", c.data); process.exit(1); }
  console.log(`✓ created public bucket "${BUCKET}"`);
} else {
  console.log(`✓ bucket "${BUCKET}" OK${b.data?.public ? "" : " (⚠ not public — run setup.sql)"}`);
}

// 4) uploads
const TYPES = {
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp",
  ".avif": "image/avif", ".gif": "image/gif", ".mp3": "audio/mpeg", ".m4a": "audio/mp4",
  ".aac": "audio/aac", ".ogg": "audio/ogg", ".wav": "audio/wav",
};
const plan = [
  ["public/gallery", "gallery", () => true],
  ["public/images", "cover", (f) => /^cover\./i.test(f)],
  ["public/music", "music", () => true],
  ["public/khqr", "khqr", () => true],
];
let uploaded = 0;
for (const [dir, folder, keep] of plan) {
  let files = [];
  try { files = await fs.readdir(path.join(root, dir)); } catch { continue; }
  for (const f of files) {
    const type = TYPES[path.extname(f).toLowerCase()];
    if (!type || f.startsWith(".") || !keep(f)) continue;
    const body = await fs.readFile(path.join(root, dir, f));
    const key = `${folder}/${f}`.split("/").map(encodeURIComponent).join("/");
    const r = await api(`/storage/v1/object/${BUCKET}/${key}`, {
      method: "POST",
      headers: { "Content-Type": type, "x-upsert": "true", "cache-control": "3600" },
      body,
    });
    if (!r.ok) { console.error(`✗ ${dir}/${f}:`, r.data?.message || r.data); continue; }
    console.log(`  ↑ ${dir}/${f} → ${folder}/${f}`);
    uploaded++;
  }
}
console.log(uploaded ? `✓ uploaded ${uploaded} file(s)` : "• no local images/music found to upload");
console.log("\nDone. The site now reads wishes and media from Supabase whenever these env vars are set.");
