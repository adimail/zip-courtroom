import { useQuery } from "@tanstack/react-query";
import { processMatches, calculateStats, RawData } from "@/lib/courtroom";

const fetchMatchesForYear = async (year: number): Promise<RawData> => {
  const res = await fetch(`/api/matches?year=${year}`);
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
};

export function useMatches(year: number, initialData?: RawData) {
  return useQuery({
    queryKey: ["matches", year],
    queryFn: () => fetchMatchesForYear(year),
    initialData: initialData,
    select: (rawData) => {
      const processedMatches = processMatches(rawData);
      const stats = calculateStats(processedMatches, rawData);
      return { rawData, processedMatches, stats };
    },
  });
}
