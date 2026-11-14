import { invitation } from "@/config/invitation";
import type { Lang } from "./i18n";

const toUtcStamp = (iso: string) =>
  new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

function mapsUrl() {
  const v = invitation.venue;
  return v.mapsLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.mapsQuery)}`;
}

function details(lang: Lang) {
  const w = invitation.wording;
  return `${w.invitation[lang]}\n\n📍 ${invitation.venue.name[lang]}\n${invitation.venue.address[lang]}\n${mapsUrl()}\n\n${invitation.siteUrl}`;
}

export function googleCalendarUrl(lang: Lang) {
  const e = invitation.event;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.calendarTitle[lang],
    dates: `${toUtcStamp(e.start)}/${toUtcStamp(e.end)}`,
    details: details(lang),
    location: `${invitation.venue.name[lang]}, ${invitation.venue.address[lang]}`,
    ctz: "Asia/Phnom_Penh",
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

export function outlookCalendarUrl(lang: Lang) {
  const e = invitation.event;
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: e.calendarTitle[lang],
    startdt: new Date(e.start).toISOString(),
    enddt: new Date(e.end).toISOString(),
    body: details(lang),
    location: `${invitation.venue.name[lang]}, ${invitation.venue.address[lang]}`,
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params}`;
}

const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");

/** .ics file with built-in alarms → guests get reminded automatically */
export function icsContent(lang: Lang) {
  const e = invitation.event;
  const alarms = e.remindersMinutesBefore
    .map(
      (m) =>
        `BEGIN:VALARM\r\nACTION:DISPLAY\r\nDESCRIPTION:${esc(e.calendarTitle[lang])}\r\nTRIGGER:-PT${m}M\r\nEND:VALARM`
    )
    .join("\r\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${toUtcStamp(e.start)}-invitation@wedding`,
    `DTSTAMP:${toUtcStamp(new Date().toISOString())}`,
    `DTSTART:${toUtcStamp(e.start)}`,
    `DTEND:${toUtcStamp(e.end)}`,
    `SUMMARY:${esc(e.calendarTitle[lang])}`,
    `DESCRIPTION:${esc(details(lang))}`,
    `LOCATION:${esc(`${invitation.venue.name[lang]}, ${invitation.venue.address[lang]}`)}`,
    `URL:${invitation.siteUrl}`,
    alarms,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export { mapsUrl };
