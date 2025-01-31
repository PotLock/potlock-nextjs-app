import { ListRegistrationStatus } from "@/common/api/indexer";

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
