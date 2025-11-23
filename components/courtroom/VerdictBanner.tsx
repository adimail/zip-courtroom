import { MatchResult } from "../../lib/courtroom";
import { Gavel, Scale } from "lucide-react";
import { motion } from "motion/react";

interface VerdictBannerProps {
  match: MatchResult;
}

export function VerdictBanner({ match }: VerdictBannerProps) {
  const primaryQuote = match.quotes[0];
  const subQuotes = match.quotes.slice(1);

  return (
    <div className="bg-slate-900 text-amber-50 p-8 rounded-lg border-4 border-amber-700 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-amber-600" />
      <div className="absolute bottom-0 left-0 w-full h-2 bg-amber-600" />
      
      <div className="flex items-center justify-center gap-4 mb-6 opacity-50">
        <Scale className="w-12 h-12 text-amber-700" />
        <div className="h-px bg-amber-800 flex-1" />
        <Gavel className="w-12 h-12 text-amber-700" />
      </div>

      <div className="text-center space-y-6">
        <div className="inline-block border-b-2 border-amber-600/50 pb-2 mb-4">
          <h2 className="text-amber-500 font-serif tracking-widest text-sm uppercase font-bold">
            Official Verdict • Match #{match.id + 1}
          </h2>
        </div>

        <motion.h1 
          key={match.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-serif leading-tight text-amber-50 font-bold"
        >
          {primaryQuote}
        </motion.h1>

        <div className="space-y-3 mt-8">
          {subQuotes.map((quote, idx) => (
            <motion.p 
              key={`${match.id}-${idx}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + (idx * 0.1) }}
              className="text-lg text-slate-400 font-mono border-l-4 border-slate-700 pl-4 italic"
            >
              "{quote}"
            </motion.p>
          ))}
        </div>
      </div>

      <div className="mt-12 flex justify-between items-end border-t border-slate-800 pt-4">
        <div className="text-xs text-slate-500 uppercase tracking-widest">
          Judge: ZIP AI Algorithm
        </div>
        <div className="text-xs text-slate-500 uppercase tracking-widest">
          Court Session: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
