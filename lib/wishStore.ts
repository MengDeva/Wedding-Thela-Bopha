import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { createHash } from "crypto";
import { supabaseEnabled, dbInsert, dbSelect } from "./supabase";

/**
 * Where guest wishes are stored:
 *  • Supabase table `public.wishes` when SUPABASE_URL + SUPABASE_SECRET_KEY are set (see supabase/setup.sql)
 *  • Otherwise the local file /data/wishes.json (handy on your own computer)
 */

export type Wish = {
  id: string;
  name: string;
  message: string;
  attending: "yes" | "no" | "maybe" | "";
  createdAt: string;
};

type Row = { id: string; name: string; message: string; attending: Wish["attending"]; created_at: string };
const fromRow = (r: Row): Wish => ({ id: r.id, name: r.name, message: r.message, attending: r.attending, createdAt: r.created_at });

const hashIp = (ip: string) => createHash("sha256").update(`wedding:${ip}`).digest("hex").slice(0, 32);

/* ---------------- Local JSON file fallback ---------------- */
const FILE = path.join(process.cwd(), "data", "wishes.json");
const MAX_FILE = 2000;

async function readFile(): Promise<Wish[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    return [];
  }
}

/* ---------------- Public API ---------------- */

/** Newest first */
export async function listWishes(limit = 300): Promise<Wish[]> {
  if (supabaseEnabled) {
    const rows = await dbSelect<Row>("wishes", `select=id,name,message,attending,created_at&order=created_at.desc&limit=${limit}`);
    return rows.map(fromRow);
  }
  return (await readFile()).slice(-limit).reverse();
}

export async function addWish(input: Pick<Wish, "name" | "message" | "attending">, ip: string): Promise<Wish> {
  if (supabaseEnabled) {
    const row = await dbInsert<Row>("wishes", { ...input, ip_hash: hashIp(ip) });
    return fromRow(row);
  }
  const wish: Wish = {
    id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
    ...input,
    createdAt: new Date().toISOString(),
  };
  const all = await readFile();
  all.push(wish);
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(all.slice(-MAX_FILE), null, 2));
  return wish;
}

/** Anti-spam: one wish per visitor every `seconds`. Returns false if too soon. */
const memory = new Map<string, number>();
export async function allowSubmit(ip: string, seconds = 10): Promise<boolean> {
  if (supabaseEnabled) {
    const since = new Date(Date.now() - seconds * 1000).toISOString();
    const recent = await dbSelect<{ id: string }>(
      "wishes",
      `select=id&ip_hash=eq.${hashIp(ip)}&created_at=gt.${encodeURIComponent(since)}&limit=1`
    );
    return recent.length === 0;
  }
  const last = memory.get(ip) ?? 0;
  if (Date.now() - last < seconds * 1000) return false;
  memory.set(ip, Date.now());
  return true;
}
