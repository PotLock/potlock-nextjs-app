import { ProjectListingStatusOption } from "./types";

export const statuses: ProjectListingStatusOption[] = [
  { label: "All", val: "All" },
  { label: "Approved", val: "Approved" },
  { label: "Pending", val: "Pending" },
  { label: "Rejected", val: "Rejected" },
  { label: "Graylisted", val: "Graylisted" },
  { label: "Blacklisted", val: "Blacklisted" },
];
