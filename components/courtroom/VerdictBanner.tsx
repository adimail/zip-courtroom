"use client";

import { useState, useEffect } from "react";
import { MatchResult } from "../../lib/courtroom";
import { Gavel, Scale } from "lucide-react";
import { motion } from "motion/react";

interface VerdictBannerProps {
  match: MatchResult;
}

export function VerdictBanner({ match }: VerdictBannerProps) {
  const primaryQuote = match.quotes[0];
  const subQuotes = match.quotes.slice(1);

  // Fix Hydration Error: Only render the current date on the client
  const [sessionDate, setSessionDate] = useState<string>("");

  useEffect(() => {
    setSessionDate(new Date().toLocaleDateString());
  }, []);

  return (
    <div className="relative overflow-hidden rounded-lg border-4 border-amber-700 bg-slate-900 p-4 text-amber-50 shadow-2xl md:p-8">
      <div className="absolute top-0 left-0 h-1 w-full bg-amber-600 md:h-2" />
      <div className="absolute bottom-0 left-0 h-1 w-full bg-amber-600 md:h-2" />

      <div className="mb-4 flex items-center justify-center gap-2 opacity-50 md:mb-6 md:gap-4">
        <Scale className="h-8 w-8 text-amber-700 md:h-12 md:w-12" />
        <div className="h-px flex-1 bg-amber-800" />
        <Gavel className="h-8 w-8 text-amber-700 md:h-12 md:w-12" />
      </div>

      <div className="space-y-4 text-center md:space-y-6">
        <div className="mb-2 inline-block border-b-2 border-amber-600/50 pb-1 md:mb-4 md:pb-2">
          <h2 className="font-serif text-[10px] font-bold tracking-widest text-amber-500 uppercase md:text-sm">
            Official Verdict • Match #{match.id + 1}
          </h2>
        </div>

        <motion.h1
          key={match.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-xl leading-snug font-bold text-amber-50 md:text-4xl md:leading-tight lg:text-5xl"
        >
          {primaryQuote}
        </motion.h1>

        <div className="mt-4 space-y-2 md:mt-8 md:space-y-3">
          {subQuotes.map((quote, idx) => (
            <motion.p
              key={`${match.id}-${idx}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className="border-l-2 border-slate-700 pl-3 text-left font-mono text-xs text-slate-400 italic md:border-l-4 md:pl-4 md:text-center md:text-lg"
            >
              "{quote}"
            </motion.p>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-end justify-between border-t border-slate-800 pt-3 md:mt-12 md:pt-4">
        <div className="text-[10px] tracking-widest text-slate-500 uppercase md:text-xs">
          Judge: ZIP AI
        </div>
        <div className="text-[10px] tracking-widest text-slate-500 uppercase md:text-xs">
          {/* Only render date if available to prevent server/client mismatch */}
          Session: {sessionDate || "..."}
        </div>
      </div>
    </div>
  );
}
