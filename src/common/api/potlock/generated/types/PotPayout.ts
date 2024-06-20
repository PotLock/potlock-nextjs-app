export type PotPayout = {
  /**
   * @description Payout id.
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
  readonly recipient: string;
  /**
   * @description Payout amount.
   * @type string
   */
  amount: string;
  /**
   * @description Payout amount in USD.
   * @type string, decimal
   */
  amount_paid_usd?: string | null;
  /**
   * @type string
   */
  readonly token: string;
  /**
   * @description Payout date.
   * @type string, date-time
   */
  paid_at: string;
  /**
   * @description Transaction hash.
   * @type string
   */
  tx_hash?: string | null;
};
