export const statusF24Enum = {
    "Pending": "Pending",
    "Approved": "Approved",
    "Rejected": "Rejected",
    "Graylisted": "Graylisted",
    "Blacklisted": "Blacklisted"
} as const;
export type StatusF24Enum = (typeof statusF24Enum)[keyof typeof statusF24Enum];