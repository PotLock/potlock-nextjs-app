import { INDEXER_API_ENDPOINT_URL } from "@/common/_config";

// Campaigns only exist on dev backend, everything else is on prod
const SYNC_API_BASE_URL = INDEXER_API_ENDPOINT_URL;

const CAMPAIGNS_SYNC_API_BASE_URL =
  process.env.NEXT_PUBLIC_ENV === "test" ? INDEXER_API_ENDPOINT_URL : "https://dev.potlock.io";

export const syncApi = {
  /**
   * Sync a campaign after creation or update
   * @param campaignId - The on-chain campaign ID
   */
  async campaign(campaignId: number | string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(
        `${CAMPAIGNS_SYNC_API_BASE_URL}/api/v1/campaigns/${campaignId}/sync`,
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.warn("Failed to sync campaign:", error);
        return { success: false, message: error?.error || "Sync failed" };
      }

      const result = await response.json();
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
        `${CAMPAIGNS_SYNC_API_BASE_URL}/api/v1/campaigns/${campaignId}/donations/sync`,
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

  /**
   * Sync a campaign deletion after the owner deletes it on-chain
   * @param campaignId - The on-chain campaign ID
   * @param txHash - Transaction hash from the delete transaction
   * @param senderId - Account ID of the campaign owner who deleted it
   */
  async campaignDelete(
    campaignId: number | string,
    txHash: string,
    senderId: string,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(
        `${CAMPAIGNS_SYNC_API_BASE_URL}/api/v1/campaigns/${campaignId}/delete/sync`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tx_hash: txHash, sender_id: senderId }),
        },
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.warn("Failed to sync campaign deletion:", error);
        return { success: false, message: error?.error || "Sync failed" };
      }

      const result = await response.json();
      return { success: true, message: result.message };
    } catch (error) {
      console.warn("Failed to sync campaign deletion:", error);
      return { success: false, message: String(error) };
    }
  },

  /**
   * Sync campaign donation refunds after process_refunds_batch is executed
   * @param campaignId - The on-chain campaign ID
   * @param txHash - Transaction hash from the refund transaction
   * @param senderId - Account ID of the sender who triggered refunds
   */
  async campaignRefund(
    campaignId: number | string,
    txHash: string,
    senderId: string,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(
        `${CAMPAIGNS_SYNC_API_BASE_URL}/api/v1/campaigns/${campaignId}/refunds/sync`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tx_hash: txHash, sender_id: senderId }),
        },
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.warn("Failed to sync campaign refunds:", error);
        return { success: false, message: error?.error || "Sync failed" };
      }

      const result = await response.json();
      return { success: true, message: result.message };
    } catch (error) {
      console.warn("Failed to sync campaign refunds:", error);
      return { success: false, message: String(error) };
    }
  },

  /**
   * Sync campaign donation unescrow after process_escrowed_donations_batch is executed
   * @param campaignId - The on-chain campaign ID
   * @param txHash - Transaction hash from the unescrow transaction
   * @param senderId - Account ID of the sender who triggered unescrow
   */
  async campaignUnescrow(
    campaignId: number | string,
    txHash: string,
    senderId: string,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(
        `${CAMPAIGNS_SYNC_API_BASE_URL}/api/v1/campaigns/${campaignId}/unescrow/sync`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tx_hash: txHash, sender_id: senderId }),
        },
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.warn("Failed to sync campaign unescrow:", error);
        return { success: false, message: error?.error || "Sync failed" };
      }

      const result = await response.json();
      return { success: true, message: result.message };
    } catch (error) {
      console.warn("Failed to sync campaign unescrow:", error);
      return { success: false, message: String(error) };
    }
  },

  /**
   * Sync an account profile and recalculate donation stats
   * @param accountId - The NEAR account ID
   */
  async account(accountId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${SYNC_API_BASE_URL}/api/v1/accounts/${accountId}/sync`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.warn("Failed to sync account:", error);
        return { success: false, message: error?.error || "Sync failed" };
      }

      const result = await response.json();
      return { success: true, message: result.message };
    } catch (error) {
      console.warn("Failed to sync account:", error);
      return { success: false, message: String(error) };
    }
  },

  /**
   * Sync a list after creation or update
   * @param listId - The on-chain list ID
   */
  async list(listId: number | string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${SYNC_API_BASE_URL}/api/v1/lists/${listId}/sync`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.warn("Failed to sync list:", error);
        return { success: false, message: error?.error || "Sync failed" };
      }

      const result = await response.json();
      return { success: true, message: result.message };
    } catch (error) {
      console.warn("Failed to sync list:", error);
      return { success: false, message: String(error) };
    }
  },

  /**
   * Sync all registrations for a list
   * @param listId - The on-chain list ID
   */
  async listRegistrations(
    listId: number | string,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(
        `${SYNC_API_BASE_URL}/api/v1/lists/${listId}/registrations/sync`,
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.warn("Failed to sync list registrations:", error);
        return { success: false, message: error?.error || "Sync failed" };
      }

      const result = await response.json();
      return { success: true, message: result.message };
    } catch (error) {
      console.warn("Failed to sync list registrations:", error);
      return { success: false, message: String(error) };
    }
  },

  /**
   * Sync a single registration for a list
   * @param listId - The on-chain list ID
   * @param registrantId - The registrant account ID
   */
  async listRegistration(
    listId: number | string,
    registrantId: string,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(
        `${SYNC_API_BASE_URL}/api/v1/lists/${listId}/registrations/${registrantId}/sync`,
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.warn("Failed to sync list registration:", error);
        return { success: false, message: error?.error || "Sync failed" };
      }

      const result = await response.json();
      return { success: true, message: result.message };
    } catch (error) {
      console.warn("Failed to sync list registration:", error);
      return { success: false, message: String(error) };
    }
  },

  /**
   * Sync a direct donation after it's made
   * @param txHash - Transaction hash from the donation
   * @param senderId - Account ID of the donor
   */
  async directDonation(
    txHash: string,
    senderId: string,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${SYNC_API_BASE_URL}/api/v1/donations/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tx_hash: txHash, sender_id: senderId }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.warn("Failed to sync direct donation:", error);
        return { success: false, message: error?.error || "Sync failed" };
      }

      const result = await response.json();
      return { success: true, message: result.message };
    } catch (error) {
      console.warn("Failed to sync direct donation:", error);
      return { success: false, message: String(error) };
    }
  },

  /**
   * Sync a pot config after deployment or update
   * @param potId - The pot account ID (e.g. "mypot.v1.potfactory.potlock.near")
   */
  async pot(potId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${SYNC_API_BASE_URL}/api/v1/pots/${potId}/sync`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.warn("Failed to sync pot:", error);
        return { success: false, message: error?.error || "Sync failed" };
      }

      const result = await response.json();
      return { success: true, message: result.message };
    } catch (error) {
      console.warn("Failed to sync pot:", error);
      return { success: false, message: String(error) };
    }
  },

  /**
   * Sync all donations for a pot
   * @param potId - The pot account ID
   */
  async potDonations(potId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${SYNC_API_BASE_URL}/api/v1/pots/${potId}/donations/sync`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.warn("Failed to sync pot donations:", error);
        return { success: false, message: error?.error || "Sync failed" };
      }

      const result = await response.json();
      return { success: true, message: result.message };
    } catch (error) {
      console.warn("Failed to sync pot donations:", error);
      return { success: false, message: String(error) };
    }
  },

  /**
   * Sync all applications for a pot
   * @param potId - The pot account ID
   */
  async potApplications(potId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${SYNC_API_BASE_URL}/api/v1/pots/${potId}/applications/sync`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.warn("Failed to sync pot applications:", error);
        return { success: false, message: error?.error || "Sync failed" };
      }

      const result = await response.json();
      return { success: true, message: result.message };
    } catch (error) {
      console.warn("Failed to sync pot applications:", error);
      return { success: false, message: String(error) };
    }
  },

  /**
   * Sync all payouts for a pot
   * @param potId - The pot account ID
   */
  async potPayouts(potId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${SYNC_API_BASE_URL}/api/v1/pots/${potId}/payouts/sync`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.warn("Failed to sync pot payouts:", error);
        return { success: false, message: error?.error || "Sync failed" };
      }

      const result = await response.json();
      return { success: true, message: result.message };
    } catch (error) {
      console.warn("Failed to sync pot payouts:", error);
      return { success: false, message: String(error) };
    }
  },

  /**
   * Sync payout challenges for a pot
   * @param potId - The pot account ID
   */
  async potChallenges(potId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${SYNC_API_BASE_URL}/api/v1/pots/${potId}/challenges/sync`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.warn("Failed to sync pot challenges:", error);
        return { success: false, message: error?.error || "Sync failed" };
      }

      const result = await response.json();
      return { success: true, message: result.message };
    } catch (error) {
      console.warn("Failed to sync pot challenges:", error);
      return { success: false, message: String(error) };
    }
  },
};
