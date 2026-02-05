import { INDEXER_API_ENDPOINT_URL } from "@/common/_config";

export const syncApi = {
  /**
   * Sync a campaign after creation or update
   * @param campaignId - The on-chain campaign ID
   */
  async campaign(campaignId: number | string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(
        `${INDEXER_API_ENDPOINT_URL}/api/v1/campaigns/${campaignId}/sync`,
        { method: "POST" },
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.warn("Failed to sync campaign:", error);
        return { success: false, message: error?.error || "Sync failed" };
      }

      const result = await response.json();
      console.log("Campaign synced:", result);
      return { success: true, message: result.message };
    } catch (error) {
      console.warn("Failed to sync campaign:", error);
      return { success: false, message: String(error) };
    }
  },

  /**
   * Sync a campaign donation after a donation is made
   * @param campaignId - The on-chain campaign ID
   * @param txHash - Transaction hash from the donation
   * @param senderId - Account ID of the donor
   */
  async campaignDonation(
    campaignId: number | string,
    txHash: string,
    senderId: string,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(
        `${INDEXER_API_ENDPOINT_URL}/api/v1/campaigns/${campaignId}/donations/sync`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tx_hash: txHash, sender_id: senderId }),
        },
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.warn("Failed to sync campaign donation:", error);
        return { success: false, message: error?.error || "Sync failed" };
      }

      const result = await response.json();
      return { success: true, message: result.message };
    } catch (error) {
      console.warn("Failed to sync campaign donation:", error);
      return { success: false, message: String(error) };
    }
  },
};
