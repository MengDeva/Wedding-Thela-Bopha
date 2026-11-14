"use client";

import { useState } from "react";
import { invitation } from "@/config/invitation";
import { ui, useLang, formatShortDate } from "@/lib/i18n";
import WaxSeal from "./WaxSeal";

export default function Opening({
  guest,
  onOpen,
  onDone,
}: {
  guest: string | null | undefined;
  onOpen: () => void;
  onDone: () => void;
}) {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const { groom, bride, initials } = invitation.couple;

  const handleOpen = () => {
    if (open) return;
    setOpen(true);
    onOpen(); // start music inside the user gesture
    setTimeout(() => {
      setDone(true);
      onDone();
    }, 2300);
  };

  return (
    <div className={`opening ${done ? "done" : ""}`} aria-hidden={done}>
      <div className="opening-inner">
        <div className="opening-guest">
          {guest !== undefined && (
            <>
              <p className="to">{t(ui.dear)}</p>
              <p className="name">{guest || t(ui.honoredGuest)}</p>
            </>
          )}
        </div>

        <div className={`envelope ${open ? "open" : ""}`}>
          <div className="env-back" />
          <div className="env-letter">
            <div>
              <small>{t(ui.youAreInvited)}</small>
              <div className="mini-names">
                {t(groom.name)} {lang === "en" ? "&" : "និង"} {t(bride.name)}
              </div>
              <small>{formatShortDate(invitation.event.start, lang)}</small>
            </div>
          </div>
          <div className="env-front" />
          <div className="env-flap" />
          <button className="env-seal" onClick={handleOpen} aria-label={t(ui.openInvitation)}>
            <WaxSeal text={initials} />
          </button>
        </div>

        <p className="opening-hint">{t(ui.tapSeal)}</p>
      </div>
    </div>
  );
}
