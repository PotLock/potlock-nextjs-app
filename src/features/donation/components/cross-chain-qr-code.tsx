import React, { useEffect, useRef, useState } from "react";

import { QRCodeSVG } from "qrcode.react";

import { Button } from "@/common/ui/layout/components";

interface CrossChainQRCodeProps {
  campaignId: number;
  campaignName: string;
  amount: string;
  blockchain: string;
  decimals: number;
  tokenId: string;
  networkFee: string;
  senderAddress: string;
  tokenImage: string;
  onSentFunds: (
    amount: string,
    depositAddress: string,
    campaignId: number,
    walletBalance: string,
    quoteData?: { minAmountIn?: string; minAmountInFormatted?: string },
  ) => void;
  onClose: () => void;
  onBack: () => void;
}

export const CrossChainQRCode: React.FC<CrossChainQRCodeProps> = ({
  campaignId,
  campaignName,
  amount,
  blockchain,
  decimals,
  tokenId,
  networkFee,
  senderAddress,
  tokenImage,
  onSentFunds,
  onClose,
  onBack,
}) => {
  const [depositAddress, setDepositAddress] = useState<string | null>(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isCopiedAmount, setIsCopiedAmount] = useState(false);

  const [quoteData, setQuoteData] = useState<{
    minAmountIn?: string;
    minAmountInFormatted?: string;
  } | null>(null);

  function convertToUnit(amount: string | number, decimals: number): string {
    if (amount === null || amount === undefined || isNaN(Number(amount))) {
      throw new Error(
        "Invalid amount: must be a valid number or string representation of a number",
      );
    }

    if (!Number.isInteger(decimals) || decimals < 0) {
      throw new Error("Invalid decimals: must be a non-negative integer");
    }

    const amountStr = typeof amount === "number" ? amount.toString() : amount.trim();

    if (parseFloat(amountStr) === 0) {
      return "0";
    }

    const [integerPart, fractionalPart = ""] = amountStr.split(".");
    const paddedFractional = fractionalPart.padEnd(decimals, "0").slice(0, decimals);
    const combined = integerPart + paddedFractional;
    return combined.replace(/^0+/, "") || "0";
  }

  function calculateBasisPoints(feeAmount: number, totalAmount: number): number {
    if (totalAmount === 0) {
      throw new Error("Total amount cannot be zero.");
    }

    const basisPoints = (feeAmount / totalAmount) * 10000;
    return Math.round(basisPoints);
  }

  function formatFromUnit(amount: string, decimals: number): string {
    if (!amount || amount === "0") {
      return "0";
    }

    const amountBigInt = BigInt(amount);
    const divisor = BigInt(10 ** decimals);
    const quotient = amountBigInt / divisor;
    const remainder = amountBigInt % divisor;

    if (remainder === BigInt(0)) {
      return quotient.toString();
    }

    const remainderStr = remainder.toString().padStart(decimals, "0");
    const trimmedRemainder = remainderStr.replace(/0+$/, "");
    return `${quotient}.${trimmedRemainder}`;
  }

  const fetchDepositAddress = async () => {
    try {
      setIsLoadingAddress(true);
      setError(null);

      const [amount_digit] = amount.includes(" ") ? amount.split(" ") : [amount];
      const mainAmount = convertToUnit(amount_digit, decimals);
      const feeAmount = calculateBasisPoints(parseFloat(networkFee), parseFloat(amount_digit));
      const deadline = new Date(Date.now() + 60 * 60 * 1000).toISOString().split(".")[0] + "Z";

      const response = await fetch("https://1click.chaindefuser.com/v0/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dry: false,
          swapType: "FLEX_INPUT",
          slippageTolerance: 100,
          originAsset: tokenId,
          depositType: "ORIGIN_CHAIN",
          destinationAsset: "nep141:wrap.near",
          amount: mainAmount,
          refundTo: senderAddress,
          refundType: "ORIGIN_CHAIN",
          recipient: "potluck_intents.near",
          recipientType: "DESTINATION_CHAIN",
          deadline: deadline,
          referral: "referral",
          quoteWaitingTimeMs: 3000,
          appFees: [
            {
              recipient: "potluck_intents.near",
              fee: feeAmount,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDepositAddress(data?.quote?.depositAddress || null);

      // Store quote data including minAmountIn for FLEX_INPUT swaps
      if (data?.quote) {
        // Format minAmountIn if not provided by API
        // Calculate using the ratio from amountIn/amountInFormatted for accurate formatting
        let minAmountInFormatted = data.quote.minAmountInFormatted;

        if (
          !minAmountInFormatted &&
          data.quote.minAmountIn &&
          data.quote.amountIn &&
          data.quote.amountInFormatted
        ) {
          // Calculate the ratio: amountInFormatted / amountIn
          const ratio = parseFloat(data.quote.amountInFormatted) / parseFloat(data.quote.amountIn);
          // Apply same ratio to minAmountIn
          minAmountInFormatted = (parseFloat(data.quote.minAmountIn) * ratio).toString();
        } else if (!minAmountInFormatted && data.quote.minAmountIn) {
          // Fallback to formatting using decimals prop
          minAmountInFormatted = formatFromUnit(data.quote.minAmountIn, decimals);
        }

        setQuoteData({
          minAmountIn: data.quote.minAmountIn,
          minAmountInFormatted: minAmountInFormatted,
        });
      }
    } catch (error) {
      console.error("Failed to fetch deposit address:", error);
      setError("Failed to generate deposit address. Please try again.");
    } finally {
      setIsLoadingAddress(false);
    }
  };

  useEffect(() => {
    fetchDepositAddress();
  }, []);

  useEffect(() => {
    if (isCopied || isCopiedAmount) {
      const timer = setTimeout(() => {
        setIsCopied(false);
        setIsCopiedAmount(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isCopied, isCopiedAmount]);

  function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function shortenHash(hash: string | null): string {
    if (!hash || typeof hash !== "string") {
      return "Loading...";
    }

    if (hash.length < 15) return hash;
    return `${hash.slice(0, 7)}....${hash.slice(-7)}`;
  }

  const handleCopyAddress = () => {
    if (depositAddress) {
      navigator.clipboard.writeText(depositAddress).then(() => {
        setIsCopied(true);
      });
    }
  };

  const handleCopyAmount = () => {
    // Extract just the numeric value without currency
    const [amountValue] = amount.includes(" ") ? amount.split(" ") : [amount];

    navigator.clipboard.writeText(amountValue).then(() => {
      setIsCopiedAmount(true);
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-4 text-center">
        <h3 className="mb-2 text-lg font-semibold">Scan QR Code to Donate</h3>
        <p className="text-sm text-gray-600">
          {quoteData?.minAmountInFormatted ? (
            <>
              Send <strong>{amount}</strong> excluding fees to the address below
            </>
          ) : (
            <>
              Send <strong>{amount}</strong> to the address below
            </>
          )}
        </p>
      </div>

      {/* QR Code */}
      <div className="relative mb-4 flex justify-center">
        <div
          className={`flex items-center justify-center rounded-lg border border-gray-300 p-6 ${isLoadingAddress ? "opacity-50 blur-sm" : ""}`}
          style={{ width: "227px", height: "226px" }}
        >
          {depositAddress ? (
            <QRCodeSVG
              value={depositAddress}
              size={175}
              level="H"
              {...(tokenImage
                ? {
                    imageSettings: {
                      src: tokenImage,
                      height: 50,
                      width: 50,
                      excavate: true,
                    },
                  }
                : {})}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-400">
              Loading...
            </div>
          )}
        </div>
        {isLoadingAddress && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800"></div>
            <span className="text-sm font-semibold text-gray-700">Generating Address...</span>
          </div>
        )}
      </div>

      {/* Deposit Address */}
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="text-sm font-semibold">
            Deposit Address ({capitalizeFirstLetter(blockchain)})
          </div>
          <div className="overflow-x-auto whitespace-nowrap text-sm text-gray-600">
            {depositAddress}
          </div>
        </div>
        <button
          type="button"
          onClick={handleCopyAddress}
          className="rounded p-2 transition-colors hover:bg-gray-200"
          disabled={!depositAddress}
        >
          {isCopied ? (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="12" cy="12" r="11" strokeWidth="1" fill="none" />
              <path
                d="M9 16.17L5.12 12.29L4 13.41L9 18.5L20 7.5L18.88 6.29L9 16.17Z"
                fill="#292929"
                strokeWidth="1"
              />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                d="M3 14.8269C1.9 14.8269 1 13.9269 1 12.8269V2.8269C1 1.7269 1.9 0.826904 3 0.826904H13C14.1 0.826904 15 1.7269 15 2.8269M9 6.8269H19C20.1046 6.8269 21 7.72233 21 8.8269V18.8269C21 19.9315 20.1046 20.8269 19 20.8269H9C7.89543 20.8269 7 19.9315 7 18.8269V8.8269C7 7.72233 7.89543 6.8269 9 6.8269Z"
                stroke="#292929"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Important Notes */}
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <div className="mb-2 text-sm font-semibold">Heads up!</div>
        <div className="space-y-2 text-sm text-gray-700">
          {quoteData?.minAmountInFormatted ? (
            <>
              <div className="flex items-center gap-1">
                • Recommended amount: <strong>{amount}</strong>
                {isCopiedAmount ? (
                  <svg width="18" height="18" viewBox="0 0 22 22" fill="none" className="inline">
                    <circle cx="12" cy="12" r="11" strokeWidth="1" fill="none" />
                    <path
                      d="M9 16.17L5.12 12.29L4 13.41L9 18.5L20 7.5L18.88 6.29L9 16.17Z"
                      fill="#292929"
                      strokeWidth="1"
                    />
                  </svg>
                ) : (
                  <button
                    type="button"
                    onClick={handleCopyAmount}
                    className="inline-flex items-center rounded p-1 hover:bg-yellow-100"
                  >
                    <svg width="16" height="16" viewBox="0 0 22 22" fill="none">
                      <path
                        d="M3 14.8269C1.9 14.8269 1 13.9269 1 12.8269V2.8269C1 1.7269 1.9 0.826904 3 0.826904H13C14.1 0.826904 15 1.7269 15 2.8269M9 6.8269H19C20.1046 6.8269 21 7.72233 21 8.8269V18.8269C21 19.9315 20.1046 20.8269 19 20.8269H9C7.89543 20.8269 7 19.9315 7 18.8269V8.8269C7 7.72233 7.89543 6.8269 9 6.8269Z"
                        stroke="#292929"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}{" "}
                (minimum: {Number(quoteData.minAmountInFormatted)?.toFixed(4)})
              </div>
              <div>
                • You can send any amount equal to or greater than{" "}
                <strong>{Number(quoteData.minAmountInFormatted)?.toFixed(4)}</strong> (excluding
                network fees that will be deducted from your wallet). Amounts below the minimum will
                be refunded.
              </div>
            </>
          ) : (
            <>
              <div>
                • Sending an incorrect amount (either lower or higher) will cause the transaction to
                fail and be refunded.
              </div>
              <div className="flex items-center gap-1">
                • Send exactly <strong>{amount}</strong>
                {isCopiedAmount ? (
                  <svg width="18" height="18" viewBox="0 0 22 22" fill="none" className="inline">
                    <circle cx="12" cy="12" r="11" strokeWidth="1" fill="none" />
                    <path
                      d="M9 16.17L5.12 12.29L4 13.41L9 18.5L20 7.5L18.88 6.29L9 16.17Z"
                      fill="#292929"
                      strokeWidth="1"
                    />
                  </svg>
                ) : (
                  <button
                    type="button"
                    onClick={handleCopyAmount}
                    className="inline-flex items-center rounded p-1 hover:bg-yellow-100"
                  >
                    <svg width="16" height="16" viewBox="0 0 22 22" fill="none">
                      <path
                        d="M3 14.8269C1.9 14.8269 1 13.9269 1 12.8269V2.8269C1 1.7269 1.9 0.826904 3 0.826904H13C14.1 0.826904 15 1.7269 15 2.8269M9 6.8269H19C20.1046 6.8269 21 7.72233 21 8.8269V18.8269C21 19.9315 20.1046 20.8269 19 20.8269H9C7.89543 20.8269 7 19.9315 7 18.8269V8.8269C7 7.72233 7.89543 6.8269 9 6.8269Z"
                        stroke="#292929"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}{" "}
                with fees excluded.
              </div>
            </>
          )}
          <div>• Only send from a wallet you control.</div>
          <div>• This address is only valid for this specific donation.</div>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="text-sm text-red-500">{error}</div>}

      {/* Action Buttons */}
      <div className="mt-4 flex gap-3">
        <Button
          type="button"
          variant="brand-outline"
          color="black"
          onClick={onBack}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          type="button"
          variant="brand-filled"
          onClick={() => {
            if (depositAddress) {
              onSentFunds(amount, depositAddress, campaignId, "", quoteData || undefined);
            }
          }}
          disabled={!depositAddress || isLoadingAddress}
          className="flex-1"
        >
          I&rsquo;ve sent the funds
        </Button>
      </div>
    </div>
  );
};
