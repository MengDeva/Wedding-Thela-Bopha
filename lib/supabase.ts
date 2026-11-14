import "server-only";

/**
 * Minimal Supabase client (REST) — used only on the server, so the secret key never reaches guests.
 *
 * Env vars (Vercel → Settings → Environment Variables, or .env.local):
 *   SUPABASE_URL          https://xxxx.supabase.co   (NEXT_PUBLIC_SUPABASE_URL also accepted)
 *   SUPABASE_SECRET_KEY   sb_secret_…                (legacy SUPABASE_SERVICE_ROLE_KEY also accepted)
 *   SUPABASE_BUCKET       optional, default "invitation"
 */

const URL_ = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "");
const KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
export const BUCKET = process.env.SUPABASE_BUCKET || "invitation";

export const supabaseEnabled = Boolean(URL_ && KEY);

function headers(extra: Record<string, string> = {}) {
  const h: Record<string, string> = { apikey: KEY, "Content-Type": "application/json", ...extra };
  // Legacy service_role keys are JWTs and also go in Authorization; new sb_secret_ keys only need `apikey`.
  if (KEY.startsWith("eyJ")) h.Authorization = `Bearer ${KEY}`;
  return h;
}

type Init = RequestInit & { headers?: Record<string, string>; next?: { revalidate: number } };

async function call<T>(path: string, init: Init = {}): Promise<T> {
  // Database calls are always fresh; storage listings may be cached (see listFolder)
  const caching: Init = init.next ? {} : { cache: "no-store" };
  const res = await fetch(`${URL_}${path}`, { ...caching, ...init, headers: headers(init.headers) });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${data?.message || data?.error || text}`);
  return data as T;
}

/* ---------------- Database (PostgREST) ---------------- */

export function dbSelect<T>(table: string, query: string) {
  return call<T[]>(`/rest/v1/${table}?${query}`);
}

export async function dbInsert<T>(table: string, row: Record<string, unknown>) {
  const rows = await call<T[]>(`/rest/v1/${table}`, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(row),
  });
  return rows[0];
}

/* ---------------- Storage ---------------- */

const encodePath = (p: string) => p.split("/").map(encodeURIComponent).join("/");

export function publicUrl(path: string) {
  return `${URL_}/storage/v1/object/public/${BUCKET}/${encodePath(path.replace(/^\/+/, ""))}`;
}

/** File names (not folders) directly inside `folder` of the bucket */
export async function listFolder(folder: string): Promise<string[]> {
  const items = await call<{ name: string; id: string | null }[]>(`/storage/v1/object/list/${BUCKET}`, {
    method: "POST",
    body: JSON.stringify({ prefix: folder, limit: 100, offset: 0, sortBy: { column: "name", order: "asc" } }),
    next: { revalidate: 60 }, // new uploads show up within a minute, no redeploy needed
  });
  return items.filter((i) => i.id !== null && !i.name.startsWith(".")).map((i) => i.name);
}
