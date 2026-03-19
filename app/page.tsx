import { fetchMatches } from "@/app/api/matches/route";
import { MOCK_API_DATA, processMatches, calculateStats } from "@/lib/courtroom";
import { CourtroomClient } from "@/components/courtroom/CourtroomClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  let rawData = await fetchMatches();

  if (!rawData || rawData.length === 0) {
    rawData = MOCK_API_DATA;
  }

  const processedMatches = processMatches(rawData);
  const stats = calculateStats(processedMatches, rawData);

  return <CourtroomClient matches={processedMatches} stats={stats} />;
}
