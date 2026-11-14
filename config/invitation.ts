/**
 * ============================================================
 *  YOUR INVITATION — edit everything here.
 *  Every text field is bilingual: { km: "ខ្មែរ", en: "English" }
 * ============================================================
 *
 *  Photos, cover, music and KHQR images live in Supabase Storage (bucket "invitation"):
 *    gallery/  up to 10 photos (sorted by filename)
 *    cover/    one cover photo (optional — falls back to the first gallery photo)
 *    music/    one .mp3 / .m4a / .ogg
 *    khqr/     KHQR images — 1st file → 1st account below, 2nd → 2nd account
 *  Without Supabase set up, the same files are read from /public (gallery, images/cover.jpg, music).
 */

export type L = { km: string; en: string };

export type PaletteName = "gold" | "rose" | "sage" | "navy" | "royal";

export const invitation = {
  /** "wedding" or "engagement" — changes the default titles */
  type: "wedding" as "wedding" | "engagement",

  /** Color palette: "gold" | "rose" | "sage" | "navy" | "royal" (Khmer red & gold) */
  palette: "royal" as PaletteName,

  /** Language shown first: "km" or "en" — guests can switch with the button */
  defaultLang: "km" as "km" | "en",

  /** Your public site address (used for share links and the guest link generator) */
  siteUrl: "https://your-wedding.vercel.app",

  /** Max photos shown in the gallery (you asked for up to 10) */
  maxGalleryPhotos: 10,

  /** Guest names: ?to=Name in the URL. Max characters allowed */
  guestNameMaxLength: 100,

  couple: {
    initials: "T & B",
    groom: {
      name: { km: "មិថិលា", en: "Thela" },
      fullName: { km: "លោក ពោជ មិថិលា ", en: "Mr. Pauch mithela" },
      parents: {
        km: "លោក ចាន់ វណ្ណា និង លោកស្រី សុខ ចន្ថា",
        en: "Son of Mr. Chan Vanna & Mrs. Sok Chantha",
      },
    },
    bride: {
      name: { km: "បុប្ផា", en: "Bopha" },
      fullName: { km: "កញ្ញា បុប្ផា", en: "Miss Bopha" },
      parents: {
        km: "លោក លី សុភ័ក្ត្រ និង លោកស្រី ហេង ស្រីមុំ",
        en: "Daughter of Mr. Ly Sopheak & Mrs. Heng Sreymom",
      },
    },
  },

  event: {
    /** ISO date with Cambodia timezone (+07:00) */
    start: "2027-02-16T07:00:00+07:00",
    end: "2027-02-16T21:00:00+07:00",
    /** Shown in Google/Apple calendar */
    calendarTitle: {
      km: "អាពាហ៍ពិពាហ៍ មិថិលា & បុប្ផា",
      en: "Wedding of Thela & Bopha",
    },
    /** Reminders added to the calendar file — minutes before the event (auto remind guests) */
    remindersMinutesBefore: [7 * 24 * 60, 24 * 60, 120],
  },

  /* ---------------- WRITE YOUR OWN WORDING ---------------- */
  wording: {
    title: { km: "សិរីមង្គលអាពាហ៍ពិពាហ៍", en: "The Wedding Celebration" },
    subtitle: { km: "សូមគោរពអញ្ជើញ", en: "Together with their families" },
    invitation: {
      km: "យើងខ្ញុំមានកិត្តិយសសូមគោរពអញ្ជើញ ឯកឧត្តម លោកជំទាវ លោក លោកស្រី អ្នកនាង កញ្ញា អញ្ជើញចូលរួមជាភ្ញៀវកិត្តិយស ដើម្បីប្រសិទ្ធិពរជ័យ សិរីសួស្តី ក្នុងពិធីអាពាហ៍ពិពាហ៍ របស់កូនប្រុស កូនស្រី របស់យើងខ្ញុំ។",
      en: "We joyfully request the honor of your presence to celebrate and bless the marriage of our beloved son and daughter.",
    },
    quote: {
      km: "សេចក្តីស្រឡាញ់ ពិតជាមិនត្រូវការពាក្យច្រើនទេ គ្រាន់តែត្រូវការគ្នា និងគ្នា ជារៀងរហូត។",
      en: "Two hearts, one love, a lifetime of forever.",
    },
    thankYou: {
      km: "វត្តមានរបស់លោកអ្នក គឺជាកិត្តិយស និងសេចក្តីសុខដ៏ធំធេងសម្រាប់គ្រួសារយើងខ្ញុំ។",
      en: "Your presence is the greatest gift and an honor to our families.",
    },
  },

  /* ---------------- EVENT AGENDA ---------------- */
  agenda: [
    {
      time: "07:00",
      title: { km: "ពិធីហែជំនូន", en: "Gift Procession" },
      icon: "🎁",
    },
    {
      time: "08:30",
      title: {
        km: "ពិធីសូត្រមន្តចម្រើនព្រះបរិត្ត",
        en: "Monk Blessing Ceremony",
      },
      icon: "🪷",
    },
    {
      time: "09:30",
      title: { km: "ពិធីកាត់សក់បង្កក់សិរី", en: "Hair Cutting Ceremony" },
      icon: "✂️",
    },
    {
      time: "10:30",
      title: {
        km: "ពិធីបង្វិលពពិល និងចងដៃ",
        en: "Popil & Knot Tying Ceremony",
      },
      icon: "🕯️",
    },
    {
      time: "17:00",
      title: {
        km: "ពិធីទទួលភ្ញៀវ និងពិសាអាហារ",
        en: "Wedding Reception & Dinner",
      },
      icon: "🥂",
    },
  ],

  /* ---------------- GOOGLE MAPS LOCATION ---------------- */
  venue: {
    name: { km: "សណ្ឋាគារ សុខា ភ្នំពេញ", en: "Sokha Phnom Penh Hotel" },
    address: {
      km: "ផ្លូវជាតិលេខ៦ ជ្រោយចង្វារ រាជធានីភ្នំពេញ",
      en: "National Road 6, Chroy Changvar, Phnom Penh",
    },
    /** Text Google Maps should search for — or use "11.5826,104.9282" coordinates */
    mapsQuery: "Sokha Phnom Penh Hotel",
    /** Optional: paste your own Google Maps share link (https://maps.app.goo.gl/...) */
    mapsLink: "",
  },

  /* ---------------- LOVE STORY ---------------- */
  loveStory: [
    {
      date: { km: "ឆ្នាំ ២០២០", en: "2020" },
      title: { km: "ជួបគ្នាលើកដំបូង", en: "First Meeting" },
      text: {
        km: "យើងបានជួបគ្នាដំបូងនៅសាកលវិទ្យាល័យ ក្នុងថ្ងៃភ្លៀងមួយ។",
        en: "We first met at university on a rainy afternoon.",
      },
    },
    {
      date: { km: "ឆ្នាំ ២០២២", en: "2022" },
      title: { km: "ដំណើរស្នេហា", en: "Falling in Love" },
      text: {
        km: "ពីមិត្តភក្តិ ក្លាយជាគូស្នេហ៍ ដើរជាមួយគ្នាគ្រប់ពេល។",
        en: "From friends to sweethearts, side by side through every season.",
      },
    },
    {
      date: { km: "ឆ្នាំ ២០២៥", en: "2025" },
      title: { km: "ការស្នើសុំរៀបការ", en: "The Proposal" },
      text: {
        km: "នៅមាត់សមុទ្រកែប ក្រោមពន្លឺថ្ងៃលិច គាត់បាននិយាយថា «ព្រម»។",
        en: "On the beach in Kep, under the sunset, she said “Yes”.",
      },
    },
    {
      date: { km: "ឆ្នាំ ២០២៧", en: "2027" },
      title: { km: "ថ្ងៃមង្គលរបស់យើង", en: "Our Big Day" },
      text: {
        km: "ហើយឥឡូវនេះ យើងចង់ចែករំលែកក្តីសុខនេះជាមួយលោកអ្នក។",
        en: "And now, we want to share this joy with you.",
      },
    },
  ],

  /* ---------------- DIGITAL GIFT (KHQR) ---------------- */
  gifts: {
    enabled: true,
    note: {
      km: "សម្រាប់លោកអ្នកដែលមិនអាចអញ្ជើញមកដល់ ឬចង់ផ្ញើចំណងដៃតាមប្រព័ន្ធឌីជីថល",
      en: "For guests who wish to send a gift digitally",
    },
    accounts: [
      {
        label: { km: "កូនកំលោះ", en: "Groom" },
        /** Leave "" to use the files in Supabase khqr/ folder, or set e.g. "khqr/groom.png" */
        image: "",
        bank: "ABA Bank",
        accountName: "CHAN SOKHA",
        accountNumber: "000 000 000",
      },
      {
        label: { km: "កូនក្រមុំ", en: "Bride" },
        image: "",
        bank: "ACLEDA Bank",
        accountName: "LY BOPHA",
        accountNumber: "000 000 000",
      },
    ],
  },
};

export type Invitation = typeof invitation;
