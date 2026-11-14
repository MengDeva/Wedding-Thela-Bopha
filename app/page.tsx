import { getMedia } from "@/lib/media";
import InvitationApp from "@/components/InvitationApp";

/** Re-check Supabase Storage at most once a minute — new uploads appear without redeploying */
export const revalidate = 60;

export default async function Page() {
  const media = await getMedia();
  return <InvitationApp {...media} showPlaceholders={process.env.NODE_ENV !== "production"} />;
}
