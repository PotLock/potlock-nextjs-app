import { useEffect, useState } from "react";

import { socialDbContractClient } from "@/common/contracts/social";
import type { ByAccountId } from "@/common/types";
import { Button } from "@/common/ui/components";
import { useViewerSession } from "@/common/viewer";

export type AccountFollowButtonProps = ByAccountId & {
  className?: string;
};

export const AccountFollowButton: React.FC<AccountFollowButtonProps> = ({
  accountId,
  className,
}) => {
  const viewer = useViewerSession();
  const [followEdge, setFollowEdge] = useState<Record<string, any>>();
  const [inverseEdge, setInverseEdge] = useState<Record<string, any>>();

  useEffect(() => {
    (async () => {
      if (viewer.accountId) {
        const _followEdge = await socialDbContractClient.getSocialData<Record<string, any>>({
          path: `${viewer.accountId}/graph/follow/${accountId}`,
        });

        setFollowEdge(_followEdge);

        const _inverseEdge = await socialDbContractClient.getSocialData<Record<string, any>>({
          path: `${accountId}/graph/follow/${viewer.accountId}`,
        });

        setInverseEdge(_inverseEdge);
      }
    })();
  }, [viewer.accountId, accountId]);

  // const loading = followEdge === undefined || inverseEdge === undefined;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(!followEdge || !inverseEdge);
  }, [followEdge, inverseEdge]);

  const follow = followEdge && Object.keys(followEdge).length;
  const inverse = inverseEdge && Object.keys(inverseEdge).length;
  const type = follow ? "unfollow" : "follow";

  const data = {
    graph: { follow: { [accountId]: follow ? null : "" } },
    index: {
      graph: JSON.stringify({
        key: "follow",
        value: {
          type,
          accountId: accountId,
        },
      }),
      notify: JSON.stringify({
        key: accountId,
        value: {
          type,
        },
      }),
    },
  };

  const [buttonText, setButtonText] = useState("Loading");

  useEffect(() => {
    const _buttonText = loading
      ? "Loading"
      : follow
        ? "Following"
        : inverse
          ? "Follow back"
          : "Follow";

    setButtonText(_buttonText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const [updating, setUpdating] = useState(false);

  if (!accountId || !viewer?.accountId || viewer.accountId === accountId) {
    return "";
  }

  const onClickHandler = async () => {
    if (viewer.accountId && buttonText !== "Following") {
      setUpdating(true);

      await socialDbContractClient.setSocialData({
        data: {
          [viewer.accountId]: data,
        },
      });

      setButtonText("Following");
      setUpdating(false);
    }
  };

  return (
    <Button
      variant="brand-outline"
      className={`hover:bg-[#dd3345] hover:text-white ${className}`}
      style={{ fontWeight: 600 }}
      disabled={updating || buttonText === "Following"}
      onClick={onClickHandler}
    >
      {updating ? "Loading..." : buttonText}
    </Button>
  );
};
