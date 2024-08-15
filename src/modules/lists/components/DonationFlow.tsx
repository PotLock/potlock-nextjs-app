import React, { useState } from "react";

// Import the three components
import { buildTransaction } from "@wpdas/naxios";
import { parseNearAmount } from "near-api-js/lib/utils/format";

import { naxiosInstance } from "@/common/contracts";
import useWallet from "@/modules/auth/hooks/useWallet";

import ConfirmDonation from "./Donation/ConfirmDonation";
import DonationSuccess from "./Donation/DonationSuccess";
import FundAllocation from "./Donation/FundAllocation";

const DonationFlow = ({ onClose }: any) => {
  const [step, setStep] = useState(1); // Track the current step in the process
  const [amount, setAmount] = useState(0); // Track the donation amount
  const [breakdown, setBreakdown] = useState<any>([]); // Track the breakdown of fees
  const { wallet } = useWallet();
  // Handle moving to the next step
  const nextStep = () => {
    setStep(step + 1);
  };

  // Handle going back to the previous step
  const prevStep = () => {
    setStep(step - 1);
  };

  // Handle final confirmation
  const handleConfirm = async () => {
    const allTransactions: any = [];
    breakdown.map((item: any) => {
      allTransactions.push(
        buildTransaction("donate", {
          receiverId: "donate.potlock.near",
          args: {
            message: "",
            referrer_id: wallet?.accountId,
            bypass_protocol_fee: true,
          },
          deposit: parseNearAmount("0.05")!,
        }),
      );
    });
    await naxiosInstance
      .contractApi({
        contractId: "donate.potlock.near",
      })
      .callMultiple(allTransactions),
      nextStep(); // Move to the success screen
  };

  return (
    <div className="mx-auto max-w-lg p-4">
      {step === 1 && (
        <FundAllocation
          availableAmount={200} // Example available amount
          projects={[{ name: "Project A" }, { name: "Project B" }]} // Example projects
          handleAddToCart={(donationAmount: any, selectedProjects: any) => {
            setAmount(donationAmount);
            // Create a breakdown based on allocation logic
            setBreakdown([
              {
                label: "Project allocation (92.5%)",
                amount: (donationAmount * 92.5) / 100,
              },
              {
                label: "Protocol fees (5%)",
                amount: (donationAmount * 5) / 100,
              },
              { label: "Chef fees (5%)", amount: (donationAmount * 5) / 100 },
              {
                label: "Referral fees (2.5%)",
                amount: (donationAmount * 2.5) / 100,
              },
            ]);
            nextStep(); // Proceed to the next step
          }}
          onClose={onClose}
        />
      )}
      {step === 2 && (
        <ConfirmDonation
          totalAmount={amount}
          breakdown={breakdown}
          onConfirm={handleConfirm}
          onBack={prevStep}
          onClose={onClose}
        />
      )}
      {step === 3 && (
        <DonationSuccess
          totalAmount={amount}
          breakdown={breakdown}
          txnHash="0x9jdfhghjhjhjhj" // Example transaction hash
          onClose={onClose}
        />
      )}
    </div>
  );
};

export default DonationFlow;
