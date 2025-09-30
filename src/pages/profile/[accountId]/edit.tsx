import { useCallback, useEffect } from "react";

import { useRouter } from "next/router";

import { PageWithBanner } from "@/common/ui/layout/components";
import { useToast } from "@/common/ui/layout/hooks";
import { useWalletUserSession } from "@/common/wallet";
import { ProfileConfigurationUserPanel } from "@/features/profile-configuration";
import { rootPathnames, routeSelectors } from "@/navigation";

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

    setTimeout(() => router.push(routeSelectors.PROFILE_BY_ID(accountId)), 3000);
  }, [accountId, router, toast]);

  const onProfileUpdateFailure = useCallback(
    (errorMessage: string) =>
      toast({ title: "Error", description: errorMessage, variant: "destructive" }),

    [toast],
  );

  useEffect(() => {
    if (walletUser.isSignedIn) {
      if (accountId !== walletUser.accountId) {
        toast({
          variant: "destructive",

          title:
            accountId === walletUser.signerAccountId
              ? `You cannot edit your own account in DAO Auth mode. \
                 Please turn off the DAO Auth mode and try again.`
              : `You are not signed in as ${accountId}.`,
        });

        router.push(routeSelectors.PROFILE_BY_ID(accountId));
      } else if (!walletUser.isMetadataLoading && !walletUser.hasRegistrationSubmitted) {
        router.push(rootPathnames.REGISTER);
      }
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
    walletUser.signerAccountId,
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
