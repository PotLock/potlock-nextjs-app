import { useRouter } from "next/router";

import { usePot } from "@/common/api/potlock/hooks";
import { NADA_BOT_URL } from "@/common/constants";
import useWallet from "@/modules/auth/hooks/useWallet";
import { Alert, useIsHuman } from "@/modules/core";
import { Header, HeaderStatus } from "@/modules/pot";

const PotPage = () => {
  const query = useRouter().query as { potId: string };
  const { potId } = query;
  const { data: potDetail } = usePot({ potId });
  const { wallet } = useWallet();
  const { loading, nadaBotVerified } = useIsHuman(wallet?.accountId);

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
    </main>
  );
};

export default PotPage;
