"use client";

import { useEffect, useState } from "react";
import { ui, useLang, dateParts } from "@/lib/i18n";
import Reveal from "./Reveal";

type Wish = { id: string; name: string; message: string; attending: "yes" | "no" | "maybe" | ""; createdAt: string };

const MAX = 500;

export default function Wishes({ guest }: { guest: string | null | undefined }) {
  const { t, lang } = useLang();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [attending, setAttending] = useState<Wish["attending"]>("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (guest) setName((n) => n || guest);
  }, [guest]);

  useEffect(() => {
    fetch("/api/wishes")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Wish[]) => setWishes(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message, attending }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error");
      setWishes((w) => [data, ...w]);
      setMessage("");
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      setStatus("error");
    }
  };

  const timeAgo = (iso: string) => {
    const p = dateParts(iso, lang);
    return lang === "km" ? `${p.day} ${p.month} ${p.year}` : `${p.day} ${p.month.slice(0, 3)} ${p.year}`;
  };
  const badge = { yes: ui.yes, no: ui.no, maybe: ui.maybe } as const;

  return (
    <section className="section alt" id="wishes">
      <div className="container" style={{ maxWidth: 640 }}>
        <Reveal>
          <h2 className="section-title">{t(ui.wishes)}</h2>
          <div className="ornament">❦</div>
          <p style={{ color: "var(--ink-soft)", marginTop: -16, marginBottom: 28 }}>{t(ui.wishesIntro)}</p>
        </Reveal>

        <Reveal as="form" className="wish-form card" onSubmit={submit}>
          <input
            className="field"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value.slice(0, 100))}
            placeholder={t(ui.yourName)}
            aria-label={t(ui.yourName)}
            required
          />
          <textarea
            className="field"
            value={message}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value.slice(0, MAX))}
            placeholder={t(ui.yourWish)}
            aria-label={t(ui.yourWish)}
            required
          />
          <div className="attend">
            <fieldset>
              <legend>{t(ui.attending)}</legend>
              <div className="attend">
                {(["yes", "no", "maybe"] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    className="chip"
                    aria-pressed={attending === k}
                    onClick={() => setAttending(attending === k ? "" : k)}
                  >
                    {t(badge[k])}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
          <div className="form-row">
            <span className="counter">
              {message.length}/{MAX}
            </span>
            <button className="btn" type="submit" disabled={status === "sending"}>
              {status === "sending" ? t(ui.sending) : `💌 ${t(ui.send)}`}
            </button>
          </div>
          {status === "done" && <p className="form-msg">✓ {t(ui.thanksWish)}</p>}
          {status === "error" && <p className="form-msg">⚠ {error}</p>}
        </Reveal>

        <div className="wish-list">
          {wishes.length === 0 && <p style={{ textAlign: "center", color: "var(--ink-soft)" }}>{t(ui.noWishes)}</p>}
          {wishes.map((w) => (
            <div key={w.id} className="wish card">
              <div className="wish-head">
                <span className="wish-name">{w.name}</span>
                <span className="wish-time">{timeAgo(w.createdAt)}</span>
              </div>
              {w.attending && <span className="wish-badge">{t(badge[w.attending])}</span>}
              <p>{w.message}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
