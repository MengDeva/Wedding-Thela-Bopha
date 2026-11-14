import type { Metadata, Viewport } from "next";
import { Moul, Battambang, Cormorant_Garamond, Great_Vibes } from "next/font/google";
import { invitation } from "@/config/invitation";
import "./globals.css";

const moul = Moul({ weight: "400", subsets: ["khmer"], variable: "--font-moul", display: "swap" });
const battambang = Battambang({ weight: ["300", "400", "700"], subsets: ["khmer"], variable: "--font-battambang", display: "swap" });
const cormorant = Cormorant_Garamond({ weight: ["400", "500", "600"], style: ["normal", "italic"], subsets: ["latin"], variable: "--font-serif", display: "swap" });
const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--font-script", display: "swap" });

const { groom, bride } = invitation.couple;
const title = `${groom.name.en} & ${bride.name.en} — ${invitation.wording.title.en}`;

export const metadata: Metadata = {
  metadataBase: new URL(invitation.siteUrl),
  title,
  description: `${invitation.wording.title.km} · ${groom.name.km} & ${bride.name.km}`,
  openGraph: {
    title,
    description: `${invitation.wording.title.km} · ${groom.name.km} & ${bride.name.km}`,
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={invitation.defaultLang}
      data-lang={invitation.defaultLang}
      data-palette={invitation.palette}
      className={`${moul.variable} ${battambang.variable} ${cormorant.variable} ${greatVibes.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
