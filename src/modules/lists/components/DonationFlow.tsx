import React, { useState } from "react";

// Import the three components
import { buildTransaction } from "@wpdas/naxios";
import { parseNearAmount } from "near-api-js/lib/utils/format";

import { naxiosInstance } from "@/common/api/near";
import LeftArrowIcon from "@/common/assets/svgs/LeftArrowIcon";
import { DONATION_CONTRACT_ID } from "@/common/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/common/ui/components";

import ConfirmDonation from "./Donation/ConfirmDonation";
import DonationSuccess from "./Donation/DonationSuccess";
import FundAllocation from "./Donation/FundAllocation";

const DonationFlow = ({
  onClose,
  isOpen,
}: {
  onClose: () => void;
  isOpen: boolean;
}) => {
  const [step, setStep] = useState(1); // Track the current step in the process
  const [amount, setAmount] = useState(0); // Track the donation amount
  const [breakdown, setBreakdown] = useState<any>([]); // Track the breakdown of fees
  const [selectedProjects, setSelectedProjects] = useState<any>([]);
  const [projects, setProjects] = useState<any>([]);
  const [amountPerProject, setAmountPerProject] = useState<number>(0);

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
    selectedProjects.map((item: any) => {
      allTransactions.push(
        buildTransaction("donate", {
          receiverId: DONATION_CONTRACT_ID,
          args: {
            message: "",
            recipient_id: item?.registrant?.id,
            referrer_id: null,
            bypass_protocol_fee: true,
          },
          deposit: parseNearAmount(`${amountPerProject}`)!,
        }),
      );
    });
    naxiosInstance
      .contractApi({
        contractId: DONATION_CONTRACT_ID,
      })
      .callMultiple(allTransactions)
      .then((res) => {
        if (res) nextStep();
      })
      .catch((err) => console.error(err));
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent onCloseClick={onClose}>
        <DialogHeader>
          <DialogTitle>
            <h1 className="text-xl font-bold">Donate to List</h1>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {step === 1 && (
            <FundAllocation
              projects={projects}
              setProjects={setProjects}
              selectedProjects={selectedProjects}
              setSelectedProjects={setSelectedProjects}
              handleAddToCart={(
                donationAmount: number,
                selectedProjects: any,
              ) => {
                // Create a Project Breakdown based on allocation Logic (For Contract)
                const individualAmount =
                  donationAmount / selectedProjects.length;
                setAmountPerProject(individualAmount);

                setAmount(donationAmount);
                // Create a breakdown based on allocation logic (For Display)
                setBreakdown([
                  {
                    label: "Project allocation (92.5%)",
                    amount: (donationAmount * 92.5) / 100,
                  },
                  {
                    label: "Protocol fees (5%)",
                    amount: (donationAmount * 5) / 100,
                  },
                  {
                    label: "Chef fees (5%)",
                    amount: (donationAmount * 5) / 100,
                  },
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
              selectedProjects={selectedProjects}
              onClose={onClose}
            />
          )}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default DonationFlow;
