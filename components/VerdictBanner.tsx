import React from 'react';
import { MatchResult } from '../../lib/courtroom-engine';
import { Gavel, Scale, Trophy, AlertTriangle, Flame, Timer } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';

interface VerdictBannerProps {
  latestMatch: MatchResult;
}

export function VerdictBanner({ latestMatch }: VerdictBannerProps) {
  if (!latestMatch) return null;

  const primaryQuote = latestMatch.quotes[0];
  const secondaryQuotes = latestMatch.quotes.slice(1);

  return (
    <div className="w-full mb-8">
      <div className="relative border-4 border-double border-stone-800 bg-stone-50 p-1 shadow-xl">
        {/* Decorative Corner Elements */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-stone-800" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-stone-800" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-stone-800" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-stone-800" />

        <Card className="border-0 shadow-none bg-stone-100/50">
          <CardHeader className="text-center pb-2 space-y-1">
            <div className="flex justify-center mb-2">
              <Scale className="w-12 h-12 text-stone-800" />
            </div>
            <div className="uppercase tracking-[0.2em] text-xs font-bold text-stone-500">
              Official Court Ruling • Case #{latestMatch.id}
            </div>
            <CardTitle className="font-serif text-4xl md:text-6xl font-black text-stone-900 leading-tight">
              VERDICT: {latestMatch.winner.toUpperCase()} vs {latestMatch.loser.toUpperCase()}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-6 pt-4">
            {/* Main Verdict */}
            <div className="space-y-2">
              <h2 className="font-serif text-2xl md:text-3xl text-stone-800 italic font-medium leading-snug">
                "{primaryQuote}"
              </h2>
              <Separator className="my-4 bg-stone-300 w-1/2 mx-auto" />
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap justify-center gap-4 text-sm font-mono uppercase tracking-wide text-stone-600">
              <Badge variant="outline" className="border-stone-800 text-stone-800 px-3 py-1 bg-transparent rounded-none">
                <Timer className="w-4 h-4 mr-2" />
                Winner Time: {latestMatch.winnerTime}s
              </Badge>
              <Badge variant="outline" className="border-stone-800 text-stone-800 px-3 py-1 bg-transparent rounded-none">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Diff: +{latestMatch.diff.toFixed(2)}s
              </Badge>
              {latestMatch.streak > 1 && (
                <Badge variant="default" className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-none">
                  <Flame className="w-4 h-4 mr-2" />
                  Streak: {latestMatch.streak}
                </Badge>
              )}
              {latestMatch.isNewRecord && (
                <Badge variant="default" className="bg-stone-900 hover:bg-stone-800 text-white px-3 py-1 rounded-none">
                  <Trophy className="w-4 h-4 mr-2" />
                  New Record
                </Badge>
              )}
            </div>

            {/* Secondary Quotes / Subtext */}
            {secondaryQuotes.length > 0 && (
              <div className="mt-6 p-4 bg-stone-200/50 border border-stone-300">
                 <h3 className="text-xs uppercase font-bold text-stone-500 mb-2 tracking-wider">Additional Findings</h3>
                 <div className="space-y-2">
                   {secondaryQuotes.map((quote, idx) => (
                     <p key={idx} className="font-serif text-lg text-stone-700">
                       <Gavel className="inline w-4 h-4 mr-2 mb-1 text-stone-600" />
                       {quote}
                     </p>
                   ))}
                 </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
