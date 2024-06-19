export type Donation = {
  /**
   * @description Donation id.
   * @type integer
   */
  readonly id: number;
  /**
   * @description Donation id in contract
   * @type integer
   */
  on_chain_id: number;
  /**
   * @description Total amount.
   * @type string
   */
  total_amount: string;
  /**
   * @description Total amount in USD.
   * @type string, decimal
   */
  total_amount_usd?: string | null;
  /**
   * @description Net amount.
   * @type string
   */
  net_amount: string;
  /**
   * @description Net amount in USD.
   * @type string, decimal
   */
  net_amount_usd?: string | null;
  /**
   * @description Matching pool.
   * @type boolean
   */
  matching_pool: boolean;
  /**
   * @description Donation message.
   * @type string
   */
  message?: string | null;
  /**
   * @description Donation date.
   * @type string, date-time
   */
  donated_at: string;
  /**
   * @description Protocol fee.
   * @type string
   */
  protocol_fee: string;
  /**
   * @description Protocol fee in USD.
   * @type string, decimal
   */
  protocol_fee_usd?: string | null;
  /**
   * @description Referrer fee.
   * @type string
   */
  referrer_fee?: string | null;
  /**
   * @description Referrer fee in USD.
   * @type string, decimal
   */
  referrer_fee_usd?: string | null;
  /**
   * @description Chef fee.
   * @type string
   */
  chef_fee?: string | null;
  /**
   * @description Chef fee in USD.
   * @type string, decimal
   */
  chef_fee_usd?: string | null;
  /**
   * @description Transaction hash.
   * @type string
   */
  tx_hash?: string | null;
  /**
   * @description Donor.
   * @type string
   */
  donor: string;
  /**
   * @description Donation FT.
   * @type string
   */
  ft: string;
  /**
   * @description Donation pot.
   * @type string
   */
  pot: string | null;
  /**
   * @description Donation recipient.
   * @type string
   */
  recipient?: string | null;
  /**
   * @description Donation referrer.
   * @type string
   */
  referrer?: string | null;
  /**
   * @description Donation chef.
   * @type string
   */
  chef?: string | null;
};
