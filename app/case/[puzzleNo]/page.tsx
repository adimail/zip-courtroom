import { fetchMatches } from "@/app/api/matches/route";
import { MOCK_API_DATA, processMatches } from "@/lib/courtroom";
import { StandaloneVerdict } from "@/components/courtroom/StandaloneVerdict";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ puzzleNo: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { puzzleNo } = await params;
  let rawData = await fetchMatches();

  if (!rawData || rawData.length === 0) {
    rawData = MOCK_API_DATA;
  }

  const matches = processMatches(rawData);
  const match = matches.find((m) => m.puzzleNo === puzzleNo);

  if (!match) {
    return {
      title: "Case Not Found | Zip Courtroom",
    };
  }

  let winnerDisplay: string;
  switch (match.winner) {
    case "aditya":
    case "mahi":
      winnerDisplay = `${match.winner.toUpperCase()} Wins`;
      break;
    case "tie":
      winnerDisplay = "TIE";
      break;
    case "draw":
      winnerDisplay = "DRAW";
      break;
    default:
      winnerDisplay = "VERDICT";
  }

  const title = `Verdict: Case #${match.puzzleNo} | ${winnerDisplay}`;

  let description: string;
  switch (match.winner) {
    case "aditya":
    case "mahi":
      description = `Official Judicial Record. Winner: ${match.winner} (${match.winnerTime}s). Loser: ${match.loser}. See the full verdict.`;
      break;
    case "tie":
      description = `Official Judicial Record: Case resulted in a Tie at ${match.winnerTime}s.`;
      break;
    case "draw":
      description = `Official Judicial Record: Case resulted in a Draw as both parties were absent.`;
      break;
    default:
      description = "Official Judicial Record for Zip Courtroom.";
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://zip-courtroom-dragonwarrior.vercel.app/case/${match.puzzleNo}`,
      siteName: "Zip Courtroom",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CasePage({ params }: Props) {
  const { puzzleNo } = await params;
  let rawData = await fetchMatches();

  if (!rawData || rawData.length === 0) {
    rawData = MOCK_API_DATA;
  }

  const processedMatches = processMatches(rawData);
  const match = processedMatches.find((m) => m.puzzleNo === puzzleNo);

  if (!match) {
    notFound();
  }

  return <StandaloneVerdict match={match} />;
}
