import React, { useEffect, useMemo, useState } from "react";

import { indexer } from "@/common/api/indexer";
import type { PotId } from "@/common/api/indexer";
import { NATIVE_TOKEN_ID, NOOP_STRING } from "@/common/constants";
import { campaignsContractHooks } from "@/common/contracts/core/campaigns";
import type { AccountId, CampaignId } from "@/common/types";
import { CheckboxField } from "@/common/ui/form/components";
import { Button, FormControl, FormField, FormItem, FormLabel } from "@/common/ui/layout/components";
import { useWalletUserSession } from "@/common/wallet";
import { AccountProfileLink } from "@/entities/_shared/account";

import { getTokenAvatarSrc } from "./cross-chain-token-avatar";
import { useDonationAllocationBreakdown } from "../hooks/allocation";
import type { DonationFormAPI } from "../models/schemas";

interface CrossChainAmountEntryProps {
  form: DonationFormAPI;
  campaignId?: CampaignId;
  potId?: PotId;
  accountId?: AccountId;
  selectedBlockchain?: string;
  selectedTokenData?: any;
  onProceed: (
    amount: string,
    fee: string,
    chain: string,
    decimals: number,
    tokenId: string,
    senderAddress: string,
    tokenImage: string,
    amountDeposit: string,
    bypassProtocolFee: boolean,
    bypassCreatorFee: boolean,
    bypassReferralFee: boolean,
  ) => void;
  onClose: () => void;
  onGoBack: () => void;
}

export const CrossChainAmountEntry: React.FC<CrossChainAmountEntryProps> = ({
  form,
  campaignId,
  potId,
  accountId,
  selectedBlockchain,
  selectedTokenData,
  onProceed,
  onClose,
  onGoBack,
}) => {
  const walletUser = useWalletUserSession();
  const formAmount = form.watch("amount");

  const [bypassProtocolFee, bypassCuratorFee] = form.watch([
    "bypassProtocolFee",
    "bypassCuratorFee",
  ]);

  const [price, setPrice] = useState(selectedTokenData?.price || 0);
  const [error, setError] = useState<string | null>(null);
  const [decimals, setDecimals] = useState(selectedTokenData?.decimals?.toString() || "");
  const [tokenID, setTokenID] = useState(selectedTokenData?.assetId || "");
  const [amountDeposit, setamountDeposit] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [nearPrice, setNearPrice] = useState(0);

  const isCampaignDonation = campaignId !== undefined;
  const isPotDonation = potId !== undefined;

  const { data: campaign } = campaignsContractHooks.useCampaign({
    enabled: isCampaignDonation,
    campaignId: isCampaignDonation ? campaignId : 0,
  });

  const { data: pot } = indexer.usePot({
    enabled: isPotDonation,
    potId: isPotDonation ? potId : NOOP_STRING,
  });

  const isFeeBypassAllowed = useMemo(
    () => (isCampaignDonation ? (campaign?.allow_fee_avoidance ?? false) : true),
    [campaign?.allow_fee_avoidance, isCampaignDonation],
  );

  // Initialize sender address based on blockchain
  useEffect(() => {
    if (selectedBlockchain && selectedTokenData) {
      const blockchainAddresses: Record<string, string> = {
        btc: "bc1q0fnht2ngtaeexp3gypd55k5ejfwxtgxmdmx0gh",
        zec: "t1bQtaCMoFhf1654BEZqNXTnwuFGSvQADFH",
        ton: "UQCl-Z6_RKnINhWTZIIzysIGjyZTcJsRscdaKP-Oof-PfOne",
        doge: "DHpEpCboQcnxNWpVknvc9dpx3Q1TeHmUH",
        sol: "BK3HqkkH9T8QSsiXDvWSdfYEojviAHrhqeCXP1zvADbU",
        near: "potlock.near",
        xrp: "rsGvT1oyqRx5Ls6qmq6Q3Tuh8GCFLZVPxM",
        sui: "0x27e5a115617a8c2c4dfb5da3f3a88d70cfae7bf59cfc739a60792db15e31656c",
      };

      const EVM_ADDRESS = "0x88B93d4D440155448fbB3Cf260208b75FC0117C0";

      const evmChains = [
        "evm",
        "eth",
        "arb",
        "arbitrum",
        "gnosis",
        "base",
        "bera",
        "pol",
        "tron",
        "avax",
        "op",
        "monad",
        "starknet",
      ];

      const normalized = selectedBlockchain.toLowerCase();

      if (evmChains.includes(normalized)) {
        setSenderAddress(EVM_ADDRESS);
      } else {
        const address = blockchainAddresses[normalized];

        if (address) {
          setSenderAddress(address);
        }
      }

      setPrice(selectedTokenData.price || 0);
      setDecimals(selectedTokenData.decimals?.toString() || "");
      setTokenID(selectedTokenData.assetId || "");
    }
  }, [selectedBlockchain, selectedTokenData]);

  // Fetch NEAR price for fee calculations
  useEffect(() => {
    const fetchNearPrice = async () => {
      try {
        const res = await fetch("https://1click.chaindefuser.com/v0/tokens", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const data = await res.json();

          const nearToken = data.find(
            (token: any) => token.symbol === "wNEAR" || token.assetId === "nep141:wrap.near",
          );

          if (nearToken) {
            setNearPrice(nearToken.price || 0);
          }
        }
      } catch (error) {
        console.error("Failed to fetch NEAR price:", error);
      }
    };

    fetchNearPrice();
  }, []);

  const donationAmount = parseFloat(formAmount?.toString() || "0") || 0;

  // Convert donation amount from selected currency to NEAR
  const donationAmountInNear =
    price > 0 && nearPrice > 0 ? (donationAmount * price) / nearPrice : 0;

  const [bypassReferralFee] = form.watch(["bypassReferralFee"]);

  // Calculate fee breakdown using the same hook as regular donations
  const allocationBreakdown = useDonationAllocationBreakdown({
    campaign,
    potCache: pot,
    referrerAccountId: walletUser.referrerAccountId,
    bypassProtocolFee,
    bypassReferralFee,
    bypassCuratorFee,
    totalAmountFloat: donationAmountInNear,
  });

  // Calculate fees using allocation breakdown (respects bypass flags)
  const { protocolFee, referralFee, curatorFee } = allocationBreakdown;
  const protocolFeeNear = protocolFee.amount;
  const referralFeeNear = referralFee.amount;
  const curatorFeeNear = curatorFee.amount;
  const networkFeeNear = 0.08;
  const totalFeeNear = protocolFeeNear + referralFeeNear + curatorFeeNear + networkFeeNear;

  // Convert fees back to selected currency for display
  const protocolFeeSelectedCurrency =
    price > 0 && nearPrice > 0 ? (protocolFeeNear * nearPrice) / price : 0;

  const referralFeeSelectedCurrency =
    price > 0 && nearPrice > 0 ? (referralFeeNear * nearPrice) / price : 0;

  const curatorFeeSelectedCurrency =
    price > 0 && nearPrice > 0 ? (curatorFeeNear * nearPrice) / price : 0;

  const networkFeeSelectedCurrency =
    price > 0 && nearPrice > 0 ? (networkFeeNear * nearPrice) / price : 0;

  const totalFeeSelectedCurrency =
    protocolFeeSelectedCurrency +
    referralFeeSelectedCurrency +
    curatorFeeSelectedCurrency +
    networkFeeSelectedCurrency;

  // Calculate total donation amount in NEAR (donation + fees)
  const totalDonationInNear = donationAmountInNear + totalFeeNear;

  const currencyFormatter = useMemo(
    () => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
    [],
  );

  const validateForm = () => {
    if (
      !formAmount ||
      isNaN(parseFloat(formAmount.toString())) ||
      parseFloat(formAmount.toString()) <= 0
    ) {
      setError("Please enter a valid amount greater than 0.");
      return false;
    }

    if (!senderAddress || senderAddress.trim() === "") {
      setError("Please provide a valid sender wallet address.");
      return false;
    }

    setError(null);
    return true;
  };

  const handleProceed = () => {
    if (validateForm()) {
      const tokenImage = getTokenAvatarSrc(selectedBlockchain, selectedTokenData?.symbol);

      onProceed(
        `${(donationAmount + totalFeeSelectedCurrency).toFixed(4)} ${selectedTokenData?.symbol || "USDC"}`,
        networkFeeSelectedCurrency.toFixed(4),
        selectedBlockchain || "",
        parseInt(decimals) || 0,
        tokenID,
        senderAddress,
        tokenImage,
        amountDeposit,
        bypassProtocolFee,
        bypassCuratorFee,
        bypassReferralFee,
      );
    }
  };

  const isDisabled = useMemo(() => {
    return (
      senderAddress.trim() === "" ||
      !formAmount ||
      (price > 0 && nearPrice > 0 && (parseFloat(formAmount.toString()) * price) / nearPrice < 0.1)
    );
  }, [senderAddress, formAmount, price, nearPrice]);

  function capitalizeAll(str: string): string {
    if (!str) return "";

    if (str.toUpperCase() === "GNOSIS") {
      return "GNO";
    } else {
      return str.toUpperCase();
    }
  }

  // Update amountDeposit when formAmount or price changes
  useEffect(() => {
    if (formAmount && price > 0) {
      setamountDeposit(currencyFormatter.format(parseFloat(formAmount.toString() || "0") * price));
    } else {
      setamountDeposit("");
    }
  }, [formAmount, price, currencyFormatter]);

  return (
    <div className="flex flex-col gap-4">
      {/* Fee Breakdown */}
      {formAmount && parseFloat(formAmount.toString()) > 0 && price > 0 && nearPrice > 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="mb-3 text-base font-semibold">Fee Breakdown</h3>

          {/* Donation Amount */}
          <div className="mb-3 flex justify-between text-sm">
            <span>Donation Amount:</span>
            <div className="text-right">
              <div>
                {donationAmount.toFixed(4)} {selectedTokenData?.symbol || "USDC"}
              </div>
              <div className="text-xs text-gray-500">≈ {donationAmountInNear.toFixed(4)} NEAR</div>
            </div>
          </div>

          {/* Protocol Fee */}
          {protocolFee.percentage > 0 && (
            <div className="mb-2 flex justify-between text-sm">
              <span>
                Protocol Fee ({protocolFee.percentage}%)
                {bypassProtocolFee && <span className="ml-1 text-gray-500">(Bypassed)</span>}
              </span>
              <div className="text-right">
                <div>
                  {bypassProtocolFee ? "0.0000" : protocolFeeSelectedCurrency.toFixed(4)}{" "}
                  {selectedTokenData?.symbol || "USDC"}
                </div>
                <div className="text-xs text-gray-500">
                  ≈ {bypassProtocolFee ? "0.0000" : protocolFeeNear.toFixed(4)} NEAR
                </div>
              </div>
            </div>
          )}

          {/* Referral Fee */}
          {referralFee.percentage > 0 && (
            <div className="mb-2 flex justify-between text-sm">
              <span>
                Referral Fee ({referralFee.percentage}%)
                {bypassReferralFee && <span className="ml-1 text-gray-500">(Bypassed)</span>}
              </span>
              <div className="text-right">
                <div>
                  {bypassReferralFee ? "0.0000" : referralFeeSelectedCurrency.toFixed(4)}{" "}
                  {selectedTokenData?.symbol || "USDC"}
                </div>
                <div className="text-xs text-gray-500">
                  ≈ {bypassReferralFee ? "0.0000" : referralFeeNear.toFixed(4)} NEAR
                </div>
              </div>
            </div>
          )}

          {/* Creator/Chef Fee (for campaigns and pots) */}
          {curatorFee.percentage > 0 && (isCampaignDonation || isPotDonation) && (
            <div className="mb-2 flex justify-between text-sm">
              <span>
                {allocationBreakdown.curatorTitle} Fee ({curatorFee.percentage}%)
                {bypassCuratorFee && <span className="ml-1 text-gray-500">(Bypassed)</span>}
              </span>
              <div className="text-right">
                <div>
                  {bypassCuratorFee ? "0.0000" : curatorFeeSelectedCurrency.toFixed(4)}{" "}
                  {selectedTokenData?.symbol || "USDC"}
                </div>
                <div className="text-xs text-gray-500">
                  ≈ {bypassCuratorFee ? "0.0000" : curatorFeeNear.toFixed(4)} NEAR
                </div>
              </div>
            </div>
          )}

          {/* Network Fee */}
          <div className="mb-2 flex justify-between text-sm">
            <span>Network Fee:</span>
            <div className="text-right">
              <div>
                {networkFeeSelectedCurrency.toFixed(4)} {selectedTokenData?.symbol || "USDC"}
              </div>
              <div className="text-xs text-gray-500">≈ {networkFeeNear.toFixed(4)} NEAR</div>
            </div>
          </div>

          {/* Total */}
          <div className="mt-3 flex justify-between border-t pt-3 text-base font-semibold">
            <span>Total (incl. fees):</span>
            <div className="text-right">
              <div>
                {(donationAmount + totalFeeSelectedCurrency).toFixed(4)}{" "}
                {selectedTokenData?.symbol || "USDC"}
              </div>
              <div className="text-xs font-normal text-gray-500">
                ≈ {totalDonationInNear.toFixed(4)} NEAR
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fee Bypass Options */}
      {formAmount && parseFloat(formAmount.toString()) > 0 && price > 0 && nearPrice > 0 && (
        <div className="flex flex-col gap-2">
          {isFeeBypassAllowed && protocolFee.percentage > 0 && (
            <FormField
              control={form.control}
              name="bypassProtocolFee"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <CheckboxField
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      label={
                        <>
                          <span className="prose">
                            {`Remove ${protocolFee.percentage}% Protocol Fee`}
                          </span>
                          {protocolFee.recipientAccountId && (
                            <AccountProfileLink accountId={protocolFee.recipientAccountId} />
                          )}
                        </>
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          {referralFee.percentage > 0 && (
            <FormField
              control={form.control}
              name="bypassReferralFee"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <CheckboxField
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      label={
                        <>
                          <span className="prose">
                            {`Remove ${referralFee.percentage}% Referrer Fee`}
                          </span>
                          {referralFee.recipientAccountId && (
                            <AccountProfileLink accountId={referralFee.recipientAccountId} />
                          )}
                        </>
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          {isFeeBypassAllowed && isCampaignDonation && curatorFee.percentage > 0 && (
            <FormField
              control={form.control}
              name="bypassCuratorFee"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <CheckboxField
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      label={
                        <>
                          <span>{`Remove ${curatorFee.percentage}% ${allocationBreakdown.curatorTitle} Fee`}</span>
                          {curatorFee.recipientAccountId && (
                            <AccountProfileLink accountId={curatorFee.recipientAccountId} />
                          )}
                        </>
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
        </div>
      )}

      {/* Error Message */}
      {error && <div className="text-sm text-red-500">{error}</div>}

      {/* Important Note */}
      <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
        <div className="flex items-start gap-2">
          <span className="text-orange-600">ℹ️</span>
          <div>
            <div className="mb-1 text-sm font-semibold">
              Important Note About Cross-Chain Refunds
            </div>
            <div className="text-sm text-gray-700">
              You are donating with{" "}
              <strong>{selectedBlockchain ? capitalizeAll(selectedBlockchain) : "Solana"}</strong>{" "}
              assets. If this campaign doesn&rsquo;t reach its minimum funding goal, your donation
              will be redirected to <strong>Potlock Food Bank wallets</strong> (auto distribution
              wallet) to support other campaigns as we can&rsquo;t support refunds with intents.
            </div>
          </div>
        </div>
      </div>
      {isDisabled && price > 0 && nearPrice > 0 && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <span>
            Please enter a valid amount in {selectedTokenData?.symbol || "USDC"} greater than an
            equivalent of 0.1 NEAR
            {" "}(min: {((0.1 * nearPrice) / price).toFixed(4)} {selectedTokenData?.symbol || "USDC"}).
          </span>
          <button
            type="button"
            title="Set to minimum amount"
            className="inline-flex shrink-0 items-center justify-center rounded-md border border-red-300 bg-red-50 px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 hover:text-red-700"
            onClick={() => {
              const minAmount = ((0.1 * nearPrice) / price) * 1.01; // add 1% buffer to safely clear the threshold
              form.setValue("amount", parseFloat(minAmount.toFixed(4)));
            }}
          >
            ✏️ Update
          </button>
        </div>
      )}
      {/* Action Button */}
      <div className="mt-4 flex gap-3">
        <Button
          type="button"
          variant="brand-outline"
          color="black"
          onClick={onGoBack}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          type="button"
          variant="brand-filled"
          onClick={handleProceed}
          disabled={isDisabled}
          className="flex-1"
        >
          Confirm donation
        </Button>
      </div>
    </div>
  );
};
