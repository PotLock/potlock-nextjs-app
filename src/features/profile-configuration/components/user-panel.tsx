import { useMemo } from "react";

import { MdOutlineHourglassTop, MdOutlineInfo } from "react-icons/md";

import { NOOP_STRING } from "@/common/constants";
import { Alert, AlertDescription, AlertTitle } from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";
import { useWalletUserSession } from "@/common/wallet";
import { DaoRegistrationProposalBreakdown, useDaoRegistrationProposalStatus } from "@/entities/dao";

import { ProfileConfigurationEditor, type ProfileConfigurationEditorProps } from "./editor";

export type ProfileConfigurationUserPanelProps = Pick<
  ProfileConfigurationEditorProps,
  "mode" | "onSuccess" | "onFailure"
> & {
  className?: string;
};

export const ProfileConfigurationUserPanel: React.FC<ProfileConfigurationUserPanelProps> = ({
  mode: editorMode,
  onSuccess,
  onFailure,
  className,
}) => {
  const walletUser = useWalletUserSession();

  const daoRegistrationProposal = useDaoRegistrationProposalStatus({
    enabled: walletUser.isDaoRepresentative,
    accountId: walletUser.accountId ?? NOOP_STRING,
  });

  const isAccountMetadataLoading = useMemo(
    () => walletUser.isMetadataLoading || daoRegistrationProposal.isLoading,
    [daoRegistrationProposal.isLoading, walletUser.isMetadataLoading],
  );

  const noopMessage = useMemo(
    () => (
      <Alert className="w-full">
        {walletUser.hasWalletReady ? (
          <>
            <MdOutlineInfo className="color-neutral-400 h-6 w-6" />
            <AlertTitle>{"Not Signed In"}</AlertTitle>
            <AlertDescription>{"Please connect your wallet to continue"}</AlertDescription>
          </>
        ) : (
          <>
            <MdOutlineHourglassTop className="color-neutral-400 h-6 w-6" />
            <AlertTitle>{"Checking Account"}</AlertTitle>
            <AlertDescription>{"Please, wait..."}</AlertDescription>
          </>
        )}
      </Alert>
    ),

    [walletUser.hasWalletReady],
  );

  return (
    <section className={cn("flex w-full flex-col items-center py-4 md:py-8", className)}>
      {walletUser.hasWalletReady && walletUser.isSignedIn ? null : noopMessage}

      {walletUser.hasWalletReady && walletUser.isSignedIn && (
        <>
          {isAccountMetadataLoading ? (
            <Alert className="w-full">
              <MdOutlineHourglassTop className="color-neutral-400 h-6 w-6" />
              <AlertTitle>{"Checking Account"}</AlertTitle>
              <AlertDescription>{"Please, wait..."}</AlertDescription>
            </Alert>
          ) : (
            <>
              {editorMode === "register" &&
              !walletUser.hasRegistrationSubmitted &&
              daoRegistrationProposal.isSubmitted ? (
                <DaoRegistrationProposalBreakdown
                  daoAccountId={walletUser.accountId}
                  proposals={daoRegistrationProposal.entries ?? []}
                />
              ) : (
                <ProfileConfigurationEditor
                  mode={editorMode}
                  accountId={walletUser.accountId}
                  isDao={walletUser.isDaoRepresentative}
                  {...{ onSuccess, onFailure }}
                />
              )}
            </>
          )}
        </>
      )}
    </section>
  );
};
