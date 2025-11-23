import { fetchMatches } from "@/app/api/matches/route";
import { MOCK_API_DATA, processMatches } from "@/lib/courtroom";
import { CourtroomClient } from "@/components/courtroom/CourtroomClient";

export const dynamic = 'force-dynamic';

export default async function Home() {
  let rawData = await fetchMatches();

  if (!rawData || rawData.length === 0) {
    rawData = MOCK_API_DATA;
  }

  // Process data on the SERVER side to ensure quotes are consistent
  // and prevent hydration errors caused by Math.random() on the client.
  const processedMatches = processMatches(rawData);

  return <CourtroomClient matches={processedMatches} />;
}