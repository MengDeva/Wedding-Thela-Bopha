import { addWish, allowSubmit, listWishes, type Wish } from "@/lib/wishStore";

export const dynamic = "force-dynamic";

/** Storage is chosen in lib/wishStore.ts: Supabase when configured, local JSON file otherwise. */

export async function GET() {
  try {
    return Response.json(await listWishes());
  } catch (e) {
    console.error("[wishes] read failed", e);
    return Response.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  let body: Partial<Wish>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim().slice(0, 100);
  const message = String(body.message ?? "").trim().slice(0, 500);
  const attending = (["yes", "no", "maybe"] as const).includes(body.attending as "yes")
    ? (body.attending as Wish["attending"])
    : "";
  if (!name || !message) return Response.json({ error: "Name and message are required" }, { status: 400 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";

  try {
    if (!(await allowSubmit(ip))) {
      return Response.json({ error: "Please wait a moment before sending again." }, { status: 429 });
    }
    const wish = await addWish({ name, message, attending }, ip);
    return Response.json(wish, { status: 201 });
  } catch (e) {
    console.error("[wishes] save failed", e);
    return Response.json({ error: "Could not save your wish. Please try again." }, { status: 500 });
  }
}
