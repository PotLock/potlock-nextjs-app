import { DefaultRegistrationStatusEnum } from "./DefaultRegistrationStatusEnum";

export type List = {
  /**
   * @description List ID in DB (does not necessarily correspond to on-chain ID).
   * @type integer
   */
  readonly id: number;
  /**
   * @description List ID in contract
   * @type integer
   */
  on_chain_id: number;
  /**
   * @type string
   */
  readonly owner: string;
  /**
   * @type string
   */
  readonly admins: string;
  /**
   * @description List name.
   * @type string
   */
  name: string;
  /**
   * @description List description.
   * @type string
   */
  description?: string | null;
  /**
   * @description Cover image url.
   * @type string, uri
   */
  cover_image_url?: string | null;
  /**
   * @description Admin only registrations.
   * @type boolean
   */
  admin_only_registrations: boolean;
  /**
   * @description Default registration status.\n\n* `Pending` - Pending\n* `Approved` - Approved\n* `Rejected` - Rejected\n* `Graylisted` - Graylisted\n* `Blacklisted` - Blacklisted
   */
  default_registration_status: DefaultRegistrationStatusEnum;
  /**
   * @description List creation date.
   * @type string, date-time
   */
  created_at: string;
  /**
   * @description List last update date.
   * @type string, date-time
   */
  updated_at: string;
};
