import { useCallback, useEffect, useMemo } from "react";

import Link from "next/link";
import { useRouter } from "next/router";
import { MdOutlineInfo } from "react-icons/md";

import { indexer } from "@/common/api/indexer";
import { PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  PageWithBanner,
} from "@/common/ui/components";
import InfoSegment from "@/common/ui/components/_deprecated/InfoSegment";
import { useToast } from "@/common/ui/hooks";
import { cn } from "@/common/ui/utils";
import { useWalletUserSession } from "@/common/wallet";
import { ProfileSetupForm } from "@/features/profile-setup";
import { rootPathnames } from "@/pathnames";

export default function EditProjectPage() {
  const router = useRouter();
  // const { accountId } = router.query as { accountId: AccountId };
  const viewer = useWalletUserSession();
  const { toast } = useToast();

  const { isLoading: isAccountListRegistrationDataLoading, data: listRegistrations } =
    indexer.useAccountListRegistrations({
      enabled: viewer.isSignedIn,
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
  }, [
    hasRegistrationSubmitted,
    isAccountListRegistrationDataLoading,
    listRegistrations,
    router,
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

      {viewer.isSignedIn ? (
        <>
          {listRegistrations === undefined ? (
            <InfoSegment title="Checking account" description="Please, wait..." />
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
        <Alert variant="destructive" className="mt-10">
          <MdOutlineInfo className="color-neutral-400 h-6 w-6" />
          <AlertTitle>{"Not logged in"}</AlertTitle>
          <AlertDescription>{"Please connect your wallet to continue"}</AlertDescription>
        </Alert>
      )}
    </PageWithBanner>
  );
}
