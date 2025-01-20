import { isClient } from "@wpdas/naxios";

import { WalletProvider } from "@/common/contexts/wallet";
import { PageWithBanner, SplashScreen } from "@/common/ui/components";
import { CreateListHero, ListFormDetails } from "@/entities/list";

export default function DuplicateList() {
  return (
    <PageWithBanner>
      <CreateListHero onEditPage text="Duplicate List" />

      {!isClient() ? (
        <SplashScreen className="h-100" />
      ) : (
        <WalletProvider>
          <ListFormDetails isDuplicate />
        </WalletProvider>
      )}
    </PageWithBanner>
  );
}
