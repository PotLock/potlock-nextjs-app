import { PotApplicationStatusEnum } from "./PotApplicationStatusEnum";

export type PotApplication = {
  /**
   * @description Application id.
   * @type integer
   */
  readonly id: number;
  /**
   * @type string
   */
  readonly pot: string;
  /**
   * @type string
   */
  readonly applicant: string;
  /**
   * @description Application message.
   * @type string
   */
  message?: string | null;
  /**
   * @description Application status.\n\n* `Pending` - Pending\n* `Approved` - Approved\n* `Rejected` - Rejected\n* `InReview` - InReview
   */
  status: PotApplicationStatusEnum;
  /**
   * @description Application submission date.
   * @type string, date-time
   */
  submitted_at: string;
  /**
   * @description Application last update date.
   * @type string, date-time
   */
  updated_at?: string | null;
  /**
   * @description Transaction hash.
   * @type string
   */
  tx_hash?: string | null;
};
