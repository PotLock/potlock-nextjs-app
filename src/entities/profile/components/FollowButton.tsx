import { useEffect, useState } from "react";

import { getSocialData, setSocialData } from "@/common/contracts/social";
import { Button } from "@/common/ui/components";
import useWallet from "@/entities/session/hooks/wallet";

type Props = {
  accountId: string;
  className?: string;
};

const FollowButton = ({ accountId, className }: Props) => {
  const { wallet } = useWallet();

  const [followEdge, setFollowEdge] = useState<Record<string, any>>();
  const [inverseEdge, setInverseEdge] = useState<Record<string, any>>();

  useEffect(() => {
    (async () => {
      if (wallet?.accountId) {
        const _followEdge = await getSocialData<Record<string, any>>({
          path: `${wallet.accountId}/graph/follow/${accountId}`,
        });
        setFollowEdge(_followEdge);

        const _inverseEdge = await getSocialData<Record<string, any>>({
          path: `${accountId}/graph/follow/${wallet.accountId}`,
        });
        setInverseEdge(_inverseEdge);
      }
    })();
  }, [wallet?.accountId, accountId]);

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

  if (!accountId || !wallet?.accountId || wallet.accountId === accountId) {
    return "";
  }

  const onClickHandler = async () => {
    if (wallet.accountId && buttonText !== "Following") {
      setUpdating(true);
      await setSocialData({
        data: {
          [wallet.accountId]: data,
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
      // font-600 is not working
      style={{ fontWeight: 600 }}
      disabled={updating || buttonText === "Following"}
      onClick={onClickHandler}
    >
      {updating ? "Loading..." : buttonText}
    </Button>
  );
};

export default FollowButton;
