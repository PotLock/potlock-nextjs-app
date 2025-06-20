import { useCallback, useEffect, useMemo } from "react";

import { useRouter } from "next/router";
import { MdOutlineHourglassTop, MdOutlineInfo } from "react-icons/md";

import { indexer } from "@/common/api/indexer";
import { NOOP_STRING, PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import { Alert, AlertDescription, AlertTitle, PageWithBanner } from "@/common/ui/layout/components";
import { useToast } from "@/common/ui/layout/hooks";
import { cn } from "@/common/ui/layout/utils";
import { useWalletUserSession } from "@/common/wallet";
import { ProfileSetupForm } from "@/features/profile-setup";
import { rootPathnames } from "@/pathnames";

export default function RegisterPage() {
  const viewer = useWalletUserSession();
  const router = useRouter();
  const { toast } = useToast();

  const {
    isLoading: isAccountListRegistrationDataLoading,
    data: listRegistrations,
    error: listRegistrationsError,
    mutate: refetchListRegistrations,
  } = indexer.useAccountListRegistrations({
    enabled: viewer.isSignedIn,
    accountId: viewer.accountId ?? NOOP_STRING,
  });

  const hasRegistrationSubmitted = useMemo(
    () =>
      !isAccountListRegistrationDataLoading &&
      listRegistrations !== undefined &&
      listRegistrations.results.find(({ list_id }) => list_id === PUBLIC_GOODS_REGISTRY_LIST_ID) !==
        undefined,

    [isAccountListRegistrationDataLoading, listRegistrations],
  );

  const onSuccess = useCallback(() => {
    toast({ title: "Success!", description: "You have successfully submitted your registration." });

    setTimeout(
      () =>
        refetchListRegistrations().finally(() =>
          router.push(`${rootPathnames.PROFILE}/${viewer.accountId}`),
        ),

      3000,
    );
  }, [refetchListRegistrations, router, toast, viewer.accountId]);

  const onFailure = useCallback(
    (errorMessage: string) => toast({ title: "Error", description: errorMessage }),
    [toast],
  );

  useEffect(() => {
    if (viewer.isSignedIn && !isAccountListRegistrationDataLoading && hasRegistrationSubmitted) {
      router.push(`${rootPathnames.PROFILE}/${viewer.accountId}`);
    }
  }, [
    hasRegistrationSubmitted,
    isAccountListRegistrationDataLoading,
    listRegistrations,
    router,
    viewer.accountId,
    viewer.isSignedIn,
  ]);

  return (
    <PageWithBanner>
      <section
        className={cn(
          "flex w-full flex-col items-center gap-8 md:px-10 md:py-16",
          "2xl-rounded-lg bg-hero border-[#f8d3b0] px-5 py-12",
        )}
      >
        <h1 className="prose font-500 font-lora text-[32px] leading-[120%] md:text-[40px]">
          {"Register New Project"}
        </h1>

        <h2 className="prose max-w-[600px] text-center md:text-lg">
          {"Create a profile for your project to receive donations and qualify for funding rounds."}
        </h2>
      </section>

      {viewer.hasWalletReady && viewer.isSignedIn ? (
        <>
          {listRegistrations === undefined &&
          listRegistrationsError === undefined &&
          isAccountListRegistrationDataLoading ? (
            <Alert className="mt-10">
              <MdOutlineHourglassTop className="color-neutral-400 h-6 w-6" />
              <AlertTitle>{"Checking Account"}</AlertTitle>
              <AlertDescription>{"Please, wait..."}</AlertDescription>
            </Alert>
          ) : (
            <ProfileSetupForm
              mode="register"
              accountId={viewer.accountId}
              isDaoRepresentative={viewer.isDaoRepresentative}
              {...{ onSuccess, onFailure }}
            />
          )}
        </>
      ) : (
        <>
          {viewer.hasWalletReady ? (
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
          )}
        </>
      )}
    </PageWithBanner>
  );
}
