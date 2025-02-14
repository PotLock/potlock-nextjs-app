import type { Challenge } from "@/common/contracts/core/pot";
import type { VotingRoundElectionResult } from "@/entities/voting-round";

// TODO: Extract and validate URL as URL
export const pfPayoutChallengeToJustification = (challenge: Challenge) => {
  try {
    const data = JSON.parse(challenge.reason) as Record<string, unknown>;

    return "PayoutJustification" in data
      ? (data.PayoutJustification as VotingRoundElectionResult)
      : null;
  } catch {
    console.error("Failed to parse challenge reason as JSON object");
    return null;
  }
};
