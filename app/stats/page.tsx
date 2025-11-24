import { fetchMatches } from "@/app/api/matches/route";
import { MOCK_API_DATA, processMatches, calculateStats } from "@/lib/courtroom";
import { StatsDashboard } from "@/components/stats/StatsDashboard";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  let rawData = await fetchMatches();

  if (!rawData || rawData.length === 0) {
    rawData = MOCK_API_DATA;
  }

  const processedMatches = processMatches(rawData);
  const stats = calculateStats(processedMatches, rawData);

  return <StatsDashboard matches={processedMatches} stats={stats} rawData={rawData} />;
}
