import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ByAccountId, donationSchema } from "@/common/api/potlock";

export interface AccountDonation extends ByAccountId {}

export const useAccountDonationForm = (_: AccountDonation) => {
  const { ...form } = useForm({
    resolver: zodResolver(donationSchema),
  });

  return { ...form };
};
