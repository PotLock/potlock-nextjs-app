import { DirectDonation, PotDonation } from "@/common/contracts/potlock";

export type CartOrder = {
  id: string;
  amount: string;
  token: string;
  referrerId?: string;
  accountId?: string;
  potId?: string;
};

export type CartCheckoutStep = "details" | "result";

export type CartOrderOutcome = DirectDonation | PotDonation;

export type CartState = {
  orders: {
    [id: CartOrder["id"]]: CartOrder;
  };

  checkoutStep: CartCheckoutStep;

  finalOutcome: {
    data?: null | CartOrderOutcome[];
    error: null | Error;
  };
};
