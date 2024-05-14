export enum ProviderStatus {
  Pending = "Pending",
  Active = "Active",
  Deactivated = "Deactivated",
}

export interface Provider {
  // NB: contract address/ID and method name are contained in the Provider's ID (see `ProviderId`) so do not need to be stored here
  /// Name of the provider, e.g. "I Am Human"
  name: string;
  /// Description of the provider
  description?: string;
  /// Status of the provider
  status: ProviderStatus;
  /// Admin notes, e.g. reason for flagging or marking inactive
  admin_notes?: string;
  /// Default weight for this provider, e.g. 100
  default_weight: number;
  /// Custom gas amount required
  gas?: number;
  /// Optional tags
  tags?: string[];
  /// Optional icon URL
  icon_url?: string;
  /// Optional external URL
  external_url?: string;
  /// User who submitted this provider
  submitted_by?: string;
  /// Timestamp of when this provider was submitted
  submitted_at_ms?: number;
  /// Total number of times this provider has been used successfully
  stamp_count: number;
}

export interface ProviderExternal {
  // Provider ID
  provider_id: string;
  // Contract ID of the external contract that is the source of this provider
  contract_id: string;
  // Method name of the external contract that is the source of this provider
  method_name: string;
  /// Account ID arg name
  account_id_arg_name: string;
  // Name of the provider, e.g. "I Am Human"
  name: string;
  // Description of the provider
  description?: string;
  /// Status of the provider
  status: ProviderStatus;
  // Admin notes, e.g. reason for flagging or marking inactive
  admin_notes?: string;
  // Default weight for this provider, e.g. 100
  default_weight: number;
  // Custom gas amount required
  gas?: number;
  // Optional tags
  tags?: string[];
  // Optional icon URL
  icon_url?: string;
  // Optional external URL
  external_url?: string;
  // User who submitted this provider
  submitted_by: string;
  // Timestamp of when this provider was submitted
  submitted_at_ms: number;
  // Total number of times this provider has been used successfully
  stamp_count: number;
}

export type ProviderExternalWithIsHuman = ProviderExternal & {
  is_user_a_human: boolean;
};

export interface RegisterProviderInput {
  contract_id: string;
  method_name: string;
  account_id_arg_name?: string;
  name: string;
  description?: string;
  gas?: number;
  tags?: string[];
  icon_url?: string;
  external_url?: string;
}

export interface UpdateProviderInput {
  provider_id: string;
  name?: string;
  description?: string;
  gas?: number;
  tags?: string[];
  icon_url?: string;
  external_url?: string;
  default_weight?: number; // owner/admin-only
  status?: ProviderStatus; // owner/admin-only
  admin_notes?: string; // owner/admin-only
}
export interface ActivateProviderInput {
  provider_id: string;
  default_weight: number;
}

export interface DeactivateProviderInput {
  provider_id: string;
}

export type FlagProviderInput = DeactivateProviderInput;
export type UnflagProviderInput = DeactivateProviderInput;
