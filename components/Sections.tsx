"use client";

import { useEffect, useState } from "react";
import { invitation } from "@/config/invitation";
import { ui, useLang, formatDate, formatShortDate, toKhmerDigits, dateParts } from "@/lib/i18n";
import { googleCalendarUrl, outlookCalendarUrl, mapsUrl } from "@/lib/calendar";
import Reveal from "./Reveal";
import WaxSeal from "./WaxSeal";

const Ornament = () => <div className="ornament">❦</div>;

function SectionHead({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <Reveal>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="section-title">{title}</h2>
      <Ornament />
    </Reveal>
  );
}

/* ---------------- HERO ---------------- */
export function Hero({ cover }: { cover: string | null }) {
  const { t, lang } = useLang();
  const { groom, bride } = invitation.couple;
  return (
    <header className="hero">
      <div className="hero-bg">{cover && <img src={cover} alt="" />}</div>
      <div className="hero-frame" />
      <div className="hero-content">
        <p className="hero-title">{t(invitation.wording.title)}</p>
        <h1 className="hero-names">
          {t(groom.name)}
          <span className="amp">{t(ui.and)}</span>
          {t(bride.name)}
        </h1>
        <p className="hero-date">{formatShortDate(invitation.event.start, lang)}</p>
      </div>
      <div className="hero-scroll" aria-hidden />
    </header>
  );
}

/* ---------------- INVITATION WORDING + COUPLE ---------------- */
export function InvitationText() {
  const { t, lang } = useLang();
  const { groom, bride, initials } = invitation.couple;
  const w = invitation.wording;
  const dp = dateParts(invitation.event.start, lang);

  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <p className="quote">“{t(w.quote)}”</p>
        </Reveal>
        <SectionHead eyebrow={t(w.subtitle)} title={t(w.title)} />
        <Reveal>
          <p className="invite-text">{t(w.invitation)}</p>
        </Reveal>

        <div className="couple">
          <Reveal className="person">
            <p className="role">{t(ui.groom)}</p>
            <p className="pname">{t(groom.fullName)}</p>
            <p className="parents">{t(groom.parents)}</p>
          </Reveal>
          <Reveal delay={150}>
            <WaxSeal text={initials} className="couple-seal" />
          </Reveal>
          <Reveal className="person" delay={300}>
            <p className="role">{t(ui.bride)}</p>
            <p className="pname">{t(bride.fullName)}</p>
            <p className="parents">{t(bride.parents)}</p>
          </Reveal>
        </div>

        <Reveal>
          <div className="date-box card">
            <div className="side">
              {dp.weekday}
              <br />
              {dp.month}
            </div>
            <div className="big">{dp.day}</div>
            <div className="side">
              {lang === "km" ? `ម៉ោង ${dp.time}` : dp.time}
              <br />
              {dp.year}
            </div>
          </div>
          <p style={{ marginTop: 16, color: "var(--ink-soft)" }}>{formatDate(invitation.event.start, lang)}</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- COUNTDOWN + CALENDAR + REMIND ---------------- */
function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  return {
    ms,
    d: Math.floor(ms / 86400000),
    h: Math.floor((ms / 3600000) % 24),
    m: Math.floor((ms / 60000) % 60),
    s: Math.floor((ms / 1000) % 60),
  };
}

export function Countdown() {
  const { t, lang } = useLang();
  const target = new Date(invitation.event.start).getTime();
  const end = new Date(invitation.event.end).getTime();
  const [left, setLeft] = useState<ReturnType<typeof diff> | null>(null);

  useEffect(() => {
    setLeft(diff(target));
    const id = setInterval(() => setLeft(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const fmt = (v: number | undefined) => {
    const s = v === undefined ? "--" : String(v).padStart(2, "0");
    return lang === "km" ? toKhmerDigits(s) : s;
  };
  const cells = [
    [left?.d, ui.days],
    [left?.h, ui.hours],
    [left?.m, ui.minutes],
    [left?.s, ui.seconds],
  ] as const;

  const finished = left && left.ms === 0;
  const isOver = finished && Date.now() > end;

  return (
    <section className="section alt" id="countdown">
      <div className="container">
        <SectionHead eyebrow={t(ui.countdown)} title={t(ui.saveTheDate)} />
        {finished ? (
          <Reveal>
            <p className="section-title" style={{ fontSize: "1.6rem" }}>
              {t(isOver ? ui.married : ui.itsToday)}
            </p>
          </Reveal>
        ) : (
          <Reveal className="countdown">
            {cells.map(([v, label], i) => (
              <div key={i} className="count-cell card">
                <div className="num">{fmt(v)}</div>
                <div className="lbl">{t(label)}</div>
              </div>
            ))}
          </Reveal>
        )}

        {!isOver && (
          <Reveal>
            <div className="cal-buttons">
              <a className="btn" href={`/api/calendar?lang=${lang}`}>
                <BellIcon /> {t(ui.remindMe)} · {t(ui.appleCalendar)}
              </a>
              <a className="btn ghost" href={googleCalendarUrl(lang)} target="_blank" rel="noopener noreferrer">
                <CalIcon /> {t(ui.googleCalendar)}
              </a>
              <a className="btn ghost" href={outlookCalendarUrl(lang)} target="_blank" rel="noopener noreferrer">
                <CalIcon /> {t(ui.outlookCalendar)}
              </a>
            </div>
            <p className="remind-note">🔔 {t(ui.remindNote)}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ---------------- AGENDA ---------------- */
export function Agenda() {
  const { t, lang } = useLang();
  return (
    <section className="section">
      <div className="container">
        <SectionHead eyebrow={formatDate(invitation.event.start, lang)} title={t(ui.agenda)} />
        <div className="agenda">
          {invitation.agenda.map((a, i) => (
            <Reveal key={i} className="agenda-item" delay={i * 90}>
              <div className="agenda-icon" aria-hidden>
                {a.icon}
              </div>
              <div className="agenda-body card">
                <div className="time">{lang === "km" ? `ម៉ោង ${toKhmerDigits(a.time)}` : a.time}</div>
                <p className="what">{t(a.title)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- GOOGLE MAPS ---------------- */
export function Venue() {
  const { t } = useLang();
  const v = invitation.venue;
  const embed = `https://maps.google.com/maps?q=${encodeURIComponent(v.mapsQuery)}&z=16&output=embed`;
  return (
    <section className="section alt" id="location">
      <div className="container">
        <SectionHead title={t(ui.location)} />
        <Reveal className="card map-card">
          <iframe className="map-frame" src={embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={t(v.name)} />
          <div className="map-info">
            <div>
              <h3>{t(v.name)}</h3>
              <p>{t(v.address)}</p>
            </div>
            <a className="btn" href={mapsUrl()} target="_blank" rel="noopener noreferrer">
              <PinIcon /> {t(ui.openMaps)}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- LOVE STORY ---------------- */
export function LoveStory() {
  const { t } = useLang();
  if (!invitation.loveStory.length) return null;
  return (
    <section className="section alt">
      <div className="container wide">
        <SectionHead title={t(ui.loveStory)} />
        <div className="story">
          {invitation.loveStory.map((s, i) => (
            <Reveal key={i} className="story-item">
              <div className="story-card card">
                <div className="when">{t(s.date)}</div>
                <h3>{t(s.title)}</h3>
                <p>{t(s.text)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- DIGITAL GIFT (KHQR) ---------------- */
export function Gift({ images }: { images: string[] }) {
  const { t } = useLang();
  const [copied, setCopied] = useState<number | null>(null);
  const g = invitation.gifts;
  if (!g.enabled) return null;

  const copy = async (text: string, i: number) => {
    try {
      await navigator.clipboard.writeText(text.replace(/\s/g, ""));
      setCopied(i);
      setTimeout(() => setCopied(null), 1800);
    } catch {}
  };

  return (
    <section className="section">
      <div className="container">
        <SectionHead title={t(ui.gift)} />
        <Reveal>
          <p style={{ color: "var(--ink-soft)", marginTop: -16, marginBottom: 32 }}>{t(g.note)}</p>
        </Reveal>
        <div className="gifts">
          {g.accounts.map((a, i) => (
            <Reveal key={i} className="gift-card card" delay={i * 120}>
              <h3>{t(a.label)}</h3>
              <div className="khqr-head">KHQR</div>
              <div className="khqr">
                {images[i] ? (
                  <img src={images[i]} alt={`KHQR ${a.accountName}`} loading="lazy" />
                ) : (
                  <div className="khqr-placeholder">
                    Add your KHQR image
                    <br />
                    Supabase → khqr/
                  </div>
                )}
              </div>
              <div className="acct">
                {t(ui.scanKhqr)}
                <br />
                {a.bank}
                <br />
                <strong>{a.accountName}</strong>
                <br />
                {a.accountNumber}
              </div>
              <button className="btn ghost copy-btn" onClick={() => copy(a.accountNumber, i)}>
                {copied === i ? `✓ ${t(ui.copied)}` : t(ui.copy)}
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */
export function Footer() {
  const { t } = useLang();
  const { groom, bride, initials } = invitation.couple;
  return (
    <footer className="footer">
      <Reveal>
        <h2 className="section-title">{t(ui.thankYou)}</h2>
        <p>{t(invitation.wording.thankYou)}</p>
        <div className="names">
          {t(groom.name)} {t(ui.and)} {t(bride.name)}
        </div>
        <WaxSeal text={initials} className="footer-seal" />
      </Reveal>
    </footer>
  );
}

/* ---------------- ICONS ---------------- */
const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);
const CalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const PinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
