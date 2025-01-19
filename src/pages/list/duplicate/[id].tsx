import { isClient } from "@wpdas/naxios";

import { WalletManagerProvider } from "@/common/contexts/wallet-manager";
import { PageWithBanner, SplashScreen } from "@/common/ui/components";
import { CreateListHero, ListFormDetails } from "@/entities/list";

export default function DuplicateList() {
  return (
    <PageWithBanner>
      <CreateListHero onEditPage text="Duplicate List" />

      {!isClient() ? (
        <SplashScreen className="h-100" />
      ) : (
        <WalletManagerProvider>
          <ListFormDetails isDuplicate />
        </WalletManagerProvider>
      )}
    </PageWithBanner>
  );
}
