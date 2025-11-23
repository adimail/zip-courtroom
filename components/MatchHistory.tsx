import React from 'react';
import { MatchResult } from '../../lib/courtroom-engine';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Clock, Flame, Trophy } from 'lucide-react';

interface MatchHistoryProps {
  matches: MatchResult[];
}

export function MatchHistory({ matches }: MatchHistoryProps) {
  return (
    <div className="w-full">
      <h3 className="font-serif text-2xl font-bold text-stone-800 mb-4 flex items-center border-b-2 border-stone-800 pb-2">
        <span className="mr-2">📂</span> Case Archive
      </h3>
      
      <div className="space-y-4">
        {matches.map((match) => (
          <Card key={match.id} className="bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Left: Stats Block */}
                <div className="flex-shrink-0 w-full md:w-48 border-b md:border-b-0 md:border-r border-stone-100 pb-4 md:pb-0 md:pr-4 flex flex-col justify-center">
                  <div className="text-xs font-mono text-stone-400 mb-1">CASE #{match.id}</div>
                  <div className="font-bold text-lg text-stone-900 mb-2">
                     <span className="text-green-700">{match.winner.toUpperCase()}</span> 
                     <span className="text-stone-400 mx-1">v.</span> 
                     <span className="text-red-400 line-through text-sm">{match.loser.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <Clock className="w-4 h-4" />
                    <span>{match.winnerTime}s</span>
                    <span className="text-stone-400 text-xs">(-{match.diff.toFixed(2)}s)</span>
                  </div>
                  
                  <div className="flex gap-1 mt-2">
                    {match.streak > 1 && (
                      <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800 hover:bg-orange-200">
                        <Flame className="w-3 h-3 mr-1" /> {match.streak}
                      </Badge>
                    )}
                    {match.isNewRecord && (
                      <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                        <Trophy className="w-3 h-3 mr-1" /> Record
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Right: Quote/Content */}
                <div className="flex-grow flex flex-col justify-center">
                  <p className="font-serif text-lg text-stone-800 leading-relaxed">
                    "{match.quotes[0]}"
                  </p>
                  {match.quotes.slice(1).map((extra, idx) => (
                    <p key={idx} className="font-sans text-sm text-stone-500 mt-2 pl-3 border-l-2 border-stone-300 italic">
                      ↳ {extra}
                    </p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
