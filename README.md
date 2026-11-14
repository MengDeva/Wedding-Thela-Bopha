# Wedding & Engagement Invitation (Next.js)

A bilingual (Khmer & English) digital invitation that works on any phone, tablet or desktop.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production
```

## Customize: everything is in one file

Open **`config/invitation.ts`**. Every text has a Khmer (`km`) and English (`en`) version.

| What | Where |
|---|---|
| Wedding or engagement | `type: "wedding" \| "engagement"` |
| Color palette | `palette: "royal" \| "gold" \| "rose" \| "sage" \| "navy"` |
| First language shown | `defaultLang: "km" \| "en"` |
| Names, parents, initials on the wax seal | `couple` |
| Date & time (Cambodia time) | `event.start`, `event.end` |
| Your own wording | `wording` (title, invitation text, quote, thank-you) |
| Event agenda | `agenda` |
| Google Maps location | `venue.mapsQuery` (place name or `"lat,lng"`), optional `venue.mapsLink` |
| Love story | `loveStory` |
| Digital gift (KHQR) | `gifts.accounts` |
| Auto reminders | `event.remindersMinutesBefore` (default: 7 days, 1 day, 2 hours) |

## Add your photos, music and KHQR (Supabase Storage)

Upload files in **Supabase → Storage → bucket `invitation`**, into these folders:

| Folder | What | Notes |
|---|---|---|
| `gallery/` | Up to 10 photos | Sorted by filename (`01.jpg`, `02.jpg`…). Change the limit with `maxGalleryPhotos`. |
| `cover/` | 1 cover photo | Optional. If empty, the first gallery photo is used. |
| `music/` | 1 song (`.mp3` / `.m4a` / `.ogg`) | Starts when the guest taps the wax seal. |
| `khqr/` | KHQR images | The 1st file goes to the 1st account in `gifts.accounts`, the 2nd to the 2nd. Name them e.g. `1-groom.png`, `2-bride.png`. |

New uploads appear on the live site within about **1 minute**, with no redeploy.

Without Supabase set up (e.g. on your computer), the site reads the same files from `public/gallery/`, `public/images/cover.jpg` and `public/music/`, and KHQR paths from the config.

## Guest names & sharing

- **One shared link for everyone:** share your site address (e.g. `https://your-site.com/`). It greets guests as "Honored Guest" (ភ្ញៀវកិត្តិយស). There are no names and no limit.
- **Personal links:** add `?to=Name`, for example `https://your-site.com/?to=លោក សុខ ចាន់ថា`. The name shows on the envelope and fills in the wish form.
- **Link generator:** open **`/guests`**, paste one name per line, then copy all the links into Excel or Google Sheets.

## Features

Opening animation (envelope + wax seal) · Khmer fonts (Moul, Battambang) · Khmer numerals and dates · KM/EN switch · countdown · Add to Calendar (Apple/iPhone `.ics`, Google, Outlook) with automatic reminders · Google Maps embed + directions · event agenda · love story timeline · photo gallery with swipeable lightbox · KHQR digital gift with copy-account button · guest wishes with attendance (RSVP) · background music button · falling petals · 5 color palettes.

## Set up Supabase (wishes + images)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query**, paste everything from [`supabase/setup.sql`](supabase/setup.sql), and click **Run**.
   This creates the `wishes` table (locked so only your server can read and write it) and the public `invitation` storage bucket.
3. Open **Storage → invitation**, create the folders `gallery`, `cover`, `music`, `khqr`, and upload your files.
4. Open **Project Settings → API Keys** and copy:
   - the **Project URL** → `SUPABASE_URL`
   - a **secret key** (`sb_secret_…`) → `SUPABASE_SECRET_KEY`. Keep this private: never put it in the config file or share it.
5. For your computer, create a file `.env.local` in this folder:

   ```
   SUPABASE_URL=https://xxxx.supabase.co
   SUPABASE_SECRET_KEY=sb_secret_xxxx
   ```

   Restart `npm run dev`. The `.env.local` file is ignored by git.

Without these two variables, wishes are saved to `data/wishes.json` instead.

6. **Move local files to Supabase (optional):** put photos in `public/gallery/`, `public/images/cover.jpg`, a song in `public/music/` and KHQR images in `public/khqr/`, then run:

   ```bash
   npm run supabase:push
   ```

   This checks the table, copies any wishes from `data/wishes.json`, creates the bucket if it's missing, and uploads everything into the right folders. Files with the same name are replaced.

To read the wishes: on the invitation page itself, or in **Supabase → Table Editor → wishes**. You can delete unwanted wishes there.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. On [vercel.com](https://vercel.com), click **Add New → Project** and import the repository.
3. Under **Environment Variables**, add `SUPABASE_URL` and `SUPABASE_SECRET_KEY` (same values as above), then click **Deploy**.
4. Set `siteUrl` in `config/invitation.ts` to your Vercel address (e.g. `https://thela-bopha.vercel.app`), then commit and push.
