export interface Pot {
  id: string;
  deployed_by: string;
  deployed_at_ms: number;
}

export interface Config {
  owner: string;
  admins: string[];
  protocol_fee_basis_points: number;
  protocol_fee_recipient_account: string;
  whitelisted_deployers: string[];
  require_whitelist: boolean;
}

export interface ProtcolConfig {
  basis_points: number;
  account_id: string;
}
