import { useCallback, useEffect } from "react";

import { useRouter } from "next/router";

import { PLATFORM_NAME } from "@/common/_config";
import { NOOP_STRING } from "@/common/constants";
import { PageWithBanner } from "@/common/ui/layout/components";
import { useToast } from "@/common/ui/layout/hooks";
import { cn } from "@/common/ui/layout/utils";
import { useWalletUserSession } from "@/common/wallet";
import { useDaoRegistrationProposalStatus } from "@/entities/dao";
import { ProfileConfigurationUserPanel } from "@/features/profile-configuration";
import { routeSelectors } from "@/navigation";

export default function RegisterPage() {
  const walletUser = useWalletUserSession();
  const router = useRouter();
  const { toast } = useToast();

  const daoRegistrationProposal = useDaoRegistrationProposalStatus({
    enabled: walletUser.isDaoRepresentative,
    accountId: walletUser.accountId ?? NOOP_STRING,
  });

  const onRegistrationSuccess = useCallback(() => {
    toast({ title: "Success!", description: "You have successfully submitted your registration." });

    if (walletUser.isSignedIn) {
      if (walletUser.isDaoRepresentative) {
        daoRegistrationProposal.refetch();
      } else {
        setTimeout(
          () => {
            walletUser.refetchRegistrationStatus();
            router.push(routeSelectors.PROFILE_BY_ID(walletUser.accountId));
          },

          2500,
        );
      }
    }
  }, [daoRegistrationProposal, router, toast, walletUser]);

  const onRegistrationFailure = useCallback(
    (errorMessage: string) =>
      toast({ variant: "destructive", title: "Error", description: errorMessage }),

    [toast],
  );

  useEffect(() => {
    if (
      walletUser.isSignedIn &&
      !walletUser.isMetadataLoading &&
      walletUser.hasRegistrationSubmitted
    ) {
      router.push(routeSelectors.PROFILE_BY_ID(walletUser.accountId));
    }
  }, [
    router,
    walletUser.accountId,
    walletUser.hasRegistrationSubmitted,
    walletUser.isMetadataLoading,
    walletUser.isSignedIn,
  ]);

  return (
    <PageWithBanner className="items-center">
      <header
        className={cn(
          "flex w-full flex-col items-center gap-8 md:px-10 md:py-16",
          "2xl-rounded-lg bg-hero border-[#f8d3b0] px-5 py-12",
        )}
      >
        <h1 className="prose font-500 font-lora text-[32px] leading-[120%] md:text-[40px]">
          {!walletUser.hasRegistrationSubmitted && daoRegistrationProposal.isSubmitted
            ? "Awaiting registration proposal approval..."
            : "Register New Project"}
        </h1>

        <h2 className="prose max-w-[600px] text-center md:text-lg">
          {!walletUser.hasRegistrationSubmitted && daoRegistrationProposal.isSubmitted
            ? `Your DAO has one or more unresolved ${
                PLATFORM_NAME
              } registration proposals. Please come back once they are acted upon.`
            : `Create a profile for your project to receive donations \
                and qualify for funding rounds.`}
        </h2>
      </header>

      <ProfileConfigurationUserPanel
        mode="register"
        onSuccess={onRegistrationSuccess}
        onFailure={onRegistrationFailure}
        className="md:max-w-6xl"
      />
    </PageWithBanner>
  );
}
