"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { L } from "@/config/invitation";

export type Lang = "km" | "en";

const KM_DIGITS = ["០", "១", "២", "៣", "៤", "៥", "៦", "៧", "៨", "៩"];
const KM_MONTHS = ["មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា", "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ"];
const KM_DAYS = ["អាទិត្យ", "ចន្ទ", "អង្គារ", "ពុធ", "ព្រហស្បតិ៍", "សុក្រ", "សៅរ៍"];

export function toKhmerDigits(s: string | number) {
  return String(s).replace(/[0-9]/g, (d) => KM_DIGITS[Number(d)]);
}

/** Date parts in Cambodia time regardless of the guest's device timezone */
function phnomPenhParts(iso: string) {
  const d = new Date(new Date(iso).getTime() + 7 * 3600 * 1000);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth(),
    day: d.getUTCDate(),
    weekday: d.getUTCDay(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
  };
}

export function formatDate(iso: string, lang: Lang) {
  const p = phnomPenhParts(iso);
  if (lang === "km") {
    return `ថ្ងៃ${KM_DAYS[p.weekday]} ទី${toKhmerDigits(p.day)} ខែ${KM_MONTHS[p.month]} ឆ្នាំ${toKhmerDigits(p.year)}`;
  }
  return new Date(Date.UTC(p.year, p.month, p.day)).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

const EN_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const EN_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Pieces for the big date box */
export function dateParts(iso: string, lang: Lang) {
  const p = phnomPenhParts(iso);
  const n = (v: string | number) => (lang === "km" ? toKhmerDigits(v) : String(v));
  return {
    weekday: lang === "km" ? `ថ្ងៃ${KM_DAYS[p.weekday]}` : EN_DAYS[p.weekday],
    month: lang === "km" ? `ខែ${KM_MONTHS[p.month]}` : EN_MONTHS[p.month],
    day: n(String(p.day).padStart(2, "0")),
    year: n(p.year),
    time: formatTime(iso, lang),
  };
}

export function formatShortDate(iso: string, lang: Lang) {
  const p = phnomPenhParts(iso);
  const s = `${String(p.day).padStart(2, "0")} . ${String(p.month + 1).padStart(2, "0")} . ${p.year}`;
  return lang === "km" ? toKhmerDigits(s) : s;
}

export function formatTime(iso: string, lang: Lang) {
  const p = phnomPenhParts(iso);
  const s = `${String(p.hour).padStart(2, "0")}:${String(p.minute).padStart(2, "0")}`;
  return lang === "km" ? toKhmerDigits(s) : s;
}

/** Fixed UI strings */
export const ui = {
  dear: { km: "សូមគោរពអញ្ជើញ", en: "Dear" },
  honoredGuest: { km: "ភ្ញៀវកិត្តិយស", en: "Honored Guest" },
  openInvitation: { km: "បើកធៀប", en: "Open Invitation" },
  tapSeal: { km: "ចុចលើត្រា ដើម្បីបើក", en: "Tap the seal to open" },
  youAreInvited: { km: "លោកអ្នកត្រូវបានអញ្ជើញ", en: "You are invited" },
  saveTheDate: { km: "សូមចងចាំកាលបរិច្ឆេទ", en: "Save the Date" },
  countdown: { km: "រាប់ថយក្រោយ", en: "Counting down" },
  days: { km: "ថ្ងៃ", en: "Days" },
  hours: { km: "ម៉ោង", en: "Hours" },
  minutes: { km: "នាទី", en: "Minutes" },
  seconds: { km: "វិនាទី", en: "Seconds" },
  itsToday: { km: "ថ្ងៃនេះជាថ្ងៃមង្គល!", en: "Today is the day!" },
  married: { km: "យើងបានរៀបការហើយ — អរគុណ!", en: "We're married — thank you!" },
  agenda: { km: "កម្មវិធីពិធី", en: "Event Agenda" },
  location: { km: "ទីតាំងកម្មវិធី", en: "Location" },
  openMaps: { km: "បើកក្នុង Google Maps", en: "Open in Google Maps" },
  directions: { km: "ទិសដៅ", en: "Get Directions" },
  addToCalendar: { km: "បញ្ចូលទៅប្រតិទិន", en: "Add to Calendar" },
  remindMe: { km: "រំលឹកខ្ញុំ", en: "Remind Me" },
  remindNote: {
    km: "ប្រតិទិននឹងរំលឹកលោកអ្នកដោយស្វ័យប្រវត្តិ មុនថ្ងៃកម្មវិធី",
    en: "Your calendar will automatically remind you before the big day",
  },
  appleCalendar: { km: "Apple / iPhone", en: "Apple / iPhone" },
  googleCalendar: { km: "Google Calendar", en: "Google Calendar" },
  outlookCalendar: { km: "Outlook", en: "Outlook" },
  loveStory: { km: "រឿងស្នេហារបស់យើង", en: "Our Love Story" },
  gallery: { km: "កម្រងរូបភាព", en: "Gallery" },
  gift: { km: "ចំណងដៃឌីជីថល", en: "Digital Gift" },
  scanKhqr: { km: "ស្កេន KHQR ដើម្បីផ្ញើ", en: "Scan KHQR to send" },
  copy: { km: "ចម្លង", en: "Copy" },
  copied: { km: "បានចម្លង", en: "Copied" },
  wishes: { km: "ពាក្យជូនពរ", en: "Guest Wishes" },
  wishesIntro: { km: "សូមផ្ញើពាក្យជូនពរដល់គូស្វាមីភរិយាថ្មី", en: "Leave your blessings for the couple" },
  yourName: { km: "ឈ្មោះរបស់លោកអ្នក", en: "Your name" },
  yourWish: { km: "សរសេរពាក្យជូនពរ...", en: "Write your wish..." },
  attending: { km: "តើលោកអ្នកអាចចូលរួមបានទេ?", en: "Will you attend?" },
  yes: { km: "ចូលរួម", en: "Attending" },
  no: { km: "មិនអាចចូលរួម", en: "Can't attend" },
  maybe: { km: "មិនទាន់ប្រាកដ", en: "Not sure yet" },
  send: { km: "ផ្ញើពាក្យជូនពរ", en: "Send Wish" },
  sending: { km: "កំពុងផ្ញើ...", en: "Sending..." },
  thanksWish: { km: "អរគុណសម្រាប់ពាក្យជូនពរ!", en: "Thank you for your wishes!" },
  noWishes: { km: "សូមក្លាយជាអ្នកដំបូងដែលជូនពរ", en: "Be the first to send a wish" },
  thankYou: { km: "សូមអរគុណ", en: "Thank You" },
  groom: { km: "កូនកំលោះ", en: "The Groom" },
  bride: { km: "កូនក្រមុំ", en: "The Bride" },
  and: { km: "និង", en: "&" },
  share: { km: "ចែករំលែក", en: "Share" },
  linkCopied: { km: "បានចម្លងតំណ", en: "Link copied" },
} satisfies Record<string, L>;

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (l: L) => string };

const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ initial, children }: { initial: Lang; children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initial);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lang");
      if (saved === "km" || saved === "en") setLang(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dataset.lang = lang;
    try {
      localStorage.setItem("lang", lang);
    } catch {}
  }, [lang]);

  const t = (l: L) => l[lang];
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}
