export const defaultRegistrationStatusEnum = {
    "Pending": "Pending",
    "Approved": "Approved",
    "Rejected": "Rejected",
    "Graylisted": "Graylisted",
    "Blacklisted": "Blacklisted"
} as const;
export type DefaultRegistrationStatusEnum = (typeof defaultRegistrationStatusEnum)[keyof typeof defaultRegistrationStatusEnum];