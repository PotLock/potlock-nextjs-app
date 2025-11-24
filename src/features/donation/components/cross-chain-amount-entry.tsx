import React, { useEffect, useMemo, useState } from "react";

import { NATIVE_TOKEN_ID } from "@/common/constants";
import { Button } from "@/common/ui/layout/components";

import { getTokenAvatarSrc } from "./cross-chain-token-avatar";
import type { DonationFormAPI } from "../models/schemas";

interface CrossChainAmountEntryProps {
  form: DonationFormAPI;
  campaignId: number;
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
  ) => void;
  onClose: () => void;
  onGoBack: () => void;
}

export const CrossChainAmountEntry: React.FC<CrossChainAmountEntryProps> = ({
  form,
  campaignId,
  selectedBlockchain,
  selectedTokenData,
  onProceed,
  onClose,
  onGoBack,
}) => {
  const formAmount = form.watch("amount");
  const [price, setPrice] = useState(selectedTokenData?.price || 0);
  const [error, setError] = useState<string | null>(null);
  const [decimals, setDecimals] = useState(selectedTokenData?.decimals?.toString() || "");
  const [tokenID, setTokenID] = useState(selectedTokenData?.assetId || "");
  const [amountDeposit, setamountDeposit] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [nearPrice, setNearPrice] = useState(0);

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

  // Calculate protocol fee from NEAR amount (2.5% of NEAR donation)
  const protocolFeeNear = donationAmountInNear * 0.025;
  const networkFeeNear = 0.08;
  const totalFeeNear = protocolFeeNear + networkFeeNear;

  // Convert fees back to selected currency for display
  const protocolFeeSelectedCurrency =
    price > 0 && nearPrice > 0 ? (protocolFeeNear * nearPrice) / price : 0;

  const networkFeeSelectedCurrency =
    price > 0 && nearPrice > 0 ? (networkFeeNear * nearPrice) / price : 0;

  const totalFeeSelectedCurrency = protocolFeeSelectedCurrency + networkFeeSelectedCurrency;

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
          <div className="mb-2 flex justify-between text-sm">
            <span>Protocol Fee (2.5%):</span>
            <div className="text-right">
              <div>
                {protocolFeeSelectedCurrency.toFixed(4)} {selectedTokenData?.symbol || "USDC"}
              </div>
              <div className="text-xs text-gray-500">≈ {protocolFeeNear.toFixed(4)} NEAR</div>
            </div>
          </div>

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
      {isDisabled && (
        <div className="text-sm text-red-500">
          Please enter a valid amount greater than 0.1 NEAR.
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
