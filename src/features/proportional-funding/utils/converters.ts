import type { Challenge } from "@/common/contracts/core/pot";

export const challengeToJustification = (challenge: Challenge) => {
  try {
    const data = JSON.parse(challenge.reason) as Record<string, unknown>;

    return "PayoutJustification" in data && typeof data.PayoutJustification === "string"
      ? data.PayoutJustification
      : null;
  } catch {
    return null;
  }
};
