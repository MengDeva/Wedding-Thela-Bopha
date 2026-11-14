"use client";

import { useEffect, useState } from "react";
import { invitation } from "@/config/invitation";

/**
 * Host tool: paste guest names (one per line) → get a personal link for each.
 * Or share the plain link — it greets everyone as "Honored Guest", no limit.
 */
export default function GuestLinks() {
  const [names, setNames] = useState("");
  const [base, setBase] = useState(invitation.siteUrl);
  const [copied, setCopied] = useState("");

  useEffect(() => setBase(window.location.origin), []);

  const list = names
    .split("\n")
    .map((n) => n.trim().slice(0, invitation.guestNameMaxLength))
    .filter(Boolean);
  const link = (n: string) => `${base}/?to=${encodeURIComponent(n)}`;

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <div className="tool">
      <h1>Guest Links · តំណភ្ញៀវ</h1>

      <div className="card" style={{ padding: 20, marginBottom: 24 }}>
        <strong>1 shared link for everyone</strong> — no names, no limit:
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10, alignItems: "center" }}>
          <code style={{ wordBreak: "break-all" }}>{base}/</code>
          <button className="btn ghost copy-btn" style={{ marginTop: 0 }} onClick={() => copy(`${base}/`, "shared")}>
            {copied === "shared" ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <strong>Personal links</strong> — type one guest name per line (Khmer or English):
        <textarea
          className="field"
          style={{ marginTop: 10, minHeight: 160 }}
          value={names}
          onChange={(e) => setNames(e.target.value)}
          placeholder={"លោក សុខ ចាន់ថា និងភរិយា\nMr. & Mrs. John Smith"}
        />
        <p style={{ color: "var(--ink-soft)", fontSize: "0.9rem" }}>{list.length} guest(s)</p>

        {list.length > 0 && (
          <>
            <button
              className="btn"
              onClick={() => copy(list.map((n) => `${n}\t${link(n)}`).join("\n"), "all")}
            >
              {copied === "all" ? "✓ Copied all" : "Copy all (paste into Excel / Sheets)"}
            </button>
            <table style={{ marginTop: 16 }}>
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Link</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {list.map((n, i) => (
                  <tr key={i}>
                    <td>{n}</td>
                    <td>
                      <a href={link(n)} target="_blank" rel="noreferrer">
                        {link(n)}
                      </a>
                    </td>
                    <td>
                      <button className="chip" onClick={() => copy(link(n), `r${i}`)}>
                        {copied === `r${i}` ? "✓" : "Copy"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
