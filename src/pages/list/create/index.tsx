import React from "react";

import { isClient } from "@wpdas/naxios";

import { WalletManagerProvider } from "@/common/contexts/wallet-manager";
import { PageWithBanner, SplashScreen } from "@/common/ui/components";
import { CreateListHero, ListFormDetails } from "@/entities/list";

export default function Page() {
  return (
    <PageWithBanner>
      <CreateListHero onEditPage={false} />

      {!isClient() ? (
        <SplashScreen className="h-100" />
      ) : (
        <WalletManagerProvider>
          <ListFormDetails />
        </WalletManagerProvider>
      )}
    </PageWithBanner>
  );
}
