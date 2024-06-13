export type Pot = {
  /**
   * @description Pot account ID.
   * @type string
   */
  id: string;
  /**
   * @description Pot factory.
   * @type string
   */
  pot_factory: string;
  /**
   * @description Pot deployer.
   * @type string
   */
  deployer: string;
  /**
   * @description Pot deployment date.
   * @type string, date-time
   */
  deployed_at: string;
  source_metadata: any;
  /**
   * @description Pot owner.
   * @type string
   */
  owner: string;
  /**
   * @description Pot admins.
   * @type array
   */
  admins: string[];
  /**
   * @description Pot chef.
   * @type string
   */
  chef?: string | null;
  /**
   * @description Pot name.
   * @type string
   */
  name: string;
  /**
   * @description Pot description.
   * @type string
   */
  description: string;
  /**
   * @description Max approved applicants.
   * @type integer
   */
  max_approved_applicants: number;
  /**
   * @description Base currency.
   * @type string
   */
  base_currency?: string | null;
  /**
   * @description Pot application start date.
   * @type string, date-time
   */
  application_start: string;
  /**
   * @description Pot application end date.
   * @type string, date-time
   */
  application_end: string;
  /**
   * @description Pot matching round start date.
   * @type string, date-time
   */
  matching_round_start: string;
  /**
   * @description Pot matching round end date.
   * @type string, date-time
   */
  matching_round_end: string;
  /**
   * @description Registry provider.
   * @type string
   */
  registry_provider?: string | null;
  /**
   * @description Min matching pool donation amount.
   * @type string
   */
  min_matching_pool_donation_amount: string;
  /**
   * @description Sybil wrapper provider.
   * @type string
   */
  sybil_wrapper_provider?: string | null;
  /**
   * @description Custom sybil checks.
   * @type string
   */
  custom_sybil_checks?: string | null;
  /**
   * @description Custom min threshold score.
   * @type integer
   */
  custom_min_threshold_score?: number | null;
  /**
   * @description Referral fee matching pool basis points.
   * @type integer
   */
  referral_fee_matching_pool_basis_points: number;
  /**
   * @description Referral fee public round basis points.
   * @type integer
   */
  referral_fee_public_round_basis_points: number;
  /**
   * @description Chef fee basis points.
   * @type integer
   */
  chef_fee_basis_points: number;
  /**
   * @description Total matching pool.
   * @type string
   */
  total_matching_pool: string;
  /**
   * @type string, decimal
   */
  total_matching_pool_usd: string;
  /**
   * @description Matching pool balance.
   * @type string
   */
  matching_pool_balance: string;
  /**
   * @description Matching pool donations count.
   * @type integer
   */
  matching_pool_donations_count: number;
  /**
   * @description Total public donations.
   * @type string
   */
  total_public_donations: string;
  /**
   * @type string, decimal
   */
  total_public_donations_usd: string;
  /**
   * @description Public donations count.
   * @type integer
   */
  public_donations_count: number;
  /**
   * @description Pot cooldown end date.
   * @type string, date-time
   */
  cooldown_end?: string | null;
  /**
   * @description Pot cooldown period in ms.
   * @type integer
   */
  cooldown_period_ms?: number | null;
  /**
   * @description All paid out.
   * @type boolean
   */
  all_paid_out: boolean;
  /**
   * @description Protocol config provider.
   * @type string
   */
  protocol_config_provider?: string | null;
};
