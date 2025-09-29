import { useCallback, useEffect } from "react";

import { useRouter } from "next/router";

import { PageWithBanner } from "@/common/ui/layout/components";
import { useToast } from "@/common/ui/layout/hooks";
import { useWalletUserSession } from "@/common/wallet";
import { ProfileConfigurationUserPanel } from "@/features/profile-configuration";
import { rootPathnames, routeSelectors } from "@/pathnames";

export default function EditProjectPage() {
  const router = useRouter();
  const { accountId } = router.query as { accountId: string };
  const walletUser = useWalletUserSession();
  const { toast } = useToast();

  const onProfileUpdateSuccess = useCallback(() => {
    toast({
      title: "Success!",
      description: "You have successfully updated your profile.",
    });

    if (walletUser.isSignedIn) {
      setTimeout(() => router.push(routeSelectors.PROFILE_BY_ID(walletUser.accountId)), 3000);
    }
  }, [router, toast, walletUser.accountId, walletUser.isSignedIn]);

  const onProfileUpdateFailure = useCallback(
    (errorMessage: string) => toast({ title: "Error", description: errorMessage }),
    [toast],
  );

  useEffect(() => {
    if (walletUser.hasWalletReady && walletUser.isSignedIn && accountId !== walletUser.accountId) {
      toast({ variant: "destructive", title: `You are not the owner of ${accountId}.` });
      router.push(routeSelectors.PROFILE_BY_ID(accountId));
    } else if (
      walletUser.isSignedIn &&
      !walletUser.isMetadataLoading &&
      !walletUser.hasRegistrationSubmitted
    ) {
      router.push(rootPathnames.REGISTER);
    }
  }, [
    accountId,
    router,
    toast,
    walletUser.accountId,
    walletUser.hasRegistrationSubmitted,
    walletUser.hasWalletReady,
    walletUser.isMetadataLoading,
    walletUser.isSignedIn,
  ]);

  return (
    <PageWithBanner className="items-center">
      <ProfileConfigurationUserPanel
        mode="update"
        onSuccess={onProfileUpdateSuccess}
        onFailure={onProfileUpdateFailure}
        className="max-w-5xl"
      />
    </PageWithBanner>
  );
}
