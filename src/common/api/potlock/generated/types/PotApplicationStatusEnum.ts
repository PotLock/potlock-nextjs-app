export const potApplicationStatusEnum = {
  Pending: "Pending",
  Approved: "Approved",
  Rejected: "Rejected",
  InReview: "InReview",
} as const;
export type PotApplicationStatusEnum =
  (typeof potApplicationStatusEnum)[keyof typeof potApplicationStatusEnum];
