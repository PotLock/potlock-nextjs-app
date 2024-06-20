export type DonationContractConfig = {
  /**
   * @type string
   */
  owner: string;
  /**
   * @type integer
   */
  protocol_fee_basis_points: number;
  /**
   * @type integer
   */
  referral_fee_basis_points: number;
  /**
   * @type string
   */
  protocol_fee_recipient_account: string;
};
