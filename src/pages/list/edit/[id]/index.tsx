import React from "react";

import { isClient } from "@wpdas/naxios";

import { WalletProvider } from "@/common/contexts/wallet";
import { PageWithBanner, SplashScreen } from "@/common/ui/components";
import { CreateListHero, ListFormDetails } from "@/entities/list";

export default function Page() {
  return (
    <PageWithBanner>
      <CreateListHero onEditPage />

      {!isClient() ? (
        <SplashScreen className="h-100" />
      ) : (
        <WalletProvider>
          <ListFormDetails />
        </WalletProvider>
      )}
    </PageWithBanner>
  );
}
