import { useMemo } from "react";

import { MdOutlineHourglassTop, MdOutlineInfo } from "react-icons/md";

import {
  LISTS_CONTRACT_ACCOUNT_ID,
  PLATFORM_NAME,
  SOCIAL_DB_CONTRACT_ACCOUNT_ID,
} from "@/common/_config";
import { NOOP_STRING } from "@/common/constants";
import { ProposalStatus, sputnikDaoHooks } from "@/common/contracts/sputnikdao2";
import { Alert, AlertDescription, AlertTitle } from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";
import { useWalletUserSession } from "@/common/wallet";

import { ProfileConfigurationDaoProposalOverview } from "./dao-proposal-overview";
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

  const isAccountMetadataLoading = useMemo(
    () =>
      walletUser.isMetadataLoading ||
      (recentDaoProposals === undefined && isRecentDaoProposalListLoading),

    [isRecentDaoProposalListLoading, recentDaoProposals, walletUser.isMetadataLoading],
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
              {isDaoRegistrationApprovalPending ? (
                <ProfileConfigurationDaoProposalOverview
                  daoAccountId={walletUser.accountId}
                  proposals={unresolvedDaoRegistrationProposals}
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
