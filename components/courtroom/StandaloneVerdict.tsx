"use client";

import { MatchResult } from "@/lib/courtroom";
import { VerdictBanner } from "./VerdictBanner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface StandaloneVerdictProps {
  match: MatchResult;
}

export function StandaloneVerdict({ match }: StandaloneVerdictProps) {
  const handleShare = async () => {
    if (typeof window === "undefined") return;

    const url = window.location.href;
    const title = `Case #${match.puzzleNo}: ${match.winner.toUpperCase()} vs ${match.loser.toUpperCase()}`;
    const text = `Official Verdict for Case #${match.puzzleNo}.\nWinner: ${match.winner.toUpperCase()} (${match.winnerTime}s)\n\nRead the full judgment here:`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#EBE8E1] p-4">
      <div className="mb-6 w-full max-w-3xl">
        <Link
          href="/"
          className="mb-4 flex w-fit items-center gap-2 text-xs font-bold tracking-widest text-gray-500 uppercase transition-colors hover:text-[#1C1C1C]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Court
        </Link>
        <VerdictBanner match={match} onShare={handleShare} />
      </div>
    </div>
  );
}
