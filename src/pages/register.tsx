import { useCallback, useEffect, useMemo } from "react";

import { useRouter } from "next/router";
import { MdOutlineHourglassTop, MdOutlineInfo } from "react-icons/md";

import {
  LISTS_CONTRACT_ACCOUNT_ID,
  PLATFORM_NAME,
  SOCIAL_DB_CONTRACT_ACCOUNT_ID,
} from "@/common/_config";
import { indexer } from "@/common/api/indexer";
import { NOOP_STRING, PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import { ProposalStatus, sputnikDaoHooks } from "@/common/contracts/sputnikdao2";
import { Alert, AlertDescription, AlertTitle, PageWithBanner } from "@/common/ui/layout/components";
import { useToast } from "@/common/ui/layout/hooks";
import { cn } from "@/common/ui/layout/utils";
import { useWalletUserSession } from "@/common/wallet";
import { DaoRegistrationPendingStatus } from "@/entities/dao";
import { ProfileEditor } from "@/features/profile-configuration";
import { rootPathnames, routeSelectors } from "@/pathnames";

export default function RegisterPage() {
  const walletUser = useWalletUserSession();
  const router = useRouter();
  const { toast } = useToast();

  const {
    isLoading: isAccountListRegistrationDataLoading,
    data: listRegistrations,
    error: listRegistrationsError,
    mutate: refetchListRegistrations,
  } = indexer.useAccountListRegistrations({
    enabled: walletUser.isSignedIn,
    accountId: walletUser.accountId ?? NOOP_STRING,
  });

  const hasRegistrationSubmitted = useMemo(
    () =>
      !isAccountListRegistrationDataLoading &&
      listRegistrations !== undefined &&
      listRegistrations.results.some(({ list_id }) => list_id === PUBLIC_GOODS_REGISTRY_LIST_ID),

    [isAccountListRegistrationDataLoading, listRegistrations],
  );

  const {
    isLoading: isRecentDaoProposalListLoading,
    data: recentDaoProposals,
    mutate: refetchRecentDaoProposals,
  } = sputnikDaoHooks.useProposals({
    enabled: walletUser.isDaoRepresentative,
    accountId: walletUser.accountId ?? NOOP_STRING,
    from_index: 0,
    limit: 10,
  });

  const unresolvedDaoRegistrationProposals = useMemo(
    () =>
      recentDaoProposals?.filter(({ description, kind, status }) => {
        if (
          typeof kind === "object" &&
          "FunctionCall" in kind &&
          status === ProposalStatus.InProgress
        ) {
          const { receiver_id, actions } = kind.FunctionCall;

          return (
            (receiver_id === LISTS_CONTRACT_ACCOUNT_ID &&
              actions.some(({ method_name }) => method_name === "register_batch")) ||
            (receiver_id === SOCIAL_DB_CONTRACT_ACCOUNT_ID && description.includes(PLATFORM_NAME))
          );
        } else return false;
      }) ?? [],

    [recentDaoProposals],
  );

  const isDaoRegistrationApprovalPending = useMemo(
    () => unresolvedDaoRegistrationProposals.length > 0,
    [unresolvedDaoRegistrationProposals.length],
  );

  const onSuccess = useCallback(() => {
    toast({ title: "Success!", description: "You have successfully submitted your registration." });

    if (walletUser.isSignedIn) {
      if (walletUser.isDaoRepresentative) {
        refetchRecentDaoProposals();
      } else {
        setTimeout(
          () =>
            refetchListRegistrations().finally(() =>
              router.push(routeSelectors.PROFILE_BY_ID(walletUser.accountId)),
            ),

          2500,
        );
      }
    }
  }, [
    refetchListRegistrations,
    refetchRecentDaoProposals,
    router,
    toast,
    walletUser.accountId,
    walletUser.isDaoRepresentative,
    walletUser.isSignedIn,
  ]);

  const onFailure = useCallback(
    (errorMessage: string) =>
      toast({ variant: "destructive", title: "Error", description: errorMessage }),

    [toast],
  );

  useEffect(() => {
    if (
      walletUser.isSignedIn &&
      !isAccountListRegistrationDataLoading &&
      hasRegistrationSubmitted
    ) {
      router.push(`${rootPathnames.PROFILE}/${walletUser.accountId}`);
    }
  }, [
    hasRegistrationSubmitted,
    isAccountListRegistrationDataLoading,
    listRegistrations,
    router,
    walletUser.accountId,
    walletUser.isSignedIn,
  ]);

  const noopMessage = useMemo(
    () =>
      walletUser.hasWalletReady ? (
        <Alert variant="destructive" className="mt-10">
          <MdOutlineInfo className="color-neutral-400 h-6 w-6" />
          <AlertTitle>{"Not Signed In"}</AlertTitle>
          <AlertDescription>{"Please connect your wallet to continue"}</AlertDescription>
        </Alert>
      ) : (
        <Alert className="mt-10">
          <MdOutlineHourglassTop className="color-neutral-400 h-6 w-6" />
          <AlertTitle>{"Checking Account"}</AlertTitle>
          <AlertDescription>{"Please, wait..."}</AlertDescription>
        </Alert>
      ),

    [walletUser.hasWalletReady],
  );

  return (
    <PageWithBanner>
      <section
        className={cn(
          "flex w-full flex-col items-center gap-8 md:px-10 md:py-16",
          "2xl-rounded-lg bg-hero border-[#f8d3b0] px-5 py-12",
        )}
      >
        <h1 className="prose font-500 font-lora text-[32px] leading-[120%] md:text-[40px]">
          {isDaoRegistrationApprovalPending
            ? "Awaiting registration approval..."
            : "Register New Project"}
        </h1>

        <h2 className="prose max-w-[600px] text-center md:text-lg">
          {isDaoRegistrationApprovalPending
            ? `Your DAO has one or more unresolved ${
                PLATFORM_NAME
              } registration proposals. Please come back once they are acted upon.`
            : `Create a profile for your project to receive donations \
                and qualify for funding rounds.`}
        </h2>
      </section>

      {walletUser.hasWalletReady && walletUser.isSignedIn ? (
        <>
          {(listRegistrations === undefined &&
            listRegistrationsError === undefined &&
            isAccountListRegistrationDataLoading) ||
          (recentDaoProposals === undefined && isRecentDaoProposalListLoading) ? (
            <Alert className="mt-10">
              <MdOutlineHourglassTop className="color-neutral-400 h-6 w-6" />
              <AlertTitle>{"Checking Account"}</AlertTitle>
              <AlertDescription>{"Please, wait..."}</AlertDescription>
            </Alert>
          ) : (
            <>
              {isDaoRegistrationApprovalPending ? (
                <DaoRegistrationPendingStatus
                  daoAccountId={walletUser.accountId}
                  proposals={unresolvedDaoRegistrationProposals}
                />
              ) : (
                <ProfileEditor
                  mode="register"
                  accountId={walletUser.accountId}
                  isDao={walletUser.isDaoRepresentative}
                  {...{ onSuccess, onFailure }}
                />
              )}
            </>
          )}
        </>
      ) : (
        noopMessage
      )}
    </PageWithBanner>
  );
}
