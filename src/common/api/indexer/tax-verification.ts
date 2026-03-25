import { INDEXER_API_ENDPOINT_URL } from "@/common/_config";

const BASE_URL = INDEXER_API_ENDPOINT_URL;

export interface OrgVerificationInput {
  account_id: string;
  ein: string;
}

export interface OrgVerification {
  id: number;
  account: { id: string };
  ein: string;
  legal_name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  subsection_code: number | null;
  ntee_code: string | null;
  ruling_date: string | null;
  status: "Pending" | "Approved" | "Rejected";
  rejection_reason: string | null;
  submitted_at: string;
  updated_at: string;
}

export const taxVerificationApi = {
  async submitOrgVerification(
    data: OrgVerificationInput,
  ): Promise<{ success: boolean; data?: OrgVerification; message?: string }> {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/tax-verification/org-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        return { success: false, message: error?.error || "Verification failed" };
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.warn("Failed to submit org verification:", error);
      return { success: false, message: String(error) };
    }
  },

  async getOrgVerification(
    accountId: string,
  ): Promise<{ success: boolean; data?: OrgVerification; message?: string }> {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/tax-verification/org-verification/${accountId}`,
      );

      if (response.status === 404) {
        return { success: true, data: undefined };
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        return { success: false, message: error?.error || "Fetch failed" };
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.warn("Failed to fetch org verification:", error);
      return { success: false, message: String(error) };
    }
  },
};
