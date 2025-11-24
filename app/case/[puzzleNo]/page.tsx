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

  const title = `Verdict: Case #${match.puzzleNo} | ${match.winner.toUpperCase()} Wins`;
  const description = `Official Judicial Record. Winner: ${match.winner} (${match.winnerTime}s). Loser: ${match.loser}. See the full verdict.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://zip-courtroom-dragonwarrior.vercel.app/case/${match.puzzleNo}`,
      siteName: "Zip Courtroom",
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
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
