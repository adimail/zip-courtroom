"use client";

import { useState, useEffect } from "react";
import { MatchResult } from "../../lib/courtroom";
import { Gavel, Scale, Gift } from "lucide-react";
import { motion } from "motion/react";

interface VerdictBannerProps {
  match: MatchResult;
}

export function VerdictBanner({ match }: VerdictBannerProps) {
  const primaryQuote = match.quotes[0];
  const subQuotes = match.quotes.slice(1);
  const [sessionDate, setSessionDate] = useState<string>("");

  useEffect(() => {
    setSessionDate(new Date().toLocaleDateString());
  }, []);

  return (
    <div className="relative overflow-hidden border-4 border-[#1C1C1C] bg-[#1C1C1C] p-1 shadow-2xl">
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-5 pointer-events-none">
        <Scale className="h-96 w-96 text-[#EBE8E1]" />
      </div>

      <div className="relative z-10 flex flex-col border-2 border-double border-[#EBE8E1]/30 p-6 text-[#EBE8E1] md:p-10">
        <div className="absolute top-4 right-4 rotate-12 opacity-80 md:top-8 md:right-8">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-amber-700 p-2 text-amber-700 mask-image-grunge">
            <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-amber-700 text-center text-[10px] font-black uppercase leading-none tracking-widest">
              Official
              <br />
              Verdict
            </div>
          </div>
        </div>

        <div className="mb-8 flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-amber-600"></div>
            <Gavel className="h-8 w-8 text-amber-500" />
            <div className="h-px w-12 bg-amber-600"></div>
          </div>
          <h2 className="font-serif text-xs font-bold tracking-[0.4em] text-amber-500 uppercase text-center">
            Judicial Finding • Case #{match.puzzleNo}
          </h2>
        </div>

        <div className="space-y-8 text-center">
          <motion.div
            key={match.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <h1 className="font-serif text-2xl leading-snug font-bold text-[#EBE8E1] md:text-4xl md:leading-tight lg:text-5xl">
              {primaryQuote}
            </h1>
          </motion.div>

          {subQuotes.length > 0 && (
            <div className="mx-auto w-full max-w-2xl border-t border-b border-[#EBE8E1]/20 py-6">
              {subQuotes.map((quote, idx) => (
                <motion.p
                  key={`${match.id}-${idx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="font-mono text-sm text-gray-400 italic md:text-base"
                >
                  "{quote}"
                </motion.p>
              ))}
            </div>
          )}

          {/* Prize Section */}
          {match.prize && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mx-auto mt-6 max-w-md border-2 border-dashed border-amber-600/50 bg-amber-900/10 p-4"
            >
              <h3 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-amber-500">
                Court Ordered Settlement
              </h3>
              <div className="flex items-center justify-center gap-3">
                <Gift className="h-5 w-5 text-amber-400" />
                <span className="font-serif text-xl font-bold text-[#EBE8E1] uppercase tracking-wide">
                  {match.prize}
                </span>
                <Gift className="h-5 w-5 text-amber-400" />
              </div>
            </motion.div>
          )}
        </div>

        <div className="mt-12 flex items-end justify-between pt-4">
          <div className="flex flex-col gap-1">
            <span className="h-px w-24 bg-gray-600"></span>
            <span className="text-[10px] tracking-widest text-gray-500 uppercase">
              Presiding Judge
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="font-mono text-xs text-amber-500">{sessionDate}</span>
            <span className="text-[10px] tracking-widest text-gray-500 uppercase">
              Date of Entry
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}