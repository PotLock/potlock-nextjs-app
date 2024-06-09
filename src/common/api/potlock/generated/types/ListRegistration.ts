import { StatusF24Enum } from "./StatusF24Enum";

export type ListRegistration = {
  /**
   * @description Registration id.
   * @type integer
   */
  readonly id: number;
  /**
   * @description Registration status.\n\n* `Pending` - Pending\n* `Approved` - Approved\n* `Rejected` - Rejected\n* `Graylisted` - Graylisted\n* `Blacklisted` - Blacklisted
   */
  status: StatusF24Enum;
  /**
   * @description Registration submission date.
   * @type string, date-time
   */
  submitted_at: string;
  /**
   * @description Registration last update date.
   * @type string, date-time
   */
  updated_at: string;
  /**
   * @description Registrant notes.
   * @type string
   */
  registrant_notes?: string | null;
  /**
   * @description Admin notes.
   * @type string
   */
  admin_notes?: string | null;
  /**
   * @description Transaction hash.
   * @type string
   */
  tx_hash?: string | null;
  /**
   * @description List registered.
   * @type integer
   */
  list: number;
  /**
   * @description Account that registered on the list.
   * @type string
   */
  registrant: string;
  /**
   * @description Account that did the registration.
   * @type string
   */
  registered_by: string;
};
