// app/stats/page.tsx
import { fetchMatches } from "@/app/api/matches/route";
import { MOCK_API_DATA } from "@/lib/courtroom";
import { StatsDashboard } from "@/components/stats/StatsDashboard";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const currentYear = new Date().getFullYear();
  let rawData = await fetchMatches(currentYear);

  if (!rawData || rawData.length === 0) {
    rawData = MOCK_API_DATA;
  }

  return <StatsDashboard initialRawData={rawData} currentYear={currentYear} />;
}
