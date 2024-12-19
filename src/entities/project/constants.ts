import { ProjectCategoryOption, ProjectListingStatusOption } from "./types";

export const MAX_PROJECT_DESCRIPTION_LENGTH = 80;

export const categories: ProjectCategoryOption[] = [
  { label: "DeSci", val: "DeSci" },
  { label: "Open Source", val: "Open Source" },
  { label: "Non Profit", val: "Non Profit" },
  { label: "Social Impact", val: "Social Impact" },
  { label: "Climate", val: "Climate" },
  { label: "Public Good", val: "Public Good" },
  { label: "Community", val: "Community" },
  { label: "Education", val: "Education" },
];

export const statuses: ProjectListingStatusOption[] = [
  { label: "All", val: "All" },
  { label: "Approved", val: "Approved" },
  { label: "Pending", val: "Pending" },
  { label: "Rejected", val: "Rejected" },
  { label: "Graylisted", val: "Graylisted" },
  { label: "Blacklisted", val: "Blacklisted" },
];
