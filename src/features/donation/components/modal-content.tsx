import { useMemo, useState } from "react";

import { FEATURE_REGISTRY } from "@/common/_config";
import { indexer } from "@/common/api/indexer";
import { NATIVE_TOKEN_ID } from "@/common/constants";
import { campaignsContractHooks } from "@/common/contracts/core/campaigns";
import { donationContractHooks } from "@/common/contracts/core/donation";
import {
  Button,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  ModalErrorBody,
  Skeleton,
} from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";
import { useAccountSocialProfile } from "@/entities/_shared/account";
import { useDispatch } from "@/store/hooks";

import { CrossChainAmountEntry } from "./cross-chain-amount-entry";
import { CrossChainProcessing } from "./cross-chain-processing";
import { CrossChainQRCode } from "./cross-chain-qr-code";
import { DonationGroupAllocation } from "./group-allocation";
import { DonationGroupAllocationSuccessScreen } from "./group-allocation-success";
import { DonationModalConfirmationScreen } from "./modal-confirmation-screen";
import { DonationSingleRecipientAllocation } from "./single-recipient-allocation";
import {
  DonationSingleRecipientSuccessScreen,
  DonationSingleRecipientSuccessScreenProps,
} from "./single-recipient-success";
import { type DonationFormParams, useDonationForm } from "../hooks/form";
import { useDonationState } from "../models/store";
import {
  DonationAllocationKey,
  type GroupDonationReceipts,
  type SingleRecipientDonationReceipt,
} from "../types";

export type DonationModalContentProps = DonationAllocationKey &
  Pick<DonationFormParams, "cachedTokenId"> &
  Pick<DonationSingleRecipientSuccessScreenProps, "transactionHash"> & {
    closeModal: VoidFunction;
  };

export const DonationModalContent: React.FC<DonationModalContentProps> = ({
  transactionHash,
  closeModal,
  ...props
}) => {
  const dispatch = useDispatch();
  const { currentStep, finalOutcome } = useDonationState();
  const isTestEnv = process.env.NEXT_PUBLIC_ENV === "test";
  const [crossChainStep, setCrossChainStep] = useState<"amount" | "qr" | "processing" | null>(null);

  // Helper to safely set crossChainStep only when not in test environment
  const setCrossChainStepSafe = (step: "amount" | "qr" | "processing" | null) => {
    if (!isTestEnv) {
      setCrossChainStep(step);
    }
  };

  const [selectedTokenData, setSelectedTokenData] = useState<{
    blockchain: string;
    tokenData?: any;
  } | null>(null);

  const [crossChainDonationData, setCrossChainDonationData] = useState<{
    amount: string;
    fee: string;
    chain: string;
    decimals: number;
    tokenId: string;
    senderAddress: string;
    tokenImage: string;
    amountDeposit: string;
    depositAddress?: string;
    minAmountIn?: string;
    minAmountInFormatted?: string;
    bypassProtocolFee?: boolean;
    bypassCreatorFee?: boolean;
    bypassReferralFee?: boolean;
  } | null>(null);

  const { isLoading: isDonationConfigLoading, data: donationConfig } =
    donationContractHooks.useConfig();

  const { form, matchingPots, isDisabled, onSubmit, totalAmountFloat, isGroupDonation } =
    useDonationForm(props);

  const isCampaignDonation = "campaignId" in props;
  const isPotDonation = "potId" in props;
  const isAccountDonation = "accountId" in props;
  const tokenId = form.watch("tokenId");

  const [bypassProtocolFee, bypassCuratorFee] = form.watch([
    "bypassProtocolFee",
    "bypassCuratorFee",
  ]);

  const { data: campaign } = campaignsContractHooks.useCampaign({
    enabled: isCampaignDonation && "campaignId" in props,
    campaignId: isCampaignDonation && "campaignId" in props ? (props.campaignId ?? 0) : 0,
  });

  const { data: pot } = indexer.usePot({
    enabled: isPotDonation && "potId" in props,
    potId: isPotDonation && "potId" in props ? props.potId : "",
  });

  const { profile: accountProfile } = useAccountSocialProfile({
    accountId: isAccountDonation && "accountId" in props ? props.accountId : "",
    enabled: isAccountDonation,
  });

  const isCrossChainDonation =
    process.env.NEXT_PUBLIC_ENV !== "test" &&
    (isCampaignDonation || isPotDonation || isAccountDonation) &&
    ((isCampaignDonation && campaign?.end_ms == null) || isPotDonation || isAccountDonation) && // Only allow for ongoing campaigns (no end date), pots, or account donations
    tokenId !== NATIVE_TOKEN_ID &&
    tokenId !== undefined &&
    tokenId.includes(":");

  const successScreenProps = useMemo(
    () => ({ form, transactionHash, closeModal }),
    [closeModal, form, transactionHash],
  );

  const currentScreen = useMemo(() => {
    const defaultErrorScreen = (
      <ModalErrorBody heading="Donation" title="Unable to proceed with the next step." />
    );

    switch (currentStep) {
      case "allocation": {
        if ("accountId" in props || "campaignId" in props) {
          return (
            <DonationSingleRecipientAllocation 
              form={form} 
              matchingPots={matchingPots} 
              {...props}
              onTokenDataChange={setSelectedTokenData}
            />
          );
        } else if ("potId" in props || "listId" in props) {
          return (
            <DonationGroupAllocation form={form} totalAmountFloat={totalAmountFloat} {...props} />
          );
        } else return defaultErrorScreen;
      }

      case "confirmation":
        // Show cross-chain processing screen when user confirms they've sent funds
        // Only allow cross-chain steps when not in test environment
        if (
          !isTestEnv &&
          crossChainStep === "processing" &&
          isCrossChainDonation &&
          crossChainDonationData
        ) {
          return (
            <>
              <DialogHeader>
                <DialogTitle>
                  {isCampaignDonation && campaign?.name
                    ? `Donate to ${campaign.name} Campaign`
                    : isPotDonation && pot?.name
                      ? `Donate to ${pot.name} Pot`
                      : isAccountDonation && accountProfile?.name
                        ? `Donate to ${accountProfile.name}`
                        : "Donate"}
                </DialogTitle>
              </DialogHeader>
              <DialogDescription className="max-h-[calc(100vh-180px)] overflow-y-auto">
                <CrossChainProcessing
                  contractType={isCampaignDonation ? "campaign" : isPotDonation ? "pot" : "project"}
                  campaignId={
                    isCampaignDonation && "campaignId" in props ? props.campaignId : undefined
                  }
                  potId={isPotDonation && "potId" in props ? props.potId : undefined}
                  accountId={
                    isAccountDonation && "accountId" in props ? props.accountId : undefined
                  }
                  name={
                    isCampaignDonation
                      ? campaign?.name || "Campaign"
                      : isPotDonation
                        ? pot?.name || "Pot"
                        : isAccountDonation
                          ? accountProfile?.name ||
                            ("accountId" in props ? props.accountId : "Account")
                          : "Donation"
                  }
                  amount={crossChainDonationData.amount}
                  depositAddress={crossChainDonationData.depositAddress || ""}
                  blockchain={crossChainDonationData.chain}
                  tokenImage={crossChainDonationData.tokenImage}
                  minAmountIn={crossChainDonationData.minAmountIn}
                  minAmountInFormatted={crossChainDonationData.minAmountInFormatted}
                  bypassProtocolFee={crossChainDonationData.bypassProtocolFee ?? bypassProtocolFee}
                  bypassCreatorFee={crossChainDonationData.bypassCreatorFee ?? bypassCuratorFee}
                  bypassReferralFee={crossChainDonationData.bypassReferralFee ?? false}
                  onProceed={async (txHash, name, amount, usdAmount, nearAmount) => {
                    // Handle the transaction outcome and move to success screen
                    if (txHash) {
                      try {
                        await dispatch.donation.handleOutcome(txHash);
                        setCrossChainStepSafe(null);
                        dispatch.donation.nextStep(); // Move to success screen
                      } catch (error) {
                        console.error("Error handling donation outcome:", error);
                        // Still move to success screen even if handleOutcome fails
                        setCrossChainStepSafe(null);
                        dispatch.donation.nextStep();
                      }
                    } else {
                      // If no txHash, just move to success screen
                      setCrossChainStepSafe(null);
                      dispatch.donation.nextStep();
                    }
                  }}
                  onClose={() => {
                    setCrossChainStepSafe(null);
                    setCrossChainDonationData(null);
                    setSelectedTokenData(null);
                    form.setValue("tokenId", NATIVE_TOKEN_ID);
                    dispatch.donation.previousStep();
                  }}
                  onBack={() => {
                    setCrossChainStepSafe("qr");
                  }}
                  onFinish={closeModal}
                />
              </DialogDescription>
            </>
          );
        }

        // Show cross-chain QR code screen when user confirms donation
        // Only allow cross-chain steps when not in test environment
        if (
          !isTestEnv &&
          crossChainStep === "qr" &&
          isCrossChainDonation &&
          crossChainDonationData
        ) {
          return (
            <>
              <DialogHeader>
                <DialogTitle>
                  {isCampaignDonation && campaign?.name
                    ? `Donate to ${campaign.name} Campaign`
                    : isPotDonation && pot?.name
                      ? `Donate to ${pot.name} Pot`
                      : isAccountDonation && accountProfile?.name
                        ? `Donate to ${accountProfile.name}`
                        : "Donate"}
                </DialogTitle>
              </DialogHeader>
              <DialogDescription className="max-h-[calc(100vh-180px)] overflow-y-auto">
                <CrossChainQRCode
                  contractType={isCampaignDonation ? "campaign" : isPotDonation ? "pot" : "project"}
                  campaignId={
                    isCampaignDonation && "campaignId" in props ? props.campaignId : undefined
                  }
                  potId={isPotDonation && "potId" in props ? props.potId : undefined}
                  accountId={
                    isAccountDonation && "accountId" in props ? props.accountId : undefined
                  }
                  name={
                    isCampaignDonation
                      ? campaign?.name || "Campaign"
                      : isPotDonation
                        ? pot?.name || "Pot"
                        : isAccountDonation
                          ? accountProfile?.name ||
                            ("accountId" in props ? props.accountId : "Account")
                          : "Donation"
                  }
                  amount={crossChainDonationData.amount}
                  blockchain={crossChainDonationData.chain}
                  decimals={crossChainDonationData.decimals}
                  tokenId={crossChainDonationData.tokenId}
                  networkFee={crossChainDonationData.fee}
                  senderAddress={crossChainDonationData.senderAddress}
                  tokenImage={crossChainDonationData.tokenImage}
                  onSentFunds={(amount, depositAddress, id, walletBalance, quoteData) => {
                    setCrossChainDonationData((prev) =>
                      prev
                        ? {
                            ...prev,
                            depositAddress,
                            minAmountIn: quoteData?.minAmountIn,
                            minAmountInFormatted: quoteData?.minAmountInFormatted,
                          }
                        : null,
                    );

                    setCrossChainStepSafe("processing");
                  }}
                  onClose={() => {
                    setCrossChainStepSafe(null);
                    setCrossChainDonationData(null);
                    setSelectedTokenData(null);
                    form.setValue("tokenId", NATIVE_TOKEN_ID);
                    dispatch.donation.previousStep();
                  }}
                  onBack={() => {
                    setCrossChainStepSafe("amount");
                  }}
                />
              </DialogDescription>
            </>
          );
        }

        // Show cross-chain amount entry instead of regular confirmation for cross-chain donations
        // Only allow cross-chain steps when not in test environment
        if (
          !isTestEnv &&
          crossChainStep === "amount" &&
          isCrossChainDonation &&
          selectedTokenData
        ) {
          return (
            <>
              <DialogHeader>
                <DialogTitle>
                  {isCampaignDonation && campaign?.name
                    ? `Donate to ${campaign.name} Campaign`
                    : isPotDonation && pot?.name
                      ? `Donate to ${pot.name} Pot`
                      : isAccountDonation && accountProfile?.name
                        ? `Donate to ${accountProfile.name}`
                        : "Donate"}
                </DialogTitle>
              </DialogHeader>
              <DialogDescription className="max-h-[calc(100vh-180px)] overflow-y-auto">
                <CrossChainAmountEntry
                  form={form}
                  campaignId={
                    isCampaignDonation && "campaignId" in props ? props.campaignId : undefined
                  }
                  potId={isPotDonation && "potId" in props ? props.potId : undefined}
                  accountId={
                    isAccountDonation && "accountId" in props ? props.accountId : undefined
                  }
                  selectedBlockchain={selectedTokenData.blockchain}
                  selectedTokenData={selectedTokenData.tokenData}
                  onProceed={(
                    amount,
                    fee,
                    chain,
                    decimals,
                    tokenId,
                    senderAddress,
                    tokenImage,
                    amountDeposit,
                    bypassProtocolFee,
                    bypassCreatorFee,
                    bypassReferralFee,
                  ) => {
                    setCrossChainDonationData({
                      amount,
                      fee,
                      chain,
                      decimals,
                      tokenId,
                      senderAddress,
                      tokenImage,
                      amountDeposit,
                      bypassProtocolFee,
                      bypassCreatorFee,
                      bypassReferralFee,
                    });

                    setCrossChainStepSafe("qr");
                  }}
                  onClose={() => {
                    setCrossChainStepSafe(null);
                    setSelectedTokenData(null);
                    form.setValue("tokenId", NATIVE_TOKEN_ID);
                    dispatch.donation.previousStep();
                  }}
                  onGoBack={() => {
                    setCrossChainStepSafe(null);
                    dispatch.donation.previousStep();
                  }}
                />
              </DialogDescription>
            </>
          );
        }

        return (
          <DonationModalConfirmationScreen
            form={form}
            totalAmountFloat={totalAmountFloat}
            campaignId={"campaignId" in props ? props.campaignId : null}
          />
        );

      case "success": {
        return isGroupDonation ? (
          <DonationGroupAllocationSuccessScreen
            {...successScreenProps}
            receipts={finalOutcome as GroupDonationReceipts}
          />
        ) : (
          <DonationSingleRecipientSuccessScreen
            {...successScreenProps}
            receipt={finalOutcome as SingleRecipientDonationReceipt}
          />
        );
      }

      default:
        return defaultErrorScreen;
    }
  }, [
    currentStep,
    finalOutcome,
    form,
    isGroupDonation,
    matchingPots,
    props,
    successScreenProps,
    totalAmountFloat,
    isTestEnv,
    crossChainStep,
    isCrossChainDonation,
    crossChainDonationData,
    selectedTokenData,
    campaign,
    isCampaignDonation,
  ]);

  return (
    <Form {...form}>
      <form className="flex h-full flex-col" {...{ onSubmit }}>
        {currentScreen}

        {currentStep !== "success" &&
          !(
            currentStep === "confirmation" &&
            !isTestEnv &&
            (crossChainStep === "amount" ||
              crossChainStep === "qr" ||
              crossChainStep === "processing") &&
            isCrossChainDonation
          ) && (
          <DialogFooter>
            {currentStep === "allocation" && (
              <Button
                disabled={!FEATURE_REGISTRY.Cart.isEnabled}
                type="button"
                variant="brand-outline"
                color="black"
              >
                {"Add to cart"}
              </Button>
            )}

            {donationConfig === undefined && isDonationConfigLoading ? (
              <Skeleton className="w-38.5 h-10" />
            ) : (
              <Button
                type="button"
                variant="brand-filled"
                onClick={() => {
                  if (currentStep === "confirmation") {
                    onSubmit();
                    } else if (
                      currentStep === "allocation" &&
                      isCrossChainDonation &&
                      selectedTokenData &&
                      !isTestEnv
                    ) {
                    // Trigger cross-chain flow - move to confirmation step and show cross-chain amount entry
                      // Only allow in non-test environments
                      setCrossChainStepSafe("amount");
                    dispatch.donation.nextStep();
                  } else {
                    dispatch.donation.nextStep();
                  }
                }}
                disabled={isDisabled}
                className={cn({ "w-full": currentStep === "confirmation" })}
              >
                {currentStep === "confirmation" ? "Confirm donation" : "Proceed to donate"}
              </Button>
            )}
          </DialogFooter>
        )}
      </form>
    </Form>
  );
};
