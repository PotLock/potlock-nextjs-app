export enum RegistrationStatus {
  Approved = "Approved",
  Rejected = "Rejected",
  Pending = "Pending",
  Graylisted = "Graylisted",
  Blacklisted = "Blacklisted",
}

export interface List {
  id: number;
  name: string;
  description: string;
  cover_image_url: null | string;
  owner: string;
  admins: string[];
  created_at: number;
  updated_at: number;
  default_registration_status: RegistrationStatus;
  admin_only_registrations: boolean;
  total_registrations_count: number;
  total_upvotes_count: number;
}

export interface Registration {
  id: string;
  registrant_id: string;
  list_id: number;
  status: RegistrationStatus;
  submitted_ms: number;
  updated_ms: number;
  admin_notes: null | string;
  registrant_notes: null | string;
  registered_by: string;
}

export interface GetListInput {
  list_id: string;
}
