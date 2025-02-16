import type { Challenge } from "@/common/contracts/core/pot";

export const pfPayoutChallengeToJustificationUrl = (challenge: Challenge) => {
  try {
    const data = JSON.parse(challenge.reason) as Record<string, unknown>;

    if ("PayoutJustification" in data) {
      return new URL(data.PayoutJustification as string).toString();
    } else return null;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("Failed to parse payout justification as JSON object");
    } else {
      console.error("PayoutJustification is not a valid URL");
    }

    return null;
  }
};
