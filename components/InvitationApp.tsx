"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { invitation } from "@/config/invitation";
import { LangProvider, useLang } from "@/lib/i18n";
import Opening from "./Opening";
import Gallery from "./Gallery";
import Wishes from "./Wishes";
import { Hero, InvitationText, Countdown, Agenda, Venue, LoveStory, Gift, Footer } from "./Sections";

type Props = { photos: string[]; cover: string | null; music: string | null; khqr: string[]; showPlaceholders: boolean };

export default function InvitationApp(props: Props) {
  return (
    <LangProvider initial={invitation.defaultLang}>
      <Inner {...props} />
    </LangProvider>
  );
}

/** Reads ?to=Guest%20Name (or ?guest=). No name → "Honored Guest" — one shared link works for everyone. */
function readGuest(): string | null {
  const q = new URLSearchParams(window.location.search);
  const raw = q.get("to") ?? q.get("guest") ?? "";
  const clean = raw.replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, invitation.guestNameMaxLength);
  return clean || null;
}

function Inner({ photos, cover, music, khqr, showPlaceholders }: Props) {
  const { lang, setLang } = useLang();
  const [guest, setGuest] = useState<string | null | undefined>(undefined);
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);

  useEffect(() => setGuest(readGuest()), []);

  useEffect(() => {
    document.body.classList.toggle("locked", !opened);
  }, [opened]);

  const startMusic = () => {
    const a = audio.current;
    if (!a) return;
    a.volume = 0.6;
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };
  const toggleMusic = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) startMusic();
    else {
      a.pause();
      setPlaying(false);
    }
  };

  // Pause when the guest leaves the tab
  useEffect(() => {
    const onVis = () => {
      if (document.hidden && audio.current && !audio.current.paused) {
        audio.current.pause();
        setPlaying(false);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <>
      <Opening guest={guest} onOpen={startMusic} onDone={() => setOpened(true)} />

      {music && <audio ref={audio} src={music} loop preload="auto" />}

      {opened && <Petals />}

      <main>
        <Hero cover={cover} />
        <InvitationText />
        <Countdown />
        <Agenda />
        <Venue />
        <LoveStory />
        <Gallery photos={photos} showPlaceholders={showPlaceholders} />
        <Gift images={khqr} />
        <Wishes guest={guest} />
        <Footer />
      </main>

      {opened && (
        <div className="controls">
          <button
            className="fab"
            onClick={() => setLang(lang === "km" ? "en" : "km")}
            aria-label="Switch language"
            title="ភាសា / Language"
          >
            {lang === "km" ? "EN" : "ខ្មែរ"}
          </button>
          {music && (
            <button
              className={`fab ${playing ? "spinning" : ""}`}
              onClick={toggleMusic}
              aria-label={playing ? "Pause music" : "Play music"}
            >
              {playing ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                  <path d="M2 2l20 20" />
                </svg>
              )}
            </button>
          )}
        </div>
      )}

      {/* Language switch is also available on the opening screen */}
      {!opened && (
        <div className="controls" style={{ zIndex: 101 }}>
          <button className="fab" onClick={() => setLang(lang === "km" ? "en" : "km")} aria-label="Switch language">
            {lang === "km" ? "EN" : "ខ្មែរ"}
          </button>
        </div>
      )}
    </>
  );
}

function Petals() {
  const petals = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        left: `${(i * 37) % 100}%`,
        delay: `${(i * 1.7) % 12}s`,
        duration: `${12 + ((i * 3) % 9)}s`,
        drift: `${((i % 5) - 2) * 50}px`,
        scale: 0.6 + ((i * 7) % 5) / 10,
      })),
    []
  );
  return (
    <div className="petals" aria-hidden>
      {petals.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={
            {
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.duration,
              "--drift": p.drift,
              transform: `scale(${p.scale})`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
