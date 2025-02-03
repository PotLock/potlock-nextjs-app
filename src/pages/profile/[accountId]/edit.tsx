import { useCallback, useEffect, useMemo } from "react";

import { useRouter } from "next/router";
import { MdOutlineHourglassTop, MdOutlineInfo } from "react-icons/md";

import { indexer } from "@/common/api/indexer";
import { PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import { Alert, AlertDescription, AlertTitle, PageWithBanner } from "@/common/ui/components";
import { useToast } from "@/common/ui/hooks";
import { cn } from "@/common/ui/utils";
import { useWalletUserSession } from "@/common/wallet";
import { ProfileSetupForm } from "@/features/profile-setup";
import { rootPathnames } from "@/pathnames";

export default function EditProjectPage() {
  const router = useRouter();
  const { accountId } = router.query as { accountId: string };
  const viewer = useWalletUserSession();
  const { toast } = useToast();

  const isOwner = useMemo(
    () => viewer.hasWalletReady && viewer.isSignedIn && accountId === viewer.accountId,
    [accountId, viewer.accountId, viewer.hasWalletReady, viewer.isSignedIn],
  );

  const { isLoading: isAccountListRegistrationDataLoading, data: listRegistrations } =
    indexer.useAccountListRegistrations({
      enabled: viewer.hasWalletReady && isOwner,
      accountId: viewer.accountId ?? "noop",
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
    setTimeout(() => router.push(`${rootPathnames.PROFILE}/${viewer.accountId}`), 3000);

    toast({
      title: "Success!",
      description: "You have successfully updated your profile.",
    });
  }, [router, toast, viewer.accountId]);

  const onFailure = useCallback(
    (errorMessage: string) => toast({ title: "Error", description: errorMessage }),
    [toast],
  );

  useEffect(() => {
    if (viewer.isSignedIn && !isAccountListRegistrationDataLoading && !hasRegistrationSubmitted) {
      router.push(rootPathnames.REGISTER);
    }

    if (viewer.hasWalletReady && viewer.isSignedIn && !isOwner) {
      toast({ variant: "destructive", title: `You are not the owner of ${accountId}.` });
      router.push(`${rootPathnames.PROFILE}/${accountId}`);
    }
  }, [
    accountId,
    hasRegistrationSubmitted,
    isAccountListRegistrationDataLoading,
    isOwner,
    listRegistrations,
    router,
    toast,
    viewer.accountId,
    viewer.hasWalletReady,
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
          {"Edit Project"}
        </h1>

        <h2 className="prose max-w-[600px] text-center md:text-lg">
          {"Create a profile for your project to receive donations and qualify for funding rounds."}
        </h2>
      </section>

      {viewer.hasWalletReady && viewer.isSignedIn ? (
        <>
          {listRegistrations === undefined ? (
            <Alert className="mt-10">
              <MdOutlineHourglassTop className="color-neutral-400 h-6 w-6" />
              <AlertTitle>{"Checking Account"}</AlertTitle>
              <AlertDescription>{"Please, wait..."}</AlertDescription>
            </Alert>
          ) : (
            <ProfileSetupForm
              mode="update"
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
