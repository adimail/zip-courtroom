
// Match Result Interface
export interface MatchResult {
  id: number;
  winner: "aditya" | "mahi" | "tie";
  loser: "aditya" | "mahi" | "tie";
  winnerTime: number;
  loserTime: number;
  diff: number;
  isNewRecord: boolean;
  streak: number;
  quotes: string[];
  timestamp: string; // Mock timestamp for display
}

// Raw Data Input Interface
export interface RawMatchData {
  aditya: number[];
  mahi: number[];
}

const VERDICT_TEMPLATES = [
  "Case closed. {W} is declared Not Guilty of Being Slow. {L} charged with First Degree Delay.",
  "Court finds in favor of {W}. {L}’s appeal denied due to insufficient speed.",
  "Judgment delivered: {W} outran {L} by {diff}s. No objections entertained.",
  "After reviewing the evidence, the court unanimously votes for {W}. {L} is sentenced to extra practice.",
  "{W} wins the zip trial. {L} was found tampering with response time."
];

const STREAK_TEMPLATES = [
  "{W} continues the rampage — streak now at {streak}. {L} advised to lawyer up.",
  "Zip criminal on the run: {streak} consecutive wins.",
  "Court records show {W} has dominated {streak} hearings in a row.",
  "Streak warning: {W} has been in contempt of losing lately."
];

const RECORD_TEMPLATES = [
  "New precedent set — fastest zip ever: {winnerTime}s.",
  "Court archives updated. {W} now holds the all-time speed record.",
  "Historic verdict: {W} has redefined the meaning of ‘fast’."
];

const ROAST_TEMPLATES = [
  "{L} again: ‘give me 10 mins’. Court refuses the request.",
  "Objection! {L} was distracted. Overruled.",
  "{W}: calm, composed. {L}: panicking like permissions day.",
  "Court notes that {L} solved slower than a TENET bunksheet approval.",
  "Zip forensic team confirms: {W} simply has better reflexes today.",
  "Verdict includes a side note: {L} should stop blaming the system."
];

const MERCY_TEMPLATES = [
  "This wasn’t a trial. It was an execution. {W} wins by {diff}s.",
  "Court suspects {L} took a tea break mid-zip.",
  "{L} found wandering off during proceedings — case awarded to {W}."
];

const CLOSE_CALL_TEMPLATES = [
  "Split decision! {W} wins by a razor-thin margin of {diff}s.",
  "One more second and the verdict could’ve flipped.",
  "Case nearly ended in a mistrial — but {W} edges ahead."
];

function pickRandom(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function replacePlaceholders(template: string, result: MatchResult): string {
  // Capitalize names for display
  const W = result.winner.charAt(0).toUpperCase() + result.winner.slice(1);
  const L = result.loser.charAt(0).toUpperCase() + result.loser.slice(1);
  
  return template
    .replaceAll("{W}", W)
    .replaceAll("{L}", L)
    .replaceAll("{diff}", result.diff.toFixed(2))
    .replaceAll("{streak}", result.streak.toString())
    .replaceAll("{winnerTime}", result.winnerTime.toFixed(2));
}

export function getQuote(result: MatchResult): string[] {
  if (result.winner === 'tie') return ["Mistrial declared. Both parties finished simultaneously."];

  const verdict = replacePlaceholders(pickRandom(VERDICT_TEMPLATES), result);
  const extras: string[] = [];

  // Streak logic
  if (result.streak >= 2) {
    extras.push(replacePlaceholders(pickRandom(STREAK_TEMPLATES), result));
  }

  // Record logic
  if (result.isNewRecord) {
    extras.push(replacePlaceholders(pickRandom(RECORD_TEMPLATES), result));
  }

  // Contextual logic (Roast vs Mercy vs Close Call)
  if (result.diff > 15) {
    extras.push(replacePlaceholders(pickRandom(MERCY_TEMPLATES), result));
  } else if (result.diff < 3) {
    extras.push(replacePlaceholders(pickRandom(CLOSE_CALL_TEMPLATES), result));
  } else {
    // Add a roast if no other special condition met, or randomly add one anyway to spice it up
    // The prompt says "or using conditions", implying mutually exclusive buckets somewhat, 
    // but also "Roasts (Contextual)". I'll make roasts the default filler if not Mercy/Close.
    extras.push(replacePlaceholders(pickRandom(ROAST_TEMPLATES), result));
  }

  return [verdict, ...extras];
}

export function processMatchData(data: RawMatchData): MatchResult[] {
  const results: MatchResult[] = [];
  let globalBestTime = Infinity;
  let currentStreak = 0;
  let currentStreakWinner: "aditya" | "mahi" | null = null;

  // Determine the length based on the shorter array to be safe
  const matchCount = Math.min(data.aditya.length, data.mahi.length);

  for (let i = 0; i < matchCount; i++) {
    const tAditya = data.aditya[i];
    const tMahi = data.mahi[i];
    
    let winner: "aditya" | "mahi" | "tie" = "tie";
    let loser: "aditya" | "mahi" | "tie" = "tie";
    let winnerTime = 0;
    let loserTime = 0;

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
      winnerTime = tAditya;
      loserTime = tMahi;
    }

    // Diff
    const diff = Math.abs(tAditya - tMahi);

    // Streak Update
    if (winner !== "tie") {
      if (winner === currentStreakWinner) {
        currentStreak++;
      } else {
        currentStreak = 1;
        currentStreakWinner = winner;
      }
    } else {
      currentStreak = 0;
      currentStreakWinner = null;
    }

    // Record Update
    let isNewRecord = false;
    if (winnerTime < globalBestTime && winner !== "tie") {
      globalBestTime = winnerTime;
      isNewRecord = true;
    }

    const partialResult: MatchResult = {
      id: i + 1,
      winner,
      loser,
      winnerTime,
      loserTime,
      diff,
      streak: currentStreak,
      isNewRecord,
      quotes: [], // will populate next
      timestamp: new Date(Date.now() - (matchCount - i) * 86400000).toLocaleDateString() // Mock date
    };

    partialResult.quotes = getQuote(partialResult);
    results.push(partialResult);
  }

  // Return reversed so newest is first, or keep chronological? 
  // Usually court dockets have newest on top. Let's return reversed for display.
  return results.reverse();
}
