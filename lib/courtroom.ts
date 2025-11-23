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
  winnerTime: number | null,
): string[] {
  if (winner === "tie")
    return ["Mistrial. Both parties failed to submit valid times."];

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
        .replace("{L}", loser === "aditya" ? "Aditya" : "Mahi"),
    );
  }

  if (isNewRecord && winnerTime !== null) {
    extras.push(
      pickRandom(RECORD_QUOTES)
        .replace("{W}", winner === "aditya" ? "Aditya" : "Mahi")
        .replace("{winnerTime}", winnerTime.toFixed(2)),
    );
  }

  if (diff > 15) {
    extras.push(
      pickRandom(MERCY_QUOTES)
        .replaceAll("{W}", winner === "aditya" ? "Aditya" : "Mahi")
        .replaceAll("{L}", loser === "aditya" ? "Aditya" : "Mahi")
        .replaceAll("{diff}", diff.toFixed(2)),
    );
  } else if (diff < 3) {
    extras.push(
      pickRandom(CLOSE_CALL_QUOTES)
        .replaceAll("{W}", winner === "aditya" ? "Aditya" : "Mahi")
        .replaceAll("{L}", loser === "aditya" ? "Aditya" : "Mahi")
        .replaceAll("{diff}", diff.toFixed(2)),
    );
  } else {
    extras.push(
      pickRandom(ROAST_QUOTES)
        .replaceAll("{W}", winner === "aditya" ? "Aditya" : "Mahi")
        .replaceAll("{L}", loser === "aditya" ? "Aditya" : "Mahi"),
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

    const quotes = generateQuotes(
      winner,
      loser,
      diff,
      currentStreak,
      isNewRecord,
      winnerTime,
    );

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

export const MOCK_API_DATA: RawData = [
  { date: "10 Nov 2025", puzzleNo: "238", aditya: 61, mahi: 65 },
  { date: "11 Nov 2025", puzzleNo: "239", aditya: 32, mahi: 40 },
];
