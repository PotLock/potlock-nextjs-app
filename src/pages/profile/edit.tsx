import { useEffect, useMemo } from "react";

import { useRouter } from "next/router";

import { indexer } from "@/common/api/indexer";
import { PUBLIC_GOODS_REGISTRY_LIST_ID } from "@/common/constants";
import { PageWithBanner } from "@/common/ui/components";
import InfoSegment from "@/common/ui/components/_deprecated/InfoSegment";
import { cn } from "@/common/ui/utils";
import { useSession } from "@/entities/_shared/session";
import { ProfileSetupForm } from "@/features/profile-setup";
import { rootPathnames } from "@/pathnames";

export default function EditProjectPage() {
  const router = useRouter();
  const viewer = useSession();

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

      {listRegistrations === undefined ? (
        <InfoSegment title="Checking account" description="Please, wait..." />
      ) : (
        <>
          {viewer.isSignedIn ? (
            <ProfileSetupForm mode="update" accountId={viewer.accountId} />
          ) : (
            <InfoSegment title="Not logged in!" description="You must log in first!" />
          )}
        </>
      )}
    </PageWithBanner>
  );
}
