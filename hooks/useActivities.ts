import { useQuery } from "@tanstack/react-query";

export interface Activity {
  id: string;
  title: string;
  date?: string | null;
  notes?: string;
  location?: string;
  adityaComment?: string;
  mahiComment?: string;
  status: boolean;
}

const fetchActivities = async (): Promise<Activity[]> => {
  const res = await fetch("/api/activities");
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
};

export function useActivities() {
  return useQuery({
    queryKey: ["activities"],
    queryFn: fetchActivities,
    staleTime: 1000 * 60 * 5,
  });
}
