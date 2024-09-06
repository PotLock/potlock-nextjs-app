import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { potlock } from "@/common/api/potlock";
import { SYBIL_FRONTEND_URL } from "@/common/constants";
import { PageWithBanner } from "@/common/ui/components";
import useWallet from "@/modules/auth/hooks/useWallet";
import { Alert, useIsHuman } from "@/modules/core";
import ErrorModal from "@/modules/core/components/ErrorModal";
import SuccessModal from "@/modules/core/components/SuccessModal";
import { Header, HeaderStatus } from "@/modules/pot";

import Tabs from "./Tabs";
import { POT_TABS_CONFIG } from "../constants";

export type PotLayoutProps = {
  children: React.ReactNode;
};

export const PotLayout: React.FC<PotLayoutProps> = ({ children }) => {
  const router = useRouter();
  const query = router.query as {
    potId: string;
    done?: string;
    errorMessage?: string;
  };
  const pathname = router.pathname;

  const { potId } = query;
  const { data: potDetail } = potlock.usePot({ potId });
  const { wallet } = useWallet();
  const { loading, nadaBotVerified } = useIsHuman(wallet?.accountId);

  // Modals
  const [resultModalOpen, setSuccessModalOpen] = useState(
    !!query.done && !query.errorMessage,
  );
  const [errorModalOpen, setErrorModalOpen] = useState(!!query.errorMessage);

  const [selectedTab, setSelectedTab] = useState(
    POT_TABS_CONFIG.find((tab) => pathname.includes(tab.href)) ||
      POT_TABS_CONFIG[0],
  );

  useEffect(() => {
    setSelectedTab(
      POT_TABS_CONFIG.find((tab) => pathname.includes(tab.href)) ||
        POT_TABS_CONFIG[0],
    );
  }, [pathname]);

  if (!potDetail) {
    return "";
  }

  return (
    <PageWithBanner>
      {/* Modals */}
      <SuccessModal
        successMessage="Transaction sent successfully"
        open={resultModalOpen}
        onCloseClick={() => setSuccessModalOpen(false)}
      />
      <ErrorModal
        errorMessage={decodeURIComponent(query.errorMessage || "")}
        open={errorModalOpen}
        onCloseClick={() => setErrorModalOpen(false)}
      />

      <HeaderStatus potDetail={potDetail} />

      {/* Not a human alert */}
      {!loading && !nadaBotVerified && (
        <div className="px-8">
          <Alert
            text="Your contribution won't be matched unless verified as human before the matching round ends."
            buttonLabel="Verify you're human"
            buttonHref={SYBIL_FRONTEND_URL}
          />
        </div>
      )}

      <Header potDetail={potDetail} />

      {/* Pot Tabs */}
      <Tabs
        asLink
        navOptions={POT_TABS_CONFIG}
        selectedTab={selectedTab.id}
        onSelect={(tabId: string) => {
          setSelectedTab(
            POT_TABS_CONFIG.find((tabRoute) => tabRoute.id === tabId)!,
          );
        }}
      />

      {/* Tab Content */}
      <div className="md:px-8 flex w-full flex-row flex-wrap gap-2 px-[1rem]">
        {children}
      </div>
    </PageWithBanner>
  );
};
