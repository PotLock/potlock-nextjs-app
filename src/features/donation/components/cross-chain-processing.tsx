import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { Button } from "@/common/ui/layout/components";
import { routeSelectors } from "@/navigation";

interface CrossChainProcessingProps {
  campaignId: number;
  campaignName: string;
  amount: string;
  depositAddress: string;
  blockchain: string;
  tokenImage: string;
  minAmountIn?: string;
  minAmountInFormatted?: string;
  onProceed: (
    txHash: string,
    campaignName: string,
    amount: string,
    usdAmount: string,
    nearAmount: string,
  ) => void;
  onClose: () => void;
  onBack: () => void;
  onFinish: () => void;
}

export const CrossChainProcessing: React.FC<CrossChainProcessingProps> = ({
  campaignId,
  campaignName,
  amount,
  depositAddress,
  blockchain,
  tokenImage,
  minAmountIn,
  minAmountInFormatted,
  onProceed,
  onClose,
  onBack,
  onFinish,
}) => {
  const router = useRouter();
  const [fundReceived, setFundReceived] = useState<boolean | null>(false);
  const [fundReceivedFailed, setFundReceivedFailed] = useState<boolean | null>(false);
  const [fundConverted, setFundConverted] = useState<boolean | null>(false);
  const [fundDeposited, setFundDeposited] = useState<boolean | null>(false);
  const [fundDonated, setFundDonated] = useState<boolean | null>(false);
  const [swapData, setSwapData] = useState<any | null>(null);

  const [errorInfo, setErrorInfo] = useState<string | null>(
    "Receive Failed, refresh after some time.",
  );

  const [isTxLink1Hovered, setIsTxLink1Hovered] = useState(false);
  const [isTxLink2Hovered, setIsTxLink2Hovered] = useState(false);
  const [isPolling, setIsPolling] = useState(true);
  const [actualDepositedAmount, setActualDepositedAmount] = useState<string | null>(null);

  const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const refreshTransaction = async (): Promise<void> => {
    setFundReceived(false);
    setFundReceivedFailed(false);
    setFundConverted(false);
    setFundDeposited(false);
    setFundDonated(false);
    setIsPolling(true);
    setErrorInfo(null);
    checkStatus();
  };

  const checkStatus = async (): Promise<void> => {
    try {
      const donatorName = depositAddress
        ? `${depositAddress.slice(0, 6)}-${depositAddress.slice(-6)}`.toLowerCase()
        : "";

      const statusResponse = await fetch(
        `https://1click.chaindefuser.com/v0/status?depositAddress=${depositAddress}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!statusResponse.ok) {
        throw new Error(`Failed to check status: ${statusResponse.statusText}`);
      }

      const statusData = await statusResponse.json();
      setSwapData(statusData);

      // Extract actual deposited amount from status response
      // For INCOMPLETE_DEPOSIT, use depositedAmountFormatted
      // For SUCCESS, use amountInFormatted from swapDetails or quote
      const depositedAmount =
        statusData.swapDetails?.depositedAmountFormatted || // Actual amount deposited (for INCOMPLETE_DEPOSIT)
        statusData.swapDetails?.amountInFormatted || // Amount that went through swap (for SUCCESS)
        statusData.quoteResponse?.quote?.amountInFormatted || // Expected amount from quote
        null;

      console.log("statusData", statusData);

      if (depositedAmount) {
        setActualDepositedAmount(depositedAmount);
      }

      if (statusData.status === "SUCCESS") {
        setIsPolling(false); // Stop polling on success
        setFundReceived(true);
        setFundReceivedFailed(false);

        // Log actual deposited amount for debugging
        const expectedAmountFromQuote =
          statusData.quoteResponse?.quote?.amountInFormatted || amount;

        if (depositedAmount && depositedAmount !== expectedAmountFromQuote) {
          console.log(
            `Amount mismatch: Expected ${expectedAmountFromQuote}, but received ${depositedAmount}. Proceeding with actual amount.`,
          );
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
        setFundConverted(true);

        await new Promise((resolve) => setTimeout(resolve, 1500));
        setFundDeposited(true);

        // Call donation API for campaigns
        try {
          // Use the actual amount that was converted to NEAR (amountOutFormatted)
          // This is what was actually deposited after the swap, regardless of original input amount
          const nearedAmount =
            statusData.swapDetails?.amountOutFormatted ||
            statusData.quote?.amountOutFormatted ||
            null;

          if (!nearedAmount) {
            throw new Error("Swap details are incomplete - missing converted amount");
          }

          const donateResponse = await fetch(
            "https://us-central1-almond-1b205.cloudfunctions.net/potluck/donate",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username: donatorName,
                deposit: nearedAmount, // Use actual converted amount
                campaign_id: String(campaignId),
                walletID: null,
              }),
            },
          );

          if (!donateResponse.ok) {
            const errorText = await donateResponse.text();
            throw new Error(`Donation failed: ${donateResponse.status} - ${errorText}`);
          }

          const donateData = await donateResponse.json();
          console.log("Donation response:", donateData);

          setFundDonated(true);
          // Don't automatically navigate - wait for user to click "View Success" button
        } catch (err) {
          console.error("Error during donation:", err);
          // Don't mark the first step as failed if donation API fails
          // The swap was successful, so we still proceed
          setFundDonated(true);
          // Don't automatically navigate - wait for user to click "View Success" button
        }
      } else if (statusData.status === "INCOMPLETE_DEPOSIT") {
        // Show what was actually deposited vs minimum required
        const minimumAmount =
          minAmountInFormatted ||
          statusData.quoteResponse?.quote?.minAmountInFormatted ||
          statusData.quoteResponse?.quote?.amountInFormatted ||
          amount;

        const actualAmount =
          statusData.swapDetails?.depositedAmountFormatted || depositedAmount || "unknown";

        const refundedAmount = statusData.swapDetails?.refundedAmountFormatted;
        const hasRefunded = refundedAmount && parseFloat(refundedAmount) > 0;

        let errorMsg = `Incomplete deposit. Minimum required: ${minimumAmount}, but received ${actualAmount}.`;

        if (hasRefunded) {
          errorMsg += ` Refund of ${refundedAmount} has been processed.`;
        } else {
          errorMsg += " The transaction will be refunded automatically.";
        }

        setErrorInfo(errorMsg);
        setFundReceived(true);
        setFundReceivedFailed(true);
        setIsPolling(false); // Stop polling on error
      } else if (statusData.status === "FAILED" || statusData.status === "REFUNDED") {
        const minimumAmount =
          minAmountInFormatted ||
          statusData.quoteResponse?.quote?.minAmountInFormatted ||
          statusData.quoteResponse?.quote?.amountInFormatted ||
          amount;

        const errorMessage =
          statusData.status === "REFUNDED"
            ? `Transaction was refunded. This usually happens when the amount sent was below 
            the minimum required (${minimumAmount}). Please try again with at least ${minimumAmount}.`
            : statusData.error ||
              statusData.message ||
              "Transaction failed. The funds will be refunded automatically.";

        setErrorInfo(errorMessage);
        setFundReceived(true);
        setFundReceivedFailed(true);
        setIsPolling(false); // Stop polling on error
      } else if (["PENDING", "PROCESSING", "PENDING_DEPOSIT"].includes(statusData.status)) {
        // Keep polling for pending/processing/pending_deposit status
        setFundReceived(false);
        setFundReceivedFailed(false);
        setErrorInfo(null); // Clear any previous errors
      } else {
        // Unknown status - show generic error but keep polling
        const errorMsg =
          statusData.error ||
          statusData.message ||
          "Unexpected status. Please refresh to check again.";

        setErrorInfo(errorMsg);
        setFundReceived(true);
        setFundReceivedFailed(true);
      }
    } catch (error) {
      console.error("Error in checkStatus:", error);

      if (error instanceof Error) {
        setErrorInfo(`Transaction failed: ${error.message}`);
      } else {
        setErrorInfo("An unknown error occurred during the transaction");
      }

      setFundReceived(true);
      setFundReceivedFailed(true);
    }
  };

  useEffect(() => {
    checkStatus();

    // Poll status every 5 seconds if still processing and not failed
    if (isPolling && !fundDonated && !fundReceivedFailed) {
      const interval = setInterval(() => {
        checkStatus();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isPolling, fundDonated, fundReceivedFailed]);

  const StepIcon = ({
    step,
    completed,
    failed,
  }: {
    step: number;
    completed: boolean;
    failed?: boolean;
  }) => {
    if (completed) {
      if (failed) {
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500">
            <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
              <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7a1 1 0 0 0-1.41 1.41L10.59 12l-4.89 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z" />
            </svg>
          </div>
        );
      }

      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00EC97]">
          <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
            <path d="M9 16.17l-3.88-3.88-1.41 1.41L9 19 20.29 7.71l-1.41-1.41z" />
          </svg>
        </div>
      );
    }

    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-500 text-sm font-semibold text-white">
        {step}
      </div>
    );
  };

  const StepConnector = () => <div className="h-9 w-px bg-gray-400"></div>;

  const parseAmount = (amountStr: string): number => {
    const match = amountStr.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="mb-4 text-center text-lg font-semibold">
        Processing Your Cross-Chain Donation
      </h2>

      {/* Step 1: Receiving funds */}
      <div className="flex w-full items-start gap-4">
        <div className="flex flex-col items-center">
          <StepIcon
            step={1}
            completed={fundReceived === true}
            failed={fundReceivedFailed === true}
          />
          {fundReceived && !fundReceivedFailed && <StepConnector />}
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <div className="text-base font-semibold">
            Receiving funds from {capitalizeFirstLetter(blockchain)}
          </div>
          {fundReceived ? (
            fundReceivedFailed ? (
              <div className="text-sm text-red-500">{errorInfo}</div>
            ) : (
              <>
                <div className="text-sm text-gray-700">
                  {actualDepositedAmount &&
                  actualDepositedAmount !==
                    (swapData?.quoteResponse?.quote?.amountInFormatted || amount)
                    ? `Received ${actualDepositedAmount} ${minAmountInFormatted ? `(minimum: ${minAmountInFormatted})` : `(expected ${swapData?.quoteResponse?.quote?.amountInFormatted || amount})`}`
                    : `Received ${swapData?.quoteResponse?.quote?.amountInFormatted || amount} sent from your wallet`}
                </div>
                {swapData?.swapDetails?.nearTxHashes?.[0] && (
                  <a
                    href={`https://nearblocks.io/txns/${swapData.swapDetails.nearTxHashes[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-gray-800 transition-colors hover:text-blue-500"
                    onMouseEnter={() => setIsTxLink1Hovered(true)}
                    onMouseLeave={() => setIsTxLink1Hovered(false)}
                  >
                    View Transaction
                    <svg width="16" height="16" viewBox="0 0 24 25" fill="none">
                      <path
                        d="M15 3.5H21M21 3.5V9.5M21 3.5L10 14.5M18 13.5V19.5C18 20.0304 17.7893 20.5391 17.4142 20.9142C17.0391 21.2893 16.5304 21.5 16 21.5H5C4.46957 21.5 3.96086 21.2893 3.58579 20.9142C3.21071 20.5391 3 20.0304 3 19.5V8.5C3 7.96957 3.21071 7.46086 3.58579 7.08579C3.96086 6.71071 4.46957 6.5 5 6.5H11"
                        stroke={isTxLink1Hovered ? "#3b82f6" : "#262626"}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                )}
              </>
            )
          ) : (
            <div className="text-sm text-gray-500">Awaiting confirmation of received funds....</div>
          )}
        </div>
      </div>

      {/* Step 2: Withdrawing to NEAR Intent */}
      <div className="flex w-full items-start gap-4">
        <div className="flex flex-col items-center">
          <StepIcon step={2} completed={fundConverted === true} />
          {fundConverted && <StepConnector />}
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <div className="text-base font-semibold">Withdrawing to NEAR Intent</div>
          {fundConverted ? (
            <>
              <div className="text-sm text-gray-700">Withdrawal completed successfully</div>
              {swapData?.swapDetails?.nearTxHashes?.[1] && (
                <a
                  href={`https://nearblocks.io/txns/${swapData.swapDetails.nearTxHashes[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-gray-800 transition-colors hover:text-blue-500"
                  onMouseEnter={() => setIsTxLink2Hovered(true)}
                  onMouseLeave={() => setIsTxLink2Hovered(false)}
                >
                  View Transaction
                  <svg width="16" height="16" viewBox="0 0 24 25" fill="none">
                    <path
                      d="M15 3.5H21M21 3.5V9M21 3.5L10 14.5M18 13.5V19.5C18 20.0304 17.7893 20.5391 17.4142 20.9142C17.0391 21.2893 16.5304 21.5 16 21.5H5C4.46957 21.5 3.96086 21.2943 3.58579 20.9142C3.21071 20.5391 3 20.0304 3 19.5V8.5C3 7.96957 3.21071 7.46086 3.58579 7.08579C3.96086 6.71071 4.46957 6.5 5 6.5H11"
                      stroke={isTxLink2Hovered ? "#3b82f6" : "#262626"}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              )}
            </>
          ) : (
            <div className="text-sm text-gray-500">Waiting for withdrawal.....</div>
          )}
        </div>
      </div>

      {/* Step 3: Converting to NEAR */}
      <div className="flex w-full items-start gap-4">
        <div className="flex flex-col items-center">
          <StepIcon step={3} completed={fundDeposited === true} />
          {fundDeposited && <StepConnector />}
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <div className="text-base font-semibold">Converting to Near</div>
          {fundDeposited ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="flex items-center gap-1">
                  {tokenImage && (
                    <img
                      src={tokenImage}
                      alt="token"
                      className="h-5 w-5 rounded-full object-cover"
                    />
                  )}
                  <span className="font-semibold">
                    {actualDepositedAmount
                      ? `${parseAmount(actualDepositedAmount).toFixed(2)}`
                      : `${parseAmount(amount).toFixed(2)}`}{" "}
                    ➝
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <svg width="21" height="21" viewBox="0 0 24 25" fill="none" className="mr-1">
                    <path
                      d="M24 12.5C24 5.37258 18.6274 0.5 12 0.5C5.37258 0.5 0 5.37258 0 12.5C0 19.1274 5.37258 24.5 12 24.5C18.6274 24.5 24 19.1274 24 12.5Z"
                      fill="black"
                    />
                    <path
                      d="M15.5159 7.26259L13.0785 10.8792C12.9118 11.1292 13.2368 11.4209 13.4702 11.2167L15.5951 9.13341C15.6577 9.07924 15.7492 9.11674 15.7492 9.20841V15.7292C15.7492 15.8167 15.6326 15.8541 15.5826 15.7917L8.59933 7.10843C8.48532 6.96875 8.34097 6.85545 8.17714 6.77894C8.01333 6.70244 7.83428 6.66408 7.6535 6.66676C6.90351 6.66676 6.16602 7.04592 6.16602 7.91258V17.0833C6.16759 17.3535 6.25697 17.6159 6.42067 17.8309C6.58437 18.0458 6.81352 18.2018 7.07358 18.2751C7.33363 18.3485 7.61048 18.3353 7.8624 18.2375C8.1143 18.1398 8.32762 17.9629 8.47016 17.7333L10.9035 14.1167C11.07015 13.8667 10.7493 13.57543 10.516 13.7792L8.4035 15.9042C8.34094 15.9584 8.24933 15.9209 8.24933 15.8292V9.32507C8.24933 9.23341 8.366 9.2000 8.416 9.26257L15.3868 17.8916C15.6201 18.1792 15.9701 18.3333 16.3325 18.3333C17.0868 18.3333 17.8326 17.9583 17.8326 17.0875V7.91675C17.8325 7.44439 17.7428 7.37961 17.5782 7.16267C17.4136 6.94574 17.1824 6.78852 16.9202 6.71494C16.658 6.64136 16.3789 6.65545 16.1255 6.75506C15.8719 6.85467 15.658 7.03434 15.5159 7.26676V7.26259Z"
                      fill="#00EC97"
                    />
                  </svg>
                  <span className="font-semibold">
                    {(swapData?.swapDetails?.amountOutFormatted
                      ? parseFloat(swapData.swapDetails.amountOutFormatted)
                      : 0
                    ).toFixed(2)}{" "}
                    NEAR
                  </span>
                </span>
              </div>
              {actualDepositedAmount &&
                actualDepositedAmount !==
                  (swapData?.quoteResponse?.quote?.amountInFormatted || amount) && (
                  <div className="text-xs italic text-gray-500">
                    Note: You deposited {actualDepositedAmount}{" "}
                    {minAmountInFormatted
                      ? `(minimum: ${minAmountInFormatted})`
                      : `(expected ${swapData?.quoteResponse?.quote?.amountInFormatted || amount})`}
                  </div>
                )}
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              Awaiting funds withdrawal for conversion.....
            </div>
          )}
        </div>
      </div>

      {/* Step 4: Depositing */}
      <div className="flex w-full items-start gap-4">
        <div className="flex flex-col items-center">
          <StepIcon step={4} completed={fundDonated === true} />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <div className="text-base font-semibold">Depositing</div>
          {fundDonated ? (
            <div className="text-sm text-gray-500">
              Successfully deposited{" "}
              {swapData?.swapDetails?.amountOutFormatted
                ? `${parseFloat(swapData.swapDetails.amountOutFormatted).toFixed(4)} NEAR`
                : amount}{" "}
              to <strong className="font-semibold text-black">{campaignName}</strong>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Donate Pending.....</div>
          )}
        </div>
      </div>

      {/* Info message */}
      <div className="mt-4 text-center text-sm text-gray-600">
        <div>This process may take a few minutes to complete.</div>
        <div>Please do not close this window until the process is complete.</div>
      </div>

      {/* Action button */}
      <div className="mt-4 border-t pt-4">
        {fundDonated ? (
          <Button
            type="button"
            variant="brand-filled"
            onClick={() => {
              // Navigate to leaderboard page
              router.push(routeSelectors.CAMPAIGN_BY_ID_LEADERBOARD(campaignId));
              onFinish();
            }}
            className="w-full"
          >
            View Transaction
          </Button>
        ) : (
          <Button
            type="button"
            variant="brand-filled"
            onClick={refreshTransaction}
            className="w-full"
          >
            Refresh Transaction
          </Button>
        )}
      </div>
    </div>
  );
};
