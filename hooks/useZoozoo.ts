import { useQuery } from "@tanstack/react-query";

export interface ZoozooItem {
  id: string;
  title: string;
  date: string | null;
  difficulty: number;
  foldingTime: string;
  note: string;
  type: string;
  mahi: string;
  aditya: string;
  together: string[];
}

const fetchZoozoo = async (): Promise<ZoozooItem[]> => {
  const res = await fetch("/api/zoozoo");
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
};

export function useZoozoo() {
  return useQuery({
    queryKey: ["zoozoo"],
    queryFn: fetchZoozoo,
    staleTime: 1000 * 60 * 5,
  });
}
