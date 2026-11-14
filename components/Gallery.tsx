"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ui, useLang } from "@/lib/i18n";
import Reveal from "./Reveal";

export default function Gallery({ photos, showPlaceholders }: { photos: string[]; showPlaceholders: boolean }) {
  const { t } = useLang();
  const [idx, setIdx] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);

  const close = () => setIdx(null);
  const go = useCallback(
    (dir: number) => setIdx((i) => (i === null ? i : (i + dir + photos.length) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (idx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [idx, go]);

  if (!photos.length && !showPlaceholders) return null;
  const items = photos.length ? photos : Array.from({ length: 6 }, () => "");

  return (
    <section className="section">
      <div className="container wide">
        <Reveal>
          <h2 className="section-title">{t(ui.gallery)}</h2>
          <div className="ornament">❦</div>
        </Reveal>
        <div className="gallery">
          {items.map((src, i) => (
            <Reveal
              key={i}
              as="button"
              type="button"
              className="gallery-item"
              delay={(i % 4) * 80}
              onClick={src ? () => setIdx(i) : undefined}
              aria-label={src ? `Open photo ${i + 1}` : undefined}
            >
              {src ? (
                <img src={src} alt={`Photo ${i + 1}`} loading="lazy" />
              ) : (
                <div className="gallery-placeholder">
                  Add photo {i + 1}
                  <br />
                  → /public/gallery
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </div>

      {idx !== null && photos[idx] && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          onClick={close}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <img src={photos[idx]} alt={`Photo ${idx + 1}`} onClick={(e) => e.stopPropagation()} />
          <button className="lb-btn lb-close" onClick={close} aria-label="Close">
            ×
          </button>
          {photos.length > 1 && (
            <>
              <button className="lb-btn lb-prev" onClick={(e) => (e.stopPropagation(), go(-1))} aria-label="Previous">
                ‹
              </button>
              <button className="lb-btn lb-next" onClick={(e) => (e.stopPropagation(), go(1))} aria-label="Next">
                ›
              </button>
            </>
          )}
          <div className="lb-count">
            {idx + 1} / {photos.length}
          </div>
        </div>
      )}
    </section>
  );
}
