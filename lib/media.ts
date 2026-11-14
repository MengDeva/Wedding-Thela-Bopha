import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { invitation } from "@/config/invitation";
import { supabaseEnabled, listFolder, publicUrl } from "./supabase";

/**
 * Photos, cover, music and KHQR images.
 *
 *  Supabase Storage (bucket "invitation"):     Local fallback (/public):
 *    gallery/  → up to 10 photos                 public/gallery/
 *    cover/    → 1 cover photo (optional)        public/images/cover.jpg
 *    music/    → 1 song                          public/music/
 *    khqr/     → KHQR images, in account order   paths set in config `gifts.accounts[].image`
 */

export type Media = { photos: string[]; cover: string | null; music: string | null; khqr: string[] };

const IMG = /\.(jpe?g|png|webp|avif|gif)$/i;
const AUDIO = /\.(mp3|m4a|aac|ogg|wav)$/i;
const byName = (a: string, b: string) => a.localeCompare(b, undefined, { numeric: true });

async function fromSupabase(): Promise<Media> {
  const [gallery, cover, music, khqr] = await Promise.all(
    ["gallery", "cover", "music", "khqr"].map((f) => listFolder(f).catch(() => [] as string[]))
  );
  const url = (folder: string) => (name: string) => publicUrl(`${folder}/${name}`);
  const khqrFiles = khqr.filter((n) => IMG.test(n)).sort(byName).map(url("khqr"));

  return {
    photos: gallery.filter((n) => IMG.test(n)).sort(byName).slice(0, invitation.maxGalleryPhotos).map(url("gallery")),
    cover: cover.filter((n) => IMG.test(n)).sort(byName).map(url("cover"))[0] ?? null,
    music: music.filter((n) => AUDIO.test(n)).sort(byName).map(url("music"))[0] ?? null,
    // Config path wins ("khqr/groom.png" or a full URL); otherwise the Nth file in khqr/ goes to the Nth account
    khqr: invitation.gifts.accounts.map((a, i) => {
      if (/^https?:\/\//.test(a.image)) return a.image;
      if (a.image) return publicUrl(a.image);
      return khqrFiles[i] ?? "";
    }),
  };
}

async function listPublic(dir: string, re: RegExp) {
  try {
    const files = await fs.readdir(path.join(process.cwd(), "public", dir));
    return files.filter((f) => re.test(f) && !f.startsWith(".")).sort(byName).map((f) => `/${dir}/${encodeURIComponent(f)}`);
  } catch {
    return [];
  }
}

async function fromLocal(): Promise<Media> {
  const photos = (await listPublic("gallery", IMG)).slice(0, invitation.maxGalleryPhotos);
  const images = await listPublic("images", IMG);
  return {
    photos,
    cover: images.find((p) => /\/cover\./i.test(p)) ?? photos[0] ?? null,
    music: (await listPublic("music", AUDIO))[0] ?? null,
    khqr: invitation.gifts.accounts.map((a) => a.image),
  };
}

export async function getMedia(): Promise<Media> {
  if (supabaseEnabled) {
    try {
      const m = await fromSupabase();
      return { ...m, cover: m.cover ?? m.photos[0] ?? null };
    } catch (e) {
      console.error("[media] Supabase Storage failed, using /public instead", e);
    }
  }
  return fromLocal();
}
