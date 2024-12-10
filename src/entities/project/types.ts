import { ListRegistrationStatus } from "@/common/api/indexer";

export enum ProjectCategory {
  "Social Impact" = "Social Impact",
  "Non Profit" = "Non Profit",
  "Climate" = "Climate",
  "Public Good" = "Public Good",
  "DeSci" = "DeSci",
  "Open Source" = "Open Source",
  "Community" = "Community",
  "Education" = "Education",
}

export type ProjectCategoryVariant = keyof typeof ProjectCategory;

export type ProjectCategoryOption = {
  label: string;
  val: ProjectCategoryVariant;
};

export type ProjectListingStatusVariant =
  | ListRegistrationStatus
  /**
   *? INFO: Only needed for backward compatibility:
   */
  | "All";

export type ProjectListingStatusOption = {
  label: string;
  val: ProjectListingStatusVariant;
};
