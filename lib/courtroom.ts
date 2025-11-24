export type Player = "aditya" | "mahi" | "tie";

export interface RawMatch {
  date: string;
  puzzleNo: string;
  aditya: number | null;
  mahi: number | null;
}

export type RawData = RawMatch[];

export interface MatchResult {
  id: number;
  date: string;
  puzzleNo: string;
  winner: Player;
  loser: Player;
  winnerTime: number | null;
  loserTime: number | null;
  diff: number;
  isNewRecord: boolean;
  streak: number;
  quotes: string[];
}

export interface CourtStats {
  totalGames: number;
  adityaWins: number;
  mahiWins: number;
  ties: number;
  fastestTime: number;
  fastestPlayer: string;
  avgDiff: number;
  adityaAvgTime: number;
  mahiAvgTime: number;
}

export const VERDICT_QUOTES = [
  "Case closed. {W} is declared Not Guilty of Being Slow. {L} charged with First Degree Delay.",
  "Court finds in favor of {W}. {L}’s appeal denied due to insufficient speed.",
  "Judgment delivered: {W} outran {L} by {diff}s. No objections entertained.",
  "After reviewing the evidence, the court unanimously votes for {W}. {L} is sentenced to extra practice.",
  "{W} wins the zip trial. {L} was found tampering with response time.",
];

export const STREAK_QUOTES = [
  "{W} continues the rampage — streak now at {streak}. {L} advised to lawyer up.",
  "Zip criminal on the run: {streak} consecutive wins.",
  "Court records show {W} has dominated {streak} hearings in a row.",
  "Streak warning: {W} has been in contempt of losing lately.",
];

export const RECORD_QUOTES = [
  "New precedent set — fastest zip ever: {winnerTime}s.",
  "Court archives updated. {W} now holds the all-time speed record.",
  "Historic verdict: {W} has redefined the meaning of ‘fast’.",
];

export const ROAST_QUOTES = [
  "{L} again: ‘give me 10 mins’. Court refuses the request.",
  "Objection! {L} was distracted. Overruled.",
  "{W}: calm, composed. {L}: panicking like permissions day.",
  "Court notes that {L} solved slower than a TENET bunksheet approval.",
  "Zip forensic team confirms: {W} simply has better reflexes today.",
  "Verdict includes a side note: {L} should stop blaming the system.",
];

export const MERCY_QUOTES = [
  "This wasn’t a trial. It was an execution. {W} wins by {diff}s.",
  "Court suspects {L} took a tea break mid-zip.",
  "{L} found wandering off during proceedings — case awarded to {W}.",
];

export const CLOSE_CALL_QUOTES = [
  "Split decision! {W} wins by a razor-thin margin of {diff}s.",
  "One more second and the verdict could’ve flipped.",
  "Case nearly ended in a mistrial — but {W} edges ahead.",
];

export const DEFAULT_QUOTES = [
  "{L} failed to appear in court (DNF). {W} wins by default.",
  "One party absent. {W} takes the victory lap alone.",
];

function pickRandom(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateQuotes(
  winner: Player,
  loser: Player,
  diff: number,
  streak: number,
  isNewRecord: boolean,
  winnerTime: number | null
): string[] {
  if (winner === "tie") return ["Mistrial. Both parties failed to submit valid times."];

  if (diff === -1) {
    return [
      pickRandom(DEFAULT_QUOTES)
        .replaceAll("{W}", winner === "aditya" ? "Aditya" : "Mahi")
        .replaceAll("{L}", loser === "aditya" ? "Aditya" : "Mahi"),
    ];
  }

  const verdict = pickRandom(VERDICT_QUOTES)
    .replaceAll("{W}", winner === "aditya" ? "Aditya" : "Mahi")
    .replaceAll("{L}", loser === "aditya" ? "Aditya" : "Mahi")
    .replaceAll("{diff}", diff.toFixed(2));

  const extras: string[] = [];

  if (streak >= 2) {
    extras.push(
      pickRandom(STREAK_QUOTES)
        .replace("{W}", winner === "aditya" ? "Aditya" : "Mahi")
        .replace("{streak}", streak.toString())
        .replace("{L}", loser === "aditya" ? "Aditya" : "Mahi")
    );
  }

  if (isNewRecord && winnerTime !== null) {
    extras.push(
      pickRandom(RECORD_QUOTES)
        .replace("{W}", winner === "aditya" ? "Aditya" : "Mahi")
        .replace("{winnerTime}", winnerTime.toFixed(2))
    );
  }

  if (diff > 15) {
    extras.push(
      pickRandom(MERCY_QUOTES)
        .replaceAll("{W}", winner === "aditya" ? "Aditya" : "Mahi")
        .replaceAll("{L}", loser === "aditya" ? "Aditya" : "Mahi")
        .replaceAll("{diff}", diff.toFixed(2))
    );
  } else if (diff < 3) {
    extras.push(
      pickRandom(CLOSE_CALL_QUOTES)
        .replaceAll("{W}", winner === "aditya" ? "Aditya" : "Mahi")
        .replaceAll("{L}", loser === "aditya" ? "Aditya" : "Mahi")
        .replaceAll("{diff}", diff.toFixed(2))
    );
  } else {
    extras.push(
      pickRandom(ROAST_QUOTES)
        .replaceAll("{W}", winner === "aditya" ? "Aditya" : "Mahi")
        .replaceAll("{L}", loser === "aditya" ? "Aditya" : "Mahi")
    );
  }

  return [verdict, ...extras];
}

export function processMatches(data: RawData): MatchResult[] {
  const matches: MatchResult[] = [];

  let currentStreak = 0;
  let currentStreakWinner: Player | null = null;
  let globalFastestTime = Infinity;

  data.forEach((match, index) => {
    const tAditya = match.aditya;
    const tMahi = match.mahi;

    let winner: Player = "tie";
    let loser: Player = "tie";
    let winnerTime: number | null = null;
    let loserTime: number | null = null;
    let diff = 0;

    if (tAditya === null && tMahi === null) {
      winner = "tie";
    } else if (tAditya === null) {
      winner = "mahi";
      loser = "aditya";
      winnerTime = tMahi;
      loserTime = null;
      diff = -1;
    } else if (tMahi === null) {
      winner = "aditya";
      loser = "mahi";
      winnerTime = tAditya;
      loserTime = null;
      diff = -1;
    } else {
      if (tAditya < tMahi) {
        winner = "aditya";
        loser = "mahi";
        winnerTime = tAditya;
        loserTime = tMahi;
      } else if (tMahi < tAditya) {
        winner = "mahi";
        loser = "aditya";
        winnerTime = tMahi;
        loserTime = tAditya;
      } else {
        winner = "tie";
        winnerTime = tAditya;
        loserTime = tMahi;
      }

      if (winner !== "tie" && winnerTime !== null && loserTime !== null) {
        diff = Math.abs(loserTime - winnerTime);
      }
    }

    if (winner !== "tie") {
      if (winner === currentStreakWinner) {
        currentStreak++;
      } else {
        currentStreakWinner = winner;
        currentStreak = 1;
      }
    } else {
      currentStreak = 0;
      currentStreakWinner = null;
    }

    let isNewRecord = false;
    if (winnerTime !== null && winnerTime < globalFastestTime) {
      globalFastestTime = winnerTime;
      isNewRecord = true;
    }

    const quotes = generateQuotes(winner, loser, diff, currentStreak, isNewRecord, winnerTime);

    matches.push({
      id: index,
      date: match.date,
      puzzleNo: match.puzzleNo,
      winner,
      loser,
      winnerTime,
      loserTime,
      diff,
      isNewRecord,
      streak: currentStreak,
      quotes,
    });
  });

  return matches;
}

export function calculateStats(matches: MatchResult[], rawData: RawData): CourtStats {
  let adityaWins = 0;
  let mahiWins = 0;
  let ties = 0;
  let fastestTime = Infinity;
  let fastestPlayer = "-";
  let totalDiff = 0;
  let diffCount = 0;

  let adityaTotalTime = 0;
  let adityaCount = 0;
  let mahiTotalTime = 0;
  let mahiCount = 0;

  matches.forEach((m) => {
    if (m.winner === "aditya") adityaWins++;
    else if (m.winner === "mahi") mahiWins++;
    else ties++;

    if (m.winnerTime !== null && m.winnerTime < fastestTime) {
      fastestTime = m.winnerTime;
      fastestPlayer = m.winner;
    }

    if (m.diff >= 0) {
      totalDiff += m.diff;
      diffCount++;
    }
  });

  rawData.forEach((r) => {
    if (r.aditya) {
      adityaTotalTime += r.aditya;
      adityaCount++;
    }
    if (r.mahi) {
      mahiTotalTime += r.mahi;
      mahiCount++;
    }
  });

  return {
    totalGames: matches.length,
    adityaWins,
    mahiWins,
    ties,
    fastestTime: fastestTime === Infinity ? 0 : fastestTime,
    fastestPlayer,
    avgDiff: diffCount > 0 ? parseFloat((totalDiff / diffCount).toFixed(2)) : 0,
    adityaAvgTime: adityaCount > 0 ? parseFloat((adityaTotalTime / adityaCount).toFixed(2)) : 0,
    mahiAvgTime: mahiCount > 0 ? parseFloat((mahiTotalTime / mahiCount).toFixed(2)) : 0,
  };
}

export const MOCK_API_DATA: RawData = [
  { date: "10 Nov 2025", puzzleNo: "238", aditya: 8, mahi: 15 },
  { date: "11 Nov 2025", puzzleNo: "239", aditya: 8, mahi: 12 },
  { date: "12 Nov 2025", puzzleNo: "240", aditya: null, mahi: null },
  { date: "13 Nov 2025", puzzleNo: "241", aditya: 12, mahi: 11 },
  { date: "14 Nov 2025", puzzleNo: "242", aditya: null, mahi: null },
  { date: "15 Nov 2025", puzzleNo: "243", aditya: 11, mahi: 18 },
  { date: "16 Nov 2025", puzzleNo: "244", aditya: 14, mahi: 18 },
  { date: "17 Nov 2025", puzzleNo: "245", aditya: 5, mahi: 7 },
  { date: "18 Nov 2025", puzzleNo: "246", aditya: 11, mahi: 16 },
  { date: "19 Nov 2025", puzzleNo: "247", aditya: 18, mahi: 21 },
  { date: "20 Nov 2025", puzzleNo: "248", aditya: 8, mahi: null },
  { date: "21 Nov 2025", puzzleNo: "249", aditya: 31, mahi: 83 },
  { date: "22 Nov 2025", puzzleNo: "250", aditya: 54, mahi: 44 },
  { date: "23 Nov 2025", puzzleNo: "251", aditya: 66, mahi: 46 },
];
