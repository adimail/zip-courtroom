"use client";

import { useState, useMemo, useEffect } from "react";
import { MOCK_API_DATA, processMatches, RawData } from "@/lib/courtroom";
import { VerdictBanner } from "@/components/courtroom/VerdictBanner";
import { MatchList } from "@/components/courtroom/MatchList";
import { Gavel, Loader2 } from "lucide-react";

export default function Home() {
  const [rawData, setRawData] = useState<RawData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/matches');
        if (!response.ok) {
          throw new Error('Failed to fetch match data');
        }
        const data = await response.json();
        setRawData(data);
      } catch (err) {
        setError("Could not load court records. Using offline backup.");
        setRawData(MOCK_API_DATA);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const matches = useMemo(() => {
    if (!rawData) return [];
    return processMatches(rawData);
  }, [rawData]);

  const [selectedMatchId, setSelectedMatchId] = useState<number>(0);

  useEffect(() => {
    if (matches.length > 0) {
      setSelectedMatchId(matches[matches.length - 1].id);
    }
  }, [matches]);

  const selectedMatch = matches.find(m => m.id === selectedMatchId) || matches[0];

  const simulateNewMatch = () => {
    if (!rawData) return;
    const newAdityaTime = Math.floor(Math.random() * 60) + 10;
    const newMahiTime = Math.floor(Math.random() * 60) + 10;
    
    // Generate next puzzle number based on last entry
    const lastMatch = rawData[rawData.length - 1];
    const nextPuzzle = lastMatch ? (parseInt(lastMatch.puzzleNo) + 1).toString() : "1";

    setRawData(prev => {
      if (!prev) return null;
      return [
        ...prev,
        {
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          puzzleNo: nextPuzzle,
          aditya: newAdityaTime,
          mahi: newMahiTime
        }
      ];
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-amber-600 animate-spin" />
          <p className="text-slate-600 font-serif">Accessing Court Archives...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-slate-900 text-amber-50 border-b-4 border-amber-600 py-6">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-600 p-2 rounded-lg">
              <Gavel className="w-8 h-8 text-slate-900" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tight">ZIP COURTROOM</h1>
              <p className="text-amber-500/80 text-xs uppercase tracking-widest">Random Quote Generator System</p>
            </div>
          </div>
          <button
            onClick={simulateNewMatch}
            className="bg-amber-600 hover:bg-amber-500 text-slate-900 font-bold py-2 px-4 rounded transition-colors text-sm"
          >
            Simulate New Case
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            {selectedMatch ? (
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <h2 className="text-xl font-serif font-bold text-slate-800">
                      Puzzle #{selectedMatch.puzzleNo}: {selectedMatch.winner.toUpperCase()} vs {selectedMatch.loser.toUpperCase()}
                    </h2>
                    <span className="text-sm text-slate-500 font-mono">{selectedMatch.date}</span>
                 </div>
                 <VerdictBanner match={selectedMatch} />

                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    <StatCard label="Winner Time" value={selectedMatch.winnerTime ? `${selectedMatch.winnerTime}s` : "N/A"} />
                    <StatCard label="Loser Time" value={selectedMatch.loserTime ? `${selectedMatch.loserTime}s` : "DNF"} />
                    <StatCard label="Diff" value={selectedMatch.diff >= 0 ? `+${selectedMatch.diff.toFixed(2)}s` : "-"} />
                    <StatCard label="Streak" value={selectedMatch.streak.toString()} highlighted={selectedMatch.streak >= 2} />
                 </div>
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center bg-slate-100 rounded-lg border-2 border-dashed border-slate-300">
                <p className="text-slate-500">No cases filed yet.</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-4">
            <MatchList
              matches={matches}
              selectedMatchId={selectedMatchId}
              onSelectMatch={setSelectedMatchId}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, highlighted }: { label: string, value: string, highlighted?: boolean }) {
  return (
    <div className={`bg-white p-4 rounded-lg border shadow-sm ${highlighted ? 'border-amber-500 bg-amber-50' : 'border-slate-200'}`}>
      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</div>
      <div className={`text-2xl font-bold ${highlighted ? 'text-amber-700' : 'text-slate-800'}`}>{value}</div>
    </div>
  );
}