import { useMemo } from "react";

import { nearSocialIndexerHooks } from "@/common/api/near-social-indexer";
import { socialDbContractClient } from "@/common/contracts/social-db";
import type { ByAccountId } from "@/common/types";
import { Button, Skeleton } from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";
import { useWalletUserSession } from "@/common/wallet";

export type AccountFollowButtonProps = ByAccountId & {
  className?: string;
};

export const AccountFollowButton: React.FC<AccountFollowButtonProps> = ({
  accountId,
  className,
}) => {
  const viewer = useWalletUserSession();

  const {
    isLoading: isFollowerListLoading,
    isValidating: isFollowerListRevalidating,
    data: followerAccountIds,
    mutate: refetchFollowerAccountIds,
  } = nearSocialIndexerHooks.useFollowerAccountIds({ accountId });

  const {
    isValidating: isFollowListRevalidating,
    data: followedAccountIds,
    mutate: refetchFollowedAccountIds,
  } = nearSocialIndexerHooks.useFollowedAccountIds({ accountId });

  const isSocialIndexRevalidating = isFollowerListRevalidating || isFollowListRevalidating;

  const isFollowedByViewer = useMemo(
    () => (viewer.isSignedIn ? (followerAccountIds?.includes(viewer.accountId) ?? false) : false),
    [followerAccountIds, viewer.accountId, viewer.isSignedIn],
  );

  const isFollowingViewer = useMemo(
    () => (viewer.isSignedIn ? (followedAccountIds?.includes(viewer.accountId) ?? false) : false),
    [followedAccountIds, viewer.accountId, viewer.isSignedIn],
  );

  const actionLabel = useMemo(() => {
    if (isFollowedByViewer) {
      return "Unfollow";
    } else if (isFollowingViewer) {
      return "Follow back";
    } else {
      return "Follow";
    }
  }, [isFollowedByViewer, isFollowingViewer]);

  const handleFollow = () => {
    if (viewer.isSignedIn) {
      const requestType = isFollowedByViewer ? "unfollow" : "follow";

      socialDbContractClient
        .setSocialData({
          data: {
            [viewer.accountId]: {
              graph: { follow: { [accountId]: isFollowedByViewer ? null : "" } },

              index: {
                graph: JSON.stringify({ key: "follow", value: { type: requestType, accountId } }),
                notify: JSON.stringify({ key: accountId, value: { type: requestType } }),
              },
            },
          },
        })
        .then(() => {
          refetchFollowerAccountIds();
          refetchFollowedAccountIds();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return !viewer.isSignedIn || viewer.accountId === accountId ? null : (
    <>
      {followerAccountIds === undefined && isFollowerListLoading ? (
        <Skeleton className="h-10 w-40" />
      ) : (
        <Button
          variant="brand-outline"
          onClick={handleFollow}
          disabled={isSocialIndexRevalidating}
          className={cn("hover:text-foreground font-600 hover:bg-[#dd3345]", className)}
        >
          {actionLabel}
        </Button>
      )}
    </>
  );
};
