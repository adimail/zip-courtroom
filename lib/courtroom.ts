import { format, parse, addDays } from "date-fns";

export type Player = "aditya" | "mahi" | "tie" | "draw";

export interface RawMatch {
  puzzleNo: string;
  aditya: number | null;
  mahi: number | null;
  prize: string | null;
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
  prize: string | null;
}

export interface CourtStats {
  totalGames: number;
  adityaWins: number;
  mahiWins: number;
  ties: number;
  draws: number;
  fastestTime: number;
  fastestPlayer: string;
  avgDiff: number;
  adityaAvgTime: number;
  mahiAvgTime: number;
}

export function getDeterministicVerdict<T>(caseId: string, winnerId: string, verdicts: T[]): T {
  if (!verdicts || verdicts.length === 0) {
    throw new Error("The verdicts array cannot be empty.");
  }

  const combinedString = `${caseId}-${winnerId}`;
  let hash = 0;

  for (let i = 0; i < combinedString.length; i++) {
    const charCode = combinedString.charCodeAt(i);
    hash = (hash << 5) - hash + charCode;
    hash |= 0;
  }

  const index = Math.abs(hash) % verdicts.length;
  return verdicts[index];
}

export const VERDICT_QUOTES = [
  "Case closed. {W} is declared Not Guilty of Being Slow. {L} charged with First Degree Delay.",
  "Court finds in favor of {W}. {L}’s appeal denied due to insufficient speed.",
  "Judgment delivered: {W} outran {L} by {diff}s. No objections entertained.",
  "After reviewing the evidence, the court unanimously votes for {W}. {L} is sentenced to extra practice.",
  "{W} wins the zip trial. {L} was found tampering with response time.",
  "Order in the court! {W} slams the gavel down {diff}s faster than the defense.",
  "The jury has deliberated for 0 seconds. {W} wins by a landslide.",
  "Summary judgment granted to {W}. {L}’s defense was inadmissible.",
  "Habeas Corpus? More like Habeas Speedus. {W} takes the verdict.",
  "The prosecution rests, and so did {L}. {W} takes the win.",
  "By the power vested in this algorithm, {W} is declared the victor.",
  "Justice is blind, but the clock isn't. {W} wins.",
  "Subpoena served: {L} ordered to witness {W}'s victory lap.",
  "The docket is clear. {W} reigns supreme today.",
  "Legal precedent established: {W} is currently the faster party.",
];

export const STREAK_QUOTES = [
  "{W} continues the rampage — streak now at {streak}. {L} advised to lawyer up.",
  "Zip criminal on the run: {streak} consecutive wins.",
  "Court records show {W} has dominated {streak} hearings in a row.",
  "Streak warning: {W} has been in contempt of losing lately.",
  "Double jeopardy doesn't apply here; {W} kills it for the {streak}th time.",
  "A dynasty is forming. {W} extends the winning streak to {streak}.",
  "The bailiff can't stop them. {W} wins {streak} in a row.",
  "Serial winner on the loose. Count is now {streak}.",
  "Objection! {W} is winning too much ({streak}x). Overruled.",
];

export const RECORD_QUOTES = [
  "New precedent set — fastest zip ever: {winnerTime}s.",
  "Court archives updated. {W} now holds the all-time speed record.",
  "Historic verdict: {W} has redefined the meaning of ‘fast’.",
  "Supreme Court ruling: {winnerTime}s is the new gold standard.",
  "Speed limit violation detected. {W} clocked at a record {winnerTime}s.",
  "The stenographer couldn't even type that fast. New Record!",
  "Statute of limitations on 'slow' just expired. New World Record.",
];

export const ROAST_QUOTES = [
  "{L} again: ‘give me 10 mins’. Court refuses the request.",
  "Objection! {L} was distracted. Overruled.",
  "{W}: calm, composed. {L}: panicking like permissions day.",
  "Court notes that {L} solved slower than a TENET bunksheet approval.",
  "Zip forensic team confirms: {W} simply has better reflexes today.",
  "Verdict includes a side note: {L} should stop blaming the system.",
  "{L} is currently filing for bankruptcy of speed.",
  "{L} pleads the fifth on why they were so slow.",
  "Contempt of court for wasting time. {L} needs to focus.",
  "Witnesses say {L} was asleep at the wheel.",
  "Cross-examination reveals {L} was thinking about lunch.",
  "The defense claims lag. The court claims skill issue.",
  "{L}'s performance has been stricken from the record for embarrassment.",
  "Sidebar: {L}, are you even trying?",
  "Motion to dismiss {L}'s excuse is granted.",
];

export const MERCY_QUOTES = [
  "This wasn’t a trial. It was an execution. {W} wins by {diff}s.",
  "Court suspects {L} took a tea break mid-zip.",
  "{L} found wandering off during proceedings — case awarded to {W}.",
  "Cruel and unusual punishment. {W} wins by a massive margin.",
  "The statute of limitations ran out while {L} was solving.",
  "Search and Rescue team dispatched for {L}.",
  "It was a massacre in the courtroom. {diff}s difference.",
];

export const CLOSE_CALL_QUOTES = [
  "Split decision! {W} wins by a razor-thin margin of {diff}s.",
  "One more second and the verdict could’ve flipped.",
  "Case nearly ended in a mistrial — but {W} edges ahead.",
  "Photo finish evidence required. {W} wins by {diff}s.",
  "Hung jury avoided by milliseconds.",
  "A nail-biter in the Supreme Court. {W} survives.",
  "Too close to call without the replay. {W} by {diff}s.",
];

export const DEFAULT_QUOTES = [
  "{L} failed to appear in court (DNF). {W} wins by default.",
  "One party absent. {W} takes the victory lap alone.",
  "Bail jumping recorded. {L} is nowhere to be found.",
  "Subpoena ignored by {L}. {W} wins via forfeit.",
  "Default judgment entered against {L} for non-appearance.",
];

export const PRIZE_QUOTES = [
  "The court awards punitive damages in the form of: {prize}.",
  "Settlement reached. {W} takes the loot: {prize}.",
  "To the victor go the spoils. Asset transfer: {prize}.",
  "Court orders immediate transfer of assets: {prize} to {W}.",
  "Damages awarded to the plaintiff: {prize}.",
];

export const TIE_QUOTES = [
  "A perfect deadlock. The court rules this case a tie. Neither party gains the upper hand.",
  "Unprecedented speed synchronization. Case dismissed due to equal performance.",
  "The clock stops precisely at the same moment. It's a tie.",
  "Judgment reserved. The times were identical. We call this a 'Zip Tie'.",
];

export const DRAW_QUOTES = [
  "Mistrial declared. Both parties failed to appear in court.",
  "Case dismissed. No valid submissions were entered into the record.",
  "The courtroom is empty. Both contestants were absent, resulting in a draw.",
  "A double forfeit. The case is declared a draw due to non-appearance.",
];

const REFERENCE_DATE = parse("10 Nov 2025", "d MMM yyyy", new Date(2025, 10, 10));
const REFERENCE_PUZZLE = 238;

function calculateDate(puzzleNo: string): string {
  const currentPuzzle = parseInt(puzzleNo, 10);
  if (isNaN(currentPuzzle)) return "Unknown Date";

  const dayDifference = currentPuzzle - REFERENCE_PUZZLE;

  const targetDate = addDays(REFERENCE_DATE, dayDifference);

  return format(targetDate, "d MMM yyyy");
}

export function generateQuotes(
  winner: Player,
  loser: Player,
  diff: number,
  streak: number,
  isNewRecord: boolean,
  winnerTime: number | null,
  prize: string | null,
  puzzleNo: string
): string[] {
  if (winner === "draw") {
    const quote = getDeterministicVerdict(puzzleNo, "draw", DRAW_QUOTES);
    return [quote, "The court awaits their next appearance."];
  }

  if (winner === "tie") {
    const quote = getDeterministicVerdict(puzzleNo, "tie", TIE_QUOTES);
    return [
      quote + ` Final time: ${winnerTime!.toFixed(2)}s.`,
      "The court's decision is final: stalemate.",
    ];
  }

  const winnerName = winner === "aditya" ? "Aditya" : "Mahi";
  const loserName = loser === "aditya" ? "Aditya" : "Mahi";

  if (diff === -1) {
    const quote = getDeterministicVerdict(puzzleNo, `${winner}-default`, DEFAULT_QUOTES);
    return [quote.replaceAll("{W}", winnerName).replaceAll("{L}", loserName)];
  }

  const verdict = getDeterministicVerdict(puzzleNo, `${winner}-verdict`, VERDICT_QUOTES)
    .replaceAll("{W}", winnerName)
    .replaceAll("{L}", loserName)
    .replaceAll("{diff}", diff.toFixed(2));

  const extras: string[] = [];

  if (prize) {
    extras.push(
      getDeterministicVerdict(puzzleNo, `${winner}-prize`, PRIZE_QUOTES)
        .replaceAll("{W}", winnerName)
        .replaceAll("{L}", loserName)
        .replaceAll("{prize}", prize)
    );
  }

  if (streak >= 2) {
    extras.push(
      getDeterministicVerdict(puzzleNo, `${winner}-streak`, STREAK_QUOTES)
        .replaceAll("{W}", winnerName)
        .replaceAll("{streak}", streak.toString())
        .replaceAll("{L}", loserName)
    );
  }

  if (isNewRecord && winnerTime !== null) {
    extras.push(
      getDeterministicVerdict(puzzleNo, `${winner}-record`, RECORD_QUOTES)
        .replaceAll("{W}", winnerName)
        .replaceAll("{winnerTime}", winnerTime.toFixed(2))
    );
  }

  if (diff > 15) {
    extras.push(
      getDeterministicVerdict(puzzleNo, `${winner}-mercy`, MERCY_QUOTES)
        .replaceAll("{W}", winnerName)
        .replaceAll("{L}", loserName)
        .replaceAll("{diff}", diff.toFixed(2))
    );
  } else if (diff < 3) {
    extras.push(
      getDeterministicVerdict(puzzleNo, `${winner}-close`, CLOSE_CALL_QUOTES)
        .replaceAll("{W}", winnerName)
        .replaceAll("{L}", loserName)
        .replaceAll("{diff}", diff.toFixed(2))
    );
  } else {
    extras.push(
      getDeterministicVerdict(puzzleNo, `${winner}-roast`, ROAST_QUOTES)
        .replaceAll("{W}", winnerName)
        .replaceAll("{L}", loserName)
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

    const date = calculateDate(match.puzzleNo);

    let winner: Player = "draw";
    let loser: Player = "draw";
    let winnerTime: number | null = null;
    let loserTime: number | null = null;
    let diff = 0;

    if (tAditya === null && tMahi === null) {
      winner = "draw";
      loser = "draw";
    } else if (tAditya === null) {
      winner = "mahi";
      loser = "aditya";
      winnerTime = tMahi;
      diff = -1;
    } else if (tMahi === null) {
      winner = "aditya";
      loser = "mahi";
      winnerTime = tAditya;
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
        loser = "tie";
        winnerTime = tAditya;
        loserTime = tMahi;
      }

      if (winner !== "tie" && winnerTime !== null && loserTime !== null) {
        diff = Math.abs(loserTime - winnerTime);
      }
    }

    if (winner !== "tie" && winner !== "draw") {
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
      match.prize,
      match.puzzleNo
    );

    matches.push({
      id: index,
      date,
      puzzleNo: match.puzzleNo,
      winner,
      loser,
      winnerTime,
      loserTime,
      diff,
      isNewRecord,
      streak: currentStreak,
      quotes,
      prize: match.prize,
    });
  });

  return matches;
}

export function calculateStats(matches: MatchResult[], rawData: RawData): CourtStats {
  let adityaWins = 0;
  let mahiWins = 0;
  let ties = 0;
  let draws = 0;
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
    else if (m.winner === "tie") ties++;
    else if (m.winner === "draw") draws++;

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
    draws,
    fastestTime: fastestTime === Infinity ? 0 : fastestTime,
    fastestPlayer,
    avgDiff: diffCount > 0 ? parseFloat((totalDiff / diffCount).toFixed(2)) : 0,
    adityaAvgTime: adityaCount > 0 ? parseFloat((adityaTotalTime / adityaCount).toFixed(2)) : 0,
    mahiAvgTime: mahiCount > 0 ? parseFloat((mahiTotalTime / mahiCount).toFixed(2)) : 0,
  };
}

export const MOCK_API_DATA: RawData = [
  { puzzleNo: "238", aditya: 8, mahi: 15, prize: null },
  { puzzleNo: "239", aditya: 8, mahi: 12, prize: null },
  { puzzleNo: "240", aditya: null, mahi: null, prize: null },
  { puzzleNo: "241", aditya: 12, mahi: 11, prize: "Diary" },
  { puzzleNo: "242", aditya: null, mahi: null, prize: null },
  { puzzleNo: "243", aditya: 11, mahi: 18, prize: null },
  { puzzleNo: "244", aditya: 14, mahi: 18, prize: null },
  { puzzleNo: "245", aditya: 5, mahi: 7, prize: null },
  { puzzleNo: "246", aditya: 11, mahi: 16, prize: null },
  { puzzleNo: "247", aditya: 18, mahi: 21, prize: "Shawarma" },
  { puzzleNo: "248", aditya: 8, mahi: null, prize: null },
  { puzzleNo: "249", aditya: 31, mahi: 83, prize: null },
  { puzzleNo: "250", aditya: 54, mahi: 44, prize: null },
  { puzzleNo: "251", aditya: 66, mahi: 46, prize: null },
  { puzzleNo: "252", aditya: 8, mahi: 7, prize: null },
  { puzzleNo: "253", aditya: 21, mahi: 27, prize: null },
  { puzzleNo: "254", aditya: 11, mahi: 18, prize: null },
  { puzzleNo: "255", aditya: 12, mahi: 29, prize: null },
  { puzzleNo: "256", aditya: 13, mahi: 74, prize: null },
  { puzzleNo: "257", aditya: 25, mahi: 74, prize: null },
  { puzzleNo: "258", aditya: 17, mahi: 105, prize: null },
  { puzzleNo: "259", aditya: 9, mahi: 9, prize: null },
];
