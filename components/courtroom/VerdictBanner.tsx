"use client";

import { MatchResult } from "../../lib/courtroom";
import { Gavel, Scale, Gift } from "lucide-react";
import { motion } from "motion/react";

interface VerdictBannerProps {
  match: MatchResult;
}

export function VerdictBanner({ match }: VerdictBannerProps) {
  const primaryQuote = match.quotes[0];
  const subQuotes = match.quotes.slice(1);

  return (
    <div className="relative overflow-hidden border-2 border-[#1C1C1C] bg-[#1C1C1C] p-1 shadow-lg">
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-5">
        <Scale className="h-64 w-64 text-[#EBE8E1]" />
      </div>

      <div className="relative z-10 flex flex-col border-2 border-double border-[#EBE8E1]/30 p-6 text-[#EBE8E1] md:p-10">
        <div className="absolute top-4 right-4 rotate-12 opacity-80 md:top-6 md:right-6">
          <div className="mask-image-grunge flex h-20 w-20 items-center justify-center rounded-full border-2 border-amber-700 p-1 text-amber-700 md:h-24 md:w-24">
            <div className="flex h-full w-full items-center justify-center rounded-full border border-amber-700 text-center text-[10px] leading-none font-black tracking-widest uppercase">
              Official
              <br />
              Verdict
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-amber-600"></div>
            <Gavel className="h-6 w-6 text-amber-500" />
            <div className="h-px w-12 bg-amber-600"></div>
          </div>
          <h2 className="font-serif text-xs font-bold tracking-[0.3em] text-amber-500 uppercase md:text-sm">
            Judicial Finding • Case #{match.puzzleNo}
          </h2>
        </div>

        <div className="space-y-6 text-center">
          <motion.div
            key={match.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <h1 className="font-serif text-2xl leading-snug font-bold text-[#EBE8E1] md:text-4xl">
              {primaryQuote}
            </h1>
          </motion.div>

          {subQuotes.length > 0 && (
            <div className="mx-auto w-full max-w-2xl border-t border-b border-[#EBE8E1]/20 py-4">
              {subQuotes.map((quote, idx) => (
                <motion.p
                  key={`${match.id}-${idx}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="font-mono text-sm text-gray-400 italic md:text-base"
                >
                  &quot;{quote}&quot;
                </motion.p>
              ))}
            </div>
          )}

          {match.prize && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mx-auto mt-4 max-w-sm border border-dashed border-amber-600/50 bg-amber-900/10 p-3"
            >
              <h3 className="mb-1.5 text-[10px] font-bold tracking-widest text-amber-500 uppercase">
                Settlement Awarded
              </h3>
              <div className="flex items-center justify-center gap-3">
                <Gift className="h-4 w-4 text-amber-400" />
                <span className="font-serif text-lg font-bold tracking-wide text-[#EBE8E1] uppercase">
                  {match.prize}
                </span>
                <Gift className="h-4 w-4 text-amber-400" />
              </div>
            </motion.div>
          )}
        </div>

        <div className="mt-8 flex items-end justify-between border-t border-gray-800 pt-3">
          <div className="flex flex-col">
            <span className="text-[10px] tracking-widest text-gray-500 uppercase">
              Judge: ZIP AI
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span
              className="text-[10px] tracking-widest text-gray-500 uppercase"
              suppressHydrationWarning
            >
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}