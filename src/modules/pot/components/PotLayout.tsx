import { useEffect, useState } from "react";

import { useRouter } from "next/router";

import { usePot } from "@/common/api/potlock/hooks";
import { NADA_BOT_URL } from "@/common/constants";
import useWallet from "@/modules/auth/hooks/useWallet";
import { Alert, useIsHuman } from "@/modules/core";
import { Header, HeaderStatus } from "@/modules/pot";
import { potTabRoutes } from "@/pages/pot/potTabRoutes";

import Tabs from "./Tabs";

type Props = {
  children: React.ReactNode;
};

const PotLayout = ({ children }: Props) => {
  const router = useRouter();
  const query = router.query as { potId: string };
  const pathname = router.pathname;

  const { potId } = query;
  const { data: potDetail } = usePot({ potId });
  const { wallet } = useWallet();
  const { loading, nadaBotVerified } = useIsHuman(wallet?.accountId);

  const [selectedTab, setSelectedTab] = useState(
    potTabRoutes.find((tab) => pathname.includes(tab.href)) || potTabRoutes[0],
  );

  useEffect(() => {
    setSelectedTab(
      potTabRoutes.find((tab) => pathname.includes(tab.href)) ||
        potTabRoutes[0],
    );
  }, [pathname]);

  if (!potDetail) {
    return "";
  }

  return (
    <main className="container flex flex-col">
      <HeaderStatus potDetail={potDetail} />

      {/* Not a human alert */}
      {!loading && !nadaBotVerified && (
        <div className="px-8">
          <Alert
            text="Your contribution won't be matched unless verified as human before the matching round ends."
            buttonLabel="Verify you're human"
            buttonHref={NADA_BOT_URL}
          />
        </div>
      )}

      <Header potDetail={potDetail} />

      {/* Pot Tabs */}
      <Tabs
        asLink
        navOptions={potTabRoutes}
        selectedTab={selectedTab.id}
        onSelect={(tabId: string) => {
          setSelectedTab(
            potTabRoutes.find((tabRoute) => tabRoute.id === tabId)!,
          );
        }}
      />

      {/* Tab Content */}
      <div className="md:px-8 flex w-full flex-row flex-wrap gap-2 px-[1rem]">
        {children}
      </div>
    </main>
  );
};

export default PotLayout;
