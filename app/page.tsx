import { fetchMatches } from "@/app/api/matches/route";
import { MOCK_API_DATA } from "@/lib/courtroom";
import { CourtroomClient } from "@/components/courtroom/CourtroomClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const currentYear = new Date().getFullYear();
  let rawData = await fetchMatches(currentYear);

  if (!rawData || rawData.length === 0) {
    rawData = MOCK_API_DATA;
  }

  return <CourtroomClient initialRawData={rawData} currentYear={currentYear} />;
}
