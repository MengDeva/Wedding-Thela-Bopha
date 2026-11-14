import { icsContent } from "@/lib/calendar";

export const dynamic = "force-dynamic";

/** Serves a real .ics file — iPhone/Mac open it straight in Calendar, with reminders */
export function GET(req: Request) {
  const lang = new URL(req.url).searchParams.get("lang") === "en" ? "en" : "km";
  return new Response(icsContent(lang), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="wedding-invitation.ics"',
    },
  });
}
